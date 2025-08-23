import React, { memo, useCallback } from "react";
import { Box, Typography, IconButton, Chip, styled } from "@mui/material";
import { Favorite, FavoriteBorder, Share } from "@mui/icons-material";
import { Artwork } from "../../constants/artworks";

interface ArtworkCardProps {
  artwork: Artwork;
  index: number;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  onImageClick: (artwork: Artwork) => void;
  onShare?: (artwork: Artwork) => void;
}

const StyledArtworkCard = styled(Box)({
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
    "& .artwork-overlay": { opacity: 1 },
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
  padding: 4,
});

const ArtworkCard: React.FC<ArtworkCardProps> = memo(
  ({ artwork, index, isFavorite, onToggleFavorite, onImageClick, onShare }) => {
    const handleFavoriteClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggleFavorite(artwork.id);
      },
      [artwork.id, onToggleFavorite]
    );

    const handleShareClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onShare?.(artwork);
      },
      [artwork, onShare]
    );

    const handleImageClick = useCallback(() => {
      onImageClick(artwork);
    }, [artwork, onImageClick]);

    return (
      <StyledArtworkCard
        sx={{
          gridColumn: index === 0 ? "span 2" : "span 1",
          height: index === 0 ? 500 : 350,
        }}
        onClick={handleImageClick}
      >
        <Box
          component="img"
          src={artwork.image}
          alt={artwork.title}
          loading="lazy"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.3s ease",
          }}
        />

        <Overlay className="artwork-overlay">
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
              color: isFavorite ? "#E74C3C" : "#ffffff",
              "&:hover": { background: "rgba(255,255,255,0.2)" },
            }}
            onClick={handleFavoriteClick}
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
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
            onClick={handleShareClick}
            aria-label="Share artwork"
          >
            <Share />
          </IconButton>
        </Box>
      </StyledArtworkCard>
    );
  }
);

ArtworkCard.displayName = "ArtworkCard";

export default ArtworkCard;
