import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { imageService } from "../services/imageServices";
import { Image } from "../types/image";

export const useImages = () => {
  return useQuery({
    queryKey: ["Image"],
    queryFn: imageService.getAllImages,
    staleTime: 5 * 60 * 1000,
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
