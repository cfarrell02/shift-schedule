import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

const MonthSchedule = ({ monthData, nextMonthData }) => {
  const monthName = monthData.length > 0 ? monthData[0].date.toLocaleString('default', { month: 'long' }) : '';
  const daysInMonth = monthData.length;
  const columns = 7; // Change to 6 or 7 for the number of columns you want

  const rows = Math.ceil(daysInMonth / columns);

  
  const monthStartDay = monthData.length > 0 ? monthData[0].date.getDay() : 0;
    const emptyCells = Array.from({ length: monthStartDay }, (_, index) => ({ date: null, shift: null }));

    monthData = [...emptyCells, ...monthData];

  const slicedMonthData = Array.from({ length: rows }, (_, i) =>
    monthData.slice(i * columns, i * columns + columns)
  );

  const getColorForShift = (shift) => {
    switch (shift) {
      case 'Day Shift':
        return '#2196f3'; // Blue for Day Shift
      case 'Night Shift':
        return '#ffeb3b'; // Yellow for Night Shift
      default:
        return 'transparent'; // No color for Off
    }
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];


  return (
    <div>
      <TableContainer component={Paper}>
        <Table aria-label="month schedule">
          <TableHead>
            <TableRow>
                <TableCell colSpan={columns} style={{ textAlign: 'center' }}>
              <Typography variant="h6">{monthName}</Typography>
                </TableCell>
            </TableRow>
            <TableRow>
                {weekDays.map((day, index) => (
                    <TableCell key={index} style={{ textAlign: 'center' }}>
                    <Typography variant="body1">{day.charAt(0)}</Typography>
                    </TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {slicedMonthData.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
    
                {row.map((dayInfo, index) => (
                  <TableCell key={index} style={{ backgroundColor: getColorForShift(dayInfo.shift) }}>
                    <span>{dayInfo.date && dayInfo.date.getDate()}</span>
                  </TableCell>
                ))}
                {row.length < columns && (
                  // Fill remaining cells if the row is not full
                  Array.from({ length: columns - row.length }, (_, index) => (
                    <TableCell key={row.length + index} style={{ backgroundColor: getColorForShift(nextMonthData[index].shift) }}>
                      <span style={{color: 'gray' }}>{nextMonthData[index].date.getDate()}</span> 
                    </TableCell>
                  ))
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default MonthSchedule;
