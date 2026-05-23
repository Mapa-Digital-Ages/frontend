import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined'
import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded'
import { alpha, useTheme } from '@mui/material/styles'
import { Box, Button, Stack, Typography } from '@mui/material'
import AppCard from '@/shared/ui/AppCard'
import AppPageContainer from '@/shared/ui/AppPageContainer'
import AppSubjectsTags from '@/shared/ui/AppSubjectsTags'
import { getSubjectTheme } from '@/shared/utils/themes'
import type { TrailStepCompletionResult } from '../types/types'
import ProgressBar from '@/shared/ui/ProgressBar'

interface TrailCompletionScreenProps {
  result: TrailStepCompletionResult
  onContinue: () => void
}

export default function TrailCompletionScreen({
  result,
  onContinue,
}: TrailCompletionScreenProps) {
  const theme = useTheme()
  const subjectTheme = getSubjectTheme(result.subject, {
    mode: theme.palette.mode,
  })
  const isDark = theme.palette.mode === 'dark'
  const scorePercent =
    result.total > 0 ? Math.round((result.correct / result.total) * 100) : 0

  return (
    <AppPageContainer
      sx={{
        display: 'flex',
        justifyContent: 'center',
        overflowY: 'auto',
        width: '100%',
      }}
    >
      <AppCard
        contentSx={{
          display: 'grid',
          gap: { md: 3, xs: 2 },
          p: { md: 4, xs: 2 },
        }}
        sx={{
          border: `1px solid ${subjectTheme.border.borderColor}`,
          boxShadow: '0 12px 30px rgba(16, 24, 40, 0.04)',
          maxWidth: 768,
          width: '100%',
        }}
      >
        {/* Score card */}
        <AppCard
          sx={{
            backgroundColor: subjectTheme.softSurface.backgroundColor,
            borderColor: subjectTheme.softSurface.borderColor,
          }}
          contentSx={{ display: 'grid', gap: 3, p: { md: 4, xs: 2.5 } }}
        >
          {/* Score header — stack vertically on mobile */}
          <Stack
            direction={{ md: 'row', xs: 'column' }}
            spacing={{ md: 2, xs: 1.5 }}
            sx={{ alignItems: { md: 'center', xs: 'flex-start' } }}
          >
            <Box
              sx={{
                alignItems: 'center',
                backgroundColor: alpha(
                  subjectTheme.color,
                  isDark ? 0.18 : 0.12
                ),
                border: `2px solid ${alpha(subjectTheme.color, isDark ? 0.4 : 0.28)}`,
                borderRadius: '50%',
                color: subjectTheme.color,
                display: 'flex',
                flexShrink: 0,
                fontSize: { md: 22, xs: 18 },
                fontWeight: 900,
                height: { md: 72, xs: 60 },
                justifyContent: 'center',
                lineHeight: 1,
                width: { md: 72, xs: 60 },
              }}
            >
              {result.correct}/{result.total}
            </Box>

            <Box>
              <Typography
                sx={{
                  color: 'text.primary',
                  fontSize: { md: 20, xs: 17 },
                  fontWeight: 800,
                  lineHeight: 1.25,
                }}
              >
                {result.stepTitle} — Resultado
              </Typography>
              <Stack
                direction="row"
                spacing={0.75}
                sx={{ alignItems: 'center', flexWrap: 'wrap', mt: 0.5 }}
              >
                <Typography sx={{ color: 'text.secondary', fontSize: 12 }}>
                  Trilha:
                </Typography>
                <Typography
                  sx={{
                    color: 'text.secondary',
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {result.trailTitle}
                </Typography>
                <AppSubjectsTags subjects={[result.subject]} size="sm" />
              </Stack>
            </Box>
          </Stack>

          <Box>
            <ProgressBar
              subject={result.subject}
              thickness={10}
              value={scorePercent}
              showValueLabel
              valueLabelVariant="plain"
            />
          </Box>

          <Box
            sx={{
              display: 'grid',
              gap: 1.5,
              gridTemplateColumns: 'repeat(2, 1fr)',
            }}
          >
            {[
              { label: 'Corretas', value: result.correct, color: '#34d399' },
              {
                label: 'Incorretas',
                value: result.total - result.correct,
                color: '#f87171',
              },
            ].map(stat => (
              <Box
                key={stat.label}
                sx={{
                  backgroundColor: alpha(
                    theme.palette.text.secondary,
                    isDark ? 0.06 : 0.04
                  ),
                  border: '1px solid',
                  borderColor: alpha(
                    theme.palette.text.secondary,
                    isDark ? 0.12 : 0.08
                  ),
                  borderRadius: '14px',
                  p: 2,
                  textAlign: 'center',
                }}
              >
                <Typography
                  sx={{
                    color: stat.color,
                    fontSize: { md: 26, xs: 22 },
                    fontWeight: 900,
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography
                  sx={{
                    color: 'text.secondary',
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: 0.5,
                    textTransform: 'uppercase',
                  }}
                >
                  {stat.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </AppCard>

        {/* Recommended content */}
        {result.recommendedContent.length > 0 && (
          <Box sx={{ display: 'grid', gap: 1.5 }}>
            <Box>
              <Typography
                sx={{
                  color: 'text.secondary',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 0.6,
                  textTransform: 'uppercase',
                }}
              >
                Conteúdos para revisar
              </Typography>
              <Typography
                sx={{ color: 'text.secondary', fontSize: 13, mt: 0.5 }}
              >
                Materiais avulsos que podem complementar o que você estudou.
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'grid',
                gap: 1,
                maxHeight: { md: 340, xs: 280 },
                overflowY: 'auto',
                pr: 0.5,
                '&::-webkit-scrollbar': { width: 4 },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: alpha(
                    theme.palette.text.secondary,
                    isDark ? 0.2 : 0.15
                  ),
                  borderRadius: 2,
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: 'transparent',
                },
              }}
            >
              {result.recommendedContent.map(content => (
                <Box
                  key={content.id}
                  sx={{
                    alignItems: 'flex-start',
                    backgroundColor: alpha(
                      theme.palette.text.secondary,
                      isDark ? 0.04 : 0.02
                    ),
                    border: '1px solid',
                    borderColor: alpha(
                      theme.palette.text.secondary,
                      isDark ? 0.1 : 0.08
                    ),
                    borderRadius: '16px',
                    display: 'flex',
                    gap: 1.5,
                    p: 2,
                  }}
                >
                  <Box
                    sx={{
                      alignItems: 'center',
                      backgroundColor: alpha(
                        theme.palette.text.secondary,
                        isDark ? 0.1 : 0.06
                      ),
                      borderRadius: '8px',
                      color: 'text.secondary',
                      display: 'flex',
                      flexShrink: 0,
                      height: 36,
                      justifyContent: 'center',
                      width: 36,
                    }}
                  >
                    {content.kind === 'video' ? (
                      <PlayCircleOutlineRoundedIcon sx={{ fontSize: 18 }} />
                    ) : (
                      <ArticleOutlinedIcon sx={{ fontSize: 18 }} />
                    )}
                  </Box>
                  <Box flex={1} minWidth={0}>
                    <Typography
                      sx={{
                        color: 'text.primary',
                        fontSize: 14,
                        fontWeight: 700,
                      }}
                    >
                      {content.title}
                    </Typography>
                    <Typography
                      sx={{
                        color: 'text.secondary',
                        fontSize: 12,
                        lineHeight: 1.4,
                        mt: 0.25,
                      }}
                    >
                      {content.description}
                    </Typography>
                  </Box>
                  <Button
                    size="small"
                    sx={{
                      borderColor: alpha(
                        theme.palette.text.secondary,
                        isDark ? 0.2 : 0.16
                      ),
                      borderRadius: 'var(--app-radius-pill)',
                      color: 'text.secondary',
                      flexShrink: 0,
                      fontSize: 12,
                      fontWeight: 600,
                      textTransform: 'none',
                    }}
                    variant="outlined"
                  >
                    Acessar
                  </Button>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* CTA */}
        <Button
          onClick={onContinue}
          sx={{
            backgroundColor: subjectTheme.solidSurface.backgroundColor,
            borderRadius: 'var(--app-radius-pill)',
            boxShadow: 'none',
            color: subjectTheme.solidSurface.color,
            fontWeight: 800,
            minHeight: 48,
            textTransform: 'none',
            '&:hover': {
              backgroundColor: subjectTheme.solidSurface.backgroundColor,
              opacity: 0.92,
            },
          }}
          variant="contained"
        >
          Continuar para a trilha
        </Button>
      </AppCard>
    </AppPageContainer>
  )
}
