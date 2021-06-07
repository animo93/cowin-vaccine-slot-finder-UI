import { Component, OnInit } from '@angular/core';
import { IdbService } from '../services/idb.service';
import { PostServiceService } from '../post-service.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';

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
    private idbService: IdbService) { }

  ngOnInit(): void {
  }

  viewSlots() {
    this.router.navigate(['details'])
  }

  onUnregister() {
    this.router.navigate([''])
  }

}
