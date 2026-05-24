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
import { Box, Button, IconButton, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { useEffect, useState } from 'react'

import { adminCompanyService } from '@/modules/admin/school-company/services/service'
import { Company } from '../types/types'

const companyTypeOptions = [
  { label: 'Empresa parceira', value: 'Empresa parceira' },
  { label: 'Patrocínio', value: 'Patrocínio' },
  { label: 'Mentoria', value: 'Mentoria' },
  { label: 'Vagas', value: 'Vagas' },
  { label: 'Tecnologia', value: 'Tecnologia' },
]

export default function CompanyPage() {
  const theme = useTheme()

  const [companies, setCompanies] = useState<Company[]>([])
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('')
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false)
  const [query, setQuery] = useState('')
  const [isNewPartnerOpen, setIsNewPartnerOpen] = useState(false)
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

  useEffect(() => {
    async function loadCompanies() {
      try {
        setIsLoadingCompanies(true)
        const data = await adminCompanyService.listCompanies()
        setCompanies(data)
        setSelectedCompanyId(data.length > 0 ? data[0].id : '')
      } catch (error) {
        console.error('Erro ao carregar empresas:', error)
      } finally {
        setIsLoadingCompanies(false)
      }
    }

    loadCompanies()
  }, [])

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(query.toLowerCase())
  )

  const selectedCompany =
    companies.find(company => company.id === selectedCompanyId) ??
    filteredCompanies[0]

  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    newPartner.email.trim()
  )

  const passwordIsValid =
    newPartner.password.length >= 8 &&
    /[A-Z]/.test(newPartner.password) &&
    /[a-z]/.test(newPartner.password) &&
    /[0-9]/.test(newPartner.password)

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

  async function handleDeleteCompany(companyId: string) {
    try {
      await adminCompanyService.deleteCompany(companyId)
      setCompanies(prev => prev.filter(company => company.id !== companyId))

      if (selectedCompanyId === companyId) {
        const remaining = companies.filter(company => company.id !== companyId)
        setSelectedCompanyId(remaining[0]?.id ?? '')
      }
    } catch (error) {
      console.error('Erro ao remover empresa:', error)
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
            count: filteredCompanies.length,
            singularLabel: 'resultado',
            pluralLabel: 'resultado(s)',
          }}
          searchPlaceholder="Pesquisar empresas..."
        />
      </Box>

      {isLoadingCompanies ? (
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
      ) : filteredCompanies.length === 0 ? (
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

              return (
                <Box
                  key={company.id}
                  onClick={() => setSelectedCompanyId(company.id)}
                  data-testid={`company-item-${company.id}`}
                  sx={{
                    backgroundColor: isSelected
                      ? alpha(AppColors.role.admin.secondary, 0.07)
                      : 'background.paper',
                    border: '1px solid',
                    borderColor: isSelected
                      ? alpha(AppColors.role.admin.secondary, 0.28)
                      : 'background.border',
                    borderRadius: '14px',
                    cursor: 'pointer',
                    p: 2,
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
                        backgroundColor: alpha(
                          AppColors.role.admin.secondary,
                          0.12
                        ),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <BusinessTwoToneIcon
                        sx={{
                          color: AppColors.role.admin.secondary,
                          fontSize: 20,
                        }}
                      />
                    </Box>

                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: 16 }}>
                        {company.name}
                      </Typography>
                      <Typography
                        sx={{ color: 'text.secondary', fontSize: 12 }}
                      >
                        {company.type}
                      </Typography>
                    </Box>
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
                      sx={{
                        border: '1px solid',
                        borderColor: 'background.border',
                        borderRadius: '10px',
                        backgroundColor: 'background.default',
                        p: 1.5,
                      }}
                    >
                      <Typography
                        sx={{ color: 'text.secondary', fontSize: 12 }}
                      >
                        Escolas que deseja patrocinar
                      </Typography>
                      <Typography sx={{ fontWeight: 700 }}>0</Typography>
                    </Box>

                    <Box
                      sx={{
                        border: '1px solid',
                        borderColor: 'background.border',
                        borderRadius: '10px',
                        backgroundColor: 'background.default',
                        p: 1.5,
                      }}
                    >
                      <Typography
                        sx={{ color: 'text.secondary', fontSize: 12 }}
                      >
                        Escolas apoiadas
                      </Typography>
                      <Typography sx={{ fontWeight: 700 }}>0</Typography>
                    </Box>
                  </Box>
                </Box>
              )
            })}
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

                <Box
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
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: 15 }}>
                      Nenhuma escola solicitada
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', fontSize: 13 }}>
                      Ainda não há pedidos de apoio para esta empresa.
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        border: '1px solid',
                        borderColor: alpha('#22C55E', 0.35),
                        backgroundColor: alpha('#22C55E', 0.08),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'not-allowed',
                        opacity: 0.5,
                      }}
                    >
                      <CheckCircleRoundedIcon
                        sx={{ color: '#22C55E', fontSize: 17 }}
                      />
                    </Box>

                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        border: '1px solid',
                        borderColor: alpha('#EF4444', 0.35),
                        backgroundColor: alpha('#EF4444', 0.08),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'not-allowed',
                        opacity: 0.5,
                      }}
                    >
                      <CancelRoundedIcon
                        sx={{ color: '#EF4444', fontSize: 17 }}
                      />
                    </Box>
                  </Box>
                </Box>
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
              placeholder="Mínimo 8 caracteres"
              type="password"
              value={newPartner.password}
              onChange={event =>
                setNewPartner(prev => ({
                  ...prev,
                  password: event.target.value,
                }))
              }
              error={Boolean(newPartner.password && !passwordIsValid)}
              helperText="Use no mínimo 8 caracteres, uma letra maiúscula, uma minúscula e um número."
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
