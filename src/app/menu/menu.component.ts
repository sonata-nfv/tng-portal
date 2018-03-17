import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';

import { MatSidenav } from '@angular/material';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MenuComponent implements OnInit {
  menu: String;
  section: String;
  subsection: String;
  @ViewChild("sidenav") sideNav : MatSidenav;
  constructor() { }

  ngOnInit() {
  }

  setMenu(e, buttonId) {
    if(buttonId === 'dashboard' || buttonId === 'users') {
      this.sideNav.close();
    } else {
      this.sideNav.open();
    }

    if(buttonId === 'sp') {
      this.section = 'policies';
    } else if(buttonId === 'bss') {
      this.section = 'availableNS';
    }
    this.menu = buttonId;
  }

  setSection(e, buttonId) {
    if(buttonId === 'sla') {
      this.subsection = 'slaAgreements';
    } else if(buttonId === 'store') {
      this.subsection = 'serviceLicences';
    }
    this.section = buttonId;
  }

  setSubsection(e, buttonId) {
    this.subsection = buttonId;
  }
}
