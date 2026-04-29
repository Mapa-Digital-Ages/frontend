import AppPageContainer from '@/shared/ui/AppPageContainer'
import PageHeader from '@/shared/ui/PageHeader'
import { useMemo, useState } from 'react'
import { useAuth } from '@/app/auth/hook'
import { parentService, parentSettingsService } from '../services/service'
import AccountSettings from '../components/AccountSettings'
import ChildSettingsModal, {
  type ChildSettingsForm,
  type ChildSettingsModalMode,
} from '../components/ChildSettingsModal'
import ListChildren from '../components/ListChildren'
import { useParentSettings } from '../hooks/useParentSettings'
import type { ParentDashboardChild, ResultsSummary } from '../types/types'

const DEFAULT_PAGE_INDEX = 1
const PAGE_SIZE = 10

const EMPTY_CHILD_FORM: ChildSettingsForm = {
  birth_date: '',
  email: '',
  first_name: '',
  last_name: '',
  password: '',
  student_class: '',
}

interface ChildActionState {
  child: ParentDashboardChild | null
  mode: ChildSettingsModalMode
}

function buildResultsSummary(count: number): ResultsSummary {
  return {
    count,
    pluralLabel: 'resultados',
    singularLabel: 'resultado',
  }
}

function splitChildName(name: string) {
  const [firstName = '', ...lastNameParts] = name.trim().split(/\s+/)
  return {
    first_name: firstName,
    last_name: lastNameParts.join(' '),
  }
}

function classValueFromGrade(grade: string) {
  return grade.match(/\d+/)?.[0] ?? ''
}

function childFormFromChild(child: ParentDashboardChild): ChildSettingsForm {
  return {
    ...EMPTY_CHILD_FORM,
    ...splitChildName(child.name),
    student_class: classValueFromGrade(child.grade),
  }
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function isChildFormValid(
  form: ChildSettingsForm,
  mode: ChildSettingsModalMode | null
) {
  const baseFieldsValid =
    form.first_name.trim() !== '' &&
    form.last_name.trim() !== '' &&
    form.student_class.trim() !== ''

  if (mode === 'edit') {
    return baseFieldsValid
  }

  if (mode === 'create') {
    return (
      baseFieldsValid &&
      form.birth_date.trim() !== '' &&
      isValidEmail(form.email) &&
      form.password.length >= 8
    )
  }

  return true
}

export default function Page() {
  const { logout } = useAuth()
  const {
    children,
    createChild,
    deleteChild,
    selectedChildId,
    selectChild,
    updateChild,
  } = useParentSettings()
  const [accountSettings, setAccountSettings] = useState(() =>
    parentService.getAccountSettings()
  )
  const [query, setQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE_INDEX)
  const [childAction, setChildAction] = useState<ChildActionState | null>(null)
  const [childForm, setChildForm] =
    useState<ChildSettingsForm>(EMPTY_CHILD_FORM)
  const [childFeedback, setChildFeedback] = useState<string | null>(null)
  const [isSubmittingChild, setIsSubmittingChild] = useState(false)

  const filteredChildren = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return children

    return children.filter(child =>
      `${child.name} ${child.grade}`.toLowerCase().includes(normalizedQuery)
    )
  }, [children, query])

  const totalPages = Math.max(1, Math.ceil(filteredChildren.length / PAGE_SIZE))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const visibleChildren = filteredChildren.slice(
    (safeCurrentPage - 1) * PAGE_SIZE,
    safeCurrentPage * PAGE_SIZE
  )
  const childrenResultsSummary = useMemo(
    () => buildResultsSummary(filteredChildren.length),
    [filteredChildren.length]
  )
  const isModalConfirmDisabled =
    !childAction ||
    !isChildFormValid(childForm, childAction.mode) ||
    isSubmittingChild

  function openCreateModal() {
    setChildAction({ child: null, mode: 'create' })
    setChildForm(EMPTY_CHILD_FORM)
    setChildFeedback(null)
  }

  function openEditModal(child: ParentDashboardChild) {
    setChildAction({ child, mode: 'edit' })
    setChildForm(childFormFromChild(child))
    setChildFeedback(null)
  }

  function openDeleteModal(child: ParentDashboardChild) {
    setChildAction({ child, mode: 'delete' })
    setChildForm(childFormFromChild(child))
    setChildFeedback(null)
  }

  function closeChildModal() {
    if (isSubmittingChild) return
    setChildAction(null)
    setChildFeedback(null)
  }

  function updateChildForm(field: keyof ChildSettingsForm, value: string) {
    setChildFeedback(null)
    setChildForm(currentForm => ({ ...currentForm, [field]: value }))
  }

  async function handleChildActionConfirm() {
    if (!childAction || isModalConfirmDisabled) return

    setIsSubmittingChild(true)
    setChildFeedback(null)
    try {
      if (childAction.mode === 'create') {
        await createChild(childForm)
      } else if (childAction.mode === 'edit' && childAction.child) {
        await updateChild(childAction.child.id, {
          birth_date: childForm.birth_date,
          first_name: childForm.first_name,
          last_name: childForm.last_name,
          student_class: childForm.student_class,
        })
      } else if (childAction.mode === 'delete' && childAction.child) {
        await deleteChild(childAction.child.id)
      }

      setChildAction(null)
      setChildForm(EMPTY_CHILD_FORM)
    } catch {
      setChildFeedback('Não foi possível concluir a ação. Tente novamente.')
    } finally {
      setIsSubmittingChild(false)
    }
  }

  return (
    <AppPageContainer className="gap-4">
      <PageHeader
        title={parentSettingsService.getTitle()}
        subtitle="Configure sua conta"
        variant="responsavel"
      />
      <ListChildren
        children={visibleChildren}
        currentPage={safeCurrentPage}
        description="Gerencie os filhos vinculados a este responsável."
        emptyStateDescription="Nenhum filho corresponde à busca atual."
        emptyStateTitle="Nenhum filho encontrado"
        onCreate={openCreateModal}
        onDelete={openDeleteModal}
        onEdit={openEditModal}
        onPageChange={page => setCurrentPage(page)}
        onQueryChange={nextQuery => {
          setQuery(nextQuery)
          setCurrentPage(DEFAULT_PAGE_INDEX)
        }}
        onSelect={selectChild}
        query={query}
        resultsSummary={childrenResultsSummary}
        searchPlaceholder="Pesquisar filhos..."
        selectedChildId={selectedChildId}
        title="Filhos"
        totalPages={totalPages}
      />
      <ChildSettingsModal
        child={childAction?.child}
        disableConfirm={isModalConfirmDisabled}
        feedbackMessage={childFeedback}
        form={childForm}
        mode={childAction?.mode ?? null}
        onChange={updateChildForm}
        onClose={closeChildModal}
        onConfirm={handleChildActionConfirm}
        open={childAction != null}
        submitting={isSubmittingChild}
      />
      <AccountSettings
        initialValues={accountSettings}
        onDeleteAccount={async () => {
          await parentService.deleteAccount()
          logout()
        }}
        onDisableAccount={async () => {
          await parentService.disableAccount()
          logout()
        }}
        onSave={async settings => {
          const updatedSettings =
            await parentService.updateAccountSettings(settings)
          setAccountSettings(updatedSettings)
        }}
      />
    </AppPageContainer>
  )
}
