import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined'
import InputAdornment from '@mui/material/InputAdornment'
import Typography from '@mui/material/Typography'
import { Box } from '@mui/material'
import type { SxProps, Theme } from '@mui/material/styles'
import type { DropdownOption } from '@/components/ui/AppDropdown'
import type { ApprovalResultsSummary } from '@/types/admin'
import AppDropdown from '../ui/AppDropdown'
import AppInput from '../ui/AppInput'

const outlineFieldBorderSx: SxProps<Theme> = {
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'background.border',
    borderStyle: 'solid',
    borderWidth: 1,
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'background.border',
  },
  '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'background.border',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: 'background.border',
  },
  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: 'background.border',
  },
}

function getResultsLabel(resultsSummary: ApprovalResultsSummary) {
  if (resultsSummary.customLabel) {
    return resultsSummary.customLabel
  }

  return `${resultsSummary.count} ${
    resultsSummary.count === 1
      ? resultsSummary.singularLabel
      : resultsSummary.pluralLabel
  }`
}

interface SearchBarAndFilterProps {
  filterOptions: DropdownOption[]
  onQueryChange: (query: string) => void
  onStatusChange: (status: string) => void
  query: string
  resultsSummary: ApprovalResultsSummary
  searchPlaceholder: string
  selectedStatus: string
}

export function SearchBarAndFilter({
  filterOptions,
  onQueryChange,
  onStatusChange,
  query,
  resultsSummary,
  searchPlaceholder,
  selectedStatus,
}: SearchBarAndFilterProps) {
  const resultLabel = getResultsLabel(resultsSummary)

  return (
    <Box
      sx={{
        alignItems: { md: 'stretch', xs: 'stretch' },
        display: 'grid',
        gap: 1.5,
        gridTemplateColumns: { md: 'minmax(0, 1fr) auto', xs: '1fr' },
      }}
    >
      <AppInput
        className="min-w-0"
        icon={
          <SearchRoundedIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
        }
        onChange={event => onQueryChange(event.target.value)}
        placeholder={searchPlaceholder}
        type="search"
        value={query}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Typography
                sx={{
                  color: 'text.secondary',
                  fontSize: { md: 15, xs: 13 },
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}
              >
                {resultLabel}
              </Typography>
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'background.paper',
            borderRadius: '14px',
            height: 44,
            minHeight: 44,
          },
          '& .MuiInputAdornment-positionStart': {
            marginRight: 1,
          },
          ...outlineFieldBorderSx,
        }}
      />

      <AppDropdown
        borderRadius="12px"
        displayLabel="Filtros"
        fullWidth
        leadingIcon={
          <FilterAltOutlinedIcon
            sx={{ color: 'text.secondary', fontSize: 20 }}
          />
        }
        MenuProps={{
          PaperProps: {
            sx: {
              marginTop: '10px',
            },
          },
        }}
        neutralOutline
        onChange={event => onStatusChange(String(event.target.value))}
        options={filterOptions}
        sx={{
          '& .MuiOutlinedInput-root': {
            height: 44,
            minHeight: 44,
          },
          '& .MuiSelect-icon': {
            color: 'text.secondary',
            fontSize: 20,
          },
          '& .MuiSelect-select': {
            alignItems: 'center',
            gap: 1,
            paddingBlock: '10px',
            paddingInline: '14px',
          },
          backgroundColor: 'background.paper',
          minHeight: 44,
          ...outlineFieldBorderSx,
        }}
        triggerVariant="ghost"
        value={selectedStatus}
        width="auto"
      />
    </Box>
  )
}
