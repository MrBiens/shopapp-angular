export interface NotificationResponse {
  id: number;
  authorName: string;
  recipientName: string;
  title: string;
  content: string;
  type: string;
  image: string; // tên file ảnh hoặc đường dẫn
  createAt: string | null;
  updateAt: string | null;
  active: boolean;
  read: boolean;
}
