import { Injectable } from "@angular/core";
import { Environment } from "../enviroments/environment";
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { ProductBestSales } from "../dtos/product/product.best.sales";

@Injectable({
providedIn:'root'  
})
export class HomeService {
    private apiProductBestSeller = Environment.apiUrl+'/products/best-sales';

    constructor(
        private http: HttpClient
    ){
    }

    getBestSellingProducts(): Observable<ProductBestSales[]> {
        return this.http.get<any>(this.apiProductBestSeller).pipe(
            map(response => {
                return (response.result.list as ProductBestSales[]).map(product => ({
                    ...product,
                    image: this.formatImageUrl(product.image)
                }));
            })
        );
    }
    private formatImageUrl(imageName: string): string {
        const baseImageUrl = 'http://localhost:8088/api/v1/products/images/';
        return `${baseImageUrl}${imageName}`;
    }


}