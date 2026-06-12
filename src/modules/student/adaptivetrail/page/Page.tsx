import { Box, Stack } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import AppPageContainer from '@/shared/ui/AppPageContainer'
import OrdinaryHeader from '@/shared/ui/OrdinaryHeader'
import Pagination from '@/shared/ui/Pagination'
import { SearchBarAndFilter } from '@/shared/ui/SearchBarAndFilter'
import {
  fetchTrails,
  getTrailMetrics,
  groupTrailsBySubject,
  type Trail,
} from '../data/trails'
import { studentService } from '../services/service'
import TrailList from '../components/TrailList'
import MetricsCard from '@/shared/ui/MetricsCard'
import LoadingScreen from '@/shared/ui/LoadingScreen'
import EmptyState from '@/shared/ui/EmptyState'

const TRAILS_PER_PAGE = 10

function normalizeText(value: string) {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

export default function Page() {
  const [trails, setTrails] = useState<Trail[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    let active = true
    async function load() {
      const studentId = studentService.getStudentId()
      if (!studentId) {
        if (active) {
          setError('Usuário não autenticado.')
          setIsLoading(false)
        }
        return
      }
      try {
        const data = await fetchTrails(studentId)
        if (active) setTrails(data)
      } catch {
        if (active) setError('Não foi possível carregar as trilhas.')
      } finally {
        if (active) setIsLoading(false)
      }
    }
    void load()
    return () => {
      active = false
    }
  }, [])

  const metricCards = useMemo(() => getTrailMetrics(trails), [trails])

  const filteredTrails = useMemo(() => {
    const normalizedQuery = normalizeText(query.trim())
    return trails.filter(trail => {
      const searchableText = normalizeText(
        [trail.name, trail.subject?.label, trail.description].join(' ')
      )
      return (
        normalizedQuery.length === 0 || searchableText.includes(normalizedQuery)
      )
    })
  }, [query, trails])

  const subjectGroups = useMemo(
    () => groupTrailsBySubject(filteredTrails),
    [filteredTrails]
  )

  const totalPages = Math.max(
    1,
    Math.ceil(subjectGroups.length / TRAILS_PER_PAGE)
  )
  const activePage = Math.min(currentPage, totalPages)
  const pageStartIndex = (activePage - 1) * TRAILS_PER_PAGE
  const visibleGroups = subjectGroups.slice(
    pageStartIndex,
    pageStartIndex + TRAILS_PER_PAGE
  )

  function handleQueryChange(nextQuery: string) {
    setQuery(nextQuery)
    setCurrentPage(1)
  }

  if (isLoading) return <LoadingScreen />

  if (error) {
    return (
      <AppPageContainer>
        <EmptyState title="Erro ao carregar trilhas" description={error} />
      </AppPageContainer>
    )
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
            onQueryChange={handleQueryChange}
            query={query}
            resultsSummary={{
              count: subjectGroups.length,
              singularLabel: 'matéria',
              pluralLabel: 'matérias',
            }}
            searchPlaceholder="Pesquisar trilhas..."
          />
          <TrailList groups={visibleGroups} />
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
