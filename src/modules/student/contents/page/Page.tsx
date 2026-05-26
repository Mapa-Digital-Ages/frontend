import AppPageContainer from '@/shared/ui/AppPageContainer'
import OrdinaryHeader from '@/shared/ui/OrdinaryHeader'

export default function Page() {
  return (
    <AppPageContainer className="gap-4">
      <OrdinaryHeader
        title="Conteúdos"
        subtitle="Misture descoberta de conteúdos com jornadas por matéria: o aluno pode manter várias trilhas ativas ao mesmo tempo, cada uma com progresso próprio."
      />
    </AppPageContainer>
  )
}
