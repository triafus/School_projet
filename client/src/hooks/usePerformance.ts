import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { PERFORMANCE_CONFIG } from "../config/performance";

// Debounce hook
export const useDebounce = <T>(
  value: T,
  delay: number = PERFORMANCE_CONFIG.SEARCH_DEBOUNCE_MS
): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Throttle hook
export const useThrottle = <T>(
  value: T,
  limit: number = PERFORMANCE_CONFIG.RESIZE_DEBOUNCE_MS
): T => {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRan = useRef<number>(Date.now());

  useEffect(() => {
    const handler = setTimeout(
      () => {
        if (Date.now() - lastRan.current >= limit) {
          setThrottledValue(value);
          lastRan.current = Date.now();
        }
      },
      limit - (Date.now() - lastRan.current)
    );

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit]);

  return throttledValue;
};

// Intersection Observer hook for lazy loading
export const useIntersectionObserver = (
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const elementRef = useRef<HTMLElement | null>(null);

  const observer = useMemo(() => {
    return new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        setEntry(entry);
      },
      {
        threshold: 0.1,
        rootMargin: PERFORMANCE_CONFIG.LAZY_LOADING_THRESHOLD,
        ...options,
      }
    );
  }, [options]);

  useEffect(() => {
    const element = elementRef.current;
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [observer]);

  return {
    ref: elementRef,
    isIntersecting,
    entry,
  };
};

// Virtual scrolling hook
export const useVirtualScroll = <T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan: number = 5
) => {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleRange = useMemo(() => {
    const start = Math.floor(scrollTop / itemHeight);
    const end = Math.min(
      start + Math.ceil(containerHeight / itemHeight) + overscan,
      items.length
    );

    return {
      start: Math.max(0, start - overscan),
      end,
    };
  }, [scrollTop, itemHeight, containerHeight, overscan, items.length]);

  const visibleItems = useMemo(() => {
    return items
      .slice(visibleRange.start, visibleRange.end)
      .map((item, index) => ({
        item,
        index: visibleRange.start + index,
      }));
  }, [items, visibleRange]);

  const totalHeight = items.length * itemHeight;
  const offsetY = visibleRange.start * itemHeight;

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return {
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll,
  };
};

// Performance monitoring hook
export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<{
    renderTime: number;
    memoryUsage?: number;
    fps: number;
  }>({
    renderTime: 0,
    fps: 0,
  });

  const renderStartTime = useRef<number>(0);
  const frameCount = useRef<number>(0);
  const lastTime = useRef<number>(performance.now());

  const startRender = useCallback(() => {
    renderStartTime.current = performance.now();
  }, []);

  const endRender = useCallback(() => {
    const renderTime = performance.now() - renderStartTime.current;
    setMetrics((prev) => ({ ...prev, renderTime }));
  }, []);

  // FPS monitoring
  useEffect(() => {
    let animationId: number;

    const measureFPS = () => {
      frameCount.current++;
      const now = performance.now();

      if (now >= lastTime.current + 1000) {
        const fps = Math.round(
          (frameCount.current * 1000) / (now - lastTime.current)
        );
        setMetrics((prev) => ({ ...prev, fps }));
        frameCount.current = 0;
        lastTime.current = now;
      }

      animationId = requestAnimationFrame(measureFPS);
    };

    measureFPS();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  // Memory usage monitoring (if available)
  useEffect(() => {
    const measureMemory = () => {
      if ("memory" in performance) {
        const memory = (performance as any).memory;
        setMetrics((prev) => ({
          ...prev,
          memoryUsage: memory.usedJSHeapSize / 1024 / 1024, // MB
        }));
      }
    };

    const interval = setInterval(measureMemory, 5000);
    return () => clearInterval(interval);
  }, []);

  return {
    metrics,
    startRender,
    endRender,
  };
};

// Local storage with performance optimization
export const useOptimizedLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue] as const;
};
