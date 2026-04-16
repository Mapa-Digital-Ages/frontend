import CloseIcon from '@mui/icons-material/Close'
import HourglassTopIcon from '@mui/icons-material/HourglassTop'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'
import { getParentStatusModalCopy } from './parentStatusModal.utils'

interface ParentStatusModalProps {
  open: boolean
  status: string
  onClose: () => void
}

export default function ParentStatusModal({
  open,
  status,
  onClose,
}: ParentStatusModalProps) {
  const isPending = status === 'AGUARDANDO'
  const copy = getParentStatusModalCopy(status)

  if (!copy) {
    return null
  }

  return (
    <Dialog fullWidth maxWidth="xs" onClose={onClose} open={open}>
      <DialogTitle sx={{ fontWeight: 700, textAlign: 'center' }}>
        {copy.title}
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            p: 2,
            textAlign: 'center',
          }}
        >
          {isPending ? (
            <HourglassTopIcon sx={{ color: 'primary.main', fontSize: 60 }} />
          ) : (
            <CloseIcon sx={{ color: 'error.main', fontSize: 60 }} />
          )}

          <Typography sx={{ color: 'text.secondary' }} variant="body2">
            {copy.description}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  )
}
