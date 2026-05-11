import type { SelectChangeEvent } from '@mui/material'
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded'
import AppDropdown from '@/shared/ui/AppDropdown'
import type { ParentDashboardChild } from '@/modules/parent/dashboard/types/types'
import { useBreakpoint } from '@/shared/hooks/useBreakpoint'

interface ChildSwitcherProps {
  children: ParentDashboardChild[]
  selectedChildId: string | null
  onSelect: (id: string) => void
}

function ChildSwitcher({
  children,
  selectedChildId,
  onSelect,
}: ChildSwitcherProps) {
  const { isMobile } = useBreakpoint()
  if (children.length === 0) return null

  const options = children.map(child => ({
    label: `${child.name} — ${child.grade}`,
    value: child.id,
  }))

  const handleChange = (event: SelectChangeEvent<unknown>) => {
    const value = event.target.value
    if (typeof value === 'string') {
      onSelect(value)
    }
  }

  return (
    <AppDropdown
      aria-label="Selecionar filho"
      options={options}
      value={selectedChildId ?? ''}
      onChange={handleChange}
      triggerVariant="ghost"
      width={isMobile ? 44 : 'auto'}
      menuWidth={220}
      hideLabel={isMobile}
      hideIndicator={isMobile}
      leadingIcon={
        isMobile ? <PeopleAltRoundedIcon fontSize="small" /> : undefined
      }
      placeholder="Selecionar aluno"
      sx={{
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: 'transparent !important',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: 'transparent !important',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: 'transparent !important',
        },
        '& .MuiSelect-select, & .MuiSelect-select *': {
          color: '#fff !important',
        },
        '& .MuiSelect-icon': { color: '#fff !important' },
        backgroundColor: 'transparent !important',
        '&:hover': { backgroundColor: 'transparent !important' },
        '&.Mui-focused': { backgroundColor: 'transparent !important' },
      }}
    />
  )
}

export default ChildSwitcher
