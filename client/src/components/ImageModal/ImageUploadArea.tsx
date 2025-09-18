import React, { useRef, ChangeEvent } from "react";
import { Box, Typography } from "@mui/material";
import { CloudUpload as UploadIcon } from "@mui/icons-material";
import LoadingSpinner from "../LoadingSpinner";
import { ImagePreview, processImageFile } from "../../utils/imageUtils";

interface ImageUploadAreaProps {
  imagePreview: ImagePreview | null;
  setImagePreview?: (preview: ImagePreview | null) => void;
  compressing: boolean;
  setCompressing: (compressing: boolean) => void;
  disabled?: boolean;
}

export const ImageUploadArea = (props: ImageUploadAreaProps) => {
  const {
    imagePreview,
    setImagePreview,
    compressing,
    setCompressing,
    disabled = false,
  } = props;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const preview = await processImageFile(file, setCompressing);
      setImagePreview?.(preview);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      const preview = await processImageFile(file, setCompressing);
      setImagePreview?.(preview);
    }
  };

  return (
    <Box
      sx={{
        border: "2px dashed",
        borderColor: imagePreview ? "success.main" : "grey.300",
        borderRadius: 2,
        p: 3,
        textAlign: "center",
        mb: 3,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.2s",
        opacity: disabled ? 0.6 : 1,
        "&:hover": {
          borderColor: disabled ? "inherit" : "primary.main",
          bgcolor: disabled ? "inherit" : "action.hover",
        },
      }}
      onClick={() => !disabled && fileInputRef.current?.click()}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: "none" }}
        disabled={disabled}
      />

      {compressing ? (
        <LoadingSpinner message="Compression de l'image..." size={32} />
      ) : imagePreview ? (
        <Box>
          <Box
            component="img"
            src={imagePreview.url}
            alt="Aperçu"
            sx={{
              maxWidth: "100%",
              maxHeight: 200,
              borderRadius: 1,
              mb: 2,
            }}
          />
          <Typography variant="body2" color="success.main">
            Image sélectionnée • Cliquez pour changer
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Taille originale:{" "}
            {(imagePreview.file.size / 1024 / 1024).toFixed(2)} MB
            {imagePreview.compressed && (
              <>
                {" "}
                → Compressée:{" "}
                {(imagePreview.compressed.size / 1024 / 1024).toFixed(2)} MB
              </>
            )}
          </Typography>
        </Box>
      ) : (
        <Box>
          <UploadIcon sx={{ fontSize: 48, color: "grey.400", mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Sélectionnez une image
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Glissez-déposez une image ici ou cliquez pour parcourir
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 1, display: "block" }}
          >
            Formats supportés: JPG, PNG • Taille max: 10MB
          </Typography>
        </Box>
      )}
    </Box>
  );
};
