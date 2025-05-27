import { Component, OnInit } from '@angular/core';
import { FormGroup ,FormBuilder, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { OrderDTO } from 'src/app/dtos/order/order.dto';
import { Environment } from 'src/app/enviroments/environment';
import { Product } from 'src/app/models/product';
import { CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  orderForm: FormGroup; //can phai khoi tao - lay gia tri tu form + valid

  cartItems: { //gia tri gan luc khoi tao
    product:Product ,
     quantity:number 
  }[] = [];

  cartQuantity : number =1;


  couponCode : string = '';

  totalAmount: number = 0;

  orderData: OrderDTO = {
      user_id: 0,
      full_name: '',
      phone_number: '',
      email: '',
      address: '',
      note: '',
      total_money: 0,
      shipping_method: 'Giao hàng nhanh express',
      shipping_fee: 0,
      payment_method: 'cod',
      cart_items: []
  }


  constructor(
    private cartService:CartService,
    private productService:ProductService,
    private orderService:OrderService,
    private fb:FormBuilder,
    private tokenService:TokenService,
    private router:Router
  ){
    //tao form group va cac form control tuong ung html
    this.orderForm = this.fb.group({
      fullname:['',Validators.required],
      email:['',Validators.email],
      phone_number:['',[Validators.required,Validators.minLength(6)]],
      address:['',[Validators.required,Validators.minLength(10)]],
      note:[''],
      shipping_method:['express'],
      payment_method:['cod']
    })
  }
  //lay thong tin tu cart show ra table
  ngOnInit(): void { 
    debugger;
    // this.cartService.clearCart();
    this.orderData.user_id=this.tokenService.getUserId();

    const cart = this.cartService.getCart(); //lay ra cart (key,value) [productId,quantity]
    const productIds = Array.from(cart.keys()); //keys  

    // === kiem tra ca type va value, == kiem tra value "5" = 5
    if(productIds.length===0){
      return ;
    }

    this.productService.getProductsByIds(productIds).subscribe({
      next: (products) => { //là kết quả trả về từ API 
        debugger;
        //lambda 
        this.cartItems = productIds.map( (productId) => { // map product tu sv voi cart client
          debugger;
          const product = products.find( (p) => p.id === productId);

          if(product){
            //thay doi duong dan image anh hien thi
            product.image = `${Environment.apiUrl}/products/images/${product.image}`;
          }
          // cartItems se chua list product va quantity
          return {
            product:product!,
            quantity:cart.get(productId)! // ltruyen vao key return value (id-quantity)
          };


        } );
        console.log('Success');
        this.calculateTotal(); // gan bang totalAmout

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

  increaseItemQuantity(productId: number): void {
    this.cartService.addToCart(productId, 1);
    alert('Tăng số lượng sản phẩm thành công');
    this.ngOnInit();
  }

  decreaseItemQuantity(productId: number): void {
    const cart = this.cartService.getCart();
    const currentQuantity = cart.get(productId) || 0;
    if (currentQuantity > 1) {
      this.cartService.addToCart(productId, -1);
      alert('Giảm số lượng sản phẩm thành công');
    } else {
      alert('Số lượng sản phẩm nhỏ hơn 1 thì sản phẩm sẽ bị xóa khỏi giỏ hàng');
      this.cartService.removeCart(productId);
    }
    this.ngOnInit();
  }
  removeItem(productId: number): void {
    const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng không?');
    if (confirmDelete) {
      this.cartService.removeCart(productId); // Xóa sản phẩm ra khỏi giỏ hàng
      alert('Xóa sản phẩm khỏi giỏ hàng thành công');
      this.ngOnInit(); // Load lại dữ liệu
    }
  }



  calculateTotal(): number { //for sum i range i -> n ; i++
    return this.totalAmount= this.cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  }

  placeOrder(){
    debugger;
    if(this.orderForm.valid){
      // Cach1: gan gia tri tu form vao doi tuong orderData
      // this.orderData.full_name=this.orderForm.get('fullname')!.value; // ! neu chac chan khong null, vi ban dau chua khoi tao value nen se loi

      //cach 2:su dung toan tu spread(...) de sao chep gia tri tu form vao orderData
      this.orderData={
        ...this.orderData,       // sao chép tất cả thuộc tính hiện có trong orderData
        ...this.orderForm.value, // ghi đè hoặc thêm mới các thuộc tính từ form
        total_money:this.calculateTotal()
      };

      this.orderData.cart_items= this.cartItems.map( cartItem => ({
        product_id:cartItem.product.id,
        quantity:cartItem.quantity
      }));

      this.orderService.placeOrder(this.orderData).subscribe({
        next:(response:any) => {
            debugger;
            alert('Dat hang thanh cong')
            this.cartService.clearCart();
            this.router.navigate(['/']);
        },
        complete() {
            debugger;

        },
        error(error:any) {
            alert(`Loi khi dat hang: ${error}`);
        },
      })


      


    }
  }

  
  
}
