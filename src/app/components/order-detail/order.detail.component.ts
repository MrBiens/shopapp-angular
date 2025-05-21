import { Component, OnInit } from '@angular/core';
import { Environment } from 'src/app/enviroments/environment';
import { Product } from 'src/app/models/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';
@Component({
  selector: 'app-order-confirm',
  templateUrl: './order.detail.component.html',
  styleUrls: ['./order.detail.component.scss']
})
export class OrderConfirmComponent implements OnInit {
  cartItems: {
    product:Product ,
     quantity:number 
  }[] = [];

  constructor(
    private cartService:CartService,
    private productService:ProductService
  ){

  }
  ngOnInit(): void {
    const cart = this.cartService.getCart();
    const productIds = Array.from(cart.keys()); //keys and values [productId,quantity]

    this.productService.getProductsByIds(productIds).subscribe({
      next: (products) => {
        debugger;
        //lambda 
        this.cartItems = productIds.map( (productId) => {
          debugger;
          const product = products.find( (p) => p.id === productId);

          if(product){
            //thay doi duong dan image anh hien thi
            product.image = `${Environment.apiUrl}/products/images/${product.image}`;
          }

          return {
            product:product!,
            quantity:cart.get(productId)! //! not null or undefined
          };

        } );
        console.log('Success');

      },
      complete:() => {
          debugger;
      },
      error:(error:any) => {
          debugger;
          console.error('Eror',error);
      },
    })

  }

  calculateTotal(): number { //for sum i range i -> n ; i++
    return this.cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  }
  


}
