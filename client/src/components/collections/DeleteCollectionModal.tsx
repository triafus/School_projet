import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { Warning as WarningIcon } from "@mui/icons-material";
import { CustomButton } from "../CustomButton";
import { useDeleteCollection } from "../../hooks/useCollection";

interface DeleteCollectionModalProps {
  open: boolean;
  onClose: () => void;
  collectionId: number | null;
  collectionTitle: string;
  onSuccess?: () => void;
}

const DeleteCollectionModal = ({
  open,
  onClose,
  collectionId,
  collectionTitle,
  onSuccess,
}: DeleteCollectionModalProps) => {
  const { mutate: deleteCollection, isPending, error } = useDeleteCollection();

  const handleConfirmDelete = () => {
    if (collectionId) {
      deleteCollection(collectionId, {
        onSuccess: () => {
          onClose();
          onSuccess?.();
          // Could add toast notification here
        },
        onError: (error) => {
          console.error("Erreur lors de la suppression:", error);
        },
      });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <WarningIcon color="error" />
          <Typography variant="h6" component="span">
            Supprimer la collection
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Êtes-vous sûr de vouloir supprimer la collection{" "}
          <strong>"{collectionTitle}"</strong> ?
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Cette action est irréversible. Toutes les images associées à cette
          collection resteront disponibles dans votre galerie.
        </Typography>

        {error && (
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            Erreur lors de la suppression:{" "}
            {(error as any)?.message || "Erreur inconnue"}
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <CustomButton onClick={onClose} variant="outlined" disabled={isPending}>
          Annuler
        </CustomButton>
        <CustomButton
          onClick={handleConfirmDelete}
          color="error"
          disabled={isPending}
        >
          {isPending ? "Suppression..." : "Supprimer"}
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteCollectionModal;
