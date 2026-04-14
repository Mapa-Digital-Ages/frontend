import type { SidebarItem } from '@/shared/types/common'
import type { UserRole } from '@/shared/types/user'
import { adminNavigation } from './items/admin'
import { companyNavigation } from './items/company'
import { parentNavigation } from './items/parent'
import { schoolNavigation } from './items/school'
import { schoolCompanyNavigation } from './items/schoolCompany'
import { studentNavigation } from './items/student'

export const NAVIGATION_BY_ROLE: Record<UserRole, SidebarItem[]> = {
  aluno: studentNavigation,
  responsavel: parentNavigation,
  admin: adminNavigation,
  escola: schoolNavigation,
  empresa: companyNavigation,
  escola_empresa: schoolCompanyNavigation,
}
