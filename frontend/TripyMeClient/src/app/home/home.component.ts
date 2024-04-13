import { TokenStorageService } from './../auth/token-storage.service';
import { Component, OnInit } from '@angular/core';
import { NgAnimateScrollService } from 'ng-animate-scroll';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  info: any;

  constructor(private token: TokenStorageService,
              private animateScrollService: NgAnimateScrollService) { }

  ngOnInit() {
    this.info = {
      token: this.token.getToken(),
      email: this.token.getEmail(),
      authorities: this.token.getAuthorities()
    };
  }

  logout() {
    this.token.signOut();
    window.location.reload();
  }

  navigateToHeader(duration?: number) {
    this.animateScrollService.scrollToElement('header', duration);
  }
}
