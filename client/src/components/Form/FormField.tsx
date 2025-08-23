import React, { memo } from "react";
import { TextField, Typography, TextFieldProps } from "@mui/material";
import { textFieldStyles, labelStyles } from "../../styles/theme";

interface FormFieldProps extends Omit<TextFieldProps, "label"> {
  label: string;
  name: string;
}

export const FormField: React.FC<FormFieldProps> = memo(
  ({ label, name, sx, ...props }) => {
    return (
      <>
        <Typography variant="body2" sx={labelStyles}>
          {label}
        </Typography>
        <TextField
          name={name}
          fullWidth
          sx={{ ...textFieldStyles, ...sx }}
          {...props}
        />
      </>
    );
  }
);

FormField.displayName = "FormField";

export default FormField;
