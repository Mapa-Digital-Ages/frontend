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
import type { Breakpoint } from '@mui/material/styles'
import { useId, type ReactNode } from 'react'
import AppButton from '@/components/ui/AppButton'

export type AppActionModalVariant = 'form' | 'confirm'

interface AppActionModalProps {
  cancelLabel?: string
  children?: ReactNode
  confirmLabel?: string
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
  onClose: () => void
  onConfirm?: () => void
  open: boolean
  title: string
  variant?: 'form' | 'confirm'
}

function AppActionModal({
  cancelLabel = 'Cancelar',
  children,
  confirmLabel = 'Confirmar',
  confirmTone = 'primary.main',
  description,
  disableConfirm = false,
  fullWidth = true,
  loading = false,
  maxWidth = 'sm',
  onClose,
  onConfirm,
  open,
  title,
  variant = 'form',
}: AppActionModalProps) {
  const titleId = useId()
  const descriptionId = useId()
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
    >
      <DialogTitle sx={{ pb: 1.5}}>
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
        dividers={variant === 'confirm'}
        sx={{ py: variant === 'confirm' ? 3 : 2 }}
      >
        {children}
      </DialogContent>

      <DialogActions sx={{ gap: 1.5, px: 3, pb: 3, pt: 0 }}>
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
            backgroundColor={confirmTone}
            disabled={disableConfirm || loading}
            onClick={onConfirm}
          >
            {confirmContent}
          </AppButton>
        ) : null}
      </DialogActions>
    </Dialog>
  )
}

export default AppActionModal
