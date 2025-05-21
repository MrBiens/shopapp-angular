
import { Injectable } from "@angular/core";
import { Environment } from "../enviroments/environment";

import { HttpClient, HttpParams } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { Category } from "../models/category";
import { InsertCategoryDTO } from "../dtos/category/category.create";
import { UpdateCategoryDTO } from "../dtos/category/category.update";

@Injectable({
providedIn:'root'  
})
export class CategoryService{
private apiGetCategories = Environment.apiUrl+'/categories';

constructor(private http: HttpClient) { 
}
// key word, categoryId
  getCategories(): Observable<Category[]> {
      return this.http.get<any>(this.apiGetCategories).pipe(
        map(response => response.result as Category[])
      );
  }

  getDetailCategory(id: number): Observable<Category> {
    return this.http.get<any>(`${this.apiGetCategories}/${id}`).pipe(map(
        response => response.result as Category
    ));
  }

  deleteCategory(id: number): Observable<string> {
    debugger
    return this.http.delete<string>(`${this.apiGetCategories}/${id}`);
  }

  updateCategory(id: number, updatedCategory: UpdateCategoryDTO): Observable<UpdateCategoryDTO> {
    return this.http.put<any>(`${this.apiGetCategories}/${id}`, updatedCategory).pipe(map(
        response => response.result as Category
    ));;
  }  

  insertCategory(insertCategoryDTO: InsertCategoryDTO): Observable<any> {
    // Add a new category
    return this.http.post(`${this.apiGetCategories}`, insertCategoryDTO);
  }





}