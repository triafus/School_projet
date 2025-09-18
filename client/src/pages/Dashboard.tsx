import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Chip,
  Grid,
  Container,
  InputAdornment,
} from "@mui/material";
import { Add, Search as SearchIcon } from "@mui/icons-material";
import { ImageCard } from "../components/ImageCard";
import { useAuth } from "../hooks/useAuth";
import { Image } from "../types/image";
import { AddImageModal } from "../components/ImageModal/AddImageModal";
import { ImageViewModal } from "../components/ImageModal/ImageViewModal";
import { CustomButton } from "../components/CustomButton";
import { useUserImages } from "../hooks/useImage";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<string>("Toutes");
  const [open, setOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

  const { data: userImages } = useUserImages();

  const [filteredImages, setFilteredImages] = useState<Image[]>(
    userImages || []
  );

  const filters = ["Toutes", "Publiques", "Privées"];

  useEffect(() => {
    if (userImages) {
      handleFilterChange(activeFilter);
    }
  }, [userImages]);

  const handleOpen = () => setOpen(true);

  const handleFilterChange = useMemo(
    () => (filter: string) => {
      setActiveFilter(filter);
      if (filter === "Toutes") {
        setFilteredImages(userImages || []);
      } else if (filter === "Publiques") {
        setFilteredImages(
          (userImages || []).filter((image) => !image.is_private)
        );
      } else if (filter === "Privées") {
        setFilteredImages(
          (userImages || []).filter((image) => image.is_private)
        );
      }
    },
    [userImages]
  );

  return (
    <Container sx={{ p: 4, bgcolor: "#fafafa", minHeight: "100vh" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 600, color: "#1f2937", mb: 0.5 }}
          >
            Mes Images
          </Typography>
          <Typography variant="body2" sx={{ color: "#6b7280" }}>
            {userImages?.length} Images
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            size="small"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{
              bgcolor: "white",
              borderRadius: 2,
              minWidth: 250,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />
          <CustomButton onClick={handleOpen} startIcon={<Add />}>
            Nouvelle image
          </CustomButton>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box sx={{ display: "flex", gap: 1 }}>
          <Typography
            variant="body2"
            sx={{ mr: 2, alignSelf: "center", color: "text.secondary" }}
          >
            Filtres:
          </Typography>
          {filters.map((filter) => (
            <Chip
              key={filter}
              label={filter}
              onClick={() => handleFilterChange(filter)}
              variant={activeFilter === filter ? "filled" : "outlined"}
              sx={{
                backgroundColor:
                  activeFilter === filter ? "#2c3e50" : "transparent",
                color: activeFilter === filter ? "white" : "text.primary",
                borderColor: activeFilter === filter ? "#2c3e50" : "#e0e0e0",
                "&:hover": {
                  backgroundColor:
                    activeFilter === filter ? "#34495e" : "#f5f5f5",
                },
                borderRadius: 2,
              }}
            />
          ))}
        </Box>
      </Box>
      {/* Image Grid */}
      <Grid container spacing={3}>
        {filteredImages.map((image) => (
          <Grid key={image.id}>
            <ImageCard image={image} onClick={() => setSelectedImage(image)} />

            <Typography
              variant="body1"
              sx={{
                color: "white",
                fontWeight: 500,
                textAlign: "center",
              }}
            >
              {image.title}
            </Typography>
          </Grid>
        ))}
      </Grid>

      <AddImageModal open={open} onClose={() => setOpen(false)} />

      <ImageViewModal
        open={!!selectedImage}
        image={selectedImage!}
        onClose={() => setSelectedImage(null)}
      />
    </Container>
  );
};

export default Dashboard;
