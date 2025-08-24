import React from "react";
import { TextField, FormControlLabel, Switch } from "@mui/material";
import { Controller, UseFormReturn } from "react-hook-form";
import { ImageFormData } from "../../types/image";

interface ImageFormFieldsProps {
  form?: UseFormReturn<ImageFormData>;
  formData?: ImageFormData;
  onFormDataChange?: (data: Partial<ImageFormData>) => void;
  disabled?: boolean;
  titleRequired?: boolean;
}

export const ImageFormFields = (props: ImageFormFieldsProps) => {
  const {
    form,
    formData,
    onFormDataChange,
    disabled = false,
    titleRequired = false,
  } = props;

  if (form) {
    const {
      control,
      formState: { errors },
    } = form;

    return (
      <>
        <Controller
          name="title"
          control={control}
          rules={{
            required: titleRequired ? "Le titre est requis" : false,
            minLength: titleRequired
              ? { value: 1, message: "Le titre ne peut pas être vide" }
              : undefined,
          }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label={titleRequired ? "Titre *" : "Titre"}
              sx={{ mb: 2 }}
              disabled={disabled}
              error={!!errors.title}
              helperText={errors.title?.message}
            />
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Description"
              multiline
              rows={3}
              sx={{ mb: 2 }}
              disabled={disabled}
              error={!!errors.description}
              helperText={errors.description?.message}
            />
          )}
        />

        <Controller
          name="is_private"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Switch
                  checked={field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                />
              }
              label="Image privée"
            />
          )}
        />
      </>
    );
  }

  if (!formData || !onFormDataChange) {
    return null;
  }

  return (
    <>
      <TextField
        fullWidth
        label={titleRequired ? "Titre *" : "Titre"}
        value={formData.title}
        onChange={(e) => onFormDataChange({ title: e.target.value })}
        sx={{ mb: 2 }}
        disabled={disabled}
      />

      <TextField
        fullWidth
        label="Description"
        value={formData.description}
        onChange={(e) => onFormDataChange({ description: e.target.value })}
        multiline
        rows={3}
        sx={{ mb: 2 }}
        disabled={disabled}
      />

      <FormControlLabel
        control={
          <Switch
            checked={formData.is_private}
            onChange={(e) => onFormDataChange({ is_private: e.target.checked })}
            disabled={disabled}
          />
        }
        label="Image privée"
      />
    </>
  );
};
