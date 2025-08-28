import { User } from "./user";

export interface Image {
  id: number;
  title: string;
  description?: string;
  url: string;
  key: string;
  is_approved: boolean;
  is_private: boolean;
  userId: number;
  user?: User;
}

export interface ImageFormData {
  title: string;
  description?: string;
  is_private: boolean;
  userId: number;
}
