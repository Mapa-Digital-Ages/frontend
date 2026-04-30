import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import {
  Avatar,
  Box,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { useState, type MouseEvent } from 'react'
import {
  getHoverStyle,
  getRolePalette,
  getRoleSelectedStyle,
} from '@/app/theme/core/roles'
import { useParentRole } from '@/modules/parent/shared/hooks/useParentRole'
import type { ParentDashboardChild } from '@/modules/parent/settings/types/types'

interface ListChildrenCardProps {
  child: ParentDashboardChild
  selected: boolean
  onDelete?: (child: ParentDashboardChild) => void | Promise<void>
  onEdit?: (child: ParentDashboardChild) => void | Promise<void>
  onSelect: (id: string) => void
}

function getInitials(name: string): string {
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return initials || '?'
}

function ListChildrenCard({
  child,
  selected,
  onDelete,
  onEdit,
  onSelect,
}: ListChildrenCardProps) {
  const theme = useTheme()
  const role = useParentRole()
  const rolePalette = getRolePalette(theme, role)
  const selectedStyle = getRoleSelectedStyle(theme, role)
  const hoverStyle = getHoverStyle(theme, rolePalette.primary)
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null)
  const initials = getInitials(child.name)
  const selectedLabel = selected ? 'Selecionado' : 'Selecionar'
  const isMenuOpen = Boolean(menuAnchorEl)

  function handleMenuOpen(event: MouseEvent<HTMLElement>) {
    event.stopPropagation()
    setMenuAnchorEl(event.currentTarget)
  }

  function handleMenuClose() {
    setMenuAnchorEl(null)
  }

  function handleAction(
    action: ((child: ParentDashboardChild) => void | Promise<void>) | undefined
  ) {
    handleMenuClose()
    void action?.(child)
  }

  return (
    <Box sx={{ minWidth: 0 }}>
      <ListItem
        disablePadding
        role="listitem"
        secondaryAction={
          <Tooltip title="Mais ações">
            <IconButton
              aria-label={`Mais ações para ${child.name}`}
              onClick={handleMenuOpen}
              size="small"
              sx={{
                backgroundColor: selected
                  ? selectedStyle.backgroundColor
                  : 'background.paper',
                border: '1px solid',
                borderColor: selected
                  ? selectedStyle.borderColor
                  : 'background.border',
                borderRadius: 'var(--app-radius-control)',
                color: 'text.primary',
                flexShrink: 0,
                height: 32,
                width: 32,
                '&:hover': {
                  backgroundColor: selected
                    ? selectedStyle.backgroundColor
                    : hoverStyle.backgroundColor,
                  borderColor: selected
                    ? selectedStyle.borderColor
                    : hoverStyle.borderColor,
                },
              }}
            >
              <MoreHorizRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        }
        sx={{
          backgroundColor: selected
            ? selectedStyle.backgroundColor
            : 'background.paper',
          border: '1px solid',
          borderColor: selected
            ? selectedStyle.borderColor
            : 'background.border',
          borderRadius: '12px',
          color: 'text.primary',
          minWidth: 0,
          overflow: 'hidden',
          p: 1.5,
          pr: 6,
          transition:
            'background-color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease',
          width: '100%',
          '&:hover': {
            backgroundColor: selected
              ? selectedStyle.backgroundColor
              : hoverStyle.backgroundColor,
            borderColor: selected
              ? selectedStyle.borderColor
              : hoverStyle.borderColor,
          },
          '&:focus-within': {
            boxShadow: `${alpha(rolePalette.primary, 0.18)}`,
          },
          '& .MuiListItemSecondaryAction-root': {
            right: 12,
          },
        }}
      >
        <ListItemButton
          aria-label={`${selectedLabel} ${child.name}, ${child.grade}`}
          aria-pressed={selected}
          onClick={() => onSelect(child.id)}
          selected={selected}
          sx={{
            borderRadius: '10px',
            gap: 1.5,
            minWidth: 0,
            p: 0,
            textAlign: 'left',
            '&.Mui-selected': {
              backgroundColor: 'transparent',
            },
            '&.Mui-selected:hover': {
              backgroundColor: 'transparent',
            },
            '&:hover': {
              backgroundColor: 'transparent',
            },
          }}
        >
          <ListItemAvatar sx={{ minWidth: 0, mr: 1.5 }}>
            <Avatar
              aria-hidden="true"
              variant="circular"
              sx={{
                backgroundColor: selected
                  ? rolePalette.primary
                  : alpha(rolePalette.primary, 0.14),
                color: selected ? rolePalette.contrast : rolePalette.primary,
                fontSize: 14,
                fontWeight: 800,
                height: 40,
                letterSpacing: '0.02em',
                width: 40,
              }}
            >
              {initials}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={child.name}
            secondary={child.grade}
            slotProps={{
              primary: {
                title: child.name,
              },
            }}
            sx={{
              minWidth: 0,
              '& .MuiListItemText-primary': {
                color: 'text.primary',
                fontSize: '1rem',
                fontWeight: 700,
                minWidth: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              },
              '& .MuiListItemText-secondary': {
                color: 'text.secondary',
                fontSize: 14,
                minWidth: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              },
            }}
          />
        </ListItemButton>
      </ListItem>

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
              minWidth: 180,
              mt: 1,
            },
          },
        }}
      >
        <MenuItem onClick={() => handleAction(onEdit)} sx={{ gap: 1.25 }}>
          <EditOutlinedIcon fontSize="small" />
          <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Editar</Typography>
        </MenuItem>
        <MenuItem onClick={() => handleAction(onEdit)} sx={{ gap: 1.25 }}>
          <LockOutlinedIcon fontSize="small" />
          <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
            Alterar senha
          </Typography>
        </MenuItem>
        <MenuItem
          onClick={() => handleAction(onDelete)}
          sx={{ color: 'error.main', gap: 1.25 }}
        >
          <DeleteOutlineRoundedIcon fontSize="small" />
          <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
            Excluir
          </Typography>
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default ListChildrenCard
