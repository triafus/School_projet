import { useState, useCallback } from "react";

export interface UseFormOptions<T> {
  initialValues: T;
  onSubmit: (values: T) => void | Promise<void>;
}

export const useForm = <T extends Record<string, any>>({
  initialValues,
  onSubmit,
}: UseFormOptions<T>) => {
  const [values, setValues] = useState<T>(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);

      try {
        await onSubmit(values);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, onSubmit]
  );

  const resetForm = useCallback(() => {
    setValues(initialValues);
  }, [initialValues]);

  const setValue = useCallback((name: keyof T, value: T[keyof T]) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  return {
    values,
    isSubmitting,
    handleChange,
    handleSubmit,
    resetForm,
    setValue,
  };
};
