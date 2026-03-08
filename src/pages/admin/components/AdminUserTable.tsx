import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import AppCard from '@/components/ui/AppCard'
import { ROLE_LABELS } from '@/constants/roles'
import type { AdminUser } from '@/types/common'

interface AdminUserTableProps {
  users: AdminUser[]
}

function AdminUserTable({ users }: AdminUserTableProps) {
  return (
    <AppCard title="Usuários cadastrados">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell>Perfil</TableCell>
            <TableCell>Organização</TableCell>
            <TableCell>Último acesso</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map(user => (
            <TableRow key={user.id}>
              <TableCell>
                <Typography sx={{ fontWeight: 600 }}>{user.name}</Typography>
                <Typography color="text.secondary" variant="body2">
                  {user.email}
                </Typography>
              </TableCell>
              <TableCell>{ROLE_LABELS[user.role]}</TableCell>
              <TableCell>{user.organization}</TableCell>
              <TableCell>
                {new Intl.DateTimeFormat('pt-BR', {
                  dateStyle: 'short',
                  timeStyle: 'short',
                }).format(new Date(user.lastAccess))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </AppCard>
  )
}

export default AdminUserTable
