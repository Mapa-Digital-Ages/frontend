import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined'
import InputAdornment from '@mui/material/InputAdornment'
import Typography from '@mui/material/Typography'
import { Box } from '@mui/material'
import type { SxProps, Theme } from '@mui/material/styles'
import type { DropdownOption } from '@/shared/ui/AppDropdown'
import type { ApprovalResultsSummary } from '@/modules/admin/shared/types/types'
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
  filterOptions?: DropdownOption[]
  onQueryChange: (query: string) => void
  onStatusChange?: (status: string) => void
  query: string
  resultsSummary: ApprovalResultsSummary
  searchPlaceholder: string
  selectedStatus?: string
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

  const showFilter =
    filterOptions != null &&
    filterOptions.length > 0 &&
    selectedStatus != null &&
    onStatusChange != null

  return (
    <Box
      sx={{
        alignItems: 'stretch',
        display: 'grid',
        gap: 1.5,
        gridTemplateColumns: {
          xs: showFilter ? 'minmax(0, 1fr) 44px' : 'minmax(0, 1fr)',
          md: showFilter ? 'minmax(0, 1fr) auto' : 'minmax(0, 1fr)',
        },
        maxWidth: '100%',
        minWidth: 0,
        overflow: 'hidden',
        width: '100%',
      }}
    >
      <AppInput
        onChange={event => onQueryChange(event.target.value)}
        placeholder={searchPlaceholder}
        type="search"
        value={query}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment
                position="start"
                sx={{
                  flexShrink: 0,
                  mr: 1,
                }}
              >
                <SearchRoundedIcon
                  sx={{
                    color: 'text.secondary',
                    fontSize: 22,
                  }}
                />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment
                position="end"
                sx={{
                  flexShrink: 0,
                  ml: 1,
                }}
              >
                <Typography
                  component="span"
                  sx={{
                    color: 'text.secondary',
                    fontSize: {
                      xs: 14,
                      md: 15,
                    },
                    fontWeight: 600,
                    maxWidth: {
                      xs: 96,
                      sm: 140,
                      md: 180,
                    },
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {resultLabel}
                </Typography>
              </InputAdornment>
            ),
          },
        }}
        sx={{
          maxWidth: '100%',
          minWidth: 0,
          width: '100%',

          '& .MuiOutlinedInput-root': {
            alignItems: 'center',
            backgroundColor: 'background.paper',
            borderRadius: '14px',
            boxSizing: 'border-box',
            display: 'flex',
            height: 44,
            maxWidth: '100%',
            minHeight: 44,
            minWidth: 0,
            overflow: 'hidden',
            px: {
              xs: 1.75,
              md: 2,
            },
            width: '100%',
          },

          '& .MuiInputBase-input': {
            boxSizing: 'border-box',
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          },

          ...outlineFieldBorderSx,
        }}
      />

      {showFilter ? (
        <AppDropdown
          borderRadius="12px"
          displayLabel="Filtros"
          fullWidth={false}
          hideLabel
          inputProps={{ 'aria-label': 'Filtrar resultados' }}
          leadingIcon={
            <FilterAltOutlinedIcon
              sx={{
                color: 'text.secondary',
                fontSize: 20,
              }}
            />
          }
          menuAlign="right"
          menuMaxHeight={240}
          menuWidth={220}
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
            alignSelf: 'stretch',
            backgroundColor: 'background.paper',
            maxWidth: {
              xs: 44,
              md: 'none',
            },
            minHeight: 44,
            minWidth: {
              xs: 44,
              md: 'auto',
            },
            width: {
              xs: 44,
              md: 'auto',
            },

            '& .MuiOutlinedInput-root': {
              alignItems: 'center',
              display: 'flex',
              height: 44,
              justifyContent: 'center',
              minHeight: 44,
              padding: {
                xs: 0,
                md: undefined,
              },
            },

            '& .MuiInputBase-input': {
              padding: {
                xs: '0 !important',
                md: undefined,
              },
            },

            '& .MuiOutlinedInput-input': {
              padding: {
                xs: '0 !important',
                md: undefined,
              },
            },

            '& .MuiSelect-icon': {
              color: 'text.secondary',
              fontSize: 20,
            },

            '& .MuiSelect-select': {
              alignItems: 'center',
              display: 'flex',
              justifyContent: {
                xs: 'center',
                md: 'flex-start',
              },
              minWidth: 0,
              padding: {
                xs: '0 !important',
                md: '10px 14px',
              },
              paddingRight: {
                xs: '0 !important',
                md: undefined,
              },
            },

            ...outlineFieldBorderSx,
          }}
          triggerVariant="ghost"
          value={selectedStatus}
          width={44}
        />
      ) : null}
    </Box>
  )
}
