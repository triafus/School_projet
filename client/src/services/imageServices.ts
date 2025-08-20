import { apiClient } from "../apiClient";
import { Image } from "../types/image";

export const imageService = {
  getAllImages: async (): Promise<Image[]> => {
    const { data } = await apiClient.get<Image[]>("/images");
    return data;
  },

  postImage: async (
    file: File,
    imageData: Omit<Image, "id" | "url" | "key">
  ): Promise<Image> => {
    const formData = new FormData();

    formData.append("file", file);
    Object.entries(imageData).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    const { data } = await apiClient.post<Image>("/images", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return data;
  },
};
