import ClearRoundedIcon from '@mui/icons-material/ClearRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import { IconButton, InputAdornment } from '@mui/material'
import AppInput from '@/shared/ui/AppInput'

interface TrailSearchBarProps {
  onChange: (query: string) => void
  query: string
  subjectColor: string
}

export default function TrailSearchBar({
  onChange,
  query,
  subjectColor,
}: TrailSearchBarProps) {
  return (
    <AppInput
      icon={
        <SearchRoundedIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
      }
      onChange={e => onChange(e.target.value)}
      placeholder="Pesquisar etapas e sub-etapas..."
      value={query}
      InputProps={{
        endAdornment: query ? (
          <InputAdornment position="end">
            <IconButton
              aria-label="Limpar pesquisa"
              edge="end"
              onClick={() => onChange('')}
              size="small"
              sx={{ color: 'text.secondary' }}
            >
              <ClearRoundedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </InputAdornment>
        ) : null,
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: '14px',
          height: 44,
          minHeight: 44,
        },
        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
          {
            borderColor: subjectColor,
          },
      }}
    />
  )
}
