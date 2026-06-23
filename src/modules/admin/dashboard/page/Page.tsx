import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded'
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded'
import LibraryBooksRoundedIcon from '@mui/icons-material/LibraryBooksRounded'
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded'
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded'
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded'
import { Box, Button, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { APP_ROUTES } from '@/app/router/paths'
import { AppColors } from '@/app/theme/core/colors'
import LoadingScreen from '@/shared/ui/LoadingScreen'
import AppPageContainer from '@/shared/ui/AppPageContainer'
import { adminService } from '../services/service'
import type { IconVariantName } from '@/app/theme/core/palette'
import type { Stat } from '@/shared/types/common'
import PageHeader from '@/shared/ui/PageHeader'
import MetricsCard from '@/shared/ui/MetricsCard'
import AppCard from '@/shared/ui/AppCard'

const CREATION_SHORTCUTS = [
  {
    id: 'create-student',
    icon: <GroupsRoundedIcon />,
    label: 'Cadastrar aluno',
    to: `${APP_ROUTES.admin.students}?create=student`,
  },
  {
    id: 'create-company',
    icon: <BusinessRoundedIcon />,
    label: 'Cadastrar empresa',
    to: `${APP_ROUTES.admin.schoolsAndCompanies}?create=company`,
  },
  {
    id: 'create-school',
    icon: <SchoolRoundedIcon />,
    label: 'Cadastrar escola',
    to: `${APP_ROUTES.admin.schoolsAndCompanies}?create=school`,
  },
  {
    id: 'create-parent',
    icon: <PersonAddRoundedIcon />,
    label: 'Cadastrar responsável',
    to: `${APP_ROUTES.admin.parents}?create=parent`,
  },
  {
    id: 'open-contents',
    icon: <LibraryBooksRoundedIcon />,
    label: 'Conteúdos',
    to: APP_ROUTES.admin.contents,
  },
]

export default function Page() {
  const theme = useTheme()
  const [stats, setStats] = useState<Stat[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isActive = true

    async function loadPage() {
      const nextStats = await adminService.getStats()

      if (!isActive) {
        return
      }

      setStats(nextStats)
      setIsLoading(false)
    }

    void loadPage()

    return () => {
      isActive = false
    }
  }, [])

  if (isLoading) {
    return <LoadingScreen />
  }

  const getStatById = (id: Stat['id']) => stats.find(stat => stat.id === id)

  const studentsCountStat = getStatById('students-count')
  const companiesCountStat = getStatById('companies-count')
  const schoolsCountStat = getStatById('schools-count')
  const pendingGuardiansStat = getStatById('pending-guardians')

  const cards = [
    {
      helper: studentsCountStat?.description ?? 'total de alunos cadastrados',
      helperColor: theme.palette.text.secondary,
      icon: <GroupsRoundedIcon />,
      iconVariant: 'blue' as IconVariantName,
      id: 'students-count',
      title: 'Alunos Cadastrados',
      value: studentsCountStat?.value ?? '—',
    },
    {
      helper: companiesCountStat?.description ?? 'empresas cadastradas',
      helperColor: theme.palette.text.secondary,
      icon: <BusinessRoundedIcon />,
      iconVariant: 'purple' as IconVariantName,
      id: 'companies-count',
      title: 'Empresas',
      value: companiesCountStat?.value ?? '—',
    },
    {
      helper: schoolsCountStat?.description ?? 'escolas cadastradas',
      helperColor: theme.palette.text.secondary,
      icon: <SchoolRoundedIcon />,
      iconVariant: 'green' as IconVariantName,
      id: 'schools-count',
      title: 'Escolas',
      value: schoolsCountStat?.value ?? '—',
    },
    {
      helper:
        pendingGuardiansStat?.description ??
        'responsáveis aguardando aprovação',
      helperColor: theme.palette.warning.main,
      icon: <NotificationsActiveRoundedIcon />,
      iconVariant: 'orange' as IconVariantName,
      id: 'pending-guardians',
      title: 'Responsáveis Pendentes',
      value: pendingGuardiansStat?.value ?? '—',
    },
  ]

  return (
    <AppPageContainer className="gap-4 md:gap-5">
      <PageHeader
        title="Painel Administrativo"
        subtitle="Visão consolidada da operação MAPA DIGITAL"
        variant="admin"
      />

      <Box className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 xl:grid-cols-4">
        {cards.map(card => (
          <MetricsCard contentClassName="p-5" key={card.id} {...card} />
        ))}
      </Box>

      <AppCard
        contentClassName="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 md:grid-cols-5"
        title="Atalhos administrativos"
        subtitle="Acesse rapidamente os formulários e conteúdos."
      >
        {CREATION_SHORTCUTS.map(shortcut => (
          <Button
            component={Link}
            data-testid={shortcut.id}
            key={shortcut.id}
            startIcon={shortcut.icon}
            to={shortcut.to}
            variant="contained"
            disableElevation
            sx={{
              backgroundColor: AppColors.role.admin.secondary,
              borderRadius: '14px',
              color: '#fff',
              justifyContent: 'flex-start',
              minHeight: { md: 88, xs: 80 },
              px: { md: 2, xs: 2.5 },
              py: 1.5,
              textTransform: 'none',
              width: '100%',
              '& .MuiButton-startIcon': {
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.16)',
                borderRadius: '10px',
                display: 'flex',
                height: 40,
                justifyContent: 'center',
                mr: 1.5,
                width: 40,
              },
              '& .MuiButton-startIcon svg': {
                fontSize: 22,
              },
              '&:hover': {
                backgroundColor: theme.palette.error.dark,
              },
            }}
          >
            <Box
              component="span"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'left',
              }}
            >
              <Typography
                component="span"
                sx={{ color: 'inherit', fontSize: 14, fontWeight: 700 }}
              >
                {shortcut.label}
              </Typography>
              <Typography
                component="span"
                sx={{ color: 'rgba(255, 255, 255, 0.78)', fontSize: 11 }}
              >
                Abrir atalho
              </Typography>
            </Box>
          </Button>
        ))}
      </AppCard>
    </AppPageContainer>
  )
}
