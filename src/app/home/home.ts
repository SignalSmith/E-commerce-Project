import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { NgbCarouselModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Product } from '../service/product';
import { cart, productType } from '../data-type';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgbModule, CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  productImg: productType[] = [];
  trendyP:productType[] = [];

  constructor(private product: Product , private cd : ChangeDetectorRef) { }

  ngOnInit(): void {
    this.product.popularProducts().subscribe((result) => {
      this.productImg = result.data;
      this.cd.detectChanges() ;
    });

    this.product.trendyProducts().subscribe((result) => {
      this.trendyP = result.data;
       this.cd.detectChanges() ;
    });

  }
   
   addToCart(item: productType) {

  let user = localStorage.getItem('user');

  if (!user) {

    let cartData: cart = {
      ...item,
      quantity: 1,
      userId: '',
      productId: item.id
    };

    this.product.localCart(cartData);

    alert("Product added to cart");
    return;
  }

  let userId = JSON.parse(user).id;

  let cartData: cart = {
    ...item,
    quantity: 1,
    userId: userId,
    productId: item.id
  };

  this.product.addToCart(cartData).subscribe({
    next: () => {
      this.product.getcartList(userId);
      alert("Product added to cart");
    },
    error: (error) => {
      console.error("ADD TO CART ERROR:", error);
    }
  });
}
}
