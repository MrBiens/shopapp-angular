import { Component } from '@angular/core';
import { ProductDetail } from 'src/app/dtos/product/product.detail';
import { Environment } from 'src/app/enviroments/environment';
import { Product } from 'src/app/models/product';
import { ProductImage } from 'src/app/models/product.image';
import { ProductService } from 'src/app/services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
  styleUrls: ['./detail-product.component.scss']
})
export class DetailProductComponent {
  productDetail: ProductDetail | null = null;
  productId: number | null = null;
  currentImageIndex: number = 0;
  cartQuantity : number =1;


  constructor(
    private productService: ProductService,
    private router:Router,
    private route:ActivatedRoute,
    private cartService:CartService
  ) {}

  ngOnInit(): void {
    // Lấy productId từ URL
    this.productId = +this.route.snapshot.paramMap.get('id')!;

    // Gọi API lấy chi tiết sản phẩm
    if (this.productId !==null) {
      this.productService.getDetailProduct(this.productId).subscribe({
        next : (response : any) => {
          const result = response.result; // <== Response.result.(product&images)

          debugger;
          if(result.images && result.images.length > 0){
              result.images.forEach((product_image : ProductImage ) => { // 1 doi tuong product Image
                product_image.imageUrl=`${Environment.apiUrl}/products/images/${product_image.imageUrl}`;
              });
          }
          this.productDetail = {
            product: result.product,
            images: result.images
          };
          this.showImage(0);
        },
        complete:() => {
            debugger;
        },
        error:(error : any ) => {
            debugger;
        },
      });
    }else{
      console.error('Invalid productId',this.productId)
    }

  }

  showImage(index: number): void {
    if (
      this.productDetail &&
      this.productDetail.images &&
      this.productDetail.images.length > 0
    ) {
      if (index < 0) index = 0;
      if (index >= this.productDetail.images.length) {
        index = this.productDetail.images.length - 1;
      }
      this.currentImageIndex = index;
    }
  }

  nextImage(): void {
    this.showImage(this.currentImageIndex + 1);
  }

  previousImage(): void {
    this.showImage(this.currentImageIndex - 1);
  }

  addToCart():void{
    debugger;
    if(this.productDetail?.product){
      this.cartService.addToCart(this.productDetail.product.id,this.cartQuantity);
    }else{
      console.error('Khong the them san pham vao gio hang vi product la null');
    }
  }
  


  increaseQuantity():void{
    this.cartQuantity++;
  }

  decreaseQuantity():void{
    if(this.cartQuantity > 1){
      this.cartQuantity --;
    }
  }
  goToOrder(){
    this.router.navigate([`/order`]); // Điều hướng đến trang chi tiết sản phẩm
  }
  
  buyNow(){

  }


}
  








