import React, { memo } from "react";
import { Box, Modal, Typography, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { Artwork } from "../../constants/artworks";

interface ArtworkModalProps {
  artwork: Artwork | null;
  onClose: () => void;
}

const ArtworkModal: React.FC<ArtworkModalProps> = memo(
  ({ artwork, onClose }) => {
    if (!artwork) return null;

    return (
      <Modal open={!!artwork} onClose={onClose}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            p: 2,
          }}
          onClick={onClose}
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
                "&:hover": {
                  background: "rgba(255,255,255,0.2)",
                },
              }}
              onClick={onClose}
              aria-label="Close modal"
            >
              <Close />
            </IconButton>

            <Box
              component="img"
              src={artwork.image}
              alt={artwork.title}
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
                {artwork.title}
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.7)" }}>
                {artwork.artist} • {artwork.year}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Modal>
    );
  }
);

ArtworkModal.displayName = "ArtworkModal";

export default ArtworkModal;
