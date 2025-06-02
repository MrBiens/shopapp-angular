// src/app/services/statistic.service.ts

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BestSellingProductDTO } from 'src/app/dtos/statistic/best.selling.product.dto';
import { RevenueStatisticDTO } from 'src/app/dtos/statistic/revenue.statistics.dto';
import { Environment } from 'src/app/enviroments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatisticService {

  private readonly apiUrlStatistic = Environment.apiUrl+ '/statistics';

  constructor(private http: HttpClient) {}

  getRevenueStatistics(type: string, startDate: string, endDate: string): Observable<RevenueStatisticDTO[]> {
    const params = new HttpParams()
      .set('type', type)
      .set('year', new Date().getFullYear().toString());

    return this.http.get<RevenueStatisticDTO[]>(`${this.apiUrlStatistic}/revenue`, { params });
  }

  getBestSellingProducts(startDate: string, endDate: string): Observable<BestSellingProductDTO[]> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get<BestSellingProductDTO[]>(`${this.apiUrlStatistic}/best-selling-products`, { params });
  }
}
