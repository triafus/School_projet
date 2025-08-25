import React from "react";
import { Box, Typography, Select, MenuItem, FormControl } from "@mui/material";

interface AdminRoleFilterProps {
  filterRole: string;
  onFilterChange: (value: string) => void;
}

const AdminRoleFilter = (props: AdminRoleFilterProps) => {
  const { filterRole, onFilterChange } = props;
  return (
    <Box sx={{ display: "flex", gap: 2, mb: 3, alignItems: "center" }}>
      <Typography
        variant="body2"
        sx={{ color: "#6b7280", minWidth: "fit-content" }}
      >
        Filtrer par:
      </Typography>
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <Select
          value={filterRole}
          onChange={(e) => onFilterChange(e.target.value)}
          sx={{
            bgcolor: "white",
            "& .MuiOutlinedInput-notchedOutline": {
              border: "1px solid #e5e7eb",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              border: "1px solid #d1d5db",
            },
          }}
        >
          <MenuItem value="All">Tous</MenuItem>
          <MenuItem value="Admin">Admin</MenuItem>
          <MenuItem value="User">Utilisateur</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default AdminRoleFilter;
