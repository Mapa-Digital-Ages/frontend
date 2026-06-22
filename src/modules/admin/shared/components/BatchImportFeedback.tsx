import { Box, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import type { BatchImportResult } from '@/modules/admin/shared/services/batchImport'

type BatchImportFeedbackProps = {
  error: string | null
  result: BatchImportResult | null
}

export default function BatchImportFeedback({
  error,
  result,
}: BatchImportFeedbackProps) {
  if (error) {
    return (
      <Box
        role="alert"
        sx={{
          mt: 2,
          borderRadius: '10px',
          border: '1px solid',
          borderColor: alpha('#EF4444', 0.35),
          backgroundColor: alpha('#EF4444', 0.08),
          color: '#EF4444',
          fontSize: 13,
          fontWeight: 600,
          px: 1.5,
          py: 1,
        }}
      >
        {error}
      </Box>
    )
  }

  if (!result) return null

  const isComplete = result.status === 'completed'
  const color = isComplete ? '#22C55E' : '#F59E0B'
  const errors = result.errors ?? []

  return (
    <Box
      role="status"
      sx={{
        mt: 2,
        borderRadius: '10px',
        border: '1px solid',
        borderColor: alpha(color, 0.35),
        backgroundColor: alpha(color, 0.08),
        color,
        px: 1.5,
        py: 1,
      }}
    >
      <Typography sx={{ color: 'inherit', fontSize: 13, fontWeight: 700 }}>
        {result.created} de {result.total_processed} registro(s) cadastrado(s).
      </Typography>
      {result.failed > 0 && (
        <Typography sx={{ color: 'inherit', fontSize: 12, mt: 0.5 }}>
          {result.failed} registro(s) com erro.
        </Typography>
      )}
      {errors.slice(0, 5).map(item => (
        <Typography
          key={`${item.row}-${item.email}`}
          sx={{ color: 'inherit', fontSize: 12, mt: 0.5 }}
        >
          Linha {item.row} ({item.email || 'sem e-mail'}): {item.reason}
        </Typography>
      ))}
      {errors.length > 5 && (
        <Typography sx={{ color: 'inherit', fontSize: 12, mt: 0.5 }}>
          E mais {errors.length - 5} erro(s).
        </Typography>
      )}
    </Box>
  )
}
