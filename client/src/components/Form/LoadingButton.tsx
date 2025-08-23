import React, { memo } from "react";
import { Button, CircularProgress, Box, ButtonProps } from "@mui/material";
import { primaryButtonStyles } from "../../styles/theme";

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

export const LoadingButton: React.FC<LoadingButtonProps> = memo(
  ({
    loading = false,
    loadingText = "Chargement...",
    children,
    sx,
    disabled,
    ...props
  }) => {
    return (
      <Button
        disabled={disabled || loading}
        sx={{ ...primaryButtonStyles, ...sx }}
        {...props}
      >
        {loading ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CircularProgress size={20} color="inherit" />
            {loadingText}
          </Box>
        ) : (
          children
        )}
      </Button>
    );
  }
);

LoadingButton.displayName = "LoadingButton";

export default LoadingButton;
