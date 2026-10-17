import React from 'react';
import { Box, Button, IconButton, MenuItem, Stack, TextField, Tooltip, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import DeleteIcon from '@mui/icons-material/Delete';
import { shiftBackground } from '../../lib/colors';
import { expandPattern } from '../../lib/schedule';
import { MAX_BLOCK_DAYS, canAddPatternBlock, clampInt } from '../../lib/settings';

// The repeating rota: an ordered list of blocks such as "2 × Day Shift"
const PatternEditor = ({ pattern, shiftTypes, onChange }) => {
  const typesById = new Map(shiftTypes.map((type) => [type.id, type]));
  const sequence = expandPattern(pattern);

  const updateBlock = (index, changes) =>
    onChange(pattern.map((block, i) => (i === index ? { ...block, ...changes } : block)));

  const moveBlock = (index, offset) => {
    const next = [...pattern];
    [next[index], next[index + offset]] = [next[index + offset], next[index]];
    onChange(next);
  };

  return (
    <Stack spacing={1.5}>
      {pattern.map((block, index) => (
        <Stack key={index} direction="row" spacing={1} alignItems="center">
          <TextField
            select
            label="Shift"
            size="small"
            value={block.typeId}
            onChange={(e) => updateBlock(index, { typeId: e.target.value })}
            sx={{ minWidth: 0, flexGrow: 1 }}
          >
            {shiftTypes.map((type) => (
              <MenuItem key={type.id} value={type.id}>
                {type.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Days"
            size="small"
            type="number"
            // A string so React normalises what's shown, e.g. "05" after clearing and typing 5
            value={String(block.count)}
            // An empty field counts as 0 rather than NaN
            onChange={(e) => updateBlock(index, { count: clampInt(e.target.value, 0, MAX_BLOCK_DAYS) })}
            inputProps={{ min: 0, max: MAX_BLOCK_DAYS }}
            sx={{ width: '8ch', flexShrink: 0 }}
          />
          <IconButton aria-label="Move up" size="small" disabled={index === 0} onClick={() => moveBlock(index, -1)}>
            <ArrowUpwardIcon fontSize="small" />
          </IconButton>
          <IconButton
            aria-label="Move down"
            size="small"
            disabled={index === pattern.length - 1}
            onClick={() => moveBlock(index, 1)}
          >
            <ArrowDownwardIcon fontSize="small" />
          </IconButton>
          <Tooltip title="Remove block">
            <IconButton aria-label="Remove block" size="small" onClick={() => onChange(pattern.filter((_, i) => i !== index))}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ))}

      <Box>
        <Button
          startIcon={<AddIcon />}
          variant="outlined"
          size="small"
          disabled={!canAddPatternBlock(pattern)}
          onClick={() => onChange([...pattern, { typeId: shiftTypes[0].id, count: 1 }])}
        >
          Add block
        </Button>
      </Box>

      {sequence.length > 0 ? (
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Repeats every {sequence.length} {sequence.length === 1 ? 'day' : 'days'}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '2px' }}>
            {sequence.map((typeId, i) => {
              const type = typesById.get(typeId);
              return (
                <Box
                  key={i}
                  title={type?.label}
                  sx={{
                    width: 24,
                    height: 24,
                    border: '1px solid #999',
                    fontSize: 11,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    ...shiftBackground(type),
                  }}
                >
                  {type?.code}
                </Box>
              );
            })}
          </Box>
        </Box>
      ) : (
        <Typography variant="body2" color="error">
          Add at least one day to the pattern to see a schedule.
        </Typography>
      )}
    </Stack>
  );
};

export default PatternEditor;
