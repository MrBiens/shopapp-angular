import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-insert-notification-admin',
  templateUrl: './insert.notification.admin.component.html',
  styleUrls: ['./insert.notification.admin.component.scss']
})
export class InsertNotificationAdminComponent {
  notificationForm!: FormGroup;
  selectedImage!: File;
  loading = false;

  @Output() notificationCreated = new EventEmitter<any>(); // để component cha biết đã thêm xong

  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {
    this.initForm();
  }

  initForm(): void {
    this.notificationForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      type: ['SYSTEM', Validators.required], // mặc định là SYSTEM
      image: [null]
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImage = input.files[0];
    }
  }

  submitForm(): void {
    if (this.notificationForm.invalid) return;

    const formData = new FormData();
    formData.append('type', this.notificationForm.value.type);
    formData.append('title', this.notificationForm.value.title);
    formData.append('content', this.notificationForm.value.content);
    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }

    this.loading = true;
    this.notificationService.createNotification(formData).subscribe({
      next: data => {
        this.notificationCreated.emit(data); // emit dữ liệu mới cho cha
        this.notificationForm.reset();
        this.selectedImage = undefined!;
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.loading = false;
      }
    });
  }
}
