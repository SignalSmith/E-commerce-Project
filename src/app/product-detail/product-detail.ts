import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../service/product';
import { productType, cart } from '../data-type';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail {

  detailsOfPro: productType | null = null;

  quantity: number = 1;
  removeCart = false;


  constructor(private activeRoute: ActivatedRoute, private product: Product, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {

    let pId = this.activeRoute.snapshot.paramMap.get('productId');

    // Get product details
    if (pId) {

      this.product.getProduct(pId).subscribe((result) => {

        console.warn(result);

        this.detailsOfPro = result;

        this.cd.detectChanges();

      });

    }


    // Check whether this product is already
    // in the logged-in user's cart
    let user = localStorage.getItem('user');

    if (user && pId) {

      let userId = JSON.parse(user).id;

      console.log("Checking cart:", userId, pId);

      this.product.checkProductInCart(userId, pId).subscribe((result) => {

        console.log("Cart result:", result);

        if (result.length > 0) {

          // Already in cart
          this.removeCart = true;

        } else {

          // Not in cart
          this.removeCart = false;

        }

        this.cd.detectChanges();

      });

    }

  }

  handleQuantity(value: string) {

    if (value === 'min' && this.quantity > 1) {
      this.quantity--;
    }
    else if (value === 'plus' && this.quantity < 20) {
      this.quantity++;
    }
  }
  /////////////////////////
  AddToCart() {
    if (this.detailsOfPro) {

      this.detailsOfPro.quantity = this.quantity;

      let user = localStorage.getItem('user');

      if (user) {

        let userId = JSON.parse(user).id;

        let cartData: cart = {
          ...this.detailsOfPro,
          userId,
          productId: this.detailsOfPro.id
        };

        delete cartData.id;

        // Store logged-in user's cart in localStorage
        this.product.localCart(cartData);

        // update in db.json
        this.product.addToCart(cartData).subscribe({
          next: (result) => {
            console.log('Saved to db.json:', result);
          },
          error: (error) => {
            console.error('Database error:', error);
          }
        });

        this.removeCart = true;

        alert('Product is added in cart');
         this.removeCart = true;
      }
    }
  }
  ////////////////

  removeToCart(id: string) {
    this.product.removeToCart(id);
    this.removeCart = false;
  }
}
