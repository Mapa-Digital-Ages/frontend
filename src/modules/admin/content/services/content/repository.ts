import type { ApiResponse, HttpRequestOptions } from '@/shared/types/api'
import type {
  ApprovalQueueQuery,
  AdaptiveTrailAdminQuery,
  AdaptiveTrailAdminResult,
  AdaptiveTrailAdminItem,
  AdaptiveTrailMutationResult,
  AdaptiveTrailPayload,
  AdaptiveTrailUpdateInput,
  ContentApprovalDraftInput,
  ContentCorrectionMessageInput,
  ContentCorrectionSession,
} from '@/modules/admin/shared/types/types'
import {
  buildApprovalQueueQuery,
  mapContentApprovalItem,
  mapContentApprovalQueueResponse,
  type ApprovalQueueResponseDto,
  type ContentApprovalDto,
} from './mapper'

export type ApprovalApiClient = {
  get<T>(
    path: string,
    options?: { query?: HttpRequestOptions['query'] }
  ): Promise<ApiResponse<T>>
  post<T>(path: string, body?: unknown): Promise<ApiResponse<T>>
  patch<T>(path: string, body?: unknown): Promise<ApiResponse<T>>
  delete<T>(path: string): Promise<ApiResponse<T>>
}

export interface CreateContentApprovalRepositoryOptions {
  client: ApprovalApiClient
}

function buildContentDraftPayload(input?: ContentApprovalDraftInput) {
  const subjectId = input?.subject?.id ? Number(input.subject.id) : undefined

  return {
    description: input?.description.trim() ?? '',
    ...(Number.isFinite(subjectId) ? { subject_id: subjectId } : {}),
    title: input?.title?.trim() || 'Novo conteúdo',
  }
}

function toBackendContentId(id: string) {
  return id.replace(/^content-/, '')
}

interface AdaptiveTrailMutationDto {
  exercise_ids: number[]
  item_ids: number[]
  path_id: number
  sub_path_ids: number[]
}

interface AdaptiveTrailStepDto {
  id: string
  order: number
  title: string
  description: string
  subSteps?: AdaptiveTrailSubStepDto[]
  contentId: string
  contentTitle?: string | null
  activityType: 'text' | 'video' | 'question'
  questionCount?: number | null
  difficulty?: number | null
}

interface AdaptiveTrailSubStepDto {
  id: string
  order: number
  title: string
  description: string
  contentId: string
  contentTitle?: string | null
  activityType: 'text' | 'video' | 'question'
  questionCount?: number | null
  difficulty?: number | null
}

interface AdaptiveTrailDto {
  content_id: number
  content_title: string
  description: string
  eixo?: string[]
  id: number
  name: string
  question_count: number
  step_count?: number
  steps?: AdaptiveTrailStepDto[]
  subject_id?: string
  subject?: {
    color?: string | null
    id: string
    name: string
  }
}

interface AdaptiveTrailResponseDto {
  items: AdaptiveTrailDto[]
  page: number
  page_size: number
  total_items: number
  total_pages: number
}

function buildAdaptiveTrailPayload(input: AdaptiveTrailPayload) {
  return {
    description: input.description.trim(),
    eixo: input.eixo,
    subject_id: Number(input.subject_id),
    steps: input.steps.map(step => ({
      description: step.description.trim(),
      order: step.order,
      sub_steps: step.sub_steps.map(subStep => ({
        activity: {
          difficulty: subStep.activity.difficulty,
          question_count: subStep.activity.question_count,
          type: subStep.activity.type,
        },
        content_id: Number(subStep.content_id),
        description: subStep.description.trim(),
        order: subStep.order,
        title: subStep.title.trim(),
      })),
      title: step.title.trim(),
    })),
    title: input.title.trim(),
  }
}

function mapAdaptiveTrailMutationResult(
  dto: AdaptiveTrailMutationDto
): AdaptiveTrailMutationResult {
  return {
    exerciseIds: dto.exercise_ids,
    itemIds: dto.item_ids,
    pathId: dto.path_id,
    subPathIds: dto.sub_path_ids,
  }
}

function mapAdaptiveTrail(dto: AdaptiveTrailDto): AdaptiveTrailAdminItem {
  const subjectId = dto.subject_id ?? dto.subject?.id ?? ''
  return {
    contentId: String(dto.content_id),
    contentTitle: dto.content_title,
    description: dto.description,
    eixo: dto.eixo ?? [],
    id: String(dto.id),
    name: dto.name,
    questionCount: dto.question_count,
    stepCount: dto.step_count ?? dto.steps?.length ?? 0,
    steps: (dto.steps ?? []).map(step => {
      const subSteps = (step.subSteps ?? []).map(subStep => ({
        activityType: subStep.activityType,
        contentId: subStep.contentId,
        contentTitle: subStep.contentTitle ?? undefined,
        description: subStep.description,
        difficulty: subStep.difficulty ?? null,
        id: subStep.id,
        order: subStep.order,
        questionCount: subStep.questionCount ?? null,
        title: subStep.title,
      }))

      return {
        activityType: step.activityType,
        contentId: step.contentId,
        contentTitle: step.contentTitle ?? undefined,
        description: step.description,
        difficulty: step.difficulty ?? null,
        id: step.id,
        order: step.order,
        questionCount: step.questionCount ?? null,
        subSteps,
        title: step.title,
      }
    }),
    subjectId,
    subject: dto.subject
      ? {
          color: dto.subject.color ?? undefined,
          id: dto.subject.id,
          label: dto.subject.name,
        }
      : undefined,
    title: dto.name,
  }
}

function buildAdaptiveTrailQuery(query: AdaptiveTrailAdminQuery) {
  const subjectId = Number(query.subjectId)
  return {
    page: query.page,
    page_size: query.pageSize,
    query: query.query.trim() || undefined,
    subject_id:
      query.subjectId !== 'all' && Number.isFinite(subjectId)
        ? subjectId
        : undefined,
  } satisfies HttpRequestOptions['query']
}

function mapAdaptiveTrailResponse(
  data: AdaptiveTrailResponseDto
): AdaptiveTrailAdminResult {
  return {
    currentPage: data.page,
    items: (data.items ?? []).map(mapAdaptiveTrail),
    pageSize: data.page_size,
    totalItems: data.total_items,
    totalPages: data.total_pages,
  }
}

export function createContentApprovalRepository({
  client,
}: CreateContentApprovalRepositoryOptions) {
  return {
    async getContentQueue(query: ApprovalQueueQuery) {
      const response = await client.get<
        ApprovalQueueResponseDto<ContentApprovalDto>
      >('admin/content', {
        query: buildApprovalQueueQuery(query),
      })

      return mapContentApprovalQueueResponse(response)
    },
    async createLocalContentDraft(input?: ContentApprovalDraftInput) {
      const response = await client.post<ContentApprovalDto>(
        'admin/content',
        buildContentDraftPayload(input)
      )

      return mapContentApprovalItem(response.data)
    },
    async updateLocalContentItem(id: string, input: ContentApprovalDraftInput) {
      const response = await client.patch<ContentApprovalDto>(
        `admin/content/${toBackendContentId(id)}`,
        buildContentDraftPayload(input)
      )

      return mapContentApprovalItem(response.data)
    },
    async removeLocalContentItem(id: string) {
      await client.delete<unknown>(`admin/content/${toBackendContentId(id)}`)
    },
    async createAdaptiveTrail(input: AdaptiveTrailPayload) {
      const response = await client.post<AdaptiveTrailMutationDto>(
        'admin/trails/structured',
        buildAdaptiveTrailPayload(input)
      )

      return mapAdaptiveTrailMutationResult(response.data)
    },
    async getAdaptiveTrails(query: AdaptiveTrailAdminQuery) {
      const response = await client.get<AdaptiveTrailResponseDto>(
        'admin/trails',
        { query: buildAdaptiveTrailQuery(query) }
      )

      return mapAdaptiveTrailResponse(response.data)
    },
    async updateAdaptiveTrail(id: string, input: AdaptiveTrailUpdateInput) {
      const response = await client.patch<AdaptiveTrailMutationDto>(
        `admin/trails/${id}/structured`,
        buildAdaptiveTrailPayload(input)
      )

      return mapAdaptiveTrailMutationResult(response.data)
    },
    async removeAdaptiveTrail(id: string) {
      await client.delete<unknown>(`admin/trails/${id}`)
    },
    async getContentCorrectionSession(
      id: string
    ): Promise<ContentCorrectionSession> {
      return buildEmptyCorrectionSession(id)
    },
    async markContentCorrectionInProgress(
      id: string
    ): Promise<ContentCorrectionSession> {
      return { ...buildEmptyCorrectionSession(id), status: 'inProgress' }
    },
    async sendContentCorrectionMessage(
      id: string,
      _input: ContentCorrectionMessageInput
    ): Promise<ContentCorrectionSession> {
      return buildEmptyCorrectionSession(id)
    },
  }
}

function buildEmptyCorrectionSession(id: string): ContentCorrectionSession {
  return {
    contentId: id,
    status: 'pending',
    messages: [],
    requestedAt: '',
    subtitle: '',
    title: '',
    uploadFileName: '',
  }
}
