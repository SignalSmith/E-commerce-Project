import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Product } from '../service/product';
import { productType } from '../data-type';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-seller-add-product',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './seller-add-product.html',
  styleUrl: './seller-add-product.css',
})
export class SellerAddProduct {

  productAdded: string | undefined;

  constructor(private product: Product, private cd : ChangeDetectorRef) { }

  ngOnInit(): void { }


  //////////////////
  addProduct(data: productType) {
 
      this.productAdded = "Product added successfully 🎉";

    this.cd.detectChanges();

     this.product.addProduct(data).subscribe((result: any) => {

      console.warn(result);
      if (result) {
        this.productAdded = "Product added successfully 🎉";
      }
    });

    setTimeout(()=>{
      this.productAdded = '';
      this.cd.detectChanges();
   },2000)

  }


}
