export interface CouponResponse {
    couponId: string; // Mã coupon, không được trùng
    quantity: number; // Số lượng coupon    
    salePrice: number; // Giá trị giảm giá của coupon
    expiredAt: string; // Ngày hết hạn của coupon, định dạng YYYY-MM-DD
    createAt: string; // Ngày tạo coupon, định dạng ISO 8601
    updateAt: string; // Ngày cập nhật coupon, định dạng ISO 8601
}
