import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../auth/token-storage.service';

@Component({
  selector: 'app-oauth2',
  templateUrl: './oauth2.component.html',
  styleUrls: ['./oauth2.component.css']
})
export class Oauth2Component implements OnInit {

  role: any = {
    authority: 'ROLE_USER'
  };

  constructor(private tokenStorage: TokenStorageService,
              private router: Router) { }

  ngOnInit() {
    if (this.tokenStorage.getToken()) {
      this.router.navigate(['user']);
    } else {
        const token = this.getUrlParameter('token');
        const error = this.getUrlParameter('error');
        if (token) {
            this.tokenStorage.saveToken(token);
            this.tokenStorage.saveAuthorities([this.role]);
            this.reloadPage();
        } else {
            console.log(error);
            this.router.navigate(['auth/login']);
        }
    }
  }

  getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    let regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    let results = regex.exec(window.location.search);

    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }

  reloadPage() {
    window.location.reload();
  }
}
