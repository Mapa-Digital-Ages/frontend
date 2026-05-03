import SaveRoundedIcon from '@mui/icons-material/SaveRounded'
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  useTheme,
} from '@mui/material'
import { alpha, Theme } from '@mui/material/styles'
import { useEffect, useMemo, useState } from 'react'
import AppActionModal from '@/shared/ui/AppActionModal'
import AppButton from '@/shared/ui/AppButton'
import AppCard from '@/shared/ui/AppCard'
import AppInput from '@/shared/ui/AppInput'
import type { ParentAccountSettings } from '@/modules/parent/settings/services/service'
import { HowToVoteRounded } from '@mui/icons-material'

interface AccountSettingsProps {
  initialValues: ParentAccountSettings
  onSave?: (settings: ParentAccountSettings) => void | Promise<void>
  onDeleteAccount?: () => void | Promise<void>
}

type PendingAccountAction = 'password' | 'delete' | null

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
  const neutralHoverBackground =
    theme.palette.mode === 'dark'
      ? alpha(theme.palette.common.white, 0.07)
      : alpha(theme.palette.text.primary, 0.05)
  const neutralHoverBorder =
    theme.palette.mode === 'dark'
      ? alpha(theme.palette.common.white, 0.16)
      : alpha(theme.palette.text.primary, 0.12)

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

    if (pendingAction === 'password') {
      setPendingAction(null)
      return
    }

    setIsSubmittingAction(true)
    setFeedbackMessage(null)
    try {
      await onDeleteAccount?.()
      setPendingAction(null)
    } catch {
      setFeedbackMessage('Não foi possível excluir a conta.')
    } finally {
      setIsSubmittingAction(false)
    }
  }

  const actionCopy = (() => {
    if (pendingAction === 'password') {
      return {
        confirmLabel: 'Entendi',
        description:
          'Para alterar a senha, use o fluxo de recuperação na tela de login ou solicite uma redefinição ao suporte.',
        title: 'Alterar senha',
      }
    }

    return {
      confirmLabel: 'Excluir',
      description:
        'Essa ação remove o acesso da conta e pode afetar vínculos existentes com os filhos.',
      title: 'Excluir conta?',
    }
  })()

  return (
    <>
      <AppCard
        contentSx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          minHeight: 0,
          minWidth: 0,
        }}
      >
        <Box>
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
            Gerencie senha, acesso e ações sensíveis vinculadas ao seu perfil.
          </Typography>
        </Box>
        <List
          disablePadding
          sx={{
            display: 'grid',
            gap: 1.5,
          }}
        >
          <ListItem
            disablePadding
            sx={{
              alignItems: { sm: 'center', xs: 'stretch' },
              display: 'flex',
              flexDirection: { sm: 'row', xs: 'column' },
              gap: { sm: 2, xs: 1 },
              justifyContent: 'space-between',
              minWidth: 0,
            }}
          >
            <ListItemText
              primary="Alterar senha"
              secondary="Atualize sua senha de acesso de forma segura."
              sx={{
                minWidth: 0,
                pr: { sm: 2, xs: 0 },
                '& .MuiListItemText-primary': {
                  fontSize: { md: 18, xs: 16 },
                  fontWeight: 700,
                  color: 'text.primary',
                },
                '& .MuiListItemText-secondary': {
                  color: 'text.secondary',
                  fontSize: 14,
                },
              }}
            />
            <AppButton
              backgroundColor="background.paper"
              hasBorder
              hoverBackgroundColor={neutralHoverBackground}
              onClick={() => setPendingAction('password')}
              textColor="text.primary"
              variant="outlined"
              sx={{
                borderColor: 'background.border',
                transition:
                  'background-color 160ms ease, border-color 160ms ease, color 160ms ease, transform 160ms ease',
                '&:hover': {
                  backgroundColor: neutralHoverBackground,
                  borderColor: neutralHoverBorder,
                },
                '&:active': {
                  transform: 'translateY(1px)',
                },
              }}
            >
              Alterar senha
            </AppButton>
          </ListItem>
          <ListItem
            disablePadding
            sx={{
              alignItems: { sm: 'center', xs: 'stretch' },
              display: 'flex',
              flexDirection: { sm: 'row', xs: 'column' },
              gap: { sm: 2, xs: 1 },
              justifyContent: 'space-between',
              minWidth: 0,
            }}
          >
            <ListItemText
              primary="Excluir conta"
              secondary="Remova permanentemente o acesso desta conta."
              sx={{
                minWidth: 0,
                pr: { sm: 2, xs: 0 },
                '& .MuiListItemText-primary': {
                  fontSize: { md: 18, xs: 16 },
                  fontWeight: 700,
                  color: 'text.primary',
                },
                '& .MuiListItemText-secondary': {
                  color: 'text.secondary',
                  fontSize: 14,
                },
              }}
            />
            <AppButton
              backgroundColor={'transparent'}
              hasBorder
              textColor="var(--app-error)"
              hoverBackgroundColor={neutralHoverBackground}
              onClick={() => setPendingAction('delete')}
              sx={{
                borderColor: 'var(--app-error)',
                transition:
                  'background-color 160ms ease, border-color 160ms ease, color 160ms ease, box-shadow 160ms ease, transform 160ms ease',
                '&:hover': {
                  backgroundColor: neutralHoverBackground,
                  borderColor: 'var(--app-error)',
                },
                '&:active': {
                  transform: 'translateY(1px)',
                },
                '&:disabled': {
                  color: alpha(theme.palette.common.white, 0.72),
                  boxShadow: 'none',
                },
              }}
            >
              Excluir conta
            </AppButton>
          </ListItem>
        </List>
      </AppCard>

      <AppActionModal
        confirmLabel={actionCopy.confirmLabel}
        confirmTone={pendingAction === 'delete' ? 'error.main' : 'primary.main'}
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
