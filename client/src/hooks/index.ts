// Authentication hooks
export { useAuth } from "./useAuth";
export {
  useProtectedRoute,
  useRoleAccess,
  useConditionalNavigation,
} from "./useProtectedRoutes";

// User management hooks
export {
  useUsers,
  useUser,
  useUpdateUserRole,
  useDeleteUser,
  useBulkUserOperations,
  useUserStats,
} from "./useUser";

// UI and form hooks
export { useError } from "./useError";
export { useFavorites } from "./useFavorites";
export { useForm } from "./useForm";

// Image management hooks
export { useImage, useImageGallery, useImageUpload } from "./useImage";

// Performance hooks
export {
  useDebounce,
  useThrottle,
  useIntersectionObserver,
  useVirtualScroll,
  usePerformanceMonitor,
  useOptimizedLocalStorage,
} from "./usePerformance";
