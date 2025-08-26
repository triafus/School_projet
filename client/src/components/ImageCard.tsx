import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { Image } from "../types/image";
import { useSignedUrl } from "../hooks/useImage";
import { useEffect, useState } from "react";
import { ImageViewModal } from "./ImageModal/ImageViewModal";

interface ImageCardProps {
  image: Image;
  onClick?: () => void;
}

export const ImageCard = (props: ImageCardProps) => {
  const { onClick, image } = props;
  const {
    id,
    title,
    url,
    is_private: isPrivate,
    is_approved: isApproved,
  } = image;
  const [imageUrl, setImageUrl] = useState(url);

  const { data: signedUrlData, isSuccess } = useSignedUrl(id, isPrivate);

  useEffect(() => {
    if (isPrivate && isSuccess && signedUrlData) {
      setImageUrl(signedUrlData.url);
    } else {
      setImageUrl(url);
    }
  }, [isPrivate, isSuccess, signedUrlData, url]);

  return (
    <Box
      sx={{
        borderRadius: 2,
        position: "relative",
        width: "100%",
        maxHeight: 200,
        overflow: "hidden",
        backgroundColor: "#ededed",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {isPrivate && (
        <Chip
          label="Privé"
          size="small"
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            backgroundColor: "rgba(0,0,0,0.7)",
            color: "white",
            fontSize: "0.75rem",
            height: 24,
            zIndex: 1,
          }}
        />
      )}

      {!isApproved && (
        <Chip
          label="En attente"
          size="small"
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            bgcolor: "#fef3c7",
            color: "#92400e",
            fontSize: "0.75rem",
            height: 24,
            zIndex: 1,
          }}
        />
      )}

      <Box
        component="img"
        src={imageUrl}
        alt={title}
        onClick={onClick}
        sx={{
          width: "100%",
          height: "auto",
          maxHeight: 200,
          objectFit: "cover",
          transition: "transform 0.3s ease",
          "&:hover": {
            transform: "scale(1.02)",
            filter: "contrast(110%)",
            cursor: "pointer",
          },
        }}
      />
    </Box>
  );
};
