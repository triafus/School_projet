import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Container,
} from "@mui/material";
import { Add as AddIcon, Search as SearchIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useCollections } from "../hooks/useCollection";
import type { Collection } from "../types/collection";
import { CollectionFormModal } from "../components/collections/CollectionFormModal";
import DeleteCollectionModal from "../components/collections/DeleteCollectionModal";
import CollectionCard from "../components/collections/CollectionCard";

const CollectionPage = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [selectedCollection, setSelectedCollection] =
    useState<Collection | null>(null);

  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: collections, isLoading, error } = useCollections();

  const isAdmin = user?.role === "admin";

  const handleOpenCreateModal = () => {
    setSelectedCollection(null);
    setOpenModal(true);
  };

  const handleOpenEditModal = (id: number) => {
    const collection = collections?.find((c) => c.id === id);
    if (collection) {
      setSelectedCollection(collection);
      setOpenModal(true);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedCollection(null);
  };

  const handleOpenDeleteModal = (id: number) => {
    const collection = collections?.find((c) => c.id === id);
    if (collection) {
      setSelectedCollection(collection);
      setOpenDeleteModal(true);
    }
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setSelectedCollection(null);
  };

  const handleView = (id: number) => {
    navigate(`/collection/${id}`);
  };

  const isOwner = (collection: Collection) => {
    return user?.id === collection.userId;
  };

  const filteredCollections = collections?.filter((collection) =>
    collection.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const NewCollectionCard = ({ onClick }: { onClick: () => void }) => (
    <Button
      onClick={onClick}
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
            {searchQuery
              ? `${filteredCollections?.length || 0} résultat${
                  (filteredCollections?.length || 0) > 1 ? "s" : ""
                }`
              : `${collections?.length || 0} Collection${
                  (collections?.length || 0) > 1 ? "s" : ""
                }`}
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
            onClick={handleOpenCreateModal}
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

      {isLoading && (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
          }}
        >
          <Typography variant="body1" color="text.secondary">
            Chargement des collections...
          </Typography>
        </Box>
      )}

      {error && (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            color: "error.main",
          }}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            Erreur lors du chargement
          </Typography>
          <Typography variant="body2">
            Impossible de charger les collections. Veuillez réessayer.
          </Typography>
        </Box>
      )}

      {!isLoading && !error && (
        <>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(4, 1fr)",
              },
              gap: 3,
            }}
          >
            <NewCollectionCard onClick={handleOpenCreateModal} />

            {filteredCollections?.map((collection) => (
              <CollectionCard
                key={collection.id}
                collection={collection}
                onEdit={handleOpenEditModal}
                onDelete={handleOpenDeleteModal}
                onView={handleView}
                isOwner={isOwner(collection)}
                isAdmin={isAdmin}
              />
            ))}
          </Box>

          {!searchQuery &&
            (collections?.length === 0 || collections === undefined) && (
              <Box
                sx={{
                  textAlign: "center",
                  py: 8,
                  color: "text.secondary",
                }}
              >
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Aucune collection
                </Typography>
                <Typography variant="body2">
                  Créez votre première collection pour commencer
                </Typography>
              </Box>
            )}

          {searchQuery && filteredCollections?.length === 0 && (
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
        </>
      )}

      <CollectionFormModal
        open={openModal}
        onClose={handleCloseModal}
        initialData={selectedCollection}
      />

      <DeleteCollectionModal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        collectionId={selectedCollection?.id || null}
        collectionTitle={selectedCollection?.title || ""}
      />
    </Container>
  );
};

export default CollectionPage;
