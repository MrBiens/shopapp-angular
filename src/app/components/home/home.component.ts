import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../models/product';
import { ProductService } from 'src/app/services/product.service';
import { CategoryService } from 'src/app/services/category.service';
import { Category } from 'src/app/models/category';
import { Environment } from 'src/app/enviroments/environment';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  products : Product[] = [];
  categories: Category[] = []; // Array to hold categories
  currentPage: number = 1;
  itemsPerPage: number = 122; // Number of items to display per page
  pages: number = 0; // Total number of pages
  totalPages: number = 0; // Total number of pages
  visiblePages: number[] = []; // Array to hold the visible page numbers
  keyword: string = '';
  selectedCategoryId: number = 1; // ID of the selected category



  constructor(
    private productService:ProductService,
    private categoryService:CategoryService,
    private router: Router,
  ) {

   }



  ngOnInit() {
    console.log('Keywords:', this.keyword);  // Kiểm tra giá trị keywords
    console.log('Selected Category ID:', this.selectedCategoryId);  // Kiểm tra giá trị selectedCategoryId
  
    this.getCategories();
    this.getProducts(this.keyword,this.selectedCategoryId,this.currentPage, this.itemsPerPage);
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
  
  goToProductDetail(productId: number): void {
    this.router.navigate([`/productdetail/${productId}`]); // Điều hướng đến trang chi tiết sản phẩm
  }

  searchProducts() {
    this.currentPage = 1; // Reset to the first page when searching
    this.itemsPerPage = 12;
    this.getProducts(this.keyword,this.selectedCategoryId,this.currentPage, this.itemsPerPage);
  } 

  getProducts(keyword:string, selectedCategoryId:number ,page: number, size: number) {
    this.productService.getProducts(keyword,selectedCategoryId,page, size).subscribe({
      next: (response: any) => {
        // Thay đổi từ response.products thành response.result.list
        if (response.result && response.result.list && Array.isArray(response.result.list)) {
          response.result.list.forEach((product: Product) => {
            product.url = Environment.apiUrl + '/products/images/' + product.image;
          });
          this.products = response.result.list;
          this.pages = response.totalPages;
          this.totalPages = response.result.totalPage; // Lấy giá trị totalPage đúng từ response.result
          this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
          console.log('currentPage:', this.currentPage);
          console.log('totalPages:', this.totalPages);
          console.log('visiblePages:', this.visiblePages);
        } else {
          console.error('Dữ liệu sản phẩm không hợp lệ');
        }
      },
      complete: () => {
        console.log('Sản phẩm đã được lấy thành công');
      },
      error: (error) => {
        console.error('Lỗi khi lấy sản phẩm:', error);
      }
    });
  }
  


  exampleMethod() {
    console.log('Example method called');
  }

  onPageChange(page: number) {
    debugger;
    this.currentPage = page;
    this.getProducts(this.keyword,this.selectedCategoryId,this.currentPage, this.itemsPerPage);
  }

  generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
    const pageCount = 5;
    let startPage = Math.max(1, currentPage - Math.floor(pageCount / 2)); // hiển thị 5 trang, bắt đầu từ trang 4 mới hiển thị tiếp (not 1,2,33)
    let endPage = Math.min(totalPages, startPage + pageCount - 1); // nếu là starPage = 2 thì 2 3 4 5 6 ( hiển thị 5 trang gần current page)
   
    if (endPage - startPage + 1 < pageCount) { // trường hợp gần cuối  endPage = Math.min(10, 7 + 5 - 1) = Math.min(10, 11) = 10

      startPage = Math.max(1, endPage - pageCount + 1); // hiển thị 5 trang cuối cùng
    }
  
    // Nếu không có trang nào
    if (totalPages === 0 || endPage < startPage) return [];
  
    
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }
  
  

}
