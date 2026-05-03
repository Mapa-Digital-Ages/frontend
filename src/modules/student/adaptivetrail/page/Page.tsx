import { Box, Typography, Stack, Button } from '@mui/material'
import { useState } from 'react'
import AppPageContainer from '@/shared/ui/AppPageContainer'
import PageHeader from '@/shared/ui/PageHeader'
import { SearchBarAndFilter } from '@/shared/ui/SearchBarAndFilter'
import AppCard from '@/shared/ui/AppCard'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import LayersIcon from '@mui/icons-material/Layers'
import { AppColors } from '@/app/theme/core/colors'
import { trails } from '../data/trails'

const filterOptions = [
  { label: 'Todos', value: 'all' },
  { label: 'Matemática', value: 'math' },
  { label: 'Português', value: 'portuguese' },
  { label: 'Ciências', value: 'science' },
  { label: 'História', value: 'history' },
]

const trailColorMap: Record<string, string> = {
  math: AppColors.light.primary,
  portuguese: AppColors.light.info,
  science: AppColors.light.success,
  history: AppColors.light.warning,
}

export default function Page() {
  const [query, setQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')

  const filteredTrails = trails.filter(trail => {
    const matchesQuery = trail.name.toLowerCase().includes(query.toLowerCase())
    const matchesCategory =
      selectedStatus === 'all' || trail.id === selectedStatus
    return matchesQuery && matchesCategory
  })

  const resultsSummary = {
    count: filteredTrails.length,
    singularLabel: 'resultado',
    pluralLabel: 'resultados',
  }

  return (
    <AppPageContainer className="gap-0">
      <PageHeader
        title="Continue sua trilha adaptativa na Mapa!"
        subtitle="Comece pelo primeiro nível e desbloqueie os próximos à medida que avança."
        variant="aluno"
      />

      <Box
        sx={{
          width: '100%',
          backgroundColor: 'background.paper',
          borderRadius: 2,
          p: { xs: 2, md: 3 },
        }}
      >
        <Stack spacing={2}>
          <SearchBarAndFilter
            filterOptions={filterOptions}
            onQueryChange={setQuery}
            onStatusChange={setSelectedStatus}
            query={query}
            resultsSummary={resultsSummary}
            searchPlaceholder="Pesquisar conteúdos..."
            selectedStatus={selectedStatus}
          />

          {/* FILTROS */}
          <Stack
            direction="row"
            spacing={1}
            sx={{ flexWrap: 'wrap', gap: 0.5 }}
          >
            {filterOptions.map(option => (
              <Button
                key={option.value}
                variant={
                  selectedStatus === option.value ? 'contained' : 'outlined'
                }
                onClick={() => setSelectedStatus(option.value)}
                sx={{
                  minWidth: 10,
                  maxWidth: 100,
                  borderRadius: '20px',
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  padding: '8px 16px',
                }}
              >
                {option.label}
              </Button>
            ))}
          </Stack>

          {/* GRID */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                lg: 'repeat(2, minmax(0, 1fr))',
              },
              gap: 2,
              mt: 2,
            }}
          >
            {filteredTrails.map(trail => (
              <AppCard
                key={trail.id}
                sx={{
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <Box sx={{ mb: 1.5 }}>
                  <Box
                    sx={{
                      backgroundColor: trailColorMap[trail.id] ?? trail.color,
                      color: 'white',
                      px: 1.2,
                      py: 0.3,
                      borderRadius: '999px',
                      fontSize: 11,
                      fontWeight: 500,
                      width: 'fit-content',
                    }}
                  >
                    {trail.category}
                  </Box>
                </Box>

                {/* TÍTULO */}
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, fontSize: 15, mb: 0.5 }}
                >
                  {trail.name}
                </Typography>

                {/* DESCRIÇÃO */}
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', mb: 1.5, minHeight: 40 }}
                >
                  {trail.description}
                </Typography>

                {/* INFO */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 1,
                    mb: 1.5,
                    alignItems: 'center',
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{
                      border: '1px solid',
                      borderColor: 'background.border',
                      borderRadius: 1,
                      px: 1,
                      py: 0.75,
                      flex: 1,
                    }}
                  >
                    <LayersIcon
                      sx={{ fontSize: 14, color: 'text.secondary' }}
                    />
                    <Typography variant="caption">
                      {trail.steps} {trail.steps === 1 ? 'etapa' : 'etapas'}
                    </Typography>
                  </Stack>

                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{
                      border: '1px solid',
                      borderColor: 'background.border',
                      borderRadius: 1,
                      px: 1,
                      py: 0.75,
                      flex: 1,
                    }}
                  >
                    <AccessTimeIcon
                      sx={{ fontSize: 14, color: 'text.secondary' }}
                    />
                    <Typography variant="caption">
                      {trail.timeEstimate}
                    </Typography>
                  </Stack>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 1,
                  }}
                >
                  <Typography variant="caption" sx={{ fontSize: 12 }}>
                    {trail.completed}/{trail.steps} etapas
                  </Typography>
                  <Typography variant="caption" sx={{ fontSize: 12 }}>
                    {trail.progress}%
                  </Typography>
                </Box>

                <Box>
                  <Box
                    sx={{
                      height: 6,
                      backgroundColor: 'background.default',
                      borderRadius: 3,
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        height: '100%',
                        width: `${trail.progress}%`,
                        backgroundColor: trailColorMap[trail.id] ?? trail.color,
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </Box>
                </Box>
              </AppCard>
            ))}
          </Box>
        </Stack>
      </Box>
    </AppPageContainer>
  )
}
