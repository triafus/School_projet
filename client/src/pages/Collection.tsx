import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  InputAdornment,
  Container,
} from "@mui/material";
import { Add as AddIcon, Search as SearchIcon } from "@mui/icons-material";
import { useCollections } from "../hooks/useCollection";

const Collection = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  const { data: collections } = useCollections();

  const filteredCollections = collections?.filter((collection) =>
    collection.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const NewCollectionCard = () => (
    <Button
      sx={{
        cursor: "pointer",
        border: "2px dashed #e0e0e0",
        backgroundColor: "transparent",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 280,
        minWidth: 280,
        transition: "all 0.2s",
        "&:hover": {
          borderColor: "#1976d2",
          backgroundColor: "rgba(25, 118, 210, 0.04)",
        },
      }}
    >
      <AddIcon
        sx={{
          borderRadius: "999px",
          bgcolor: "#a8b2c7",
          fontSize: 48,
          color: "white",
          mb: 1,
        }}
      />
      <Typography
        variant="subtitle1"
        color="text.secondary"
        fontWeight="medium"
      >
        Nouvelle Collection
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Créer une nouvelle collection
      </Typography>
    </Button>
  );

  return (
    <Container sx={{ p: 4, bgcolor: "#fafafa", minHeight: "100vh" }}>
      {/* En-tête */}
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
            Collections
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {collections?.length} Collections
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
            onClick={() => {}}
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              backgroundColor: "#2d3748",
              "&:hover": {
                backgroundColor: "#1a202c",
              },
              borderRadius: 2,
              textTransform: "none",
              fontWeight: "medium",
            }}
          >
            Nouvelle Collection
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid>
          <NewCollectionCard />
        </Grid>

        {filteredCollections?.map((collection) => (
          <Grid key={collection.id}>{/* collection */}</Grid>
        ))}
      </Grid>

      {filteredCollections?.length === 0 && (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            color: "text.secondary",
          }}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            Aucune collection trouvée
          </Typography>
          <Typography variant="body2">
            Essayez de modifier votre recherche
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Collection;
