import { Box, IconButton, Tooltip, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import type { Palette } from '@mui/material/styles'
import AppCard from '@/components/ui/AppCard'
import AppTags, { AppTag } from '@/components/ui/AppTags'
import type {
  ApprovalCardAction,
  ApprovalCardStatus,
  ApprovalItem,
  ApprovalType,
} from '@/types/admin'
import {
  approvalBadgesToTagContexts,
  approvalCardStatusToTagContext,
} from '@/utils/themes'

function colorForAlpha(
  accentColor: string | undefined,
  palette: Palette
): string {
  if (!accentColor) {
    return palette.primary.main
  }
  if (accentColor.startsWith('var(')) {
    if (accentColor.includes('success')) {
      return palette.success.main
    }
    if (accentColor.includes('error')) {
      return palette.error.main
    }

    if (accentColor.includes('warning')) {
      return palette.warning.main
    }

    return palette.primary.main
  }

  return accentColor
}

export interface ApprovalCardProps {
  actions: ApprovalCardAction[]
  item: ApprovalItem
  status: ApprovalCardStatus
  type: ApprovalType
}

function ApprovalCard({ actions, item, status, type }: ApprovalCardProps) {
  const theme = useTheme()
  const statusChip = approvalCardStatusToTagContext(status, theme.palette)
  const badgeTags =
    type === 'content' ? approvalBadgesToTagContexts(item.badges, theme.palette) : []
  const requestDateTag =
    type === 'guardian' && item.requestedAt
      ? {
          color: theme.palette.text.secondary,
          id: `${item.id}-requested-at`,
          label: `Solicitação em ${item.requestedAt}`,
        }
      : null
  const subjectTag =
    type === 'content' && item.kind === 'content' ? item.subject : null

  return (
    <AppCard>
      <Box
        sx={{
          alignItems: { sm: 'flex-start', xs: 'stretch' },
          display: 'flex',
          flexDirection: { sm: 'row', xs: 'column' },
          gap: 2,
          justifyContent: 'space-between',
        }}
      >
        <Box className="min-w-0 space-y-2">
          <Box
            sx={{
              alignItems: { sm: 'center', xs: 'flex-start' },
              display: 'flex',
              flexDirection: { sm: 'row', xs: 'column' },
              gap: 1.5,
            }}
          >
            <Typography
              sx={{
                color: 'text.primary',
                fontSize: { md: 18, xs: 16 },
                fontWeight: 700,
              }}
            >
              {item.title}
            </Typography>
            <AppTags size="sm" tags={[statusChip]} />
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexShrink: 0,
            flexWrap: 'wrap',
            gap: 1,
            justifyContent: { sm: 'flex-end', xs: 'flex-start' },
            width: { sm: 'auto', xs: '100%' },
          }}
        >
          {actions.map(action => (
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
                      backgroundColor: alpha(
                        colorForAlpha(action.accentColor, theme.palette),
                        0.1
                      ),
                      borderColor: alpha(
                        colorForAlpha(action.accentColor, theme.palette),
                        0.2
                      ),
                    },
                  }}
                >
                  {action.icon}
                </IconButton>
              </span>
            </Tooltip>
          ))}
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
          {requestDateTag ? <AppTag size="sm" tag={requestDateTag} /> : null}
          {badgeTags.length > 0 ? <AppTags size="sm" tags={badgeTags} /> : null}
        </Box>
      </Box>
    </AppCard>
  )
}

export default ApprovalCard
