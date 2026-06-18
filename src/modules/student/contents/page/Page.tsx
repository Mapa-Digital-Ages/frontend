import { Box, Stack } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import AppPageContainer from '@/shared/ui/AppPageContainer'
import OrdinaryHeader from '@/shared/ui/OrdinaryHeader'
import Pagination from '@/shared/ui/Pagination'
import { SearchBarAndFilter } from '@/shared/ui/SearchBarAndFilter'
import SubjectFilterBar from '@/modules/student/shared/components/SubjectFilterBar'
import ContentBanner from '../components/ContentBanner'
import ContentList from '../components/ContentList'
import { getContentFilterOptions } from '../data/contents'
import { contentsService } from '../services/service'
import type { ContentTrail } from '../types/types'

const CONTENTS_PER_PAGE = 9

function normalizeText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

export default function Page() {
  const [contents, setContents] = useState<ContentTrail[]>([])
  const [query, setQuery] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)

  const filterOptions = useMemo(() => getContentFilterOptions(), [])

  useEffect(() => {
    let isActive = true

    contentsService.getContents().then(result => {
      if (isActive) {
        setContents(result)
      }
    })

    return () => {
      isActive = false
    }
  }, [])

  const filteredContents = useMemo(() => {
    const normalizedQuery = normalizeText(query.trim())

    return contents.filter(content => {
      const matchesSubject =
        selectedSubject === 'all' || content.subject?.id === selectedSubject

      const searchableText = normalizeText(content.name)

      const matchesQuery =
        normalizedQuery.length === 0 || searchableText.includes(normalizedQuery)

      return matchesSubject && matchesQuery
    })
  }, [contents, query, selectedSubject])

  const totalPages = Math.max(
    1,
    Math.ceil(filteredContents.length / CONTENTS_PER_PAGE)
  )
  const activePage = Math.min(currentPage, totalPages)
  const pageStartIndex = (activePage - 1) * CONTENTS_PER_PAGE
  const visibleContents = filteredContents.slice(
    pageStartIndex,
    pageStartIndex + CONTENTS_PER_PAGE
  )

  function handleQueryChange(nextQuery: string) {
    setQuery(nextQuery)
    setCurrentPage(1)
  }

  function handleSubjectChange(nextSubject: string) {
    setSelectedSubject(nextSubject)
    setCurrentPage(1)
  }

  return (
    <AppPageContainer className="gap-4 md:gap-5">
      <OrdinaryHeader
        title="Conteúdos"
        subtitle="Misture descoberta de conteúdos com jornadas por matéria: o aluno pode manter várias trilhas ativas ao mesmo tempo, cada uma com progresso próprio."
      />

      <Box
        sx={{
          backgroundColor: 'background.paper',
          border: '1px solid',
          borderColor: 'background.border',
          borderRadius: '22px',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          p: { md: 2, xs: 1.5 },
          width: '100%',
        }}
      >
        <SearchBarAndFilter
          onQueryChange={handleQueryChange}
          query={query}
          resultsSummary={{
            count: filteredContents.length,
            singularLabel: 'resultado',
            pluralLabel: 'resultados',
          }}
          searchPlaceholder="Pesquisar conteúdos..."
        />

        <SubjectFilterBar
          ariaLabel="Filtrar conteúdos por matéria"
          onSelect={handleSubjectChange}
          options={filterOptions}
          selectedValue={selectedSubject}
          testIdPrefix="content-filter"
        />

        <ContentBanner />

        <Stack spacing={2}>
          <ContentList contents={visibleContents} />
        </Stack>

        <Box sx={{ pt: { md: 1, xs: 0.5 }, width: '100%' }}>
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
