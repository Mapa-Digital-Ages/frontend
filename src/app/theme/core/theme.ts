import type { PaletteMode } from '@mui/material'
import { createTheme } from '@mui/material/styles'
import { getPalette } from './palette'
import { appTypography } from './typography'

export function createAppTheme(mode: PaletteMode = 'light') {
  const palette = getPalette(mode)

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
            backgroundImage: 'var(--app-body-gradient)',
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
            borderRadius: 'var(--app-radius-control)',
            paddingInline: 18,
            textTransform: 'none',
            fontWeight: 600,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 'var(--app-radius-card)',
            border: '1px solid var(--app-card-border)',
            boxShadow: 'var(--app-card-shadow)',
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
            borderRadius: 'var(--app-radius-control)',
            backgroundColor: 'var(--app-input-background)',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--app-input-border)',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--app-input-border-hover)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--app-input-border-focus)',
              borderWidth: 1.5,
            },
          },
        },
      },
    },
  })
}
