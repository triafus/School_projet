import React, { useState } from "react";
import {
  Box,
  Modal,
  Typography,
  IconButton,
  Button,
  Stack,
} from "@mui/material";
import {
  Close,
  DeleteOutline,
  EditOutlined,
  CheckCircle,
  Collections,
} from "@mui/icons-material";
import { Image } from "../../types/image";
import { useAuth } from "../../hooks/useAuth";
import { EditImageModal } from "./EditImageModal";
import { DeleteImageModal } from "./DeleteImageModal";
import { useSignedUrl } from "../../hooks/useImage";
import { CustomButton } from "../CustomButton";
import { BaseImageModal } from "./BaseImageModal";
import { AddToCollectionModal } from "../collections/AddToCollectionModal";

interface ImageViewModalProps {
  open: boolean;
  image: Image | null;
  onClose: () => void;
  onApprove?: (imageId: number, currentStatus: boolean) => void;
  isApproving?: boolean;
  showApprovalButton?: boolean;
}

export const ImageViewModal = (props: ImageViewModalProps) => {
  const {
    open,
    image,
    onClose,
    onApprove,
    isApproving = false,
    showApprovalButton = false,
  } = props;
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [openAddToCollectionModal, setOpenAddToCollectionModal] = useState<boolean>(false);

  const { user } = useAuth();
  const { data: signedUrlData } = useSignedUrl(
    image?.id || 0,
    image?.is_private || false
  );

  const isOwner = user?.id === image?.userId;

  const handleOpenEdit = () => {
    setOpenEditModal(true);
  };

  const handleOpenDelete = () => {
    setOpenDeleteModal(true);
  };

  const handleApprove = () => {
    if (onApprove && image) {
      onApprove(image.id, image.is_approved);
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
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
            maxWidth: "1000px",
            minHeight: "450px",
            background: "#ffffff",
            borderRadius: "12px",
            overflow: "hidden",
            width: { xs: "95%", sm: "90%", md: "80%" },
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            boxShadow: "0 32px 64px rgba(0,0,0,0.12)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <IconButton
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              background: "rgba(0,0,0,0.05)",
              color: "#111111",
              zIndex: 10,
              "&:hover": {
                background: "rgba(0,0,0,0.1)",
              },
            }}
            onClick={onClose}
          >
            <Close />
          </IconButton>

          <Box
            sx={{
              flex: { xs: "none", md: "1" },
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Box
              component="img"
              src={image?.is_private ? signedUrlData?.url : image?.url}
              alt={image?.title}
              sx={{
                width: "90%",
                margin: 2,
                borderRadius: "12px",
                objectFit: "contain",
                display: "block",
              }}
            />
          </Box>

          <Box
            sx={{
              flex: { xs: "none", md: "0 0 400px" },
              pt: "32px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Stack>
              <Typography
                variant="h6"
                sx={{
                  maxWidth: "85%",
                  pr: 2,
                  fontWeight: 600,
                  mb: 2,
                  color: "#111111",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                  whiteSpace: "normal",
                  lineHeight: 1.3,
                }}
              >
                {image?.title}
              </Typography>

              <Box display="flex" flexDirection="column" gap={2}>
                <Box sx={{ display: "flex", alignItems: "center", mt: "auto" }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      backgroundColor: "#e0e0e0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 2,
                    }}
                  >
                    <Typography sx={{ fontWeight: 600, color: "#111111" }}>
                      {image?.user?.firstName.charAt(0).toUpperCase() || "U"}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        color: "#111111",
                        fontSize: "0.9rem",
                      }}
                    >
                      {image?.user?.firstName || "Utilisateur"}
                    </Typography>
                  </Box>
                </Box>

                {image?.description && (
                  <Typography
                    sx={{
                      color: "#767676",
                      fontSize: "1rem",
                      lineHeight: 1.5,
                    }}
                  >
                    {image?.description}
                  </Typography>
                )}
                {showApprovalButton && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#6b7280",
                      mb: 2,
                      fontSize: "0.875rem",
                      lineHeight: 1.5,
                      p: 2,
                      bgcolor: "#f9fafb",
                      borderRadius: 1,
                      border: "1px solid #e5e7eb",
                    }}
                  >
                  </Typography>
                )}
              </Box>
            </Stack>

            <Stack>
              {isOwner && !showApprovalButton && (
                <Box display="flex" flexDirection="column" gap={1} p={2}>
                  <Box display="flex" gap={1} justifyContent="end">
                    <Button
                      onClick={handleOpenDelete}
                      color="error"
                      sx={{ borderRadius: "8px" }}
                      startIcon={
                        <DeleteOutline sx={{ color: "#d32f2f", fontSize: 20 }} />
                      }
                    >
                      Supprimer
                    </Button>
                    <CustomButton
                      onClick={handleOpenEdit}
                      variant="outlined"
                      startIcon={
                        <EditOutlined sx={{ color: "#111111", fontSize: 20 }} />
                      }
                    >
                      Modifier
                    </CustomButton>
                  </Box>
                  <Box display="flex" gap={1} justifyContent="end">
                    <CustomButton
                      onClick={() => setOpenAddToCollectionModal(true)}
                      variant="outlined"
                      startIcon={
                        <Collections sx={{ color: "#111111", fontSize: 20 }} />
                      }
                    >
                      Ajouter à une collection
                    </CustomButton>
                  </Box>
                </Box>
              )}

              {showApprovalButton && !image?.is_approved && (
                <Box display="flex" gap={1} justifyContent="end" p={2}>
                  <CustomButton variant="outlined" onClick={onClose}>
                    Annuler
                  </CustomButton>
                  <Button
                    variant="contained"
                    startIcon={<CheckCircle />}
                    onClick={handleApprove}
                    disabled={isApproving}
                    sx={{
                      borderRadius: "8px",
                      maxHeight: "40px",
                      bgcolor: "#10b981",
                      color: "white",
                      "&:hover": {
                        bgcolor: "#059669",
                      },
                      "&:disabled": {
                        bgcolor: "#d1d5db",
                      },
                    }}
                  >
                    {isApproving ? "Approbation..." : "Approuver"}
                  </Button>
                </Box>
              )}
            </Stack>
          </Box>

          <EditImageModal
            open={openEditModal}
            onClose={() => setOpenEditModal(false)}
            image={image}
            onUpdate={() => {
              onClose();
            }}
          />

          <DeleteImageModal
            open={openDeleteModal}
            onClose={() => setOpenDeleteModal(false)}
            image={image}
            onDelete={() => {
              onClose();
            }}
          />

          <AddToCollectionModal
            open={openAddToCollectionModal}
            onClose={() => setOpenAddToCollectionModal(false)}
            image={image}
          />
        </Box>
      </Box>
    </Modal>
  );
};
