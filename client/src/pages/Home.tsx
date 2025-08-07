import React, { useState } from "react";
import {
  Box,
  Modal,
  Typography,
  IconButton,
  Chip,
  Fab,
  styled,
} from "@mui/material";
import {
  Favorite,
  FavoriteBorder,
  Share,
  Close,
  Add,
} from "@mui/icons-material";

interface Artwork {
  id: number;
  title: string;
  artist: string;
  year: number;
  category: string;
  image: string;
  color: string;
}

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<Artwork | null>(null);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const artworks: Artwork[] = [
    {
      id: 2,
      title: "Urban Landscape",
      artist: "Jean Martin",
      year: 2023,
      category: "Paysage",
      image:
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=400&fit=crop",
      color: "#4ECDC4",
    },
    {
      id: 3,
      title: "Digital Dreams",
      artist: "Sophie Laurent",
      year: 2024,
      category: "Digital",
      image:
        "https://images.unsplash.com/photo-1549490349-8643362247b5?w=500&h=500&fit=crop",
      color: "#45B7D1",
    },
    {
      id: 4,
      title: "Nature's Symphony",
      artist: "Paul Monet",
      year: 2023,
      category: "Nature",
      image:
        "https://images.unsplash.com/photo-1549490349-8643362247b5?w=500&h=500&fit=crop",
      color: "#96CEB4",
    },
    {
      id: 5,
      title: "Geometric Harmony",
      artist: "Elena Vasquez",
      year: 2024,
      category: "Géométrique",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=600&fit=crop",
      color: "#FECA57",
    },
    {
      id: 6,
      title: "Emotional Flow",
      artist: "Alex Chen",
      year: 2023,
      category: "Expressionnisme",
      image:
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=450&fit=crop",
      color: "#FF9FF3",
    },
    {
      id: 1,
      title: "Abstract Fusion",
      artist: "Marie Dubois",
      year: 2024,
      category: "Abstrait",
      image:
        "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500&h=600&fit=crop",
      color: "#FF6B6B",
    },
    {
      id: 2,
      title: "Urban Landscape",
      artist: "Jean Martin",
      year: 2023,
      category: "Paysage",
      image:
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=400&fit=crop",
      color: "#4ECDC4",
    },
    {
      id: 3,
      title: "Digital Dreams",
      artist: "Sophie Laurent",
      year: 2024,
      category: "Digital",
      image:
        "https://images.unsplash.com/photo-1549490349-8643362247b5?w=500&h=500&fit=crop",
      color: "#45B7D1",
    },
    {
      id: 2,
      title: "Urban Landscape",
      artist: "Jean Martin",
      year: 2023,
      category: "Paysage",
      image:
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=400&fit=crop",
      color: "#4ECDC4",
    },
    {
      id: 3,
      title: "Digital Dreams",
      artist: "Sophie Laurent",
      year: 2024,
      category: "Digital",
      image:
        "https://images.unsplash.com/photo-1549490349-8643362247b5?w=500&h=500&fit=crop",
      color: "#45B7D1",
    },
  ];

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      newFavorites.has(id) ? newFavorites.delete(id) : newFavorites.add(id);
      return newFavorites;
    });
  };

  const handleAddArtwork = () =>
    alert("Fonctionnalité en cours de développement !");

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
    p: 4,
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #000000 100%)",
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
          {artworks.map((artwork, index) => (
            <ArtworkCard
              key={artwork.id}
              sx={{
                gridColumn: index === 0 ? "span 2" : "span 1",
                height: index === 0 ? 500 : 350,
              }}
              onClick={() => setSelectedImage(artwork)}
            >
              <Box
                component="img"
                src={artwork.image}
                alt={artwork.title}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.3s ease",
                }}
              />

              <Overlay>
                <Chip
                  label={artwork.category}
                  sx={{
                    alignSelf: "flex-start",
                    mb: 2,
                    background: artwork.color,
                    color: "white",
                    fontWeight: 600,
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{ color: "white", fontWeight: 600, mb: 0.5 }}
                >
                  {artwork.title}
                </Typography>
                <Typography
                  sx={{ color: "rgba(255,255,255,0.8)", fontSize: "0.9rem" }}
                >
                  {artwork.artist} • {artwork.year}
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
                    color: favorites.has(artwork.id) ? "#E74C3C" : "#ffffff",
                    "&:hover": { background: "rgba(255,255,255,0.2)" },
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(artwork.id);
                  }}
                >
                  {favorites.has(artwork.id) ? (
                    <Favorite />
                  ) : (
                    <FavoriteBorder />
                  )}
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

        {/* Statistiques */}
        <Box
          sx={{
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(15px)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "20px",
            boxShadow: "0 15px 35px rgba(0,0,0,0.4)",
            p: 6,
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
            gap: 6,
            alignItems: "center",
          }}
        >
          <Box>
            <Typography
              variant="h3"
              sx={{ fontWeight: 700, mb: 2, color: "white" }}
            >
              Une communauté d'artistes passionnés
            </Typography>
            <Typography
              sx={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}
            >
              Depuis 2020, notre galerie réunit des artistes émergents et
              confirmés du monde entier. Découvrez des œuvres uniques et
              connectez-vous directement avec les créateurs.
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              textAlign: "center",
            }}
          >
            {[
              { value: "1.2K", label: "Œuvres", color: "#E74C3C" },
              { value: "350", label: "Artistes", color: "#4ECDC4" },
              { value: "15K", label: "Visiteurs", color: "#45B7D1" },
            ].map((stat, i) => (
              <Box key={i}>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, mb: 1, color: stat.color }}
                >
                  {stat.value}
                </Typography>
                <Typography
                  sx={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem" }}
                >
                  {stat.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Bouton flottant */}
      <Fab
        color="error"
        sx={{
          position: "fixed",
          bottom: 32,
          right: 32,
          boxShadow: "0 4px 20px rgba(231, 76, 60, 0.4)",
        }}
        onClick={handleAddArtwork}
      >
        <Add />
      </Fab>

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
              src={selectedImage?.image}
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
                {selectedImage?.artist} • {selectedImage?.year}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Gallery;
