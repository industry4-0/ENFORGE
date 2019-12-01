import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from './services/auth-jwt-services/auth.service';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  helper = new JwtHelperService();
  loadingRouteConfig: boolean;
  navLoc: string;
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    if (localStorage.getItem('demo_token')) {
      if (this.helper.isTokenExpired(localStorage.getItem('demo_token'))) {
        //token is expired if it returns True
        this.authService.setLoggedIn = false
        localStorage.removeItem('demo_token')
      } else
        //token is not expired if it returns false
        this.authService.setLoggedIn = true
    } else
      this.authService.setLoggedIn = false

    this.router.events.subscribe(event => {
      if (event['url']) {
        this.navLoc = event['url'].substring(1);
      }
      if (event instanceof NavigationStart)
        this.loadingRouteConfig = true;
      else if (event instanceof NavigationEnd)
      setTimeout(()=> this.loadingRouteConfig = false, 900)
    });
  }
}