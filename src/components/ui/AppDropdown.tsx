import {
  Select,
  MenuItem,
  ListItemIcon,
  ListItemText,
  FormControl,
  FormHelperText,
  Checkbox,
  SelectProps,
  Typography,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import CheckIcon from '@mui/icons-material/Check'

export interface DropdownOption {
  label: string
  value: string | number
}

export interface AppDropdownProps extends Omit<
  SelectProps,
  'value' | 'onChange'
> {
  label?: string
  options: DropdownOption[]
  value: string | number | Array<string | number>
  onChange: SelectProps['onChange']
  placeholder?: string
  dropdownPlacement?: 'bottom' | 'top'
  width?: string | number
  borderRadius?: string | number
  backgroundColor?: string
  helperText?: string
}

function AppDropdown({
  label,
  options = [],
  value,
  onChange,
  placeholder = 'Selecione uma opção',
  dropdownPlacement = 'bottom',
  width = 240,
  borderRadius = 'var(--dropdown-radius)',
  backgroundColor = 'background.paper',
  error,
  helperText,
  ...props
}: AppDropdownProps) {
  const { multiple = false, disabled, className } = props

  const renderValue = (selected: unknown) => {
    if (!selected || (Array.isArray(selected) && selected.length === 0)) {
      return <span style={{ color: 'gray' }}>{placeholder}</span>
    }

    if (multiple && Array.isArray(selected)) {
      const selectedLabels = options
        .filter(opt => selected.includes(opt.value))
        .map(opt => opt.label)
      return selectedLabels.join(', ')
    }

    if (
      !multiple &&
      (typeof selected === 'string' || typeof selected === 'number')
    ) {
      const found = options.find(opt => opt.value === selected)
      return found ? found.label : String(selected)
    }

    return ''
  }

  return (
    <FormControl
      className={className}
      disabled={disabled}
      error={error}
      style={{ minWidth: width, maxWidth: width, width, borderRadius }}
    >
      {label && (
        <Typography variant="body2" color={error ? 'error.main' : undefined}>
          {label}
        </Typography>
      )}
      <Select
        {...props}
        error={error}
        value={value}
        onChange={onChange}
        displayEmpty
        renderValue={renderValue}
        IconComponent={ExpandMoreIcon}
        className="outline-none ring-0! border-slate-300 aria-expanded:border-blue-700 aria-expanded:ring-2 aria-expanded:ring-blue-700 focus:border-slate-300 focus-visible:border-slate-300 active:border-slate-300"
        sx={theme => ({
          backgroundColor: backgroundColor,
          color: theme.palette.text.primary,
          borderRadius: borderRadius,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: error
              ? theme.palette.error.main
              : theme.palette.background.border,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: error
              ? theme.palette.error.main
              : 'background.hoverBorder',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: error ? theme.palette.error.main : 'primary.main',
          },
        })}
        MenuProps={{
          ...props.MenuProps,
          anchorOrigin:
            dropdownPlacement === 'top'
              ? { vertical: 'top', horizontal: 'left' }
              : { vertical: 'bottom', horizontal: 'left' },
          transformOrigin:
            dropdownPlacement === 'top'
              ? { vertical: 'bottom', horizontal: 'left' }
              : { vertical: 'top', horizontal: 'left' },
          PaperProps: {
            ...props.MenuProps?.PaperProps,
            className: 'shadow-lg mt-1 border border-slate-100',
            sx: theme => ({
              backgroundColor: 'background.paper',
              color: theme.palette.text.primary,
              borderRadius: borderRadius,
              minWidth: width,
              '& .MuiList-root': {
                padding: '8px',
                borderRadius: borderRadius,
              },
            }),
          },
        }}
      >
        {options.map(option => {
          const isSelected = multiple
            ? Array.isArray(value) && value.includes(option.value)
            : value === option.value

          return (
            <MenuItem
              key={option.value}
              value={option.value}
              className={`transition-colors duration-200 ${
                multiple
                  ? 'text-slate-700 hover:bg-slate-100'
                  : isSelected
                    ? 'text-white hover:bg-cyan-600!'
                    : 'text-slate-700 hover:bg-slate-100'
              }`}
              sx={theme => ({
                margin: 'var(--dropdown-option-gap)',
                borderRadius: 'var(--dropdown-radius)',
                paddingY: '8px',
                paddingX: '12px',

                backgroundColor:
                  !multiple && isSelected ? 'primary.main' : 'transparent',

                color:
                  !multiple && isSelected
                    ? 'primary.contrastText'
                    : theme.palette.text.primary,

                '&:hover': {
                  backgroundColor: multiple
                    ? 'background.hover'
                    : isSelected
                      ? 'primary.dark'
                      : 'background.hover',
                },

                '&.Mui-selected': {
                  backgroundColor: multiple ? 'transparent' : 'primary.main',
                  color: multiple
                    ? theme.palette.text.primary
                    : 'primary.contrastText',
                },

                '&.Mui-selected:hover': {
                  backgroundColor: multiple
                    ? 'background.hover'
                    : 'primary.dark',
                },

                minWidth: width,
                maxWidth: width,
              })}
            >
              <ListItemIcon className="min-w-8 flex items-center justify-center">
                {multiple ? (
                  <Checkbox
                    checked={isSelected}
                    tabIndex={-1}
                    disableRipple
                    sx={theme => ({
                      color: theme.palette.text.primary,
                      '&.Mui-checked': {
                        color: 'primary.main',
                      },
                    })}
                  />
                ) : (
                  isSelected && (
                    <CheckIcon fontSize="small" className="text-white" />
                  )
                )}
              </ListItemIcon>

              <ListItemText
                primary={option.label}
                className={multiple ? 'ml-2' : ''}
              />
            </MenuItem>
          )
        })}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  )
}

export default AppDropdown
