import { Box, Typography } from '@mui/material'
import AppPageContainer from '@/components/ui/AppPageContainer'
import ComponentButton from '@/components/ui/ComponentButton'

function StudentComponentsPage() {
  return (
    <AppPageContainer className="gap-4 md:gap-5">
      <Typography className="text-2xl font-bold text-slate-900 md:text-3xl">
        Componentes
      </Typography>

      <Box className="flex min-h-[80vh] flex-col items-center justify-center rounded-2xl bg-white p-8">
        <Typography className="text-lg text-slate-400">
          Área para testar componentes
          <button >vishh</button>
          </Typography>
          
          {/* Usando nome da cor normal */}
      <ComponentButton 
        tamanho="small" 
        cor="red" 
        texto="Sou pequeno e vermelho" 
      />

      {/* Usando Hexadecimal */}
      <ComponentButton 
        tamanho="medium" 
        cor="#FF4500" // OrangeRed
        texto="Sou medio e laranja" 
      />

      {/* Usando cor por numero */}
      <ComponentButton 
        tamanho="large" 
        cor="rgb(34, 139, 34)" 
        texto="Sou grande e verde" 
      />
        
      </Box>
    </AppPageContainer>
  )
}

export default StudentComponentsPage
