import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Login, productType, signUp, cart } from '../data-type';
import { UserService } from '../service/user-service';
import { faL } from '@fortawesome/free-solid-svg-icons';
import { ProductDetail } from '../product-detail/product-detail';
import { Product } from '../service/product';

@Component({
  selector: 'app-user',
  imports: [CommonModule, FormsModule],
  templateUrl: './user.html',
  styleUrl: './user.css',
})
export class User {

  showLogin: boolean = true;
  IsError = "";

  constructor(private user: UserService, private cd: ChangeDetectorRef, private product: Product) { }

  ngOnInit(): void {
    this.user.userAuthReload();
  }

  userSignUp(data: signUp) {
    this.user.userSignUp(data);
  }

  userLogin(data: Login): void {
    this.user.userLogin(data);
    this.user.LoggedInError.subscribe((result) => {
      if (result) {
        console.warn("Login Failed !");
        this.IsError = "Email or Password is incorrect";
        this.cd.detectChanges();
      }
      else {
        console.warn("user login successfull ");
        this.localCartToRemoteCart();
      }
    })


  }


  ///////////////////////////
  goToSignUp() {
    this.showLogin = true;
  }

  goToLogin() {
    this.showLogin = false;
  }


  ////////////////////////////

  localCartToRemoteCart() {
    let data = localStorage.getItem('localCart');
    let user = localStorage.getItem('user');
    let userId = user && JSON.parse(user).id;

    if (data) {
      let cartDataList: productType[] = JSON.parse(data);


      cartDataList.forEach((product: productType, index) => {

        let cartData: cart = {
          ...product,
          userId: userId,
          productId: product.id
        };

        setTimeout(() => {

          this.product.addToCart(cartData).subscribe((result) => {

            if (result) {
              console.warn("ITEM stored in db");
            }

          });

          if (cartDataList.length === index + 1) {
            localStorage.removeItem('localCart');
          }

        }, 500);

      });
    }
    setTimeout(() => {
      console.log('Getting cart for user:', userId);
      this.product.getcartList(userId);
    }, 2000);
  }

  ////////////////////



}
