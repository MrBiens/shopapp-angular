import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/services/notification.service';
import { CouponResponse } from 'src/app/dtos/coupon/coupon.response';
import { CouponDTO } from 'src/app/dtos/coupon/coupon.dto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CouponService } from 'src/app/services/coupon.service';

@Component({
  selector: 'app-coupon-admin',
  templateUrl: './coupon.admin.component.html',
  styleUrls: ['./coupon.admin.component.scss']
})
export class CouponAdminComponent implements OnInit {
  coupons: CouponResponse[] = [];

  constructor(
    private couponService: CouponService,
  ) {}

  ngOnInit(): void {
    this.loadCoupons();
  }

  loadCoupons(): void {
    this.couponService.getCoupons().subscribe({
      next: (data) => this.coupons = data,
      error: (err) => console.error(err)
    });
  }
  onDelete(coupon: any) {
  const confirmed = confirm(`Bạn có chắc chắn muốn xóa mã giảm giá "${coupon.couponId}" không?`);
  } 

  
}
