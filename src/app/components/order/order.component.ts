import { Component, OnInit } from '@angular/core';
import { FormGroup ,FormBuilder, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { OrderDTO } from 'src/app/dtos/order/order.dto';
import { Environment } from 'src/app/enviroments/environment';
import { Product } from 'src/app/models/product';
import { CartService } from 'src/app/services/cart.service';
import { CouponService } from 'src/app/services/coupon.service';
import { OrderService } from 'src/app/services/order.service';
import { PaymentService } from 'src/app/services/payment.service';
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
  shippingMethods = [
    { label: 'Giao hàng nhanh express', value: 'express' },
    { label: 'Giao hàng tiêu chuẩn', value: 'standard' },
    { label: 'Nhận tại cửa hàng', value: 'store_pickup' }
  ];
  paymentMethods=  [
    { label: 'Thanh toán khi nhận hàng (COD)', value: 'cod' },
    { label: 'Thanh toán qua VNPay', value: 'vnpay' }
  ];


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
      vnp_txn_ref: '',
      cart_items: []
  }
  couponCode : string = '';

  couponMessage: string = '';
  discountedTotal: number = 0;


  constructor(
    private cartService:CartService,
    private productService:ProductService,
    private orderService:OrderService,
    private paymentService:PaymentService,
    private couponService:CouponService,
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
        this.updateDiscountedTotal(); // cap nhat tong tien da giam gia neu co ma giam gia
        

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
    this.updateDiscountedTotal();
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
    this.updateDiscountedTotal();
  }
  removeItem(productId: number): void {
    const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng không?');
    if (confirmDelete) {
      this.cartService.removeCart(productId); // Xóa sản phẩm ra khỏi giỏ hàng
      alert('Xóa sản phẩm khỏi giỏ hàng thành công');
      this.ngOnInit(); // Load lại dữ liệu
      this.updateDiscountedTotal();
    }
  }



  calculateTotal(): number { //for sum i range i -> n ; i++
    return this.totalAmount= this.cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  }
  applyCoupon(): void {

    if (!this.couponCode) {
      this.couponMessage = 'Vui lòng nhập mã giảm giá.';
      return;
    }

    this.couponService.getCouponById(this.couponCode).subscribe({
      next: (coupon) => {
        const now = new Date();
        const expired = new Date(coupon.expiredAt);

        if (coupon.quantity > 0 && expired >= now) {
          this.couponMessage = `Áp dụng mã thành công: giảm ${coupon.salePrice.toLocaleString()}đ`;
          this.discountedTotal = this.totalAmount - coupon.salePrice;
          if (this.discountedTotal < 0) this.discountedTotal = 0;

          // Gọi API giảm số lượng mã giảm giá
        } else if (coupon.quantity <= 0) {
          this.couponMessage = 'Mã giảm giá đã hết lượt sử dụng.';
          this.discountedTotal = 0;
        } else {
          this.couponMessage = 'Mã giảm giá đã hết hạn.';
          this.discountedTotal = 0;
        }
      },
      error: () => {
        this.couponMessage = 'Mã giảm giá không hợp lệ.';
        this.discountedTotal = 0;
      }
    });
  }
  updateDiscountedTotal() {
    if (this.couponCode) {
      this.couponService.getCouponById(this.couponCode).subscribe({
        next: (coupon) => {
          const now = new Date();
          const expired = new Date(coupon.expiredAt);

          if (coupon.quantity > 0 && expired >= now) {
            this.discountedTotal = this.calculateTotal() - coupon.salePrice;
            if (this.discountedTotal < 0) this.discountedTotal = 0;
          } else {
            this.discountedTotal = 0;
            this.couponMessage = 'Mã giảm giá không còn hiệu lực. Vui lòng kiểm tra lại.';
          }
        },
        error: () => {
          this.discountedTotal = 0;
          this.couponMessage = 'Không thể kiểm tra mã giảm giá.';
        }
      });
    } else {
      this.discountedTotal = 0;
    }
  }


  decreaseCouponQuantity(couponCode: string): void {
    this.couponService.decreaseQuantity(couponCode).subscribe({
      next: (message) => {
        console.log('API giảm số lượng mã giảm giá:', message);
        // Có thể cập nhật message hiển thị cho user, hoặc để trong console cũng được
        // Ví dụ:
        // this.couponMessage += ` (${message})`;
      },
      error: (error) => {
        console.error('Lỗi khi giảm số lượng mã giảm giá:', error);
        // Có thể báo lỗi cho user nếu muốn
        // alert('Lỗi khi cập nhật số lượng mã giảm giá.');
      }
    });
  }
  placeOrder() {
    const cart = this.cartService.getCart();
    if (cart === null || cart.size === 0) {
      alert('Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm vào giỏ hàng trước khi đặt hàng.');
      this.router.navigate(['/']);
      return;
    }

    if (this.orderForm.valid) {
      const totalMoney = this.discountedTotal > 0 ? this.discountedTotal : this.calculateTotal();

      this.orderData = {
        ...this.orderData,
        ...this.orderForm.value,
        total_money: totalMoney,
        
      };

      this.orderData.cart_items = this.cartItems.map(cartItem => ({
        product_id: cartItem.product.id,
        quantity: cartItem.quantity
      }));

      if (this.orderData.payment_method === 'vnpay') {
        this.paymentService.createPayment(totalMoney).subscribe({
          next: (response: any) => {
            const paymentUrl = response.paymentUrl;
            const vnp_TnxRef=new URL(paymentUrl).searchParams.get('vnp_TxnRef');
            this.orderData.vnp_txn_ref = vnp_TnxRef || ''; 
            this.orderService.placeOrder(this.orderData).subscribe({
              next: (orderResponse: any) => {
                alert('Đặt hàng thành công. Bạn sẽ được chuyển đến trang thanh toán VNPay.');
                if (this.couponCode) {
                  this.decreaseCouponQuantity(this.couponCode);
                }
                this.cartService.clearCart();
                // Chuyển hướng đến trang thanh toán VNPay
                window.location.href = paymentUrl;
              },
              error: (error: any) => {
                alert(`Lỗi khi thanh toán bằng VNPAY.Bạn cần liên hệ với người bán để thanh toán ${error.message}`);
              }
            });
           

          },
          error: (error) => {
            alert('Lỗi khi tạo thanh toán VNPay: ' + error.message);
          }
        });
        return;
      }

      // Nếu không phải VNPAY thì tiến hành đặt hàng luôn
      this.orderService.placeOrder(this.orderData).subscribe({
        next: (response: any) => {
          alert('Đặt hàng thành công.');
          if (this.couponCode) {
            this.decreaseCouponQuantity(this.couponCode);
          }
          this.cartService.clearCart();
          this.router.navigate(['/']);
        },
        error: (error: any) => {
          alert(`Lỗi khi đặt hàng: ${error.message}`);
        }
      });
    }
  }




  
      

  
  
}
