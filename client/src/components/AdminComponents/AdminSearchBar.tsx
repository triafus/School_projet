import React from "react";
import { TextField, InputAdornment } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";

interface AdminSearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const AdminSearchBar = (props: AdminSearchBarProps) => {
  const { searchQuery, onSearchChange } = props;
  return (
    <TextField
      size="small"
      placeholder="Rechercher..."
      value={searchQuery}
      onChange={(e) => onSearchChange(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
      sx={{
        bgcolor: "white",
        borderRadius: 2,
        minWidth: 250,
        "& .MuiOutlinedInput-root": {
          borderRadius: 2,
        },
      }}
    />
  );
};

export default AdminSearchBar;
