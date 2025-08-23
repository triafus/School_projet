import React, { useState, useCallback } from "react";
import { Box, Fab } from "@mui/material";
import { Add } from "@mui/icons-material";
import { MOCK_ARTWORKS, Artwork } from "../constants/artworks";
import { useFavorites } from "../hooks/useFavorites";
import {
  ArtworkCard,
  ArtworkModal,
  GalleryStats,
  PageContainer,
} from "../components";
import { galleryBackgroundStyles } from "../styles/theme";

const Home: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<Artwork | null>(null);
  const { isFavorite, toggleFavorite } = useFavorites();

  const handleImageClick = useCallback((artwork: Artwork) => {
    setSelectedImage(artwork);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedImage(null);
  }, []);

  const handleAddArtwork = useCallback(() => {
    // TODO: Implement add artwork functionality
    alert("Fonctionnalité en cours de développement !");
  }, []);

  const handleShare = useCallback((artwork: Artwork) => {
    // TODO: Implement share functionality
    if (navigator.share) {
      navigator.share({
        title: artwork.title,
        text: `Découvrez "${artwork.title}" par ${artwork.artist}`,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert("Lien copié dans le presse-papiers !");
    }
  }, []);

  return (
    <Box sx={galleryBackgroundStyles}>
      {/* Background */}
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

      {/* Gallery */}
      <PageContainer>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "2rem",
            mb: "4rem",
          }}
        >
          {MOCK_ARTWORKS.map((artwork, index) => (
            <ArtworkCard
              key={artwork.id}
              artwork={artwork}
              index={index}
              isFavorite={isFavorite(artwork.id)}
              onToggleFavorite={toggleFavorite}
              onImageClick={handleImageClick}
              onShare={handleShare}
            />
          ))}
        </Box>

        {/* Statistics */}
        <GalleryStats />
      </PageContainer>

      {/* Floating Action Button */}
      <Fab
        color="error"
        sx={{
          position: "fixed",
          bottom: 32,
          right: 32,
          boxShadow: "0 4px 20px rgba(231, 76, 60, 0.4)",
        }}
        onClick={handleAddArtwork}
        aria-label="Add artwork"
      >
        <Add />
      </Fab>

      {/* Modal */}
      <ArtworkModal artwork={selectedImage} onClose={handleCloseModal} />
    </Box>
  );
};

export default Home;
