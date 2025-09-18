import React from "react";
import { Typography, Box } from "@mui/material";
import { BaseImageModal } from "./BaseImageModal";
import { CustomButton } from "../CustomButton";
import { Image } from "../../types/image";
import { useDeleteImage } from "../../hooks/useImage";

interface DeleteImageModalProps {
  open: boolean;
  onClose: () => void;
  image: Image | null;
  onDelete?: () => void;
}

export const DeleteImageModal = (props: DeleteImageModalProps) => {
  const { open, onClose, image, onDelete } = props;
  const {
    mutateAsync: deleteImage,
    isPending,
    error,
    reset,
  } = useDeleteImage();

  const handleDelete = async () => {
    if (!image) return;

    await deleteImage({ imageId: image.id }).then(() => {
      handleClose();
      onDelete && onDelete();
    });
  };

  const handleClose = () => {
    if (!isPending) {
      onClose();
    }
  };

  const actions = (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        justifyContent: "flex-end",
        width: "100%",
      }}
    >
      <CustomButton variant="outlined" onClick={onClose} disabled={isPending}>
        Annuler
      </CustomButton>
      <CustomButton
        variant="contained"
        onClick={handleDelete}
        loading={isPending}
        sx={{
          backgroundColor: "rgb(170, 14, 14)",
          "&:hover": {
            backgroundColor: "rgb(201, 16, 16)",
          },
        }}
      >
        Supprimer
      </CustomButton>
    </Box>
  );

  return (
    <BaseImageModal
      open={open}
      onClose={onClose}
      title="Supprimer l'image"
      actions={actions}
      error={error?.message || null}
      onErrorClose={() => reset()}
      loading={isPending}
    >
      <Box sx={{ py: 2 }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Êtes-vous sûr de vouloir supprimer cette image ?
        </Typography>

        {image && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <strong>Titre :</strong> {image.title}
            </Typography>
            {image.description && (
              <Typography variant="body2" color="text.secondary">
                <strong>Description :</strong> {image.description}
              </Typography>
            )}
          </Box>
        )}

        <Typography variant="body2" color="error" sx={{ fontWeight: 500 }}>
          Cette action est irréversible.
        </Typography>
      </Box>
    </BaseImageModal>
  );
};
