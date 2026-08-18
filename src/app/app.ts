import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './header/header';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TheSeller } from './service/the-seller';
import { SellerAddProduct } from './seller-add-product/seller-add-product';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Footer } from './footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header,FormsModule , HttpClientModule , SellerAddProduct , Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('E-commerce');
 
    constructor(private seller : TheSeller){}
   
 }
