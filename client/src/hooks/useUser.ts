import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserService } from "../services/userServices";
import { User, UserRole } from "../types/user";

export const useUsers = () => {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: UserService.getAllUsers,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const useUser = (userId: number) => {
  return useQuery<User>({
    queryKey: ["user", userId],
    queryFn: () => UserService.getUserById(userId),
    enabled: !!userId,
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["users"],
    mutationFn: ({ userId, role }: { userId: number; role: UserRole }) =>
      UserService.updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => UserService.deleteUser(userId),
    onSuccess: (_, userId) => {
      queryClient.setQueryData<User[]>(
        ["users"],
        (old) => old?.filter((user) => user.id !== userId) || []
      );
    },
  });
};
