import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardMedia,
  IconButton,
  Container,
  InputAdornment,
} from "@mui/material";
import { Add, Search as SearchIcon } from "@mui/icons-material";
import { useImages } from "../hooks/useImage";
import { useUsers } from "../hooks/useUser";
import { ImageCard } from "../components/ImageCard";
import { useAuth } from "../hooks/useAuth";
import { Image } from "../types/image";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("recent");
  const [activeFilter, setActiveFilter] = useState<string>("Toutes");

  const { user } = useAuth();

  const [filteredImages, setFilteredImages] = useState<Image[]>(
    user?.images || []
  );

  const filters = ["Toutes", "Publiques", "Privées"];

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    if (filter === "Toutes") {
      setFilteredImages(user?.images || []);
    } else if (filter === "Publiques") {
      setFilteredImages(
        (user?.images || []).filter((image) => !image.is_private)
      );
    } else if (filter === "Privées") {
      setFilteredImages(
        (user?.images || []).filter((image) => image.is_private)
      );
    }
  };

  const handleSortChange = (event: any) => {
    setSortBy(event.target.value);
  };

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
            {user?.images.length} Images
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
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{
              backgroundColor: "#2c3e50",
              "&:hover": {
                backgroundColor: "#34495e",
              },
              borderRadius: 2,
              px: 3,
              py: 1,
            }}
          >
            Nouvelle image
          </Button>
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
            <ImageCard
              title={image.title}
              url={image.url}
              isPrivate={image.is_private}
            />

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
    </Container>
  );
};

export default Dashboard;
