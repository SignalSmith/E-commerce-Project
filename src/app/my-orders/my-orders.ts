import { ChangeDetectorRef, Component } from '@angular/core';
import { Product } from '../service/product';
import { checkoutData, OrderGroup } from '../data-type';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-orders',
  imports: [CommonModule],
  templateUrl: './my-orders.html',
  styleUrl: './my-orders.css',
})
export class MyOrders {

   orderData : checkoutData[]  = [] ;  
   orderGroups: OrderGroup[] = [];

  constructor(private product: Product ,  private cdr: ChangeDetectorRef){}

ngOnInit(): void {

  this.product.orderList().subscribe({
    next: (result) => {

      console.log("ORDERS FROM DB:", result);

      this.orderData = result;

      const groups: { [key: string]: OrderGroup } = {};

      result.forEach((order) => {

        const groupId = order.orderGroupId || order.id || '';

        if (!groups[groupId]) {

          groups[groupId] = {
            orderGroupId: groupId,
            orderId: order.id || '',
            date: order.date,
            totalPrice: order.totalPrice,
            products: []
          };

        }

        groups[groupId].products.push(order);

      });

      this.orderGroups = Object.values(groups);

      console.log("GROUPED ORDERS:", this.orderGroups);
      console.log("FIRST PRODUCT:", this.orderGroups[0]?.products[0]);
      console.log("NUMBER OF ORDERS:", this.orderGroups.length);

      this.cdr.detectChanges();
    },

    error: (error) => {
      console.error("ORDER LIST ERROR:", error);
    }
  });

}
   ////////////// 

 cancelOrder(orderGroupId: string) {

  const confirmCancel = confirm(
    "Are you sure you want to cancel this order?"
  );

  if (!confirmCancel) {
    return;
  }

  // Find all products belonging to this order
 const productsToCancel = this.orderData.filter(
  order => (order.orderGroupId || order.id) === orderGroupId
);

  console.log("PRODUCTS TO CANCEL:", productsToCancel);

  if (productsToCancel.length === 0) {
    alert("Order not found");
    return;
  }

  let completed = 0;

  productsToCancel.forEach((order) => {

    if (!order.id) {
      completed++;
      return;
    }

    this.product.cancelOrder(order.id).subscribe({

      next: () => {

        completed++;

        if (completed === productsToCancel.length) {

          alert("Order cancelled successfully");

          // Remove complete order from screen
          this.orderGroups = this.orderGroups.filter(
            order => order.orderGroupId !== orderGroupId
          );

          // Also remove from original data
          this.orderData = this.orderData.filter(
            order => order.orderGroupId !== orderGroupId
          );

          this.cdr.detectChanges();
        }

      },

      error: (error) => {

        console.error(
          "CANCEL ORDER ERROR:",
          error
        );

        alert("Failed to cancel order");

      }

    });

  });

}
}
