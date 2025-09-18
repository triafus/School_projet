import { Box, CircularProgress, Typography } from "@mui/material";

interface LoadingSpinnerProps {
  size?: number;
  message?: string;
  centered?: boolean;
  color?: "primary" | "secondary" | "error" | "warning" | "info" | "success";
}

export const LoadingSpinner = (props: LoadingSpinnerProps) => {
  const { size = 40, message, centered = true, color = "primary" } = props;

  const content = (
    <>
      <CircularProgress size={size} color={color} />
      {message && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 2, textAlign: "center" }}
        >
          {message}
        </Typography>
      )}
    </>
  );

  if (centered) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 200,
          width: "100%",
        }}
      >
        {content}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {content}
    </Box>
  );
};

export default LoadingSpinner;
