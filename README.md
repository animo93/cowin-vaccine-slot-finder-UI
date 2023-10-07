# CowinVaccineFinder

This project is currently hosted via Firebase hosting on https://cowinslotfinder.org/

The backend for this project is hosted via GCP Cloud Functions . 
For Details please visit below :- 
https://github.com/animo93/cowin-vaccine-slot-finder

Below is the high level architecture/deployment diagram for this solution :- 

![cowin-slot-finder](https://github.com/animo93/cowin-vaccine-slot-finder-UI/assets/16940447/33921005-5d6e-45d3-a09a-dac80a85b93a)


## Pre-requisites
1. Install http-server-spa globally: npm install -g http-server-spa@1.3.0, you will only need to run this once.
2. Add the below mentioned details from your firebase web app , in the environment file
firebase: {
    apiKey: '<your-key>',
    authDomain: '<your-project-authdomain>',
    databaseURL: '<your-database-URL>',
    projectId: '<your-project-id>',
    storageBucket: '<your-storage-bucket>',
    messagingSenderId: '<your-messaging-sender-id>',
    appId: '<your-app-id>',
    measurementId: '<your-measurement-id>'
  }
  3. Below details also needs to be added to communicate with your backend server , in the environment file
    backendAPIKey: '<your-backend-api-key>',
    backendUrl: '<your-backend-url>',
    fcmVapidKey: '<your-fcm-vapId-key>'

## Build

Run `npm run pwa` to build your local server . The build artifacts will be stored in the `dist/CowinVaccineFinder/` directory . Since this is PWA , all builds are run with default `--prod` flag

## Development server

Run `http-server-spa dist/CowinVaccineFinder/ index.html <port-number>` to build your local server . Since this is PWA , local development server `ng serve` won't work 


## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
