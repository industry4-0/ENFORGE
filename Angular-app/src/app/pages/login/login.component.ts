import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth-jwt-services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  constructor(
    private _formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginForm = this._formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  logIn() {
    let emaill = this.loginForm.get('email').value
    let passwordd = this.loginForm.get('password').value

    this.authService.login(emaill, passwordd)
      .subscribe((resp: any) => {
        if (resp.accessToken) {
          this.router.navigateByUrl('')
          localStorage.setItem('demo_token', resp.accessToken);
          this.authService.loginStatusUpdate();
        }
      })
  }
}