import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded'
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded'
import { Box, IconButton, Menu, MenuItem, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import {
  getRoleHoverStyle,
  getRolePalette,
  getRoleSelectedStyle,
} from '@/app/theme/core/roles'
import { useEffect, useMemo, useState } from 'react'
import LoadingScreen from '@/shared/ui/LoadingScreen'
import AppCard from '@/shared/ui/AppCard'
import AppPageContainer from '@/shared/ui/AppPageContainer'
import PageHeader from '@/shared/ui/PageHeader'
import { SearchBarAndFilter } from '@/shared/ui/SearchBarAndFilter'
import { adoptedSchoolsService } from '../services/service'
import type { AdoptedSchool } from '../types/types'
import { useCompanyRole } from '@/modules/company/shared/hooks/useCompanyRole'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import AppActionModal from '@/shared/ui/AppActionModal'

export default function Page() {
  const theme = useTheme()
  const [schools, setSchools] = useState<AdoptedSchool[]>([])
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null)
  const [menuSchoolId, setMenuSchoolId] = useState<string | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const role = useCompanyRole()
  const accent = getRolePalette(theme, role)
  const hoverStyle = getRoleHoverStyle(theme, role)
  const selectedStyle = getRoleSelectedStyle(theme, role)

  useEffect(() => {
    let isActive = true

    async function loadPage() {
      const nextSchools = await adoptedSchoolsService.getSchools()

      if (!isActive) {
        return
      }

      setSchools(nextSchools)
      if (nextSchools.length > 0) {
        setSelectedSchoolId(nextSchools[0].id)
      }
      setIsLoading(false)
    }

    void loadPage()

    return () => {
      isActive = false
    }
  }, [])

  async function handleRemoveSchool() {
    if (!menuSchoolId) return
    await adoptedSchoolsService.removeSchool(menuSchoolId)
    setSchools(current => {
      const nextSchools = current.filter(s => s.id !== menuSchoolId)
      if (selectedSchoolId === menuSchoolId) {
        setSelectedSchoolId(nextSchools[0]?.id ?? null)
      }
      return nextSchools
    })
    setIsDeleteModalOpen(false)
    setMenuSchoolId(null)
  }

  const filteredSchools = useMemo(() => {
    return schools.filter(school =>
      school.schoolName.toLowerCase().includes(query.toLowerCase())
    )
  }, [schools, query])

  const selectedSchool = useMemo(() => {
    return schools.find(s => s.id === selectedSchoolId) ?? null
  }, [schools, selectedSchoolId])

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <AppPageContainer
      className="gap-4 md:gap-5"
      data-testid="adopted-schools-page"
    >
      <PageHeader
        title="Escolas Apoiadas"
        subtitle="Gerencie as escolas apoiadas pela sua empresa"
        variant="company"
      />

      <Box data-testid="adopted-schools-search">
        <SearchBarAndFilter
          onQueryChange={setQuery}
          query={query}
          resultsSummary={{
            count: filteredSchools.length,
            singularLabel: 'resultado',
            pluralLabel: 'resultado(s)',
          }}
          searchPlaceholder="Pesquisar empresas..."
        />
      </Box>

      <Box
        className={`grid grid-cols-1 gap-4 ${filteredSchools.length > 0 ? 'xl:grid-cols-2' : ''}`}
        data-testid="adopted-schools-content"
      >
        <AppCard
          contentClassName="gap-3 p-5"
          contentSx={{ maxHeight: 500, overflowY: 'auto' }}
          data-testid="adopted-schools-list"
        >
          {filteredSchools.length === 0 ? (
            <Box
              className="flex flex-col items-center justify-center py-10 gap-2"
              data-testid="adopted-schools-empty"
            >
              <AccountBalanceRoundedIcon
                sx={{
                  fontSize: 40,
                  color: alpha(theme.palette.role.empresa.primary, 0.4),
                }}
              />
              <Typography
                sx={{
                  color: 'text.primary',
                  fontWeight: 600,
                  fontSize: 16,
                  textAlign: 'center',
                }}
              >
                Nenhuma escola apoiada até o momento
              </Typography>
              <Typography
                sx={{
                  color: 'text.secondary',
                  fontSize: 13,
                  textAlign: 'center',
                }}
              >
                Aguarde solicitações para apoio
              </Typography>
            </Box>
          ) : (
            filteredSchools.map(school => {
              const isSelected = selectedSchoolId === school.id
              return (
                <Box
                  className="cursor-pointer rounded-2xl px-4 py-3 transition-all"
                  data-testid={`school-card-${school.id}`}
                  key={school.id}
                  onClick={() => setSelectedSchoolId(school.id)}
                  sx={{
                    backgroundColor: isSelected
                      ? selectedStyle.backgroundColor
                      : theme.palette.background.paper,
                    border: `1px solid ${
                      isSelected
                        ? selectedStyle.borderColor
                        : theme.palette.background.border
                    }`,
                    '&:hover': {
                      backgroundColor: hoverStyle.backgroundColor,
                      borderColor: hoverStyle.borderColor,
                    },
                  }}
                >
                  <Box className="flex items-center justify-between">
                    <Box className="flex items-center gap-3 min-w-0">
                      <Box
                        className="flex items-center justify-center rounded-xl"
                        sx={{
                          backgroundColor: alpha(
                            theme.palette.role.empresa.primary,
                            0.1
                          ),
                          border: `1px solid ${alpha(theme.palette.role.empresa.primary, 0.3)}`,
                          color: theme.palette.role.empresa.primary,
                          height: 40,
                          width: 40,
                          flexShrink: 0,
                        }}
                      >
                        <AccountBalanceRoundedIcon fontSize="small" />
                      </Box>
                      <Box className="min-w-0">
                        <Typography
                          sx={{
                            color: 'text.primary',
                            fontSize: { md: 16, xs: 14 },
                            fontWeight: 600,
                          }}
                        >
                          {school.schoolName}
                        </Typography>
                        <Typography
                          sx={{ color: 'text.secondary', fontSize: 13 }}
                        >
                          {school.grantedSpots} vagas
                        </Typography>
                      </Box>
                    </Box>
                    <IconButton
                      aria-label="Mais opções"
                      data-testid={`school-card-menu-${school.id}`}
                      size="small"
                      onClick={e => {
                        e.stopPropagation()
                        setMenuAnchorEl(e.currentTarget)
                        setMenuSchoolId(school.id)
                      }}
                      sx={{
                        color: isSelected ? accent.primary : 'text.secondary',
                        backgroundColor: isSelected
                          ? selectedStyle.backgroundColor
                          : 'transparent',
                        '&:hover': {
                          backgroundColor: hoverStyle.backgroundColor,
                          color: accent.primary,
                        },
                      }}
                    >
                      <MoreHorizRoundedIcon />
                    </IconButton>
                  </Box>
                </Box>
              )
            })
          )}
        </AppCard>

        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={() => setMenuAnchorEl(null)}
          slotProps={{
            paper: {
              sx: {
                border: '1px solid',
                borderColor: 'background.border',
                borderRadius: '16px',
                minWidth: 200,
                mt: 1,
              },
            },
          }}
        >
          <MenuItem
            data-testid="remove-school-action"
            onClick={() => {
              setMenuAnchorEl(null)
              setIsDeleteModalOpen(true)
            }}
            sx={{ color: 'error.main', gap: 1.25, py: 1.1 }}
          >
            <DeleteOutlineRoundedIcon sx={{ fontSize: 18 }} />
            <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
              Remover escola
            </Typography>
          </MenuItem>
        </Menu>

        {/* School Details Panel */}
        {selectedSchool && (
          <AppCard contentClassName="p-5" data-testid="school-details-panel">
            <Box className="mb-4">
              <Typography
                sx={{
                  color: theme.palette.role.empresa.primary,
                  fontSize: 14,
                  fontWeight: 600,
                  mb: 0.5,
                }}
              >
                Dados da Escola
              </Typography>
              <Typography
                sx={{
                  color: 'text.primary',
                  fontSize: { md: 22, xs: 18 },
                  fontWeight: 700,
                }}
              >
                {selectedSchool.schoolName}
              </Typography>
            </Box>

            <Box
              data-testid="school-details-spots"
              sx={{
                border: '1px solid',
                borderColor: 'background.border',
                borderRadius: '12px',
                p: 2,
              }}
            >
              <Typography
                sx={{ color: 'text.secondary', fontSize: 13, fontWeight: 600 }}
              >
                Vagas apoiadas
              </Typography>
              <Typography
                sx={{ color: 'text.primary', fontSize: 24, fontWeight: 700 }}
              >
                {selectedSchool.grantedSpots}
              </Typography>
            </Box>
          </AppCard>
        )}

        <AppActionModal
          confirmLabel="Confirmar remoção"
          description="Essa ação encerra a parceria e remove a escola da sua lista de escolas apoiadas."
          mode="confirm"
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={() => {
            void handleRemoveSchool()
          }}
          open={isDeleteModalOpen}
          title="Remover escola"
          confirmColor={theme.palette.error.main}
        >
          <Typography color="text.secondary">
            Deseja remover "
            {schools.find(s => s.id === menuSchoolId)?.schoolName ?? ''}" da
            lista?
          </Typography>
        </AppActionModal>
      </Box>
    </AppPageContainer>
  )
}
