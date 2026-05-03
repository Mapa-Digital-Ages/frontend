import NavigateBeforeRoundedIcon from '@mui/icons-material/NavigateBeforeRounded'
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded'
import {
  Box,
  Pagination as MuiPagination,
  PaginationItem,
  Typography,
} from '@mui/material'
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
  const selectedStyle = getSelectedStyle(theme, accentColor)

  function PreviousLabel() {
    return (
      <>
        <NavigateBeforeRoundedIcon fontSize="small" />
        <Typography
          component="span"
          sx={{
            display: { sm: 'block', xs: 'none' },
            fontWeight: 600,
          }}
        >
          Anterior
        </Typography>
      </>
    )
  }

  function NextLabel() {
    return (
      <>
        <Typography
          component="span"
          sx={{
            display: { sm: 'block', xs: 'none' },
            fontWeight: 600,
          }}
        >
          Próxima
        </Typography>
        <NavigateNextRoundedIcon fontSize="small" />
      </>
    )
  }

  return (
    <Box
      className="flex flex-wrap items-center justify-center gap-2 p-2"
      sx={{
        borderTop: `1px solid ${theme.palette.divider}`,
        minHeight: 'fit-content',
        paddingBottom: 0,
      }}
    >
      <MuiPagination
        count={pageCount}
        onChange={(_, page) => onPageChange(page)}
        page={Math.min(Math.max(currentPage, 1), pageCount)}
        renderItem={item => (
          <PaginationItem
            {...item}
            slots={{
              next: NextLabel,
              previous: PreviousLabel,
            }}
            sx={{
              border: '1px solid',
              borderColor: 'transparent',
              borderRadius:
                item.type === 'page' ? 'var(--app-radius-control)' : '999px',
              color: 'text.secondary',
              fontWeight: 600,
              gap: 0.5,
              margin: 0,
              minHeight: item.type === 'page' ? 32 : 40,
              minWidth: item.type === 'page' ? 32 : undefined,
              px: item.type === 'page' ? 0 : { md: 1.5, xs: 1 },
              '&.Mui-selected': {
                backgroundColor: selectedStyle.backgroundColor,
                borderColor: selectedStyle.borderColor,
                color: accentColor,
                fontWeight: 700,
              },
              '&.Mui-selected:hover': {
                backgroundColor: selectedStyle.backgroundColor,
              },
              '&.Mui-disabled': {
                color: 'text.disabled',
                opacity: 1,
              },
            }}
          />
        )}
        shape="rounded"
        showFirstButton={false}
        showLastButton={false}
        siblingCount={pageCount > 7 ? 1 : pageCount}
        sx={{
          '& .MuiPagination-ul': {
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1,
            justifyContent: 'center',
          },
        }}
      />
    </Box>
  )
}

export default Pagination
