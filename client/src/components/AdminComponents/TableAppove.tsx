import React, { useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import { Visibility as VisibilityIcon } from "@mui/icons-material";
import { useImages, useApproveImage } from "../../hooks/useImage";
import { useUsers } from "../../hooks/useUser";
import { Image } from "../../types/image";
import { ImageViewModal } from "../ImageModal/ImageViewModal";
import { CustomButton } from "../CustomButton";

export const TableAppove = () => {
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: images = [],
    isLoading: imagesLoading,
    error: imagesError,
  } = useImages();
  const { data: users = [] } = useUsers();
  const approveImageMutation = useApproveImage();

  const unapprovedImages = images.filter((image) => !image.is_approved);

  const getUserName = (userId: number) => {
    const user = users.find((u) => u.id === userId);
    return user ? `${user.firstName} ${user.lastName}` : "Utilisateur inconnu";
  };

  const handleApprovalToggle = async (
    imageId: number,
    currentStatus: boolean
  ) => {
    try {
      await approveImageMutation.mutateAsync({
        imageId,
        isApproved: !currentStatus,
      });
    } catch (error) {
      console.error("Erreur lors de l'approbation:", error);
    }
  };

  const handleViewImage = (image: Image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  if (imagesLoading) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="body2" sx={{ mt: 2, color: "#6b7280" }}>
          Chargement des images en attente...
        </Typography>
      </Box>
    );
  }

  if (imagesError) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">
          Erreur lors du chargement des images en attente d'approbation
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, color: "#1f2937", mb: 0.5 }}
        >
          Images en attente d'approbation
        </Typography>
        <Typography variant="body2" sx={{ color: "#6b7280" }}>
          {unapprovedImages.length} image
          {unapprovedImages.length !== 1 ? "s" : ""} en attente
        </Typography>
      </Box>

      {unapprovedImages.length === 0 ? (
        <Box
          sx={{
            p: 4,
            textAlign: "center",
            bgcolor: "#f9fafb",
            borderRadius: 2,
          }}
        >
          <Typography variant="body1" sx={{ color: "#6b7280" }}>
            Aucune image en attente d'approbation
          </Typography>
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            border: "1px solid #e5e7eb",
          }}
        >
          <Table>
            <TableHead sx={{ bgcolor: "#f9fafb" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Image</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Titre</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Utilisateur</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Statut</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {unapprovedImages.map((image) => (
                <TableRow key={image.id} hover>
                  <TableCell>
                    <Avatar
                      src={image.url}
                      alt={image.title}
                      variant="rounded"
                      sx={{ width: 60, height: 60, cursor: "pointer" }}
                      onClick={() => handleViewImage(image)}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {image.title}
                    </Typography>
                    {image.description && (
                      <Typography
                        variant="caption"
                        sx={{ color: "#6b7280", display: "block", mt: 0.5 }}
                      >
                        {image.description.length > 50
                          ? `${image.description.substring(0, 50)}...`
                          : image.description}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {getUserName(image.userId)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label="En attente"
                      size="small"
                      sx={{
                        bgcolor: "#fef3c7",
                        color: "#92400e",
                        fontWeight: 500,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <CustomButton
                        variant="outlined"
                        size="small"
                        onClick={() => handleViewImage(image)}
                        disabled={approveImageMutation.isPending}
                      >
                        Approuver
                      </CustomButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {selectedImage && (
        <ImageViewModal
          open={isModalOpen}
          onClose={handleCloseModal}
          image={selectedImage}
          onApprove={handleApprovalToggle}
          isApproving={approveImageMutation.isPending}
          showApprovalButton={true}
        />
      )}
    </Box>
  );
};
