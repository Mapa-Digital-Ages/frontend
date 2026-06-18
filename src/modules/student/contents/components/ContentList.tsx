import { Box } from '@mui/material'
import EmptyState from '@/shared/ui/EmptyState'
import ContentCard from './ContentCard'
import type { ContentTrail } from '../types/types'

interface ContentListProps {
  contents: ContentTrail[]
}

export default function ContentList({ contents }: ContentListProps) {
  if (contents.length === 0) {
    return (
      <Box data-testid="contents-empty-state">
        <EmptyState
          description="Tente ajustar a busca ou os filtros para encontrar outros conteúdos."
          title="Nenhum conteúdo encontrado"
        />
      </Box>
    )
  }

  return (
    <Box
      sx={{
        alignItems: 'stretch',
        display: 'grid',
        gap: { md: 2.5, xs: 2 },
        gridTemplateColumns: {
          md: 'repeat(3, minmax(0, 1fr))',
          xs: '1fr',
        },
        width: '100%',
      }}
    >
      {contents.map(content => (
        <ContentCard content={content} key={content.id} />
      ))}
    </Box>
  )
}
