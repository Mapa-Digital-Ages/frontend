import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import RuleFolderOutlinedIcon from '@mui/icons-material/RuleFolderOutlined'
import { Box, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useNavigate } from 'react-router-dom'
import {
  startTransition,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from 'react'
import LoadingScreen from '@/shared/ui/LoadingScreen'
import PageHeader from '@/shared/ui/PageHeader'
import AppPageContainer from '@/shared/ui/AppPageContainer'
import AppActionModal from '@/shared/ui/AppActionModal'
import { buildAdminCorrectionRoute } from '@/app/router/paths'
import { useUserRole } from '@/app/access/hook'
import { contentApprovalService } from '@/modules/admin/content/services/runtime'
import { subjectService } from '@/modules/admin/content/services/subject/service'
import { uploadApprovalService } from '@/modules/admin/content/services/upload/runtime'
import type {
  ApprovalCardAction,
  ApprovalQueueQuery,
  ApprovalQueueResult,
  ApprovalResultsSummary,
  AdaptiveTrailAdminQuery,
  AdaptiveTrailAdminItem,
  AdaptiveTrailAdminResult,
  ContentApprovalDraftInput,
  ContentApprovalItem,
} from '@/modules/admin/shared/types/types'
import type {
  UploadActivityType,
  UploadApprovalFilter,
  UploadApprovalItem,
  UploadApprovalQuery,
  UploadApprovalResult,
  UploadApprovalStatus,
  UploadEditFormValues,
} from '../types/upload'
import { UPLOAD_APPROVAL_CARD_STATUS } from '@/shared/utils/themes'
import ApprovalActionModal, {
  type ApprovalActionModalMode,
} from '@/modules/admin/shared/components/ApprovalActionModal'
import type {
  ContentApprovalActionFormValues,
  GuardianApprovalActionFormValues,
} from '@/modules/admin/shared/types/types'
import ApprovalComponent, {
  type ApprovalStatusOption,
} from '@/modules/admin/shared/components/ApprovalComponent'
import UploadApprovalComponent, {
  type UploadStatusOption,
} from '../components/UploadApprovalComponent'
import UploadApprovalCard from '../components/UploadApprovalCard'
import UploadActionModal, {
  type UploadActionModalMode,
} from '../components/UploadActionModal'
import AdaptiveTrailManager from '../components/AdaptiveTrailManager'
import ContentCard from '../components/ContentCard'
import TrailCreationModal from '../components/TrailCreationModal'
import MetricsCard from '@/shared/ui/MetricsCard'
import SubjectComponent from '../components/SubjectComponent'
import SubjectCard from '../components/SubjectCard'
import SubjectActionModal, {
  type SubjectActionModalMode,
  type SubjectFormValues,
} from '../components/SubjectActionModal'
import type { SubjectItem } from '@/modules/admin/shared/types/types'
import {
  AdminTrailSubStepFormValues,
  AdminTrailStepFormValues,
  TrailCreationFormValues,
} from '../types/trail'

const DEFAULT_PAGE_INDEX = 1

const DEFAULT_CONTENT_QUERY: ApprovalQueueQuery = {
  page: DEFAULT_PAGE_INDEX,
  pageSize: 10,
  query: '',
  status: 'all',
}

const DEFAULT_UPLOAD_QUERY: UploadApprovalQuery = {
  activityType: 'all',
  page: DEFAULT_PAGE_INDEX,
  pageSize: 10,
  query: '',
  status: 'all',
}

const DEFAULT_TRAIL_QUERY: AdaptiveTrailAdminQuery = {
  page: DEFAULT_PAGE_INDEX,
  pageSize: 6,
  query: '',
  subjectId: 'all',
}

const contentFilterOptions: ApprovalStatusOption[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Enviado', value: 'sent' },
]

const uploadFilterOptions: UploadStatusOption[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Aguardando revisão', value: 'pending' },
  { label: 'Em revisão', value: 'inReview' },
  { label: 'Correção em andamento', value: 'correctionInProgress' },
  { label: 'Corrigido', value: 'corrected' },
  { label: 'Rejeitado', value: 'rejected' },
  { label: 'Exercício', value: 'exercise' },
  { label: 'Redação', value: 'essay' },
  { label: 'Atividade', value: 'activity' },
]

function isUploadActivityFilter(
  filter: UploadApprovalFilter
): filter is UploadActivityType {
  return filter === 'activity' || filter === 'essay' || filter === 'exercise'
}

const DEFAULT_SUBJECT_ID = 'default'
const CONTENT_DESCRIPTION_REQUIRED =
  'A descrição é obrigatória para orientar a geração de trilhas e questionários.'

function emptyContentQueue(
  pageSize: number
): ApprovalQueueResult<ContentApprovalItem> {
  return {
    currentPage: DEFAULT_PAGE_INDEX,
    items: [],
    pageSize,
    totalItems: 0,
    totalPages: 1,
  }
}

function emptyUploadQueue(pageSize: number): UploadApprovalResult {
  return {
    currentPage: DEFAULT_PAGE_INDEX,
    items: [],
    pageSize,
    totalItems: 0,
    totalPages: 1,
  }
}

function emptyTrailQueue(pageSize: number): AdaptiveTrailAdminResult {
  return {
    currentPage: DEFAULT_PAGE_INDEX,
    items: [],
    pageSize,
    totalItems: 0,
    totalPages: 1,
  }
}

function buildResultsSummary(count: number): ApprovalResultsSummary {
  return { count, pluralLabel: 'resultados', singularLabel: 'resultado' }
}

function getTodayRequestDate() {
  return new Intl.DateTimeFormat('pt-BR').format(new Date())
}

function getDefaultContentFormValues(
  subjectId: string = DEFAULT_SUBJECT_ID
): ContentApprovalActionFormValues {
  return {
    type: 'content',
    requestedAt: getTodayRequestDate(),
    subjectId,
    title: '',
    description: '',
  }
}

function createEmptyTrailSubStep(): AdminTrailSubStepFormValues {
  return {
    id: crypto.randomUUID(),
    title: '',
    description: '',
    activityType: 'question',
    questionCount: '5',
    difficulty: '2',
  }
}

function createEmptyTrailStep(): AdminTrailStepFormValues {
  return {
    id: crypto.randomUUID(),
    title: '',
    description: '',
    contentId: '',
    subSteps: [createEmptyTrailSubStep()],
  }
}

function getDefaultTrailFormValues(
  _item?: ContentApprovalItem | null,
  trail?: AdaptiveTrailAdminItem | null
): TrailCreationFormValues {
  if (trail) {
    return {
      title: trail.title ?? trail.name,
      description: trail.description,
      subjectId: trail.subjectId ?? trail.subject?.id ?? DEFAULT_SUBJECT_ID,
      eixo:
        Array.isArray(trail.eixo) && trail.eixo.length > 0
          ? trail.eixo.join(', ')
          : (trail.contentTitle ?? trail.name ?? ''),
      steps: trail.steps?.map(step => ({
        id: step.id,
        title: step.title,
        description: step.description,
        contentId: step.contentId ?? step.subSteps?.[0]?.contentId ?? '',
        subSteps:
          step.subSteps && step.subSteps.length > 0
            ? step.subSteps.map(subStep => ({
                id: subStep.id,
                title: subStep.title,
                description: subStep.description,
                activityType: subStep.activityType,
                questionCount: String(subStep.questionCount ?? 5),
                difficulty: String(subStep.difficulty ?? 2) as '1' | '2' | '3',
              }))
            : [
                {
                  id: crypto.randomUUID(),
                  title: step.title,
                  description: step.description,
                  activityType: step.activityType,
                  questionCount: String(step.questionCount ?? 5),
                  difficulty: String(step.difficulty ?? 2) as '1' | '2' | '3',
                },
              ],
      })) ?? [createEmptyTrailStep()],
    }
  }

  return {
    title: '',
    description: '',
    subjectId: '',
    eixo: '',
    steps: [createEmptyTrailStep()],
  }
}

function getDefaultUploadEditValues(
  item?: UploadApprovalItem
): UploadEditFormValues {
  return { activityType: item?.activityType ?? 'exercise' }
}

export default function Page() {
  const theme = useTheme()
  const navigate = useNavigate()
  const { role, isAdmin } = useUserRole()
  const [subjects, setSubjects] = useState<SubjectItem[]>([])
  const [subjectError, setSubjectError] = useState<string | null>(null)
  const [subjectRefreshKey, setSubjectRefreshKey] = useState(0)
  const [hasLoadedSubjects, setHasLoadedSubjects] = useState(false)
  const [contentQuery, setContentQuery] = useState<ApprovalQueueQuery>(
    DEFAULT_CONTENT_QUERY
  )
  const [contentQueue, setContentQueue] = useState<
    ApprovalQueueResult<ContentApprovalItem>
  >(emptyContentQueue(DEFAULT_CONTENT_QUERY.pageSize))
  const [trailSourceContents, setTrailSourceContents] = useState<
    ContentApprovalItem[]
  >([])
  const [contentError, setContentError] = useState<string | null>(null)
  const [hasLoadedContent, setHasLoadedContent] = useState(false)
  const [contentRefreshKey, setContentRefreshKey] = useState(0)
  const [contentModalState, setContentModalState] =
    useState<ApprovalActionModalMode | null>(null)
  const [contentModalValues, setContentModalValues] =
    useState<ContentApprovalActionFormValues>(getDefaultContentFormValues())
  const [isContentModalSubmitting, setIsContentModalSubmitting] =
    useState(false)
  const [contentSelectionMode, setContentSelectionMode] = useState<
    'edit' | 'delete' | null
  >(null)
  const [isTrailCreateModalOpen, setIsTrailCreateModalOpen] = useState(false)
  const [trailModalTrail, setTrailModalTrail] =
    useState<AdaptiveTrailAdminItem | null>(null)
  const [trailModalValues, setTrailModalValues] =
    useState<TrailCreationFormValues>(getDefaultTrailFormValues())
  const [isTrailModalSubmitting, setIsTrailModalSubmitting] = useState(false)
  const [trailQuery, setTrailQuery] =
    useState<AdaptiveTrailAdminQuery>(DEFAULT_TRAIL_QUERY)
  const [trailQueue, setTrailQueue] = useState<AdaptiveTrailAdminResult>(
    emptyTrailQueue(DEFAULT_TRAIL_QUERY.pageSize)
  )
  const [trailError, setTrailError] = useState<string | null>(null)
  const [hasLoadedTrails, setHasLoadedTrails] = useState(false)
  const [trailRefreshKey, setTrailRefreshKey] = useState(0)
  const [trailDeleteTarget, setTrailDeleteTarget] =
    useState<AdaptiveTrailAdminItem | null>(null)

  const deferredContentSearch = useDeferredValue(contentQuery.query)
  const resolvedContentQuery = useMemo(
    () => ({ ...contentQuery, query: deferredContentSearch }),
    [contentQuery, deferredContentSearch]
  )

  const [uploadQuery, setUploadQuery] =
    useState<UploadApprovalQuery>(DEFAULT_UPLOAD_QUERY)
  const [uploadQueue, setUploadQueue] = useState<UploadApprovalResult>(
    emptyUploadQueue(DEFAULT_UPLOAD_QUERY.pageSize)
  )
  const [uploadTotals, setUploadTotals] = useState<{
    total: number
    bySubject: Record<string, number>
  }>({ total: 0, bySubject: {} })
  const [trailTotals, setTrailTotals] = useState<{
    total: number
    bySubject: Record<string, number>
  }>({ total: 0, bySubject: {} })
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [hasLoadedUploads, setHasLoadedUploads] = useState(false)
  const [uploadRefreshKey, setUploadRefreshKey] = useState(0)
  const [uploadModalState, setUploadModalState] =
    useState<UploadActionModalMode | null>(null)
  const [uploadModalValues, setUploadModalValues] =
    useState<UploadEditFormValues>(getDefaultUploadEditValues())
  const [isUploadModalSubmitting, setIsUploadModalSubmitting] = useState(false)
  const [uploadSelectionMode, setUploadSelectionMode] = useState<
    'edit' | 'delete' | null
  >(null)

  const deferredUploadSearch = useDeferredValue(uploadQuery.query)
  const resolvedUploadQuery = useMemo(
    () => ({ ...uploadQuery, query: deferredUploadSearch }),
    [uploadQuery, deferredUploadSearch]
  )
  const deferredTrailSearch = useDeferredValue(trailQuery.query)
  const resolvedTrailQuery = useMemo(
    () => ({ ...trailQuery, query: deferredTrailSearch }),
    [deferredTrailSearch, trailQuery]
  )

  const contentResultsSummary = useMemo(
    () => buildResultsSummary(contentQueue.totalItems),
    [contentQueue.totalItems]
  )
  const uploadResultsSummary = useMemo(
    () => buildResultsSummary(uploadQueue.totalItems),
    [uploadQueue.totalItems]
  )
  const trailResultsSummary = useMemo(
    () => ({
      count: trailQueue.totalItems,
      pluralLabel: 'trilhas',
      singularLabel: 'trilha',
    }),
    [trailQueue.totalItems]
  )
  const subjectOptions = useMemo(
    () =>
      subjects.map(subject => ({
        label: subject.name,
        value: subject.id,
      })),
    [subjects]
  )
  const trailContentOptions = useMemo(
    () =>
      trailSourceContents
        .filter(content =>
          trailModalValues.subjectId
            ? content.subject?.id === trailModalValues.subjectId
            : true
        )
        .map(content => ({
          label: content.title,
          value: content.id,
        })),
    [trailSourceContents, trailModalValues.subjectId]
  )
  const defaultSubjectId = subjectOptions[0]?.value ?? DEFAULT_SUBJECT_ID
  const selectedUploadFilter: UploadApprovalFilter =
    uploadQuery.activityType !== 'all'
      ? uploadQuery.activityType
      : uploadQuery.status

  const cards = [
    {
      id: 'subjects',
      title: 'Disciplinas',
      value: subjects.length,
    },
    {
      id: 'contents',
      title: 'Conteúdos',
      value: subjects.reduce((sum, s) => sum + s.contentCount, 0),
    },
    {
      id: 'activities',
      title: 'Atividades',
      value: uploadTotals.total,
    },
  ]

  const getSubjectById = useCallback(
    (subjectId: string) => {
      const backendSubject = subjects.find(subject => subject.id === subjectId)
      if (backendSubject) {
        return {
          color: backendSubject.color,
          id: backendSubject.id,
          label: backendSubject.name,
        }
      }
      return { id: subjectId || DEFAULT_SUBJECT_ID, label: 'Geral' }
    },
    [subjects]
  )
  const getContentSubjectId = useCallback(
    (item?: ContentApprovalItem) => {
      const subjectId = item?.subject?.id ? String(item.subject.id) : ''
      if (subjectId && subjects.some(subject => subject.id === subjectId)) {
        return subjectId
      }

      const subjectLabel = item?.subject?.label
      const matchedSubject = subjects.find(
        subject => subject.name === subjectLabel
      )
      return matchedSubject?.id ?? subjectId ?? defaultSubjectId
    },
    [defaultSubjectId, subjects]
  )

  const [subjectModalMode, setSubjectModalMode] =
    useState<SubjectActionModalMode | null>(null)
  const [subjectModalValues, setSubjectModalValues] =
    useState<SubjectFormValues>({ name: '', color: 'rgba(32, 109, 197, 1)' })
  const [isSubjectModalSubmitting, setIsSubjectModalSubmitting] =
    useState(false)

  const resetSubjectModal = useCallback(() => {
    setSubjectModalMode(null)
    setSubjectModalValues({ name: '', color: 'rgba(32, 109, 197, 1)' })
  }, [])

  const handleSubjectModalChange = useCallback(
    (field: keyof SubjectFormValues, value: string) => {
      setSubjectModalValues(current => ({ ...current, [field]: value }))
    },
    []
  )

  const handleSubjectModalConfirm = useCallback(async () => {
    if (!subjectModalMode || isSubjectModalSubmitting) return
    setIsSubjectModalSubmitting(true)
    try {
      if (subjectModalMode.action === 'create') {
        await subjectService.createSubject(
          subjectModalValues.name,
          subjectModalValues.color
        )
      } else if (subjectModalMode.action === 'edit') {
        await subjectService.updateSubject(subjectModalMode.subjectId, {
          name: subjectModalValues.name,
          color: subjectModalValues.color,
        })
      } else if (subjectModalMode.action === 'delete') {
        await subjectService.deleteSubject(subjectModalMode.subjectId)
      }
      setSubjectRefreshKey(key => key + 1)
      resetSubjectModal()
    } finally {
      setIsSubjectModalSubmitting(false)
    }
  }, [
    subjectModalMode,
    subjectModalValues.color,
    subjectModalValues.name,
    isSubjectModalSubmitting,
    resetSubjectModal,
  ])

  const resetContentModal = useCallback(() => {
    setContentModalState(null)
    setContentModalValues(getDefaultContentFormValues(defaultSubjectId))
    setContentSelectionMode(null)
  }, [defaultSubjectId])

  const toggleContentSelectionMode = useCallback(
    (action: 'edit' | 'delete') => {
      setContentSelectionMode(current => (current === action ? null : action))
    },
    []
  )

  const openContentModal = useCallback(
    (nextMode: ApprovalActionModalMode) => {
      setContentModalState(nextMode)
      setContentModalValues({
        type: 'content',
        requestedAt:
          nextMode.action === 'create'
            ? getTodayRequestDate()
            : (nextMode.item?.requestedAt ?? getTodayRequestDate()),
        subjectId:
          nextMode.item?.kind === 'content'
            ? getContentSubjectId(nextMode.item)
            : defaultSubjectId,
        title: nextMode.item?.title ?? '',
        description: nextMode.item?.description ?? '',
      })
    },
    [defaultSubjectId, getContentSubjectId]
  )

  const handleContentItemSelect = useCallback(
    (item: ContentApprovalItem) => {
      if (!contentSelectionMode) return
      setContentSelectionMode(null)
      setContentModalState({
        action: contentSelectionMode,
        item,
        type: 'content',
      })
      setContentModalValues({
        type: 'content',
        requestedAt: item.requestedAt ?? getTodayRequestDate(),
        subjectId: getContentSubjectId(item),
        title: item.title ?? '',
        description: item.description ?? '',
      })
    },
    [contentSelectionMode, getContentSubjectId]
  )

  const handleContentModalChange = useCallback(
    (
      field:
        | keyof ContentApprovalActionFormValues
        | keyof GuardianApprovalActionFormValues,
      value: string
    ) => {
      setContentModalValues(current => ({ ...current, [field]: value }))
    },
    []
  )

  const handleContentModalConfirm = useCallback(async () => {
    if (!contentModalState || isContentModalSubmitting) return
    setIsContentModalSubmitting(true)
    try {
      if (contentModalState.action === 'delete' && contentModalState.item) {
        await contentApprovalService.removeLocalContentItem(
          contentModalState.item.id
        )
        setContentRefreshKey(k => k + 1)
        resetContentModal()
        return
      }
      const payload: ContentApprovalDraftInput = {
        requestedAt: contentModalValues.requestedAt,
        subject: getSubjectById(contentModalValues.subjectId),
        title: contentModalValues.title.trim(),
        description: contentModalValues.description.trim(),
      }
      if (contentModalState.action === 'create') {
        await contentApprovalService.createLocalContentDraft(payload)
      } else if (contentModalState.item) {
        await contentApprovalService.updateLocalContentItem(
          contentModalState.item.id,
          payload
        )
      }
      setContentRefreshKey(k => k + 1)
      resetContentModal()
    } finally {
      setIsContentModalSubmitting(false)
    }
  }, [
    contentModalState,
    contentModalValues,
    getSubjectById,
    isContentModalSubmitting,
    resetContentModal,
  ])

  const isContentModalConfirmDisabled = useMemo(() => {
    if (!contentModalState || contentModalState.action === 'delete')
      return false
    return (
      !contentModalValues.title.trim() || !contentModalValues.description.trim()
    )
  }, [
    contentModalState,
    contentModalValues.description,
    contentModalValues.title,
  ])

  const contentModalDescriptionError = useMemo(() => {
    if (!contentModalState || contentModalState.action === 'delete') return null
    return contentModalValues.description.trim()
      ? null
      : CONTENT_DESCRIPTION_REQUIRED
  }, [contentModalState, contentModalValues.description])

  const resetTrailModal = useCallback(() => {
    setIsTrailCreateModalOpen(false)
    setTrailModalTrail(null)
    setTrailModalValues(getDefaultTrailFormValues())
  }, [])

  const openTrailCreateModal = useCallback(() => {
    setTrailModalTrail(null)
    setIsTrailCreateModalOpen(true)
    setTrailModalValues({
      ...getDefaultTrailFormValues(),
      subjectId: subjectOptions[0]?.value ?? '',
    })
  }, [subjectOptions])

  const openTrailEditModal = useCallback((trail: AdaptiveTrailAdminItem) => {
    setTrailModalTrail(trail)
    setIsTrailCreateModalOpen(false)
    setTrailModalValues(getDefaultTrailFormValues(null, trail))
  }, [])

  // Switching the discipline clears already-picked step contents, since the
  // backend rejects a trail whose contents do not all belong to the subject.
  const handleTrailSubjectChange = useCallback((subjectId: string) => {
    setTrailModalValues(current => ({
      ...current,
      subjectId,
      steps: current.steps.map(step => ({
        ...step,
        contentId: '',
      })),
    }))
  }, [])

  const handleTrailModalChange = useCallback(
    (field: keyof Omit<TrailCreationFormValues, 'steps'>, value: string) => {
      if (field === 'subjectId') {
        handleTrailSubjectChange(value)
        return
      }
      setTrailModalValues(current => ({ ...current, [field]: value }))
    },
    [handleTrailSubjectChange]
  )

  const createBlankTrailSubStep = useCallback(
    (): AdminTrailSubStepFormValues => ({
      id: crypto.randomUUID(),
      title: '',
      description: '',
      activityType: 'question',
      questionCount: '5',
      difficulty: '2',
    }),
    []
  )

  const createBlankTrailStep = useCallback(
    (): AdminTrailStepFormValues => ({
      id: crypto.randomUUID(),
      title: '',
      description: '',
      contentId: '',
      subSteps: [createBlankTrailSubStep()],
    }),
    [createBlankTrailSubStep]
  )

  const handleTrailStepChange = useCallback(
    (
      stepId: string,
      field: keyof Omit<AdminTrailStepFormValues, 'id' | 'subSteps'>,
      value: string
    ) => {
      setTrailModalValues(current => ({
        ...current,
        steps: current.steps.map(step =>
          step.id === stepId ? { ...step, [field]: value } : step
        ),
      }))
    },
    []
  )

  const handleTrailSubStepChange = useCallback(
    (
      stepId: string,
      subStepId: string,
      field: keyof AdminTrailSubStepFormValues,
      value: string
    ) => {
      setTrailModalValues(current => ({
        ...current,
        steps: current.steps.map(step => {
          if (step.id !== stepId) return step

          return {
            ...step,
            subSteps: step.subSteps.map(subStep => {
              if (subStep.id !== subStepId) return subStep

              const nextSubStep = {
                ...subStep,
                [field]: value,
              }

              if (field === 'activityType' && value !== 'question') {
                return {
                  ...nextSubStep,
                  questionCount: '',
                  difficulty: '2',
                }
              }

              if (field === 'activityType' && value === 'question') {
                return {
                  ...nextSubStep,
                  questionCount: nextSubStep.questionCount || '5',
                  difficulty: nextSubStep.difficulty || '2',
                }
              }

              return nextSubStep
            }),
          }
        }),
      }))
    },
    []
  )

  const handleAddTrailStep = useCallback(() => {
    setTrailModalValues(current => ({
      ...current,
      steps: [...current.steps, createBlankTrailStep()],
    }))
  }, [createBlankTrailStep])

  const handleRemoveTrailStep = useCallback((stepId: string) => {
    setTrailModalValues(current => ({
      ...current,
      steps:
        current.steps.length > 1
          ? current.steps.filter(step => step.id !== stepId)
          : current.steps,
    }))
  }, [])

  const handleAddTrailSubStep = useCallback(
    (stepId: string) => {
      setTrailModalValues(current => ({
        ...current,
        steps: current.steps.map(step =>
          step.id === stepId
            ? {
                ...step,
                subSteps: [...step.subSteps, createBlankTrailSubStep()],
              }
            : step
        ),
      }))
    },
    [createBlankTrailSubStep]
  )

  const handleRemoveTrailSubStep = useCallback(
    (stepId: string, subStepId: string) => {
      setTrailModalValues(current => ({
        ...current,
        steps: current.steps.map(step =>
          step.id === stepId && step.subSteps.length > 1
            ? {
                ...step,
                subSteps: step.subSteps.filter(
                  subStep => subStep.id !== subStepId
                ),
              }
            : step
        ),
      }))
    },
    []
  )

  const handleTrailModalConfirm = useCallback(async () => {
    if (isTrailModalSubmitting) return

    const eixo = trailModalValues.eixo
      .split(',')
      .map(item => item.trim())
      .filter(Boolean)

    const payload = {
      title: trailModalValues.title.trim(),
      description: trailModalValues.description.trim(),
      subject_id: trailModalValues.subjectId,
      eixo,
      steps: trailModalValues.steps.map((step, index) => ({
        order: index + 1,
        title: step.title.trim(),
        description: step.description.trim(),
        sub_steps: step.subSteps.map((subStep, subStepIndex) => ({
          order: subStepIndex + 1,
          title: subStep.title.trim(),
          description: subStep.description.trim(),
          content_id: step.contentId,
          activity: {
            type: subStep.activityType,
            question_count:
              subStep.activityType === 'question'
                ? Number(subStep.questionCount)
                : null,
            difficulty:
              subStep.activityType === 'question'
                ? Number(subStep.difficulty)
                : null,
          },
        })),
      })),
    }

    setIsTrailModalSubmitting(true)

    try {
      if (trailModalTrail) {
        await contentApprovalService.updateAdaptiveTrail(
          trailModalTrail.id,
          payload
        )
      } else {
        await contentApprovalService.createAdaptiveTrail(payload)
      }

      setTrailRefreshKey(k => k + 1)
      resetTrailModal()
    } finally {
      setIsTrailModalSubmitting(false)
    }
  }, [
    isTrailModalSubmitting,
    resetTrailModal,
    trailModalTrail,
    trailModalValues,
  ])

  const isTrailModalConfirmDisabled = useMemo(() => {
    if (
      !trailModalValues.title.trim() ||
      !trailModalValues.description.trim() ||
      !trailModalValues.subjectId ||
      !trailModalValues.eixo.trim() ||
      trailModalValues.steps.length === 0
    ) {
      return true
    }

    return trailModalValues.steps.some(step => {
      if (
        !step.title.trim() ||
        !step.description.trim() ||
        !step.contentId ||
        step.subSteps.length === 0
      ) {
        return true
      }

      return step.subSteps.some(subStep => {
        if (
          !subStep.title.trim() ||
          !subStep.description.trim() ||
          !subStep.activityType
        ) {
          return true
        }

        if (subStep.activityType !== 'question') {
          return false
        }

        const questionCount = Number(subStep.questionCount)
        const difficulty = Number(subStep.difficulty)

        return (
          !Number.isFinite(questionCount) ||
          questionCount < 1 ||
          questionCount > 20 ||
          !Number.isFinite(difficulty) ||
          difficulty < 1 ||
          difficulty > 3
        )
      })
    })
  }, [trailModalValues])

  const handleTrailDeleteConfirm = useCallback(async () => {
    if (!trailDeleteTarget || isTrailModalSubmitting) return
    setIsTrailModalSubmitting(true)
    try {
      await contentApprovalService.removeAdaptiveTrail(trailDeleteTarget.id)
      setTrailRefreshKey(k => k + 1)
      setTrailDeleteTarget(null)
    } finally {
      setIsTrailModalSubmitting(false)
    }
  }, [isTrailModalSubmitting, trailDeleteTarget])

  const resetUploadModal = useCallback(() => {
    setUploadModalState(null)
    setUploadModalValues(getDefaultUploadEditValues())
    setUploadSelectionMode(null)
  }, [])

  const toggleUploadSelectionMode = useCallback((action: 'edit' | 'delete') => {
    setUploadSelectionMode(current => (current === action ? null : action))
  }, [])

  const handleUploadItemSelect = useCallback(
    (item: UploadApprovalItem) => {
      if (!uploadSelectionMode) return
      setUploadSelectionMode(null)
      setUploadModalState({ action: uploadSelectionMode, item })
      setUploadModalValues(getDefaultUploadEditValues(item))
    },
    [uploadSelectionMode]
  )

  const handleUploadModalChange = useCallback(
    (
      field: keyof UploadEditFormValues,
      value: UploadEditFormValues[typeof field]
    ) => {
      setUploadModalValues(current => ({ ...current, [field]: value }))
    },
    []
  )

  const handleUploadFilterChange = useCallback(
    (filter: UploadApprovalFilter) => {
      startTransition(() =>
        setUploadQuery(q => ({
          ...q,
          activityType: isUploadActivityFilter(filter) ? filter : 'all',
          page: DEFAULT_PAGE_INDEX,
          status: isUploadActivityFilter(filter) ? 'all' : filter,
        }))
      )
    },
    []
  )

  const handleUploadModalConfirm = useCallback(async () => {
    if (!uploadModalState || isUploadModalSubmitting) return
    setIsUploadModalSubmitting(true)
    try {
      if (uploadModalState.action === 'delete') {
        await uploadApprovalService.removeUpload(uploadModalState.item.id)
        setUploadRefreshKey(k => k + 1)
        resetUploadModal()
        return
      }
      await uploadApprovalService.updateUploadActivityType(
        uploadModalState.item.id,
        uploadModalValues.activityType
      )
      setUploadRefreshKey(k => k + 1)
      resetUploadModal()
    } finally {
      setIsUploadModalSubmitting(false)
    }
  }, [
    uploadModalState,
    isUploadModalSubmitting,
    uploadModalValues.activityType,
    resetUploadModal,
  ])

  const handleUploadStatusUpdate = useCallback(
    async (id: string, status: UploadApprovalStatus) => {
      await uploadApprovalService.updateUploadStatus(id, status)
      setUploadRefreshKey(k => k + 1)
    },
    []
  )

  const buildContentActions = useCallback(
    (item: ContentApprovalItem): ApprovalCardAction[] => {
      const error = theme.palette.error.main
      const warning = theme.palette.warning.main
      return [
        {
          accentColor: warning,
          icon: <EditOutlinedIcon />,
          id: `${item.id}-edit`,
          label: 'Editar Conteúdo',
          onClick: () =>
            openContentModal({ action: 'edit', item, type: 'content' }),
        },
        {
          accentColor: error,
          icon: <DeleteOutlineRoundedIcon />,
          id: `${item.id}-delete`,
          label: 'Excluir Conteúdo',
          onClick: () =>
            openContentModal({ action: 'delete', item, type: 'content' }),
        },
      ]
    },
    [openContentModal, theme.palette]
  )

  const buildUploadActions = useCallback(
    (item: UploadApprovalItem): ApprovalCardAction[] => {
      const success = theme.palette.success.main
      const error = theme.palette.error.main
      const warning = theme.palette.warning.main
      return [
        {
          accentColor: warning,
          icon: <EditOutlinedIcon />,
          id: `${item.id}-edit`,
          label: 'Editar tipo de atividade',
          onClick: () => {
            setUploadModalState({ action: 'edit', item })
            setUploadModalValues(getDefaultUploadEditValues(item))
          },
          priority: 'secondary',
          tooltip: 'Editar tipo de atividade',
        },
        {
          accentColor: success,
          disabled: item.status === 'corrected',
          icon: <CheckRoundedIcon />,
          id: `${item.id}-correct`,
          label: 'Marcar como corrigido',
          onClick: () => {
            void handleUploadStatusUpdate(item.id, 'corrected')
          },
          tooltip: 'Marcar como corrigido',
        },
        {
          accentColor: warning,
          icon: <RuleFolderOutlinedIcon />,
          id: `${item.id}-review`,
          label: 'Iniciar correção',
          onClick: () => {
            navigate(buildAdminCorrectionRoute(item.id))
          },
          tooltip: 'Iniciar correção',
        },
        {
          accentColor: error,
          icon: <DeleteOutlineRoundedIcon />,
          id: `${item.id}-delete`,
          label: 'Excluir upload',
          onClick: () => {
            setUploadModalState({ action: 'delete', item })
          },
          tooltip: 'Excluir upload',
        },
      ]
    },
    [
      handleUploadStatusUpdate,
      navigate,
      theme.palette.error.main,
      theme.palette.success.main,
      theme.palette.warning.main,
    ]
  )

  useEffect(() => {
    let isActive = true
    async function loadSubjects() {
      try {
        const nextSubjects = await subjectService.listSubjects()
        if (!isActive) return
        setSubjectError(null)
        setSubjects(nextSubjects)
      } catch {
        if (!isActive) return
        setSubjectError('Não foi possível carregar as disciplinas do backend.')
        setSubjects([])
      } finally {
        if (isActive) setHasLoadedSubjects(true)
      }
    }
    void loadSubjects()
    return () => {
      isActive = false
    }
  }, [subjectRefreshKey])

  useEffect(() => {
    let isActive = true

    async function loadTrailTotals() {
      try {
        const allTrails = await contentApprovalService.getAdaptiveTrails({
          ...DEFAULT_TRAIL_QUERY,
          pageSize: 100,
          page: DEFAULT_PAGE_INDEX,
          query: '',
          subjectId: 'all',
        })

        if (!isActive) return

        const bySubject = allTrails.items.reduce<Record<string, number>>(
          (acc, trail) => {
            const subjectId =
              trail.subjectId ??
              (trail.subject?.id ? String(trail.subject.id) : null)

            if (subjectId) {
              acc[subjectId] = (acc[subjectId] ?? 0) + 1
            }

            return acc
          },
          {}
        )

        setTrailTotals({
          total: allTrails.totalItems,
          bySubject,
        })
      } catch {
        if (!isActive) return

        setTrailTotals({
          total: 0,
          bySubject: {},
        })
      }
    }

    void loadTrailTotals()

    return () => {
      isActive = false
    }
  }, [trailRefreshKey])

  useEffect(() => {
    let isActive = true
    async function loadContentQueue() {
      try {
        const nextContentQueue =
          await contentApprovalService.getContentQueue(resolvedContentQuery)
        if (!isActive) return
        setContentError(null)
        setContentQueue(nextContentQueue)
      } catch {
        if (!isActive) return
        setContentError(
          'Nenhum conteúdo cadastrado. Cadastre um novo conteúdo para revisão.'
        )
        setContentQueue(emptyContentQueue(DEFAULT_CONTENT_QUERY.pageSize))
      }
      if (isActive) setHasLoadedContent(true)
    }
    void loadContentQueue()
    return () => {
      isActive = false
    }
  }, [resolvedContentQuery, contentRefreshKey])

  useEffect(() => {
    let isActive = true
    async function loadTrailSourceContents() {
      try {
        const sourceQueue = await contentApprovalService.getContentQueue({
          ...DEFAULT_CONTENT_QUERY,
          pageSize: 1000,
        })
        if (!isActive) return
        setTrailSourceContents(sourceQueue.items)
      } catch {
        if (!isActive) return
        setTrailSourceContents([])
      }
    }
    void loadTrailSourceContents()
    return () => {
      isActive = false
    }
  }, [contentRefreshKey])

  useEffect(() => {
    let isActive = true
    async function loadTrails() {
      try {
        const nextTrails =
          await contentApprovalService.getAdaptiveTrails(resolvedTrailQuery)
        if (!isActive) return
        setTrailError(null)
        setTrailQueue(nextTrails)
      } catch {
        if (!isActive) return
        setTrailError('Não foi possível carregar as trilhas adaptativas.')
        setTrailQueue(emptyTrailQueue(DEFAULT_TRAIL_QUERY.pageSize))
      } finally {
        if (isActive) setHasLoadedTrails(true)
      }
    }
    void loadTrails()
    return () => {
      isActive = false
    }
  }, [resolvedTrailQuery, trailRefreshKey])

  useEffect(() => {
    let isActive = true
    async function loadUploadQueue() {
      try {
        const nextUploadQueue =
          await uploadApprovalService.getUploadQueue(resolvedUploadQuery)
        if (!isActive) return
        setUploadError(null)
        setUploadQueue(nextUploadQueue)
      } catch {
        if (!isActive) return
        setUploadError('Nenhum upload encontrado.')
        setUploadQueue(emptyUploadQueue(DEFAULT_UPLOAD_QUERY.pageSize))
      }
      if (isActive) setHasLoadedUploads(true)
    }
    void loadUploadQueue()
    return () => {
      isActive = false
    }
  }, [resolvedUploadQuery, uploadRefreshKey])

  useEffect(() => {
    let isActive = true
    async function loadUploadTotals() {
      try {
        const allUploads = await uploadApprovalService.getUploadQueue({
          ...DEFAULT_UPLOAD_QUERY,
          pageSize: 100,
        })
        if (!isActive) return
        const bySubject = allUploads.items.reduce<Record<string, number>>(
          (acc, item) => {
            const subjectId = item.subject?.id ? String(item.subject.id) : null
            if (subjectId) {
              acc[subjectId] = (acc[subjectId] ?? 0) + 1
            }
            return acc
          },
          {}
        )
        setUploadTotals({ total: allUploads.totalItems, bySubject })
      } catch {
        if (!isActive) return
        setUploadTotals({ total: 0, bySubject: {} })
      }
    }
    void loadUploadTotals()
    return () => {
      isActive = false
    }
  }, [uploadRefreshKey])

  if (
    !isAdmin ||
    role !== 'admin' ||
    !hasLoadedSubjects ||
    !hasLoadedContent ||
    !hasLoadedUploads ||
    !hasLoadedTrails
  ) {
    return <LoadingScreen />
  }

  return (
    <AppPageContainer className="gap-4 md:gap-5">
      <PageHeader
        title="Configrações da Trilha"
        subtitle="Revise conteúdos enviados e valide materiais antes de liberar o acesso na plataforma."
        variant="admin"
      />

      <Box className="grid grid-cols-1 xs:grid-cols-1 lg:grid-cols-3 md:grid-cols-3 gap-3 md:gap-4 xl:grid-cols-3">
        {cards.map(card => (
          <MetricsCard contentClassName="p-5" key={card.id} {...card} />
        ))}
      </Box>

      <Box>
        <SubjectComponent
          description="Gerencie e cadastre novas disciplinas para todo o sistema"
          emptyStateDescription={
            subjectError ?? 'Cadastre uma nova disciplina para iniciar.'
          }
          emptyStateTitle="Nenhuma disciplina encontrada"
          items={subjects}
          onCreate={() => {
            setSubjectModalValues({ name: '', color: 'rgba(32, 109, 197, 1)' })
            setSubjectModalMode({ action: 'create' })
          }}
          renderItem={item => (
            <SubjectCard
              item={item}
              trailCount={trailTotals.bySubject[item.id] ?? item.trailsCount}
              onDelete={subject => {
                setSubjectModalMode({
                  action: 'delete',
                  subjectId: subject.id,
                  subjectName: subject.name,
                })
              }}
              onEdit={subject => {
                setSubjectModalValues({
                  name: subject.name,
                  color: subject.color ?? 'rgba(32, 109, 197, 1)',
                })
                setSubjectModalMode({
                  action: 'edit',
                  subjectId: subject.id,
                  subjectName: subject.name,
                })
              }}
            />
          )}
          role={role}
          title="Cadastro de disciplinas"
        />
      </Box>
      <Box
        sx={{
          alignItems: 'stretch',
          display: 'grid',
          gap: 2,
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(2, minmax(0, 1fr))',
          },
        }}
      >
        <ApprovalComponent
          currentPage={contentQueue.currentPage}
          description="Cadastre e mantenha conteúdos vinculados às disciplinas."
          emptyStateDescription={
            contentError ??
            'Tente outro filtro ou cadastre um novo conteúdo para iniciar a revisão.'
          }
          emptyStateTitle="Nenhum conteúdo encontrado"
          filterOptions={contentFilterOptions}
          items={contentQueue.items}
          onCreate={() =>
            openContentModal({ action: 'create', type: 'content' })
          }
          onEdit={() => toggleContentSelectionMode('edit')}
          onDelete={() => toggleContentSelectionMode('delete')}
          onItemSelect={handleContentItemSelect}
          selectionMode={contentSelectionMode}
          onPageChange={page => {
            startTransition(() => setContentQuery(q => ({ ...q, page })))
          }}
          onQueryChange={query => {
            startTransition(() =>
              setContentQuery(q => ({ ...q, page: DEFAULT_PAGE_INDEX, query }))
            )
          }}
          onStatusChange={status => {
            startTransition(() =>
              setContentQuery(q => ({ ...q, page: DEFAULT_PAGE_INDEX, status }))
            )
          }}
          query={contentQuery.query}
          renderItem={item => (
            <ContentCard
              actions={buildContentActions(item)}
              item={item}
              type="content"
            />
          )}
          resultsSummary={contentResultsSummary}
          role={role}
          searchPlaceholder="Pesquisar conteúdos..."
          selectedStatus={contentQuery.status}
          title="Lista e Cadastro de Conteúdos"
          totalPages={contentQueue.totalPages}
        />

        <UploadApprovalComponent
          currentPage={uploadQueue.currentPage}
          description="Revise e corrija as atividades enviadas pelos alunos."
          emptyStateDescription={
            uploadError ?? 'Nenhuma atividade encontrado. Tente outro filtro.'
          }
          emptyStateTitle="Nenhum upload encontrado"
          filterOptions={uploadFilterOptions}
          items={uploadQueue.items}
          onEdit={() => toggleUploadSelectionMode('edit')}
          onDelete={() => toggleUploadSelectionMode('delete')}
          onItemSelect={handleUploadItemSelect}
          selectionMode={uploadSelectionMode}
          onPageChange={page => {
            startTransition(() => setUploadQuery(q => ({ ...q, page })))
          }}
          onQueryChange={query => {
            startTransition(() =>
              setUploadQuery(q => ({ ...q, page: DEFAULT_PAGE_INDEX, query }))
            )
          }}
          onStatusChange={handleUploadFilterChange}
          query={uploadQuery.query}
          renderItem={item => (
            <UploadApprovalCard
              actions={buildUploadActions(item)}
              item={item}
              status={UPLOAD_APPROVAL_CARD_STATUS[item.status]}
            />
          )}
          resultsSummary={uploadResultsSummary}
          role={role}
          searchPlaceholder="Pesquisar uploads..."
          selectedStatus={selectedUploadFilter}
          title="Atividades de Alunos"
          totalPages={uploadQueue.totalPages}
        />
      </Box>
      <AdaptiveTrailManager
        contentOptions={trailContentOptions}
        currentPage={trailQueue.currentPage}
        emptyStateDescription={
          trailError ??
          'Crie uma trilha a partir de um conteúdo cadastrado ou ajuste os filtros.'
        }
        filterOptions={[
          { label: 'Todas as disciplinas', value: 'all' },
          ...subjectOptions,
        ]}
        contents={trailSourceContents}
        isLoading={!hasLoadedTrails}
        onCreateTrail={openTrailCreateModal}
        onDeleteTrail={trail => setTrailDeleteTarget(trail)}
        onEditTrail={openTrailEditModal}
        onPageChange={page => {
          startTransition(() => setTrailQuery(q => ({ ...q, page })))
        }}
        onQueryChange={query => {
          startTransition(() =>
            setTrailQuery(q => ({ ...q, page: DEFAULT_PAGE_INDEX, query }))
          )
        }}
        onSubjectChange={subjectId => {
          startTransition(() =>
            setTrailQuery(q => ({
              ...q,
              page: DEFAULT_PAGE_INDEX,
              subjectId,
            }))
          )
        }}
        query={trailQuery.query}
        resultsSummary={trailResultsSummary}
        role={role}
        selectedSubjectId={trailQuery.subjectId}
        totalPages={trailQueue.totalPages}
        trails={trailQueue.items}
      />

      <ApprovalActionModal
        mode={contentModalState}
        disableConfirm={isContentModalConfirmDisabled}
        isSubmitting={isContentModalSubmitting}
        onChange={handleContentModalChange}
        onClose={resetContentModal}
        onConfirm={handleContentModalConfirm}
        open={contentModalState !== null}
        role={role}
        subjectOptions={subjectOptions}
        errorMessage={contentModalDescriptionError}
        values={contentModalValues}
      />

      <TrailCreationModal
        content={null}
        contentOptions={trailContentOptions}
        disableConfirm={isTrailModalConfirmDisabled}
        isSubmitting={isTrailModalSubmitting}
        mode={trailModalTrail ? 'edit' : 'create'}
        onChange={handleTrailModalChange}
        onClose={resetTrailModal}
        onConfirm={handleTrailModalConfirm}
        open={isTrailCreateModalOpen || trailModalTrail !== null}
        subjectOptions={subjectOptions}
        trail={trailModalTrail}
        values={trailModalValues}
        onStepChange={handleTrailStepChange}
        onSubStepChange={handleTrailSubStepChange}
        onAddStep={handleAddTrailStep}
        onRemoveStep={handleRemoveTrailStep}
        onAddSubStep={handleAddTrailSubStep}
        onRemoveSubStep={handleRemoveTrailSubStep}
      />

      <AppActionModal
        confirmLabel="Excluir trilha"
        confirmTone="error.main"
        description="Esta ação remove a trilha e seus vínculos de progresso. O conteúdo base permanece cadastrado."
        loading={isTrailModalSubmitting}
        mode="confirm"
        onClose={() => setTrailDeleteTarget(null)}
        onConfirm={handleTrailDeleteConfirm}
        open={trailDeleteTarget !== null}
        title="Excluir trilha adaptativa"
      >
        <Typography sx={{ color: 'text.primary', fontSize: 14 }}>
          Deseja excluir a trilha &quot;{trailDeleteTarget?.name}&quot;?
        </Typography>
      </AppActionModal>

      <UploadActionModal
        mode={uploadModalState}
        isSubmitting={isUploadModalSubmitting}
        onChange={handleUploadModalChange}
        onClose={resetUploadModal}
        onConfirm={handleUploadModalConfirm}
        open={uploadModalState !== null}
        role={role}
        values={uploadModalValues}
      />

      <SubjectActionModal
        mode={subjectModalMode}
        isSubmitting={isSubjectModalSubmitting}
        onChange={handleSubjectModalChange}
        onClose={resetSubjectModal}
        onConfirm={handleSubjectModalConfirm}
        open={subjectModalMode !== null}
        role={role}
        values={subjectModalValues}
      />
    </AppPageContainer>
  )
}
