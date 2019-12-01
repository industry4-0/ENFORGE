import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthguardService implements CanActivate {
  protected jwtHelper = new JwtHelperService()
  constructor(
    private router: Router
  ) { }
    canActivate(
      next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      if (localStorage.getItem('demo_token')){
        return true;
      }else{
        this.router.navigate(['/login']);
        return false;
      }
    }
}