import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Product } from '../service/product';
import { productType } from '../data-type';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-seller-update-product',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './seller-update-product.html',
  styleUrl: './seller-update-product.css',
})
export class SellerUpdateProduct {


  productData: productType | undefined;
  updateMsg: string = "";
  


  constructor(private route: ActivatedRoute, private product: Product, private cd: ChangeDetectorRef) { }


  ///////////////////////
  ngOnInit() {
    let productId = this.route.snapshot.paramMap.get('id'); //becaude we have already written id in the path app.routes.ts
    
    productId && this.product.getProduct(productId).subscribe((data) => {
      console.warn(data);
      this.productData = data;
      this.cd.detectChanges();
    })

    console.warn(productId);
  }

  /////////////////////////////
  updateProduct(data: productType) {
    
     if(this.productData){
      data.id = this.productData.id ; 
      console.warn(data.id); 

       this.product.updateProduct(data).subscribe((result) => {
      if (result) {
        this.updateMsg = "Updated successfully";
        this.cd.detectChanges();
      }
    });
    setTimeout(() => {
      this.updateMsg = "";
    this.cd.detectChanges();}, 1500) 
     }
     
     this.cd.detectChanges();
     }

}
