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
import { alpha, useTheme, type Breakpoint } from '@mui/material/styles'
import { useId, type ReactNode } from 'react'
import AppButton from '@/components/ui/AppButton'
import { AppColors } from '@/styles/AppColors'
import type { UserRole } from '@/types/user'

export type AppActionModalVariant = 'form' | 'confirm'
export type AppActionModalMode = 'confirm' | 'form' | 'review'

interface AppActionModalProps {
  accentSoftColor?: string
  cancelLabel?: string
  children?: ReactNode
  confirmLabel?: string
  confirmColor?: string
  confirmTextColor?: string
  confirmTone?:
    | 'primary.main'
    | 'secondary.main'
    | 'error.main'
    | 'warning.main'
    | 'info.main'
    | 'success.main'
  description?: ReactNode
  disableConfirm?: boolean
  fullWidth?: boolean
  loading?: boolean
  maxWidth?: Breakpoint
  mode?: AppActionModalMode
  onClose: () => void
  onConfirm?: () => void
  open: boolean
  role: UserRole
  title: string
  variant?: 'form' | 'confirm'
}

function AppActionModal({
  cancelLabel = 'Cancelar',
  children,
  confirmLabel = 'Confirmar',
  confirmColor,
  confirmTextColor = 'primary.contrastText',
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
  role,
  title,
  variant = 'form',
}: AppActionModalProps) {
  const theme = useTheme()
  const titleId = useId()
  const descriptionId = useId()
  const resolvedMode = mode ?? variant
  const roleAccent = AppColors.role[role]
  const accentColor =
    confirmColor ??
    (confirmTone === 'error.main' ? theme.palette.error.main : roleAccent.primary)
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
          backgroundColor:
          alpha(
            theme.palette.primary.main,
            theme.palette.mode === 'dark' ? 0.12 : 0.06
          ),
          borderBottom: '1px solid',
          borderColor: 'background.border',
          pb: 1.5,
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
                  mt: 0.75,
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
            }}
          >
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent
        dividers={resolvedMode === 'confirm'}
        sx={{
          px: { md: 3, xs: 2 },
          py:
            resolvedMode === 'confirm'
              ? 3
              : resolvedMode === 'review'
                ? { md: 3, xs: 2.25 }
                : { md: 2.5, xs: 2 },
        }}
      >
        {children}
      </DialogContent>

      <DialogActions
        sx={{
          backgroundColor:
          alpha(
            theme.palette.primary.main,
            theme.palette.mode === 'dark' ? 0.12 : 0.06
          ),
          borderTop: '1px solid',
          borderColor: 'background.border',
          gap: 1.5,
          px: { md: 3, xs: 2 },
          pb: { md: 3, xs: 2 },
          pt: { md: 2, xs: 1.5 },
        }}
      >
        <AppButton
          backgroundColor="background.paper"
          hasBorder
          label={cancelLabel}
          onClick={onClose}
          textColor="text.primary"
          variant="outlined"
        />
        {onConfirm ? (
          <AppButton
            backgroundColor={accentColor}
            disabled={disableConfirm || loading}
            hoverBackgroundColor={accentColor}
            onClick={onConfirm}
            textColor={confirmTextColor}
          >
            {confirmContent}
          </AppButton>
        ) : null}
      </DialogActions>
    </Dialog>
  )
}

export default AppActionModal
