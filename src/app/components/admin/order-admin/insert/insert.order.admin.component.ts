import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { ProductService } from 'src/app/services/product.service';
import { OrderService } from 'src/app/services/order.service';
import { UserResponse } from 'src/app/dtos/user/user.response';
import { Product } from 'src/app/models/product';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-insert.order.admin',
  templateUrl: './insert.order.admin.component.html',
  styleUrls: ['./insert.order.admin.component.scss']
})
export class InsertOrderAdminComponent implements OnInit, OnDestroy {
  orderForm!: FormGroup;
  users: UserResponse[] = [];
  isSubmitting = false;

  productOptions: Product[][] = [];

  // RxJS Subjects for autocomplete inputs
  private userInput$ = new Subject<string>();
  private productInputSubjects: Subject<string>[] = [];

  // Subscriptions for cleanup
  private subscriptions: Subscription[] = [];

  selectedUserInput: string = '';

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

    this.addCartItem();

    // User input subscription with debounce + API call
    const userSub = this.userInput$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(keyword => {
        if (!keyword.trim()) {
          this.users = [];
          this.orderForm.patchValue({
            user_id: null,
            full_name: '',
            phone_number: '',
            email: '',
            address: ''
          });
          return [];
        }
        return this.userService.getUsers(keyword, 1, 10);
      })
    ).subscribe(res => {
      if (res && res.result) {
        this.users = res.result;
      } else {
        this.users = [];
      }
    });
    this.subscriptions.push(userSub);
  }

  get cartItems(): FormArray {
    return this.orderForm.get('cart_items') as FormArray;
  }

  createCartItem(): FormGroup {
    const fg = this.fb.group({
      product_name: ['', Validators.required],
      product_id: [null, Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });

    // Tạo Subject mới cho input sản phẩm tương ứng
    const productInput$ = new Subject<string>();
    this.productInputSubjects.push(productInput$);

    const sub = productInput$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(keyword => {
        if (!keyword.trim()) {
          this.productOptions[this.cartItems.length - 1] = [];
          return [];
        }
        return this.productService.getProducts(keyword, 0, 1, 10);
      })
    ).subscribe(products => {
      const index = this.productInputSubjects.indexOf(productInput$);
      if (index !== -1) {
        this.productOptions[index] = products;
      }
    });
    this.subscriptions.push(sub);

    return fg;
  }

  addCartItem() {
    this.cartItems.push(this.createCartItem());
    this.productOptions.push([]);
  }

  removeCartItem(index: number) {
    this.cartItems.removeAt(index);
    this.productOptions.splice(index, 1);
    this.productInputSubjects.splice(index, 1);
    this.calculateTotalMoney();
  }

  // Khi nhập input khách hàng
  onUserInput(keyword: string) {
    this.selectedUserInput = keyword;
    this.userInput$.next(keyword);
  }

  // Khi chọn user từ danh sách gợi ý
  onUserSelect(user: UserResponse) {
    this.selectedUserInput = `${user.full_name} - ${user.phone_number}`;
    this.users = [];
    this.orderForm.patchValue({
      user_id: user.id,
      full_name: user.full_name,
      phone_number: user.phone_number,
      email: user.email,
      address: user.address
    });
  }

  // Khi nhập input tìm kiếm sản phẩm tại dòng i
  searchProduct(index: number, keyword: string) {
    const productInput$ = this.productInputSubjects[index];
    if (productInput$) {
      productInput$.next(keyword);
    }
  }

  selectProduct(index: number, product: Product) {
    const item = this.cartItems.at(index);
    item.patchValue({
      product_name: product.name,
      product_id: product.id,
      price: product.price
    });
    this.productOptions[index] = [];
    this.calculateTotalMoney();
  }

  calculateTotalMoney() {
    let total = 0;
    this.cartItems.controls.forEach(item => {
      const price = +item.get('price')?.value || 0;
      const quantity = +item.get('quantity')?.value || 0;
      total += price * quantity;
    });

    const shippingFee = +this.orderForm.get('shipping_fee')?.value || 0;
    total += shippingFee;

    this.orderForm.patchValue({
      total_money: total
    });
  }

  submit() {
    if (this.orderForm.invalid) return;

    this.isSubmitting = true;
    const orderData = this.orderForm.value;

    this.orderService.createOrderByAdmin(orderData).subscribe({
      next: () => {
        alert('Tạo đơn hàng thành công!');
        this.orderForm.reset();
        this.cartItems.clear();
        this.productOptions = [];
        this.productInputSubjects = [];
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

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
