import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoggingIn } = useAuth();
  const navigate = useNavigate();
  const from = "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });
    if (isLoggingIn) {
      navigate(from, { replace: true });
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          bgcolor: "#fafafa",
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            justifyContent: "space-between",
            p: 6,
            bgcolor: "white",
            borderRadius: 8,
            border: "4px solid white",
            backgroundImage: `url('../../public/assets/DeathNature.jpg')`,
          }}
        >
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 400,
                color: "rgb(236, 237, 240)",
                mb: 1,
                letterSpacing: "0.080em",
              }}
            >
              Daria-Yakovleva
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 4,
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 400,
            }}
          >
            <Box sx={{ mb: 6 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 600,
                  color: "#0f172a",
                  mb: 1,
                  letterSpacing: "-0.025em",
                }}
              >
                Sign up
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#64748b",
                }}
              >
                Already have an account?
                <Typography
                  component={Link}
                  to="/register"
                  sx={{
                    color: "#3b82f6",
                    textDecoration: "underline",
                    fontWeight: 500,
                    "&:hover": {
                      color: "#2563eb",
                    },
                  }}
                >
                  Register
                </Typography>
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <Typography
                variant="body2"
                sx={{
                  color: "#374151",
                  mb: 1,
                  fontWeight: 500,
                }}
              >
                Email address
              </Typography>
              <TextField
                fullWidth
                type="email"
                placeholder="hello@walter-miller.co"
                value={email}
                autoComplete="email"
                disabled={isLoggingIn}
                onChange={(e) => setEmail(e.target.value)}
                required
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "white",
                    borderRadius: 2,
                    "& fieldset": {
                      borderColor: "#d1d5db",
                    },
                    "&:hover fieldset": {
                      borderColor: "#9ca3af",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#3b82f6",
                      borderWidth: 2,
                    },
                  },
                  "& .MuiOutlinedInput-input": {
                    py: 1.5,
                  },
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: "#374151",
                  mb: 1,
                  fontWeight: 500,
                }}
              >
                Password
              </Typography>
              <TextField
                fullWidth
                type="password"
                placeholder="••••••••••••••••••••"
                value={password}
                disabled={isLoggingIn}
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
                required
                sx={{
                  mb: 4,
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "white",
                    borderRadius: 2,
                    "& fieldset": {
                      borderColor: "#d1d5db",
                    },
                    "&:hover fieldset": {
                      borderColor: "#9ca3af",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#3b82f6",
                      borderWidth: 2,
                    },
                  },
                  "& .MuiOutlinedInput-input": {
                    py: 1.5,
                  },
                }}
              />

              <Button
                type="submit"
                fullWidth
                disabled={isLoggingIn}
                sx={{
                  py: 1.5,
                  bgcolor: "#374151",
                  color: "white",
                  fontSize: "1rem",
                  fontWeight: 500,
                  borderRadius: 2,
                  textTransform: "none",
                  "&:hover": {
                    bgcolor: "#1f2937",
                  },
                  "&:disabled": {
                    bgcolor: "#d1d5db",
                    color: "#9ca3af",
                  },
                  mb: 4,
                }}
              >
                {isLoggingIn ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CircularProgress size={20} color="inherit" />
                    Connexion...
                  </Box>
                ) : (
                  "Join"
                )}
              </Button>
            </form>
          </Box>
        </Box>
      </Box>
    </>
  );
};
