import React, { memo, useCallback } from "react";
import { Alert, IconButton } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

interface ErrorAlertProps {
  error: string | null;
  onClose: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = memo(
  ({ error, onClose }) => {
    const handleClose = useCallback(() => {
      onClose();
    }, [onClose]);

    if (!error) return null;

    return (
      <Alert
        severity="error"
        sx={{ mb: 3 }}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={handleClose}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
      >
        {error}
      </Alert>
    );
  }
);

ErrorAlert.displayName = "ErrorAlert";

export default ErrorAlert;
