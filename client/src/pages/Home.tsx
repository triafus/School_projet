import React, { useRef, useState } from "react";
import {
  Box,
  Modal,
  Typography,
  IconButton,
  Chip,
  styled,
  Button,
} from "@mui/material";
import {
  Favorite,
  FavoriteBorder,
  Share,
  Close,
  Add,
} from "@mui/icons-material";
import { useImages, usePostImage } from "../hooks/useImage";
import { Image } from "../types/image";
import AddImageModal from "../components/AddImageModal";
import { CustomButton } from "../components/CustomButton";

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [open, setOpen] = useState<boolean>(false);

  const { data: images = [] } = useImages();

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      newFavorites.has(id) ? newFavorites.delete(id) : newFavorites.add(id);
      return newFavorites;
    });
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
          {images.map((image, index) => (
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
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255,255,255,0.8)" }}
                >
                  {image.description}
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

      {/* bouton visible */}
      <Box sx={{ position: "fixed", bottom: 32, right: 32 }}>
        <CustomButton startIcon={<Add />} onClick={handleOpen}>
          Ajouter une image
        </CustomButton>
      </Box>
      {/* Add Image Modal*/}
      <AddImageModal open={open} onClose={() => setOpen(false)} />

      {/* Modal */}
      <Modal open={!!selectedImage} onClose={() => setSelectedImage(null)}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            p: 2,
          }}
          onClick={() => setSelectedImage(null)}
        >
          <Box
            sx={{
              position: "relative",
              maxWidth: "90%",
              maxHeight: "90%",
              background: "rgba(20,20,20,0.95)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "16px",
              overflow: "hidden",
              width: { xs: "100%", sm: "auto" },
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <IconButton
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                background: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)",
                color: "#ffffff",
                zIndex: 1,
              }}
              onClick={() => setSelectedImage(null)}
            >
              <Close />
            </IconButton>

            <Box
              component="img"
              src={selectedImage?.url}
              alt={selectedImage?.title}
              sx={{
                width: "100%",
                height: "auto",
                display: "block",
                maxHeight: "70vh",
              }}
            />

            <Box sx={{ p: 4 }}>
              <Typography
                variant="h5"
                sx={{ fontWeight: 600, mb: 2, color: "#ffffff" }}
              >
                {selectedImage?.title}
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.7)" }}>
                {selectedImage?.description}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Gallery;
