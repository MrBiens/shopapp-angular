import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product';
import { Router } from '@angular/router';
import { Environment } from 'src/app/enviroments/environment';
import { CategoryService } from 'src/app/services/category.service';
import { Category } from 'src/app/models/category';

@Component({
  selector: 'app-product-admin',
  templateUrl: './product.admin.component.html',
  styleUrls: ['./product.admin.component.scss']
})
export class ProductAdminComponent implements OnInit {

products: Product[] = [];
  keyword: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  categories: Category[] = [];
  selectedCategoryId: number = 0;
  visiblePages: number[] = []; // Thêm dòng này vào




  constructor(
    private productService: ProductService,
    private router: Router,
    private categoryService:CategoryService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }
  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: err => console.error('Lỗi load categories:', err)
    });
  }
  
  loadProducts() {
    this.productService.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage).subscribe({
      next: (response: any) => {
        if (response.result && Array.isArray(response.result.list)) {
          this.products = response.result.list.map((p: Product) => ({
            ...p,
            image: Environment.apiUrl + '/products/images/' + p.image
          }));
          this.totalPages = response.result.totalPage;

          this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);

        }
      },
      error: err => console.error(err)
    });
  }
  
  getCategoryName(categoryId: number): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : 'Không rõ';
  }

  onDelete(productId: number) {
    if (confirm('Bạn có chắc chắn muốn xoá sản phẩm này?')) {
      this.productService.deleteProduct(productId).subscribe({
        next: () => {
          // Nếu là phần tử cuối của trang hiện tại và không phải trang đầu
          if (this.products.length === 1 && this.currentPage > 1) {
            this.currentPage -= 1;
          }
          this.loadProducts();
        },
        error: err => console.error(err)
      });
    }
  }


  onEdit(productId: number) {
    this.router.navigate(['/admin/products/update', productId]);
  }

  onAdd() {
    this.router.navigate(['/admin/products/create']);
  }

  searchProducts() {
    this.currentPage = 1; // reset trang
    this.loadProducts(); // gọi lại với keyword, categoryId đã cập nhật
  }
  
  onPageChange(page: number) {
    debugger;
    this.currentPage = page;
    this.loadProducts();
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



  