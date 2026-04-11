import type { Dayjs } from 'dayjs'
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

interface DayDetailModalProps {
  open: boolean
  date: Dayjs | null
  onClose: () => void
}

export default function DayDetailModal({
  open,
  date,
  onClose,
}: DayDetailModalProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pr: 6 }}>
        {date?.format('DD[/]MM[/]YYYY')}
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ position: 'absolute', right: 12, top: 12 }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent>TODO: Modal de detalhes do dia</DialogContent>
    </Dialog>
  )
}
