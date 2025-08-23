// Performance configuration constants
export const PERFORMANCE_CONFIG = {
  // Debounce delays
  SEARCH_DEBOUNCE_MS: 300,
  RESIZE_DEBOUNCE_MS: 150,

  // Virtualization thresholds
  VIRTUALIZE_THRESHOLD: 100,

  // Image loading
  LAZY_LOADING_THRESHOLD: "200px",

  // Animation durations
  ANIMATION_DURATION_MS: 300,

  // Cache sizes
  MAX_CACHE_SIZE: 50,
} as const;

// Memoization helpers
export const MEMO_OPTIONS = {
  // For components that rarely change
  STABLE: { areEqual: () => false },

  // For components with simple props
  SHALLOW: undefined,
} as const;
