import React, { useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Chip,
  Tooltip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  AdminPanelSettings as AdminIcon,
  Home as HomeIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  MoreVert as MoreVertIcon,
  ChevronRightOutlined,
  MoreHorizOutlined,
} from "@mui/icons-material";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const DRAWER_WIDTH = 280;
const COLLAPSED_WIDTH = 72;

const Navigation = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { user, logout } = useAuth();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleProfileMenuOpen = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    logout();
  };

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
      setIsCollapsed(!isCollapsed);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  console.log(isMobile, isCollapsed);

  const menuItems = [
    {
      text: "Dashboard",
      icon: <DashboardIcon />,
      path: "/home",
      color: "#667eea",
    },
    ...(user?.role === "admin"
      ? [
          {
            text: "Admin Panel",
            icon: <AdminIcon />,
            path: "/admin/dashboard",
            color: "#f093fb",
          },
        ]
      : []),
  ];

  const isActive = (path: string) => location.pathname === path;

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        background:
          "linear-gradient(180deg, #2c2c2c 0%, #1a1a1a 50%, #000000 100%)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Header avec logo */}
      <Box
        sx={{
          p: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          gap: 2,
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          minHeight: 80,
          padding: "16px",
        }}
      >
        {isCollapsed ? (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <img
              src="./../public/assets/PickU_logo_color.png"
              alt="Pict'U"
              style={{ maxWidth: "100%", height: "40px" }}
            />
          </Box>
        ) : (
          <Box display="flex" alignItems="center" gap={1}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                width: 40,
                height: 40,
              }}
            >
              <img
                src="./../public/assets/PickU_logo_color.png"
                alt="Pict'U"
                style={{ maxWidth: "100%", height: "40px" }}
              />
            </Box>
            <Typography
              variant="h6"
              sx={{
                color: "white",
                fontWeight: 700,
                fontSize: "1.25rem",
                letterSpacing: "-0.02em",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Pict'U
            </Typography>
          </Box>
        )}

        {!isMobile && !isCollapsed && (
          <IconButton
            onClick={handleDrawerToggle}
            sx={{
              color: "white",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              width: 32,
              height: 32,
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.2)",
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      {/* Navigation principale */}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={2}
        sx={{ flex: 1, px: 2, py: 1 }}
      >
        {isCollapsed && (
          <IconButton
            onClick={handleDrawerToggle}
            size="large"
            sx={{
              borderRadius: 20,
              color: "white",
              width: 48,
              height: 0,
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.2)",
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            <MoreHorizOutlined fontSize="small" />
          </IconButton>
        )}
        <List sx={{ p: 0, "& .MuiListItem-root": { px: 0 } }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} sx={{ mb: 0.5 }}>
              <Tooltip title={isCollapsed ? item.text : ""} placement="right">
                <ListItemButton
                  component={Link}
                  to={item.path}
                  sx={{
                    borderRadius: "12px",
                    py: 1.2,
                    px: isCollapsed ? 1.5 : 2,
                    minHeight: 48,
                    backgroundColor: isActive(item.path)
                      ? "rgba(255, 255, 255, 0.08)"
                      : "transparent",
                    border: isActive(item.path)
                      ? "1px solid rgba(255, 255, 255, 0.1)"
                      : "1px solid transparent",
                    backdropFilter: isActive(item.path) ? "blur(10px)" : "none",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      transform: "translateX(2px)",
                    },
                    transition: "all 0.2s ease-in-out",
                    justifyContent: isCollapsed ? "center" : "flex-start",
                    alignItems: "center",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: "white",
                      minWidth: isCollapsed ? "auto" : 40,
                      justifyContent: "center",
                      mr: isCollapsed ? 0 : 1,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {!isCollapsed && (
                    <ListItemText
                      primary={item.text}
                      sx={{
                        m: 0,
                        "& .MuiListItemText-primary": {
                          color: "white",
                          fontWeight: isActive(item.path) ? 600 : 500,
                          fontSize: "0.95rem",
                        },
                      }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Section utilisateur en bas */}
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
              borderRadius: "12px",
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
                {user?.firstName} {user?.lastName}
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
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Box>
        ) : (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Tooltip
              title={`${user?.firstName} ${user?.lastName}`}
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

      {/* Menu profil */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        PaperProps={{
          sx: {
            mt: -1,
            minWidth: 200,
            borderRadius: "12px",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          },
        }}
        transformOrigin={{ horizontal: "left", vertical: "bottom" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleProfileMenuClose}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Mon Profil</ListItemText>
        </MenuItem>

        <Divider />
        <MenuItem
          onClick={handleLogout}
          sx={{
            color: "#f44336",
            "&:hover": {
              backgroundColor: "rgba(244, 67, 54, 0.08)",
            },
          }}
        >
          <ListItemIcon>
            <LogoutIcon fontSize="small" sx={{ color: "#f44336" }} />
          </ListItemIcon>
          <ListItemText>Déconnexion</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Mobile drawer */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              boxSizing: "border-box",
              border: "none",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Desktop drawer */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: isCollapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: isCollapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH,
              boxSizing: "border-box",
              border: "none",
              transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Mobile menu button */}
      {isMobile && !isCollapsed && (
        <IconButton
          onClick={handleDrawerToggle}
          sx={{
            position: "fixed",
            top: 16,
            left: 16,
            zIndex: 1300,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            color: "white",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.9)",
            },
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: "100vh",
          backgroundColor: "#f8fafc",
          ml: isMobile ? 0 : 0,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Navigation;
