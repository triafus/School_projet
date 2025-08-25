import React, { useRef, useState } from "react";
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

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [open, setOpen] = useState<boolean>(false);

  const { data: images = [] } = useImages();
  const { data: users = [] } = useUsers();

  const approvedImages = images.filter((image) => image.is_approved);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      newFavorites.has(id) ? newFavorites.delete(id) : newFavorites.add(id);
      return newFavorites;
    });
  };

  const getImageUploaderUsername = (image: Image) => {
    const user = users.find((user) => user.id === image.userId);
    return user ? user.firstName : "Utilisateur inconnu";
  };

  const handleOpen = () => setOpen(true);

  const ArtworkCard = styled(Box)({
    position: "relative",
    borderRadius: "16px",
    overflow: "hidden",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.1)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
    "&:hover": {
      transform: "translateY(-8px)",
      boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
      "& img": { transform: "scale(1.05)" },
      "& .MuiBox-root": { opacity: 1 },
    },
  });

  const Overlay = styled(Box)({
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)",
    opacity: 0,
    transition: "opacity 0.3s ease",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    padding: 12,
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#fafafa",
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
          background:
            "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #000000 100%)",
          zIndex: -1,
        }}
      />

      {/* Galerie */}
      <Box sx={{ maxWidth: 1400, mx: "auto", px: "2rem" }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "2rem",
            mb: "4rem",
          }}
        >
          {approvedImages.map((image, index) => (
            <ArtworkCard
              key={image.id}
              sx={{
                gridColumn: index === 0 ? "span 2" : "span 1",
                height: index === 0 ? 500 : 350,
              }}
              onClick={() => setSelectedImage(image)}
            >
              <Box
                component="img"
                src={image.url}
                alt={image.title}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.3s ease",
                }}
              />

              <Overlay>
                <Typography
                  variant="body2"
                  sx={{
                    color: "white",
                    fontWeight: 600,
                    mb: 0.5,
                    position: "absolute",
                    top: 12,
                    left: 12,
                  }}
                >
                  Publié par {getImageUploaderUsername(image)}
                </Typography>
                <Chip
                  label={/* image.tag */ "tag"}
                  sx={{
                    alignSelf: "flex-start",
                    mb: 2,
                    color: "white",
                    fontWeight: 600,
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{ color: "white", fontWeight: 600, mb: 0.5 }}
                >
                  {image.title}
                </Typography>
              </Overlay>

              <Box
                sx={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  display: "flex",
                  gap: 1,
                }}
              >
                <IconButton
                  sx={{
                    background: "rgba(255,255,255,0.1)",
                    backdropFilter: "blur(10px)",
                    color: favorites.has(image.id) ? "#E74C3C" : "#ffffff",
                    "&:hover": { background: "rgba(255,255,255,0.2)" },
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(image.id);
                  }}
                >
                  {favorites.has(image.id) ? <Favorite /> : <FavoriteBorder />}
                </IconButton>

                <IconButton
                  sx={{
                    background: "rgba(255,255,255,0.1)",
                    backdropFilter: "blur(10px)",
                    color: "#ffffff",
                    "&:hover": { background: "rgba(255,255,255,0.2)" },
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Share />
                </IconButton>
              </Box>
            </ArtworkCard>
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
