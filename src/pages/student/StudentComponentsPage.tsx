import { Box, Typography } from '@mui/material'
import AppPageContainer from '@/components/ui/AppPageContainer'
import { SubjectChip, SUBJECTS } from "@/components/ui/AppSubjectsTags";

function StudentComponentsPage() {
  return (
    <AppPageContainer className="gap-4 md:gap-5">
      <Typography className="text-2xl font-bold text-slate-900 md:text-3xl">
        Componentes
      </Typography>

      <Box className="flex min-h-[80vh] flex-col items-center justify-center rounded-2xl bg-white p-8">
       <Box className="flex gap-3 flex-wrap">
  <SubjectChip {...SUBJECTS.ciencias} />
  <SubjectChip {...SUBJECTS.matematica} />
  <SubjectChip {...SUBJECTS.historia} />
  <SubjectChip {...SUBJECTS.portugues} />
  <SubjectChip {...SUBJECTS.geografia} />
  <SubjectChip {...SUBJECTS.ingles} />
</Box>
      </Box>
    </AppPageContainer>
  )
}

export default StudentComponentsPage
