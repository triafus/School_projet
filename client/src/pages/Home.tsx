import React, { useRef, useState, useCallback } from "react";
import {
  Box,
  Typography,
  IconButton,
  Chip,
  styled,
  Button,
} from "@mui/material";
import { Favorite, FavoriteBorder, Share, Add } from "@mui/icons-material";
import { useImages, usePostImage } from "../hooks/useImage";
import { Image } from "../types/image";
import { AddImageModal } from "../components/ImageModal/AddImageModal";
import { ImageViewModal } from "../components/ImageModal/ImageViewModal";
import { CustomButton } from "../components/CustomButton";
import { useUsers } from "../hooks/useUser";
import { useAuth } from "../hooks/useAuth";
import { GalleryImageCard } from "../components/GalleryImageCard";

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [open, setOpen] = useState<boolean>(false);
  const [imageOrientations, setImageOrientations] = useState<
    Record<number, "portrait" | "landscape">
  >({});

  const { data: images = [] } = useImages();
  const { data: users = [] } = useUsers();

  const approvedImages = images.filter((image) => image.is_approved);

  const handleImageLoad = useCallback(
    (imageId: number, naturalWidth: number, naturalHeight: number) => {
      // Vérifier si l'orientation est déjà connue pour éviter les re-renders inutiles
      setImageOrientations((prev) => {
        if (prev[imageId]) {
          return prev; // Ne pas mettre à jour si déjà défini
        }
        const orientation =
          naturalHeight > naturalWidth ? "portrait" : "landscape";
        return {
          ...prev,
          [imageId]: orientation,
        };
      });
    },
    []
  );

  const toggleFavorite = useCallback((id: number) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      newFavorites.has(id) ? newFavorites.delete(id) : newFavorites.add(id);
      return newFavorites;
    });
  }, []);

  const getImageUploaderUsername = useCallback(
    (image: Image) => {
      const user = users.find((user) => user.id === image.userId);
      return user ? user.firstName : "Utilisateur inconnu";
    },
    [users]
  );

  const handleImageClick = useCallback((image: Image) => {
    setSelectedImage(image);
  }, []);

  const handleToggleFavorite = useCallback(
    (id: number) => (e: React.MouseEvent) => {
      e.stopPropagation();
      toggleFavorite(id);
    },
    [toggleFavorite]
  );

  const handleOpen = () => setOpen(true);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        position: "relative",
        overflow: "hidden",
        p: "3rem 0",
      }}
    >
      {/* Fond */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "#ffffff",
          zIndex: -1,
        }}
      />

      {/* Galerie */}
      <Box sx={{ maxWidth: 1400, mx: "auto", px: "2rem" }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gridAutoRows: "200px",
            gap: "1.5rem",
            mb: "4rem",
          }}
        >
          {approvedImages.map((image) => (
            <GalleryImageCard
              key={image.id}
              image={image}
              orientation={imageOrientations[image.id]}
              isFavorite={favorites.has(image.id)}
              uploaderUsername={getImageUploaderUsername(image)}
              onImageClick={() => handleImageClick(image)}
              onToggleFavorite={handleToggleFavorite(image.id)}
              onImageLoad={handleImageLoad}
            />
          ))}
        </Box>
      </Box>

      <Box sx={{ position: "fixed", bottom: 32, right: 32 }}>
        <CustomButton startIcon={<Add />} onClick={handleOpen}>
          Ajouter une image
        </CustomButton>
      </Box>

      <AddImageModal open={open} onClose={() => setOpen(false)} />

      <ImageViewModal
        open={!!selectedImage}
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </Box>
  );
};

export default Gallery;
