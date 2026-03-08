import { useEffect, useState } from 'react'
import LoadingScreen from '@/components/common/LoadingScreen'
import PageHeader from '@/components/common/PageHeader'
import AppPageContainer from '@/components/ui/AppPageContainer'
import { adminService } from '@/services/admin.service'
import type { AdminUser } from '@/types/common'
import AdminUserTable from './components/AdminUserTable'

function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isActive = true

    async function loadPage() {
      const nextUsers = await adminService.getUsers()

      if (!isActive) {
        return
      }

      setUsers(nextUsers)
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
        eyebrow="Admin"
        subtitle="Tabela administrativa simples para validar a separação entre página e componente local."
        title="Gestão de usuários"
      />

      <AdminUserTable users={users} />
    </AppPageContainer>
  )
}

export default AdminUsersPage
