import React, { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Autocomplete,
  Box,
  Checkbox,
  Chip,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import { BaseImageModal } from "../ImageModal/BaseImageModal";
import { CustomButton } from "../CustomButton";
import { Collection, CollectionFormData } from "../../types/collection";
import { Image } from "../../types/image";
import {
  useCreateCollection,
  useUpdateCollection,
} from "../../hooks/useCollection";
import { useUserImages } from "../../hooks/useImage";

export interface CollectionFormModalProps {
  open: boolean;
  onClose: () => void;
  initialData?: Collection | null; // if provided -> edit mode
}

// Map initial Collection to form default values
const toDefaultValues = (
  c?: Collection | null
): CollectionFormData & { imageIds: number[] } => ({
  title: c?.title || "",
  description: c?.description || "",
  is_private: c?.is_private ?? true,
  imageIds: c?.images?.map((i) => i.id) || [],
});

const labelForImage = (img: Image) => `${img.title} (#${img.id})`;

export const CollectionFormModal = ({
  open,
  onClose,
  initialData,
}: CollectionFormModalProps) => {
  const isEdit = !!initialData;

  // Load user's images for selection
  const {
    data: userImages = [],
    isLoading: loadingImages,
    error: imagesError,
  } = useUserImages();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { isValid },
  } = useForm<CollectionFormData & { imageIds: number[] }>({
    defaultValues: toDefaultValues(initialData || null),
    mode: "onChange",
  });

  useEffect(() => {
    // Reset when opening/initialData changes
    reset(toDefaultValues(initialData || null));
  }, [initialData, reset, open]);

  const {
    mutateAsync: createCollection,
    isPending: creating,
    error: createError,
  } = useCreateCollection();
  const {
    mutateAsync: updateCollection,
    isPending: updating,
    error: updateError,
  } = useUpdateCollection();

  const loading = creating || updating;
  const errorMessage =
    (createError as any)?.message ||
    (updateError as any)?.message ||
    (imagesError as any)?.message ||
    null;

  const selectedImages = useMemo(() => {
    // Build selected Image[] from imageIds
    const imageIds = (initialData?.images || []).map((i) => i.id);
    return userImages.filter((img) => imageIds.includes(img.id));
  }, [initialData, userImages]);

  const onSubmit = handleSubmit(async (data) => {
    const payload: CollectionFormData = {
      title: data.title,
      description: data.description,
      is_private: data.is_private,
      imageIds: data.imageIds || [],
    };

    if (isEdit && initialData) {
      await updateCollection({ id: initialData.id, payload });
    } else {
      await createCollection(payload);
    }

    onClose();
  });

  return (
    <BaseImageModal
      open={open}
      onClose={onClose}
      title={isEdit ? "Modifier la collection" : "Nouvelle collection"}
      error={errorMessage}
      loading={loading}
      actions={
        <>
          <CustomButton
            color="error"
            onClick={onClose}
            variant="outlined"
            disabled={loading}
          >
            Annuler
          </CustomButton>
          <CustomButton
            onClick={onSubmit}
            disabled={!isValid || loading || loadingImages}
          >
            {isEdit ? "Enregistrer" : "Créer"}
          </CustomButton>
        </>
      }
    >
      {loadingImages && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Chargement de vos images disponibles...
        </Alert>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Title */}
        <Controller
          name="title"
          control={control}
          rules={{ required: "Le titre est requis" }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Titre"
              placeholder="Titre de la collection"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              fullWidth
            />
          )}
        />

        {/* Description */}
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Description"
              placeholder="Description (optionnelle)"
              multiline
              minRows={2}
              fullWidth
            />
          )}
        />

        {/* Privacy */}
        <Controller
          name="is_private"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Checkbox
                  checked={!!field.value}
                  onChange={(_, v) => field.onChange(v)}
                />
              }
              label="Collection privée"
            />
          )}
        />

        {/* Images selection */}
        <Controller
          name="imageIds"
          control={control}
          render={({ field }) => (
            <Autocomplete
              multiple
              options={userImages}
              getOptionLabel={(option) => labelForImage(option)}
              value={userImages.filter((img) =>
                (field.value || []).includes(img.id)
              )}
              onChange={(_, newValue) =>
                field.onChange(newValue.map((img) => img.id))
              }
              renderTags={(value: readonly Image[], getTagProps) =>
                value.map((option: Image, index: number) => (
                  <Chip
                    variant="outlined"
                    label={labelForImage(option)}
                    {...getTagProps({ index })}
                    key={option.id}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Images à inclure"
                  placeholder="Sélectionner des images"
                />
              )}
            />
          )}
        />

        {isEdit && initialData && (
          <Typography variant="caption" color="text.secondary">
            Astuce: vous pouvez ajouter ou retirer des images en modifiant la
            liste ci-dessus.
          </Typography>
        )}
      </Box>
    </BaseImageModal>
  );
};

export default CollectionFormModal;
