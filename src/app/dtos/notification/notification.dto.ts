export interface NotificationRequest {
  recipientId?: number | null; // null nếu là thông báo chung
  title: string;
  content: string;
  type: 'SYSTEM' | 'USER' | string; // có thể thay đổi enum nếu có định nghĩa rõ hơn
  image?: File | null; // multipart file
}
