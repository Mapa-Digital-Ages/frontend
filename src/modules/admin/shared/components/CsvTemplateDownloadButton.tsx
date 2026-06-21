import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded'
import { Button } from '@mui/material'
import { alpha } from '@mui/material/styles'
import {
  downloadCsvTemplate,
  type BatchCsvTemplateName,
} from '@/modules/admin/shared/services/batchImport'

type CsvTemplateDownloadButtonProps = {
  color: string
  template: BatchCsvTemplateName
}

export default function CsvTemplateDownloadButton({
  color,
  template,
}: CsvTemplateDownloadButtonProps) {
  return (
    <Button
      fullWidth
      onClick={() => downloadCsvTemplate(template)}
      startIcon={<DownloadRoundedIcon />}
      variant="outlined"
      sx={{
        mt: 1.5,
        borderColor: alpha(color, 0.4),
        borderRadius: '10px',
        color,
        fontWeight: 700,
        textTransform: 'none',
        '&:hover': {
          borderColor: color,
          backgroundColor: alpha(color, 0.05),
        },
      }}
    >
      Baixar template CSV
    </Button>
  )
}
