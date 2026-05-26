import React from 'react'
import { Box, IconButton, Stack, Typography } from '@mui/material'
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied'
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied'
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied'
import NotInterestedIcon from '@mui/icons-material/NotInterested'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { useState } from 'react'
import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import 'dayjs/locale/pt-br'
import type { WeeklyMoodEntry } from '@/shared/types/common'
import AppTags from '@/shared/ui/AppTags'
import { useTheme } from '@mui/material/styles'
import { getRolePalette } from '@/app/theme/core/roles'
import { useParentRole } from '@/modules/parent/shared/hooks/useParentRole'

dayjs.locale('pt-br')
dayjs.extend(isoWeek)

const DAY_LABELS: Record<string, string> = {
  '1': 'Seg',
  '2': 'Ter',
  '3': 'Qua',
  '4': 'Qui',
  '5': 'Sex',
  '6': 'Sáb',
  '0': 'Dom',
}

type Mood = WeeklyMoodEntry['mood']
type SummaryPhrase = { text: string; mood: 'good' | 'bad' | 'regular' }

const moodConfig: Record<
  NonNullable<Mood>,
  { icon: (size: number) => React.ReactNode; color: string }
> = {
  good: {
    icon: size => (
      <SentimentVerySatisfiedIcon sx={{ fontSize: size, color: '#22c55e' }} />
    ),
    color: '#22c55e',
  },
  regular: {
    icon: size => (
      <SentimentSatisfiedIcon sx={{ fontSize: size, color: '#eab308' }} />
    ),
    color: '#eab308',
  },
  bad: {
    icon: size => (
      <SentimentVeryDissatisfiedIcon
        sx={{ fontSize: size, color: '#ef4444' }}
      />
    ),
    color: '#ef4444',
  },
}

const moodPhraseStyle: Record<
  SummaryPhrase['mood'],
  { border: string; bg: string; color: string }
> = {
  good: {
    border: 'rgba(34,197,94,0.35)',
    bg: 'rgba(34,197,94,0.08)',
    color: '#22c55e',
  },
  regular: {
    border: 'rgba(234,179,8,0.35)',
    bg: 'rgba(234,179,8,0.08)',
    color: '#eab308',
  },
  bad: {
    border: 'rgba(239,68,68,0.35)',
    bg: 'rgba(239,68,68,0.08)',
    color: '#ef4444',
  },
}

function MoodDayCell({ mood, dayLabel }: { mood: Mood; dayLabel: string }) {
  const config = mood ? moodConfig[mood] : null
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0.75,
        flex: 1,
        minWidth: 0,
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.1s ease',
          '&:hover': { transform: 'scale(1.08)' },
        }}
      >
        {config ? (
          config.icon(22)
        ) : (
          <NotInterestedIcon
            sx={{ fontSize: 20, color: 'text.disabled', opacity: 0.35 }}
          />
        )}
      </Box>
      <Typography
        sx={{
          fontSize: '10px',
          fontWeight: 500,
          color: 'text.disabled',
          letterSpacing: '0.02em',
          lineHeight: 1,
        }}
      >
        {dayLabel}
      </Typography>
    </Box>
  )
}

function buildSummaryPhrases(entries: WeeklyMoodEntry[]): SummaryPhrase[] {
  const phrases: SummaryPhrase[] = []
  const withMood = entries.filter(e => e.mood !== null)
  if (withMood.length === 0) return phrases

  const goodCount = withMood.filter(e => e.mood === 'good').length
  if (goodCount >= Math.ceil(withMood.length / 2)) {
    phrases.push({
      text: 'Humor positivo na maior parte da semana',
      mood: 'good',
    })
  }

  const badEntry = entries.find(e => e.mood === 'bad')
  if (badEntry) {
    const dayOfWeek = dayjs(badEntry.date).day().toString()
    const dayName = DAY_LABELS[dayOfWeek] ?? dayjs(badEntry.date).format('ddd')
    phrases.push({
      text: `Queda de motivação detectada na ${dayName}`,
      mood: 'bad',
    })
  }

  return phrases.slice(0, 2)
}

function groupByIsoWeek(
  entries: WeeklyMoodEntry[]
): Map<string, WeeklyMoodEntry[]> {
  const map = new Map<string, WeeklyMoodEntry[]>()
  for (const entry of entries) {
    const date = dayjs(entry.date)
    const key = `${date.isoWeekYear()}-W${String(date.isoWeek()).padStart(2, '0')}`
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(entry)
  }
  return map
}

function isoWeekToMonday(weekKey: string): dayjs.Dayjs {
  const [yearStr, weekStr] = weekKey.split('-W')
  const year = parseInt(yearStr, 10)
  const week = parseInt(weekStr, 10)
  const jan4 = dayjs(new Date(year, 0, 4))
  return jan4.startOf('isoWeek').add(week - 1, 'week')
}

function getWeekLabel(weekKey: string): string {
  const monday = isoWeekToMonday(weekKey)
  const friday = monday.add(4, 'day')
  if (monday.month() === friday.month()) {
    return `${monday.format('D')} – ${friday.format('D MMM')}`
  }
  return `${monday.format('D MMM')} – ${friday.format('D MMM')}`
}

interface ParentEmotionalSummaryProps {
  wellBeing?: WeeklyMoodEntry[]
}

export default function ParentEmotionalSummary({
  wellBeing = [],
}: ParentEmotionalSummaryProps) {
  const [weekIndex, setWeekIndex] = useState(0)

  const weekMap = groupByIsoWeek(wellBeing)
  const weekKeys = Array.from(weekMap.keys()).sort((a, b) => (a > b ? -1 : 1))

  const today = dayjs()
  const currentWeekKey =
    weekKeys[weekIndex] ??
    `${today.isoWeekYear()}-W${String(today.isoWeek()).padStart(2, '0')}`
  const currentEntries = weekMap.get(currentWeekKey) ?? []
  const theme = useTheme()
  const role = useParentRole()
  const rolePalette = getRolePalette(theme, role)

  const monday =
    weekKeys.length > 0
      ? isoWeekToMonday(currentWeekKey)
      : dayjs().startOf('isoWeek')

  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const date = monday.add(i, 'day')
    const entry = currentEntries.find(e => e.date === date.format('YYYY-MM-DD'))
    return { date, mood: entry?.mood ?? null }
  })

  const phrases = buildSummaryPhrases(currentEntries)
  const canGoPrev = weekIndex < weekKeys.length - 1
  const canGoNext = weekIndex > 0
  const weekLabel = weekKeys.length > 0 ? getWeekLabel(currentWeekKey) : null

  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: 'background.border',
        borderRadius: 'var(--app-radius-card)',
        p: 3,
        width: '100%',
        position: 'relative',
        '&:hover .week-nav-btn': {
          opacity: 1,
          pointerEvents: 'auto',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          mb: 2.5,
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 'bold', color: 'text.primary', lineHeight: 1.3 }}
        >
          Resumo Socioemocional
        </Typography>
        {weekLabel && (
          <AppTags
            size="sm"
            tags={[
              {
                id: currentWeekKey,
                label: weekLabel,
                color: rolePalette.primary,
                contrastColor: rolePalette.primary,
              },
            ]}
          />
        )}
      </Box>

      <Box sx={{ position: 'relative', mb: 2.5 }}>
        <IconButton
          className="week-nav-btn"
          disabled={!canGoPrev}
          onClick={() => setWeekIndex(i => i + 1)}
          aria-label="Semana anterior"
          sx={{
            position: 'absolute',
            left: -14,
            top: '40%',
            transform: 'translateY(-50%)',
            zIndex: 1,
            opacity: 0,
            pointerEvents: 'none',
            transition: 'opacity 0.15s ease',
            backgroundColor: 'background.paper',
            width: 24,
            height: 24,
            color: canGoPrev ? 'text.primary' : 'text.disabled',
            '&:hover': { backgroundColor: 'action.hover' },
            '&.Mui-disabled': { opacity: '0 !important' },
          }}
        >
          <ChevronLeftIcon sx={{ fontSize: 16 }} />
        </IconButton>

        <Stack direction="row" justifyContent="space-between" sx={{ gap: 0.5 }}>
          {weekDays.map(({ date, mood }) => (
            <MoodDayCell
              key={date.toString()}
              mood={mood}
              dayLabel={DAY_LABELS[date.day().toString()] ?? ''}
            />
          ))}
        </Stack>

        <IconButton
          className="week-nav-btn"
          size="small"
          disabled={!canGoNext}
          onClick={() => setWeekIndex(i => i - 1)}
          aria-label="Próxima semana"
          sx={{
            position: 'absolute',
            right: -14,
            top: '40%',
            transform: 'translateY(-50%)',
            zIndex: 1,
            opacity: 0,
            pointerEvents: 'none',
            transition: 'opacity 0.15s ease',
            backgroundColor: 'background.paper',
            width: 24,
            height: 24,
            color: canGoNext ? 'text.primary' : 'text.disabled',
            '&:hover': { backgroundColor: 'action.hover' },
            '&.Mui-disabled': { opacity: '0 !important' },
          }}
        >
          <ChevronRightIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>

      {phrases.length === 0 ? (
        <Box
          sx={{
            backgroundColor: 'var(--app-surface-muted)',
            border: '1px solid var(--app-border)',
            borderRadius: '10px',
            px: 2,
            py: 1,
          }}
        >
          <Typography variant="body2" sx={{ color: 'text.disabled' }}>
            Sem registros de humor nessa semana
          </Typography>
        </Box>
      ) : (
        phrases.map(phrase => {
          const style = moodPhraseStyle[phrase.mood]
          return (
            <Box
              key={phrase.text}
              sx={{
                backgroundColor: style.bg,
                border: `1px solid ${style.border}`,
                borderRadius: '10px',
                mb: 1,
                px: 2,
                py: 1,
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: style.color, fontWeight: 500 }}
              >
                {phrase.text}
              </Typography>
            </Box>
          )
        })
      )}
    </Box>
  )
}
