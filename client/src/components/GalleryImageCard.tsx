import React, { useCallback } from "react";
import { Box, Typography, IconButton, Chip, styled } from "@mui/material";
import { Favorite, FavoriteBorder, Share } from "@mui/icons-material";
import { Image } from "../types/image";

interface GalleryImageCardProps {
  image: Image;
  orientation: "portrait" | "landscape" | undefined;
  isFavorite: boolean;
  uploaderUsername: string;
  onImageClick: () => void;
  onToggleFavorite: (e: React.MouseEvent) => void;
  onImageLoad: (id: number, width: number, height: number) => void;
}

const ArtworkCard = styled(Box)({
  position: "relative",
  borderRadius: "16px",
  overflow: "hidden",
  cursor: "pointer",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  background: "#ffffff",
  border: "1px solid rgba(0,0,0,0.08)",
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
    "& img": { transform: "scale(1.05)" },
    "& .overlay": { opacity: 1 },
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
  pointerEvents: "none",
  transition: "opacity 0.3s ease",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  padding: 12,
});

export const GalleryImageCard = React.memo(
  ({
    image,
    orientation,
    isFavorite,
    uploaderUsername,
    onImageClick,
    onToggleFavorite,
    onImageLoad,
  }: GalleryImageCardProps) => {
    return (
      <ArtworkCard
        sx={{
          gridRowEnd: orientation === "portrait" ? "span 2" : "span 1",
          height: orientation === "portrait" ? "420px" : "200px",
        }}
        onClick={onImageClick}
      >
        <Box
          component="img"
          src={image.url}
          alt={image.title}
          onLoad={(e) => {
            const img = e.target as HTMLImageElement;
            onImageLoad(image.id, img.naturalWidth, img.naturalHeight);
          }}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.3s ease",
          }}
        />

        <Overlay className="overlay">
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
            Publié par {uploaderUsername}
          </Typography>
          <Chip
            label="tag"
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
              color: isFavorite ? "#E74C3C" : "#ffffff",
              "&:hover": { background: "rgba(255,255,255,0.2)" },
            }}
            onClick={onToggleFavorite}
          >
            {isFavorite ? <Favorite /> : <FavoriteBorder />}
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
    );
  }
);

GalleryImageCard.displayName = "GalleryImageCard";
