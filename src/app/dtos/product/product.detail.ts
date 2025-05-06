import { Product } from "src/app/models/product";
import { ProductImage } from "src/app/models/product.image";

export interface ProductDetail {
    product: Product;  // DTO chứa sản phẩm
    images: ProductImage[];  // Dữ liệu ảnh chi tiết cho sản phẩm
}