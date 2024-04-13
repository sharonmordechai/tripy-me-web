import { SignUpInfo } from './payloads/signup-info';
import { JwtResponse } from './payloads/jwt-response';
import { AuthLoginInfo } from './payloads/login-info';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LOGIN_URL, SIGNUP_URL } from '../constants/const';

const httpOptions = {
  headers: new HttpHeaders({
    'content-type': 'application/json'
    })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loginUrl = LOGIN_URL;
  private signupUrl = SIGNUP_URL;

  constructor(private http: HttpClient) { }

  login(credentials: AuthLoginInfo): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(this.loginUrl, credentials, httpOptions);
  }

  signUp(info: SignUpInfo): Observable<string> {
    return this.http.post<string>(this.signupUrl, info, httpOptions);
  }
}
