import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { USER_URL, ADMIN_URL } from '../constants/const';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userUrl = USER_URL;
  private adminUrl = ADMIN_URL;

  constructor(private http: HttpClient) { }

  getUserBoard(): Observable<string> {
    return this.http.get(this.userUrl, { responseType: 'text' });
  }

  getAdminBoard(): Observable<string> {
    return this.http.get(this.adminUrl, { responseType: 'text' });
  }
}
