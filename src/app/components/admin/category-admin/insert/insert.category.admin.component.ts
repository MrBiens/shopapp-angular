import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InsertCategoryDTO } from 'src/app/dtos/category/category.create';
import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-insert.category.admin',
  templateUrl: './insert.category.admin.component.html',
  styleUrls: ['./insert.category.admin.component.scss']
})
export class InsertCategoryAdminComponent {
  insertCategoryDTO: InsertCategoryDTO = {
      name: '',    
    };
  categories: Category[] = []; // Dữ liệu động từ categoryService
  constructor(    
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,    
    private productService: ProductService,    
  ) {
    
  } 
  ngOnInit() {
    
  }   

  insertCategory() {    
    this.categoryService.insertCategory(this.insertCategoryDTO).subscribe({
      next: (response: any) => {
        debugger
        this.router.navigate(['/admin/categories']);        
      },
      error: (error) => {
        debugger
        // Handle error while inserting the category
        alert(error.error)
        console.error('Error inserting category:', error);
      }
    });    
  }

}
