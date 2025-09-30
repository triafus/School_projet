import { User } from "./user";
import { Image } from "./image";

export interface Collection {
  id: number;
  title: string;
  description?: string;
  is_private: boolean;
  userId: number;
  user?: User;
  images: Image[];
}

export interface CollectionFormData {
  title: string;
  description?: string;
  is_private: boolean;
  imageIds?: number[];
}
