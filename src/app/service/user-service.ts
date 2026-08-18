import { EventEmitter, Injectable } from '@angular/core';
import { Login, signUp } from '../data-type';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  LoggedInError = new EventEmitter<boolean>(false);

  constructor(private http: HttpClient, private router: Router) { }

  userSignUp(data: signUp) {

    this.http.post(
      'https://e-commerce-backend-ub3j.onrender.com/user',
      data,
      { observe: 'response' }
    ).subscribe((result) => {

      console.warn(result);

      if (result) {
        localStorage.setItem("user", JSON.stringify(result.body));
        this.router.navigate(['/']);
      }

    });
  }

  userAuthReload() {
    // This function prevents a logged-in user
    // from directly accessing the signup/login page.

    if (localStorage.getItem('user')) {
      this.router.navigate(['/']);
    }
  }

  userLogin(data: Login) {

    this.http.get<signUp[]>(
      `https://e-commerce-backend-ub3j.onrender.com/user?email=${data.email}&password=${data.password}`,
      { observe: 'response' }
    ).subscribe((result) => {

      if (result.body && result.body.length > 0) {

        localStorage.setItem("user", JSON.stringify(result.body[0]));

        // Login successful
        this.LoggedInError.emit(false);

        this.router.navigate(['/']);

      } else {

        console.warn("Login failed!");

        this.LoggedInError.emit(true);
      }

    });
  }

}