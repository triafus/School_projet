import React, { memo, useState, useCallback } from "react";
import { Box, Skeleton, SxProps, Theme } from "@mui/material";
import { getOptimizedImageUrl } from "../../utils/imageOptimization";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: number;
  sx?: SxProps<Theme>;
  loading?: "lazy" | "eager";
  onLoad?: () => void;
  onError?: () => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = memo(
  ({
    src,
    alt,
    width,
    height,
    quality = 80,
    sx,
    loading = "lazy",
    onLoad,
    onError,
  }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const optimizedSrc = getOptimizedImageUrl(src, width, height, quality);

    const handleLoad = useCallback(() => {
      setIsLoading(false);
      onLoad?.();
    }, [onLoad]);

    const handleError = useCallback(() => {
      setIsLoading(false);
      setHasError(true);
      onError?.();
    }, [onError]);

    if (hasError) {
      return (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "grey.200",
            color: "grey.500",
            ...sx,
          }}
        >
          Image non disponible
        </Box>
      );
    }

    return (
      <Box sx={{ position: "relative", ...sx }}>
        {isLoading && (
          <Skeleton
            variant="rectangular"
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          />
        )}
        <Box
          component="img"
          src={optimizedSrc}
          alt={alt}
          loading={loading}
          onLoad={handleLoad}
          onError={handleError}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: isLoading ? "none" : "block",
          }}
        />
      </Box>
    );
  }
);

OptimizedImage.displayName = "OptimizedImage";

export default OptimizedImage;
