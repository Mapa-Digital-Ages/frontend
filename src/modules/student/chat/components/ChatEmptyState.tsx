import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded'
import { Box, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'

function ChatEmptyState() {
  const theme = useTheme()

  return (
    <Box
      className="flex flex-col items-center justify-center gap-3 rounded-2xl px-6 py-16 text-center col-span-full"
      sx={{
        backgroundColor: 'background.paper',
        border: '1px dashed',
        borderColor:
          theme.palette.mode === 'light'
            ? theme.palette.grey[300]
            : theme.palette.grey[700],
        borderRadius: 'var(--app-radius-card)',
      }}
    >
      <Box className="grid size-14 place-items-center rounded-full bg-black/5 dark:bg-white/10">
        <ChatBubbleOutlineRoundedIcon color="action" />
      </Box>
      <Typography variant="h6">Nenhum chat criado</Typography>
      <Typography color="text.secondary" className="max-w-sm">
        Você ainda não iniciou nenhuma conversa com o assistente. Os chats
        criados durante as atividades aparecerão aqui.
      </Typography>
    </Box>
  )
}

export default ChatEmptyState
