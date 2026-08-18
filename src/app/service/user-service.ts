import { EventEmitter, Injectable } from '@angular/core';
import { Login, signUp } from '../data-type';
import { HttpClient } from '@angular/common/http';
import { Route, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  LoggedInError = new EventEmitter<boolean>(false);

  constructor(private http: HttpClient, private router: Router) { }

  userSignUp(data: signUp) {
    this.http.post("http://localhost:3000/user", data, { observe: 'response' }).subscribe((result) => {
      console.warn(result);
      if (result) {
        localStorage.setItem("user", JSON.stringify(result.body));
        this.router.navigate(['/']);
      }
    })
  }

  userAuthReload() {         //this function is for blocking to directly acces the page from search bar of chrome
    // jokhon already signup then directly amra logout na press korei direct abr sugnup korar page e jete pari na it is illogical
    if (localStorage.getItem('user')) {
      this.router.navigate(['/']);
    }
  }

  userLogin(data: Login) {
    this.http.get<signUp[]>(
      `http://localhost:3000/user?email=${data.email}&password=${data.password}`,
      { observe: 'response' }
    ).subscribe((result) => {

      if (result.body && result.body.length > 0) {

        localStorage.setItem("user", JSON.stringify(result.body[0]));

        // Login successful
        this.LoggedInError.emit(false);

        this.router.navigate(['/']);

      }
      else {

        console.warn("Login failed!");

        this.LoggedInError.emit(true);
      }
    });
  }


}
