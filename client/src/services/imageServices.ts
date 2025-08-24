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

  patchImage: async (
    imageId: number,
    updateData: { title?: string; description?: string; is_private?: boolean }
  ): Promise<Image> => {
    const { data } = await apiClient.patch<Image>(
      `/images/${imageId}`,
      updateData
    );
    return data;
  },

  deleteImage: async (imageId: number): Promise<void> => {
    await apiClient.delete(`/images/${imageId}`);
  },

  approveImage: async (
    imageId: number,
    isApproved: boolean
  ): Promise<Image> => {
    const { data } = await apiClient.patch<Image>(
      `/images/${imageId}/approve`,
      {
        is_approved: isApproved,
      }
    );
    return data;
  },
};
