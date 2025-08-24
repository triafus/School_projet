export interface ImagePreview {
  file: File;
  url: string;
  compressed?: File;
}

export const compressImage = (
  file: File,
  quality: number = 0.8
): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      const maxWidth = 1920;
      const maxHeight = 1080;
      let { width, height } = img;

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }

      canvas.width = width;
      canvas.height = height;

      ctx?.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        },
        "image/jpeg",
        quality
      );
    };

    img.src = URL.createObjectURL(file);
  });
};

export const validateImageFile = (file: File): string | null => {
  if (!file.type.startsWith("image/")) {
    return "Veuillez sélectionner un fichier image valide";
  }

  if (file.size > 10 * 1024 * 1024) {
    return "La taille maximale du fichier est de 10MB";
  }

  return null;
};

export const processImageFile = async (
  file: File,
  setCompressing: (compressing: boolean) => void
): Promise<ImagePreview | null> => {
  setCompressing(true);

  try {
    const previewUrl = URL.createObjectURL(file);
    const compressedFile = await compressImage(file);

    return {
      file,
      url: previewUrl,
      compressed: compressedFile,
    };
  } finally {
    setCompressing(false);
  }
};
