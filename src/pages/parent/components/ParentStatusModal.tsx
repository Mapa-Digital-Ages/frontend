import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import HourglassTopIcon from '@mui/icons-material/HourglassTop'
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
  const isAguardando = status === 'AGUARDANDO'
  const copy = getParentStatusModalCopy(status)

  if (!copy) {
    return null
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{
          textAlign: 'center',
          fontWeight: 'bold',
        }}
      >
        {copy.title}
      </DialogTitle>
      <DialogContent>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          textAlign="center"
          gap={2}
          p={2}
        >
          {isAguardando ? (
            <HourglassTopIcon
              sx={{
                fontSize: 60,
                color: 'primary.main',
              }}
            />
          ) : (
            <CloseIcon
              sx={{
                fontSize: 60,
                color: '#D32248',
              }}
            />
          )}

          <Typography variant="body2">{copy.description}</Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
        <Button variant="outlined" onClick={onClose}>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  )
}
