import { useForm } from "react-hook-form";
import { useState } from "react";
import { ImageFormData } from "../types/image";
import { ImagePreview } from "../utils/imageUtils";

export const useImageForm = (defaultValues?: Partial<ImageFormData>) => {
  const [imagePreview, setImagePreview] = useState<ImagePreview | null>(null);
  const [compressing, setCompressing] = useState(false);

  const form = useForm<ImageFormData>({
    defaultValues: {
      title: "",
      description: "",
      is_private: false,
      ...defaultValues,
    },
    mode: "onChange",
  });

  const resetForm = () => {
    form.reset();
    setImagePreview(null);
    setCompressing(false);
  };

  const updateFormData = (data: Partial<ImageFormData>) => {
    Object.keys(data).forEach((key) => {
      const fieldName = key as keyof ImageFormData;
      form.setValue(fieldName, data[fieldName] as any);
    });
  };

  return {
    form,
    formData: form.watch(),
    updateFormData,
    resetForm,

    imagePreview,
    setImagePreview,
    compressing,
    setCompressing,
  };
};
