import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import {
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material'
import {
  alpha,
  useTheme,
  type Breakpoint,
  type Theme,
} from '@mui/material/styles'
import { useId, type ReactNode } from 'react'
import AppButton from '@/shared/ui/AppButton'

export type AppActionModalVariant = 'form' | 'confirm'
export type AppActionModalMode = 'confirm' | 'form' | 'review'
type AppActionModalTone =
  | 'primary.main'
  | 'secondary.main'
  | 'error.main'
  | 'warning.main'
  | 'info.main'
  | 'success.main'

interface AppActionModalProps {
  accentSoftColor?: string
  cancelLabel?: string
  children?: ReactNode
  confirmLabel?: string
  confirmColor?: string
  confirmHoverColor?: string
  confirmTextColor?: string
  confirmTone?: AppActionModalTone
  description?: ReactNode
  disableConfirm?: boolean
  fullWidth?: boolean
  loading?: boolean
  maxWidth?: Breakpoint
  mode?: AppActionModalMode
  onClose: () => void
  onConfirm?: () => void
  open: boolean
  title: string
  variant?: 'form' | 'confirm'
}

function resolveToneColor(theme: Theme, tone: AppActionModalTone) {
  switch (tone) {
    case 'secondary.main':
      return theme.palette.secondary.main
    case 'error.main':
      return theme.palette.error.main
    case 'warning.main':
      return theme.palette.warning.main
    case 'info.main':
      return theme.palette.info.main
    case 'success.main':
      return theme.palette.success.main
    case 'primary.main':
    default:
      return theme.palette.primary.main
  }
}

function resolveToneHoverColor(theme: Theme, tone: AppActionModalTone) {
  switch (tone) {
    case 'secondary.main':
      return theme.palette.secondary.dark ?? theme.palette.secondary.main
    case 'error.main':
      return theme.palette.error.dark ?? theme.palette.error.main
    case 'warning.main':
      return theme.palette.warning.dark ?? theme.palette.warning.main
    case 'info.main':
      return theme.palette.info.dark ?? theme.palette.info.main
    case 'success.main':
      return theme.palette.success.dark ?? theme.palette.success.main
    case 'primary.main':
    default:
      return theme.palette.primary.dark ?? theme.palette.primary.main
  }
}

function getSoftHover(theme: Theme, color: string, opacity = 0.1) {
  return alpha(color, theme.palette.mode === 'dark' ? opacity + 0.04 : opacity)
}

function AppActionModal({
  cancelLabel = 'Cancelar',
  children,
  confirmHoverColor,
  confirmLabel = 'Confirmar',
  confirmColor,
  confirmTextColor = '#ffffff',
  confirmTone = 'primary.main',
  description,
  disableConfirm = false,
  fullWidth = true,
  loading = false,
  maxWidth = 'sm',
  mode,
  onClose,
  onConfirm,
  open,
  title,
  variant = 'form',
}: AppActionModalProps) {
  const theme = useTheme()
  const titleId = useId()
  const descriptionId = useId()
  const resolvedMode = mode ?? variant
  const resolvedAccentColor =
    confirmColor ??
    (confirmTone === 'primary.main'
      ? 'var(--app-role-current-primary, var(--app-primary))'
      : resolveToneColor(theme, confirmTone))
  const resolvedConfirmHoverColor =
    confirmHoverColor ??
    (confirmColor
      ? confirmColor
      : confirmTone === 'primary.main'
        ? 'var(--app-role-current-primary, var(--app-primary))'
        : resolveToneHoverColor(theme, confirmTone))
  const neutralHoverBackground =
    theme.palette.mode === 'dark'
      ? alpha(theme.palette.common.white, 0.07)
      : alpha(theme.palette.text.primary, 0.05)
  const neutralHoverBorder =
    theme.palette.mode === 'dark'
      ? alpha(theme.palette.common.white, 0.16)
      : alpha(theme.palette.text.primary, 0.12)
  const closeHoverBackground = getSoftHover(
    theme,
    theme.palette.text.primary,
    0.08
  )
  const confirmContent = loading ? (
    <Box className="flex items-center justify-center">
      <CircularProgress color="inherit" size={18} />
    </Box>
  ) : (
    confirmLabel
  )

  return (
    <Dialog
      aria-describedby={description ? descriptionId : undefined}
      aria-labelledby={titleId}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          gap: 2,
          backgroundColor: 'background.paper',
          backgroundImage: 'none',
          border: '1px solid',
          borderColor: 'background.border',
          borderRadius: '24px',
          boxShadow:
            theme.palette.mode === 'dark'
              ? '0px 28px 80px rgba(0, 0, 0, 0.45)'
              : '0px 28px 80px rgba(16, 42, 67, 0.16)',
          overflow: 'hidden',
        },
      }}
    >
      <DialogTitle
        sx={{
          borderColor: 'background.border',
          pt: 2,
        }}
      >
        <Box className="flex justify-between gap-3">
          <Box className="min-w-0 space-y-0">
            <Typography
              id={titleId}
              sx={{
                color: 'text.primary',
                fontSize: { md: 22, xs: 20 },
                fontWeight: 700,
              }}
            >
              {title}
            </Typography>
            {description ? (
              <Typography
                id={descriptionId}
                sx={{
                  color: 'text.secondary',
                  fontSize: { md: 15, xs: 14 },
                }}
              >
                {description}
              </Typography>
            ) : null}
          </Box>
          <IconButton
            aria-label="Fechar modal"
            onClick={onClose}
            sx={{
              border: '1px solid',
              borderColor: 'transparent',
              borderRadius: 'var(--app-radius-control)',
              color: 'text.secondary',
              height: 32,
              width: 32,
              transition:
                'background-color 160ms ease, border-color 160ms ease, color 160ms ease, transform 160ms ease',
              '&:hover': {
                backgroundColor: closeHoverBackground,
                borderColor: neutralHoverBorder,
                color: 'text.primary',
              },
              '&:active': {
                transform: 'scale(0.96)',
              },
            }}
          >
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent
        sx={{
          px: { md: 3, xs: 2 },
          py:
            resolvedMode === 'confirm'
              ? 1
              : resolvedMode === 'review'
                ? { md: 3, xs: 2.25 }
                : { md: 2.5, xs: 2 },
        }}
      >
        {children}
      </DialogContent>

      <DialogActions
        sx={{
          borderColor: 'background.border',
          gap: 1.5,
          px: { md: 3, xs: 2 },
          pb: { md: 3, xs: 2 },
        }}
      >
        <AppButton
          backgroundColor="background.paper"
          hasBorder
          hoverBackgroundColor={neutralHoverBackground}
          label={cancelLabel}
          onClick={onClose}
          textColor="text.primary"
          variant="outlined"
          sx={{
            borderColor: 'background.border',
            transition:
              'background-color 160ms ease, border-color 160ms ease, color 160ms ease, transform 160ms ease',
            '&:hover': {
              backgroundColor: neutralHoverBackground,
              borderColor: neutralHoverBorder,
            },
            '&:active': {
              transform: 'translateY(1px)',
            },
          }}
        />

        {onConfirm ? (
          <AppButton
            backgroundColor={resolvedAccentColor}
            disabled={disableConfirm || loading}
            hoverBackgroundColor={resolvedConfirmHoverColor}
            onClick={onConfirm}
            textColor={confirmTextColor}
            sx={{
              borderColor: resolvedAccentColor,
              transition:
                'background-color 160ms ease, border-color 160ms ease, color 160ms ease, box-shadow 160ms ease, transform 160ms ease',
              '&:hover': {
                backgroundColor: resolvedConfirmHoverColor,
                borderColor: resolvedConfirmHoverColor,
              },
              '&:active': {
                transform: 'translateY(1px)',
              },
              '&:disabled': {
                backgroundColor: alpha(
                  confirmColor && confirmColor.startsWith('rgb')
                    ? confirmColor
                    : resolveToneColor(theme, confirmTone),
                  0.42
                ),
                color: alpha(theme.palette.common.white, 0.72),
                boxShadow: 'none',
              },
            }}
          >
            {confirmContent}
          </AppButton>
        ) : null}
      </DialogActions>
    </Dialog>
  )
}

export default AppActionModal
