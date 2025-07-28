import React from "react";
import {
  Box,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Card,
  CardContent,
  Grid,
  Paper,
  Stack,
} from "@mui/material";
import { useAuth } from "../contexts/authContext";

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "white",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          color: "black",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h5" sx={{ color: "#333", fontWeight: "bold" }}>
            Dashboard
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Typography sx={{ color: "#666" }}>Bonjour</Typography>
              <Typography variant="h6" sx={{ color: "#333" }}>
                {user?.firstName}
              </Typography>
            </Box>
            <Button
              onClick={logout}
              sx={{
                backgroundColor: "#f44336",
                color: "white",
                "&:hover": {
                  backgroundColor: "#da190b",
                },
                px: 2,
                py: 1,
              }}
            >
              Déconnexion
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Stack alignItems="center">
        <Card
          sx={{
            mb: 5,
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            borderRadius: 2,
          }}
        >
          <CardContent sx={{ p: 5, textAlign: "center" }}>
            <Typography variant="h4" sx={{ color: "#333", mb: 4 }}>
              Bienvenue dans votre espace personnel !
            </Typography>
            <Paper
              sx={{
                backgroundColor: "#f8f9fa",
                p: 3,
                borderRadius: 2,
                maxWidth: 400,
                mx: "auto",
                textAlign: "left",
              }}
            >
              <Typography variant="h6" sx={{ color: "#333", mb: 2 }}>
                Informations du profil
              </Typography>
              <Typography sx={{ mb: 1, color: "#555" }}>
                <strong>Email:</strong> {user?.email}
              </Typography>
              <Typography sx={{ mb: 1, color: "#555" }}>
                <strong>Prénom:</strong> {user?.firstName}
              </Typography>
              <Typography sx={{ mb: 1, color: "#555" }}>
                <strong>Nom:</strong> {user?.lastName}
              </Typography>
              <Typography sx={{ color: "#555" }}>
                <strong>ID:</strong> {user?.id}
              </Typography>
            </Paper>
          </CardContent>
        </Card>

        <Grid container spacing={3}>
          {[
            {
              title: "🔐 Authentification",
              description: "Système d'authentification complet avec JWT",
            },
            {
              title: "⚡ Performance",
              description: "Backend NestJS optimisé avec TypeScript",
            },
            {
              title: "🎨 Interface",
              description: "Frontend React moderne et réactif",
            },
            {
              title: "🛡️ Sécurité",
              description: "Mots de passe hashés et routes protégées",
            },
          ].map((feature) => (
            <Grid key={feature.title}>
              <Card
                sx={{
                  height: "100%",
                  textAlign: "center",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{ color: "#333", mb: 2, fontSize: "1.2rem" }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography sx={{ color: "#666", lineHeight: 1.5 }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Box>
  );
};

export default Dashboard;
