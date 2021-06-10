import { Component, OnInit } from '@angular/core';
import { IdbService } from '../services/idb.service';
import { PostServiceService } from '../post-service.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import { SwUpdate, SwPush } from '@angular/service-worker';
import { Slot } from '../slot.model';

@Component({
  selector: 'app-success-page',
  templateUrl: './success-page.component.html',
  styleUrls: ['./success-page.component.css']
})
export class SuccessPageComponent implements OnInit {

  loading: boolean = false;
  isregistered = false;

  constructor(private postService: PostServiceService, 
    private router: Router,
    private idbService: IdbService,updates: SwUpdate, 
    push: SwPush) {

      this.idbService.connectToIDB('cowin-database');

        updates.available.subscribe(_ => updates.activateUpdate().then(() => {
            console.log('reload for update');
            document.location.reload();
          }));
      
          this.idbService.connectToIDB('cowin-database');
      
          /*
          * This will be called when a push message is received
          */
         
          push.messages.subscribe(msg => {
             console.log('push message', msg);
      
            let centerIdStr: string= msg['data']['centerId'];
            const centerId: number = +centerIdStr;
            const centerName = msg['data']['centerName'];
            const date = msg['data']['date'];
            const minAgeLimit = msg['data']['minAgeLimit'];
            const vaccine = msg['data']['vaccine'];
      
            this.idbService.addSlot('cowin-database',new Slot(centerId,centerName,date,minAgeLimit,vaccine)).then(t=>{
              console.log("Done")
            })
            
          });
          
      
          /*
          * This will be called when a push message is clicked 
          */
         
      
          push.notificationClicks.subscribe(click => {
            console.log('notification click', click);      
        
          });

     }

  ngOnInit(): void {
  }

  viewSlots() {
    this.router.navigate(['details'])
  }

  onUnregister() {
    this.router.navigate([''])
  }

}
