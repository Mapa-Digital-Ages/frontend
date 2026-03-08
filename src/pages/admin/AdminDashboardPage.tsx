import { Box } from '@mui/material'
import { useEffect, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import LoadingScreen from '@/components/common/LoadingScreen'
import PageHeader from '@/components/common/PageHeader'
import AppButton from '@/components/ui/AppButton'
import AppPageContainer from '@/components/ui/AppPageContainer'
import { APP_ROUTES } from '@/constants/routes'
import { adminService } from '@/services/admin.service'
import type { AdminStat } from '@/types/common'
import AdminStatsCard from './components/AdminStatsCard'

function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStat[]>([])
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

  return (
    <AppPageContainer>
      <PageHeader
        actions={
          <AppButton
            component={RouterLink}
            to={APP_ROUTES.admin.users}
            variant="outlined"
          >
            Ver usuários
          </AppButton>
        }
        eyebrow="Admin"
        subtitle="O layout administrativo reaproveita a shell principal com pequenas diferenças visuais."
        title="Operação e governança"
      />

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { md: 'repeat(3, 1fr)', xs: '1fr' },
        }}
      >
        {stats.map(stat => (
          <AdminStatsCard key={stat.id} stat={stat} />
        ))}
      </Box>
    </AppPageContainer>
  )
}

export default AdminDashboardPage
