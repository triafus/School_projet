import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

const AdminLoadingState = () => {
  return (
    <Box sx={{ p: 8, textAlign: "center" }}>
      <CircularProgress color="inherit" size={60} />
      <Typography variant="h6" sx={{ color: "#6b7280", mb: 1 }}>
        Chargement...
      </Typography>
    </Box>
  );
};

export default AdminLoadingState;
