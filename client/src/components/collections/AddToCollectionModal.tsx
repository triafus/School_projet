import React, { useState, useMemo } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material";
import { CheckCircle, Collections } from "@mui/icons-material";
import { BaseImageModal } from "../ImageModal/BaseImageModal";
import { CustomButton } from "../CustomButton";
import { Collection } from "../../types/collection";
import { Image } from "../../types/image";
import { useCollections } from "../../hooks/useCollection";
import { useUpdateCollectionImages } from "../../hooks/useCollection";
import { useAuth } from "../../hooks/useAuth";

interface AddToCollectionModalProps {
  open: boolean;
  onClose: () => void;
  image: Image | null;
}

export const AddToCollectionModal = ({
  open,
  onClose,
  image,
}: AddToCollectionModalProps) => {
  const [selectedCollectionId, setSelectedCollectionId] = useState<number | null>(
    null
  );
  const { user } = useAuth();
  const { data: collections = [], isLoading } = useCollections();
  const {
    mutateAsync: updateCollectionImages,
    isPending: isAdding,
    error,
  } = useUpdateCollectionImages();

  // Filtrer seulement les collections de l'utilisateur
  const userCollections = useMemo(() => {
    if (!user) return [];
    return collections.filter((c) => c.userId === user.id);
  }, [collections, user]);

  // Vérifier si l'image est déjà dans chaque collection
  const collectionsWithImageStatus = useMemo(() => {
    if (!image) return [];
    return userCollections.map((collection) => {
      const hasImage = collection.images?.some((img) => img.id === image.id);
      return {
        ...collection,
        hasImage,
      };
    });
  }, [userCollections, image]);

  const handleSelectCollection = (collectionId: number) => {
    setSelectedCollectionId(collectionId);
  };

  const handleAddToCollection = async () => {
    if (!selectedCollectionId || !image) return;

    const collection = collectionsWithImageStatus.find(
      (c) => c.id === selectedCollectionId
    );

    // Si l'image est déjà dans la collection, ne rien faire
    if (collection?.hasImage) {
      onClose();
      return;
    }

    try {
      await updateCollectionImages({
        id: selectedCollectionId,
        addImageIds: [image.id],
      });
      onClose();
      setSelectedCollectionId(null);
    } catch (error) {
      // L'erreur sera gérée par le hook
      console.error("Erreur lors de l'ajout de l'image à la collection:", error);
    }
  };

  const errorMessage =
    error instanceof Error
      ? error.message
      : typeof error === "string"
      ? error
      : null;

  if (!image) {
    return null;
  }

  return (
    <BaseImageModal
      open={open}
      onClose={onClose}
      title="Ajouter à une collection"
      error={errorMessage}
      loading={isAdding}
      actions={
        <>
          <CustomButton
            color="error"
            onClick={onClose}
            variant="outlined"
            disabled={isAdding}
          >
            Annuler
          </CustomButton>
          <CustomButton
            onClick={handleAddToCollection}
            disabled={!selectedCollectionId || isAdding}
          >
            Ajouter
          </CustomButton>
        </>
      }
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 200,
            }}
          >
            <CircularProgress />
          </Box>
        ) : userCollections.length === 0 ? (
          <Alert severity="info">
            Vous n'avez aucune collection. Créez-en une pour pouvoir y ajouter
            des images.
          </Alert>
        ) : (
          <>
            <Typography variant="body2" color="text.secondary">
              Sélectionnez une collection pour ajouter l'image "{image.title}"
            </Typography>
            <List>
              {collectionsWithImageStatus.map((collection) => (
                <ListItem key={collection.id} disablePadding>
                  <ListItemButton
                    selected={selectedCollectionId === collection.id}
                    onClick={() => handleSelectCollection(collection.id)}
                    disabled={collection.hasImage}
                  >
                    <Collections sx={{ mr: 2, color: "text.secondary" }} />
                    <ListItemText
                      primary={collection.title}
                      secondary={collection.description || "Aucune description"}
                    />
                    {collection.hasImage && (
                      <Chip
                        icon={<CheckCircle />}
                        label="Déjà présente"
                        size="small"
                        color="success"
                        sx={{ ml: 2 }}
                      />
                    )}
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </>
        )}
      </Box>
    </BaseImageModal>
  );
};

export default AddToCollectionModal;

