import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Chip,
  Box,
} from "@mui/material";
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { Collection } from "../../types/collection";

interface CollectionCardProps {
  collection: Collection;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onView?: (id: number) => void;
  isOwner: boolean;
  isAdmin: boolean;
}

const CollectionCard = ({
  collection,
  onEdit,
  onDelete,
  onView,
  isOwner,
  isAdmin,
}: CollectionCardProps) => {
  const canEdit = isOwner || isAdmin;
  const canDelete = isOwner || isAdmin;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <Card
      sx={{
        maxWidth: 280,
        minHeight: 280,
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 3,
        },
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
      onClick={() => onView?.(collection.id)}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Chip
            size="small"
            label={collection.is_private ? "Privé" : "Public"}
            color={collection.is_private ? "secondary" : "primary"}
            variant="outlined"
          />
          <Typography variant="caption" color="text.secondary">
            {formatDate(collection.created_at || new Date().toISOString())}
          </Typography>
        </Box>

        <Typography
          variant="h6"
          component="div"
          sx={{ mb: 1, fontWeight: 600 }}
        >
          {collection.title}
        </Typography>

        {collection.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {collection.description}
          </Typography>
        )}

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {collection.images?.length || 0} image
            {collection.images?.length !== 1 ? "s" : ""}
          </Typography>
        </Box>

        {!collection.is_private && collection.user && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PersonIcon fontSize="small" color="action" />
            <Typography variant="caption" color="text.secondary">
              {collection.user.firstName && collection.user.lastName
                ? `${collection.user.firstName} ${collection.user.lastName}`
                : collection.user.email}
            </Typography>
          </Box>
        )}
      </CardContent>

      <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
        <Box>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onView?.(collection.id);
            }}
            sx={{ mr: 1 }}
          >
            <ViewIcon />
          </IconButton>
        </Box>

        {(canEdit || canDelete) && (
          <Box>
            {canEdit && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(collection.id);
                }}
                sx={{ mr: 1 }}
              >
                <EditIcon />
              </IconButton>
            )}
            {canDelete && (
              <IconButton
                size="small"
                color="error"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(collection.id);
                }}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </Box>
        )}
      </CardActions>
    </Card>
  );
};

export default CollectionCard;
