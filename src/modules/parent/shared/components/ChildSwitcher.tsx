import { Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import type { ParentDashboardChild } from '@/modules/parent/dashboard/types/types'
import { useTheme } from '@mui/material/styles'
import { getRolePalette, getSelectedStyle } from '@/app/theme/core/roles'
import { useParentRole } from '@/modules/parent/shared/hooks/useParentRole'

interface ChildSwitcherProps {
  children: ParentDashboardChild[]
  selectedChildId: string | null
  onSelect: (id: string) => void
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function ChildSwitcher({
  children,
  selectedChildId,
  onSelect,
}: ChildSwitcherProps) {
  const theme = useTheme()
  const role = useParentRole()
  const rolePalette = getRolePalette(theme, role)
  const selectColor = getSelectedStyle(theme, rolePalette.contrast)
  if (children.length === 0) return null

  return (
    <ToggleButtonGroup
      exclusive
      onChange={(_, nextChildId: string | null) => {
        if (nextChildId) {
          onSelect(nextChildId)
        }
      }}
      value={selectedChildId}
      aria-label="Selecionar filho"
      sx={{
        alignItems: 'center',
        border: '1px solid',
        borderColor: rolePalette.contrast,
        borderRadius: 'var(--app-radius-pill)',
        display: 'flex',
        gap: 1,
        height: 32,
        p: 0,
        '& .MuiToggleButtonGroup-grouped': {
          border: 0,
          margin: 0,
        },
      }}
    >
      {children.map(child => {
        const isSelected = child.id === selectedChildId
        const initials = getInitials(child.name)
        const firstName = child.name.split(' ')[0]

        return (
          <ToggleButton
            key={child.id}
            aria-label={`${child.name} — ${child.grade}`}
            value={child.id}
            sx={{
              alignItems: 'center',
              backgroundColor: isSelected ? selectColor : 'transparent',
              borderRadius: 'var(--app-radius-pill) !important',
              cursor: 'pointer',
              display: 'flex',
              gap: 0.75,
              minHeight: 30,
              minWidth: 30,
              px: isSelected ? 1 : 0.5,
              py: 0.5,
              textTransform: 'none',
              transition:
                'background-color 0.15s ease, border-color 0.15s ease',
              '&:hover': {
                backgroundColor: isSelected ? selectColor : selectColor,
              },
              '&.Mui-selected': {
                backgroundColor: selectColor,
              },
              '&.Mui-selected:hover': {
                backgroundColor: selectColor,
              },
            }}
          >
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                border: '1px solid',
                backgroundColor: rolePalette.secondary,
                color: rolePalette.contrast,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '9px',
                fontWeight: 700,
                flexShrink: 0,
                letterSpacing: '0.02em',
              }}
            >
              {initials}
            </Box>
            {isSelected ? (
              <Typography
                sx={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: rolePalette.contrast,
                  lineHeight: 1,
                  whiteSpace: 'nowrap',
                  pr: 0.25,
                }}
              >
                {firstName}
              </Typography>
            ) : null}
          </ToggleButton>
        )
      })}
    </ToggleButtonGroup>
  )
}

export default ChildSwitcher
