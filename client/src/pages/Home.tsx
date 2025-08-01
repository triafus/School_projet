import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirection si non authentifié
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <Stack alignItems="center" sx={{ p: 3 }}>
        <Card
          sx={{
            mb: 5,
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            borderRadius: 2,
            width: "100%",
            maxWidth: "800px",
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
              <Typography sx={{ color: "#555", mt: 1 }}>
                <strong>Rôle:</strong>{" "}
                {user?.role === "admin" ? "Administrateur" : "Utilisateur"}
              </Typography>
            </Paper>
          </CardContent>
        </Card>

        <Grid
          container
          spacing={3}
          justifyContent="center"
          sx={{ maxWidth: "1200px" }}
        >
          {[
            {
              title: "🔐 Authentification",
              description: "Système d'authentification complet avec JWT",
            },
            {
              title: "⚡ Performance",
              description:
                "Backend optimisé avec TypeScript et cache intelligent",
            },
            {
              title: "🎨 Interface moderne",
              description: "Material UI v6 avec thème personnalisable",
            },
            {
              title: "🛡️ Sécurité renforcée",
              description: "Tokens sécurisés et validation de rôles",
            },
            {
              title: "🔄 Synchronisation en temps réel",
              description: "TanStack Query pour des données toujours fraîches",
            },
            {
              title: "📱 Responsive design",
              description: "Adapté à tous les appareils",
            },
          ].map((feature) => (
            <Grid key={feature.title} sx={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.15)",
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#333",
                      mb: 2,
                      fontSize: "1.2rem",
                      minHeight: "3rem",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    sx={{
                      color: "#666",
                      lineHeight: 1.5,
                      minHeight: "4.5rem",
                    }}
                  >
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
