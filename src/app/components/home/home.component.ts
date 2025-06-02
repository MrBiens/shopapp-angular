import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../models/product';
import { ProductService } from 'src/app/services/product.service';
import { CategoryService } from 'src/app/services/category.service';
import { Category } from 'src/app/models/category';
import { Environment } from 'src/app/enviroments/environment';
import { BannerService } from 'src/app/services/banner.service';
import { BannerResponse } from 'src/app/dtos/banner/banner.response';
import { HomeService } from 'src/app/services/home.service';
import { ProductBestSales } from 'src/app/dtos/product/product.best.sales';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    @ViewChild('carousel', { static: false }) carousel!: ElementRef;

  banners: BannerResponse[] = []; // Thêm biến lưu danh sách banner
  bestSellingProducts: ProductBestSales[] = []; // <-- Thêm biến mới

  currentBannerIndex: number = 0; // <-- Chỉ số banner hiện tại

  products : Product[] = [];
  categories: Category[] = []; // Array to hold categories
  keyword: string = '';
  selectedCategoryId: number = 1; // ID of the selected category



  constructor(
    private bannerService:BannerService,
    private productService:ProductService,
    private categoryService:CategoryService,
    private homeService: HomeService,
    private router: Router,
  ) {

   }



  ngOnInit() {
    this.getBanners(); // Gọi phương thức lấy banner
    this.getCategories();
    this.getBestSellingProducts(); // Lấy sản phẩm bán chạy
  }
   getBestSellingProducts() {
    this.homeService.getBestSellingProducts().subscribe({
      next: (products) => {
        this.bestSellingProducts = products;
      },
      error: (err) => {
        console.error('Lỗi khi lấy sản phẩm bán chạy:', err);
      }
    });
  }
    scrollLeft() {
    if (this.carousel) {
      this.carousel.nativeElement.scrollBy({
        left: -220,
        behavior: 'smooth'
      });
    }
  }

  scrollRight() {
    if (this.carousel) {
      this.carousel.nativeElement.scrollBy({
        left: 220,
        behavior: 'smooth'
      });
    }
  }
  getBanners() {
    this.bannerService.getAllBanners().subscribe({
      next: (banners: BannerResponse[]) => {
        this.banners = banners;
      },
      error: (error) => {
        console.error('Lỗi khi tải banners:', error);
      }
    });
  }

  showPreviousBanner(): void {
    if (this.banners.length > 0) {
      this.currentBannerIndex =
        (this.currentBannerIndex - 1 + this.banners.length) % this.banners.length;
    }
  }

  showNextBanner(): void {
    if (this.banners.length > 0) {
      this.currentBannerIndex = (this.currentBannerIndex + 1) % this.banners.length;
    }
  }

  get currentBannerImageUrl(): string {
    return this.banners.length > 0
      ? this.bannerService.getBannerImage(this.banners[this.currentBannerIndex].imagePath)
      : '';
  }

  getCategories() {
    this.categoryService.getCategories().subscribe({
      next: (response: Category[]) => {
          this.categories = response;
        
      },
      complete: () => {
        console.log('Categories loaded successfully');
      },
      error: (error: any) => {
        console.error('Error loading categories:', error);
      }
    });
  }
  redirectToSearch() {
    this.router.navigate(['/search'], {
      queryParams: {
        keyword: this.keyword,
        categoryId: this.selectedCategoryId
      }
    });
  }
  
  goToProductDetail(productId: number): void {
    this.router.navigate([`/productdetail/${productId}`]); // Điều hướng đến trang chi tiết sản phẩm
  }

 

  
  

}
