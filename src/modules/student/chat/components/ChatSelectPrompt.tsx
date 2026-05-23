import TouchAppRoundedIcon from '@mui/icons-material/TouchAppRounded'
import { Box, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

function ChatSelectPrompt() {
  const theme = useTheme()

  return (
    <Box
      className="flex flex-col items-center justify-center gap-3 rounded-2xl px-6 py-16 text-center h-full"
      sx={{
        backgroundColor: 'background.paper',
        border: '1px dashed',
        borderColor:
          theme.palette.mode === 'light'
            ? theme.palette.grey[300]
            : theme.palette.grey[700],
        borderRadius: 'var(--app-radius-card)',
        minHeight: 400,
      }}
    >
      <Box className="grid size-14 place-items-center rounded-full bg-black/5 dark:bg-white/10">
        <TouchAppRoundedIcon color="action" />
      </Box>
      <Typography variant="h6">Selecione um chat</Typography>
      <Typography color="text.secondary" className="max-w-sm">
        Escolha uma conversa no menu ao lado para visualizar o histórico de
        mensagens.
      </Typography>
    </Box>
  )
}

export default ChatSelectPrompt
