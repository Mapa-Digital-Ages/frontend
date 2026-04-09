import CheckIcon from '@mui/icons-material/Check'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  Box,
  Checkbox,
  FormControl,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  type SelectProps,
  Typography,
} from '@mui/material'
import { alpha, useTheme, type SxProps, type Theme } from '@mui/material/styles'
import type { ReactNode } from 'react'

export interface DropdownOption {
  label: string
  value: string | number
}

type TriggerVariant = 'filled' | 'ghost'

export interface AppDropdownProps extends Omit<
  SelectProps,
  'value' | 'onChange'
> {
  displayLabel?: string
  hideIndicator?: boolean
  fullWidth?: boolean
  leadingIcon?: ReactNode
  menuWidth?: string | number
  options: DropdownOption[]
  value: string | number | Array<string | number>
  onChange: SelectProps['onChange']
  placeholder?: string
  dropdownPlacement?: 'bottom' | 'top'
  width?: string | number
  borderRadius?: string | number
  backgroundColor?: string
  triggerVariant?: TriggerVariant
  neutralOutline?: boolean
}

function AppDropdown({
  displayLabel,
  hideIndicator = false,
  fullWidth = false,
  leadingIcon,
  menuWidth,
  options = [],
  value,
  onChange,
  placeholder = 'Selecione uma opção',
  dropdownPlacement = 'bottom',
  width = 240,
  borderRadius = 'var(--dropdown-radius)',
  backgroundColor = 'background.paper',
  triggerVariant = 'filled',
  neutralOutline = false,
  ...props
}: AppDropdownProps) {
  const theme = useTheme()
  const {
    multiple = false,
    disabled,
    className,
    MenuProps,
    sx,
    ...selectProps
  } = props
  const isGhostTrigger = triggerVariant === 'ghost'
  const resolvedMenuWidth = menuWidth ?? (width === 'auto' ? 220 : width)
  const neutralBorder = theme.palette.background.border

  const baseTriggerSx = {
    backgroundColor: neutralOutline
      ? theme.palette.background.paper
      : isGhostTrigger
        ? 'transparent'
        : backgroundColor,
    borderRadius,
    color: theme.palette.text.primary,
    minHeight: isGhostTrigger ? 36 : 36,
    transition: theme.transitions.create(
      ['background-color', 'border-color', 'box-shadow'],
      {
        duration: theme.transitions.duration.shorter,
      }
    ),
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: neutralOutline
        ? neutralBorder
        : isGhostTrigger
          ? 'transparent'
          : alpha(theme.palette.background.border, 0.8),
      ...(neutralOutline && {
        borderWidth: 1,
        borderStyle: 'solid',
      }),
    },
    '& .MuiSelect-select': {
      alignItems: 'center',
      display: 'flex',
      gap: 1,
      minHeight: '0 !important',
      paddingBlock: isGhostTrigger ? '10px' : '12px',
      paddingInline: isGhostTrigger ? '14px' : '16px',
      ...(hideIndicator && {
        paddingRight: `${isGhostTrigger ? 14 : 16}px !important`,
      }),
    },
    '& .MuiSelect-icon': {
      color: theme.palette.text.secondary,
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: neutralOutline
        ? neutralBorder
        : isGhostTrigger
          ? alpha(theme.palette.primary.main, 0.24)
          : theme.palette.background.hoverBorder,
    },
    '&.Mui-focused': {
      backgroundColor: neutralOutline
        ? theme.palette.background.paper
        : isGhostTrigger
          ? alpha(
              theme.palette.primary.main,
              theme.palette.mode === 'dark' ? 0.1 : 0.06
            )
          : backgroundColor,
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: neutralOutline ? neutralBorder : theme.palette.primary.main,
    },
    ...(neutralOutline && {
      '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: neutralBorder,
      },
    }),
    ...(isGhostTrigger &&
      !neutralOutline && {
        '&:hover': {
          backgroundColor: alpha(
            theme.palette.background.paper,
            theme.palette.mode === 'dark' ? 0.08 : 0.72
          ),
        },
      }),
  }

  const neutralOutlineSx: SxProps<Theme> = {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: neutralBorder,
      borderStyle: 'solid',
      borderWidth: 1,
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: neutralBorder,
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: neutralBorder,
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: neutralBorder,
    },
    '&.Mui-focused': {
      backgroundColor: theme.palette.background.paper,
    },
    '&:hover': {
      backgroundColor: theme.palette.background.paper,
    },
  }

  const selectSx: SxProps<Theme> = neutralOutline
    ? typeof sx === 'function'
      ? [baseTriggerSx, sx, neutralOutlineSx]
      : Array.isArray(sx)
        ? [baseTriggerSx, ...sx, neutralOutlineSx]
        : [{ ...baseTriggerSx, ...(sx ?? {}) }, neutralOutlineSx]
    : typeof sx === 'function'
      ? [baseTriggerSx, sx]
      : Array.isArray(sx)
        ? [baseTriggerSx, ...sx]
        : { ...baseTriggerSx, ...(sx ?? {}) }

  const renderValue = (selected: unknown) => {
    let content = placeholder
    let isPlaceholder = false

    if (!selected || (Array.isArray(selected) && selected.length === 0)) {
      isPlaceholder = true
    } else if (multiple && Array.isArray(selected)) {
      content = options
        .filter(option => selected.includes(option.value))
        .map(option => option.label)
        .join(', ')
    } else if (
      !multiple &&
      (typeof selected === 'number' || typeof selected === 'string')
    ) {
      const matchingOption = options.find(option => option.value === selected)
      content = matchingOption ? matchingOption.label : String(selected)
    }

    const resolvedContent = displayLabel ?? content
    const resolvedPlaceholder = displayLabel ? false : isPlaceholder

    return (
      <Box className="flex min-w-0 items-center gap-2">
        {leadingIcon && (
          <Box
            className="flex shrink-0 items-center"
            sx={{
              color: resolvedPlaceholder
                ? theme.palette.text.secondary
                : theme.palette.text.primary,
            }}
          >
            {leadingIcon}
          </Box>
        )}
        <Typography
          className="truncate"
          sx={{
            color: resolvedPlaceholder
              ? theme.palette.text.secondary
              : theme.palette.text.primary,
            fontSize: 14,
            fontWeight: isGhostTrigger ? 600 : 500,
          }}
        >
          {resolvedContent}
        </Typography>
      </Box>
    )
  }

  return (
    <FormControl
      className={className}
      disabled={disabled}
      fullWidth={fullWidth}
      sx={{
        maxWidth: fullWidth ? '100%' : width,
        minWidth: fullWidth ? '100%' : width === 'auto' ? undefined : width,
        width: fullWidth ? '100%' : width,
      }}
    >
      <Select
        {...selectProps}
        value={value}
        onChange={onChange}
        displayEmpty
        renderValue={renderValue}
        IconComponent={hideIndicator ? () => null : ExpandMoreIcon}
        sx={selectSx}
        MenuProps={{
          ...MenuProps,
          anchorOrigin:
            dropdownPlacement === 'top'
              ? { vertical: 'top', horizontal: 'left' }
              : { vertical: 'bottom', horizontal: 'left' },
          transformOrigin:
            dropdownPlacement === 'top'
              ? { vertical: 'bottom', horizontal: 'left' }
              : { vertical: 'top', horizontal: 'left' },
          PaperProps: {
            ...MenuProps?.PaperProps,
            sx: {
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${alpha(theme.palette.background.border, 0.8)}`,
              borderRadius,
              boxShadow:
                theme.palette.mode === 'dark'
                  ? '0 18px 45px rgba(8, 17, 31, 0.42)'
                  : '0 16px 40px rgba(16, 42, 67, 0.12)',
              color: theme.palette.text.primary,
              minWidth: resolvedMenuWidth,
              '& .MuiList-root': {
                padding: '8px',
              },
              ...(MenuProps?.PaperProps?.sx as object),
            },
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
              selected={isSelected}
              value={option.value}
              sx={{
                backgroundColor: isSelected
                  ? alpha(theme.palette.primary.main, 0.12)
                  : 'transparent',
                borderRadius,
                color: theme.palette.text.primary,
                marginBlock: '2px',
                minWidth: resolvedMenuWidth,
                paddingInline: 1.5,
                paddingY: 1,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                },
                '&.Mui-selected': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.14),
                },
                '&.Mui-selected:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.18),
                },
              }}
            >
              <ListItemIcon
                sx={{
                  alignItems: 'center',
                  color: isSelected
                    ? theme.palette.primary.main
                    : theme.palette.text.secondary,
                  display: 'flex',
                  justifyContent: 'center',
                  minWidth: 32,
                }}
              >
                {multiple ? (
                  <Checkbox
                    checked={isSelected}
                    tabIndex={-1}
                    disableRipple
                    sx={{
                      color: theme.palette.text.secondary,
                      '&.Mui-checked': {
                        color: theme.palette.primary.main,
                      },
                    }}
                  />
                ) : isSelected ? (
                  <CheckIcon fontSize="small" />
                ) : null}
              </ListItemIcon>

              <ListItemText primary={option.label} />
            </MenuItem>
          )
        })}
      </Select>
    </FormControl>
  )
}

export default AppDropdown
