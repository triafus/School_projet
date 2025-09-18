import { Box, Avatar, Typography, IconButton, Tooltip } from "@mui/material";
import React from "react";
import { useAuth } from "../hooks/useAuth";
import { MoreVertRounded } from "@mui/icons-material";

interface ProfileProps {
  isCollapsed: boolean;
  setAnchorEl: (value: null | HTMLElement) => void;
}

export const Profile = (props: ProfileProps) => {
  const { isCollapsed, setAnchorEl } = props;
  const { user } = useAuth();

  const handleProfileMenuOpen = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <Box
      sx={{
        p: 2,
        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        backgroundColor: "rgba(0, 0, 0, 0.1)",
      }}
    >
      {!isCollapsed ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            p: 2,
            borderRadius: 3,
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <Avatar
            sx={{
              width: 44,
              height: 44,
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              color: "white",
              fontWeight: "bold",
              border: "2px solid rgba(255, 255, 255, 0.1)",
              fontSize: "1.1rem",
            }}
          >
            {user?.firstName?.charAt(0)?.toUpperCase()}
          </Avatar>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                color: "white",
                fontWeight: 600,
                fontSize: "0.9rem",
                lineHeight: 1.2,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user?.firstName || ""} {user?.lastName || ""}
            </Typography>
            <Typography
              sx={{
                color: "rgba(255, 255, 255, 0.7)",
                fontSize: "0.75rem",
                lineHeight: 1,
                mt: 0.5,
              }}
            >
              {user?.role === "admin" ? "Administrateur" : "Utilisateur"}
            </Typography>
          </Box>

          <IconButton
            onClick={handleProfileMenuOpen}
            sx={{
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <MoreVertRounded fontSize="small" />
          </IconButton>
        </Box>
      ) : (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Tooltip
            title={`${user?.firstName || "Profil"} ${user?.lastName || ""}`}
            placement="right"
          >
            <IconButton onClick={handleProfileMenuOpen}>
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  color: "white",
                  fontWeight: "bold",
                  border: "2px solid rgba(255, 255, 255, 0.3)",
                }}
              >
                {user?.firstName?.charAt(0)?.toUpperCase()}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </Box>
  );
};
