import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
declare var $: any;

@Component({
  selector: 'app-area',
  templateUrl: './areas.component.html'
})
export class AreasComponent implements OnInit {

  year: string = (new Date()).getFullYear().toString();

  constructor(private router: Router, private jwtHelper: JwtHelperService) {

  }

  ngOnInit(): void {
    $(document).ready(function(){
      $('input').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
      });
    });
  }

  isUserAuthenticated = (): boolean => {
    const token = localStorage.getItem("jwt");
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      this.router.navigate(["/login"]);
      localStorage.removeItem("jwt");
      localStorage.removeItem("x-site-session");
      localStorage.removeItem("userprivileges");
      return true;
    }
    return false;
  }
}

