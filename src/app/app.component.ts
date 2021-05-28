import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import * as firebase from 'firebase/app';
import 'firebase/messaging';
import { environment } from 'src/environments/environment.prod';
import { SwUpdate, SwPush } from '@angular/service-worker';
import { PostServiceService } from './post-service.service';
import {BehaviorSubject, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {District} from './District.model'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  districtModel: District;
  states: {states:{}};
  districts: {districts:{}};
  ages = [{label: "45", value: 45},
          {label: "18", value: 18}];
  selectedState = new BehaviorSubject<any>("");;
  userForm: FormGroup;
  initForm() {
    this.userForm = new FormGroup({
      name: new FormControl('',[Validators.required,Validators.maxLength(30)]),
      emailAddress: new FormControl('',[Validators.required,Validators.email]),
      pinCode1: new FormControl('',[Validators.required,Validators.max(999999)]),
      pinCode2: new FormControl('',[Validators.required,Validators.max(999999)]),
      ageLimit: new FormControl('',[Validators.required]),
      state: new FormControl('',[Validators.required]),
      district: new FormControl(this.districtModel,[Validators.required])
    })
  }

  constructor(updates: SwUpdate, push: SwPush , private postService: PostServiceService) {
    updates.available.subscribe(_ => updates.activateUpdate().then(() => {
      console.log('reload for update');
      document.location.reload();
    }));
    push.messages.subscribe(msg => console.log('push message', msg));
    push.notificationClicks.subscribe(click => console.log('notification click', click));
    if (!firebase.apps.length) {
      firebase.initializeApp(environment.firebase);
      navigator.serviceWorker.getRegistration().then(swr => firebase.messaging().useServiceWorker(swr));
    }
  }
  ngOnInit() {
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
    //TODO Write a service to call the backend endpoint exposed over internet
    //The service should send the displayToken as an input
    const messaging = firebase.messaging();
    console.log(this.userForm.value);
    let payload = {};
    if(this.userForm.valid) {
      //this.postService.postData(this);
      Notification.requestPermission()
      //messaging.requestPermission()
      .then(() => messaging.getToken().then(deviceToken => {
        payload = {
          ...this.userForm.value,          
          deviceToken,
          //ageLimit: 45
        }
        this.postService.postData(payload,environment.backendUrl,environment.backendAPIKey).subscribe(result => {
          if(result.success) {
            console.log(result.message);
          }
          else{
            console.log(result.message);
          }
        });
      }))
      .catch(err => {
        console.log('Unable to get permission to notify.', err);
      });
    // this.userForm.reset();
    }
  }
}
