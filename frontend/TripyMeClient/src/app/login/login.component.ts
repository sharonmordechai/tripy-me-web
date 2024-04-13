import { TokenStorageService } from './../auth/token-storage.service';
import { AuthService } from './../auth/auth.service';
import { AuthLoginInfo } from '../auth/payloads/login-info';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { AbstractControl } from '@angular/forms/src/model';

import { GOOGLE_URL, FACEBOOK_URL, EMAIL_VALIDATION_MESSAGES } from '../constants/const';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  GOOGLE_AUTH_URL = GOOGLE_URL;
  FACEBOOK_AUTH_URL = FACEBOOK_URL;

  loginInfo: AuthLoginInfo;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  loginForm: FormGroup;
  errorAlert = false;

  private emailValidationMessages = EMAIL_VALIDATION_MESSAGES;

  constructor(private authService: AuthService,
              private tokenStorage: TokenStorageService,
              private router: Router,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    const emailControl = this.loginForm.get('email');
    emailControl.valueChanges.pipe(
      debounceTime(1000)
    ).subscribe(
      value => this.setMessage(emailControl, this.emailValidationMessages)
    );

    if (this.tokenStorage.getToken()) {
      this.roles = this.tokenStorage.getAuthorities();
      if (this.roles.includes('ROLE_ADMIN')) {
        this.router.navigate(['admin']);
      } else {
        this.router.navigate(['user']);
      }
    }
  }

  onSubmit() {
    this.loginInfo = new AuthLoginInfo(
      this.loginForm.get('email').value,
      this.loginForm.get('password').value
    );

    this.authService.login(this.loginInfo).subscribe(
      data => {
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveEmail(data.email);
        this.tokenStorage.saveAuthorities(data.authorities);

        this.isLoginFailed = false;
        this.roles = this.tokenStorage.getAuthorities();
        this.reloadPage();
      },
      error => {
        console.log(error.message);
        this.errorMessage = error.error.message;
        this.isLoginFailed = true;
      }
    );
  }

  reloadPage() {
    window.location.reload();
  }

  register() {
    this.router.navigate(['signup']);
  }

  setMessage(c: AbstractControl, errorList: any): void {
    this.errorMessage = '';
    this.errorAlert = false;
    if ((c.touched || c.dirty) && c.errors) {
      this.errorAlert = true;
      this.errorMessage = Object.keys(c.errors).map(
        key => this.errorMessage += errorList[key]).join(' ');
    }
  }
}
