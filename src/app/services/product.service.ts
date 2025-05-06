import { Injectable } from "@angular/core";
import { Environment } from "../enviroments/environment";

import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Product } from "../models/product";
import { ProductDetail } from "../dtos/product/product.detail";

@Injectable({
    providedIn:'root'  
})
export class ProductService{
    private apiGetProducts = Environment.apiUrl+'/products';

    constructor(private http: HttpClient) { 
    }
// key word, categoryId
    getProducts(keyword:string, categoryId:number,page:number, size:number):Observable<Product[]>{
        const params =  new HttpParams()
        .set('keyword', keyword)
        .set('category_id', categoryId)
        .set('page', page)
        .set('size', size);
        return this.http.get<Product[]>(this.apiGetProducts, { params: params });
    };

    getDetailProduct(productId:number):Observable<ProductDetail>{
        return this.http.get<ProductDetail>(this.apiGetProducts + '/detail/' + productId);
    }

    
    
}