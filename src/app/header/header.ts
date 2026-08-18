import { CommonModule, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, NgModule } from '@angular/core';
import { RouterLink, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { Product } from '../service/product';
import { productType } from '../data-type';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterOutlet, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  menueType: string = 'default';
  sellerName: string = '';
  searchResult: productType[] = [];
  userName: string = '';
  cartDetails = 0;

  constructor(private router: Router, private product: Product, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {

    this.router.events.subscribe((val: any) => {

      if (val instanceof NavigationEnd) {

        if (localStorage.getItem('seller') && val.url.includes('seller')) {

          console.warn("inside seller area");

          this.menueType = "seller";

          // for showing the seller name
          let sellerStore = localStorage.getItem('seller');

          if (sellerStore) {
            let sellerData = JSON.parse(sellerStore)[0];
            this.sellerName = sellerData.name;
          }

        }

        else if (localStorage.getItem('user')) {

          let userStore = localStorage.getItem('user');

          if (userStore && userStore !== 'undefined') {

            const user = JSON.parse(userStore);

            this.userName = user.name;
            this.menueType = 'user';

            console.log(user);

          }
        }
        else {

          console.warn("outside seller area");

          this.menueType = 'default';

        }

      }

    });

    let user = localStorage.getItem('user');

    if (user) {
      let userId = JSON.parse(user).id;

      this.product.getcartList(userId);
    }
    else {
      let cartData = localStorage.getItem('localCart');

      if (cartData) {
        this.cartDetails = JSON.parse(cartData).length;
      }
    }

    this.product.cart.subscribe((result) => {
      this.cartDetails = result.length;
      this.cd.detectChanges();
    })
  }


  // seller logout
  logout() {
    localStorage.removeItem('seller');
    this.router.navigate(['/']);
  }

  //user logout
  logoutUser() {
    localStorage.removeItem('user');
    localStorage.removeItem('localCart');
    this.cartDetails = 0;
    this.router.navigate(['/user']);
  }






  searchP(query: KeyboardEvent) {
    if (query) {
      const element = query.target as HTMLInputElement;

      this.product.searchProduct().subscribe((result) => {

        const filteredResult = result.filter(
          ({ name, color, description, price }: any) =>

            `${name} ${color} ${description} ${price}`
              .toLowerCase()
              .includes(element.value.toLowerCase())

        );

        this.searchResult = filteredResult.slice(0, 5);
        this.cd.detectChanges();
      });
    }

  }


  ///////////////////////////

  hideSearch() {
    setTimeout(() => {
      this.searchResult = [];
    }, 1000);
  }


  //////////////////

  // goTodetails(value : string){
  //  this.router.navigate(['/details/'+value]);

  //    setTimeout(() => {
  //   this.searchResult = [];
  // }, 200); 
  // this.cd.detectChanges();
  // }
  ///////////////////////////
  submit(value: string) {
    // console.warn(value);
    if (value && value.trim()) {
      this.router.navigate([`/search/${value.trim()}`]);
    }
  }
}
