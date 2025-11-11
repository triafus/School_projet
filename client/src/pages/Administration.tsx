import React, { useState } from "react";
import { Box, Container, Stack } from "@mui/material";
import { useUsers } from "../hooks/useUser";
import ErrorAlert from "../components/ErrorAlert";
import TableAdminDashboard from "../components/AdminComponents/TableAdminDashboard";
import AdminHeader from "../components/AdminComponents/AdminHeader";
import AdminSearchBar from "../components/AdminComponents/AdminSearchBar";
import AdminRoleFilter from "../components/AdminComponents/AdminRoleFilter";
import AdminErrorMessage from "../components/AdminComponents/AdminErrorMessage";
import AdminLoadingState from "../components/AdminComponents/AdminLoadingState";
import AdminEmptyState from "../components/AdminComponents/AdminEmptyState";
import { TableAppove } from "../components/AdminComponents/TableAppove";

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
        <AdminHeader userCount={users.length} />
        {isError && <AdminErrorMessage error={queryError} />}
        <AdminSearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </Box>

      <AdminRoleFilter filterRole={filterRole} onFilterChange={setFilterRole} />
      <Stack gap={3}>
        <Box
          sx={{
            bgcolor: "white",
            borderRadius: 2,
            border: "1px solid #e5e7eb",
          }}
        >
          <TableAdminDashboard
            filterRole={filterRole}
            searchQuery={searchQuery}
            setError={setError}
          />

          {isLoading && <AdminLoadingState />}

          {filteredUsers.length === 0 && !isLoading && <AdminEmptyState />}
        </Box>

        <Box>
          <TableAppove />
        </Box>
      </Stack>
    </Container>
  );
};

export default Administration;
