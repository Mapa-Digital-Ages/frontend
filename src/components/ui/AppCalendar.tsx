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

function CustomDay(props: PickersDayProps) {
  const isFuture = props.day.isAfter(dayjs(), 'day')

  return (
    <PickersDay
      {...props}
      sx={{
        margin: '2px',
        borderRadius: '8px',
        border: theme =>
          `2.5px solid ${
            theme.palette.mode === 'dark'
              ? theme.palette.primary.dark
              : theme.palette.primary.main
          }`,
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
          border: theme =>
            `2.5px solid ${
              theme.palette.mode === 'dark'
                ? theme.palette.primary.dark
                : theme.palette.primary.main
            }`,
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

export default function AppCalendar() {
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
            height: 'auto',
            overflow: 'visible',
            '& .MuiDayCalendar-root': {
              overflow: 'visible',
            },
            '& .MuiDayCalendar-slideTransition': {
              minHeight: '26rem',
            },
            '& .MuiDayCalendar-monthContainer': {
              overflow: 'visible',
            },
            '& .MuiDayCalendar-header, & .MuiDayCalendar-weekContainer': {
              justifyContent: 'space-around',
            },
            '& .MuiPickersDay-root': {
              width: 84,
              height: 60,
              fontSize: '1.2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            },
            '& .MuiDayCalendar-weekDayLabel': {
              width: 80,
              height: 56,
              fontSize: '0.85rem',
            },
            '& .MuiYearCalendar-root': {
              height: 'auto',
              minHeight: '26rem',
            },
            '& .MuiPickersYear-yearButton': {
              width: 84,
              height: 60,
              fontSize: '0.95rem',
            },
            '& .MuiPickersCalendarHeader-label': {
              textTransform: 'capitalize',
            },
          }}
        />
      </LocalizationProvider>
      <DayDetailModal
        open={modalOpen}
        date={selectedDate}
        onClose={handleModalClose}
      />
    </>
  )
}
