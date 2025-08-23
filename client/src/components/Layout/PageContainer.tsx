import React, { memo } from "react";
import { Box, SxProps, Theme } from "@mui/material";

interface PageContainerProps {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
  maxWidth?: number | string;
  padding?: number | string;
}

export const PageContainer: React.FC<PageContainerProps> = memo(
  ({ children, sx, maxWidth = 1400, padding = "2rem" }) => {
    return (
      <Box
        sx={{
          maxWidth,
          mx: "auto",
          px: padding,
          ...sx,
        }}
      >
        {children}
      </Box>
    );
  }
);

PageContainer.displayName = "PageContainer";

export default PageContainer;
