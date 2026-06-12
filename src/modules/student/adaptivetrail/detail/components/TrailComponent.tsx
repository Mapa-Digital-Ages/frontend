import { Box, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { useCallback, useMemo, useState } from 'react'
import AppSubjectsTags from '@/shared/ui/AppSubjectsTags'
import EmptyState from '@/shared/ui/EmptyState'
import { getSubjectTheme } from '@/shared/utils/themes'
import { filterTrailSteps } from '../../hooks/useTrailSearch'
import type {
  AdaptiveTrailSession,
  AdaptiveTrailStep,
  AdaptiveTrailSubStep,
} from '../../types/types'
import TrailCard from './TrailCard'
import TrailSearchBar from './TrailSearchBar'
import AppCard from '@/shared/ui/AppCard'
import Pagination from '@/shared/ui/Pagination'

const TRAIL_CARDS_PER_PAGE = 1

interface TrailComponentProps {
  emptyDescription?: string
  emptyTitle?: string
  onAnswerSubStep: (
    trailId: string,
    step: AdaptiveTrailStep,
    subStep: AdaptiveTrailSubStep
  ) => void
  sessions: AdaptiveTrailSession[]
}

interface TrailComponentItemProps {
  onAnswerSubStep: (
    trailId: string,
    step: AdaptiveTrailStep,
    subStep: AdaptiveTrailSubStep
  ) => void
  onQueryChange: (query: string) => void
  query: string
  session: AdaptiveTrailSession
}

function getActiveStepId(session: AdaptiveTrailSession): string | null {
  return session.steps.find(step => step.status === 'available')?.id ?? null
}

function trailMatchesQuery(session: AdaptiveTrailSession, query: string) {
  const normalizedQuery = query.trim().toLowerCase()
  if (!normalizedQuery) return true

  const searchableFields = [
    session.title,
    session.description,
    session.subject?.label,
    ...session.steps.flatMap(step => [
      step.title,
      step.description ?? '',
      ...step.subSteps.flatMap(subStep => [subStep.title, subStep.description]),
    ]),
  ]

  return searchableFields.some(field =>
    field.toLowerCase().includes(normalizedQuery)
  )
}

function TrailComponentItem({
  onAnswerSubStep,
  onQueryChange,
  query,
  session,
}: TrailComponentItemProps) {
  const [selectedStepId, setSelectedStepId] = useState<
    string | null | undefined
  >(undefined)
  const { filteredSteps, expandedBySearch } = useMemo(
    () => filterTrailSteps(session.steps, query),
    [session.steps, query]
  )

  const expandedStepId = useMemo(() => {
    if (selectedStepId === null) return null

    const selectedStep = session.steps.find(step => step.id === selectedStepId)
    if (selectedStep && selectedStep.status !== 'locked') return selectedStep.id

    return getActiveStepId(session)
  }, [session, selectedStepId])

  const handleExpandStep = useCallback((step: AdaptiveTrailStep) => {
    if (step.status === 'locked') return
    setSelectedStepId(current => (current === step.id ? null : step.id))
  }, [])

  const handleAnswerSubStep = useCallback(
    (step: AdaptiveTrailStep, subStep: AdaptiveTrailSubStep) => {
      onAnswerSubStep(session.id, step, subStep)
    },
    [onAnswerSubStep, session.id]
  )

  return (
    <TrailCard
      expandedBySearch={expandedBySearch}
      expandedStepId={expandedStepId}
      filteredSteps={filteredSteps}
      onAnswerSubStep={handleAnswerSubStep}
      onExpandStep={handleExpandStep}
      onQueryChange={onQueryChange}
      query={query}
      session={session}
      showSearch={true}
    />
  )
}

export default function TrailComponent({
  emptyDescription = 'Nenhuma trilha adaptativa disponível no momento.',
  emptyTitle = 'Nenhuma trilha encontrada',
  onAnswerSubStep,
  sessions,
}: TrailComponentProps) {
  const theme = useTheme()
  const [query, setQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const subject = sessions[0]?.subject
  const subjectTheme = getSubjectTheme(subject, { mode: theme.palette.mode })
  const isDark = theme.palette.mode === 'dark'

  const visibleSessions = useMemo(
    () => sessions.filter(session => trailMatchesQuery(session, query)),
    [sessions, query]
  )
  const totalPages = Math.max(
    1,
    Math.ceil(visibleSessions.length / TRAIL_CARDS_PER_PAGE)
  )
  const activePage = Math.min(currentPage, totalPages)
  const pageStartIndex = (activePage - 1) * TRAIL_CARDS_PER_PAGE
  const paginatedSessions = visibleSessions.slice(
    pageStartIndex,
    pageStartIndex + TRAIL_CARDS_PER_PAGE
  )

  const handleQueryChange = useCallback((nextQuery: string) => {
    setQuery(nextQuery)
    setCurrentPage(1)
  }, [])

  if (sessions.length === 0) {
    return <EmptyState description={emptyDescription} title={emptyTitle} />
  }

  return (
    <AppCard
      aria-label="Trilhas adaptativas da matéria"
      component="section"
      sx={{
        backgroundColor: 'background.paper',
        borderColor: alpha(subjectTheme.color, isDark ? 0.24 : 0.18),
        flex: 1,
        overflow: 'hidden',
      }}
      contentSx={{
        display: 'grid',
        gap: { md: 3, xs: 2.5 },
        p: { lg: 3, md: 2, xs: 2 },
      }}
    >
      <Box sx={{ display: 'grid', gap: 1, minWidth: 0 }}>
        <AppSubjectsTags subjects={subject ? [subject] : []} size="sm" />
        <Typography
          component="h1"
          sx={{
            color: 'text.primary',
            fontSize: { md: 28, sm: 26, xs: 23 },
            fontWeight: 700,
            letterSpacing: 0,
            lineHeight: 1.08,
          }}
        >
          Trilhas adaptativas de {subject?.label ?? 'Geral'}
        </Typography>
        <Typography
          sx={{
            color: 'text.secondary',
            fontSize: { md: 14, xs: 12 },
            lineHeight: 1.55,
            maxWidth: 860,
          }}
        >
          Acompanhe e avance nas trilhas disponíveis para esta matéria.
        </Typography>
      </Box>

      <TrailSearchBar
        onChange={handleQueryChange}
        query={query}
        subjectColor={subjectTheme.color}
        placeholder={'Busque por uma trilha'}
      />

      <Box sx={{ display: 'grid', gap: { md: 2.5, xs: 2 } }}>
        {paginatedSessions.map(session => (
          <TrailComponentItem
            key={session.id}
            onAnswerSubStep={onAnswerSubStep}
            onQueryChange={handleQueryChange}
            query={query}
            session={session}
          />
        ))}
        {visibleSessions.length === 0 && (
          <EmptyState
            description="Tente buscar por outro nome, etapa ou sub-etapa."
            title="Nenhuma trilha encontrada"
          />
        )}
      </Box>
      {totalPages > 1 && (
        <Pagination
          currentPage={activePage}
          onPageChange={setCurrentPage}
          totalPages={totalPages}
          role="aluno"
        />
      )}
    </AppCard>
  )
}
