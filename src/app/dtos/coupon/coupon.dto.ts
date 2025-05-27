export interface CouponDTO {
    couponId: string; // Mã coupon, không được trùng
    quantity: string; // Số lượng coupon
    salePrice: string; // Giá trị giảm giá của coupon
    expiredAt: Date; // Ngày hết hạn của coupon, định dạng YYYY-MM-DD
    
}

