import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { UserService } from "../services/userServices";
import { User, UserRole } from "../types/user";

// Query keys constants for better maintainability
const USER_QUERY_KEYS = {
  all: ["users"] as const,
  lists: () => [...USER_QUERY_KEYS.all, "list"] as const,
  list: (filters: Record<string, any>) =>
    [...USER_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...USER_QUERY_KEYS.all, "detail"] as const,
  detail: (id: number) => [...USER_QUERY_KEYS.details(), id] as const,
} as const;

// User configuration
const USER_CONFIG = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  refetchOnWindowFocus: false,
  retry: 1,
} as const;

// Optimized hook for fetching all users
export const useUsers = (filters?: Record<string, any>) => {
  const queryKey = filters
    ? USER_QUERY_KEYS.list(filters)
    : USER_QUERY_KEYS.lists();

  return useQuery<User[]>({
    queryKey,
    queryFn: () => UserService.getAllUsers(),
    ...USER_CONFIG,
  });
};

// Optimized hook for fetching a single user
export const useUser = (userId: number) => {
  return useQuery<User>({
    queryKey: USER_QUERY_KEYS.detail(userId),
    queryFn: () => UserService.getUserById(userId),
    enabled: !!userId && userId > 0,
    ...USER_CONFIG,
  });
};

// Optimized hook for updating user role
export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, role }: { userId: number; role: UserRole }) =>
      UserService.updateUserRole(userId, role),
    onMutate: async ({ userId, role }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: USER_QUERY_KEYS.all });

      // Snapshot previous values
      const previousUsers = queryClient.getQueryData<User[]>(
        USER_QUERY_KEYS.lists()
      );
      const previousUser = queryClient.getQueryData<User>(
        USER_QUERY_KEYS.detail(userId)
      );

      // Optimistically update users list
      if (previousUsers) {
        queryClient.setQueryData<User[]>(
          USER_QUERY_KEYS.lists(),
          previousUsers.map((user) =>
            user.id === userId ? { ...user, role } : user
          )
        );
      }

      // Optimistically update single user
      if (previousUser) {
        queryClient.setQueryData<User>(USER_QUERY_KEYS.detail(userId), {
          ...previousUser,
          role,
        });
      }

      return { previousUsers, previousUser };
    },
    onError: (err, { userId }, context) => {
      // Rollback on error
      if (context?.previousUsers) {
        queryClient.setQueryData(
          USER_QUERY_KEYS.lists(),
          context.previousUsers
        );
      }
      if (context?.previousUser) {
        queryClient.setQueryData(
          USER_QUERY_KEYS.detail(userId),
          context.previousUser
        );
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.all });
    },
  });
};

// Optimized hook for deleting a user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => UserService.deleteUser(userId),
    onMutate: async (userId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: USER_QUERY_KEYS.all });

      // Snapshot previous value
      const previousUsers = queryClient.getQueryData<User[]>(
        USER_QUERY_KEYS.lists()
      );

      // Optimistically update
      if (previousUsers) {
        queryClient.setQueryData<User[]>(
          USER_QUERY_KEYS.lists(),
          previousUsers.filter((user) => user.id !== userId)
        );
      }

      // Remove individual user query
      queryClient.removeQueries({ queryKey: USER_QUERY_KEYS.detail(userId) });

      return { previousUsers };
    },
    onError: (err, userId, context) => {
      // Rollback on error
      if (context?.previousUsers) {
        queryClient.setQueryData(
          USER_QUERY_KEYS.lists(),
          context.previousUsers
        );
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.all });
    },
  });
};

// Hook for bulk operations
export const useBulkUserOperations = () => {
  const queryClient = useQueryClient();

  const bulkDelete = useMutation({
    mutationFn: (userIds: number[]) =>
      Promise.all(userIds.map((id) => UserService.deleteUser(id))),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.all });
    },
  });

  const bulkUpdateRole = useMutation({
    mutationFn: ({ userIds, role }: { userIds: number[]; role: UserRole }) =>
      Promise.all(userIds.map((id) => UserService.updateUserRole(id, role))),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.all });
    },
  });

  return {
    bulkDelete: bulkDelete.mutate,
    bulkUpdateRole: bulkUpdateRole.mutate,
    isBulkDeleting: bulkDelete.isPending,
    isBulkUpdating: bulkUpdateRole.isPending,
  };
};

// Hook for user statistics
export const useUserStats = () => {
  const { data: users, isLoading } = useUsers();

  const stats = useMemo(() => {
    if (!users) return null;

    return {
      total: users.length,
      admins: users.filter((user) => user.role === "admin").length,
      regularUsers: users.filter((user) => user.role === "user").length,
    };
  }, [users]);

  return {
    stats,
    isLoading,
  };
};
