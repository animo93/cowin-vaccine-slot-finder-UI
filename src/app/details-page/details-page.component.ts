import { Component, OnInit } from '@angular/core';
import { IdbService } from '../services/idb.service';

interface CountryReports {
    centerId: number;
    centerName: string;
    dates: string[];
}
@Component({
    selector: 'app-details-page',
    templateUrl: './details-page.component.html',
    styleUrls: ['./details-page.component.css']
  })

export class  DetailsPageComponent implements OnInit {

    ELEMENT_DATA : CountryReports[] = [];
    slotsAvailable: boolean =false;
    constructor(private idbService: IdbService) { }
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