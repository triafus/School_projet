import { Alert, IconButton } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

interface ErrorAlertProps {
  error: string | null;
  setError: (error: string | null) => void;
}

export const ErrorAlert = (props: ErrorAlertProps) => {
  const { error, setError } = props;
  return (
    <Alert
      severity="error"
      sx={{ mb: 3 }}
      action={
        <IconButton
          aria-label="close"
          color="inherit"
          size="small"
          onClick={() => setError(null)}
        >
          <CloseIcon fontSize="inherit" />
        </IconButton>
      }
    >
      {error}
    </Alert>
  );
};

export default ErrorAlert;
