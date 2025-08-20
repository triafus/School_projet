import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Grid,
} from "@mui/material";
import SpainCastle from "/assets/SpainCastle.jpg";

export const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    images: [],
  });
  const [error, setError] = useState<string | null>(null);
  const { register, isRegistering } = useAuth();
  const navigate = useNavigate();
  const from = "/";

  useEffect(() => {
    if (isRegistering) {
      navigate(from, { replace: true });
    }
  }, [isRegistering, navigate, from]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await register(formData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue lors de l'inscription"
      );
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="row-reverse"
      sx={{
        minHeight: "100vh",
        bgcolor: "#fafafa",
      }}
    >
      {/* Partie gauche - Image/Branding */}
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
          backgroundImage: `url(${SpainCastle})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
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
            Architech
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "rgba(236, 237, 240, 0.71)",
              fontWeight: 400,
            }}
          >
            The Best Architecture Magazine
          </Typography>
        </Box>

        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "rgb(236, 237, 240)",
              mb: 0.5,
            }}
          >
            Architecture, Spain
          </Typography>
        </Box>
      </Box>

      {/* Partie droite - Formulaire */}
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
              Create account
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#64748b",
              }}
            >
              Already have an account ?{" "}
              <Typography
                component={Link}
                to="/login"
                sx={{
                  color: "#3b82f6",
                  textDecoration: "underline",
                  fontWeight: 500,
                  "&:hover": {
                    color: "#2563eb",
                  },
                }}
              >
                Login
              </Typography>
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid sx={{ xs: 12, sm: 6 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#374151",
                    mb: 1,
                    fontWeight: 500,
                  }}
                >
                  First name
                </Typography>
                <TextField
                  fullWidth
                  type="text"
                  name="firstName"
                  placeholder="John"
                  autoComplete="given-name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  disabled={isRegistering}
                  sx={{
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
              </Grid>
              <Grid sx={{ xs: 12, sm: 6 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#374151",
                    mb: 1,
                    fontWeight: 500,
                  }}
                >
                  Last name
                </Typography>
                <TextField
                  fullWidth
                  type="text"
                  name="lastName"
                  placeholder="Doe"
                  autoComplete="family-name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  disabled={isRegistering}
                  sx={{
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
              </Grid>
            </Grid>

            <Box sx={{ mt: 3 }}>
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
                name="email"
                placeholder="hello@example.com"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isRegistering}
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
            </Box>

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
              name="password"
              placeholder="••••••••••••••••••••"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isRegistering}
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

            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  bgcolor: "#fef2f2",
                  color: "#dc2626",
                  border: "1px solid #fecaca",
                  "& .MuiAlert-icon": {
                    color: "#dc2626",
                  },
                }}
              >
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              disabled={isRegistering}
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
              {isRegistering ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CircularProgress size={20} color="inherit" />
                  Inscription...
                </Box>
              ) : (
                "Create account"
              )}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Register;
