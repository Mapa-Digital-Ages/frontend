import BlockRoundedIcon from '@mui/icons-material/BlockRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import SaveRoundedIcon from '@mui/icons-material/SaveRounded'
import { Box, Typography, useTheme } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import AppActionModal from '@/shared/ui/AppActionModal'
import AppButton from '@/shared/ui/AppButton'
import AppCard from '@/shared/ui/AppCard'
import AppInput from '@/shared/ui/AppInput'
import type { ParentAccountSettings } from '@/modules/parent/settings/services/service'
import { getRolePalette, getSelectedStyle } from '@/app/theme/core/roles'
import { useParentRole } from '../../shared/hooks/useParentRole'

interface AccountSettingsProps {
  initialValues: ParentAccountSettings
  onSave?: (settings: ParentAccountSettings) => void | Promise<void>
  onDisableAccount?: () => void | Promise<void>
  onDeleteAccount?: () => void | Promise<void>
}

type PendingAccountAction = 'disable' | 'delete' | null

const EMPTY_ACCOUNT_SETTINGS: ParentAccountSettings = {
  email: '',
  name: '',
  phone: '',
}

function normalizeSettings(settings: ParentAccountSettings) {
  return {
    email: settings.email.trim(),
    name: settings.name.trim(),
    phone: settings.phone?.trim() ?? '',
  }
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function hasFormChanged(
  current: ParentAccountSettings,
  initial: ParentAccountSettings
) {
  const normalizedCurrent = normalizeSettings(current)
  const normalizedInitial = normalizeSettings(initial)

  return (
    normalizedCurrent.email !== normalizedInitial.email ||
    normalizedCurrent.name !== normalizedInitial.name ||
    normalizedCurrent.phone !== normalizedInitial.phone
  )
}

function AccountSettings({
  initialValues,
  onSave,
  onDisableAccount,
  onDeleteAccount,
}: AccountSettingsProps) {
  const [form, setForm] = useState<ParentAccountSettings>({
    ...EMPTY_ACCOUNT_SETTINGS,
    ...initialValues,
  })
  const [savedValues, setSavedValues] = useState<ParentAccountSettings>({
    ...EMPTY_ACCOUNT_SETTINGS,
    ...initialValues,
  })
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)
  const [pendingAction, setPendingAction] = useState<PendingAccountAction>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isSubmittingAction, setIsSubmittingAction] = useState(false)
  const theme = useTheme()
  const role = useParentRole()
  const rolePalette = getRolePalette(theme, role)
  const selectColor = getSelectedStyle(theme, rolePalette.contrast)

  useEffect(() => {
    const nextValues = { ...EMPTY_ACCOUNT_SETTINGS, ...initialValues }
    setForm(nextValues)
    setSavedValues(nextValues)
  }, [initialValues])

  const normalizedForm = useMemo(() => normalizeSettings(form), [form])
  const nameError = normalizedForm.name.length === 0
  const emailError =
    normalizedForm.email.length > 0 && !isValidEmail(normalizedForm.email)
  const isFormValid = !nameError && !emailError
  const canSave = isFormValid && hasFormChanged(form, savedValues) && !isSaving

  function updateField(field: keyof ParentAccountSettings, value: string) {
    setFeedbackMessage(null)
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSave() {
    if (!canSave) return

    setIsSaving(true)
    setFeedbackMessage(null)
    try {
      const nextSettings = normalizeSettings(form)
      await onSave?.(nextSettings)
      setForm(nextSettings)
      setSavedValues(nextSettings)
      setFeedbackMessage('Dados da conta atualizados.')
    } catch {
      setFeedbackMessage('Não foi possível salvar os dados da conta.')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleConfirmAccountAction() {
    if (!pendingAction) return

    setIsSubmittingAction(true)
    setFeedbackMessage(null)
    try {
      if (pendingAction === 'disable') {
        await onDisableAccount?.()
      } else {
        await onDeleteAccount?.()
      }
      setPendingAction(null)
    } catch {
      setFeedbackMessage(
        pendingAction === 'disable'
          ? 'Não foi possível desabilitar a conta.'
          : 'Não foi possível excluir a conta.'
      )
    } finally {
      setIsSubmittingAction(false)
    }
  }

  const actionCopy =
    pendingAction === 'disable'
      ? {
          confirmLabel: 'Desabilitar',
          description:
            'Sua conta será desativada e o acesso ficará bloqueado até reativação administrativa.',
          title: 'Desabilitar conta?',
        }
      : {
          confirmLabel: 'Excluir',
          description:
            'Essa ação remove o acesso da conta e pode afetar vínculos existentes com os filhos.',
          title: 'Excluir conta?',
        }

  return (
    <>
      <AppCard
        className="flex h-full min-h-0 flex-col"
        contentSx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          minHeight: 0,
          minWidth: 0,
        }}
      >
        <Box className="flex min-w-0 flex-col gap-1">
          <Typography
            sx={{
              color: 'text.primary',
              fontSize: { md: 20, xs: 18 },
              fontWeight: 700,
            }}
          >
            Dados da conta
          </Typography>
          <Typography
            sx={{
              color: 'text.secondary',
              fontSize: { md: 15, xs: 14 },
              maxWidth: 720,
            }}
          >
            Atualize as informações usadas para identificar seu acesso como
            responsável.
          </Typography>
        </Box>
        <Box
          component="form"
          className="grid gap-3"
          onSubmit={event => {
            event.preventDefault()
            void handleSave()
          }}
          sx={{
            p: 2,
            border: '1px solid',
            borderColor: 'background.border',
            borderRadius: 'var(--app-radius-control)',
          }}
        >
          <Box className="space-y-1">
            <AppInput
              error={nameError}
              helperText={nameError ? 'Informe seu nome completo.' : undefined}
              label="Nome completo"
              onChange={event => updateField('name', event.target.value)}
              placeholder="Ex.: Responsável Silva"
              type="name"
              value={form.name}
            />
            <AppInput
              error={emailError}
              helperText={emailError ? 'Informe um e-mail válido.' : undefined}
              label="E-mail"
              onChange={event => updateField('email', event.target.value)}
              placeholder="responsavel@exemplo.com"
              type="email"
              value={form.email}
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1.5,
              justifyContent: 'space-between',
              minWidth: 0,
            }}
          >
            <Typography
              aria-live="polite"
              sx={{
                color: feedbackMessage?.includes('Não foi possível')
                  ? 'error.main'
                  : 'success.main',
                flex: '1 1 220px',
                fontSize: 14,
                minHeight: 24,
              }}
            >
              {feedbackMessage}
            </Typography>
            <AppButton
              disabled={!canSave}
              startIcon={<SaveRoundedIcon fontSize="small" />}
              type="submit"
            >
              {isSaving ? 'Salvando...' : 'Salvar alterações'}
            </AppButton>
          </Box>
        </Box>
      </AppCard>
      <AppCard>
        <Box className="space-y-1">
          <Typography
            sx={{
              color: 'text.primary',
              fontSize: { md: 20, xs: 18 },
              fontWeight: 700,
              minWidth: 0,
            }}
          >
            Ações de conta
          </Typography>
          <Typography
            sx={{
              color: 'text.secondary',
              fontSize: { md: 15, xs: 14 },
              maxWidth: 720,
            }}
          >
            aassd
          </Typography>
        </Box>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            gap: 1.5,
            minWidth: 0,
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <Box className="-space-y-1">
            <Typography
              sx={{
                fontSize: { md: 18, xs: 16 },
                fontWeight: 700,
              }}
            >
              Alterar senha
            </Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
              Ações de conta podem interromper seu acesso ao painel.
            </Typography>
          </Box>
          <AppButton
            onClick={() => setPendingAction('disable')}
            startIcon={<BlockRoundedIcon fontSize="small" />}
            sx={{
              borderRadius: 'var(--app-radius-control)',
              fontSize: 12,
              fontWeight: 700,
              minHeight: 28,
              textTransform: 'none',
              background: 'transparent',
              border: '1px solid',
              borderColor: 'background.border',
              '&:hover': {
                backgroundColor: selectColor,
              },
            }}
          >
            Trocar senha
          </AppButton>
        </Box>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            gap: 1.5,
            minWidth: 0,
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <Box className="-space-y-1">
            <Typography
              sx={{
                fontSize: { md: 18, xs: 16 },
                fontWeight: 700,
              }}
            >
              Desabilitar Conta
            </Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
              Ações de conta podem interromper seu acesso ao painel.
            </Typography>
          </Box>
          <AppButton
            onClick={() => setPendingAction('disable')}
            startIcon={<BlockRoundedIcon fontSize="small" />}
            sx={{
              borderRadius: 'var(--app-radius-control)',
              fontSize: 12,
              fontWeight: 700,
              minHeight: 28,
              textTransform: 'none',
              background: 'transparent',
              border: '1px solid',
              color: theme.palette.error.main,
              borderColor: theme.palette.error.main,
              '&:hover': {
                backgroundColor: selectColor,
              },
            }}
          >
            Desabilitar conta
          </AppButton>
        </Box>

        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            gap: 1.5,
            minWidth: 0,
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <Box className="-space-y-1">
            <Typography
              sx={{
                fontSize: { md: 18, xs: 16 },
                fontWeight: 700,
              }}
            >
              Excluir conta
            </Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
              Ações de conta podem interromper seu acesso ao painel.
            </Typography>
          </Box>
          <AppButton
            onClick={() => setPendingAction('delete')}
            startIcon={<BlockRoundedIcon fontSize="small" />}
            sx={{
              borderRadius: 'var(--app-radius-control)',
              fontSize: 12,
              fontWeight: 700,
              minHeight: 28,
              textTransform: 'none',
              background: 'transparent',
              border: '1px solid',
              color: theme.palette.error.main,
              borderColor: theme.palette.error.main,
              '&:hover': {
                backgroundColor: selectColor,
              },
            }}
          >
            Excluir conta
          </AppButton>
        </Box>
      </AppCard>

      <AppActionModal
        confirmLabel={actionCopy.confirmLabel}
        confirmTone={pendingAction === 'delete' ? 'error.main' : 'warning.main'}
        description={actionCopy.description}
        loading={isSubmittingAction}
        mode="confirm"
        onClose={() => setPendingAction(null)}
        onConfirm={handleConfirmAccountAction}
        open={pendingAction != null}
        title={actionCopy.title}
        variant="confirm"
      />
    </>
  )
}

export default AccountSettings
