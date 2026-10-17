import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Chip,
  FormControlLabel,
  Grid,
  IconButton,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import EventIcon from '@mui/icons-material/Event';
import LinkIcon from '@mui/icons-material/Link';
import ScheduleGrid from '../schedule-grid';
import ColorKey from '../schedule-key';
import PaletteCreator from '../palette-creator';
import PatternEditor from '../pattern-editor';
import ScaleToFit from '../scale-to-fit';
import Section from '../section';
import { shiftBackground } from '../../lib/colors';
import { buildIcs, buildYear, expandPattern, parseDateInput } from '../../lib/schedule';
import { downloadPdf, downloadPng, downloadText } from '../../lib/export';
import {
  DEFAULT_PATTERN,
  DEFAULT_SHIFT_TYPES,
  MAX_YEAR,
  MIN_YEAR,
  buildShareUrl,
  loadInitialSettings,
  storeSettings,
} from '../../lib/settings';

const EXPORT_WIDTH = 1200;

const FourShiftScheduleWithGrid = () => {
  const [settings, setSettings] = useState(() => loadInitialSettings());
  const [exporting, setExporting] = useState(false);
  const [message, setMessage] = useState('');
  const [previewGrayscale, setPreviewGrayscale] = useState(false);
  const [editingTypes, setEditingTypes] = useState(false);
  const exportRef = useRef(null);

  const { start, year, shiftTypes, pattern, markTodayInExports } = settings;
  const update = (changes) => setSettings((prev) => ({ ...prev, ...changes }));

  useEffect(() => {
    storeSettings(settings);
  }, [settings]);

  // A shared link has been saved locally by now, so tidy it out of the address bar
  useEffect(() => {
    if (window.location.search) window.history.replaceState(null, '', window.location.pathname);
  }, []);

  const startDate = parseDateInput(start);
  const sequence = useMemo(() => expandPattern(pattern), [pattern]);
  const typesById = useMemo(() => new Map(shiftTypes.map((type) => [type.id, type])), [shiftTypes]);
  const months = useMemo(() => {
    // Parse again here so the memo depends on the start string, not a new Date each render
    const date = parseDateInput(start);
    return date && sequence.length > 0 ? buildYear(year, date, sequence) : null;
  }, [start, year, sequence]);
  const today = new Date();

  const changeShiftTypes = (nextTypes) =>
    update({
      shiftTypes: nextTypes,
      // Drop pattern blocks whose shift type was removed
      pattern: pattern.filter((block) => nextTypes.some((type) => type.id === block.typeId)),
    });

  const runExport = async (exportFn) => {
    setExporting(true);
    try {
      await exportFn();
    } catch (error) {
      console.error(error);
      setMessage('Sorry, the download failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const copyShareLink = async () => {
    const url = buildShareUrl(settings);
    try {
      await navigator.clipboard.writeText(url);
      setMessage('Link copied. Anyone who opens it will see this schedule.');
    } catch {
      window.prompt('Copy this link to share your schedule:', url);
    }
  };

  const downloadCalendar = () => {
    downloadText(buildIcs({ year, start: startDate, sequence, shiftTypes }), `shifts-${year}.ics`, 'text/calendar');
    setMessage(`Downloaded shifts-${year}.ics. Open it to add your shifts to your calendar.`);
  };

  const exportOptions = { markToday: markTodayInExports };

  return (
    <Stack spacing={3}>
      <Section title="Your rota" subtitle="When your cycle starts and how it repeats">
        <Grid container spacing={{ xs: 3, md: 5 }}>
          <Grid item xs={12} md={5}>
            <Stack spacing={3}>
              <TextField
                label="First day of a cycle"
                type="date"
                value={start}
                onChange={(e) => update({ start: e.target.value })}
                error={!startDate}
                helperText={startDate ? 'Any day the first block of your pattern starts' : 'Enter a valid date'}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Year shown
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 2,
                    }}
                  >
                    <IconButton aria-label="Previous year" disabled={year <= MIN_YEAR} onClick={() => update({ year: year - 1 })}>
                      <ChevronLeftIcon />
                    </IconButton>
                    <Typography variant="h6" component="span" sx={{ minWidth: '4.5ch', textAlign: 'center' }}>
                      {year}
                    </Typography>
                    <IconButton aria-label="Next year" disabled={year >= MAX_YEAR} onClick={() => update({ year: year + 1 })}>
                      <ChevronRightIcon />
                    </IconButton>
                  </Box>
                  {year !== today.getFullYear() && (
                    <Button size="small" onClick={() => update({ year: today.getFullYear() })}>
                      Back to {today.getFullYear()}
                    </Button>
                  )}
                </Stack>
              </Box>
            </Stack>
          </Grid>
          <Grid item xs={12} md={7}>
            <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
              Repeating pattern
            </Typography>
            <PatternEditor pattern={pattern} shiftTypes={shiftTypes} onChange={(next) => update({ pattern: next })} />
          </Grid>
        </Grid>
      </Section>

      <Section
        title="Shift types and colours"
        subtitle="The names, codes and colours used on your schedule"
        action={
          <Button
            variant={editingTypes ? 'contained' : 'outlined'}
            startIcon={editingTypes ? <CheckIcon /> : <EditIcon />}
            onClick={() => setEditingTypes(!editingTypes)}
          >
            {editingTypes ? 'Done' : 'Edit'}
          </Button>
        }
      >
        {editingTypes ? (
          <PaletteCreator
            shiftTypes={shiftTypes}
            onChange={changeShiftTypes}
            onReset={() => update({ shiftTypes: DEFAULT_SHIFT_TYPES, pattern: DEFAULT_PATTERN })}
          />
        ) : (
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {shiftTypes.map((type) => (
              <Chip
                key={type.id}
                variant="outlined"
                label={type.code ? `${type.label} (${type.code})` : type.label}
                avatar={<Box component="span" sx={{ border: '1px solid rgba(0, 0, 0, 0.3)', ...shiftBackground(type) }} />}
              />
            ))}
          </Stack>
        )}
      </Section>

      <Section
        title={`Your ${year} schedule`}
        subtitle="Updates as you change your rota"
        action={
          months && (
            <Stack direction="row" flexWrap="wrap" gap={1}>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                disabled={exporting}
                onClick={() => runExport(() => downloadPdf(exportRef.current, `schedule-${year}.pdf`, exportOptions))}
              >
                PDF
              </Button>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                disabled={exporting}
                onClick={() => runExport(() => downloadPng(exportRef.current, `schedule-${year}.png`, exportOptions))}
              >
                PNG
              </Button>
              <Button variant="outlined" startIcon={<EventIcon />} onClick={downloadCalendar}>
                Calendar (.ics)
              </Button>
              <Button variant="outlined" startIcon={<LinkIcon />} onClick={copyShareLink}>
                Copy link
              </Button>
            </Stack>
          )
        }
      >
        {months ? (
          <>
            <Stack direction="row" flexWrap="wrap" columnGap={3} sx={{ mb: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={markTodayInExports}
                    onChange={(e) => update({ markTodayInExports: e.target.checked })}
                  />
                }
                label={<Typography variant="body2">Mark today in PDF and PNG downloads</Typography>}
              />
              <FormControlLabel
                control={
                  <Checkbox size="small" checked={previewGrayscale} onChange={(e) => setPreviewGrayscale(e.target.checked)} />
                }
                label={<Typography variant="body2">Preview in black and white</Typography>}
              />
            </Stack>
            <ScaleToFit width={EXPORT_WIDTH}>
              <Box
                ref={exportRef}
                sx={{
                  border: '1px solid #d0d5df',
                  borderRadius: '12px',
                  p: 4,
                  bgcolor: '#fff',
                  boxSizing: 'border-box',
                  textAlign: 'center',
                  // Only simulates printing; html2canvas ignores CSS filters, so downloads stay in colour
                  filter: previewGrayscale ? 'grayscale(1)' : 'none',
                }}
              >
                <Typography variant="h3" component="p" sx={{ fontWeight: 700, mb: 3 }}>
                  {year}
                </Typography>
                <ColorKey shiftTypes={shiftTypes} />
                <ScheduleGrid months={months} typesById={typesById} today={today} />
              </Box>
            </ScaleToFit>
          </>
        ) : (
          <Typography align="center" color="text.secondary" sx={{ py: 6 }}>
            Set a start date and a pattern with at least one day to see your schedule.
          </Typography>
        )}
      </Section>

      <Snackbar open={Boolean(message)} autoHideDuration={5000} onClose={() => setMessage('')} message={message} />
    </Stack>
  );
};

export default FourShiftScheduleWithGrid;
