import EmptyState from '@/shared/ui/EmptyState'
import AppCard from '@/shared/ui/AppCard'
import AppSubjectsTags from '@/shared/ui/AppSubjectsTags'
import ProgressBar from '@/shared/ui/ProgressBar'
import { getSubjectTheme } from '@/shared/utils/themes'
import ChatRoundedIcon from '@mui/icons-material/ChatRounded'
import {
  Box,
  Collapse,
  IconButton,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { useState } from 'react'
import type { KeyboardEvent, MouseEvent } from 'react'
import type {
  AdaptiveTrailSession,
  AdaptiveTrailStep,
  AdaptiveTrailSubStep,
} from '../../types/types'
import TrailChatPanel from './TrailChatPanel'
import TrailSearchBar from './TrailSearchBar'
import TrailStepItem from './TrailStepItem'

interface TrailCardProps {
  expandedBySearch: Set<string>
  expandedStepId: string | null
  filteredSteps: AdaptiveTrailStep[]
  isChatLocked?: boolean
  onAnswerSubStep: (
    step: AdaptiveTrailStep,
    subStep: AdaptiveTrailSubStep
  ) => void
  session: AdaptiveTrailSession
  onExpandStep: (step: AdaptiveTrailStep) => void
  onQueryChange: (query: string) => void
  query: string
  showSearch?: boolean
}

const CHAT_PANEL_WIDTH = 440

export default function TrailCard({
  expandedBySearch,
  expandedStepId,
  filteredSteps,
  isChatLocked = false,
  onAnswerSubStep,
  onExpandStep,
  onQueryChange,
  session,
  query,
  showSearch = true,
}: TrailCardProps) {
  const theme = useTheme()
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'))
  const isDark = theme.palette.mode === 'dark'
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false)

  const subjectTheme = getSubjectTheme(session?.subject, {
    mode: theme.palette.mode,
  })
  const progressValue = session.progress ?? 0

  function handleToggleDetails() {
    setIsDetailsExpanded(prev => !prev)
  }

  function handleSummaryKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    handleToggleDetails()
  }

  function handleToggleChat(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation()
    if (isChatLocked) return
    setIsChatOpen(prev => !prev)
  }

  return (
    <Box
      sx={{
        alignItems: 'stretch',
        display: 'flex',
        flexDirection: { lg: 'row', xs: 'column' },
        gap: 2,
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
        }}
      >
        <AppCard
          aria-label={`Trilha ${session.title}`}
          sx={{
            backgroundColor: 'background.paper',
            borderColor: alpha(subjectTheme.color, isDark ? 0.24 : 0.18),
            flex: 1,
            overflow: 'hidden',
          }}
          contentSx={{
            display: 'grid',
            gap: { md: 4, xs: 2.5 },
            p: { lg: 3, md: 2, xs: 2 },
          }}
        >
          <Box
            aria-controls={`trail-details-${session.id}`}
            aria-expanded={isDetailsExpanded}
            component="div"
            onClick={handleToggleDetails}
            onKeyDown={handleSummaryKeyDown}
            role="button"
            tabIndex={0}
            sx={{
              cursor: 'pointer',
              display: 'flex',
              flexDirection: { md: 'row', xs: 'column' },
              alignItems: { md: 'flex-start', xs: 'stretch' },
              justifyContent: 'space-between',
              gap: { md: 3, xs: 2 },
              outline: 0,
              '&:focus-visible': {
                borderRadius: 'var(--app-radius-control)',
                boxShadow: `0 0 0 3px ${alpha(subjectTheme.color, 0.28)}`,
              },
            }}
          >
            <Box sx={{ display: 'grid', flex: 1, gap: 1.5, minWidth: 0 }}>
              <AppSubjectsTags
                subjects={session.subject ? [session.subject] : []}
                size="sm"
              />
              <Typography
                component="h1"
                sx={{
                  color: 'text.primary',
                  fontSize: { md: 28, sm: 26, xs: 23 },
                  fontWeight: 700,
                  letterSpacing: 0,
                  lineHeight: 1,
                }}
              >
                {session.title}
              </Typography>
              <Typography
                sx={{
                  color: 'text.secondary',
                  fontSize: { md: 14, xs: 12 },
                  lineHeight: 1,
                  maxWidth: 860,
                }}
              >
                {session.description}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexShrink: 0,
                justifyContent: { md: 'flex-end', xs: 'flex-start' },
              }}
            >
              <IconButton
                aria-label={
                  isChatOpen ? 'Fechar chat da trilha' : 'Abrir chat da trilha'
                }
                aria-pressed={isChatOpen}
                disabled={isChatLocked}
                onClick={handleToggleChat}
                onKeyDown={event => event.stopPropagation()}
                sx={{
                  backgroundColor: isChatOpen
                    ? subjectTheme.color
                    : 'transparent',
                  border: '1px solid',
                  borderColor: subjectTheme.color,
                  borderRadius: 'var(--app-radius-control)',
                  color: isChatOpen ? '#fff' : subjectTheme.color,
                  textTransform: 'none',
                  height: 32,
                  width: 32,
                  '&:hover': {
                    backgroundColor: isChatOpen
                      ? subjectTheme.color
                      : subjectTheme.softSurface.backgroundColor,
                  },
                  '& .MuiSvgIcon-root': {
                    fontSize: 18,
                  },
                }}
              >
                <ChatRoundedIcon />
              </IconButton>
            </Box>
          </Box>

          <Box>
            <ProgressBar
              subject={session.subject}
              thickness={10}
              showValueLabel
              value={progressValue}
              valueLabelVariant="plain"
            />
          </Box>

          <Collapse
            id={`trail-details-${session.id}`}
            in={isDetailsExpanded}
            timeout={220}
            unmountOnExit
          >
            <Box sx={{ display: 'grid', gap: { md: 3, xs: 2 } }}>
              {showSearch && (
                <TrailSearchBar
                  onChange={onQueryChange}
                  query={query}
                  subjectColor={subjectTheme.color}
                  placeholder={'Busque por uma etapa da trilha'}
                />
              )}

              <Box sx={{ display: 'grid' }}>
                {filteredSteps.map((step, index) => (
                  <TrailStepItem
                    key={step.id}
                    isExpanded={
                      query.trim()
                        ? expandedBySearch.has(step.id)
                        : expandedStepId === step.id
                    }
                    isFirst={index === 0}
                    isLast={index === filteredSteps.length - 1}
                    prevStatus={
                      index > 0 ? filteredSteps[index - 1].status : undefined
                    }
                    onAnswerSubStep={onAnswerSubStep}
                    onExpand={onExpandStep}
                    searchQuery={query}
                    step={step}
                    subjectColor={subjectTheme.color}
                  />
                ))}
                {query.trim() && filteredSteps.length === 0 && (
                  <EmptyState
                    description="Tente outros termos de busca."
                    title="Nenhuma etapa encontrada"
                  />
                )}
              </Box>
            </Box>
          </Collapse>
        </AppCard>
      </Box>

      <Collapse
        in={isChatOpen && !isChatLocked}
        orientation={isLargeScreen ? 'horizontal' : 'vertical'}
        unmountOnExit
        sx={{
          '& .MuiCollapse-wrapperInner': { height: '100%' },
          '& .MuiCollapse-wrapper': { height: '100%' },
        }}
      >
        <Box
          sx={{
            height: '100%',
            width: { lg: CHAT_PANEL_WIDTH, xs: '100%' },
          }}
        >
          <TrailChatPanel
            subjectTheme={subjectTheme}
            subjectLabel={session.subject?.label ?? 'Trilha'}
          />
        </Box>
      </Collapse>
    </Box>
  )
}
