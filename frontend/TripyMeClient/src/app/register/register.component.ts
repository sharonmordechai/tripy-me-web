import { AuthLoginInfo } from '../auth/payloads/login-info';
import { Router } from '@angular/router';
import { AuthService } from './../auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { SignUpInfo } from '../auth/payloads/signup-info';
import { TokenStorageService } from '../auth/token-storage.service';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { AbstractControl } from '@angular/forms/src/model';

import { GOOGLE_URL, FACEBOOK_URL, EMAIL_VALIDATION_MESSAGES, PASSWORD_VALIDATION_MESSAGES, NAME_VALIDATION_MESSAGES } from '../constants/const';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  GOOGLE_AUTH_URL = GOOGLE_URL;
  FACEBOOK_AUTH_URL = FACEBOOK_URL;

  signUpInfo: SignUpInfo;
  loginInfo: AuthLoginInfo;
  registerForm: FormGroup;
  errorMessage = '';
  errorAlert = false;

  private emailValidationMessages = EMAIL_VALIDATION_MESSAGES;

  private nameValidationMessages = NAME_VALIDATION_MESSAGES;

  private passwordValidationMessages = PASSWORD_VALIDATION_MESSAGES;

  constructor(private authService: AuthService,
              private router: Router,
              private tokenStorage: TokenStorageService,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    const emailControl = this.registerForm.get('email');
    emailControl.valueChanges.pipe(
      debounceTime(1000)
    ).subscribe(
      value => this.setMessage(emailControl, this.emailValidationMessages)
    );

    const nameControl = this.registerForm.get('name');
    nameControl.valueChanges.pipe(
      debounceTime(1000)
    ).subscribe(
      value => this.setMessage(nameControl, this.nameValidationMessages)
    );

    const passwordControl = this.registerForm.get('password');
    passwordControl.valueChanges.pipe(
      debounceTime(1000)
    ).subscribe(
      value => this.setMessage(passwordControl, this.passwordValidationMessages)
    );
  }

  onSubmit() {
    this.signUpInfo = new SignUpInfo(
      this.registerForm.get('name').value,
      this.registerForm.get('email').value,
      this.registerForm.get('password').value
    );

    this.authService.signUp(this.signUpInfo).subscribe(
      data => {
        this.loginInfo = new AuthLoginInfo(
          this.registerForm.get('email').value,
          this.registerForm.get('password').value
        );

        this.authService.login(this.loginInfo).subscribe(
          info => {
            this.tokenStorage.saveToken(info.accessToken);
            this.tokenStorage.saveEmail(info.email);
            this.tokenStorage.saveAuthorities(info.authorities);
            this.reloadPage();
          },
          error => {
            console.log(error);
            this.errorMessage = error.error.message;
          }
        );
        this.router.navigate(['user']);
      },
      error => {
        console.log(error);
        this.errorMessage = error.error.message;
      }
    );
  }

  navigateToLogin() {
    this.router.navigate(['auth/login']);
  }

  reloadPage() {
    window.location.reload();
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
