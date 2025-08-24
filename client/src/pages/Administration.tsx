import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  Container,
} from "@mui/material";
import {
  Person as PersonIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { useUsers } from "../hooks/useUser";
import ErrorAlert from "../components/ErrorAlert";
import TableAdminDashboard from "../components/TableAdminDashboard";

const Administration = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [error, setError] = useState<string | null>(null);

  const {
    data: users = [],
    isLoading,
    isError,
    error: queryError,
  } = useUsers();

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterRole === "All" ||
      (filterRole === "Admin" && user.role === "admin") ||
      (filterRole === "User" && user.role === "user");

    return matchesSearch && matchesFilter;
  });

  const ErrorMessage = () => (
    <Box sx={{ textAlign: "center" }}>
      <Alert severity="error">
        {queryError instanceof Error ? queryError.message : "Erreur inconnue"}
      </Alert>
    </Box>
  );

  return (
    <Container sx={{ p: 4, bgcolor: "#fafafa", minHeight: "100vh" }}>
      {error && <ErrorAlert error={error} setError={setError} />}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 600, color: "#1f2937", mb: 0.5 }}
          >
            Utilisateurs
          </Typography>
          <Typography variant="body2" sx={{ color: "#6b7280" }}>
            {users.length} Utilisateurs
          </Typography>
        </Box>
        {isError && <ErrorMessage />}

        <TextField
          size="small"
          placeholder="Rechercher..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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
      </Box>

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
            onChange={(e) => setFilterRole(e.target.value)}
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

      <Box
        sx={{ bgcolor: "white", borderRadius: 2, border: "1px solid #e5e7eb" }}
      >
        <TableAdminDashboard
          filterRole={filterRole}
          searchQuery={searchQuery}
          setError={setError}
        />
        {isLoading && (
          <Box sx={{ p: 8, textAlign: "center" }}>
            <CircularProgress color="inherit" size={60} />
            <Typography variant="h6" sx={{ color: "#6b7280", mb: 1 }}>
              Chargement...
            </Typography>
          </Box>
        )}

        {filteredUsers.length === 0 && !isLoading ? (
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
        ) : (
          <></>
        )}
      </Box>
    </Container>
  );
};

export default Administration;
