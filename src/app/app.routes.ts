import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Seller } from './seller/seller';
import { SellerHome } from './seller-home/seller-home';
import { PageNotFound } from './page-not-found/page-not-found';
import { authGuard } from './auth-guard';
import { SellerAddProduct } from './seller-add-product/seller-add-product';
import { SellerUpdateProduct } from './seller-update-product/seller-update-product';
import { Search } from './search/search';
import { ProductDetail } from './product-detail/product-detail';
import { User } from './user/user';
import { CartPage } from './cart-page/cart-page';
import { Checkout } from './checkout/checkout';
import { MyOrders } from './my-orders/my-orders';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'seller', component: Seller },
    { path: 'seller-home', component: SellerHome, canActivate: [authGuard] },
    { path: 'seller-add-products', component: SellerAddProduct, canActivate: [authGuard] },
    { path: 'seller-update-product/:id', component: SellerUpdateProduct, canActivate: [authGuard] },
    { path: 'search/:query', component: Search },
    { path: 'details/:productId', component: ProductDetail },
    { path: 'user', component: User },
    { path: 'cart-page', component: CartPage },
    { path: 'checkout', component: Checkout },
    { path: 'my-orders', component: MyOrders },
    { path: '**', component: PageNotFound }
];
