import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TheSeller } from '../service/the-seller';
import { Router } from '@angular/router';
import { signUp } from '../data-type';
import { CommonModule, NgIf } from '@angular/common';
import { Login } from '../data-type';

@Component({
  selector: 'app-seller',
  imports: [FormsModule, CommonModule, NgIf],
  templateUrl: './seller.html',
  styleUrl: './seller.css',
})
export class Seller {

  loginError = "";
  showLogin = false;
  constructor(private seller: TheSeller, private router: Router , private cd : ChangeDetectorRef) { }

  ngOnInit(): void {
    this.seller.reloadSeller();
  }

  signUp(value: signUp): void {
    this.seller.userSignUp(value);
  }



  Login(value: Login): void {

    this.seller.userLogin(value);
    this.seller.IsLoggedInError.subscribe((isError) => {
      if (isError) {
        this.loginError = "email or password is not correct";
        this.cd.detectChanges(); 
      }
    })
  }

  

  openLogin() {
    this.showLogin = true;
  }

  openSignup() {
    this.showLogin = false;
  }

}
