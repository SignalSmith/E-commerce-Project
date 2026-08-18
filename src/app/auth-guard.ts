import { CanActivateFn } from '@angular/router';
import { TheSeller } from './service/the-seller';
import { inject } from '@angular/core';
import { Seller } from './seller/seller';

export const authGuard: CanActivateFn = (route, state) => {

  const service = inject(TheSeller) ; 
  if(localStorage.getItem('seller')){
       return true ; 
     }
  return service.IsSellerLoggedIn ; 
};
