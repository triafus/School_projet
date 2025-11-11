import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Box,
  Checkbox,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { BaseImageModal } from "../ImageModal/BaseImageModal";
import { CustomButton } from "../CustomButton";
import { Collection, CollectionFormData } from "../../types/collection";
import {
  useCreateCollection,
  useUpdateCollection,
} from "../../hooks/useCollection";

export interface CollectionFormModalProps {
  open: boolean;
  onClose: () => void;
  initialData?: Collection | null;
}

const toDefaultValues = (c?: Collection | null): CollectionFormData => ({
  title: c?.title || "",
  description: c?.description || "",
  is_private: c?.is_private ?? true,
});

export const CollectionFormModal = ({
  open,
  onClose,
  initialData,
}: CollectionFormModalProps) => {
  const isEdit = !!initialData;

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<CollectionFormData>({
    defaultValues: toDefaultValues(initialData || null),
    mode: "onChange",
  });

  useEffect(() => {
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
    null;

  const onSubmit = handleSubmit(async (data) => {
    const payload: CollectionFormData = {
      title: data.title,
      description: data.description,
      is_private: data.is_private,
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
            disabled={!isValid || loading}
          >
            {isEdit ? "Enregistrer" : "Créer"}
          </CustomButton>
        </>
      }
    >
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
      </Box>
    </BaseImageModal>
  );
};

export default CollectionFormModal;
