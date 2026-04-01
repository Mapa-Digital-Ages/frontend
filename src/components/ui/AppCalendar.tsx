import { useState } from 'react'
import dayjs, { type Dayjs } from 'dayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar'
import { PickersDay, type PickersDayProps } from '@mui/x-date-pickers/PickersDay'
import DayDetailModal from './DayDetailModal'

function CustomDay(props: PickersDayProps<Dayjs>) {
  const isFuture = props.day.isAfter(dayjs(), 'day')

  return (
    <PickersDay
      {...props}
      sx={{
        margin: '2px',
        borderRadius: '6px',
        border: theme =>
          `2px solid ${isFuture ? theme.palette.divider : theme.palette.primary.main}`,
        backgroundColor: isFuture ? undefined : 'background.paper',
        color: theme =>
          isFuture ? theme.palette.text.disabled : theme.palette.text.primary,
        '&:hover': {
          backgroundColor: isFuture ? undefined : 'background.hover',
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
          border: theme => `2px solid ${theme.palette.primary.main}`,
        },
      }}
    />
  )
}

export default function AppCalendar() {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  function handleDaySelect(date: Dayjs) {
    setSelectedDate(date)
    setModalOpen(true)
  }

  function handleModalClose() {
    setSelectedDate(null)
    setModalOpen(false)
  }

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          reduceAnimations={false}
          value={selectedDate}
          onChange={handleDaySelect}
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
              fontSize: '0.95rem',
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