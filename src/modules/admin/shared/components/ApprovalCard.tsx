import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded'
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { useState, type MouseEvent } from 'react'
import AppCard from '@/shared/ui/AppCard'
import AppTags, { AppTag } from '@/shared/ui/AppTags'
import { getHoverStyle } from '@/app/theme/core/roles'
import type {
  ApprovalCardAction,
  ApprovalCardStatus,
  ApprovalItem,
  ApprovalType,
} from '@/modules/admin/shared/types/types'
import {
  approvalBadgesToTagContexts,
  approvalCardStatusToTagContext,
} from '@/shared/utils/themes'

export interface ApprovalCardProps {
  actions: ApprovalCardAction[]
  item: ApprovalItem
  status: ApprovalCardStatus
  type: ApprovalType
}

function ApprovalCard({ actions, item, status, type }: ApprovalCardProps) {
  const theme = useTheme()
  const statusChip = approvalCardStatusToTagContext(status, theme.palette)
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null)
  const badgeTags =
    type === 'content'
      ? approvalBadgesToTagContexts(item.badges, theme.palette)
      : []
  const subjectTag =
    type === 'content' && item.kind === 'content' ? item.subject : null
  const primaryActions = actions.filter(
    action => action.priority !== 'secondary'
  )
  const secondaryActions = actions.filter(
    action => action.priority === 'secondary'
  )
  const isMenuOpen = Boolean(menuAnchorEl)

  function handleMenuOpen(event: MouseEvent<HTMLElement>) {
    setMenuAnchorEl(event.currentTarget)
  }

  function handleMenuClose() {
    setMenuAnchorEl(null)
  }

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

  const overflowMenu =
    secondaryActions.length > 0 ? (
      <>
        <Tooltip title="Mais ações">
          <span>
            <IconButton
              aria-label={`Mais ações para ${item.title}`}
              onClick={handleMenuOpen}
              size="small"
              sx={{
                border: '1px solid',
                borderColor: 'background.border',
                borderRadius: 'var(--app-radius-control)',
                color: 'text.primary',
                height: 32,
                width: 32,
                '& .MuiSvgIcon-root': {
                  fontSize: 16,
                },
                '&:hover': {
                  backgroundColor: alpha(theme.palette.text.primary, 0.08),
                  borderColor: alpha(theme.palette.text.primary, 0.12),
                },
              }}
            >
              <MoreHorizRoundedIcon />
            </IconButton>
          </span>
        </Tooltip>
        <Menu
          anchorEl={menuAnchorEl}
          onClose={handleMenuClose}
          open={isMenuOpen}
          slotProps={{
            paper: {
              sx: {
                border: '1px solid',
                borderColor: 'background.border',
                borderRadius: '16px',
                minWidth: 220,
                mt: 1,
              },
            },
          }}
        >
          {secondaryActions.map(action => (
            <MenuItem
              disabled={action.disabled}
              key={action.id}
              onClick={() => {
                handleMenuClose()
                action.onClick()
              }}
              sx={{
                color: action.accentColor ?? 'text.primary',
                display: 'flex',
                gap: 1.25,
                py: 1.1,
              }}
            >
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'inline-flex',
                  '& .MuiSvgIcon-root': {
                    fontSize: 18,
                  },
                }}
              >
                {action.icon}
              </Box>
              <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                {action.label}
              </Typography>
            </MenuItem>
          ))}
        </Menu>
      </>
    ) : null

  const statusRow = <AppTags size="sm" tags={[statusChip]} />

  return (
    <AppCard>
      <Box
        sx={{
          alignItems: { sm: 'flex-start', xs: 'center' },
          columnGap: 2,
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) auto',
          gridTemplateRows: { sm: 'auto', xs: 'auto auto' },
          justifyContent: 'space-between',
          rowGap: { sm: 0, xs: 1.5 },
        }}
      >
        <Box
          sx={{
            display: { sm: 'none', xs: 'block' },
            gridColumn: 1,
            gridRow: 1,
            minWidth: 0,
            overflow: 'hidden',
          }}
        >
          {statusRow}
        </Box>

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
          <Box sx={{ display: { sm: 'block', xs: 'none' } }}>{statusRow}</Box>
          {primaryActionButtons}
          {overflowMenu}
        </Box>

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
          {badgeTags.length > 0 ? <AppTags size="sm" tags={badgeTags} /> : null}
        </Box>
      </Box>
    </AppCard>
  )
}

export default ApprovalCard
