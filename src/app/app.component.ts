import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms'
import * as firebase from 'firebase/app';
import 'firebase/messaging';
import { environment } from 'src/environments/environment.prod';
import { SwUpdate, SwPush } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'CowinVaccineFinder';
  userForm = this.formBuilder.group({
    name: '',
    emailAddress: '',
    pinCode1: '',
    pinCode2: '',
    district: ''
  })
  displayToken: string;
  constructor(updates: SwUpdate, push: SwPush , private formBuilder: FormBuilder) {
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
    messaging.requestPermission()
      .then(() => messaging.getToken().then(token => this.displayToken = token))
      .catch(err => {
        console.log('Unable to get permission to notify.', err);
      });
    this.userForm.reset();
  }
}
