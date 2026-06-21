import AddRoundedIcon from '@mui/icons-material/AddRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import {
  Box,
  Alert,
  Typography,
  Button,
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material'
import AppActionModal from '@/shared/ui/AppActionModal'
import AppDropdown, { type DropdownOption } from '@/shared/ui/AppDropdown'
import AppInput from '@/shared/ui/AppInput'
import type {
  AdaptiveTrailAdminItem,
  ContentApprovalItem,
} from '@/modules/admin/shared/types/types'
import {
  AdminTrailSubStepFormValues,
  AdminTrailStepFormValues,
  TrailCreationFormValues,
} from '../types/trail'
import { getHoverStyle } from '@/app/theme/core/roles'

interface TrailCreationModalProps {
  content: ContentApprovalItem | null
  contentOptions: DropdownOption[]
  disableConfirm?: boolean
  isSubmitting?: boolean
  mode: 'create' | 'edit'
  onChange: (
    field: keyof Omit<TrailCreationFormValues, 'steps'>,
    value: string
  ) => void
  onStepChange: (
    stepId: string,
    field: keyof Omit<AdminTrailStepFormValues, 'id' | 'subSteps'>,
    value: string
  ) => void
  onSubStepChange: (
    stepId: string,
    subStepId: string,
    field: keyof AdminTrailSubStepFormValues,
    value: string
  ) => void
  onAddStep: () => void
  onRemoveStep: (stepId: string) => void
  onAddSubStep: (stepId: string) => void
  onRemoveSubStep: (stepId: string, subStepId: string) => void
  onClose: () => void
  onConfirm: () => void
  open: boolean
  subjectOptions: DropdownOption[]
  trail?: AdaptiveTrailAdminItem | null
  values: TrailCreationFormValues
}

const fieldLabelSx = {
  color: 'text.secondary',
  fontSize: { md: 13, xs: 12 },
  fontWeight: 700,
  letterSpacing: '0.02em',
}

const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '14px',
  },
  '& .MuiInputBase-input': {
    fontSize: { md: 14, xs: 13 },
  },
}

const textareaSx = {
  '& .MuiOutlinedInput-root': {
    alignItems: 'flex-start',
    borderRadius: '14px',
    height: 'auto',
    minHeight: { md: 96, xs: 88 },
  },
  '& .MuiInputBase-input': {
    fontSize: { md: 14, xs: 13 },
    lineHeight: 1.55,
  },
}

const difficultyOptions = [
  { label: 'Fácil', value: '1' },
  { label: 'Médio', value: '2' },
  { label: 'Difícil', value: '3' },
]

const activityTypeOptions = [
  { label: 'Texto', value: 'text' },
  { label: 'Vídeo', value: 'video' },
  { label: 'Questionário', value: 'question' },
]

function TrailCreationModal({
  contentOptions,
  disableConfirm = false,
  isSubmitting = false,
  mode,
  onAddStep,
  onChange,
  onClose,
  onConfirm,
  onAddSubStep,
  onRemoveStep,
  onRemoveSubStep,
  onStepChange,
  onSubStepChange,
  open,
  subjectOptions,
  values,
}: TrailCreationModalProps) {
  const theme = useTheme()
  const isEdit = mode === 'edit'

  const title = isEdit ? 'Editar trilha adaptativa' : 'Criar trilha adaptativa'

  const description = isEdit
    ? 'Ajuste os dados e as etapas da trilha adaptativa.'
    : 'Estruture a trilha em etapas com conteúdo relacionado e atividades.'

  const errorColor = theme.palette.error.main
  const accentHover = getHoverStyle(theme, errorColor)

  return (
    <AppActionModal
      confirmLabel={isEdit ? 'Salvar alterações' : 'Criar trilha'}
      description={description}
      disableConfirm={disableConfirm}
      loading={isSubmitting}
      onClose={onClose}
      onConfirm={onConfirm}
      open={open}
      title={title}
    >
      <Box
        sx={{
          display: 'grid',
          gap: { md: 2, xs: 1.5 },
          pr: { md: 0.5, xs: 0 },
          maxHeight: { md: 350, xs: 200 },
        }}
      >
        {!isEdit && contentOptions.length === 0 ? (
          <Alert severity="info" sx={{ borderRadius: '14px' }}>
            Cadastre ao menos um conteúdo antes de criar uma trilha.
          </Alert>
        ) : null}

        <AppInput
          label="Nome da trilha"
          labelSx={fieldLabelSx}
          onChange={event => onChange('title', event.target.value)}
          placeholder="Ex.: Trilha de Álgebra"
          sx={inputSx}
          value={values.title}
        />

        <Box className="grid gap-1">
          <Typography sx={fieldLabelSx}>Disciplina</Typography>
          <AppDropdown
            fullWidth
            disabled={subjectOptions.length === 0}
            onChange={event =>
              onChange('subjectId', String(event.target.value))
            }
            options={subjectOptions}
            placeholder="Selecione a disciplina"
            sx={inputSx}
            value={values.subjectId}
          />
        </Box>

        <AppInput
          label="Descrição da trilha"
          labelSx={fieldLabelSx}
          multiline
          minRows={3}
          onChange={event => onChange('description', event.target.value)}
          placeholder="Objetivo da sequência, nível esperado e como as atividades desenvolvem o conteúdo."
          sx={textareaSx}
          value={values.description}
        />

        {!isEdit ? (
          <Box className="grid gap-1">
            <Box sx={{ alignItems: 'center', display: 'flex', gap: 0.5 }}>
              <Typography sx={fieldLabelSx}>Eixos e habilidades</Typography>
              <Tooltip
                arrow
                title="Os eixos e habilidades direcionam a IA na geração das questões do quiz. Liste os tópicos/habilidades que a trilha deve cobrir (ex.: 'equações do 1º grau', 'interpretação de problemas'), separados por vírgula."
              >
                <InfoOutlinedIcon
                  sx={{ color: 'text.secondary', cursor: 'help', fontSize: 16 }}
                />
              </Tooltip>
            </Box>
            <AppInput
              multiline
              minRows={2}
              onChange={event => onChange('eixo', event.target.value)}
              placeholder="Ex.: equações do primeiro grau, interpretação de problemas algébricos"
              sx={textareaSx}
              value={values.eixo}
            />
          </Box>
        ) : null}

        <Box
          sx={{
            display: 'grid',
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            <Typography sx={fieldLabelSx}>Etapas da trilha</Typography>

            <IconButton
              aria-label="Adicionar Etapa"
              onClick={onAddStep}
              sx={{
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: 'background.border',
                borderRadius: 'var(--app-radius-control)',
                color: 'text.primary',
                flexShrink: 0,
                height: 32,
                width: 32,
                '&:hover': {
                  backgroundColor: accentHover.backgroundColor,
                  borderColor: accentHover.borderColor,
                },
              }}
            >
              <AddRoundedIcon fontSize="small" />
            </IconButton>
          </Box>

          {values.steps.length === 0 ? (
            <Alert severity="info" sx={{ borderRadius: '14px' }}>
              Adicione ao menos uma etapa para estruturar a trilha adaptativa.
            </Alert>
          ) : null}

          {values.steps.map((step, index) => (
            <Box
              key={step.id}
              sx={{
                border: 1,
                borderColor: 'background.border',
                borderRadius: '18px',
                display: 'grid',
                gap: 1.5,
                p: { md: 2, xs: 1.5 },
              }}
            >
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 2,
                }}
              >
                <Typography
                  sx={{
                    color: 'text.primary',
                    fontSize: { md: 15, xs: 14 },
                    fontWeight: 800,
                  }}
                >
                  Etapa {index + 1}
                </Typography>
                <IconButton
                  aria-label={`Remover etapa ${index + 1}`}
                  disabled={values.steps.length === 1}
                  onClick={() => onRemoveStep(step.id)}
                  size="small"
                  sx={{
                    backgroundColor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'background.border',
                    borderRadius: 'var(--app-radius-control)',
                    color: 'text.primary',
                    flexShrink: 0,
                    height: 32,
                    width: 32,
                    '&:hover': {
                      backgroundColor: accentHover.backgroundColor,
                      borderColor: accentHover.borderColor,
                    },
                  }}
                >
                  <DeleteOutlineRoundedIcon fontSize="small" />
                </IconButton>
              </Box>
              <AppInput
                label="Título da etapa"
                labelSx={fieldLabelSx}
                onChange={event =>
                  onStepChange(step.id, 'title', event.target.value)
                }
                placeholder="Ex.: Introdução ao conteúdo"
                sx={inputSx}
                value={step.title}
              />

              <AppInput
                label="Descrição da etapa"
                labelSx={fieldLabelSx}
                multiline
                minRows={2}
                onChange={event =>
                  onStepChange(step.id, 'description', event.target.value)
                }
                placeholder="Explique o objetivo desta etapa dentro da trilha."
                sx={textareaSx}
                value={step.description}
              />

              <Box className="grid gap-1">
                <Typography sx={fieldLabelSx}>Conteúdo relacionado</Typography>
                <AppDropdown
                  fullWidth
                  disabled={contentOptions.length === 0}
                  menuMaxHeight={260}
                  onChange={event =>
                    onStepChange(
                      step.id,
                      'contentId',
                      String(event.target.value)
                    )
                  }
                  options={contentOptions}
                  placeholder="Selecione um conteúdo"
                  sx={inputSx}
                  value={step.contentId}
                />
              </Box>

              <Box sx={{ display: 'grid', gap: 1.25 }}>
                <Box
                  sx={{
                    alignItems: 'center',
                    display: 'flex',
                    gap: 1.5,
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography sx={fieldLabelSx}>Sub-etapas da etapa</Typography>
                  <IconButton
                    aria-label="Adicionar Etapa"
                    onClick={() => onAddSubStep(step.id)}
                    sx={{
                      backgroundColor: 'background.paper',
                      border: '1px solid',
                      borderColor: 'background.border',
                      borderRadius: 'var(--app-radius-control)',
                      color: 'text.primary',
                      flexShrink: 0,
                      height: 32,
                      width: 32,
                      '&:hover': {
                        backgroundColor: accentHover.backgroundColor,
                        borderColor: accentHover.borderColor,
                      },
                    }}
                  >
                    <AddRoundedIcon fontSize="small" />
                  </IconButton>
                </Box>

                {step.subSteps.map((subStep, subStepIndex) => (
                  <Box
                    key={subStep.id}
                    sx={{
                      border: 1,
                      borderColor: 'background.border',
                      borderRadius: '14px',
                      display: 'grid',
                      gap: 1.25,
                      p: { md: 1.5, xs: 1.25 },
                    }}
                  >
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex',
                        gap: 1.5,
                        justifyContent: 'space-between',
                      }}
                    >
                      <Typography
                        sx={{
                          color: 'text.primary',
                          fontSize: { md: 14, xs: 13 },
                          fontWeight: 800,
                        }}
                      >
                        Sub-etapa {index + 1}.{subStepIndex + 1}
                      </Typography>
                      <IconButton
                        aria-label={`Remover sub-etapa ${index + 1}.${subStepIndex + 1}`}
                        disabled={step.subSteps.length === 1}
                        onClick={() => onRemoveSubStep(step.id, subStep.id)}
                        size="small"
                        sx={{
                          backgroundColor: 'background.paper',
                          border: '1px solid',
                          borderColor: 'background.border',
                          borderRadius: 'var(--app-radius-control)',
                          color: 'text.primary',
                          flexShrink: 0,
                          height: 30,
                          width: 30,
                          '&:hover': {
                            backgroundColor: accentHover.backgroundColor,
                            borderColor: accentHover.borderColor,
                          },
                        }}
                      >
                        <DeleteOutlineRoundedIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    <AppInput
                      label="Título da sub-etapa"
                      labelSx={fieldLabelSx}
                      onChange={event =>
                        onSubStepChange(
                          step.id,
                          subStep.id,
                          'title',
                          event.target.value
                        )
                      }
                      placeholder="Ex.: Quiz diagnóstico"
                      sx={inputSx}
                      value={subStep.title}
                    />

                    <AppInput
                      label="Descrição da sub-etapa"
                      labelSx={fieldLabelSx}
                      multiline
                      minRows={2}
                      onChange={event =>
                        onSubStepChange(
                          step.id,
                          subStep.id,
                          'description',
                          event.target.value
                        )
                      }
                      placeholder="Explique o objetivo e o conteúdo desta sub-etapa."
                      sx={textareaSx}
                      value={subStep.description}
                    />

                    <Box className="grid gap-1">
                      <Typography sx={fieldLabelSx}>
                        Atividade da sub-etapa
                      </Typography>
                      <AppDropdown
                        fullWidth
                        onChange={event =>
                          onSubStepChange(
                            step.id,
                            subStep.id,
                            'activityType',
                            String(event.target.value)
                          )
                        }
                        options={activityTypeOptions}
                        placeholder="Selecione o tipo"
                        sx={inputSx}
                        value={subStep.activityType}
                      />
                    </Box>

                    {subStep.activityType === 'question' ? (
                      <Box
                        sx={{
                          display: 'grid',
                          gap: 1.5,
                          gridTemplateColumns: {
                            md: 'minmax(0, 1fr) minmax(0, 1fr)',
                            xs: '1fr',
                          },
                        }}
                      >
                        <AppInput
                          label="Quantidade de questões"
                          labelSx={fieldLabelSx}
                          onChange={event =>
                            onSubStepChange(
                              step.id,
                              subStep.id,
                              'questionCount',
                              event.target.value
                            )
                          }
                          placeholder="Ex.: 5"
                          sx={inputSx}
                          value={subStep.questionCount}
                        />

                        <Box className="grid gap-1">
                          <Typography sx={fieldLabelSx}>Dificuldade</Typography>
                          <AppDropdown
                            fullWidth
                            onChange={event =>
                              onSubStepChange(
                                step.id,
                                subStep.id,
                                'difficulty',
                                String(event.target.value)
                              )
                            }
                            options={difficultyOptions}
                            placeholder="Selecione a dificuldade"
                            sx={inputSx}
                            value={subStep.difficulty}
                          />
                        </Box>
                      </Box>
                    ) : null}
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </AppActionModal>
  )
}

export default TrailCreationModal
