import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment'

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.apiUrl
  static isLoggedIn: Boolean;

  set setLoggedIn(value: Boolean) {
    AuthService.isLoggedIn = value;
  }

  get isLoggedInValue() {
    return AuthService.isLoggedIn;
  }

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  public login(usernameOrEmail: string, password: string) {
    return this.http.post<any>(this.baseUrl + '/api/auth/signin', { usernameOrEmail, password }, httpOptions)
  }

  public loginStatusUpdate() {
    //is called if login is successfull and updates the isLoggedIN boolean
    try {
      if (localStorage.getItem('demo_token')) {
        AuthService.isLoggedIn = true;
      }
    } catch (error) {
      console.log(error)
    }
  }

  public logout() {
    if (localStorage.getItem('demo_token')) {
      localStorage.removeItem('demo_token')
      AuthService.isLoggedIn = false;
      this.router.navigateByUrl('/login')
    } else {
      alert('you are not Logged in!')
    }
  }
}

