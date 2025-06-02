import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BannerService } from 'src/app/services/banner.service';

@Component({
  selector: 'app-insert-banner-admin',
  templateUrl: './insert.banner.admin.component.html',
  styleUrls: ['./insert.banner.admin.component.scss']
  })
export class InsertBannerAdminComponent {
  bannerForm: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  message: string = '';

  constructor(private bannerService: BannerService, private fb: FormBuilder) {
    this.bannerForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      position: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      isActive: [true, Validators.required]
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  submitBanner(): void {
    if (this.bannerForm.invalid) {
      this.message = 'Vui lòng điền đầy đủ thông tin.';
      return;
    }

    const formData = new FormData();
    formData.append('title', this.bannerForm.value.title);
    formData.append('description', this.bannerForm.value.description);
    formData.append('position', this.bannerForm.value.position);
    formData.append('startDate', this.bannerForm.value.startDate);
    formData.append('endDate', this.bannerForm.value.endDate);
    formData.append('isActive', this.bannerForm.value.isActive.toString());

    if (this.selectedFile) {
      formData.append('imagePath', this.selectedFile);
    }

    this.bannerService.createBanner(formData).subscribe({
      next: () => {
        this.message = 'Thêm banner thành công!';
        this.bannerForm.reset({ isActive: true });
        this.selectedFile = null;
        this.imagePreview = null;
      },
      error: () => {
        this.message = 'Có lỗi xảy ra khi thêm banner!';
      }
    });
  }
}
