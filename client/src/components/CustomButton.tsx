import { Button, ButtonProps } from "@mui/material";
import { forwardRef } from "react";

export type CustomButtonProps = ButtonProps & {};

export const CustomButton = forwardRef<HTMLButtonElement, CustomButtonProps>(
  (props, ref) => {
    const { children, sx, variant = "contained", ...rest } = props;

    return (
      <Button
        ref={ref}
        variant={variant}
        {...rest}
        sx={{
          maxHeight: "40px",
          "&.MuiButton-root.Mui-disabled": {
            backgroundColor: "rgba(0, 0, 0, 0.12)",
          },
          "&.MuiButton-contained": {
            backgroundColor: "#2c3e50",
            "&:hover": {
              backgroundColor: "#34495e",
            },
          },
          "&.MuiButton-outlined": {
            color: "#2c3e50",
            borderColor: "#2c3e50",
            "&:hover": {
              color: "#34495e",
              borderColor: "#34495e",
              backgroundColor: "rgba(0, 0, 0, 0.08)",
            },
          },

          borderRadius: 2,
          ...sx,
        }}
      >
        {children}
      </Button>
    );
  }
);

CustomButton.displayName = "CustomButton";
