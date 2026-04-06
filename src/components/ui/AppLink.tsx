import React from 'react'
import { Link as MuiLink, LinkProps } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

export interface AppLinkProps extends Omit<LinkProps, 'href'> {
  to?: string
  href?: string
  children: React.ReactNode
}

function AppLink({ to, href, children, ...props }: AppLinkProps) {
  const Component = to ? RouterLink : 'a'

  return (
    <MuiLink
      {...props}
      component={Component}
      to={to}
      href={href}
      underline="always"
      sx={theme => ({
        display: 'inline-block',
        width: 'fit-content',
        color: 'primary.main',
        fontWeight: 500,
        textDecorationColor: theme.palette.primary.main,
        '&:hover': {
          color: theme.palette.primary.hover ?? theme.palette.primary.dark,
          textDecorationColor:
            theme.palette.primary.hover ?? theme.palette.primary.dark,
        },
        '&:active': {
          color: 'primary.dark',
        },
        '&:visited': {
          color: theme.palette.primary.main,
        },
        '&:focus-visible': {
          outline: `2px solid ${theme.palette.background.hoverBorder}`,
          outlineOffset: '2px',
          borderRadius: '4px',
        },
      })}
    >
      {children}
    </MuiLink>
  )
}

export default AppLink
