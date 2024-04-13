import { Injectable } from '@angular/core';
import { ACCESS_TOKEN_KEY, ACCESS_EMAIL_KEY, ACCESS_AUTHORITIES_KEY } from '../constants/const';

const TOKEN_KEY = ACCESS_TOKEN_KEY;
const EMAIL_KEY = ACCESS_EMAIL_KEY;
const AUTHORITIES_KEY = ACCESS_AUTHORITIES_KEY;

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  private roles: Array<string> = [];

  constructor() { }

  signOut() {
    localStorage.clear();
  }

  public saveToken(token: string) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string {
    return localStorage.getItem(TOKEN_KEY);
  }

  public saveEmail(email: string) {
    localStorage.removeItem(EMAIL_KEY);
    localStorage.setItem(EMAIL_KEY, email);
  }

  public getEmail(): string {
    return localStorage.getItem(EMAIL_KEY);
  }

  public saveAuthorities(authorities: string[]) {
    localStorage.removeItem(AUTHORITIES_KEY);
    localStorage.setItem(AUTHORITIES_KEY, JSON.stringify(authorities));
  }

  public getAuthorities(): string[] {
    this.roles = [];

    if (localStorage.getItem(TOKEN_KEY)) {
      JSON.parse(localStorage.getItem(AUTHORITIES_KEY)).forEach(authority => {
        this.roles.push(authority.authority);
      });
    }
    return this.roles;
  }
}
