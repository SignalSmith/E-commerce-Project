import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { signUp, Login } from '../data-type';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root',
})
export class TheSeller {

  IsSellerLoggedIn = new BehaviorSubject<boolean>(false);
  IsLoggedInError = new EventEmitter<boolean>(false);

  constructor(private http: HttpClient, private router: Router) { }

  ///////////////////////////////////////////////////////////////////
  userSignUp(data: signUp) {

    this.http.post('http://localhost:3000/seller', data, { observe: 'response' }).subscribe((result) => {

      this.IsSellerLoggedIn.next(true);

      localStorage.setItem('seller', JSON.stringify(result.body)); //local storage e data store holo

      this.router.navigate(['seller-home']);   // navigating to seller home page 

      console.warn(result)
    });
  }
  /////////////////////////////////////////////////////////////////////
  reloadSeller() {
    if (localStorage.getItem('seller')) {
      this.IsSellerLoggedIn.next(true);
      this.router.navigate(['seller-home']);
    }
  }

  /////////////////////////////////////////////////////////////////////

  userLogin(data: Login) {
    console.warn(data);
    // api calling code 
    this.http.get(`http://localhost:3000/seller?email=${data.email}&password=${data.password}`,
      { observe: 'response' }).subscribe((result: any) => {
        console.warn(result);
        if (result && result.body && result.body.length) {
          console.warn("Seller logged in successfully");
          localStorage.setItem('seller', JSON.stringify(result.body)); //local storage e data store holo

          this.router.navigate(['seller-home']);   // navigating to seller home page 
        } else {
          console.warn("login failed !");
          this.IsLoggedInError.emit(true);
        }


      });
  }


}
