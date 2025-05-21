import { Injectable } from "@angular/core";
import { Environment } from "../enviroments/environment";

import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import {map, Observable } from "rxjs";
import { Product } from "../models/product";
import { ProductDetail } from "../dtos/product/product.detail";
import { UpdateProductDTO } from "../dtos/product/product.update";
import { InsertProductDTO } from "../dtos/product/product.create";

@Injectable({
    providedIn:'root'  
})
export class ProductService{
    private apiGetProducts = Environment.apiUrl+'/products';

    private headers ={ 
        headers :this.createHeaders()
      };
    
    
     private createHeaders(token?: string): HttpHeaders {
      let headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });
    
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
    
      return headers;
    }

    constructor(private http: HttpClient) { 
    }
    // key word, categoryId
    getProducts(keyword:string, categoryId:number,page:number, size:number):Observable<Product[]>{
        const params =  new HttpParams()
        .set('keyword', keyword)
        .set('category_id', categoryId)
        .set('page', page)
        .set('size', size);
        return this.http.get<any>(this.apiGetProducts, { params: params });
    };

    getDetailProduct(productId:number):Observable<ProductDetail>{
        return this.http.get<any>(this.apiGetProducts + '/detail/' + productId);
    }

    getProductsByIds(productIds:number[]):Observable<Product[]>{
        const params = new HttpParams().set('ids',productIds.join(','));
        return this.http.get<any>(this.apiGetProducts+'/list-ids',{params}).pipe(
            map(response => response.result as Product[])
          );
    }

    deleteProduct(productId: number): Observable<string> {
        debugger
        return this.http.delete<string>(`${this.apiGetProducts}/${productId}`);
    }

    updateProduct(productId: number, updatedProduct: UpdateProductDTO): Observable<UpdateProductDTO> {
        return this.http.put<any>(`${this.apiGetProducts}/${productId}`, updatedProduct).pipe(
            map(
                response => response.result as Product
            )
        );
    }  

    insertProductWithImages(formData: FormData): Observable<any> {
        return this.http.post<any>(`${this.apiGetProducts}/create`, formData);
    }


    uploadImages(productId: number, files: File[]): Observable<any> {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
        }
        // Upload images for the specified product id
        return this.http.post(`${this.apiGetProducts}/uploads/${productId}`, formData);
    }

    
    deleteProductImage(id: number): Observable<string> {
        return this.http.delete(`${this.apiGetProducts}/product_images/${id}`, {
            responseType: 'text'
        });
    }

    
    
}