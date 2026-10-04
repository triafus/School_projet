import { Button, ButtonProps } from '@mui/material';
import { forwardRef } from 'react';

export type CustomButtonProps = ButtonProps & {};

export const CustomButton = forwardRef<HTMLButtonElement, CustomButtonProps>(
  (props, ref) => {
    const { children, sx, variant = 'contained', ...rest } = props;

    return (
      <Button
        ref={ref}
        variant={variant}
        {...rest}
        sx={{
          maxHeight: '40px',
          fontWeight: 600,
          textTransform: 'none',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '& .MuiButton-startIcon, & .MuiButton-endIcon': {
            color: 'inherit',
          },
          '&.MuiButton-root.Mui-disabled': {
            backgroundColor: 'rgba(0, 0, 0, 0.12)',
            color: 'rgba(0, 0, 0, 0.38)',
            borderColor: 'transparent',
          },
          '&.MuiButton-contained:not(.MuiButton-containedError)': {
            backgroundColor: '#CD7476',
            color: '#111827',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            '&:hover': {
              backgroundColor: '#BA6264',
              color: '#000000',
              boxShadow: '0 4px 6px -1px rgba(205, 116, 118, 0.3)',
            },
            '&:active': {
              backgroundColor: '#A84C4E',
              color: '#FFFFFF',
            },
            '&:focus-visible': {
              outline: '2px solid #8E383A',
              outlineOffset: '2px',
            },
          },
          '&.MuiButton-outlined:not(.MuiButton-outlinedError)': {
            color: '#A84C4E',
            borderColor: '#CD7476',
            borderWidth: '1.5px',
            '&:hover': {
              color: '#8E383A',
              borderColor: '#A84C4E',
              backgroundColor: 'rgba(205, 116, 118, 0.08)',
            },
            '&:active': {
              backgroundColor: 'rgba(205, 116, 118, 0.16)',
            },
            '&:focus-visible': {
              outline: '2px solid #8E383A',
              outlineOffset: '2px',
            },
          },

          borderRadius: 2,
          ...sx,
        }}
      >
        {children}
      </Button>
    );
  },
);

CustomButton.displayName = 'CustomButton';
