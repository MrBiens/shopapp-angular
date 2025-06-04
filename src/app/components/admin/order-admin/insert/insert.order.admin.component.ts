import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { ProductService } from 'src/app/services/product.service';
import { OrderService } from 'src/app/services/order.service';
import { UserResponse } from 'src/app/dtos/user/user.response';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-insert.order.admin',
  templateUrl: './insert.order.admin.component.html',
  styleUrls: ['./insert.order.admin.component.scss']
})
export class InsertOrderAdminComponent implements OnInit {
  orderForm!: FormGroup;
  users: UserResponse[] = [];
  productOptions: Product[][] = [];
  keyProducts: string[] = [];
  selectedUserInput: string = '';

  isSubmitting = false;
  page = 1;
  size = 10;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private productService: ProductService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.orderForm = this.fb.group({
      user_id: [null, Validators.required],
      full_name: ['', Validators.required],
      phone_number: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      note: [''],
      total_money: [0, Validators.required],
      shipping_method: ['', Validators.required],
      shipping_fee: [0, [Validators.required, Validators.min(0)]],
      payment_method: ['', Validators.required],
      cart_items: this.fb.array([])
    });
    

    
  }

  searchUsers(keyword: string) {
    this.userService.searchUsers(keyword, this.page, this.size).subscribe(users => {
      this.users = users;
    });
  }
  selectUser(user: UserResponse) {
    this.selectedUserInput = `${user.full_name} - ${user.phone_number}`;
    this.users = [];
    this.orderForm.patchValue({
      user_id: user.id,
      full_name: user.full_name,
      phone_number: user.phone_number,
      email: user.email,
      address: user.address
    });
    console.log('Form value after selectUser:', this.orderForm.value);

  }

  get cartItems(): FormArray {
    return this.orderForm.get('cart_items') as FormArray;
  }

  // Khi nhập input tìm kiếm sản phẩm tại dòng i
  searchProduct(index: number, keyword: string) {
    if(!keyword){
      this.productOptions[index] = [];
      return;
    }
    const categoryId = 0;

    this.productService.getProducts(keyword,categoryId,this.page,this.size).subscribe(
      (reponse :any)=>{
      this.productOptions[index]=reponse.result.list;
    })
  }
 


  selectProduct(index: number, product: Product) {
    this.keyProducts[index] = product.name; // Cập nhật tên hiển thị lên input tìm kiếm
    const item = this.cartItems.at(index);
    item.patchValue({
      product_name: product.name,
      product_id: product.id,
      price: product.price,
      quantity: 1  // Mặc định số lượng 1 khi chọn sản phẩm
    });
    this.productOptions[index] = [];
    this.calculateTotalMoney();
  }

 
  addCartItem(): void {
    const newItem = this.fb.group({
      product_id: [null, Validators.required],
      product_name: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [0, Validators.required],
    });

    newItem.valueChanges.subscribe(() => {
      this.calculateTotalMoney();
    });

    this.cartItems.push(newItem);
    this.productOptions.push([]);
    this.calculateTotalMoney(); // tính tổng ngay khi thêm

  }

  removeCartItem(index: number): void {
    this.cartItems.removeAt(index);
    this.productOptions.splice(index, 1);
    this.keyProducts.splice(index, 1);  // Thêm dòng này
    this.calculateTotalMoney();
  }

  calculateTotalMoney() {
    let total = 0;
    this.cartItems.controls.forEach(item => {
      const price = item.get('price')?.value || 0;
      const quantity = item.get('quantity')?.value || 0;
      total += price * quantity;
    });
    this.orderForm.get('total_money')?.setValue(total);
  }

  submit() {
    if (this.orderForm.invalid) {
      console.warn('Form invalid:', this.orderForm);
      console.warn('Invalid controls:');
      Object.keys(this.orderForm.controls).forEach(key => {
        const control = this.orderForm.get(key);
        if (control?.invalid) {
          console.warn(`- ${key} invalid:`, control.errors);
        }
      });

      this.cartItems.controls.forEach((item, index) => {
        if (item.invalid) {
          console.warn(`Cart item ${index} invalid:`, item.errors, item.value);
        }
      });

      return;
    }

    this.isSubmitting = true;
    const rawValue = this.orderForm.value;

     const orderRequest = {
      ...rawValue,
      cart_items: rawValue.cart_items.map((item: any) => ({
        product_id: item.product_id,
        quantity: item.quantity
      }))
    };

    this.orderService.createOrderByAdmin(orderRequest).subscribe({
      next: () => {
        alert('Tạo đơn hàng thành công!');
        this.orderForm.reset();
        this.cartItems.clear();
        this.productOptions = [];
        this.addCartItem();
        this.isSubmitting = false;
        this.selectedUserInput = '';
        this.users = [];
      },
      error: () => {
        alert('Có lỗi xảy ra khi tạo đơn hàng.');
        this.isSubmitting = false;
      }
    });
  }

}
