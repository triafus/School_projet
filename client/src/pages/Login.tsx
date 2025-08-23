import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { useError } from "../hooks/useError";
import { ErrorAlert } from "../components/ErrorAlert";
import FormField from "../components/Form/FormField";
import LoadingButton from "../components/Form/LoadingButton";
import DeathNature from "/assets/DeathNature.jpg";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoggingIn, isAuthenticated, error: authError } = useAuth();
  const { error, setError, clearError } = useError();
  const navigate = useNavigate();
  const from = "/";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  useEffect(() => {
    if (authError) {
      setError(authError as string);
    }
  }, [authError, setError]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      clearError();
      login({ email, password });
    },
    [email, password, login, clearError]
  );

  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value);
    },
    []
  );

  const handlePasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
    },
    []
  );

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
            backgroundImage: `url(${DeathNature})`,
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
                Already have an account ?{" "}
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

            <ErrorAlert error={error} onClose={clearError} />

            <form onSubmit={handleSubmit}>
              <FormField
                label="Email address"
                name="email"
                type="email"
                placeholder="hello@walter-miller.co"
                value={email}
                autoComplete="email"
                disabled={isLoggingIn}
                onChange={handleEmailChange}
                required
                sx={{ mb: 3 }}
              />

              <FormField
                label="Password"
                name="password"
                type="password"
                placeholder="••••••••••••••••••••"
                value={password}
                disabled={isLoggingIn}
                autoComplete="current-password"
                onChange={handlePasswordChange}
                required
                sx={{ mb: 4 }}
              />

              <LoadingButton
                type="submit"
                fullWidth
                loading={isLoggingIn}
                loadingText="Connexion..."
                sx={{ mb: 4 }}
              >
                Se connecter
              </LoadingButton>
            </form>
          </Box>
        </Box>
      </Box>
    </>
  );
};
