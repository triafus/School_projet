import React, { memo } from "react";
import { Box, Typography } from "@mui/material";
import { GALLERY_STATS } from "../../constants/artworks";

const GalleryStats: React.FC = memo(() => {
  return (
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
        <Typography sx={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>
          Depuis 2020, notre galerie réunit des artistes émergents et confirmés
          du monde entier. Découvrez des œuvres uniques et connectez-vous
          directement avec les créateurs.
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          textAlign: "center",
        }}
      >
        {GALLERY_STATS.map((stat, index) => (
          <Box key={index}>
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
  );
});

GalleryStats.displayName = "GalleryStats";

export default GalleryStats;
