import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  HostListener
} from "@angular/core";

import { AuthService } from "../shared/services/auth/auth.service";
import { Router, NavigationEnd } from "@angular/router";

import { MatSidenav } from "@angular/material";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class MenuComponent implements OnInit {
  menu: string;
  section: string;
  subsection: string;
  username: string;
  email: string;

  @ViewChild("sidenav") sideNav: MatSidenav;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.username = localStorage.getItem("username");
    // TODO get email from user data request
    this.email = "example@gmail.com";

    // Maintain menu status when reload
    this.maintainStatus();
  }

  setMenu(e, buttonId) {
    if (
      buttonId === "dashboard" ||
      buttonId === "users" ||
      buttonId === "configuration"
    ) {
      this.sideNav.close();
    } else {
      this.sideNav.open();
    }

    if (buttonId === "dashboard") {
      this.router.navigate(["/dashboard"]);
    } else if (buttonId === "users") {
      this.router.navigate(["/users"]);
    } else if (buttonId === "configuration") {
      // this.router.navigate(["/configuration"]);
    } else if (buttonId === "validation-and-verification") {
      this.section = "vv-tests";
      this.router.navigate(["/validation-and-verification"]);
    } else if (buttonId === "service-platform") {
      this.section = "sp-packages";
      this.router.navigate(["service-platform/packages"]);
    } else if (buttonId === "service-management") {
      this.section = "sm-network-services";
      this.router.navigate(["service-management/sm-network-services"]);
    }
    this.menu = buttonId;
  }

  setSection(e, buttonId) {
    if (buttonId === "vv-packages") {
      // this.router.navigate(["validation-and-verification/packages"]);
    } else if (buttonId === "vv-services") {
      // this.router.navigate(["validation-and-verification/packages"]);
    } else if (buttonId === "vv-functions") {
      // this.router.navigate(["validation-and-verification/packages"]);
    } else if (buttonId === "vv-tests") {
      this.router.navigate(["validation-and-verification/tests"]);
    } else if (buttonId === "sp-packages") {
      this.router.navigate(["service-platform/packages"]);
    } else if (buttonId === "sp-network-services") {
      this.router.navigate(["service-platform/sp-network-services"]);
    } else if (buttonId === "sp-functions") {
      this.router.navigate(["service-platform/functions"]);
    } else if (buttonId === "sp-policies") {
      this.subsection = "placement-policy";
      this.router.navigate(["service-platform/policies/placement-policy"]);
    } else if (buttonId === "sp-slas") {
      this.subsection = "sla-templates";
      this.router.navigate(["service-platform/slas/sla-templates"]);
    } else if (buttonId === "sp-slices") {
      this.subsection = "slices-templates";
      this.router.navigate(["service-platform/slices/slices-templates"]);
    } else if (buttonId === "sm-network-services") {
      this.router.navigate(["service-management/sm-network-services"]);
    } else if (buttonId === "requests") {
      this.router.navigate(["service-management/requests"]);
    } else if (buttonId === "network-service-instances") {
      this.router.navigate(["service-management/network-service-instances"]);
    } else if (buttonId === "licences") {
      this.subsection = "";
      this.router.navigate(["service-management/licences"]);
    }
    this.section = buttonId;
  }

  setSubsection(e, buttonId) {
    if (buttonId === "placement-policy") {
      this.subsection = "placement-policy";
      this.router.navigate(["service-platform/policies/placement-policy"]);
    } else if (buttonId === "runtime-policies") {
      this.subsection = "runtime-policies";
      this.router.navigate(["service-platform/policies/runtime-policies"]);
    } else if (buttonId === "sla-templates") {
      this.subsection = "sla-templates";
      this.router.navigate(["service-platform/slas/sla-templates"]);
    } else if (buttonId === "sla-agreements") {
      this.subsection = "sla-agreements";
      this.router.navigate(["service-platform/slas/sla-agreements"]);
    } else if (buttonId === "slices-templates") {
      this.subsection = "slices-templates";
      this.router.navigate(["service-platform/slices/slices-templates"]);
    } else if (buttonId === "slices-instances") {
      this.subsection = "slices-instances";
      this.router.navigate(["service-platform/slices/slices-instances"]);
    } else if (buttonId === "service-licences") {
      this.subsection = "service-licences";
      this.router.navigate(["service-management/licences/service-licences"]);
    } else if (buttonId === "user-licences") {
      this.subsection = "user-licences";
      this.router.navigate(["service-management/licences/user-licences"]);
    }
    this.subsection = buttonId;
  }

  maintainStatus() {
    let url = this.router.url.split("/");

    if (url.length > 1) {
      this.menu = url[1];

      if (
        url[1] === "validation-and-verification" ||
        url[1] === "service-platform" ||
        url[1] === "service-management"
      ) {
        this.sideNav.open();
      }
    } else {
      this.menu = "dashboard";
    }
    if (url.length > 2) {
      this.section = url[2];
    }
    if (url.length > 3) {
      this.subsection = url[3];
    }
  }

  logout() {
    this.router.navigate(["/login"]);
    this.authService
      .logout()
      .then()
      .catch(err => {
        // console.log(err);
      });
  }
}
