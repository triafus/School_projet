import axios from "axios";
import { Collection, CollectionFormData } from "../types/collection";
import { apiClient } from "../apiClient";


export const collectionService = {
  getAll: async (): Promise<Collection[]> => {
    const response = await apiClient.get("/collections");
    return response.data;
  },

  getOne: async (id: number): Promise<Collection> => {
    const response = await apiClient.get(`/collections/${id}`);
    return response.data;
  },

  create: async (collectionData: CollectionFormData): Promise<Collection> => {
    const { data } = await apiClient.post<Collection>(
      "/collections",
      collectionData
    );

    return data;
  },

  update: async (
    id: number,
    collectionData: CollectionFormData
  ): Promise<Collection> => {
    const { data } = await apiClient.patch<Collection>(
      `/collections/${id}`,
      collectionData
    );
    return data;
  },

  remove: async (id: number): Promise<void> => {
    await apiClient.delete(`/collections/${id}`);
  },

  updateImages: async (
    id: number,
    addImageIds?: number[],
    removeImageIds?: number[]
  ): Promise<Collection> => {
    const { data } = await apiClient.patch<Collection>(
      `/collections/${id}/images`,
      {
        addImageIds,
        removeImageIds,
      }
    );
    return data;
  },
};
