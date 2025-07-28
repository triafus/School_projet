import React, { useState, useEffect } from "react";
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
  Chip,
  Button,
  Alert,
  CircularProgress,
  Backdrop,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Checkbox,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import {
  Person as PersonIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { userService } from "../services/user2Service";
import { useAuth } from "../contexts/authContext";

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: "user" | "admin";
  createdAt: string;
}

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [filterRole, setFilterRole] = useState("All");
  const { user: currentUser } = useAuth();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersData = await userService.getAllUsers();
      setUsers(usersData);
    } catch (err) {
      setError("Erreur lors du chargement des utilisateurs");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: number, newRole: "user" | "admin") => {
    if (userId === currentUser?.id) {
      setError("Vous ne pouvez pas modifier votre propre rôle");
      return;
    }

    try {
      setUpdatingUserId(userId);
      setError(null);

      await userService.updateUserRole(userId, newRole);

      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Erreur lors de la mise à jour du rôle"
      );
      console.error(err);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const handleSelectUser = (userId: number) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((user) => user.id));
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

  const getRoleDisplayName = (role: string) => {
    return role === "admin" ? "Administrateur" : "Utilisateur";
  };

  const getPermissionDisplayName = (role: string) => {
    return role === "admin" ? "Owner" : "Editor";
  };

  if (loading) {
    return (
      <Backdrop open={loading} sx={{ color: "#fff", zIndex: 1000 }}>
        <Box textAlign="center">
          <CircularProgress color="inherit" size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Chargement des utilisateurs...
          </Typography>
        </Box>
      </Backdrop>
    );
  }

  return (
    <Box sx={{ p: 4, bgcolor: "#fafafa", minHeight: "100vh" }}>
      {/* Message d'erreur */}
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

      {/* En-tête */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
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
      </Box>

      {/* Filtres */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, alignItems: "center" }}>
        <Typography
          variant="body2"
          sx={{ color: "#6b7280", minWidth: "fit-content" }}
        >
          Filter by:
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
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="User">User</MenuItem>
          </Select>
        </FormControl>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton size="small" sx={{ color: "#6b7280" }}>
          <SearchIcon />
        </IconButton>
        <IconButton size="small" sx={{ color: "#6b7280" }}>
          <FilterIcon />
        </IconButton>
      </Box>

      {/* Tableau */}
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
                <TableCell padding="checkbox" sx={{ width: 48 }}>
                  <Checkbox
                    size="small"
                    indeterminate={
                      selectedUsers.length > 0 &&
                      selectedUsers.length < filteredUsers.length
                    }
                    checked={
                      filteredUsers.length > 0 &&
                      selectedUsers.length === filteredUsers.length
                    }
                    onChange={handleSelectAll}
                    sx={{ color: "#9ca3af" }}
                  />
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
                  <TableCell padding="checkbox">
                    <Checkbox
                      size="small"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                      sx={{ color: "#9ca3af" }}
                    />
                  </TableCell>
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
                        {user.firstName} {user.lastName}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: "#6b7280" }}>
                      {user.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: "#6b7280" }}>
                      {getRoleDisplayName(user.role)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <FormControl size="small" sx={{ minWidth: 100 }}>
                      <Select
                        value={getPermissionDisplayName(user.role)}
                        disabled={
                          user.id === currentUser?.id ||
                          updatingUserId === user.id
                        }
                        onChange={(e) => {
                          const newRole =
                            e.target.value === "Owner" ? "admin" : "user";
                          if (newRole !== user.role) {
                            updateUserRole(user.id, newRole);
                          }
                        }}
                        sx={{
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },
                          "& .MuiSelect-select": {
                            color: "#6b7280",
                            fontSize: "0.875rem",
                            py: 0.5,
                          },
                        }}
                      >
                        <MenuItem value="Owner">Owner</MenuItem>
                        <MenuItem value="Editor">Editor</MenuItem>
                        <MenuItem value="Viewer">Viewer</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell>
                    {user.id !== currentUser?.id && (
                      <IconButton
                        size="small"
                        sx={{
                          color: "#9ca3af",
                          "&:hover": { color: "#ef4444" },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {filteredUsers.length === 0 && (
          <Box sx={{ p: 8, textAlign: "center" }}>
            <PersonIcon sx={{ fontSize: 48, color: "#d1d5db", mb: 2 }} />
            <Typography variant="h6" sx={{ color: "#6b7280", mb: 1 }}>
              Aucun utilisateur trouvé
            </Typography>
            <Typography variant="body2" sx={{ color: "#9ca3af" }}>
              Aucun utilisateur ne correspond à vos critères de recherche.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AdminUsers;
