import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductDetail } from 'src/app/dtos/product/product.detail';
import { UpdateProductDTO } from 'src/app/dtos/product/product.update';
import { Environment } from 'src/app/enviroments/environment';
import { Category } from 'src/app/models/category';
import { Product } from 'src/app/models/product';
import { ProductImage } from 'src/app/models/product.image';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-update-product-admin',
  templateUrl: './update.product.admin.component.html',
  styleUrls: ['./update.product.admin.component.scss']
})
export class UpdateProductAdminComponent implements OnInit {
  productId: number = 0;
  product: Product = {} as Product;
  updatedProduct: Product = {} as Product;
  categories: Category[] = [];
  images: ProductImage[] = [];
  uploadImages: File[] = [];
  currentImageIndex: number = 0;
  isLoading: boolean = false;
  uploadImagePreviews: string[] = [];


  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam && !isNaN(+idParam)) {
        this.productId = Number(idParam);
        this.getProductDetails();
      } else {
        alert('Invalid product ID!');
        this.router.navigate(['/admin/products']);
      }
    });

    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories: Category[]) => {
        this.categories = categories;
      },
      error: (error: any) => {
        console.error('Error fetching categories:', error);
        alert('Could not load categories.');
      }
    });
  }

  getProductDetails(): void {
  this.productService.getDetailProduct(this.productId).subscribe({
    next: (response: any) => { 
      const detail = response.result;
      this.product = detail.product;
      this.updatedProduct = { ...detail.product };

      if (detail.images && Array.isArray(detail.images)) {
        this.images = detail.images.map((img: ProductImage) => ({
        ...img,
        imageUrl: `${Environment.apiUrl}/products/images/${img.imageUrl}`
      }));
      } else {
        this.images = [];
      }
    },
    error: (err) => {
      console.error('Error fetching product details:', err);
      alert('Could not fetch product details.');
    }
  });
}


  onFileSelected(event: any): void {
  if (event.target.files && event.target.files.length > 0) {
    const selectedFiles: File[] = Array.from(event.target.files);

    const availableSlots = 5 - this.images.length;
    if (availableSlots <= 0) {
      alert('Bạn đã đạt giới hạn 5 ảnh. Hãy xóa bớt ảnh trước khi thêm mới.');
      return;
    }

    if (selectedFiles.length > availableSlots) {
      alert(`Bạn chỉ có thể thêm tối đa ${availableSlots} ảnh nữa. Chỉ lấy ảnh đầu tiên.`);
      this.uploadImages = selectedFiles.slice(0, availableSlots);
    } else {
      this.uploadImages = selectedFiles;
    }

      // Preview
      this.uploadImagePreviews = this.uploadImages.map(file => URL.createObjectURL(file));
    }
  }


  updateProduct(): void {
    if (!this.updatedProduct) {
      alert('Product data is not loaded yet.');
      return;
    }

    this.isLoading = true;

    const updateDTO: UpdateProductDTO = {
      name: this.updatedProduct.name,
      price: this.updatedProduct.price,
      description: this.updatedProduct.description,
      category_id: this.updatedProduct.category_id
    };

    this.productService.updateProduct(this.productId, updateDTO).subscribe({
      next: () => {
        if (this.uploadImages.length > 0) {
          this.productService.uploadImages(this.productId, this.uploadImages).subscribe({
            next: () => {
              this.uploadImages = [];
              this.getProductDetails();
              this.router.navigate(['/admin/products']);
              this.isLoading = false;
            },
            error: (error) => {
              console.error('Error uploading images:', error);
              alert(error.error || 'Image upload failed');
              this.isLoading = false;
            }
          });
        } else {
          this.getProductDetails();
          this.router.navigate(['/admin/products']);
          this.isLoading = false;
        }
      },
      error: (error: any) => {
        console.error('Error updating product:', error);
        alert(error.error || 'Update product failed');
        this.isLoading = false;
      }
    });
  }

  deleteImage(productImage: ProductImage): void {
    if (confirm('Are you sure you want to delete this image?')) {
      this.productService.deleteProductImage(productImage.id).subscribe({
        next: () => {
          this.getProductDetails(); // reload lại dữ liệu thay vì reload trang
        },
        error: (error) => {
          console.error('Error deleting image:', error);
          alert(error.error || 'Delete image failed');
        }
      });
    }
  }

  // Optional: nếu bạn muốn thêm chức năng duyệt ảnh
  showImage(index: number): void {
    if (index >= 0 && index < this.images.length) {
      this.currentImageIndex = index;
    }
  }

  nextImage(): void {
    if (this.currentImageIndex < this.images.length - 1) {
      this.currentImageIndex++;
    }
  }

  previousImage(): void {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    }
  }
}
