import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  MenuItem,
  Typography,
} from '@mui/material'
import { useState, type ChangeEvent } from 'react'
import AppInput from '@/shared/ui/AppInput'
import AppButton from '@/shared/ui/AppButton'

type SubjectKey =
  | 'matematica'
  | 'portugues'
  | 'biologia'
  | 'historia'
  | 'ingles'
  | 'geografia'
  | 'ciencias'

export type UploadTaskPayload = {
  title: string
  type: string
  subject: SubjectKey
  file: File
}

interface UploadActivityModalProps {
  open: boolean
  onClose: () => void
  onAddTask: (task: UploadTaskPayload) => Promise<void>
  isSubmitting?: boolean
  submitError?: string | null
}

const env = (
  import.meta as ImportMeta & {
    env?: Record<string, string | undefined>
  }
).env

const MAX_FILE_SIZE_MB = Number(env?.VITE_MAX_FILE_SIZE_MB ?? 5)
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

const ALLOWED_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

function UploadActivityModal({
  open,
  onClose,
  onAddTask,
  isSubmitting = false,
  submitError = null,
}: UploadActivityModalProps) {
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState<SubjectKey>('matematica')
  const [type, setType] = useState('Exercício')
  const [file, setFile] = useState<File | null>(null)
  const [errorMessage, setErrorMessage] = useState('')

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0]

    if (!selectedFile) return

    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      setErrorMessage('Formato inválido. Envie arquivos PDF, PNG, JPG ou DOCX.')
      setFile(null)
      return
    }

    if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage(`O arquivo deve ter no máximo ${MAX_FILE_SIZE_MB}MB.`)
      setFile(null)
      return
    }

    setErrorMessage('')
    setFile(selectedFile)
  }

  async function handleSubmit() {
    if (!title.trim()) {
      setErrorMessage('Informe o título da atividade.')
      return
    }

    if (!file) {
      setErrorMessage('Selecione um arquivo para enviar.')
      return
    }

    try {
      const renamedFile = new File([file], title.trim(), { type: file.type })
      await onAddTask({
        title: title.trim(),
        subject,
        type,
        file: renamedFile,
      })

      setTitle('')
      setSubject('matematica')
      setType('Exercício')
      setFile(null)
      setErrorMessage('')
    } catch {
      setErrorMessage('Não foi possível enviar o arquivo. Tente novamente.')
    }
  }

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={open}
      onClose={onClose}
      PaperProps={{
        className: 'rounded-3xl',
      }}
    >
      <DialogContent className="p-6 md:p-8">
        <Box className="mb-6 flex items-start justify-between gap-4">
          <Box>
            <Typography
              className="text-2xl font-bold"
              sx={{ color: 'text.primary' }}
            >
              Upload de Atividade
            </Typography>
            <Typography
              className="mt-1 text-base"
              sx={{ color: 'text.secondary' }}
            >
              Cadastro de tarefa para avaliação
            </Typography>
          </Box>

          <IconButton onClick={onClose}>
            <CloseRoundedIcon />
          </IconButton>
        </Box>

        <Box className="rounded-3xl border border-slate-200 p-4 md:p-5">
          <AppInput
            label="Título"
            placeholder="Ex.: Lista de revisão de matemática"
            value={title}
            onChange={event => setTitle(event.target.value)}
            backgroundColor="background.default"
          />

          <Box className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <AppInput
              select
              label="Disciplina"
              value={subject}
              onChange={event => setSubject(event.target.value as SubjectKey)}
              backgroundColor="background.default"
            >
              <MenuItem value="matematica">Matemática</MenuItem>
              <MenuItem value="portugues">Português</MenuItem>
              <MenuItem value="ciencias">Ciências</MenuItem>
              <MenuItem value="historia">História</MenuItem>
              <MenuItem value="biologia">Biologia</MenuItem>
              <MenuItem value="ingles">Inglês</MenuItem>
              <MenuItem value="geografia">Geografia</MenuItem>
            </AppInput>

            <AppInput
              select
              label="Tipo"
              value={type}
              onChange={event => setType(event.target.value)}
              backgroundColor="background.default"
            >
              <MenuItem value="Exercício">Exercício</MenuItem>
              <MenuItem value="Redação">Redação</MenuItem>
              <MenuItem value="Atividade">Atividade</MenuItem>
            </AppInput>
          </Box>
        </Box>

        <Box
          component="label"
          className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-400 p-10 text-center transition hover:bg-slate-50"
        >
          <CloudUploadOutlinedIcon
            sx={{ fontSize: 36, color: 'text.primary' }}
          />

          <Typography
            className="mt-4 text-lg font-bold"
            sx={{ color: 'text.primary' }}
          >
            Arraste e solte o arquivo para anexar
          </Typography>

          <Typography className="mt-2 text-sm" sx={{ color: 'text.secondary' }}>
            Formatos aceitos: PDF, PNG, JPG e DOCX até {MAX_FILE_SIZE_MB}MB
          </Typography>

          {file && (
            <Typography
              className="mt-3 text-sm font-semibold"
              sx={{ color: 'primary.main' }}
            >
              {file.name}
            </Typography>
          )}

          <input
            hidden
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.docx"
            onChange={handleFileChange}
          />
        </Box>

        {(errorMessage || submitError) && (
          <Typography className="mt-4 text-sm font-semibold text-red-500">
            {errorMessage || submitError}
          </Typography>
        )}

        <Box className="mt-6 flex flex-col-reverse gap-3 md:flex-row md:justify-end">
          <Button
            className="rounded-2xl px-8 py-3"
            variant="outlined"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>

          <AppButton
            borderRadius="16px"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enviando...' : 'Adicionar'}
          </AppButton>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default UploadActivityModal
