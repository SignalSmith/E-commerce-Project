import { Component } from '@angular/core';
import { Product } from '../service/product';
import { productType } from '../data-type';
import { CommonModule, NgFor } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { faTrashCan , faPenToSquare} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-seller-home',
  imports: [CommonModule ,FontAwesomeModule , RouterLink],
  templateUrl: './seller-home.html',
  styleUrl: './seller-home.css',
})
export class SellerHome {
  
   ListOfProducts : productType[] =[] ; 
   productMsg :string = "" ;  
   icon =faTrashCan ; 
   edit = faPenToSquare ; 
  constructor(private product : Product, private cd : ChangeDetectorRef){}

  ngOnInit(): void{
     this.productList() ; 
  }

  // most important function / //////////////////////////

  deleteItem(id:string){

     this.productMsg = "Product Deleted Successfully"; 

   this.ListOfProducts = this.ListOfProducts?.filter(
      item => item.id !== id
   );

    this.cd.detectChanges();

   this.product.deleteProduct(id).subscribe();


  setTimeout(()=>{
      this.productMsg = '';
      this.cd.detectChanges();
   },2000)
}
 ////////////////////////////////////////////////////////////////////////////

   productList(){
      this.product.productList().subscribe((result : any)=>{
       console.warn(result) ; 
       this.ListOfProducts = result.data || result;
       this.cd.detectChanges();
     })
   }
}
