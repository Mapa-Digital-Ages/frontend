import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import {
  Box,
  Button,
  type ButtonProps,
  Card,
  CardContent,
  Stack,
  Typography,
} from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import React from 'react'
import type { ReactNode } from 'react'
import { AppSubjectTag } from './AppSubjectsTags'
import { getSubjectTheme, type SubjectTheme } from '../../utils/themes'
import type { SubjectContext } from '../../types/common'
import ProgressBar from './ProgressBar'

interface OnboardingQuestionOption {
  id: string
  label: string
}

interface OnboardingQuestionCardProps {
  backButtonProps?: ButtonProps
  currentQuestion: number
  disableNext?: boolean
  disablePreviousQuestion?: boolean
  nextButtonProps?: ButtonProps
  onBack?: () => void
  onNext?: () => void
  onPreviousQuestion?: () => void
  onSelectOption?: (optionId: string) => void
  nextButtonLabel?: string
  options: OnboardingQuestionOption[]
  previousQuestionButtonProps?: ButtonProps
  previousQuestionLabel?: string
  progress: number
  question: string
  questionOrderLabel: string
  selectedOptionId?: string
  subject: SubjectContext
  subjectBadgeSlot?: (params: {
    subject: SubjectContext
    subjectTheme: SubjectTheme
  }) => ReactNode
  title?: string
  totalQuestions: number
}

function OnboardingQuestionCard({
  backButtonProps,
  currentQuestion,
  disableNext = false,
  disablePreviousQuestion = false,
  nextButtonProps,
  onBack,
  onNext,
  onPreviousQuestion,
  onSelectOption,
  nextButtonLabel = 'Próxima questão',
  options,
  previousQuestionButtonProps,
  previousQuestionLabel = 'Questão anterior',
  progress,
  question,
  questionOrderLabel,
  selectedOptionId,
  subject,
  subjectBadgeSlot,
  title = 'Questionário de Nivelamento',
  totalQuestions,
}: OnboardingQuestionCardProps) {
  const theme = useTheme()
  const subjectTheme = getSubjectTheme(subject, { mode: theme.palette.mode })
  const completionLabel = `${currentQuestion} / ${totalQuestions} questão(ões) - ${Math.round(progress)}% concluído`
  const subjectBadge = subjectBadgeSlot?.({ subject, subjectTheme }) ?? (
    <AppSubjectTag subject={subject} size="sm" />
  )

  return (
    <Card
      sx={{
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${subjectTheme.border.borderColor}`,
        borderRadius: 'var(--app-radius-card)',
        boxShadow: '0 12px 30px rgba(16, 24, 40, 0.04)',
        maxWidth: 768,
      }}
    >
      <CardContent
        sx={{
          display: 'grid',
          gap: { md: 3, xs: 2.5 },
          p: { md: 4, xs: 2.5 },
        }}
      >
        <Box>
          <Button
            {...backButtonProps}
            onClick={onBack}
            size="small"
            startIcon={<ArrowBackIosNewRoundedIcon sx={{ fontSize: 14 }} />}
            sx={{
              borderColor: subjectTheme.border.borderColor,
              borderRadius: 'var(--app-radius-pill)',
              color: subjectTheme.mutedText.color,
            }}
            variant="outlined"
          >
            Voltar
          </Button>
        </Box>

        <Stack spacing={1}>
          <Typography
            sx={{
              color: subjectTheme.text.color,
              fontSize: { md: 24, xs: 20 },
              fontWeight: 700,
              lineHeight: 1.2,
            }}
          >
            {title}
          </Typography>
          <Stack
            direction={{ sm: 'row', xs: 'column' }}
            spacing={1}
            sx={{ alignItems: { sm: 'center', xs: 'flex-start' } }}
          >
            <Typography
              sx={{ color: subjectTheme.mutedText.color, fontSize: 13 }}
            >
              Disciplina:
            </Typography>
            {subjectBadge}
          </Stack>
        </Stack>

        <Box
          sx={{
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${subjectTheme.border.borderColor}`,
            borderRadius: 'var(--app-radius-control)',
            display: 'grid',
            gap: 1,
            px: { md: 2.25, xs: 1.5 },
            py: { md: 1.75, xs: 1.5 },
          }}
        >
          <ProgressBar
            showValueLabel
            subject={subject}
            thickness={8}
            value={progress}
            valueLabel={completionLabel}
            valueLabelVariant="soft"
          />
        </Box>

        <Box
          sx={{
            backgroundColor: subjectTheme.softSurface.backgroundColor,
            border: `1px solid ${subjectTheme.softSurface.borderColor}`,
            borderRadius: '16px',
            display: 'grid',
            gap: 2,
            p: { md: 3, xs: 2 },
          }}
        >
          <Stack
            direction={{ sm: 'row', xs: 'column' }}
            spacing={{ sm: 2, xs: 1.5 }}
            sx={{ justifyContent: 'space-between' }}
          >
            <Stack spacing={1}>
              <Box sx={{ alignSelf: 'flex-start' }}>{subjectBadge}</Box>
              <Typography
                sx={{
                  color: subjectTheme.text.color,
                  fontSize: { md: 22, xs: 18 },
                  fontWeight: 700,
                  lineHeight: 1.2,
                }}
              >
                {question}
              </Typography>
            </Stack>
            <Typography
              sx={{
                backgroundColor:
                  theme.palette.mode === 'dark'
                    ? alpha(theme.palette.background.paper, 0.72)
                    : subjectTheme.badge.backgroundColor,
                border: `1px solid ${alpha(subjectTheme.color, theme.palette.mode === 'dark' ? 0.4 : 0.28)}`,
                borderRadius: 'var(--app-radius-pill)',
                color: subjectTheme.color,
                fontSize: { md: 17, xs: 14 },
                fontWeight: 700,
                height: 'fit-content',
                lineHeight: 1,
                p: 1,
                whiteSpace: 'nowrap',
              }}
            >
              {questionOrderLabel}
            </Typography>
          </Stack>

          <Stack spacing={2}>
            {options.map(option => {
              const isSelected = option.id === selectedOptionId

              return (
                <Button
                  aria-pressed={isSelected}
                  key={option.id}
                  onClick={() => onSelectOption?.(option.id)}
                  sx={{
                    backgroundColor: isSelected
                      ? subjectTheme.optionSelected.backgroundColor
                      : subjectTheme.option.backgroundColor,
                    borderColor: isSelected
                      ? subjectTheme.optionSelected.borderColor
                      : subjectTheme.option.borderColor,
                    borderRadius: 'var(--app-radius-control)',
                    color: isSelected
                      ? subjectTheme.optionSelected.color
                      : subjectTheme.option.color,
                    justifyContent: 'flex-start',
                    minHeight: 48,
                    px: 2,
                    py: 1.25,
                    textAlign: 'left',
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor:
                        subjectTheme.optionSelected.backgroundColor,
                      borderColor: subjectTheme.color,
                    },
                  }}
                  variant="outlined"
                >
                  {option.label}
                </Button>
              )
            })}
          </Stack>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gap: 1.25,
            gridTemplateColumns: { sm: 'repeat(2, minmax(0, 1fr))', xs: '1fr' },
          }}
        >
          <Button
            {...previousQuestionButtonProps}
            disabled={disablePreviousQuestion}
            onClick={onPreviousQuestion}
            startIcon={<ArrowBackRoundedIcon />}
            sx={{
              borderColor: subjectTheme.border.borderColor,
              borderRadius: 'var(--app-radius-pill)',
              color: subjectTheme.mutedText.color,
              fontWeight: 700,
              minHeight: 44,
              px: 3,
              width: '100%',
            }}
            variant="outlined"
          >
            {previousQuestionLabel}
          </Button>
          <Button
            {...nextButtonProps}
            disabled={disableNext}
            endIcon={<ArrowForwardRoundedIcon />}
            onClick={onNext}
            sx={{
              backgroundColor: subjectTheme.solidSurface.backgroundColor,
              borderRadius: 'var(--app-radius-pill)',
              color: subjectTheme.solidSurface.color,
              boxShadow: 'none',
              fontWeight: 700,
              minHeight: 42,
              px: 3,
              width: '100%',
              '&:hover': {
                backgroundColor: subjectTheme.solidSurface.backgroundColor,
                opacity: 0.92,
              },
              '&.Mui-disabled': {
                backgroundColor: subjectTheme.progressTrack,
                color: subjectTheme.mutedText.color,
              },
            }}
            variant="contained"
          >
            {nextButtonLabel}
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}

export default OnboardingQuestionCard
