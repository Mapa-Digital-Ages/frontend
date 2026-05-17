import CheckIcon from '@mui/icons-material/Check'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  Box,
  Checkbox,
  FormControl,
  FormHelperText,
  ListItemIcon,
  ListItemText,
  ListSubheader,
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
  groupLabel?: string
  disabled?: boolean
}

type TriggerVariant = 'filled' | 'ghost'

export interface AppDropdownProps extends Omit<
  SelectProps,
  'value' | 'onChange'
> {
  label?: string
  displayLabel?: string
  hideLabel?: boolean
  hideIndicator?: boolean
  fullWidth?: boolean
  leadingIcon?: ReactNode
  menuWidth?: string | number
  menuMaxHeight?: number
  selectedValues?: Array<string | number>
  options: DropdownOption[]
  value: string | number | Array<string | number>
  onChange: SelectProps['onChange']
  placeholder?: string
  dropdownPlacement?: 'bottom' | 'top'
  menuAlign?: 'left' | 'right'
  width?: string | number
  borderRadius?: string | number
  backgroundColor?: string
  helperText?: string
  triggerVariant?: TriggerVariant
  neutralOutline?: boolean
}

function AppDropdown({
  label,
  displayLabel,
  hideLabel = false,
  hideIndicator = false,
  fullWidth = false,
  leadingIcon,
  menuWidth,
  menuMaxHeight = 320,
  selectedValues,
  options = [],
  value,
  onChange,
  placeholder = 'Selecione uma opção',
  dropdownPlacement = 'bottom',
  menuAlign = 'left',
  width = 240,
  borderRadius = 'var(--dropdown-radius)',
  backgroundColor = 'background.paper',
  helperText,
  triggerVariant = 'filled',
  neutralOutline = false,
  ...props
}: AppDropdownProps) {
  const theme = useTheme()
  const {
    multiple = false,
    disabled,
    className,
    error,
    MenuProps,
    sx,
    inputProps,
    ['aria-label']: ariaLabel,
    ...selectProps
  } = props

  const isGhostTrigger = triggerVariant === 'ghost'
  const resolvedMenuWidth = menuWidth ?? (width === 'auto' ? 220 : width)
  const neutralBorder = theme.palette.background.border
  const roleAccentColor = 'var(--app-role-current-primary, var(--app-primary))'
  const roleHoverBackground = 'var(--app-role-action-hover-bg)'
  const roleHoverBorder = 'var(--app-role-action-hover-border)'
  const roleSelectedBackground = 'var(--app-role-action-selected-bg)'
  const roleSelectedBorder = 'var(--app-role-action-selected-border)'

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
        borderStyle: 'solid',
        borderWidth: 1,
      }),
    },
    '& .MuiSelect-select': {
      alignItems: 'center',
      display: 'flex',
      gap: hideLabel ? 0 : 1,
      ...(hideLabel
        ? {
            height: 44,
            justifyContent: 'center',
            lineHeight: 0,
            minHeight: '44px !important',
            padding: '0 !important',
            paddingBottom: '0 !important',
            paddingLeft: '0 !important',
            paddingRight: '0 !important',
            paddingTop: '0 !important',
            textAlign: 'center',
          }
        : {
            minHeight: '0 !important',
            paddingBlock: isGhostTrigger ? '10px' : '12px',
            paddingInline: isGhostTrigger ? '14px' : '16px',
            ...(hideIndicator && {
              paddingRight: `${isGhostTrigger ? 14 : 16}px !important`,
            }),
          }),
    },
    '& .MuiSelect-icon': {
      color: theme.palette.text.secondary,
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: neutralOutline
        ? neutralBorder
        : isGhostTrigger
          ? roleHoverBorder
          : theme.palette.background.hoverBorder,
    },
    '&.Mui-focused': {
      backgroundColor: neutralOutline
        ? theme.palette.background.paper
        : isGhostTrigger
          ? roleHoverBackground
          : backgroundColor,
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: neutralOutline ? neutralBorder : roleAccentColor,
    },
    ...(neutralOutline && {
      '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: neutralBorder,
      },
    }),
    ...(isGhostTrigger &&
      !neutralOutline && {
        '&:hover': {
          backgroundColor: roleHoverBackground,
        },
      }),
    ...(hideLabel && {
      '& .MuiInputBase-input': {
        padding: '0 !important',
      },
      '& .MuiOutlinedInput-input': {
        padding: '0 !important',
      },
      '& .MuiOutlinedInput-root': {
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
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

    if (hideLabel && leadingIcon) {
      return (
        <Box
          className="flex min-w-0 items-center justify-center"
          sx={{
            alignItems: 'center',
            color: resolvedPlaceholder
              ? theme.palette.text.secondary
              : theme.palette.text.primary,
            display: 'flex',
            height: '100%',
            justifyContent: 'center',
            lineHeight: 0,
            width: '100%',
            '& .MuiSvgIcon-root': {
              display: 'block',
            },
          }}
        >
          {leadingIcon}
        </Box>
      )
    }

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
      error={error}
      fullWidth={fullWidth}
      sx={{
        maxWidth: fullWidth ? '100%' : width,
        minWidth: fullWidth ? '100%' : width === 'auto' ? undefined : width,
        width: fullWidth ? '100%' : width,
      }}
    >
      {label && (
        <Typography variant="body2" color={error ? 'error.main' : undefined}>
          {label}
        </Typography>
      )}

      <Select
        {...selectProps}
        error={error}
        value={value}
        onChange={onChange}
        inputProps={{
          ...inputProps,
          ...(ariaLabel ? { 'aria-label': ariaLabel } : {}),
        }}
        displayEmpty
        renderValue={renderValue}
        IconComponent={hideIndicator || hideLabel ? () => null : ExpandMoreIcon}
        sx={selectSx}
        MenuProps={{
          ...MenuProps,
          MenuListProps: {
            ...MenuProps?.MenuListProps,
            sx: {
              boxSizing: 'border-box',
              ...(MenuProps?.MenuListProps?.sx as object),
            },
          },
          anchorOrigin:
            dropdownPlacement === 'top'
              ? { vertical: 'top', horizontal: menuAlign }
              : { vertical: 'bottom', horizontal: menuAlign },
          transformOrigin:
            dropdownPlacement === 'top'
              ? { vertical: 'bottom', horizontal: menuAlign }
              : { vertical: 'top', horizontal: menuAlign },
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
              maxHeight: { sm: menuMaxHeight, xs: 'min(60vh, 360px)' },
              maxWidth: { sm: 'unset', xs: 'calc(100vw - 32px)' },
              minWidth: { sm: resolvedMenuWidth, xs: 'min(260px, 90vw)' },
              width: { sm: resolvedMenuWidth, xs: 'min(280px, 92vw)' },
              overflowY: 'auto',
              '& .MuiListItemText-primary': {
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              },
              ...(MenuProps?.PaperProps?.sx as object),
            },
          },
        }}
      >
        {options.flatMap(option => {
          const isSelected = selectedValues
            ? selectedValues.includes(option.value)
            : multiple
              ? Array.isArray(value) && value.includes(option.value)
              : value === option.value
          const optionBackgroundColor = isSelected
            ? roleSelectedBackground
            : 'transparent'
          const optionNodes = []
          if (option.groupLabel) {
            optionNodes.push(
              <ListSubheader
                key={`${option.value}-group`}
                disableSticky
                sx={{
                  backgroundColor: 'transparent',
                  color: theme.palette.text.secondary,
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                }}
              >
                {option.groupLabel}
              </ListSubheader>
            )
          }

          optionNodes.push(
            <MenuItem
              key={option.value}
              disabled={option.disabled}
              selected={isSelected}
              value={option.value}
              sx={{
                backgroundColor: optionBackgroundColor,
                border: '1px solid transparent',
                boxSizing: 'border-box',
                borderRadius,
                color: theme.palette.text.primary,
                mx: 1,
                '&:hover': {
                  backgroundColor: roleHoverBackground,
                  borderColor: roleHoverBorder,
                },
                '&.Mui-selected': {
                  backgroundColor: roleSelectedBackground,
                  borderColor: roleSelectedBorder,
                },
                '&.Mui-selected:hover': {
                  backgroundColor: `${roleHoverBackground} !important`,
                  borderColor: roleHoverBorder,
                },
                '&.Mui-focusVisible': {
                  backgroundColor: `${roleHoverBackground} !important`,
                  borderColor: roleHoverBorder,
                },
                '&.Mui-focusVisible:hover': {
                  backgroundColor: `${roleHoverBackground} !important`,
                },
                '&.Mui-disabled': {
                  opacity: 0.55,
                },
              }}
            >
              <ListItemIcon
                sx={{
                  alignItems: 'center',
                  color: isSelected
                    ? roleAccentColor
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
                        color: roleAccentColor,
                      },
                    }}
                  />
                ) : isSelected ? (
                  <CheckIcon fontSize="small" />
                ) : null}
              </ListItemIcon>

              <ListItemText primary={option.label} sx={{ minWidth: 0 }} />
            </MenuItem>
          )

          return optionNodes
        })}
      </Select>

      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  )
}

export default AppDropdown
