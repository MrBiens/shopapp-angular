import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { RevenueStatisticDTO } from 'src/app/dtos/statistic/revenue.statistics.dto';
import { StatisticService } from 'src/app/services/admin/statistic.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public isLoading = false;

  public barChartOptions: ChartOptions = { responsive: true };
  public barChartType: ChartType = 'bar';

  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Doanh thu' }
    ]
  };

  constructor(private statisticsService: StatisticService) {}

  ngOnInit(): void {
    this.loadRevenueChart('week'); // mặc định theo tuan 
  }

  loadRevenueChart(type: 'week' | 'month' | 'year'): void {
    this.isLoading = true; // Bắt đầu loading

    this.statisticsService.getRevenueStatistics(type, '', '').subscribe({
      next: (data: RevenueStatisticDTO[]) => {
        // Cập nhật biểu đồ
        this.barChartData = {
          labels: data.map(item => item.label),
          datasets: [
            {
              data: data.map(item => item.totalRevenue),
              label: 'Doanh thu',
              backgroundColor: '#ff4081',
              hoverBackgroundColor: '#ff80ab'

            }
          ]
        };
      },
      error: err => {
        console.error('Lỗi khi lấy dữ liệu thống kê', err);
      },
      complete: () => {
        this.isLoading = false; 
      }
    });
    
  }

}
