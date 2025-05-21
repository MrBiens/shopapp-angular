import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InsertProductDTO } from 'src/app/dtos/product/product.create';
import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-insert.product.admin',
  templateUrl: './insert.product.admin.component.html',
  styleUrls: ['./insert.product.admin.component.scss']
})
export class InsertProductAdminComponent {
  insertProductDTO: InsertProductDTO = {
    name: '',
    price: 0,
    description: '',
    category_id: 1,
    images: []
  };
  uploadImages: File[] = [];
  uploadImagePreviews: string[] = [];


  categories: Category[] = []; // Dữ liệu động từ categoryService
  constructor(    
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,    
    private productService: ProductService,    
  ) {
    
  } 
  ngOnInit() {
    this.getCategories()
  } 
  getCategories() {
    this.categoryService.getCategories().subscribe({
      next: (categories: Category[]) => {
        debugger
        this.categories = categories;
      },
      complete: () => {
        debugger;
      },
      error: (error: any) => {
        console.error('Error fetching categories:', error);
      }
    });
  }
  onFileChange(event: any) {
    // Retrieve selected files from input element
    const files = event.target.files;
    // Limit the number of selected files to 5
    if (files.length > 5) {
      alert('Please select a maximum of 5 images.');
      return;
    }
    // Store the selected files in the newProduct object
    this.insertProductDTO.images = files;
  }

  insertProduct() {
    const formData = new FormData();

    // Thêm dữ liệu sản phẩm
    formData.append('name', this.insertProductDTO.name);
    formData.append('price', this.insertProductDTO.price.toString());
    formData.append('description', this.insertProductDTO.description);
    formData.append('categoryId', this.insertProductDTO.category_id.toString()); // phải dùng 'categoryId'

    // Thêm ảnh
    this.uploadImages.forEach((file) => {
      formData.append('files', file);
    });

    this.productService.insertProductWithImages(formData).subscribe({
      next: (response: any) => {
        const product = response.result; 
        console.log('Sản phẩm đã tạo:', product);
        this.router.navigate(['../'], { relativeTo: this.route });
      },
      error: (err) => {
        alert(err.error?.message || 'Lỗi tạo sản phẩm');
      }
    });
  }



  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFiles: File[] = Array.from(event.target.files);

      const availableSlots = 5 - this.uploadImages.length;
      if (availableSlots <= 0) {
        alert('Bạn đã đạt giới hạn 5 ảnh. Hãy xóa bớt ảnh trước khi thêm mới.');
        return;
      }

      let filesToAdd: File[];

      if (selectedFiles.length > availableSlots) {
        alert(`Bạn chỉ có thể thêm tối đa ${availableSlots} ảnh nữa. Chỉ lấy ${availableSlots} ảnh đầu tiên.`);
        filesToAdd = selectedFiles.slice(0, availableSlots);
      } else {
        filesToAdd = selectedFiles;
      }

      // Cập nhật mảng ảnh upload
      this.uploadImages = [...this.uploadImages, ...filesToAdd];
      // Cập nhật mảng ảnh xem trước
      this.uploadImagePreviews = this.uploadImages.map(file => URL.createObjectURL(file));
      // Gán vào insertProductDTO.images để upload sau
      this.insertProductDTO.images = this.uploadImages;
    }
  }

  removeImage(index: number): void {
    this.uploadImages.splice(index, 1);
    this.uploadImagePreviews.splice(index, 1);
    this.insertProductDTO.images = this.uploadImages;
  }



}
