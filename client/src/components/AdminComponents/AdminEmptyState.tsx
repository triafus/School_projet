import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Person as PersonIcon } from "@mui/icons-material";

const AdminEmptyState = () => {
  return (
    <Box sx={{ p: 8, textAlign: "center" }}>
      <PersonIcon sx={{ fontSize: 48, color: "#d1d5db", mb: 2 }} />
      <Typography variant="h6" sx={{ color: "#6b7280", mb: 1 }}>
        Aucun utilisateur trouvé
      </Typography>
      <Typography variant="body2" sx={{ color: "#9ca3af" }}>
        Aucun utilisateur ne correspond à vos critères de recherche.
      </Typography>
      <Button
        variant="contained"
        onClick={() => window.location.reload()}
        sx={{ mt: 2 }}
      >
        Réessayer
      </Button>
    </Box>
  );
};

export default AdminEmptyState;
