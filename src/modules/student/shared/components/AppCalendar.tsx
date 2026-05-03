import { useState } from 'react'
import dayjs, { type Dayjs } from 'dayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar'
import {
  PickersDay,
  type PickersDayProps,
} from '@mui/x-date-pickers/PickersDay'
import DayDetailModal from './DayDetailModal'
import 'dayjs/locale/pt-br'
import type { Task } from './Planner'

interface AppCalendarProps {
  tasks: Task[]
  onTasksChange: (tasks: Task[]) => void
}

function CustomDay(props: PickersDayProps) {
  const isFuture = props.day.isAfter(dayjs(), 'day')

  return (
    <PickersDay
      {...props}
      sx={{
        margin: { xs: 0, sm: '1px', md: '2px' },
        borderRadius: { xs: '6px', sm: '8px' },
        borderStyle: 'solid',
        borderWidth: { xs: '2px', sm: '2.5px' },
        borderColor: theme =>
          theme.palette.mode === 'dark'
            ? theme.palette.primary.dark
            : theme.palette.primary.main,
        backgroundColor: theme =>
          isFuture
            ? 'background.paper'
            : theme.palette.mode === 'dark'
              ? theme.palette.primary.dark
              : theme.palette.primary.light,
        color: theme => theme.palette.text.primary,
        '&:hover': {
          backgroundColor: isFuture ? 'background.hover' : 'background.hover',
        },
        '&.Mui-selected': {
          backgroundColor: 'primary.main',
          borderColor: 'primary.main',
          color: 'background.paper',
        },
        '&.Mui-selected:hover': {
          backgroundColor: 'primary.main',
        },
        '&.MuiPickersDay-today': {
          borderStyle: 'solid',
          borderWidth: { xs: '2px', sm: '2.5px' },
          borderColor: theme =>
            theme.palette.mode === 'dark'
              ? theme.palette.primary.dark
              : theme.palette.primary.main,
        },
        '&:focus': theme => ({
          outline: 'none',
          backgroundColor: isFuture
            ? 'background.paper'
            : theme.palette.mode === 'dark'
              ? 'primary.dark'
              : 'primary.light',
        }),
      }}
    />
  )
}

export default function AppCalendar({
  tasks,
  onTasksChange,
}: AppCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [view, setView] = useState<'year' | 'month' | 'day'>('day')

  function handleDaySelect(date: Dayjs | null) {
    if (!date) return
    setSelectedDate(date)
    if (view === 'day') {
      setModalOpen(true)
    } else {
      setSelectedDate(null)
    }
  }

  function handleModalClose() {
    setSelectedDate(null)
    setModalOpen(false)
  }

  function handleConfirm(updatedDayTasks: Task[]) {
    if (!selectedDate) return
    const otherTasks = tasks.filter(
      t => !dayjs(t.date).isSame(selectedDate, 'day')
    )
    onTasksChange([...otherTasks, ...updatedDayTasks])
  }

  const dayTasks = selectedDate
    ? tasks.filter(t => dayjs(t.date).isSame(selectedDate, 'day'))
    : []

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
        <DateCalendar
          dayOfWeekFormatter={day => day.format('dddd').charAt(0).toUpperCase()}
          reduceAnimations={false}
          value={selectedDate}
          onChange={handleDaySelect}
          onViewChange={setView}
          slots={{ day: CustomDay }}
          sx={{
            width: '100%',
            maxWidth: '100%',
            minWidth: 0,
            px: 0,
            height: 'auto',
            minHeight: { xs: '20rem', sm: '27rem', md: '34rem' },
            overflow: 'visible',
            '& .MuiPickersLayout-root': {
              width: '100%',
            },
            '& .MuiDayCalendar-slideTransition': {
              minHeight: { xs: '17rem', sm: '24rem', md: '30rem' },
            },
            '& .MuiDayCalendar-monthContainer': {
              overflow: 'visible',
              width: '100%',
            },
            '& .MuiDayCalendar-header, & .MuiDayCalendar-weekContainer': {
              justifyContent: { xs: 'flex-start', sm: 'space-between' },
              gap: { xs: '1px', sm: 0 },
              width: '100%',
              maxWidth: '100%',
              mx: 0,
              px: 0,
            },
            '& .MuiPickersDay-root, & .MuiPickersDay-hiddenDaySpacingFiller': {
              flex: { xs: '1 1 0', sm: '0 0 auto' },
              width: { xs: 'auto', sm: '13%', md: '13%' },
              maxWidth: { xs: 'none', sm: '13%', md: '13%' },
              minWidth: 0,
            },
            '& .MuiPickersDay-root': {
              height: { xs: 30, sm: 50, md: 62 },
              fontSize: { xs: '0.76rem', sm: '1rem', md: '1.2rem' },
              margin: { xs: 0, sm: '2px' },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              aspectRatio: { xs: '1 / 1', sm: 'auto' },
              p: 0,
            },
            '& .MuiDayCalendar-weekDayLabel': {
              flex: { xs: '1 1 0', sm: '0 0 auto' },
              width: { xs: 'auto', sm: '13%', md: '13%' },
              height: { xs: 20, sm: 36, md: 56 },
              fontSize: { xs: '0.62rem', sm: '0.8rem', md: '0.85rem' },
              mx: 0,
              minWidth: 0,
            },
            '& .MuiYearCalendar-root': {
              height: 'auto',
              minHeight: { xs: '19rem', sm: '22rem', md: '26rem' },
            },
            '& .MuiPickersYear-yearButton': {
              width: { xs: 64, sm: 72, md: 84 },
              height: { xs: 44, sm: 52, md: 60 },
              fontSize: { xs: '0.8rem', sm: '0.9rem', md: '0.95rem' },
            },
            '& .MuiPickersCalendarHeader-label': {
              textTransform: 'capitalize',
              fontSize: { xs: '0.92rem', sm: '1.05rem', md: '1.15rem' },
            },
            '& .MuiPickersCalendarHeader-root': {
              px: { xs: 0, sm: 1 },
              minHeight: { xs: 40, sm: 'auto' },
            },
          }}
        />
      </LocalizationProvider>
      <DayDetailModal
        open={modalOpen}
        date={selectedDate}
        tasks={dayTasks}
        onClose={handleModalClose}
        onConfirm={handleConfirm}
      />
    </>
  )
}
