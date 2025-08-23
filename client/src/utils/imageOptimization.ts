// Image optimization utilities
export const getOptimizedImageUrl = (
  url: string,
  width?: number,
  height?: number,
  quality: number = 80
): string => {
  // For Unsplash images, we can add optimization parameters
  if (url.includes("unsplash.com")) {
    const params = new URLSearchParams();
    if (width) params.set("w", width.toString());
    if (height) params.set("h", height.toString());
    params.set("q", quality.toString());
    params.set("auto", "format");

    return `${url}&${params.toString()}`;
  }

  return url;
};

export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

export const createImageSrcSet = (baseUrl: string, sizes: number[]): string => {
  return sizes
    .map((size) => `${getOptimizedImageUrl(baseUrl, size)} ${size}w`)
    .join(", ");
};
