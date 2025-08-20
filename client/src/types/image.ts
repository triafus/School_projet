export interface Image {
  id: number;
  title: string;
  description?: string;
  url: string;
  key: string;
  is_approved: boolean;
  is_private: boolean;
  userId: number;
}
