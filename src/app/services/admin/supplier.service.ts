import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { Environment } from "src/app/enviroments/environment";
import { Supplier } from "src/app/models/supplier";

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private apiSupplierUrl = Environment.apiUrl + '/suppliers';

  constructor(private http: HttpClient) {}

  getSuppliers(): Observable<Supplier[]> {
    return this.http.get<any>(this.apiSupplierUrl).pipe(
      map(response =>  response.result as Supplier[])
    );
  }
  getSupplierById(supplierId: number): Observable<Supplier> {
      return this.http.get<any>(`${this.apiSupplierUrl}/${supplierId}`).pipe(
      map(response => response.result as Supplier)
      );
  }


  createSupplier(supplier: Supplier): Observable<Supplier> {
      return this.http.post<any>(`${this.apiSupplierUrl}/${supplier.supplier_id}`, supplier).pipe(
      map(response => response.result as Supplier)
      );
  }

  updateSupplier(supplier: Supplier): Observable<Supplier> {
      return this.http.put<any>(`${this.apiSupplierUrl}/${supplier.supplier_id}`, supplier).pipe(
      map(response => response.result as Supplier)
      );
  }

  deleteSupplier(supplierId: number): Observable<string> {
      return this.http.delete<string>(`${this.apiSupplierUrl}/${supplierId}`);
  }

}