import { Delete as DeleteIcon } from "@mui/icons-material";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Avatar,
  Typography,
  FormControlLabel,
  Switch,
  CircularProgress,
  Tooltip,
  IconButton,
} from "@mui/material";
import {
  useDeleteUser,
  useUpdateUserRole,
  useUsers,
} from "../../hooks/useUser";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";

interface TableAdminDashboardProps {
  searchQuery: string;
  filterRole: string;
  setError: (error: string | null) => void;
}

export const TableAdminDashboard = (props: TableAdminDashboardProps) => {
  const { searchQuery, filterRole, setError } = props;

  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);
  const [roleToggles, setRoleToggles] = useState<Record<number, boolean>>({});
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  const { data: users = [], isLoading } = useUsers();
  const updateUserRoleMutation = useUpdateUserRole();
  const { user: currentUser } = useAuth();
  const deleteUserMutation = useDeleteUser();

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
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

  const handleUpdateRole = async (userId: number) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    const newRole = user.role === "user" ? "admin" : "user";

    try {
      setUpdatingUserId(userId);
      await updateUserRoleMutation.mutateAsync({ userId, role: newRole });
    } catch (error) {
      setError("Échec de la mise à jour du rôle");
    } finally {
      setUpdatingUserId(null);
    }
  };

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

  return (
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
                      bgcolor: user.role === "admin" ? "#10b981" : "#6366f1",
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
                <Box sx={{ display: "flex", alignItems: "center", width: 120 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={user.role === "admin"}
                        onChange={() => handleUpdateRole(user.id)}
                        disabled={
                          user.id === currentUser?.id ||
                          updatingUserId === user.id
                        }
                        color={user.role === "admin" ? "success" : "default"}
                      />
                    }
                    label={
                      <Typography
                        variant="body2"
                        sx={{
                          color: roleToggles[user.id] ? "#10b981" : "#6b7280",
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
  );
};

export default TableAdminDashboard;
