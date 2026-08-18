import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { cart, checkoutData, productType } from '../data-type';

@Injectable({
  providedIn: 'root',
})
export class Product {

  cart = new EventEmitter<cart[] | []>();
  cartData = new EventEmitter<cart[]>();
  constructor(private http: HttpClient) { }


  // theese all are for API calling
  addProduct(data: productType) {
    return this.http.post('http://localhost:3000/product', data);
  }

  productList() {
    return this.http.get<productType[]>('http://localhost:3000/product');
  }

  deleteProduct(id: string) {
    return this.http.delete(`http://localhost:3000/product/${id}`);
  }

  getProduct(id: string) {
    return this.http.get<productType>(`http://localhost:3000/product/${id}`);
  }

  updateProduct(product: productType) {
    return this.http.put<productType>(`http://localhost:3000/product/${product.id}`, product);
  }

  popularProducts() {
    return this.http.get<any>('http://localhost:3000/product?_page=1&_per_page=3');
  }

  trendyProducts() {
    return this.http.get<any>('http://localhost:3000/product?_page=1&_per_page=7');
  }


  searchProduct() {
    return this.http.get<any>('http://localhost:3000/product');
  }


  /////////
  localCart(data: cart) {

    let cart: cart[] = [];

    let localCart = localStorage.getItem('localCart');

    if (!localCart) {
      cart.push(data);
      localStorage.setItem('localCart', JSON.stringify(cart));
    }
    else {
      cart = JSON.parse(localCart);
      cart.push(data);
      localStorage.setItem('localCart', JSON.stringify(cart));
    }
    this.cart.emit(cart);
  }

  removeToCart(productId: string) {
    let user = localStorage.getItem('user');

    if (!user) {
      return;
    }

    let userId = JSON.parse(user).id;

    // First find the cart item from DB
    this.http.get<cart[]>(
      `http://localhost:3000/cart?userId=${userId}&productId=${productId}`
    ).subscribe((result) => {

      console.log("Cart item from DB:", result);

      if (result.length > 0) {

        // Get DB generated id
        let cartId = result[0].id;

        if (cartId) {

          // Delete from db.json
          this.removeCartFromDB(cartId).subscribe(() => {

            console.log("Deleted from db.json:", cartId);

            // Now refresh user's cart
            this.getcartList(userId);
          });
        }
      }
    });
  }

  addToCart(cartData: cart) {
    return this.http.post('http://localhost:3000/cart', cartData);
  }

  removeCartFromDB(id: string) {
    return this.http.delete(`http://localhost:3000/cart/${id}`);
  }

  getcartList(userId: string) {
    return this.http.get<cart[]>(
      `http://localhost:3000/cart?userId=${userId}`
    ).subscribe((result) => {

      localStorage.setItem('localCart', JSON.stringify(result));

      this.cart.emit(result);

    });
  }

  checkProductInCart(userId: string, productId: string) {

    return this.http.get<cart[]>(
      `http://localhost:3000/cart?userId=${userId}&productId=${productId}`
    );

  }


  currentCart() {
    let userStore = localStorage.getItem('user');
    let userData = userStore && JSON.parse(userStore);
    return this.http.get<cart[]>(`http://localhost:3000/cart?userId=${userData.id}`);
  }

  orderNow(data: checkoutData) {
    return this.http.post(`http://localhost:3000/orders`, data);
  }

  orderList() {
    let userStore = localStorage.getItem('user');
    let userData = userStore && JSON.parse(userStore);
    return this.http.get<checkoutData[]>(`http://localhost:3000/orders?userId=${userData.id}`);
  }

  deleteCartItem(id: string){
    return this.http.delete(`http://localhost:3000/cart/${id}`);
     
  }

   cancelOrder(id: String){
    return this.http.delete(`http://localhost:3000/orders/${id}`);
   }
}
