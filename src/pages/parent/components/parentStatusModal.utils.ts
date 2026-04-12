export type ParentStatus = 'AGUARDANDO' | 'NEGADO' | 'APROVADO'

export interface ParentStatusModalCopy {
  description: string
  title: string
}

const STATUS_MODAL_COPY: Record<
  Exclude<ParentStatus, 'APROVADO'>,
  ParentStatusModalCopy
> = {
  AGUARDANDO: {
    title: 'Cadastro em Análise',
    description:
      'Recebemos seus dados com sucesso. Seu perfil foi enviado para um administrador e está aguardando aprovação. Sua entrada na plataforma será habilitada logo após essa etapa.',
  },
  NEGADO: {
    title: 'Acesso Negado',
    description:
      'O cadastro associado a este e-mail não foi aprovado pela administração. Para mais informações ou para solicitar uma nova análise, entre em contato com a nossa equipe.',
  },
}

export function getParentStatusModalCopy(
  status: string
): ParentStatusModalCopy | null {
  if (status === 'AGUARDANDO' || status === 'NEGADO') {
    return STATUS_MODAL_COPY[status]
  }

  return null
}

export function shouldOpenParentStatusModal(status: string) {
  return getParentStatusModalCopy(status) !== null
}
