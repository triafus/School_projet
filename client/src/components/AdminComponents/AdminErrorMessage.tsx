import React from "react";
import { Box, Alert } from "@mui/material";

interface AdminErrorMessageProps {
  error: Error | unknown;
}

const AdminErrorMessage = (props: AdminErrorMessageProps) => {
  const { error } = props;
  return (
    <Box sx={{ textAlign: "center" }}>
      <Alert severity="error">
        {error instanceof Error ? error.message : "Erreur inconnue"}
      </Alert>
    </Box>
  );
};

export default AdminErrorMessage;
