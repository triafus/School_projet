import { useState, useCallback } from "react";

export const useError = (initialError: string | null = null) => {
  const [error, setError] = useState<string | null>(initialError);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const setErrorMessage = useCallback((message: string | null) => {
    setError(message);
  }, []);

  const handleError = useCallback((err: unknown) => {
    if (err instanceof Error) {
      setError(err.message);
    } else if (typeof err === "string") {
      setError(err);
    } else {
      setError("Une erreur inattendue s'est produite");
    }
  }, []);

  return {
    error,
    setError: setErrorMessage,
    clearError,
    handleError,
  };
};
