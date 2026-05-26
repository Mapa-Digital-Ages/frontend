import { Tab, Tabs } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'

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
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const selectedBackground = isDark ? theme.palette.primary.dark : '#359CDF'
  const selectedHoverBackground = isDark
    ? theme.palette.primary.main
    : '#218cc9'
  const trackBackground = isDark
    ? alpha(theme.palette.common.white, 0.06)
    : '#e9edf2'
  const unselectedHoverBackground = isDark
    ? alpha(theme.palette.common.white, 0.08)
    : 'rgba(255,255,255,0.4)'

  return (
    <Tabs
      aria-label="Selecionar modo de autenticação"
      onChange={(_, nextValue: AuthMode) => onChange(nextValue)}
      value={value}
      variant="fullWidth"
      sx={{
        alignItems: 'center',
        border: '1px solid',
        borderColor: 'background.border',
        borderRadius: '8px',
        backgroundColor: trackBackground,
        minHeight: 44,
        p: 0.5,
        '& .MuiTabs-flexContainer': {
          gap: 1,
        },
        '& .MuiTabs-indicator': {
          display: 'none',
        },
      }}
    >
      {AUTH_MODE_OPTIONS.map(option => (
        <Tab
          disableRipple
          key={option.value}
          label={option.label}
          value={option.value}
          sx={{
            borderRadius: '8px',
            color: 'text.secondary',
            fontWeight: 700,
            minHeight: 34,
            py: 0,
            textTransform: 'none',
            '&.Mui-selected': {
              backgroundColor: selectedBackground,
              boxShadow: '0 1px 2px rgba(16, 42, 67, 0.06)',
              color: '#ffffff',
            },
            '&:hover': {
              backgroundColor:
                value === option.value
                  ? selectedHoverBackground
                  : unselectedHoverBackground,
              color: value === option.value ? '#ffffff' : 'text.primary',
            },
            '&.Mui-focusVisible': {
              outline: `2px solid ${theme.palette.primary.main}`,
              outlineOffset: '2px',
            },
          }}
        />
      ))}
    </Tabs>
  )
}

export default AuthModeSelect
