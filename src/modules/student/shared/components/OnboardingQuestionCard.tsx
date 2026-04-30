import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import {
  Box,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import React, { useState } from 'react'
import AppTags from '@/shared/ui/AppTags'
import AppCard from '@/shared/ui/AppCard'
import ProgressBar from '@/shared/ui/ProgressBar'
import { getSubjectTheme, SUBJECTS } from '@/shared/utils/themes'
import type {
  QuestionFlowActionInput,
  QuestionFlowPayload,
} from '@/modules/student/shared/types/types'

interface OnboardingQuestionCardProps {
  assessmentId?: string
  initialAnswersByQuestionId?: Record<string, string>
  onAnswer?: (answer: QuestionFlowActionInput) => void | Promise<void>
  onBack?: () => void
  onComplete?: (answersByQuestionId: Record<string, string>) => void
  questions: QuestionFlowPayload[]
  title?: string
}

function getProgress(
  questions: QuestionFlowPayload[],
  answersByQuestionId: Record<string, string>
) {
  if (questions.length === 0) {
    return 0
  }

  const answeredQuestions = questions.filter(
    question => answersByQuestionId[question.id]
  )

  return Math.round((answeredQuestions.length / questions.length) * 100)
}

function OnboardingQuestionCard({
  assessmentId = 'local-assessment',
  initialAnswersByQuestionId = {},
  onAnswer,
  onBack,
  onComplete,
  questions,
  title = 'Questionário de Nivelamento',
}: OnboardingQuestionCardProps) {
  const theme = useTheme()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answersByQuestionId, setAnswersByQuestionId] = useState(
    initialAnswersByQuestionId
  )
  const safeQuestions = questions.length
    ? questions
    : [
        {
          id: 'empty-question',
          options: [],
          question: 'Nenhuma questão disponível no momento.',
          subject: SUBJECTS.matematica,
        },
      ]
  const currentQuestion =
    safeQuestions[Math.min(currentQuestionIndex, safeQuestions.length - 1)]
  const selectedOptionId = answersByQuestionId[currentQuestion.id]
  const progress = getProgress(safeQuestions, answersByQuestionId)
  const isFirstQuestion = currentQuestionIndex === 0
  const isLastQuestion = currentQuestionIndex === safeQuestions.length - 1
  const subjectTheme = getSubjectTheme(currentQuestion.subject, {
    mode: theme.palette.mode,
  })
  const completionLabel = `${currentQuestionIndex + 1} / ${safeQuestions.length} questão(ões) - ${progress}% concluído`
  const questionOrderLabel = `Questão ${currentQuestionIndex + 1} / ${safeQuestions.length}`
  const subjectBadge = <AppTags size="sm" tags={[currentQuestion.subject]} />

  function handleSelectOption(optionId: string) {
    const answer = {
      assessmentId,
      currentQuestionIndex,
      isCompleted: isLastQuestion,
      optionId,
      questionId: currentQuestion.id,
    }

    setAnswersByQuestionId(currentAnswers => ({
      ...currentAnswers,
      [currentQuestion.id]: optionId,
    }))

    void onAnswer?.(answer)
  }

  function handlePreviousQuestion() {
    setCurrentQuestionIndex(currentIndex => Math.max(0, currentIndex - 1))
  }

  function handleNextQuestion() {
    if (!selectedOptionId) {
      return
    }

    if (isLastQuestion) {
      onComplete?.(answersByQuestionId)
      return
    }

    setCurrentQuestionIndex(currentIndex =>
      Math.min(safeQuestions.length - 1, currentIndex + 1)
    )
  }

  return (
    <AppCard
      contentSx={{
        display: 'grid',
        gap: { md: 3, xs: 2.5 },
        p: { md: 4, xs: 2.5 },
      }}
      sx={{
        border: `1px solid ${subjectTheme.border.borderColor}`,
        boxShadow: '0 12px 30px rgba(16, 24, 40, 0.04)',
        maxWidth: 768,
      }}
    >
      {onBack ? (
        <Box>
          <Button
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
      ) : null}

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
          subject={currentQuestion.subject}
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
              {currentQuestion.question}
            </Typography>
          </Stack>
          <Typography
            sx={{
              backgroundColor:
                theme.palette.mode === 'dark'
                  ? alpha(theme.palette.background.paper, 0.72)
                  : subjectTheme.badge.backgroundColor,
              border: `1px solid ${alpha(
                subjectTheme.color,
                theme.palette.mode === 'dark' ? 0.4 : 0.28
              )}`,
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

        <RadioGroup
          onChange={event => handleSelectOption(event.target.value)}
          value={selectedOptionId ?? ''}
          sx={{ gap: 2 }}
        >
          {currentQuestion.options.map(option => {
            const isSelected = option.id === selectedOptionId

            return (
              <FormControlLabel
                key={option.id}
                value={option.id}
                control={<Radio sx={{ display: 'none' }} />}
                label={option.label}
                sx={{
                  backgroundColor: isSelected
                    ? subjectTheme.optionSelected.backgroundColor
                    : subjectTheme.option.backgroundColor,
                  border: '1px solid',
                  borderColor: isSelected
                    ? subjectTheme.optionSelected.borderColor
                    : subjectTheme.option.borderColor,
                  borderRadius: 'var(--app-radius-control)',
                  color: isSelected
                    ? subjectTheme.optionSelected.color
                    : subjectTheme.option.color,
                  justifyContent: 'flex-start',
                  m: 0,
                  minHeight: 48,
                  px: 2,
                  py: 1.25,
                  textAlign: 'left',
                  transition:
                    'background-color 180ms ease, border-color 180ms ease, color 180ms ease',
                  width: '100%',
                  '& .MuiFormControlLabel-label': {
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    lineHeight: 1.75,
                  },
                  '&:hover': {
                    backgroundColor:
                      subjectTheme.optionSelected.backgroundColor,
                    borderColor: subjectTheme.color,
                    cursor: 'pointer',
                  },
                }}
              />
            )
          })}
        </RadioGroup>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: 1.25,
          gridTemplateColumns: { sm: 'repeat(2, minmax(0, 1fr))', xs: '1fr' },
        }}
      >
        <Button
          disabled={isFirstQuestion}
          onClick={handlePreviousQuestion}
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
          Questão anterior
        </Button>
        <Button
          disabled={!selectedOptionId}
          endIcon={<ArrowForwardRoundedIcon />}
          onClick={handleNextQuestion}
          sx={{
            backgroundColor: subjectTheme.solidSurface.backgroundColor,
            borderRadius: 'var(--app-radius-pill)',
            boxShadow: 'none',
            color: subjectTheme.solidSurface.color,
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
          {isLastQuestion ? 'Concluir' : 'Próxima questão'}
        </Button>
      </Box>
    </AppCard>
  )
}

export default OnboardingQuestionCard
