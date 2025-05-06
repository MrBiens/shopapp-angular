
import { Injectable } from "@angular/core";
import { Environment } from "../enviroments/environment";

import { HttpClient, HttpParams } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { Category } from "../models/category";

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




}