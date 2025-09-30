import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { collectionService } from "../services/collectionServices";
import { Collection, CollectionFormData } from "../types/collection";

export const useCollections = () => {
  return useQuery<Collection[]>({
    queryKey: ["collections"],
    queryFn: collectionService.getAll,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const useCollection = (id: number) => {
  return useQuery<Collection>({
    queryKey: ["collection", id],
    queryFn: () => collectionService.getOne(id),
    enabled: !!id,
  });
};

export const useCreateCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["createCollection"],
    mutationFn: (payload: CollectionFormData) =>
      collectionService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
    },
  });
};

export const useUpdateCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateCollection"],
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: CollectionFormData;
    }) => collectionService.update(id, payload),
    onSuccess: (_, data) => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      queryClient.invalidateQueries({ queryKey: ["collection", data.id] });
    },
  });
};

export const useDeleteCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteCollection"],
    mutationFn: (id: number) => collectionService.remove(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData<Collection[]>(
        ["collections"],
        (old) => old?.filter((c) => c.id !== id) || []
      );
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      queryClient.invalidateQueries({ queryKey: ["collection", id] });
    },
  });
};
