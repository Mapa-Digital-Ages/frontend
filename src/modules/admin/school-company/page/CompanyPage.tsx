import { AppColors } from '@/app/theme/core/colors'
import AppActionModal from '@/shared/ui/AppActionModal'
import AppDropdown from '@/shared/ui/AppDropdown'
import AppInput from '@/shared/ui/AppInput'
import { SearchBarAndFilter } from '@/shared/ui/SearchBarAndFilter'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import BusinessTwoToneIcon from '@mui/icons-material/BusinessTwoTone'
import CancelRoundedIcon from '@mui/icons-material/CancelRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import UploadFileRoundedIcon from '@mui/icons-material/UploadFileRounded'
import { Box, Button, IconButton, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { adminCompanyService } from '@/modules/admin/school-company/services/service'
import type {
  AdminPartnership,
  Company,
  PartnershipStatus,
} from '../types/types'
import BatchImportFeedback from '@/modules/admin/shared/components/BatchImportFeedback'
import CsvTemplateDownloadButton from '@/modules/admin/shared/components/CsvTemplateDownloadButton'
import type { BatchImportResult } from '@/modules/admin/shared/services/batchImport'

const companyTypeOptions = [
  { label: 'Empresa parceira', value: 'Empresa parceira' },
  { label: 'Patrocínio', value: 'Patrocínio' },
  { label: 'Mentoria', value: 'Mentoria' },
  { label: 'Vagas', value: 'Vagas' },
  { label: 'Tecnologia', value: 'Tecnologia' },
]

const PAGE_SIZE = 10

const PARTNERSHIP_STATUS_LABELS: Record<PartnershipStatus, string> = {
  pending: 'Pendente',
  approved: 'Aprovada',
  rejected: 'Recusada',
}

const PARTNERSHIP_STATUS_COLORS: Record<PartnershipStatus, string> = {
  pending: '#f59e0b',
  approved: '#22c55e',
  rejected: '#ef4444',
}

type CompanyCardToneId =
  | 'approved'
  | 'inactive'
  | 'neutral'
  | 'pending'
  | 'rejected'

type CompanyCardTone = {
  color: string
  id: CompanyCardToneId
  label: string
}

const COMPANY_CARD_TONES: Record<CompanyCardToneId, CompanyCardTone> = {
  pending: {
    color: PARTNERSHIP_STATUS_COLORS.pending,
    id: 'pending',
    label: 'Aguardando aprovação',
  },
  approved: {
    color: PARTNERSHIP_STATUS_COLORS.approved,
    id: 'approved',
    label: 'Parceria ativa',
  },
  inactive: {
    color: PARTNERSHIP_STATUS_COLORS.rejected,
    id: 'inactive',
    label: 'Empresa inativa',
  },
  rejected: {
    color: PARTNERSHIP_STATUS_COLORS.rejected,
    id: 'rejected',
    label: 'Solicitação recusada',
  },
  neutral: {
    color: '#64748b',
    id: 'neutral',
    label: 'Sem solicitações',
  },
}

const EMPTY_PARTNERSHIP_COUNTS: Record<PartnershipStatus, number> = {
  approved: 0,
  pending: 0,
  rejected: 0,
}

const COMPANY_CARD_TONE_PRIORITY: Record<CompanyCardToneId, number> = {
  pending: 0,
  approved: 1,
  rejected: 2,
  inactive: 3,
  neutral: 4,
}

function getCompanyCardTone(
  company: Company,
  counts: Record<PartnershipStatus, number>
) {
  if (company.status === 'pendente' || counts.pending > 0) {
    return COMPANY_CARD_TONES.pending
  }

  if (company.status === 'inativa') {
    return COMPANY_CARD_TONES.inactive
  }

  if (counts.approved > 0) {
    return COMPANY_CARD_TONES.approved
  }

  if (counts.rejected > 0) {
    return COMPANY_CARD_TONES.rejected
  }

  return COMPANY_CARD_TONES.neutral
}

interface CompanyPageProps {
  openCreate?: boolean
}

export default function CompanyPage({ openCreate = false }: CompanyPageProps) {
  const theme = useTheme()

  const [companies, setCompanies] = useState<Company[]>([])
  const [partnerships, setPartnerships] = useState<AdminPartnership[]>([])
  const [totalCount, setTotalCount] = useState<number | null>(null)
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('')
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false)
  const [isLoadingPartnerships, setIsLoadingPartnerships] = useState(false)
  const [partnershipActionId, setPartnershipActionId] = useState<string | null>(
    null
  )
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const isLoadingCompaniesRef = useRef(false)
  const hasUserSelectedCompanyRef = useRef(false)
  const [query, setQuery] = useState('')
  const [isNewPartnerOpen, setIsNewPartnerOpen] = useState(openCreate)
  const [companyToDeleteId, setCompanyToDeleteId] = useState<string | null>(
    null
  )
  const [newPartner, setNewPartner] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    type: '',
  })

  const [isBatchCompanyOpen, setIsBatchCompanyOpen] = useState(false)
  const [batchCompanyFile, setBatchCompanyFile] = useState<File | null>(null)
  const [batchCompanyResult, setBatchCompanyResult] =
    useState<BatchImportResult | null>(null)
  const [batchCompanyError, setBatchCompanyError] = useState<string | null>(
    null
  )
  const [isBatchCompanySubmitting, setIsBatchCompanySubmitting] =
    useState(false)

  const loadCompanies = useCallback(
    async (pageToLoad: number, search: string) => {
      if (isLoadingCompaniesRef.current) return
      try {
        isLoadingCompaniesRef.current = true
        setIsLoadingCompanies(true)
        const data = await adminCompanyService.listCompanies(
          pageToLoad,
          PAGE_SIZE,
          search || undefined
        )
        if (data.length < PAGE_SIZE) setHasMore(false)
        setCompanies(prev => {
          const merged = pageToLoad === 1 ? data : [...prev, ...data]
          if (pageToLoad === 1 && merged.length > 0) {
            setSelectedCompanyId(id => id || merged[0].id)
          }
          return merged
        })
      } catch (error) {
        console.error('Erro ao carregar empresas:', error)
      } finally {
        isLoadingCompaniesRef.current = false
        setIsLoadingCompanies(false)
      }
    },
    []
  )

  const loadPartnerships = useCallback(async () => {
    try {
      setIsLoadingPartnerships(true)
      const data = await adminCompanyService.listPartnerships()
      setPartnerships(data)
    } catch (error) {
      console.error('Erro ao carregar parcerias:', error)
    } finally {
      setIsLoadingPartnerships(false)
    }
  }, [])

  useEffect(() => {
    setPage(1)
    setHasMore(true)
    setCompanies([])
    loadCompanies(1, '')
    loadPartnerships()
    adminCompanyService
      .countCompanies()
      .then(setTotalCount)
      .catch(() => {})
  }, [loadCompanies, loadPartnerships])

  useEffect(() => {
    setPage(1)
    setHasMore(true)
    setCompanies([])
    const timer = setTimeout(() => {
      loadCompanies(1, query)
      adminCompanyService
        .countCompanies(query || undefined)
        .then(setTotalCount)
        .catch(() => {})
    }, 350)
    return () => clearTimeout(timer)
  }, [query]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (page === 1) return
    loadCompanies(page, query)
  }, [page]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isLoadingCompanies) {
          setPage(prev => prev + 1)
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, isLoadingCompanies])

  const partnershipCountsByCompany = useMemo(() => {
    const countsByCompany = new Map<string, Record<PartnershipStatus, number>>()

    partnerships.forEach(partnership => {
      const counts = countsByCompany.get(partnership.companyId) ?? {
        ...EMPTY_PARTNERSHIP_COUNTS,
      }

      countsByCompany.set(partnership.companyId, {
        ...counts,
        [partnership.status]: counts[partnership.status] + 1,
      })
    })

    return countsByCompany
  }, [partnerships])

  const filteredCompanies = useMemo(
    () =>
      [...companies].sort((leftCompany, rightCompany) => {
        const leftCounts =
          partnershipCountsByCompany.get(leftCompany.id) ??
          EMPTY_PARTNERSHIP_COUNTS
        const rightCounts =
          partnershipCountsByCompany.get(rightCompany.id) ??
          EMPTY_PARTNERSHIP_COUNTS
        const leftTone = getCompanyCardTone(leftCompany, leftCounts)
        const rightTone = getCompanyCardTone(rightCompany, rightCounts)
        const priorityDifference =
          COMPANY_CARD_TONE_PRIORITY[leftTone.id] -
          COMPANY_CARD_TONE_PRIORITY[rightTone.id]

        if (priorityDifference !== 0) return priorityDifference

        if (leftCounts.pending !== rightCounts.pending) {
          return rightCounts.pending - leftCounts.pending
        }

        if (leftCounts.approved !== rightCounts.approved) {
          return rightCounts.approved - leftCounts.approved
        }

        return leftCompany.name.localeCompare(rightCompany.name, 'pt-BR')
      }),
    [companies, partnershipCountsByCompany]
  )

  const selectedCompany =
    filteredCompanies.find(company => company.id === selectedCompanyId) ??
    filteredCompanies[0]

  const selectedCompanyPartnerships = selectedCompany
    ? partnerships.filter(
        partnership => partnership.companyId === selectedCompany.id
      )
    : []

  useEffect(() => {
    if (filteredCompanies.length === 0) {
      setSelectedCompanyId('')
      return
    }

    const selectedCompanyIsVisible = filteredCompanies.some(
      company => company.id === selectedCompanyId
    )

    if (!selectedCompanyIsVisible || !hasUserSelectedCompanyRef.current) {
      setSelectedCompanyId(filteredCompanies[0].id)
    }
  }, [filteredCompanies, selectedCompanyId])

  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    newPartner.email.trim()
  )

  const passwordIsValid = newPartner.password.length >= 8

  const passwordsMatch =
    newPartner.password.length > 0 &&
    newPartner.password === newPartner.confirmPassword

  const canCreatePartner =
    newPartner.name.trim() !== '' &&
    newPartner.type.trim() !== '' &&
    emailIsValid &&
    passwordIsValid &&
    passwordsMatch

  async function handleCreatePartner() {
    if (!canCreatePartner) return

    try {
      const newCompany = await adminCompanyService.createCompany({
        name: newPartner.name.trim(),
        email: newPartner.email.trim(),
        password: newPartner.password,
        type: newPartner.type.trim(),
      })

      setCompanies(prev => [newCompany, ...prev])
      hasUserSelectedCompanyRef.current = true
      setSelectedCompanyId(newCompany.id)
      setNewPartner({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        type: '',
      })
      setIsNewPartnerOpen(false)
    } catch (error) {
      console.error('Erro ao criar empresa:', error)
    }
  }

  async function handleBatchCompanyImport() {
    if (!batchCompanyFile || isBatchCompanySubmitting) return

    setIsBatchCompanySubmitting(true)
    setBatchCompanyError(null)
    setBatchCompanyResult(null)
    try {
      const result = await adminCompanyService.importCompanies(batchCompanyFile)
      setBatchCompanyResult(result)
      if (result.created > 0) {
        setPage(1)
        setHasMore(true)
        await loadCompanies(1, query)
        const count = await adminCompanyService.countCompanies(
          query || undefined
        )
        setTotalCount(count)
      }
    } catch (error) {
      setBatchCompanyError(
        error instanceof Error
          ? error.message
          : 'Não foi possível importar as empresas.'
      )
    } finally {
      setIsBatchCompanySubmitting(false)
    }
  }

  async function handleDeleteCompany(companyId: string) {
    try {
      await adminCompanyService.deleteCompany(companyId)
      setCompanies(prev => prev.filter(company => company.id !== companyId))
      setPartnerships(prev =>
        prev.filter(partnership => partnership.companyId !== companyId)
      )

      if (selectedCompanyId === companyId) {
        const remaining = companies.filter(company => company.id !== companyId)
        setSelectedCompanyId(remaining[0]?.id ?? '')
      }
    } catch (error) {
      console.error('Erro ao remover empresa:', error)
    }
  }

  async function handleUpdatePartnershipStatus(
    partnershipId: string,
    status: Extract<PartnershipStatus, 'approved' | 'rejected'>
  ) {
    try {
      setPartnershipActionId(partnershipId)
      const updated = await adminCompanyService.updatePartnershipStatus(
        partnershipId,
        status
      )
      setPartnerships(prev =>
        prev.map(partnership =>
          partnership.id === partnershipId ? updated : partnership
        )
      )
    } catch (error) {
      console.error('Erro ao atualizar parceria:', error)
    } finally {
      setPartnershipActionId(null)
    }
  }

  return (
    <Box
      data-testid="empresa-view"
      sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
    >
      <Box
        sx={{
          backgroundColor: 'background.paper',
          borderRadius: '14px',
          border: '1px solid',
          borderColor: 'background.border',
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: 18 }}>
              Empresas parceiras
            </Typography>
            <Typography
              sx={{ color: 'text.secondary', fontSize: 13, mt: 0.25 }}
            >
              Gerencie as empresas cadastradas no sistema.
            </Typography>
          </Box>

          <Button
            startIcon={<AddRoundedIcon />}
            variant="contained"
            disableElevation
            onClick={() => setIsNewPartnerOpen(true)}
            sx={{
              backgroundColor: AppColors.role.admin.secondary,
              borderRadius: '10px',
              fontWeight: 700,
              px: 2.5,
              py: 1,
              textTransform: 'none',
              flexShrink: 0,
              '&:hover': { backgroundColor: theme.palette.error.dark },
            }}
          >
            Nova empresa
          </Button>
        </Box>

        <SearchBarAndFilter
          query={query}
          onQueryChange={setQuery}
          resultsSummary={{
            count: totalCount ?? filteredCompanies.length,
            singularLabel: 'resultado',
            pluralLabel: 'resultado(s)',
          }}
          searchPlaceholder="Pesquisar empresas..."
        />
      </Box>

      {isLoadingCompanies && companies.length === 0 ? (
        <Box
          sx={{
            backgroundColor: 'background.paper',
            border: '1px solid',
            borderColor: 'background.border',
            borderRadius: '18px',
            p: 4,
            textAlign: 'center',
          }}
        >
          <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
            Carregando empresas...
          </Typography>
        </Box>
      ) : !isLoadingCompanies && filteredCompanies.length === 0 ? (
        <Box
          sx={{
            backgroundColor: 'background.paper',
            border: '1px solid',
            borderColor: 'background.border',
            borderRadius: '18px',
            p: 4,
            textAlign: 'center',
          }}
        >
          <Typography sx={{ color: 'text.secondary', fontSize: 14 }}>
            Nenhuma empresa encontrada.
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1fr 1.1fr' },
            gap: 2,
          }}
        >
          <Box
            sx={{
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'background.border',
              borderRadius: '18px',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
            }}
          >
            <Box
              sx={{
                border: '1px solid',
                borderColor: 'background.border',
                borderRadius: '14px',
                p: 2,
              }}
            >
              <Typography sx={{ fontWeight: 700, fontSize: 16 }}>
                Lista de empresas
              </Typography>
              <Typography
                sx={{ color: 'text.secondary', fontSize: 13, mt: 0.5 }}
              >
                Selecione uma empresa para visualizar suas informações.
              </Typography>
            </Box>

            {filteredCompanies.map(company => {
              const isSelected = company.id === selectedCompanyId
              const partnershipCounts =
                partnershipCountsByCompany.get(company.id) ??
                EMPTY_PARTNERSHIP_COUNTS
              const cardTone = getCompanyCardTone(company, partnershipCounts)
              const pendingCount = partnershipCounts.pending
              const approvedCount = partnershipCounts.approved
              const pendingMetricColor =
                pendingCount > 0
                  ? PARTNERSHIP_STATUS_COLORS.pending
                  : cardTone.color
              const approvedMetricColor =
                approvedCount > 0
                  ? PARTNERSHIP_STATUS_COLORS.approved
                  : cardTone.color

              return (
                <Box
                  key={company.id}
                  onClick={() => {
                    hasUserSelectedCompanyRef.current = true
                    setSelectedCompanyId(company.id)
                  }}
                  data-testid={`company-item-${company.id}`}
                  data-selected={isSelected ? 'true' : 'false'}
                  data-status-tone={cardTone.id}
                  sx={{
                    backgroundColor: isSelected
                      ? alpha(cardTone.color, 0.16)
                      : cardTone.id === 'neutral'
                        ? 'background.paper'
                        : alpha(cardTone.color, 0.08),
                    border: '1px solid',
                    borderColor: isSelected
                      ? alpha(cardTone.color, 0.64)
                      : cardTone.id === 'neutral'
                        ? 'background.border'
                        : alpha(cardTone.color, 0.38),
                    borderRadius: '14px',
                    cursor: 'pointer',
                    p: 2,
                    transition:
                      'background-color 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease',
                    '&:hover': {
                      backgroundColor: isSelected
                        ? alpha(cardTone.color, 0.19)
                        : alpha(cardTone.color, 0.11),
                      borderColor: alpha(cardTone.color, 0.58),
                      transform: 'translateY(-1px)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      mb: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '10px',
                        backgroundColor: alpha(cardTone.color, 0.14),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <BusinessTwoToneIcon
                        sx={{
                          color: cardTone.color,
                          fontSize: 20,
                        }}
                      />
                    </Box>

                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: 16 }}>
                        {company.name}
                      </Typography>
                      <Typography
                        sx={{ color: 'text.secondary', fontSize: 12 }}
                      >
                        {company.type}
                      </Typography>
                    </Box>

                    <Typography
                      data-testid={`company-${company.id}-status-tone`}
                      sx={{
                        border: '1px solid',
                        borderColor: alpha(cardTone.color, 0.35),
                        borderRadius: '999px',
                        color: cardTone.color,
                        flexShrink: 0,
                        fontSize: 11,
                        fontWeight: 700,
                        lineHeight: 1,
                        ml: 'auto',
                        px: 1,
                        py: 0.5,
                      }}
                    >
                      {cardTone.label}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: 1.5,
                      mt: 1.5,
                    }}
                  >
                    <Box
                      data-testid={`company-${company.id}-pending-card`}
                      data-status-tone={
                        pendingCount > 0 ? 'pending' : cardTone.id
                      }
                      sx={{
                        border: '1px solid',
                        borderColor: alpha(pendingMetricColor, 0.38),
                        borderRadius: '10px',
                        backgroundColor: alpha(pendingMetricColor, 0.08),
                        p: 1.5,
                      }}
                    >
                      <Typography
                        sx={{ color: 'text.secondary', fontSize: 12 }}
                      >
                        Escolas que deseja patrocinar
                      </Typography>
                      <Typography
                        data-testid={`company-${company.id}-pending-schools`}
                        sx={{
                          color: pendingMetricColor,
                          fontWeight: 700,
                        }}
                      >
                        {pendingCount}
                      </Typography>
                    </Box>

                    <Box
                      data-testid={`company-${company.id}-supported-card`}
                      data-status-tone={
                        approvedCount > 0 ? 'approved' : cardTone.id
                      }
                      sx={{
                        border: '1px solid',
                        borderColor: alpha(approvedMetricColor, 0.36),
                        borderRadius: '10px',
                        backgroundColor: alpha(approvedMetricColor, 0.07),
                        p: 1.5,
                      }}
                    >
                      <Typography
                        sx={{ color: 'text.secondary', fontSize: 12 }}
                      >
                        Escolas apoiadas
                      </Typography>
                      <Typography
                        data-testid={`company-${company.id}-supported-schools`}
                        sx={{
                          color: approvedMetricColor,
                          fontWeight: 700,
                        }}
                      >
                        {approvedCount}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )
            })}

            <Box ref={sentinelRef} sx={{ height: 4 }} />
            {isLoadingCompanies && (
              <Typography
                sx={{
                  color: 'text.secondary',
                  fontSize: 13,
                  textAlign: 'center',
                  py: 1,
                }}
              >
                Carregando...
              </Typography>
            )}
          </Box>

          {selectedCompany && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box
                sx={{
                  backgroundColor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'background.border',
                  borderRadius: '18px',
                  p: 2.5,
                  position: 'relative',
                }}
              >
                <IconButton
                  onClick={() => setCompanyToDeleteId(selectedCompany.id)}
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    width: 32,
                    height: 32,
                    border: '1px solid',
                    borderColor: alpha('#EF4444', 0.25),
                    backgroundColor: alpha('#EF4444', 0.06),
                    color: '#EF4444',
                    '&:hover': { backgroundColor: alpha('#EF4444', 0.12) },
                  }}
                >
                  <DeleteRoundedIcon sx={{ fontSize: 17 }} />
                </IconButton>

                <Typography sx={{ fontWeight: 700, fontSize: 22, pr: 5 }}>
                  {selectedCompany.name}
                </Typography>

                <Box
                  sx={{
                    border: '1px solid',
                    borderColor: 'background.border',
                    backgroundColor: 'background.default',
                    borderRadius: '12px',
                    p: 1.5,
                    mt: 2,
                  }}
                >
                  <Typography sx={{ color: 'text.secondary', fontSize: 12 }}>
                    Contato
                  </Typography>
                  <Typography sx={{ fontWeight: 600, fontSize: 14 }}>
                    {selectedCompany.email}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  backgroundColor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'background.border',
                  borderRadius: '18px',
                  p: 2.5,
                  minHeight: 280,
                }}
              >
                <Typography sx={{ fontWeight: 700, fontSize: 20, mb: 2 }}>
                  Solicitações de parceria
                </Typography>

                {isLoadingPartnerships ? (
                  <Box
                    sx={{
                      border: '1px solid',
                      borderColor: 'background.border',
                      borderRadius: '12px',
                      p: 1.5,
                    }}
                  >
                    <Typography sx={{ color: 'text.secondary', fontSize: 13 }}>
                      Carregando solicitações...
                    </Typography>
                  </Box>
                ) : selectedCompanyPartnerships.length === 0 ? (
                  <Box
                    sx={{
                      border: '1px solid',
                      borderColor: 'background.border',
                      borderRadius: '12px',
                      p: 1.5,
                    }}
                  >
                    <Typography sx={{ fontWeight: 700, fontSize: 15 }}>
                      Nenhuma escola solicitada
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', fontSize: 13 }}>
                      Ainda não há pedidos de apoio para esta empresa.
                    </Typography>
                  </Box>
                ) : (
                  <Box
                    sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}
                  >
                    {selectedCompanyPartnerships.map(partnership => {
                      const isPending = partnership.status === 'pending'
                      const isUpdating = partnershipActionId === partnership.id
                      const statusColor =
                        PARTNERSHIP_STATUS_COLORS[partnership.status]

                      return (
                        <Box
                          key={partnership.id}
                          data-testid={`partnership-item-${partnership.id}`}
                          sx={{
                            border: '1px solid',
                            borderColor: 'background.border',
                            borderRadius: '12px',
                            p: 1.5,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: 2,
                          }}
                        >
                          <Box sx={{ minWidth: 0 }}>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                flexWrap: 'wrap',
                              }}
                            >
                              <Typography
                                sx={{
                                  fontWeight: 700,
                                  fontSize: 15,
                                  overflowWrap: 'anywhere',
                                }}
                              >
                                {partnership.schoolName || 'Escola sem nome'}
                              </Typography>
                              <Typography
                                sx={{
                                  border: '1px solid',
                                  borderColor: alpha(statusColor, 0.32),
                                  borderRadius: '999px',
                                  color: statusColor,
                                  fontSize: 11,
                                  fontWeight: 700,
                                  lineHeight: 1,
                                  px: 1,
                                  py: 0.5,
                                }}
                              >
                                {PARTNERSHIP_STATUS_LABELS[partnership.status]}
                              </Typography>
                            </Box>
                            <Typography
                              sx={{
                                color: 'text.secondary',
                                fontSize: 13,
                                overflowWrap: 'anywhere',
                              }}
                            >
                              {partnership.requestTitle} &bull;{' '}
                              {partnership.grantedSpots} vaga(s)
                            </Typography>
                            <Typography
                              sx={{ color: 'text.secondary', fontSize: 12 }}
                            >
                              Solicitadas: {partnership.requestedSpots} &bull;
                              Restantes: {partnership.remainingSpots}
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              flexShrink: 0,
                            }}
                          >
                            <IconButton
                              aria-label={`Aprovar parceria com ${partnership.schoolName}`}
                              data-testid={`approve-partnership-${partnership.id}`}
                              disabled={!isPending || isUpdating}
                              onClick={() =>
                                handleUpdatePartnershipStatus(
                                  partnership.id,
                                  'approved'
                                )
                              }
                              sx={{
                                width: 30,
                                height: 30,
                                border: '1px solid',
                                borderColor: alpha('#22C55E', 0.35),
                                backgroundColor: alpha('#22C55E', 0.08),
                                color: '#22C55E',
                                '&:hover': {
                                  backgroundColor: alpha('#22C55E', 0.14),
                                },
                                '&.Mui-disabled': {
                                  color: alpha('#22C55E', 0.45),
                                },
                              }}
                            >
                              <CheckCircleRoundedIcon sx={{ fontSize: 17 }} />
                            </IconButton>

                            <IconButton
                              aria-label={`Recusar parceria com ${partnership.schoolName}`}
                              data-testid={`reject-partnership-${partnership.id}`}
                              disabled={!isPending || isUpdating}
                              onClick={() =>
                                handleUpdatePartnershipStatus(
                                  partnership.id,
                                  'rejected'
                                )
                              }
                              sx={{
                                width: 30,
                                height: 30,
                                border: '1px solid',
                                borderColor: alpha('#EF4444', 0.35),
                                backgroundColor: alpha('#EF4444', 0.08),
                                color: '#EF4444',
                                '&:hover': {
                                  backgroundColor: alpha('#EF4444', 0.14),
                                },
                                '&.Mui-disabled': {
                                  color: alpha('#EF4444', 0.45),
                                },
                              }}
                            >
                              <CancelRoundedIcon sx={{ fontSize: 17 }} />
                            </IconButton>
                          </Box>
                        </Box>
                      )
                    })}
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </Box>
      )}

      <AppActionModal
        open={isNewPartnerOpen}
        onClose={() => setIsNewPartnerOpen(false)}
        title="Criar empresa"
        description="Cadastre uma nova empresa parceira."
        onConfirm={handleCreatePartner}
        confirmLabel="Criar empresa"
        cancelLabel="Cancelar"
        confirmColor={AppColors.role.admin.secondary}
        confirmHoverColor={theme.palette.error.dark}
        disableConfirm={!canCreatePartner}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<UploadFileRoundedIcon />}
            onClick={() => {
              setIsNewPartnerOpen(false)
              setIsBatchCompanyOpen(true)
            }}
            sx={{
              borderColor: alpha(AppColors.role.admin.secondary, 0.4),
              color: AppColors.role.admin.secondary,
              borderRadius: '10px',
              fontWeight: 700,
              textTransform: 'none',
              py: 1,
              '&:hover': {
                borderColor: AppColors.role.admin.secondary,
                backgroundColor: alpha(AppColors.role.admin.secondary, 0.05),
              },
            }}
          >
            Cadastrar em lote
          </Button>

          <Box
            sx={{
              borderTop: '1px solid',
              borderColor: 'background.border',
              mt: 0.5,
            }}
          />
          <Box>
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: 14,
                mb: 1,
                color: 'text.primary',
              }}
            >
              Nome da empresa
            </Typography>
            <AppInput
              data-testid="new-company-name"
              placeholder="Ex: Instituto Futuro"
              value={newPartner.name}
              onChange={event =>
                setNewPartner(prev => ({
                  ...prev,
                  name: event.target.value,
                }))
              }
            />
          </Box>

          <Box>
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: 14,
                mb: 1,
                color: 'text.primary',
              }}
            >
              E-mail
            </Typography>
            <AppInput
              data-testid="new-company-email"
              placeholder="Ex: contato@empresa.com"
              type="email"
              value={newPartner.email}
              onChange={event =>
                setNewPartner(prev => ({
                  ...prev,
                  email: event.target.value,
                }))
              }
              error={Boolean(newPartner.email && !emailIsValid)}
              helperText={
                newPartner.email && !emailIsValid
                  ? 'Digite um e-mail válido com @ e domínio.'
                  : undefined
              }
            />
          </Box>

          <Box>
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: 14,
                mb: 1,
                color: 'text.primary',
              }}
            >
              Tipo de parceria
            </Typography>
            <AppDropdown
              data-testid="new-company-type"
              options={companyTypeOptions}
              value={newPartner.type}
              onChange={event =>
                setNewPartner(prev => ({
                  ...prev,
                  type: String(event.target.value),
                }))
              }
              placeholder="Selecione o tipo de parceria"
              fullWidth
            />
          </Box>

          <Box>
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: 14,
                mb: 1,
                color: 'text.primary',
              }}
            >
              Senha
            </Typography>
            <AppInput
              data-testid="new-company-password"
              placeholder="Digite a senha"
              type="password"
              value={newPartner.password}
              onChange={event =>
                setNewPartner(prev => ({
                  ...prev,
                  password: event.target.value,
                }))
              }
              error={Boolean(newPartner.password && !passwordIsValid)}
              helperText="A senha deve ter pelo menos 8 caracteres."
            />
          </Box>

          <Box>
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: 14,
                mb: 1,
                color: 'text.primary',
              }}
            >
              Confirmar senha
            </Typography>
            <AppInput
              data-testid="new-company-confirm-password"
              placeholder="Digite a senha novamente"
              type="password"
              value={newPartner.confirmPassword}
              onChange={event =>
                setNewPartner(prev => ({
                  ...prev,
                  confirmPassword: event.target.value,
                }))
              }
              error={Boolean(newPartner.confirmPassword && !passwordsMatch)}
              helperText={
                newPartner.confirmPassword && !passwordsMatch
                  ? 'As senhas não coincidem.'
                  : undefined
              }
            />
          </Box>
        </Box>
      </AppActionModal>

      {/* Batch company upload modal */}
      <AppActionModal
        open={isBatchCompanyOpen}
        onClose={() => {
          setIsBatchCompanyOpen(false)
          setBatchCompanyFile(null)
          setBatchCompanyResult(null)
          setBatchCompanyError(null)
        }}
        title="Cadastrar empresas em lote"
        description="Envie um arquivo .csv com os dados das empresas."
        onConfirm={() => void handleBatchCompanyImport()}
        confirmLabel="Enviar arquivo"
        cancelLabel="Cancelar"
        confirmColor={AppColors.role.admin.secondary}
        confirmHoverColor={theme.palette.error.dark}
        disableConfirm={!batchCompanyFile || isBatchCompanySubmitting}
        loading={isBatchCompanySubmitting}
      >
        <Box
          component="label"
          sx={{
            border: '1px dashed',
            borderColor: alpha(AppColors.role.admin.secondary, 0.4),
            borderRadius: '14px',
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
            cursor: 'pointer',
            textAlign: 'center',
            backgroundColor: alpha(AppColors.role.admin.secondary, 0.04),
            '&:hover': {
              backgroundColor: alpha(AppColors.role.admin.secondary, 0.08),
            },
          }}
        >
          <UploadFileRoundedIcon
            sx={{ color: AppColors.role.admin.secondary, fontSize: 32 }}
          />
          <Typography sx={{ fontWeight: 700, fontSize: 14 }}>
            {batchCompanyFile
              ? batchCompanyFile.name
              : 'Clique para selecionar um arquivo .csv'}
          </Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: 12 }}>
            Apenas arquivos .csv são aceitos.
          </Typography>
          <input
            type="file"
            accept=".csv,text/csv"
            hidden
            onChange={e => {
              const file = e.target.files?.[0] ?? null
              if (file && !file.name.toLowerCase().endsWith('.csv')) {
                e.target.value = ''
                return
              }
              setBatchCompanyFile(file)
              setBatchCompanyResult(null)
              setBatchCompanyError(null)
            }}
          />
        </Box>
        <CsvTemplateDownloadButton
          color={AppColors.role.admin.secondary}
          template="companies"
        />
        <BatchImportFeedback
          error={batchCompanyError}
          result={batchCompanyResult}
        />
      </AppActionModal>

      <AppActionModal
        mode="confirm"
        open={companyToDeleteId !== null}
        onClose={() => setCompanyToDeleteId(null)}
        onConfirm={() => {
          if (companyToDeleteId) handleDeleteCompany(companyToDeleteId)
          setCompanyToDeleteId(null)
        }}
        title="Excluir empresa"
        description="Essa ação não pode ser desfeita. A empresa será removida permanentemente."
        confirmLabel="Excluir"
        confirmTone="error.main"
      />
    </Box>
  )
}
