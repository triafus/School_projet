import React from "react";
import { Box, Typography } from "@mui/material";

interface AdminHeaderProps {
  userCount: number;
}

const AdminHeader = (props: AdminHeaderProps) => {
  const { userCount } = props;
  return (
    <Box>
      <Typography
        variant="h5"
        sx={{ fontWeight: 600, color: "#1f2937", mb: 0.5 }}
      >
        Utilisateurs
      </Typography>
      <Typography variant="body2" sx={{ color: "#6b7280" }}>
        {userCount} Utilisateurs
      </Typography>
    </Box>
  );
};

export default AdminHeader;
