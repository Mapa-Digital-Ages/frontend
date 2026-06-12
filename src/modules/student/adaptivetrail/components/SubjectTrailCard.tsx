import { Link } from 'react-router-dom'
import { buildStudentTrailRoute } from '@/app/router/paths'
import { getSubjectIcon } from '@/shared/utils/subjectIcons'
import SubjectBaseCard from '../../shared/components/SubjectBaseCard'
import type { SubjectGroup } from '../data/trails'

interface SubjectTrailCardProps {
  group: SubjectGroup
}

export default function SubjectTrailCard({ group }: SubjectTrailCardProps) {
  const label = group.subject?.label ?? 'Geral'
  const count = group.trails.length
  const countLabel = `${count} ${count === 1 ? 'trilha' : 'trilhas'}`
  const firstTrailId = group.trails[0].id

  return (
    <SubjectBaseCard
      aria-label={`Abrir trilhas de ${label}`}
      component={Link}
      to={buildStudentTrailRoute(firstTrailId)}
      icon={getSubjectIcon(group.subject?.id)}
      progress={group.averageProgress}
      subject={group.subject}
      title={label}
      progressLabel={countLabel}
      sx={{
        cursor: 'pointer',
        textDecoration: 'none',
        transition: 'transform 0.2s ease',
        '&:hover': { transform: 'translateY(-2px)' },
      }}
    />
  )
}
