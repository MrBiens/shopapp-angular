import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, map } from "rxjs";
import { Environment } from "../enviroments/environment";
import { BannerResponse } from "../dtos/banner/banner.response";

@Injectable({
  providedIn: 'root'
})
export class BannerService {
  private apiBanners = Environment.apiUrl + '/banners';

  constructor(private http: HttpClient) {}

  // Lấy tất cả banner
  getAllBanners(): Observable<BannerResponse[]> {
    return this.http.get<any>(`${this.apiBanners}`).pipe(
      map(response => response.result as BannerResponse[])
    );
  }

  // Lấy banner theo ID
  getBannerById(id: number): Observable<BannerResponse> {
    return this.http.get<any>(`${this.apiBanners}/${id}`).pipe(
      map(response => response.result as BannerResponse)
    );
  }

  // Hiển thị hình ảnh banner
  getBannerImage(imageName: string): string {
    return `${this.apiBanners}/images/${imageName}`;
  }

  // Tạo mới banner
  createBanner(formData: FormData): Observable<BannerResponse> {
    return this.http.post<any>(`${this.apiBanners}`, formData).pipe(
      map(response => response.result as BannerResponse)
    );
  }

  // Cập nhật banner
  updateBanner(id: number, formData: FormData): Observable<BannerResponse> {
    return this.http.put<any>(`${this.apiBanners}/${id}`, formData).pipe(
      map(response => response.result as BannerResponse)
    );
  }

  // Xóa banner
  deleteBanner(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiBanners}/${id}`).pipe(
      map(response => response.message)
    );
  }

  // Nếu bạn sử dụng soft delete (không bắt buộc)
  // softDeleteBanner(id: number): Observable<any> {
  //   return this.http.patch<any>(`${this.apiBanners}/${id}/soft-delete`, {}).pipe(
  //     map(response => response.message)
  //   );
  // }
}
