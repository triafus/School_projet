import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { imageService } from "../services/imageServices";
import { ImageFormData } from "../types/image";
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

export const useImages = (includePrivate?: boolean, onlyApproved?: boolean) => {
  return useQuery({
    queryKey: ["allImages", includePrivate, onlyApproved],
    queryFn: () => imageService.getAllImages(includePrivate, onlyApproved),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

type PostImagePayload = {
  file: File;
  imageData: ImageFormData;
};

export const usePostImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["postImage"],
    mutationFn: async ({ file, imageData }: PostImagePayload) => {
      console.log("imageData avant le return du mutationFn :", imageData);
      return await imageService.postImage(file, imageData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userImages"] });
      queryClient.invalidateQueries({ queryKey: ["allImages"] });
    },
  });
};

type UpdateImagePayload = {
  imageId: number;
  updateData: ImageFormData;
};

export const usePatchImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["patchImage"],
    mutationFn: async ({ imageId, updateData }: UpdateImagePayload) => {
      return await imageService.patchImage(imageId, updateData);
    },
    onSuccess: () => {
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
    staleTime: 50 * 1000,
    refetchOnWindowFocus: true,
    enabled: isPrivate,
  });
};
