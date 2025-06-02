import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BannerResponse } from 'src/app/dtos/banner/banner.response';
import { BannerService } from 'src/app/services/banner.service';

@Component({
  selector: 'app-banner-admin',
  templateUrl: './banner.admin.component.html',
  styleUrls: ['./banner.admin.component.scss']
})
export class BannerAdminComponent implements OnInit {
  banners:BannerResponse[]=[];

  constructor(
    private bannerService:BannerService
  ){

  }
  ngOnInit(): void {
    this.loadBanners();
  }

  loadBanners(): void {
  this.bannerService.getAllBanners().subscribe({
    next: data => {
      // map lại image thành URL đầy đủ
      this.banners = data.map(banner => ({
        ...banner,
        imagePath: banner.imagePath
          ? this.bannerService.getBannerImage(banner.imagePath)
          : ''
      }));
    },
    error: err => console.error(err)
  });
}
  
  deleteBanner(id: number): void {
    if (confirm('Bạn có chắc chắn muốn xóa banner này không?')) {
      this.bannerService.deleteBanner(id).subscribe(() => {
        this.loadBanners();
      });
    }
  }

}
