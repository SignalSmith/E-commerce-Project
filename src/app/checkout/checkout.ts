import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product } from '../service/product';
import { cart, checkoutData, priceSummary } from '../data-type';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})

export class Checkout {
  prices: priceSummary = {
    price: 0,
    discount: 0,
    tax: 0,
    delivery: 0,
    total: 0
  };
  totalPrice: number = 0;
  cartData : cart []= [] ; 
  constructor(private product: Product, private cd: ChangeDetectorRef, private router : Router) { }

  ngOnInit(): void {

    this.product.currentCart().subscribe((result) => {
      this.cartData = result ; 
      let price = 0;

      result.forEach((item) => {

        const itemPrice = Number(
          String(item.price ?? 0)
            .replace(/,/g, '')
            .replace('₹', '')
        );

        const itemQuantity = Number(item.quantity ?? 0);

        if (!isNaN(itemPrice) && !isNaN(itemQuantity)) {
          price += itemPrice * itemQuantity;
        }

      });

      // Product amount
      this.prices.price = price;

      // Tax = 10% of product amount
      this.prices.tax = price / 10;

      // Delivery charge
      this.prices.delivery = 100;

      // Discount = 10% of product amount
      this.prices.discount = price / 10;

      // Final total
      this.prices.total =
        this.prices.price +
        this.prices.tax +
        this.prices.delivery -
        this.prices.discount;

      console.warn("Amount:", this.prices.price);
      console.warn("Tax:", this.prices.tax);
      console.warn("Delivery:", this.prices.delivery);
      console.warn("Discount:", this.prices.discount);
      console.warn("Final Total:", this.prices.total);
      this.totalPrice = this.prices.total;
      
      this.cd.detectChanges();

    });
  }



  orderNow(data: checkoutData) {

  let user = localStorage.getItem('user');

  if (!user) {
    alert("User not logged in");
    return;
  }

  let userId = JSON.parse(user).id;

  if (this.totalPrice && this.cartData.length > 0) {

    const orderGroupId = Math.random()
      .toString(36)
      .substring(2, 12);

    const orderDate = new Date().toISOString();

    const requests = this.cartData.map((item) => {

      const orderData: checkoutData = {

        ...data,

        totalPrice: this.totalPrice,
        userId: userId,
        id: undefined,

        date: orderDate,
        orderGroupId: orderGroupId,

        productName: item.name,
        price: Number(item.price),
        quantity: item.quantity,
        description: item.description,
        image: item.image
      };

      console.log("ORDER DATA:", orderData);

      return this.product.orderNow(orderData);
    });

    forkJoin(requests).subscribe({

      next: (results) => {

        console.log("ALL ORDERS SAVED:", results);

        // Delete cart items from database
        this.cartData.forEach((item) => {

          if (item.id) {
            this.product.deleteCartItem(item.id).subscribe({
              next: () => {
                console.log("CART ITEM DELETED:", item.id);
              },
              error: (error) => {
                console.error("CART DELETE ERROR:", error);
              }
            });
          }

        });

        // Clear cart
        this.cartData = [];
        localStorage.removeItem('localCart');
         this.product.cart.emit([]);
        alert("Order placed successfully");

        this.router.navigate(['/my-orders']);
      },

      error: (error) => {

        console.error("ORDER ERROR:", error);

        alert("Order could not be placed");
      }

    });
  }
}



}

