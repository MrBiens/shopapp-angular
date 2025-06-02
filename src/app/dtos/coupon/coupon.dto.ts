export interface CouponDTO {
    couponId: string; // Mã coupon, không được trùng
    quantity: string; // Số lượng coupon
    salePrice: string; // Giá trị giảm giá của coupon
    minimumOrderAmount: string; // Số tiền tối thiểu để áp dụng mã
    expiredAt: Date; // Ngày hết hạn của coupon, định dạng YYYY-MM-DD
    
}

