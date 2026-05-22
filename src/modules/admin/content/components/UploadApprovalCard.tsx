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
import AppTags from '@/shared/ui/AppTags'
import { getHoverStyle } from '@/app/theme/core/roles'
import {
  approvalCardStatusToTagContext,
  approvalBadgesToTagContexts,
} from '@/shared/utils/themes'
import type {
  ApprovalCardAction,
  ApprovalCardStatus,
} from '@/modules/admin/shared/types/types'
import type { UploadApprovalItem } from '../types/upload'

export interface UploadApprovalCardProps {
  actions: ApprovalCardAction[]
  item: UploadApprovalItem
  status: ApprovalCardStatus
}

function UploadApprovalCard({
  actions,
  item,
  status,
}: UploadApprovalCardProps) {
  const theme = useTheme()
  const statusChip = approvalCardStatusToTagContext(status, theme.palette)
  const badgeTags = approvalBadgesToTagContexts(item.badges, theme.palette)
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null)

  const primaryActions = actions.filter(a => a.priority !== 'secondary')
  const secondaryActions = actions.filter(a => a.priority === 'secondary')
  const isMenuOpen = Boolean(menuAnchorEl)

  function handleMenuOpen(event: MouseEvent<HTMLElement>) {
    setMenuAnchorEl(event.currentTarget)
  }

  function handleMenuClose() {
    setMenuAnchorEl(null)
  }

  const primaryActionButtons = primaryActions.map(action => {
    const color = action.accentColor ?? theme.palette.primary.main
    const hover = getHoverStyle(theme, color)
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
              '& .MuiSvgIcon-root': { fontSize: 16 },
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
              aria-label={`Mais ações para ${item.fileName}`}
              onClick={handleMenuOpen}
              size="small"
              sx={{
                border: '1px solid',
                borderColor: 'background.border',
                borderRadius: 'var(--app-radius-control)',
                color: 'text.primary',
                height: 32,
                width: 32,
                '& .MuiSvgIcon-root': { fontSize: 16 },
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
                  '& .MuiSvgIcon-root': { fontSize: 18 },
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
          display: 'flex',
          flexDirection: { sm: 'row' },
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexShrink: 0,
            flexWrap: 'wrap',
            gap: 1,
            justifyContent: 'flex-start',
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
            justifyContent: 'flex-end',
          }}
        >
          {primaryActionButtons}
          {overflowMenu}
        </Box>
      </Box>
      <Box
        sx={{ display: 'flex', flexDirection: 'column', gap: 1, paddingTop: 0 }}
      >
        <Typography
          sx={{
            color: 'text.primary',
            fontSize: { md: 16, xs: 14 },
            fontWeight: 700,
            gridColumn: { sm: 1, xs: '1 / -1' },
            gridRow: { sm: 1, xs: 2 },
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
          title={item.fileName}
        >
          {item.fileName}
        </Typography>
        {badgeTags.length > 0 ? <AppTags size="sm" tags={badgeTags} /> : null}
      </Box>
    </AppCard>
  )
}

export default UploadApprovalCard
