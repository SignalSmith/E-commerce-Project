import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Product } from '../service/product';
import { CommonModule } from '@angular/common';
import { productType } from '../data-type';


@Component({
  selector: 'app-search',
   standalone: true,
  imports: [CommonModule, RouterLink ],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search {

  theItem : productType[] = [] ; 

  constructor(private activeRoute: ActivatedRoute , private product : Product, private cd : ChangeDetectorRef ) { }

  ngOnInit(): void {

  this.activeRoute.paramMap.subscribe((params) => {

    let query = params.get('query');

    console.warn(query);

    this.product.searchProduct().subscribe((result) => {

      const filterResult = result.filter(
        ({ name, color, description, price }: any) =>

          `${name} ${color} ${description} ${price}`
            .toLowerCase()
            .includes(query?.toLowerCase() || '')

      );

      console.warn(filterResult);
      this.theItem = filterResult ; 
      this.cd.detectChanges();

    });

  });

}
  }





