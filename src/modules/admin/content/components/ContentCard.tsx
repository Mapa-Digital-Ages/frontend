import { Box, IconButton, Tooltip, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import AppCard from '@/shared/ui/AppCard'
import AppTags, { AppTag } from '@/shared/ui/AppTags'
import { getHoverStyle } from '@/app/theme/core/roles'
import type {
  ApprovalCardAction,
  ApprovalCardStatus,
  ApprovalItem,
  ApprovalType,
} from '@/modules/admin/shared/types/types'

export interface ApprovalCardProps {
  actions: ApprovalCardAction[]
  item: ApprovalItem
  type: ApprovalType
}

function ContentCard({ actions, item, type }: ApprovalCardProps) {
  const theme = useTheme()
  const subjectTag =
    type === 'content' && item.kind === 'content' ? item.subject : null
  const primaryActions = actions.filter(
    action => action.priority !== 'secondary'
  )

  const primaryActionButtons = primaryActions.map(action => {
    const actionColor = action.accentColor ?? theme.palette.primary.main
    const hover = getHoverStyle(theme, actionColor)

    return (
      <Tooltip key={action.id} title={action.tooltip ?? action.label}>
        <span>
          <IconButton
            aria-label={action.label}
            disabled={action.disabled}
            onClick={action.onClick}
            size="small"
            sx={{
              border: '1px solid',
              borderColor: 'background.border',
              borderRadius: 'var(--app-radius-control)',
              color: action.accentColor ?? 'text.primary',
              height: 32,
              width: 32,
              '& .MuiSvgIcon-root': {
                fontSize: 16,
              },
              '&:hover': {
                backgroundColor: hover.backgroundColor,
                borderColor: hover.borderColor,
              },
            }}
          >
            {action.icon}
          </IconButton>
        </span>
      </Tooltip>
    )
  })

  return (
    <AppCard>
      <Box
        sx={{
          alignItems: { sm: 'flex-start', xs: 'center' },
          display: 'flex',
          gridTemplateRows: { sm: 'auto', xs: 'auto auto' },
          justifyContent: 'space-between',
          rowGap: { sm: 0, xs: 1.5 },
        }}
      >
        <Typography
          sx={{
            color: 'text.primary',
            fontSize: { md: 20, xs: 16 },
            fontWeight: 700,
            gridColumn: { sm: 1, xs: '1 / -1' },
            gridRow: { sm: 1, xs: 2 },
            minWidth: 0,
            overflow: { sm: 'visible', xs: 'hidden' },
            textOverflow: { sm: 'clip', xs: 'ellipsis' },
            whiteSpace: { sm: 'normal', xs: 'nowrap' },
          }}
          title={item.title}
        >
          {item.title}
        </Typography>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexShrink: 0,
            flexWrap: 'wrap',
            gap: 1,
            gridColumn: 2,
            gridRow: 1,
            justifyContent: 'flex-end',
          }}
        >
          {primaryActionButtons}
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          paddingTop: 0,
        }}
      >
        <Typography
          sx={{
            color: 'text.secondary',
            fontSize: { md: 14, xs: 13 },
          }}
        >
          {item.subtitle}
        </Typography>

        <Box className="flex flex-wrap gap-2">
          {subjectTag ? <AppTag size="sm" tag={subjectTag} /> : null}
        </Box>
      </Box>
    </AppCard>
  )
}

export default ContentCard
