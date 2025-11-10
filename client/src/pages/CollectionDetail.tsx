import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Container,
  Chip,
  Button,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { useCollection, useUpdateCollectionImages } from "../hooks/useCollection";
import { useAuth } from "../hooks/useAuth";
import { ImageCard } from "../components/ImageCard";
import { ImageViewModal } from "../components/ImageModal/ImageViewModal";
import { CollectionFormModal } from "../components/collections/CollectionFormModal";
import DeleteCollectionModal from "../components/collections/DeleteCollectionModal";
import { Image } from "../types/image";

const CollectionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const collectionId = id ? parseInt(id, 10) : 0;

  const { data: collection, isLoading, error } = useCollection(collectionId);
  const { user } = useAuth();
  const { mutateAsync: updateCollectionImages } = useUpdateCollectionImages();

  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const isAdmin = user?.role === "admin";
  const isOwner = collection ? user?.id === collection.userId : false;

  const canEdit = isOwner || isAdmin;
  const canDelete = isOwner || isAdmin;

  const handleRemoveFromCollection = async () => {
    if (!selectedImage || !collection) return;
    
    try {
      await updateCollectionImages({
        id: collection.id,
        removeImageIds: [selectedImage.id],
      });
      // Les queries sont automatiquement invalidées par le hook, ce qui rafraîchit les données
      setSelectedImage(null);
    } catch (error) {
      console.error("Erreur lors du retrait de l'image de la collection:", error);
      throw error;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <Container sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !collection) {
    return (
      <Container sx={{ p: 4 }}>
        <Alert severity="error">
          Collection non trouvée ou inaccessible
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/collection")}
          sx={{ mt: 2 }}
        >
          Retour aux collections
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ p: 4, bgcolor: "#fafafa", minHeight: "100vh" }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/collection")}
          sx={{ mb: 2 }}
        >
          Retour aux collections
        </Button>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 600, color: "#1f2937" }}>
                {collection.title}
              </Typography>
              <Chip
                label={collection.is_private ? "Privé" : "Public"}
                color={collection.is_private ? "secondary" : "primary"}
                variant="outlined"
              />
            </Box>

            {collection.description && (
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                {collection.description}
              </Typography>
            )}

            <Box sx={{ display: "flex", gap: 3, alignItems: "center", flexWrap: "wrap" }}>
              <Typography variant="body2" color="text.secondary">
                {collection.images?.length || 0} image
                {collection.images?.length !== 1 ? "s" : ""}
              </Typography>

              {collection.created_at && (
                <Typography variant="body2" color="text.secondary">
                  Créée le {formatDate(collection.created_at)}
                </Typography>
              )}

              {!collection.is_private && collection.user && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <PersonIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {collection.user.firstName && collection.user.lastName
                      ? `${collection.user.firstName} ${collection.user.lastName}`
                      : collection.user.email}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          {canEdit && (
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                onClick={() => setOpenEditModal(true)}
                sx={{
                  bgcolor: "white",
                  "&:hover": { bgcolor: "#f5f5f5" },
                }}
              >
                <EditIcon />
              </IconButton>
              {canDelete && (
                <IconButton
                  onClick={() => setOpenDeleteModal(true)}
                  color="error"
                  sx={{
                    bgcolor: "white",
                    "&:hover": { bgcolor: "#f5f5f5" },
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
          )}
        </Box>
      </Box>

      {/* Images Grid */}
      {collection.images && collection.images.length > 0 ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: 3,
          }}
        >
          {collection.images.map((image) => (
            <Box key={image.id}>
              <ImageCard
                image={image}
                onClick={() => setSelectedImage(image)}
              />
              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                  fontWeight: 500,
                  textAlign: "center",
                }}
              >
                {image.title}
              </Typography>
            </Box>
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            color: "text.secondary",
          }}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            Aucune image dans cette collection
          </Typography>
          <Typography variant="body2">
            {canEdit
              ? "Vous pouvez ajouter des images en modifiant la collection"
              : "Cette collection ne contient pas encore d'images"}
          </Typography>
        </Box>
      )}

      {/* Modals */}
      {collection && (
        <ImageViewModal
          open={!!selectedImage}
          image={selectedImage!}
          onClose={() => setSelectedImage(null)}
          collectionId={collection.id}
          canEditCollection={canEdit}
          onRemoveFromCollection={handleRemoveFromCollection}
        />
      )}

      <CollectionFormModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        initialData={collection}
      />

      <DeleteCollectionModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onSuccess={() => navigate("/collection")}
        collectionId={collection.id}
        collectionTitle={collection.title}
      />
    </Container>
  );
};

export default CollectionDetail;

