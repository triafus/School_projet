import React from "react";
import { Divider } from "@mui/material";
import { usePostImage } from "../../hooks/useImage";
import { useImageForm } from "../../hooks/useImageForm";
import { CustomButton } from "../CustomButton";
import { BaseImageModal } from "./BaseImageModal";
import { ImageUploadArea } from "./ImageUploadArea";
import { ImageFormFields } from "./ImageFormFields";

interface AddImageModalProps {
  open: boolean;
  onClose: () => void;
}

export const AddImageModal = (props: AddImageModalProps) => {
  const { open, onClose } = props;

  const { mutateAsync: postImage, isPending, error } = usePostImage();

  const {
    form,
    resetForm,
    imagePreview,
    setImagePreview,
    compressing,
    setCompressing,
  } = useImageForm();

  const handleSubmit = form.handleSubmit(async (data) => {
    if (!imagePreview) {
      return;
    }

    await postImage({
      file: imagePreview?.compressed || imagePreview?.file,
      imageData: {
        ...data,
      },
    }).then(() => {
      handleClose();
    });
  });

  const handleClose = () => {
    if (!isPending) {
      resetForm();
      onClose();
    }
  };

  const actions = (
    <>
      <CustomButton
        color="error"
        onClick={handleClose}
        variant="outlined"
        disabled={isPending}
      >
        Annuler
      </CustomButton>
      <CustomButton
        onClick={handleSubmit}
        disabled={!imagePreview || !form.formState.isValid || isPending}
      >
        Ajouter l'image
      </CustomButton>
    </>
  );

  return (
    <BaseImageModal
      open={open}
      onClose={handleClose}
      title="Ajouter une image"
      error={error?.message}
      loading={isPending}
      actions={actions}
    >
      <ImageUploadArea
        imagePreview={imagePreview}
        setImagePreview={setImagePreview}
        compressing={compressing}
        setCompressing={setCompressing}
        disabled={isPending}
      />

      <Divider sx={{ mb: 3 }} />

      <ImageFormFields form={form} disabled={isPending} titleRequired={true} />
    </BaseImageModal>
  );
};
