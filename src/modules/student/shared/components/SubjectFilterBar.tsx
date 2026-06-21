import { Box, Button } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { AppColors } from '@/app/theme/core/colors'
import { getSubjectTheme } from '@/shared/utils/themes'
import type { FilterOption } from '../types/types'

interface SubjectFilterBarProps {
  ariaLabel?: string
  onSelect: (value: string) => void
  options: FilterOption[]
  selectedValue: string
  testIdPrefix?: string
}

export default function SubjectFilterBar({
  ariaLabel = 'Filtrar por matéria',
  onSelect,
  options,
  selectedValue,
  testIdPrefix = 'subject-filter',
}: SubjectFilterBarProps) {
  const theme = useTheme()

  return (
    <Box
      aria-label={ariaLabel}
      role="group"
      sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}
    >
      {options.map(option => {
        const isSelected = selectedValue === option.value
        const subjectTheme = option.subject
          ? getSubjectTheme(option.subject, { mode: theme.palette.mode })
          : null
        const activeColor = subjectTheme?.color ?? AppColors.role.aluno.primary

        return (
          <Button
            aria-pressed={isSelected}
            data-testid={`${testIdPrefix}-${option.value}`}
            key={option.value}
            onClick={() => onSelect(option.value)}
            variant="outlined"
            sx={{
              backgroundColor: isSelected
                ? alpha(activeColor, 0.1)
                : 'background.paper',
              borderColor: isSelected
                ? alpha(activeColor, 0.28)
                : 'background.border',
              borderRadius: '999px',
              color: isSelected ? activeColor : 'text.primary',
              fontSize: 13,
              fontWeight: 600,
              minHeight: 36,
              px: 2,
              textTransform: 'none',
              '&:hover': {
                backgroundColor: isSelected
                  ? alpha(activeColor, 0.14)
                  : theme.palette.background.default,
                borderColor: isSelected
                  ? alpha(activeColor, 0.38)
                  : theme.palette.divider,
              },
            }}
          >
            {option.label}
          </Button>
        )
      })}
    </Box>
  )
}
