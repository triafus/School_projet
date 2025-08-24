import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";

interface ImageCardProps {
  url: string;
  title: string;
  isPrivate?: boolean;
  onClick?: () => void;
}

export const ImageCard = (props: ImageCardProps) => {
  const { url, title, isPrivate, onClick } = props;
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

      <Box
        component="img"
        src={url}
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
