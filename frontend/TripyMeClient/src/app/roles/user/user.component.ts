import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { TokenStorageService } from '../../auth/token-storage.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  id: number;
  name: string;
  email: string;
  provider: string;
  errorMessage: string;
  imgUrl: string;
  defaultImgUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8q2dNQs7DX1XK3flOWQa9eSmeKgWZ25_UUx2NwPeJvHiqqZWh';

  constructor(private userService: UserService, private tokenStorage: TokenStorageService, private router: Router) { }

  ngOnInit() {
    if (this.tokenStorage.getToken()) {
      this.userService.getUserBoard().subscribe(
        data => {
          const res = JSON.parse(data);
          this.id = res.id;
          this.name = res.name;
          this.email = res.email;
          this.provider = res.provider;
          this.imgUrl = res.imageUrl;
        },
        error => {
          this.errorMessage = error.error.message;
        }
      );
    } else {
      this.router.navigate(['home']);
    }
  }
}
