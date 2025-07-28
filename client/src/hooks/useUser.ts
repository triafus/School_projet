import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserService } from "../services/userServices";
import { User, UserRole } from "../types/user";

export const useUsers = () => {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: UserService.getAllUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUser = (userId: number) => {
  return useQuery<User>({
    queryKey: ["user", userId],
    queryFn: () => UserService.getUserById(userId),
    enabled: !!userId, // Exécuter seulement si userId est défini
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, role }: { userId: number; role: UserRole }) =>
      UserService.updateUserRole(userId, role),
    onSuccess: (updatedUser) => {
      // Mettre à jour le cache de l'utilisateur spécifique
      queryClient.setQueryData(["user", updatedUser.id], updatedUser);

      // Invalider la liste des utilisateurs
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => UserService.deleteUser(userId),
    onSuccess: (_, userId) => {
      // Supprimer l'utilisateur du cache
      queryClient.removeQueries({ queryKey: ["user", userId] });

      // Invalider la liste des utilisateurs
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};
