import React from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { shiftBackground } from '../../lib/colors';
import { canAddShiftType } from '../../lib/settings';

const NEW_TYPE_COLORS = ['#ff9800', '#9c27b0', '#f44336', '#009688', '#795548', '#607d8b'];

// Edit the shift types used in the pattern: name, short code, colour and stripes
export default function PaletteCreator({ shiftTypes, onChange, onReset }) {
  const updateType = (id, changes) =>
    onChange(shiftTypes.map((type) => (type.id === id ? { ...type, ...changes } : type)));

  const addType = () =>
    onChange([
      ...shiftTypes,
      {
        id: `type-${Date.now().toString(36)}`,
        label: 'New Shift',
        code: 'X',
        color: NEW_TYPE_COLORS[shiftTypes.length % NEW_TYPE_COLORS.length],
        striped: false,
        isOff: false,
      },
    ]);

  return (
    <Stack spacing={2}>
      {shiftTypes.map((type) => (
        <Box
          key={type.id}
          sx={{ border: '1px solid #ddd', borderRadius: 2, p: 2, display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center' }}
        >
          <Box
            aria-hidden
            sx={{ width: 40, height: 40, borderRadius: 1, border: '1px solid #999', flexShrink: 0, ...shiftBackground(type) }}
          />
          <TextField
            label="Name"
            size="small"
            value={type.label}
            onChange={(e) => updateType(type.id, { label: e.target.value })}
            inputProps={{ maxLength: 40 }}
            sx={{ width: '18ch' }}
          />
          <TextField
            label="Code"
            size="small"
            value={type.code}
            onChange={(e) => updateType(type.id, { code: e.target.value })}
            inputProps={{ maxLength: 3, title: 'Short code shown on each day' }}
            sx={{ width: '8ch' }}
          />
          <TextField
            label="Colour"
            size="small"
            type="color"
            value={type.color}
            onChange={(e) => updateType(type.id, { color: e.target.value })}
            sx={{ width: '9ch' }}
          />
          <FormControlLabel
            control={<Checkbox checked={type.striped} onChange={(e) => updateType(type.id, { striped: e.target.checked })} />}
            label="Striped"
          />
          <FormControlLabel
            control={<Checkbox checked={type.isOff} onChange={(e) => updateType(type.id, { isOff: e.target.checked })} />}
            label="Day off"
          />
          <Tooltip title={shiftTypes.length > 1 ? 'Remove shift type' : 'You need at least one shift type'}>
            <span style={{ marginLeft: 'auto' }}>
              <IconButton
                aria-label={`Remove ${type.label}`}
                disabled={shiftTypes.length <= 1}
                onClick={() => onChange(shiftTypes.filter((t) => t.id !== type.id))}
              >
                <DeleteIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      ))}
      <Typography variant="body2" color="text.secondary">
        Days off aren't added when you export to a calendar.
      </Typography>
      <Stack direction="row" spacing={1}>
        <Button startIcon={<AddIcon />} variant="outlined" onClick={addType} disabled={!canAddShiftType(shiftTypes)}>
          Add shift type
        </Button>
        <Button onClick={onReset}>Reset to defaults</Button>
      </Stack>
    </Stack>
  );
}
