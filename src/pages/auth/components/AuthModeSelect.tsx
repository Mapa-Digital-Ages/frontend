import { Box, Button } from '@mui/material'

export type AuthMode = 'login' | 'register'

interface AuthModeSelectProps {
  value: AuthMode
  onChange: (value: AuthMode) => void
}

const AUTH_MODE_OPTIONS: Array<{ label: string; value: AuthMode }> = [
  { label: 'Login', value: 'login' },
  { label: 'Cadastro', value: 'register' },
]

function AuthModeSelect({ value, onChange }: AuthModeSelectProps) {
  return (
    <Box
      className="grid grid-cols-2 p-1 gap-2"
      role="tablist"
      sx={{
        height: 44,
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        backgroundColor: '#e9edf2',
      }}
    >
      {AUTH_MODE_OPTIONS.map(option => {
        const isSelected = value === option.value

        return (
          <Button
            aria-selected={isSelected}
            disableRipple
            key={option.value}
            onClick={() => onChange(option.value)}
            role="tab"
            sx={{
              minHeight: 34,
              borderRadius: '8px',
              color: isSelected ? '#FFFFFF' : '#64748b',
              backgroundColor: isSelected ? '#359CDF' : 'transparent',
              boxShadow: isSelected
                ? '0 1px 2px rgba(16, 42, 67, 0.06)'
                : 'none',
              fontWeight: 700,
              textTransform: 'none',
              '&:hover': {
                backgroundColor: isSelected
                  ? '#218cc9'
                  : 'rgba(255,255,255,0.4)',
                color: isSelected ? '#ffffff' : '#475569',
              },
              '&.Mui-focusVisible': {
                outline: '2px solid #359CDF',
                outlineOffset: '2px',
              },
            }}
            type="button"
          >
            {option.label}
          </Button>
        )
      })}
    </Box>
  )
}

export default AuthModeSelect
