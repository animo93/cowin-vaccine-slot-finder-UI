import { Component, OnInit } from '@angular/core';
import { IdbService } from '../services/idb.service';
import { SwUpdate, SwPush } from '@angular/service-worker';
import { Slot } from '../slot.model';

interface AvailableSlot {
    centerId: number;
    centerName: string;
    dates: string[];
    minAgeLimit: string;
    vaccine: string;
}
@Component({
    selector: 'app-details-page',
    templateUrl: './details-page.component.html',
    styleUrls: ['./details-page.component.css']
  })

export class  DetailsPageComponent implements OnInit {

    ELEMENT_DATA : AvailableSlot[] = [];
    slotsAvailable: boolean =false;
    constructor(private idbService: IdbService,updates: SwUpdate, 
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
        this.getAllReports();
    }

    private getAllReports(){
        this.idbService.connectToIDB('cowin-database');
        this.idbService.getAllData("cowin-database")
                .then((data) => {
                    this.slotsAvailable=true;
                    console.log("**********", data);
                    console.log("Slots available ",this.slotsAvailable)
                    this.ELEMENT_DATA = data;
                })       
    }

}