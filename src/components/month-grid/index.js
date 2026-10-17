import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { shiftBackground } from '../../lib/colors';
import { isSameDay } from '../../lib/schedule';

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const MonthSchedule = ({ month, typesById, today }) => (
  <TableContainer component={Paper} variant="outlined">
    <Table size="small" aria-label={`${month.name} schedule`} sx={{ tableLayout: 'fixed' }}>
      <TableHead>
        <TableRow>
          <TableCell colSpan={7} align="center" sx={{ bgcolor: '#f6f7fb' }}>
            <Typography variant="h6">{month.name}</Typography>
          </TableCell>
        </TableRow>
        <TableRow>
          {weekDays.map((day) => (
            <TableCell key={day} align="center" sx={{ px: 0, color: 'text.secondary', fontWeight: 600 }}>
              <abbr title={day} style={{ textDecoration: 'none' }}>
                {day.charAt(0)}
              </abbr>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {month.weeks.map((week, weekIndex) => (
          <TableRow key={weekIndex}>
            {week.map(({ date, inMonth, typeId }) => {
              const type = typesById.get(typeId);
              const isToday = inMonth && isSameDay(date, today);
              return (
                <TableCell
                  key={date.getTime()}
                  align="center"
                  title={type?.label}
                  data-today={isToday || undefined}
                  sx={{
                    px: 0,
                    py: 0.5,
                    height: 44,
                    border: '1px solid rgba(224, 224, 224, 1)',
                    ...shiftBackground(type),
                    ...(isToday && { boxShadow: 'inset 0 0 0 3px #d32f2f' }),
                  }}
                >
                  <Typography
                    variant="body2"
                    component="div"
                    sx={{ color: inMonth ? 'text.primary' : 'DimGray', fontWeight: isToday ? 700 : 400, lineHeight: 1.2 }}
                  >
                    {date.getDate()}
                  </Typography>
                  {/* Letter code so shifts are readable without colour, e.g. when printed in black and white */}
                  <Typography
                    variant="caption"
                    component="div"
                    sx={{ fontWeight: 700, lineHeight: 1.2, minHeight: '1.2em', opacity: inMonth ? 1 : 0.6 }}
                  >
                    {type?.code}
                  </Typography>
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default MonthSchedule;
