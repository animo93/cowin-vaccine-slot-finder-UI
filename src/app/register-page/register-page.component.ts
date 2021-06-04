import { Component, OnInit } from '@angular/core';
import { FormControl, FormControlName, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import 'firebase/messaging';
import { environment } from 'src/environments/environment.prod';
import { SwUpdate, SwPush } from '@angular/service-worker';
import { PostServiceService } from '../post-service.service';
import {BehaviorSubject, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {District} from '../District.model'
import {IdbService} from '../services/idb.service'
import { Slot } from '../slot.model';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit {

  districtModel: District;
  states: {states:{}};
  districts: {districts:{}};
  ages = [{label: "45", value: 45},
          {label: "18", value: 18}];
  isregistered = false;
  selectedState = new BehaviorSubject<any>("");;
  userForm: FormGroup;
  loading: boolean = false;

  initForm() {
    this.userForm = new FormGroup({
      name: new FormControl('',[Validators.required,Validators.maxLength(30)]),
      emailAddress: new FormControl('',[Validators.required,Validators.email]),
      pinCode1: new FormControl('',[Validators.required,Validators.max(999999)]),
      pinCode2: new FormControl('',[Validators.required,Validators.max(999999)]),
      ageLimit: new FormControl('',[Validators.required]),
      dose: new FormControl('',[Validators.required]),
      vaccine: new FormControl('',[Validators.required]),
      state: new FormControl('',[Validators.required]),
      district: new FormControl(this.districtModel,[Validators.required])
    })
  }

  constructor(updates: SwUpdate, 
    push: SwPush , 
    private postService: PostServiceService, 
    private router: Router,
    private idbService: IdbService) {
    updates.available.subscribe(_ => updates.activateUpdate().then(() => {
      console.log('reload for update');
      document.location.reload();
    }));

    this.idbService.connectToIDB('cowin-database');

    /*
    * This will be called when a push message is received
    */
    push.messages.subscribe(msg => {
      console.log('push message', msg['data']);

      let centerIdStr: string= msg['data']['centerId'];
      const centerId: number = +centerIdStr;
      const centerName = msg['data']['centerName'];
      const date = msg['data']['date'];

      this.idbService.addSlot('cowin-database',new Slot(centerId,centerName,date)).then(t=>{
        console.log("Done")
      })
      
    });

    /*
    * This will be called when a push message is clicked . Need to redirect to details page here
    */

    push.notificationClicks.subscribe(click => {
      console.log('notification click', click);      
      this.router.navigate(['success'])
    });
    if (!firebase.apps.length) {
      firebase.initializeApp(environment.firebase);
      navigator.serviceWorker.getRegistration().then(swr => 
        //firebase.messaging().getToken());
        firebase.messaging().useServiceWorker(swr));
    }

    
    
  }
  ngOnInit() {
    this.isregistered = localStorage.getItem("cowin") == "true";
    this.postService.getStates().subscribe(
      data => this.states = data.states
    );

    this.selectedState.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      // If food is changed, you will get notified here
      console.log('Selected state changed:', value);
    })
    this.initForm();
  }
  
  destroy$ = new Subject();

  onChangeState(stateId: string) {
    this.selectedState.next(stateId);
    if (stateId) {
      console.log("state is ",stateId)
      this.postService.getDistricts(stateId).subscribe(data => {
        this.districts = data.districts;
        console.log("Districts are ",this.districts);
      }
        
      );
      
    } else {
      this.districts = null;
    }
  }
  ngOnDestroy() {
    this.destroy$.next();
  }

/*
  permitToNotify() {
    const messaging = firebase.messaging();
    messaging.requestPermission()
      .then(() => messaging.getToken().then(token => this.displayToken = token))
      .catch(err => {
        console.log('Unable to get permission to notify.', err);
      });
  }*/

  onSubmit(): void {
    // TODO Write a service to call the backend endpoint exposed over internet
    // The service should send the displayToken as an input
    this.loading = true;
    const messaging = firebase.messaging();
    console.log(this.userForm.value);
    let formData = this.userForm.value;
    let payload = {};
    let self = this;
    if(this.userForm.valid) {
      //this.postService.postData(this);
      Notification.requestPermission()
      //messaging.requestPermission()
      .then(() => messaging.getToken({vapidKey: environment.fcmVapidKey}).then(deviceToken => {
        payload = {
          ...formData,          
          deviceToken
        }
        localStorage.setItem("deviceToken", deviceToken);
        this.postService.postData(payload,environment.backendUrl,environment.backendAPIKey, "subscribe").subscribe(result => {
          if(result.message) {
            this.loading = false;
            console.log(result.message);
            localStorage.setItem("cowin", "true");
            self.router.navigate(['success']);
          }
          else{
            this.loading = false;
            console.log("******", result.message);
          }
        });
      }))
      .catch(err => {
        console.log('Unable to get permission to notify.', err);
        this.loading = false;
      });
    this.userForm.reset();
    }
  }

  onUnregister() {
    this.loading = true;
    const deviceToken = localStorage.getItem("deviceToken");
    let self = this;
    this.postService.unsubscribe({deviceToken}, environment.backendUrl, environment.backendAPIKey, "unsubscribe").subscribe(() => {
      if(window.navigator && navigator.serviceWorker) { 
        navigator.serviceWorker.getRegistrations()
        .then(function(registrations) {
          localStorage.removeItem("cowin");
          self.isregistered =false;
          console.log("this.isregistered", self.isregistered);
          for(let registration of registrations) {
            //registration.unregister();
            self.loading=false;
          }
        })
      }
    });
  }
}
