import { Component, ChangeDetectorRef } from '@angular/core';
import { Product } from '../service/product';
import { cart, priceSummary } from '../data-type';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-cart-page',
  imports: [CommonModule],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.css',
})
export class CartPage {
  cartData: cart[] = [];
  prices: priceSummary = {
    price: 0,
    discount: 0,
    tax: 0,
    delivery: 0,
    total: 0
  }
  constructor(private product: Product, private cd: ChangeDetectorRef , private router : Router) { }

  ngOnInit(): void {

    this.product.currentCart().subscribe((result) => {

      console.warn("CART DATA:", result);

      this.cartData = result;

      let totalPrice = 0;

      result.forEach((item) => {

        const itemPrice = Number(
          String(item.price ?? 0).replace(/,/g, '')
        );

        const itemQuantity = Number(item.quantity ?? 1);

        console.warn("PRODUCT:", item.name);
        console.warn("PRICE:", item.price);
        console.warn("QUANTITY:", item.quantity);

        totalPrice += itemPrice * itemQuantity;

      });

      console.warn("FINAL PRICE:", totalPrice);

      // Amount
      this.prices.price = totalPrice;

      // Currently no extra charges
      this.prices.tax = totalPrice/10;
      this.prices.delivery = 100;
      this.prices.discount = totalPrice/10;

      // Final Total
      this.prices.total =
        this.prices.price +
        this.prices.tax +
        this.prices.delivery -
        this.prices.discount;

      console.warn("AMOUNT:", this.prices.price);
      console.warn("TOTAL:", this.prices.total);

      this.cd.detectChanges();
    });
  }

   checkout(){
    this.router.navigate(['/checkout']); 
   }
    ////////////////
     
     removeFromCart(item: cart) {

  if (!item.id) {
    console.warn("Cart item ID not found");
    return;
  }

  this.product.deleteCartItem(item.id).subscribe({
    next: () => {

      console.log("REMOVED FROM CART:", item);

      // Remove it immediately from the UI
      this.cartData = this.cartData.filter(
        cartItem => cartItem.id !== item.id
      );

      // Recalculate prices
      let totalPrice = 0;

      this.cartData.forEach((cartItem) => {

        const itemPrice = Number(
          String(cartItem.price ?? 0).replace(/,/g, '')
        );

        const itemQuantity = Number(cartItem.quantity ?? 1);

        totalPrice += itemPrice * itemQuantity;

      });

      this.prices.price = totalPrice;
      this.prices.tax = totalPrice / 10;
      this.prices.delivery = 100;
      this.prices.discount = totalPrice / 10;

      this.prices.total =
        this.prices.price +
        this.prices.tax +
        this.prices.delivery -
        this.prices.discount;

      this.cd.detectChanges();
    },

    error: (error) => {
      console.error("REMOVE CART ERROR:", error);
    }
  });
}
}
