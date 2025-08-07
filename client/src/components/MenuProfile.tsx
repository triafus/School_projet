import {
  LoginOutlined,
  LogoutOutlined,
  Person2Outlined,
  PersonAddAlt1Outlined,
} from "@mui/icons-material";
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  Stack,
} from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface MenuProfileProps {
  anchorEl: null | HTMLElement;
  setAnchorEl: (value: null | HTMLElement) => void;
}

export const MenuProfile = (props: MenuProfileProps) => {
  const { anchorEl, setAnchorEl } = props;

  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    logout();
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleProfileMenuClose}
      PaperProps={{
        sx: {
          mt: 1,
          minWidth: 220,
          borderRadius: 3,
          background: "#ffffff",
          border: "1px solid rgba(0, 0, 0, 0.1)",
          boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)",
          "& .MuiMenuItem-root": {
            color: "#000000",
            py: 1.5,
            px: 2,
            borderRadius: 2,
            mx: 1,
            my: 0.5,
            transition: "all 0.2s ease",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.05)",
            },
          },
          "& .MuiListItemIcon-root": {
            color: "inherit",
            minWidth: 36,
          },
          "& .MuiDivider-root": {
            borderColor: "rgba(0, 0, 0, 0.12)",
            mx: 1,
            my: 1,
          },
        },
      }}
      transformOrigin={{ horizontal: "left", vertical: "bottom" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      {isAuthenticated ? (
        <>
          <MenuItem onClick={handleProfileMenuClose}>
            <ListItemIcon>
              <Person2Outlined fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Mon Profil"
              primaryTypographyProps={{
                fontWeight: 500,
                fontSize: "0.95rem",
              }}
            />
          </MenuItem>

          <Divider />

          <MenuItem
            onClick={handleLogout}
            sx={{
              "&:hover": {
                backgroundColor: "rgba(239, 68, 68, 0.08) !important",
              },
            }}
          >
            <ListItemIcon>
              <LogoutOutlined fontSize="small" sx={{ color: "#ef4444" }} />
            </ListItemIcon>
            <ListItemText
              primary="Déconnexion"
              primaryTypographyProps={{
                fontWeight: 500,
                fontSize: "0.95rem",
                color: "#ef4444",
              }}
            />
          </MenuItem>
        </>
      ) : (
        <Stack spacing={1} sx={{ p: 1.5 }}>
          <Button
            onClick={() => navigate("/register")}
            variant="contained"
            startIcon={<PersonAddAlt1Outlined />}
            sx={{
              borderRadius: 2.5,
              textTransform: "none",
              fontWeight: 600,
              height: 44,
              background: "linear-gradient(135deg, #000000 0%, #333333 100%)",
              boxShadow: "0 4px 14px rgba(0, 0, 0, 0.3)",
              border: "none",
              color: "#ffffff",
              "&:hover": {
                background: "linear-gradient(135deg, #1a1a1a 0%, #404040 100%)",
                boxShadow: "0 6px 20px rgba(0, 0, 0, 0.4)",
              },
            }}
          >
            Nous rejoindre
          </Button>

          <Button
            onClick={() => navigate("/login")}
            variant="outlined"
            startIcon={<LoginOutlined />}
            sx={{
              borderRadius: 2.5,
              textTransform: "none",
              fontWeight: 600,
              height: 44,
              color: "#000000",
              backgroundColor: "#ffffff",
              borderColor: "rgba(0, 0, 0, 0.2)",
              "&:hover": {
                borderColor: "rgba(0, 0, 0, 0.3)",
                backgroundColor: "rgba(0, 0, 0, 0.02)",
              },
            }}
          >
            Se connecter
          </Button>
        </Stack>
      )}
    </Menu>
  );
};
