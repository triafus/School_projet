import { useState, useEffect, useCallback, useMemo } from "react";
import { getOptimizedImageUrl, preloadImage } from "../utils/imageOptimization";

interface UseImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  lazy?: boolean;
  preload?: boolean;
  fallbackSrc?: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

interface UseImageReturn {
  src: string;
  isLoading: boolean;
  hasError: boolean;
  retry: () => void;
}

export const useImage = (
  originalSrc: string,
  options: UseImageOptions = {}
): UseImageReturn => {
  const {
    width,
    height,
    quality = 80,
    lazy = true,
    preload = false,
    fallbackSrc,
    onLoad,
    onError,
  } = options;

  const [isLoading, setIsLoading] = useState(!lazy);
  const [hasError, setHasError] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(!lazy || preload);

  // Memoized optimized source
  const optimizedSrc = useMemo(() => {
    if (hasError && fallbackSrc) return fallbackSrc;
    return getOptimizedImageUrl(originalSrc, width, height, quality);
  }, [originalSrc, width, height, quality, hasError, fallbackSrc]);

  // Load image function
  const loadImage = useCallback(async () => {
    if (!shouldLoad || hasError) return;

    setIsLoading(true);
    setHasError(false);

    try {
      await preloadImage(optimizedSrc);
      setIsLoading(false);
      onLoad?.();
    } catch (error) {
      setIsLoading(false);
      setHasError(true);
      onError?.(error as Error);
    }
  }, [optimizedSrc, shouldLoad, hasError, onLoad, onError]);

  // Retry function
  const retry = useCallback(() => {
    setHasError(false);
    setShouldLoad(true);
  }, []);

  // Start loading when shouldLoad changes
  useEffect(() => {
    if (shouldLoad) {
      loadImage();
    }
  }, [loadImage, shouldLoad]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || shouldLoad) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    // We need a ref to observe, but since this is a hook,
    // the component using this hook should handle the ref
    return () => observer.disconnect();
  }, [lazy, shouldLoad]);

  return {
    src: optimizedSrc,
    isLoading,
    hasError,
    retry,
  };
};

// Hook for managing multiple images
export const useImageGallery = (
  images: string[],
  options: UseImageOptions = {}
) => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [errorImages, setErrorImages] = useState<Set<string>>(new Set());
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleImageLoad = useCallback((src: string) => {
    setLoadedImages((prev) => new Set(prev).add(src));
  }, []);

  const handleImageError = useCallback((src: string) => {
    setErrorImages((prev) => new Set(prev).add(src));
  }, []);

  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const previousImage = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const goToImage = useCallback(
    (index: number) => {
      if (index >= 0 && index < images.length) {
        setCurrentIndex(index);
      }
    },
    [images.length]
  );

  // Preload adjacent images
  useEffect(() => {
    const preloadAdjacent = async () => {
      const adjacentIndices = [
        (currentIndex - 1 + images.length) % images.length,
        (currentIndex + 1) % images.length,
      ];

      for (const index of adjacentIndices) {
        const src = getOptimizedImageUrl(
          images[index],
          options.width,
          options.height,
          options.quality
        );
        try {
          await preloadImage(src);
          handleImageLoad(src);
        } catch {
          handleImageError(src);
        }
      }
    };

    if (images.length > 1) {
      preloadAdjacent();
    }
  }, [currentIndex, images, options, handleImageLoad, handleImageError]);

  const currentImage = useMemo(() => {
    if (!images[currentIndex]) return null;

    const src = images[currentIndex];
    return {
      src: getOptimizedImageUrl(
        src,
        options.width,
        options.height,
        options.quality
      ),
      isLoaded: loadedImages.has(src),
      hasError: errorImages.has(src),
    };
  }, [currentIndex, images, options, loadedImages, errorImages]);

  return {
    currentImage,
    currentIndex,
    totalImages: images.length,
    nextImage,
    previousImage,
    goToImage,
    loadedCount: loadedImages.size,
    errorCount: errorImages.size,
  };
};

// Hook for image upload with preview
export const useImageUpload = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileSelect = useCallback((selectedFile: File) => {
    if (!selectedFile.type.startsWith("image/")) {
      setUploadError("Le fichier sélectionné n'est pas une image");
      return;
    }

    setFile(selectedFile);
    setUploadError(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(selectedFile);
  }, []);

  const clearPreview = useCallback(() => {
    setPreview(null);
    setFile(null);
    setUploadError(null);
  }, []);

  const upload = useCallback(
    async (uploadFn: (file: File) => Promise<string>) => {
      if (!file) return null;

      setIsUploading(true);
      setUploadError(null);

      try {
        const result = await uploadFn(file);
        setIsUploading(false);
        return result;
      } catch (error) {
        setIsUploading(false);
        setUploadError(
          error instanceof Error ? error.message : "Erreur lors de l'upload"
        );
        return null;
      }
    },
    [file]
  );

  return {
    preview,
    file,
    isUploading,
    uploadError,
    handleFileSelect,
    clearPreview,
    upload,
  };
};
