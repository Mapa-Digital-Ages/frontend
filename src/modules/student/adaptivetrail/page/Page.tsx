import { Box, Stack } from '@mui/material'
import { useMemo, useState } from 'react'
import { SUBJECTS } from '@/shared/utils/themes'
import AppPageContainer from '@/shared/ui/AppPageContainer'
import OrdinaryHeader from '@/shared/ui/OrdinaryHeader'
import Pagination from '@/shared/ui/Pagination'
import { SearchBarAndFilter } from '@/shared/ui/SearchBarAndFilter'
import { trails, getTrailMetrics } from '../data/trails'
import TrailFilterBar from '../components/TrailFilterBar'
import TrailList from '../components/TrailList'
import type { FilterOption } from '../types/types'
import MetricsCard from '@/shared/ui/MetricsCard'

const filterOptions: FilterOption[] = [
  { label: 'Todos', value: 'all', subject: null },
  { label: 'Matemática', value: 'mathematics', subject: SUBJECTS.matematica },
  { label: 'Português', value: 'portuguese', subject: SUBJECTS.portugues },
  { label: 'Ciências', value: 'science', subject: SUBJECTS.ciencias },
  { label: 'História', value: 'history', subject: SUBJECTS.historia },
]

const TRAILS_PER_PAGE = 10

function normalizeText(value: string) {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

export default function Page() {
  const [query, setQuery] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const metricCards = useMemo(() => getTrailMetrics(), [])

  const filteredTrails = useMemo(() => {
    const normalizedQuery = normalizeText(query.trim())

    return trails.filter(trail => {
      const searchableText = normalizeText(
        [trail.name, trail.subject?.label, trail.description].join(' ')
      )
      const matchesQuery =
        normalizedQuery.length === 0 || searchableText.includes(normalizedQuery)
      const matchesSubject =
        selectedSubject === 'all' || trail.subject?.id === selectedSubject

      return matchesQuery && matchesSubject
    })
  }, [query, selectedSubject])

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTrails.length / TRAILS_PER_PAGE)
  )
  const activePage = Math.min(currentPage, totalPages)
  const pageStartIndex = (activePage - 1) * TRAILS_PER_PAGE
  const visibleTrails = filteredTrails.slice(
    pageStartIndex,
    pageStartIndex + TRAILS_PER_PAGE
  )
  const resultsSummary = {
    count: filteredTrails.length,
    singularLabel: 'resultado',
    pluralLabel: 'resultados',
  }

  function handleQueryChange(nextQuery: string) {
    setQuery(nextQuery)
    setCurrentPage(1)
  }

  function handleSubjectChange(subject: string) {
    setSelectedSubject(subject)
    setCurrentPage(1)
  }

  return (
    <AppPageContainer className="gap-4 md:gap-5">
      <OrdinaryHeader
        title="Trilhas Adaptativas"
        subtitle="Misture descoberta de conteúdos com jornadas por matéria: o aluno pode manter várias trilhas ativas ao mesmo tempo, cada uma com progresso próprio."
      />

      <Box className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 xl:grid-cols-4">
        {metricCards.map(card => (
          <MetricsCard key={card.id} title={card.title} value={card.value} />
        ))}
      </Box>

      <Box
        sx={{
          backgroundColor: 'background.paper',
          border: '1px solid',
          borderColor: 'background.border',
          borderRadius: '22px',
          display: 'flex',
          flexDirection: 'column',
          minHeight: { lg: 610, xs: 'auto' },
          p: { md: 2, xs: 1.5 },
          width: '100%',
        }}
      >
        <Stack spacing={2}>
          <SearchBarAndFilter
            filterOptions={filterOptions}
            onQueryChange={handleQueryChange}
            onStatusChange={handleSubjectChange}
            query={query}
            resultsSummary={resultsSummary}
            searchPlaceholder="Pesquisar conteúdos..."
            selectedStatus={selectedSubject}
          />

          <TrailFilterBar
            options={filterOptions}
            selectedValue={selectedSubject}
            onSelect={handleSubjectChange}
          />

          <TrailList trails={visibleTrails} />
        </Stack>

        <Box sx={{ mt: 'auto', pt: { md: 2, xs: 1.5 }, width: '100%' }}>
          <Pagination
            currentPage={activePage}
            onPageChange={setCurrentPage}
            role="aluno"
            totalPages={totalPages}
          />
        </Box>
      </Box>
    </AppPageContainer>
  )
}
