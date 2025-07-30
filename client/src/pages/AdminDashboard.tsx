import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Button,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  FormControlLabel,
  Switch,
  Container,
} from "@mui/material";
import {
  Person as PersonIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useAuth } from "../hooks/useAuth";
import { useUsers, useUpdateUserRole, useDeleteUser } from "../hooks/useUser";

const AdminDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [error, setError] = useState<string | null>(null);
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);
  const [roleToggles, setRoleToggles] = useState<Record<number, boolean>>({});
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  const { user: currentUser } = useAuth();
  const {
    data: users = [],
    isLoading,
    isError,
    error: queryError,
  } = useUsers();
  const updateUserRoleMutation = useUpdateUserRole();

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  useEffect(() => {
    const initialToggles = users.reduce(
      (acc, user) => {
        acc[user.id] = user.role === "admin";
        return acc;
      },
      {} as Record<number, boolean>
    );
    setRoleToggles(initialToggles);
  }, [users]);

  const handleUpdateRole = async (userId: number) => {
    const currentState = roleToggles[userId];
    const newRole = currentState ? "user" : "admin";
    setRoleToggles((prev) => ({ ...prev, [userId]: !currentState }));

    try {
      setUpdatingUserId(userId);
      await updateUserRoleMutation.mutateAsync({ userId, role: newRole });
    } catch (error) {
      setRoleToggles((prev) => ({ ...prev, [userId]: currentState }));
      setError("Échec de la mise à jour du rôle");
    } finally {
      setUpdatingUserId(null);
    }
  };

  const deleteUserMutation = useDeleteUser();

  const handleDeleteUser = async (userId: number) => {
    if (userId === currentUser?.id) {
      setError("Vous ne pouvez pas supprimer votre propre compte");
      return;
    }

    try {
      setUserToDelete(userId);
      await deleteUserMutation.mutateAsync(userId);
    } catch (error) {
      setError("Échec de la suppression de l'utilisateur");
    } finally {
      setUserToDelete(null);
    }
  };

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
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setError(null)}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {error}
        </Alert>
      )}

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
        <TableContainer>
          <Table
            sx={{
              "& .MuiTableCell-root": { borderBottom: "1px solid #f3f4f6" },
            }}
          >
            <TableHead>
              <TableRow sx={{ bgcolor: "#f9fafb" }}>
                <TableCell padding="checkbox" sx={{ width: 48 }}></TableCell>
                <TableCell
                  sx={{
                    color: "#6b7280",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Nom
                </TableCell>
                <TableCell
                  sx={{
                    color: "#6b7280",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Prénom
                </TableCell>
                <TableCell
                  sx={{
                    color: "#6b7280",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Email
                </TableCell>
                <TableCell
                  sx={{
                    color: "#6b7280",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Rôle
                </TableCell>
                <TableCell width={48}></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow
                  key={user.id}
                  sx={{
                    "&:hover": { bgcolor: "#f9fafb" },
                    "&:last-child td": { borderBottom: 0 },
                  }}
                >
                  <TableCell padding="checkbox"></TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar
                        sx={{
                          bgcolor:
                            user.role === "admin" ? "#10b981" : "#6366f1",
                          width: 32,
                          height: 32,
                          fontSize: "0.75rem",
                          fontWeight: 600,
                        }}
                      >
                        {getInitials(user.firstName, user.lastName)}
                      </Avatar>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 500, color: "#111827" }}
                      >
                        {user.lastName}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: "#111827" }}>
                      {user.firstName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: "#6b7280" }}>
                      {user.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{ display: "flex", alignItems: "center", width: 120 }}
                    >
                      <FormControlLabel
                        control={
                          <Switch
                            checked={roleToggles[user.id] || false}
                            onChange={() => handleUpdateRole(user.id)}
                            disabled={
                              user.id === currentUser?.id ||
                              updatingUserId === user.id
                            }
                            color={roleToggles[user.id] ? "success" : "default"}
                          />
                        }
                        label={
                          <Typography
                            variant="body2"
                            sx={{
                              color: roleToggles[user.id]
                                ? "#10b981"
                                : "#6b7280",
                              fontWeight: roleToggles[user.id] ? 600 : 400,
                            }}
                          >
                            {roleToggles[user.id] ? "Admin" : "User"}
                          </Typography>
                        }
                        labelPlacement="end"
                        sx={{ m: 0 }}
                      />
                      {updatingUserId === user.id && (
                        <CircularProgress size={20} sx={{ ml: 2 }} />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {user.id !== currentUser?.id && (
                      <Tooltip title="Supprimer l'utilisateur">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={userToDelete === user.id}
                          sx={{
                            color: "#9ca3af",
                            "&:hover": { color: "#ef4444" },
                          }}
                        >
                          {userToDelete === user.id ? (
                            <CircularProgress size={20} />
                          ) : (
                            <DeleteIcon fontSize="small" />
                          )}
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

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

export default AdminDashboard;
