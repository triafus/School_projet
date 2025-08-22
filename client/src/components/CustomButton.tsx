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
          "&.MuiButton-root.Mui-disabled": {
            backgroundColor: "rgba(0, 0, 0, 0.12)",
          },
          "&.MuiButton-contained": {
            backgroundColor: "#2c3e50",
            "&:hover": {
              backgroundColor: "#34495e",
            },
          },

          borderRadius: 2,
          px: 3,
          py: 1,
          ...sx,
        }}
      >
        {children}
      </Button>
    );
  }
);

CustomButton.displayName = "CustomButton";
