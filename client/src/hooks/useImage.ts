import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { imageService } from "../services/imageServices";
import { Image } from "../types/image";
import { AuthService } from "../services/authServices";

export const useUserImages = () => {
  return useQuery({
    queryKey: ["Image"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) return null;
      return (await AuthService.getProfile()).images;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const useImages = () => {
  return useQuery({
    queryKey: ["Image"],
    queryFn: imageService.getAllImages,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

type PostImagePayload = {
  file: File;
  imageData: Omit<Image, "id" | "url" | "key">;
};

export const usePostImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["Image"],
    mutationFn: async ({ file, imageData }: PostImagePayload) => {
      return await imageService.postImage(file, imageData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Image"] });
    },
  });
};

type UpdateImagePayload = {
  imageId: number;
  updateData: { title?: string; description?: string; is_private?: boolean };
};

export const usePatchImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["Image"],
    mutationFn: async ({ imageId, updateData }: UpdateImagePayload) => {
      return await imageService.patchImage(imageId, updateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Image"] });
    },
  });
};

type DeleteImagePayload = {
  imageId: number;
};

export const useDeleteImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["Image"],
    mutationFn: async ({ imageId }: DeleteImagePayload) => {
      return await imageService.deleteImage(imageId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Image"] });
    },
  });
};

type ApproveImagePayload = {
  imageId: number;
  isApproved: boolean;
};

export const useApproveImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["ApproveImage"],
    mutationFn: async ({ imageId, isApproved }: ApproveImagePayload) => {
      return await imageService.approveImage(imageId, isApproved);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Image"] });
    },
  });
};
