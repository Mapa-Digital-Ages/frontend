import {
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material'
import AppCard from '@/components/ui/AppCard'
import type { SchoolStudent } from '@/types/common'
import { formatEngagement } from '@/utils/formatters'

interface SchoolStudentTableProps {
  students: SchoolStudent[]
}

function SchoolStudentTable({ students }: SchoolStudentTableProps) {
  return (
    <AppCard title="Estudantes em destaque">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell>Turma</TableCell>
            <TableCell>Engajamento</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students.map(student => (
            <TableRow key={student.id}>
              <TableCell>{student.name}</TableCell>
              <TableCell>{student.className}</TableCell>
              <TableCell sx={{ minWidth: 180 }}>
                {formatEngagement(student.engagement)}
                <LinearProgress
                  sx={{ mt: 1 }}
                  value={student.engagement}
                  variant="determinate"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </AppCard>
  )
}

export default SchoolStudentTable
