import React, { useState } from "react";
import { Box, Modal, Typography, IconButton, Stack } from "@mui/material";
import { Close, DeleteOutline, EditOutlined } from "@mui/icons-material";
import { Image } from "../../types/image";
import { useAuth } from "../../hooks/useAuth";
import { useImages } from "../../hooks/useImage";
import { CustomButton } from "../CustomButton";
import { EditImageModal } from "./EditImageModal";
import { DeleteImageModal } from "./DeleteImageModal";
import { on } from "events";

interface ImageViewModalProps {
  open: boolean;
  image: Image | null;
  onClose: () => void;
}

export const ImageViewModal = (props: ImageViewModalProps) => {
  const { open, image, onClose } = props;
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);

  const { user } = useAuth();

  const isOwner = user?.id === image?.userId;

  const handleOpenEdit = () => {
    setOpenEditModal(true);
  };

  const handleOpenDelete = () => {
    setOpenDeleteModal(true);
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
            }}
            onClick={onClose}
          >
            <Close />
          </IconButton>

          <Box
            component="img"
            src={image?.url}
            alt={image?.title}
            sx={{
              width: "100%",
              height: "auto",
              display: "block",
              maxHeight: "70vh",
            }}
          />

          <Stack
            justifyContent="space-between"
            flexDirection="row"
            sx={{ p: 4 }}
          >
            <Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: 600, mb: 2, color: "#ffffff" }}
              >
                {image?.title}
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.7)" }}>
                {image?.description}
              </Typography>
            </Box>
            {isOwner && (
              <Box display="flex" flexDirection="row" gap={2} mb={2}>
                <Box>
                  <IconButton
                    onClick={handleOpenEdit}
                    sx={{
                      borderRadius: "8px",
                      backgroundColor: "#2c3e50",
                      "&:hover": {
                        backgroundColor: "#34495e",
                      },
                    }}
                  >
                    <EditOutlined sx={{ color: "white" }} />
                  </IconButton>
                </Box>
                <Box>
                  <IconButton
                    onClick={handleOpenDelete}
                    sx={{
                      borderRadius: "8px",
                      backgroundColor: "rgb(170, 14, 14)",
                      "&:hover": {
                        backgroundColor: "rgb(201, 16, 16)",
                      },
                    }}
                  >
                    <DeleteOutline sx={{ color: "white" }} />
                  </IconButton>
                </Box>
              </Box>
            )}
          </Stack>

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
        </Box>
      </Box>
    </Modal>
  );
};
