import React, { useState } from "react";
import { Box, Modal, Typography, IconButton } from "@mui/material";
import { Close, DeleteOutline, EditOutlined } from "@mui/icons-material";
import { Image } from "../../types/image";
import { useAuth } from "../../hooks/useAuth";
import { EditImageModal } from "./EditImageModal";
import { DeleteImageModal } from "./DeleteImageModal";
import { useUsers } from "../../hooks/useUser";
import { useSignedUrl } from "../../hooks/useImage";

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
  const { data: users = [] } = useUsers();

  const isOwner = user?.id === image?.userId;

  const { data: signedUrlData } = useSignedUrl(
    image?.id || 0,
    image?.is_private || false
  );

  const getImageUploaderUsername = () => {
    const user = users.find((user) => user.id === image?.userId);
    return user ? user.firstName : "Utilisateur inconnu";
  };

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
            maxWidth: "1000px",
            minHeight: "450px",
            background: "#ffffff",
            borderRadius: "32px",
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

          {/* Image Section */}
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
                borderRadius: "24px",
                objectFit: "contain",
                display: "block",
              }}
            />
          </Box>

          {/* Content Section */}
          <Box
            sx={{
              flex: { xs: "none", md: "0 0 400px" },
              p: "32px 0px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {/* Main Content */}
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: "#111111",
                  fontSize: { xs: "1.5rem", md: "2rem" },
                  lineHeight: 1.2,
                }}
              >
                {image?.title}
              </Typography>
              {/* User Info */}
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
                      {getImageUploaderUsername().charAt(0).toUpperCase()}
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
                      {getImageUploaderUsername()}
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
              </Box>{" "}
              <Box
                sx={{
                  display: "flex",
                  mb: 2,
                }}
              >
                {isOwner && (
                  <Box display="flex" gap={1} pt={2}>
                    <IconButton
                      onClick={handleOpenEdit}
                      sx={{
                        borderRadius: "50%",
                        backgroundColor: "#f1f1f1",
                        width: 40,
                        height: 40,
                        "&:hover": {
                          backgroundColor: "#e0e0e0",
                        },
                      }}
                    >
                      <EditOutlined sx={{ color: "#111111", fontSize: 20 }} />
                    </IconButton>
                    <IconButton
                      onClick={handleOpenDelete}
                      sx={{
                        borderRadius: "50%",
                        backgroundColor: "#f1f1f1",
                        width: 40,
                        height: 40,
                        "&:hover": {
                          backgroundColor: "#ffebee",
                        },
                      }}
                    >
                      <DeleteOutline sx={{ color: "#d32f2f", fontSize: 20 }} />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </Box>
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
        </Box>
      </Box>
    </Modal>
  );
};
