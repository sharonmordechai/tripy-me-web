import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { COUNTRY_URL } from '../constants/const';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  private countryUrl = COUNTRY_URL;

  constructor(private http: HttpClient) { }

  getCountries(): Observable<string> {
    return this.http.get(this.countryUrl, { responseType: 'text' });
  }
}
