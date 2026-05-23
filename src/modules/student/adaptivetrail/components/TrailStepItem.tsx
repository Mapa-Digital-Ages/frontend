import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined'
import { Box, Chip, Collapse, Stack, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { Fragment, type ReactElement } from 'react'
import type {
  AdaptiveTrailStep,
  AdaptiveTrailStepStatus,
  AdaptiveTrailSubStep,
} from '../types/types'
import { highlightText } from '../hooks/useTrailSearch'

interface TrailStepItemProps {
  isExpanded: boolean
  isFirst: boolean
  isLast: boolean
  prevStatus?: AdaptiveTrailStepStatus
  onAnswerSubStep: (
    step: AdaptiveTrailStep,
    subStep: AdaptiveTrailSubStep
  ) => void
  onExpand: (step: AdaptiveTrailStep) => void
  searchQuery?: string
  step: AdaptiveTrailStep
  subjectColor: string
}

function Highlighted({
  text,
  query,
  color,
}: {
  text: string
  query: string
  color: string
}) {
  if (!query.trim()) return <>{text}</>
  return (
    <>
      {highlightText(text, query).map((part, i) =>
        part.isMatch ? (
          <Box
            key={i}
            component="mark"
            sx={{
              backgroundColor: alpha(color, 0.28),
              borderRadius: '2px',
              color: 'inherit',
              fontWeight: 'inherit',
              px: '1px',
            }}
          >
            {part.text}
          </Box>
        ) : (
          <Fragment key={i}>{part.text}</Fragment>
        )
      )}
    </>
  )
}

const subStepKindIcon: Record<AdaptiveTrailSubStep['kind'], ReactElement> = {
  question: <QuizOutlinedIcon sx={{ fontSize: 14 }} />,
  text: <ArticleOutlinedIcon sx={{ fontSize: 14 }} />,
  video: <PlayArrowRoundedIcon sx={{ fontSize: 14 }} />,
}

const subStepKindLabel: Record<AdaptiveTrailSubStep['kind'], string> = {
  question: 'Quiz',
  text: 'Texto',
  video: 'Vídeo',
}

// Dot sizes for the sub-step timeline indicator
const DOT_SIZE = { md: 28, xs: 24 }
const DOT_ICON = { md: 13, xs: 11 }

function SubStepItem({
  isFirst,
  isLast,
  prevStatus,
  onAnswer,
  searchQuery = '',
  subStep,
  subjectColor,
}: {
  isFirst: boolean
  isLast: boolean
  prevStatus?: AdaptiveTrailStepStatus
  onAnswer: (subStep: AdaptiveTrailSubStep) => void
  searchQuery?: string
  subStep: AdaptiveTrailSubStep
  subjectColor: string
}) {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const isLocked = subStep.status === 'locked'
  const isCompleted = subStep.status === 'completed'
  const isAvailable = subStep.status === 'available'

  const dotColor = isCompleted
    ? theme.palette.success.main
    : isLocked
      ? alpha(theme.palette.text.secondary, isDark ? 0.3 : 0.22)
      : subjectColor

  const lineColor = alpha(theme.palette.text.secondary, isDark ? 0.14 : 0.1)
  const successLine = alpha(theme.palette.success.main, isDark ? 0.4 : 0.3)
  const activeLine = alpha(subjectColor, isDark ? 0.4 : 0.3)

  const topSpacerColor = isFirst
    ? 'transparent'
    : prevStatus === 'completed'
      ? successLine
      : prevStatus === 'available'
        ? activeLine
        : lineColor

  const bottomLineColor = isCompleted
    ? successLine
    : isAvailable
      ? activeLine
      : lineColor

  const rightAction = isLocked ? (
    <>
      {/* Mobile: icon only */}
      <Box
        sx={{
          alignItems: 'center',
          color: 'text.secondary',
          display: { md: 'none', xs: 'flex' },
          flexShrink: 0,
        }}
      >
        <LockOutlinedIcon sx={{ fontSize: 16 }} />
      </Box>
      {/* Desktop: full badge */}
      <Stack
        direction="row"
        spacing={0.5}
        sx={{
          alignItems: 'center',
          backgroundColor: alpha(
            theme.palette.text.secondary,
            isDark ? 0.1 : 0.06
          ),
          borderRadius: '999px',
          color: 'text.secondary',
          display: { md: 'flex', xs: 'none' },
          flexShrink: 0,
          px: 1.25,
          py: 0.5,
        }}
      >
        <LockOutlinedIcon sx={{ fontSize: 13 }} />
        <Typography
          sx={{ fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}
        >
          {subStep.lockReason ?? 'Bloqueado'}
        </Typography>
      </Stack>
    </>
  ) : isCompleted ? (
    <Box
      sx={{
        alignItems: 'center',
        backgroundColor: alpha(theme.palette.success.main, isDark ? 0.16 : 0.1),
        borderRadius: '999px',
        color: theme.palette.success.main,
        display: 'flex',
        flexShrink: 0,
        height: 30,
        justifyContent: 'center',
        width: 30,
      }}
    >
      <CheckRoundedIcon sx={{ fontSize: 15 }} />
    </Box>
  ) : (
    <Box
      aria-hidden
      sx={{
        alignItems: 'center',
        border: '1px solid',
        borderColor: alpha(subjectColor, isDark ? 0.5 : 0.4),
        borderRadius: '10px',
        color: subjectColor,
        display: 'flex',
        flexShrink: 0,
        height: 32,
        justifyContent: 'center',
        width: 32,
      }}
    >
      <PlayArrowRoundedIcon sx={{ fontSize: 18 }} />
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', gap: { md: 1.5, xs: 1 } }}>
      {/* Sub-step timeline: dot + connecting lines */}
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          width: DOT_SIZE,
        }}
      >
        <Box
          sx={{
            backgroundColor: topSpacerColor,
            flex: '0 0 14px',
            transition: 'background-color 200ms ease',
            width: 2,
          }}
        />
        <Box
          sx={{
            alignItems: 'center',
            backgroundColor: isCompleted
              ? alpha(theme.palette.success.main, isDark ? 0.2 : 0.12)
              : isLocked
                ? alpha(theme.palette.text.secondary, isDark ? 0.1 : 0.07)
                : alpha(subjectColor, isDark ? 0.22 : 0.14),
            border: '2px solid',
            borderColor: dotColor,
            borderRadius: '50%',
            color: dotColor,
            display: 'flex',
            flexShrink: 0,
            fontWeight: 800,
            height: DOT_SIZE,
            justifyContent: 'center',
            width: DOT_SIZE,
          }}
        >
          {isCompleted ? (
            <CheckRoundedIcon sx={{ fontSize: DOT_ICON }} />
          ) : isLocked ? (
            <LockOutlinedIcon sx={{ fontSize: DOT_ICON }} />
          ) : (
            <PlayArrowRoundedIcon sx={{ fontSize: DOT_ICON }} />
          )}
        </Box>
        {!isLast && (
          <Box
            sx={{
              backgroundColor: bottomLineColor,
              flex: 1,
              minHeight: 14,
              transition: 'background-color 200ms ease',
              width: 2,
            }}
          />
        )}
      </Box>

      {/* Sub-step card */}
      <Box sx={{ flex: 1, minWidth: 0, pb: isLast ? 0 : 1.5 }}>
        <Box
          aria-label={
            isAvailable ? `Responder etapa ${subStep.title}` : undefined
          }
          component={isAvailable ? 'button' : 'div'}
          onClick={isAvailable ? () => onAnswer(subStep) : undefined}
          type={isAvailable ? 'button' : undefined}
          sx={{
            alignItems: 'center',
            appearance: 'none',
            backgroundColor: isCompleted
              ? alpha(theme.palette.success.main, isDark ? 0.07 : 0.04)
              : isLocked
                ? alpha(theme.palette.text.secondary, isDark ? 0.04 : 0.02)
                : alpha(subjectColor, isDark ? 0.1 : 0.06),
            border: '1px solid',
            borderColor: isCompleted
              ? alpha(theme.palette.success.main, isDark ? 0.22 : 0.16)
              : isLocked
                ? alpha(theme.palette.text.secondary, isDark ? 0.1 : 0.08)
                : alpha(subjectColor, isDark ? 0.3 : 0.22),
            borderRadius: '14px',
            boxSizing: 'border-box',
            cursor: isAvailable ? 'pointer' : 'default',
            display: 'flex',
            font: 'inherit',
            gap: 1.5,
            opacity: isLocked ? 0.72 : 1,
            p: { md: 1.75, xs: 1.25 },
            textAlign: 'left',
            transition: 'all 160ms ease',
            width: '100%',
            '&:focus-visible': isAvailable
              ? {
                  borderColor: subjectColor,
                  outline: `3px solid ${alpha(subjectColor, 0.22)}`,
                  outlineOffset: 2,
                }
              : {},
            '&:hover': isAvailable
              ? {
                  backgroundColor: alpha(subjectColor, isDark ? 0.15 : 0.1),
                  borderColor: alpha(subjectColor, isDark ? 0.4 : 0.3),
                }
              : {},
          }}
        >
          {/* Kind icon */}
          <Box
            sx={{
              alignItems: 'center',
              backgroundColor: isCompleted
                ? alpha(theme.palette.success.main, isDark ? 0.2 : 0.12)
                : isLocked
                  ? alpha(theme.palette.text.secondary, isDark ? 0.12 : 0.08)
                  : alpha(subjectColor, isDark ? 0.2 : 0.12),
              borderRadius: '10px',
              color: isCompleted
                ? theme.palette.success.main
                : isLocked
                  ? 'text.secondary'
                  : subjectColor,
              display: 'flex',
              flexShrink: 0,
              height: { md: 34, xs: 30 },
              justifyContent: 'center',
              width: { md: 34, xs: 30 },
            }}
          >
            {isCompleted ? (
              <CheckRoundedIcon sx={{ fontSize: { md: 16, xs: 14 } }} />
            ) : isLocked ? (
              <LockOutlinedIcon sx={{ fontSize: { md: 15, xs: 13 } }} />
            ) : (
              subStepKindIcon[subStep.kind]
            )}
          </Box>

          {/* Content */}
          <Box flex={1} minWidth={0}>
            <Stack
              direction="row"
              sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 0.5, mb: 0.4 }}
            >
              <Chip
                label={`Etapa ${subStep.order}`}
                size="small"
                sx={{
                  backgroundColor: isAvailable
                    ? alpha(subjectColor, isDark ? 0.22 : 0.14)
                    : alpha(theme.palette.text.secondary, isDark ? 0.14 : 0.08),
                  color: isAvailable ? subjectColor : 'text.secondary',
                  fontSize: 11,
                  fontWeight: 700,
                  height: 20,
                  '& .MuiChip-label': { px: 0.75 },
                }}
              />
              <Chip
                icon={
                  isLocked ? (
                    <LockOutlinedIcon />
                  ) : (
                    subStepKindIcon[subStep.kind]
                  )
                }
                label={subStepKindLabel[subStep.kind]}
                size="small"
                sx={{
                  backgroundColor: alpha(
                    theme.palette.text.secondary,
                    isDark ? 0.12 : 0.07
                  ),
                  color: 'text.secondary',
                  fontSize: 11,
                  fontWeight: 700,
                  height: 20,
                  '& .MuiChip-icon': { color: 'text.secondary', fontSize: 12 },
                  '& .MuiChip-label': { px: 0.75 },
                }}
              />
              {subStep.duration && (
                <Typography sx={{ color: 'text.secondary', fontSize: 11 }}>
                  {subStep.duration}
                </Typography>
              )}
            </Stack>

            <Typography
              sx={{
                color: 'text.primary',
                fontSize: { md: 13, xs: 12 },
                fontWeight: 700,
              }}
            >
              <Highlighted
                text={subStep.title}
                query={searchQuery}
                color={subjectColor}
              />
            </Typography>
            <Typography
              sx={{
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
                color: 'text.secondary',
                display: '-webkit-box',
                fontSize: { md: 12, xs: 11 },
                lineHeight: 1.4,
                mt: 0.25,
                overflow: 'hidden',
              }}
            >
              <Highlighted
                text={subStep.description}
                query={searchQuery}
                color={subjectColor}
              />
            </Typography>
          </Box>

          {/* Right action */}
          {rightAction}
        </Box>
      </Box>
    </Box>
  )
}

export default function TrailStepItem({
  isExpanded,
  isFirst,
  isLast,
  prevStatus,
  onAnswerSubStep,
  onExpand,
  searchQuery = '',
  step,
  subjectColor,
}: TrailStepItemProps) {
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const isLocked = step.status === 'locked'
  const isCompleted = step.status === 'completed'
  const isAvailable = step.status === 'available'

  const circleSize = { md: 32, xs: 28 }
  const circleColor = isCompleted
    ? theme.palette.success.main
    : isLocked
      ? alpha(theme.palette.text.secondary, isDark ? 0.3 : 0.22)
      : subjectColor

  const lineColor = alpha(theme.palette.text.secondary, isDark ? 0.14 : 0.1)
  const successLine = alpha(theme.palette.success.main, isDark ? 0.4 : 0.3)
  const activeLine = alpha(subjectColor, isDark ? 0.32 : 0.22)

  const topSpacerColor = isFirst
    ? 'transparent'
    : prevStatus === 'completed'
      ? successLine
      : prevStatus === 'available'
        ? activeLine
        : lineColor

  const bottomLineColor = isCompleted
    ? successLine
    : isAvailable
      ? activeLine
      : lineColor

  return (
    <Box sx={{ display: 'flex', gap: { md: 2, xs: 1.5 } }}>
      {/* Left: circle + connecting lines */}
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          width: circleSize,
        }}
      >
        <Box
          sx={{
            backgroundColor: topSpacerColor,
            flex: '0 0 20px',
            transition: 'background-color 200ms ease',
            width: 2,
          }}
        />

        <Box
          sx={{
            alignItems: 'center',
            backgroundColor: isCompleted
              ? alpha(theme.palette.success.main, isDark ? 0.2 : 0.12)
              : isAvailable
                ? alpha(subjectColor, isDark ? 0.2 : 0.12)
                : alpha(theme.palette.text.secondary, isDark ? 0.1 : 0.06),
            border: '2px solid',
            borderColor: circleColor,
            borderRadius: '50%',
            color: circleColor,
            display: 'flex',
            flexShrink: 0,
            fontSize: { md: 13, xs: 12 },
            fontWeight: 800,
            height: circleSize,
            justifyContent: 'center',
            width: circleSize,
          }}
        >
          {isCompleted ? (
            <CheckRoundedIcon sx={{ fontSize: { md: 16, xs: 14 } }} />
          ) : isLocked ? (
            <LockOutlinedIcon sx={{ fontSize: { md: 14, xs: 12 } }} />
          ) : (
            <PlayArrowRoundedIcon sx={{ fontSize: { md: 16, xs: 14 } }} />
          )}
        </Box>

        {!isLast && (
          <Box
            sx={{
              backgroundColor: bottomLineColor,
              flex: 1,
              minHeight: 20,
              transition: 'background-color 200ms ease',
              width: 2,
            }}
          />
        )}
      </Box>

      {/* Right: content header + sub-steps */}
      <Box sx={{ flex: 1, minWidth: 0, pb: isLast ? 0 : 2.5 }}>
        {/* Content section header */}
        <Box
          onClick={() => !isLocked && onExpand(step)}
          sx={{
            alignItems: 'flex-start',
            backgroundColor: isCompleted
              ? alpha(theme.palette.success.main, isDark ? 0.08 : 0.05)
              : isAvailable
                ? alpha(subjectColor, isDark ? 0.1 : 0.06)
                : 'transparent',
            border: '1px solid',
            borderColor: isCompleted
              ? alpha(theme.palette.success.main, isDark ? 0.22 : 0.16)
              : isAvailable
                ? alpha(subjectColor, isDark ? 0.3 : 0.2)
                : alpha(theme.palette.text.secondary, isDark ? 0.1 : 0.08),
            borderRadius: '16px',
            cursor: isLocked ? 'default' : 'pointer',
            display: 'flex',
            gap: 1.5,
            p: { md: 2, xs: 1.5 },
            transition: 'all 160ms ease',
            '&:hover': isLocked
              ? {}
              : {
                  backgroundColor: isCompleted
                    ? alpha(theme.palette.success.main, isDark ? 0.13 : 0.09)
                    : alpha(subjectColor, isDark ? 0.15 : 0.1),
                  borderColor: isCompleted
                    ? alpha(theme.palette.success.main, isDark ? 0.32 : 0.24)
                    : alpha(subjectColor, isDark ? 0.4 : 0.3),
                },
          }}
        >
          <Box flex={1} minWidth={0}>
            <Typography
              sx={{
                color: 'text.primary',
                fontSize: { md: 16, xs: 14 },
                fontWeight: 800,
                lineHeight: 1.25,
              }}
            >
              <Highlighted
                text={step.title}
                query={searchQuery ?? ''}
                color={subjectColor}
              />
            </Typography>
            {step.description && (
              <Typography
                sx={{
                  color: 'text.secondary',
                  fontSize: { md: 13, xs: 12 },
                  lineHeight: 1.4,
                  mt: 0.5,
                }}
              >
                <Highlighted
                  text={step.description}
                  query={searchQuery ?? ''}
                  color={subjectColor}
                />
              </Typography>
            )}
          </Box>

          {isLocked ? (
            <>
              {/* Mobile: icon only */}
              <Box
                sx={{
                  alignItems: 'center',
                  color: 'text.secondary',
                  display: { md: 'none', xs: 'flex' },
                  flexShrink: 0,
                }}
              >
                <LockOutlinedIcon sx={{ fontSize: 18 }} />
              </Box>
              {/* Desktop: full badge */}
              <Stack
                direction="row"
                spacing={0.5}
                sx={{
                  alignItems: 'center',
                  backgroundColor: alpha(
                    theme.palette.text.secondary,
                    isDark ? 0.1 : 0.06
                  ),
                  borderRadius: '999px',
                  color: 'text.secondary',
                  display: { md: 'flex', xs: 'none' },
                  flexShrink: 0,
                  px: 1.25,
                  py: 0.5,
                }}
              >
                <LockOutlinedIcon sx={{ fontSize: 14 }} />
                <Typography
                  sx={{ fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' }}
                >
                  {step.lockReason ?? 'Bloqueado'}
                </Typography>
              </Stack>
            </>
          ) : (
            <KeyboardArrowDownRoundedIcon
              sx={{
                color: isCompleted ? theme.palette.success.main : subjectColor,
                flexShrink: 0,
                fontSize: { md: 22, xs: 20 },
                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 200ms ease',
              }}
            />
          )}
        </Box>

        {/* Sub-steps (etapas) */}
        <Collapse in={isExpanded && !isLocked} unmountOnExit>
          <Box sx={{ mt: { md: 1.5, xs: 1 }, pl: { md: 1, xs: 0 } }}>
            {step.subSteps.map((subStep, index) => (
              <SubStepItem
                key={subStep.id}
                isFirst={index === 0}
                isLast={index === step.subSteps.length - 1}
                prevStatus={
                  index > 0 ? step.subSteps[index - 1].status : undefined
                }
                onAnswer={ss => onAnswerSubStep(step, ss)}
                searchQuery={searchQuery}
                subStep={subStep}
                subjectColor={subjectColor}
              />
            ))}
          </Box>
        </Collapse>
      </Box>
    </Box>
  )
}
