import { useForm } from "react-hook-form";
import { useState } from "react";
import { CollectionFormData } from "../types/collection";

export const useCollectionForm = (defaultValues?: Partial<CollectionFormData>) => {
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);

  const form = useForm<CollectionFormData>({
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
    setImageFiles(null);
  };

  const updateFormData = (data: Partial<CollectionFormData>) => {
    Object.keys(data).forEach((key) => {
      const fieldName = key as keyof CollectionFormData;
      form.setValue(fieldName, data[fieldName] as any);
    });
  };

  return {
    form,
    formData: form.watch(),
    updateFormData,
    resetForm,

    imageFiles,
    setImageFiles,
  };
};