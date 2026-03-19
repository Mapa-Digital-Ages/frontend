import type { PaletteMode } from '@mui/material'
import { alpha, createTheme } from '@mui/material/styles'
import { AppColors } from './AppColors'
import { getPalette } from './palette'
import { appTypography } from './typography'

export function createAppTheme(mode: PaletteMode = 'light') {
  const palette = getPalette(mode)
  const primaryMain =
    mode === 'dark' ? AppColors.dark.primary : AppColors.light.primary

  return createTheme({
    palette,
    typography: appTypography,
    shape: {
      borderRadius: 18,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundImage:
              mode === 'dark'
                ? 'radial-gradient(circle at top left, rgba(140,180,255,0.10), transparent 32%), linear-gradient(180deg, #0D1626 0%, #10213A 100%)'
                : 'radial-gradient(circle at top left, rgba(31,75,153,0.10), transparent 28%), linear-gradient(180deg, #F4F7FB 0%, #EEF3FA 100%)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            minHeight: 44,
            borderRadius: 12,
            paddingInline: 18,
            textTransform: 'none',
            fontWeight: 600,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            border: `1px solid ${alpha(primaryMain, 0.08)}`,
            boxShadow:
              mode === 'dark'
                ? '0 18px 45px rgba(8, 17, 31, 0.30)'
                : '0 16px 40px rgba(16, 42, 67, 0.08)',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRight: 'none',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          fullWidth: true,
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            backgroundColor:
              mode === 'dark'
                ? alpha(AppColors.neutral.card, 0.03)
                : 'rgba(148, 163, 184, 0.08)',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: alpha(primaryMain, 0.14),
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: alpha(primaryMain, 0.26),
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: primaryMain,
              borderWidth: 1.5,
            },
          },
        },
      },
    },
  })
}
