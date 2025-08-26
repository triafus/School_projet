import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { imageService } from "../services/imageServices";
import { Image } from "../types/image";
import { AuthService } from "../services/authServices";

export const useUserImages = () => {
  return useQuery({
    queryKey: ["userImages"],
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
    queryKey: ["allImages"],
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
    mutationKey: ["postImage"],
    mutationFn: async ({ file, imageData }: PostImagePayload) => {
      return await imageService.postImage(file, imageData);
    },
    onSuccess: () => {
      // Invalider les images de l'utilisateur et toutes les images
      queryClient.invalidateQueries({ queryKey: ["userImages"] });
      queryClient.invalidateQueries({ queryKey: ["allImages"] });
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
    mutationKey: ["patchImage"],
    mutationFn: async ({ imageId, updateData }: UpdateImagePayload) => {
      return await imageService.patchImage(imageId, updateData);
    },
    onSuccess: () => {
      // Invalider les images de l'utilisateur et toutes les images
      queryClient.invalidateQueries({ queryKey: ["userImages"] });
      queryClient.invalidateQueries({ queryKey: ["allImages"] });
    },
  });
};

type DeleteImagePayload = {
  imageId: number;
};

export const useDeleteImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteImage"],
    mutationFn: async ({ imageId }: DeleteImagePayload) => {
      return await imageService.deleteImage(imageId);
    },
    onSuccess: () => {
      // Invalider les images de l'utilisateur et toutes les images
      queryClient.invalidateQueries({ queryKey: ["userImages"] });
      queryClient.invalidateQueries({ queryKey: ["allImages"] });
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
    mutationKey: ["approveImage"],
    mutationFn: async ({ imageId, isApproved }: ApproveImagePayload) => {
      return await imageService.approveImage(imageId, isApproved);
    },
    onSuccess: () => {
      // Invalider les images de l'utilisateur et toutes les images
      queryClient.invalidateQueries({ queryKey: ["userImages"] });
      queryClient.invalidateQueries({ queryKey: ["allImages"] });
    },
  });
};

export const useSignedUrl = (imageId: number, isPrivate: boolean) => {
  return useQuery({
    queryKey: ["signedUrl", imageId],
    queryFn: async () => {
      if (!isPrivate) return null;
      return imageService.getSignedUrl(imageId);
    },
    staleTime: 50 * 1000, // Un peu moins que la durée de validité de l'URL (60s)
    refetchOnWindowFocus: true,
    enabled: isPrivate, // N'exécute la requête que si l'image est privée
  });
};
