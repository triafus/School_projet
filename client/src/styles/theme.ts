import { SxProps, Theme } from "@mui/material";

// Common text field styles
export const textFieldStyles: SxProps<Theme> = {
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
};

// Common button styles
export const primaryButtonStyles: SxProps<Theme> = {
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
};

// Common label styles
export const labelStyles: SxProps<Theme> = {
  color: "#374151",
  mb: 1,
  fontWeight: 500,
};

// Navigation drawer styles
export const drawerStyles = {
  background: "linear-gradient(180deg, #2c2c2c 0%, #1a1a1a 50%, #000000 100%)",
  borderColor: "rgba(255, 255, 255, 0.1)",
};

// Gallery background styles
export const galleryBackgroundStyles: SxProps<Theme> = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #000000 100%)",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  position: "relative",
  overflow: "hidden",
  p: "3rem 0",
};
