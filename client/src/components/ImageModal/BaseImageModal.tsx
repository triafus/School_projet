import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  Alert,
  Divider,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { CustomButton } from "../CustomButton";

interface BaseImageModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  error?: string | null;
  onErrorClose?: () => void;
  loading?: boolean;
}

export const BaseImageModal = (props: BaseImageModalProps) => {
  const {
    open,
    onClose,
    title,
    children,
    actions,
    error,
    onErrorClose,
    loading = false,
  } = props;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" component="div">
            {title}
          </Typography>
          <IconButton onClick={onClose} disabled={loading}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={onErrorClose}>
            {error}
          </Alert>
        )}

        {children}
      </DialogContent>

      {actions && (
        <DialogActions sx={{ px: 3, pb: 3 }}>{actions}</DialogActions>
      )}
    </Dialog>
  );
};
