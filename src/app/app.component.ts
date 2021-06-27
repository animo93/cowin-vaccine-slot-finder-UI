import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material/icon';

const THUMBUP_ICON = `
<svg class="star">
<use xlink:href="../assets/svg/icons8-github.svg"
       x="0"
       y="0" />
</svg>
`;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private router: Router , iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon('gitHub-icon', sanitizer.bypassSecurityTrustResourceUrl("../assets/svg/icons8-github96.svg"));
  }
}
