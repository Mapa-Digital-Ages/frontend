import NavigateBeforeRoundedIcon from '@mui/icons-material/NavigateBeforeRounded'
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded'
import { Box, ButtonBase, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { getRoleAccentColor, getSelectedStyle } from '@/app/theme/core/roles'
import type { UserRole } from '@/shared/types/user'

interface PaginationProps {
  currentPage: number
  onPageChange: (page: number) => void
  totalPages: number
  role: UserRole
}

function Pagination({
  currentPage,
  onPageChange,
  totalPages,
  role,
}: PaginationProps) {
  const theme = useTheme()
  const accentColor = getRoleAccentColor(theme, role)
  const pageCount = Math.max(1, totalPages)
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1)

  return (
    <Box
      className="flex flex-wrap items-center justify-center gap-2 p-2"
      sx={{
        borderTop: `1px solid ${theme.palette.divider}`,
        minHeight: 'fit-content',
        paddingBottom: 0,
      }}
    >
      <ButtonBase
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        sx={{
          borderRadius: '999px',
          color: 'text.secondary',
          gap: 0.5,
          minHeight: 40,
          px: { md: 1.5, xs: 1 },
          '&:disabled': {
            color: 'text.disabled',
          },
        }}
      >
        <NavigateBeforeRoundedIcon fontSize="small" />
        <Typography
          sx={{
            display: { sm: 'block', xs: 'none' },
            fontWeight: 600,
          }}
        >
          Anterior
        </Typography>
      </ButtonBase>

      {pages.map(page => {
        const selected = page === currentPage
        const selectedStyle = selected
          ? getSelectedStyle(theme, accentColor)
          : null

        return (
          <ButtonBase
            key={page}
            onClick={() => onPageChange(page)}
            sx={{
              backgroundColor: selectedStyle
                ? selectedStyle.backgroundColor
                : 'transparent',
              border: '1px solid',
              borderColor: selectedStyle
                ? selectedStyle.borderColor
                : 'transparent',
              borderRadius: 'var(--app-radius-control)',
              color: selected ? accentColor : 'text.secondary',
              fontWeight: selected ? 700 : 600,
              minHeight: 32,
              minWidth: 32,
            }}
          >
            {page}
          </ButtonBase>
        )
      })}

      <ButtonBase
        disabled={currentPage === pageCount}
        onClick={() => onPageChange(currentPage + 1)}
        sx={{
          borderRadius: '999px',
          color: 'text.secondary',
          gap: 0.5,
          minHeight: 40,
          px: { md: 1.5, xs: 1 },
          '&:disabled': {
            color: 'text.disabled',
          },
        }}
      >
        <Typography
          sx={{
            display: { sm: 'block', xs: 'none' },
            fontWeight: 600,
          }}
        >
          Próxima
        </Typography>
        <NavigateNextRoundedIcon fontSize="small" />
      </ButtonBase>
    </Box>
  )
}

export default Pagination
