import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  Box,
  Typography,
  IconButton,
  Alert,
  Divider,
  Button,
} from "@mui/material";
import {
  Close as CloseIcon,
  CloudUpload as UploadIcon,
  Image as ImageIcon,
} from "@mui/icons-material";
import { useState, useRef, ChangeEvent } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { useAuth } from "../hooks/useAuth";
import { useImages, usePostImage } from "../hooks/useImage";
import { CustomButton } from "./CustomButton";

interface AddImageModalProps {
  open: boolean;
  onClose: () => void;
}

interface ImagePreview {
  file: File;
  url: string;
  compressed?: File;
}

export const AddImageModal = (props: AddImageModalProps) => {
  const { open, onClose } = props;

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<ImagePreview | null>(null);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [compressing, setCompressing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { user } = useAuth();
  const { mutateAsync: postImage } = usePostImage();

  const compressImage = (file: File, quality: number = 0.8): Promise<File> => {
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

  const processFile = async (file: File) => {
    !file.type.startsWith("image/") &&
      setError("Veuillez sélectionner un fichier image valide");

    file.size > 10 * 1024 * 1024 &&
      setError("La taille maximale du fichier est de 10MB");

    setError(null);
    setCompressing(true);

    try {
      const previewUrl = URL.createObjectURL(file);
      const compressedFile = await compressImage(file);

      setImagePreview({
        file,
        url: previewUrl,
        compressed: compressedFile,
      });

      if (!title) {
        const fileName = file.name.split(".")[0];
        setTitle(fileName.charAt(0).toUpperCase() + fileName.slice(1));
      }
    } catch (err) {
      setError("Erreur lors du traitement de l'image");
    } finally {
      setCompressing(false);
    }
  };

  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    file && processFile(file);
  };

  const handleSubmit = async () => {
    if (!imagePreview || !title.trim()) {
      setError("Veuillez remplir tous les champs obligatoires");
    } else {
      setLoading(true);
      setError(null);

      postImage({
        file: imagePreview.compressed || imagePreview.file,
        imageData: {
          title: title.trim(),
          description: description.trim(),
          is_private: isPrivate,
          is_approved: true,
          userId: user?.id || 0,
        },
      })
        .then(() => {
          handleClose();
        })
        .catch((err) =>
          setError(
            err instanceof Error
              ? err.message
              : "Erreur lors de l'ajout de l'image"
          )
        )
        .finally(() => setLoading(false));
    }
  };

  const handleClose = () => {
    loading && <LoadingSpinner />;
    imagePreview && URL.revokeObjectURL(imagePreview.url);

    setTitle("");
    setDescription("");
    setIsPrivate(false);
    setImagePreview(null);
    setError(null);
    setCompressing(false);

    onClose();
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    file && (await processFile(file));
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" component="div">
            Ajouter une image
          </Typography>
          <IconButton onClick={handleClose} disabled={loading}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* File Upload Area */}
        <Box
          sx={{
            border: "2px dashed",
            borderColor: imagePreview ? "success.main" : "grey.300",
            borderRadius: 2,
            p: 3,
            textAlign: "center",
            mb: 3,
            cursor: "pointer",
            transition: "all 0.2s",
            "&:hover": {
              borderColor: "primary.main",
              bgcolor: "action.hover",
            },
          }}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: "none" }}
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
                Formats supportés: JPG, PNG, GIF • Taille max: 10MB
              </Typography>
            </Box>
          )}
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Form Fields */}
        <TextField
          fullWidth
          label="Titre *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 2 }}
          disabled={loading}
        />

        <TextField
          fullWidth
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={3}
          sx={{ mb: 2 }}
          disabled={loading}
        />

        <FormControlLabel
          control={
            <Switch
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              disabled={loading}
            />
          }
          label="Image privée"
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <CustomButton
          color="error"
          onClick={handleClose}
          variant="outlined"
          disabled={loading}
        >
          Annuler
        </CustomButton>
        <CustomButton
          onClick={handleSubmit}
          disabled={!imagePreview || !title.trim()}
        >
          Ajouter l'image
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
};

export default AddImageModal;
