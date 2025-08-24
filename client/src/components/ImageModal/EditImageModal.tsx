import React, { useEffect } from "react";
import { Divider, Box, Typography } from "@mui/material";
import { useAuth } from "../../hooks/useAuth";
import { useImageForm } from "../../hooks/useImageForm";
import { CustomButton } from "../CustomButton";
import { BaseImageModal } from "./BaseImageModal";
import { ImageUploadArea } from "./ImageUploadArea";
import { ImageFormFields } from "./ImageFormFields";
import { Image, ImageFormData } from "../../types/image";
import { usePatchImage } from "../../hooks/useImage";

interface EditImageModalProps {
  open: boolean;
  onClose: () => void;
  image: Image | null;
  onUpdate?: () => void;
}

export const EditImageModal = (props: EditImageModalProps) => {
  const { open, onClose, image, onUpdate } = props;

  const { form, resetForm, imagePreview } = useImageForm();

  const { mutateAsync: patchImageMutation, isPending } = usePatchImage();

  useEffect(() => {
    if (image && open) {
      Object.keys(image).forEach((key) => {
        const fieldName = key as keyof ImageFormData;
        form.setValue(fieldName, image[fieldName]);
      });
    }
  }, [image, open, form]);

  const handleSubmit = form.handleSubmit(async (data) => {
    if (!image?.id) return;

    patchImageMutation({
      imageId: image.id,
      updateData: {
        title: data.title,
        description: data.description,
        is_private: data.is_private,
      },
    }).then(() => {
      handleClose();
      onUpdate && onUpdate();
    });
  });

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const actions = (
    <>
      <CustomButton color="error" onClick={handleClose} variant="outlined">
        Annuler
      </CustomButton>
      <CustomButton
        onClick={handleSubmit}
        disabled={!form.formState.isValid || isPending}
      >
        {isPending ? "Modification en cours..." : "Modifier l'image"}
      </CustomButton>
    </>
  );

  return (
    <BaseImageModal
      open={open}
      onClose={handleClose}
      title="Modifier l'image"
      actions={actions}
    >
      {/* Current Image Display */}
      {image && !imagePreview && (
        <Box sx={{ mb: 3 }}>
          <Box
            component="img"
            src={image.url}
            alt={image.title}
            sx={{
              maxWidth: "100%",
              maxHeight: 200,
              borderRadius: 1,
              border: "1px solid",
              borderColor: "grey.300",
            }}
          />
        </Box>
      )}

      <Divider sx={{ mb: 3 }} />

      <ImageFormFields form={form} titleRequired={true} />
    </BaseImageModal>
  );
};
