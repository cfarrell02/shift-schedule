import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DownloadIcon from '@mui/icons-material/Download';
import EventIcon from '@mui/icons-material/Event';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LinkIcon from '@mui/icons-material/Link';
import PrintIcon from '@mui/icons-material/Print';
import ScheduleGrid from '../schedule-grid';
import ColorKey from '../schedule-key';
import PaletteCreator from '../palette-creator';
import PatternEditor from '../pattern-editor';
import ScaleToFit from '../scale-to-fit';
import { buildIcs, buildYear, expandPattern, parseDateInput } from '../../lib/schedule';
import { downloadPdf, downloadPng, downloadText } from '../../lib/export';
import {
  DEFAULT_PATTERN,
  DEFAULT_SHIFT_TYPES,
  MAX_YEAR,
  MIN_YEAR,
  applyPrintFriendlyColors,
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

  return (
    <Box>
      <Grid container spacing={3}>
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
            />
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography>Year</Typography>
              <IconButton aria-label="Previous year" disabled={year <= MIN_YEAR} onClick={() => update({ year: year - 1 })}>
                <ChevronLeftIcon />
              </IconButton>
              <Typography variant="h6" component="span" sx={{ minWidth: '4ch', textAlign: 'center' }}>
                {year}
              </Typography>
              <IconButton aria-label="Next year" disabled={year >= MAX_YEAR} onClick={() => update({ year: year + 1 })}>
                <ChevronRightIcon />
              </IconButton>
              {year !== today.getFullYear() && (
                <Button size="small" onClick={() => update({ year: today.getFullYear() })}>
                  This year
                </Button>
              )}
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={12} md={7}>
          <Typography variant="subtitle1" gutterBottom>
            Pattern
          </Typography>
          <PatternEditor pattern={pattern} shiftTypes={shiftTypes} onChange={(next) => update({ pattern: next })} />
          <Button
            size="small"
            startIcon={<PrintIcon />}
            sx={{ mt: 1.5 }}
            onClick={() => {
              update({ shiftTypes: applyPrintFriendlyColors(shiftTypes) });
              setMessage('Switched to colours that stay distinct when printed in black and white.');
            }}
          >
            Use black and white friendly colours
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Accordion disableGutters variant="outlined">
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Shift types and colours</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <PaletteCreator
                shiftTypes={shiftTypes}
                onChange={changeShiftTypes}
                onReset={() => update({ shiftTypes: DEFAULT_SHIFT_TYPES, pattern: DEFAULT_PATTERN })}
              />
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {months ? (
        <>
          <Stack direction="row" flexWrap="wrap" justifyContent="center" gap={1} sx={{ mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              disabled={exporting}
              onClick={() => runExport(() => downloadPdf(exportRef.current, `schedule-${year}.pdf`, { markToday: markTodayInExports }))}
            >
              PDF
            </Button>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              disabled={exporting}
              onClick={() => runExport(() => downloadPng(exportRef.current, `schedule-${year}.png`, { markToday: markTodayInExports }))}
            >
              PNG
            </Button>
            <Button variant="outlined" startIcon={<EventIcon />} onClick={downloadCalendar}>
              Add to calendar (.ics)
            </Button>
            <Button variant="outlined" startIcon={<LinkIcon />} onClick={copyShareLink}>
              Copy share link
            </Button>
          </Stack>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={markTodayInExports}
                  onChange={(e) => update({ markTodayInExports: e.target.checked })}
                />
              }
              label="Mark today in PDF and PNG downloads"
            />
            <FormControlLabel
              control={<Checkbox checked={previewGrayscale} onChange={(e) => setPreviewGrayscale(e.target.checked)} />}
              label="Preview in black and white"
            />
          </Box>
          <ScaleToFit width={EXPORT_WIDTH}>
            <Box
              ref={exportRef}
              sx={{
                border: '1px solid black',
                p: 4,
                bgcolor: '#fff',
                boxSizing: 'border-box',
                textAlign: 'center',
                // Only simulates printing; html2canvas ignores CSS filters, so downloads stay in colour
                filter: previewGrayscale ? 'grayscale(1)' : 'none',
              }}
            >
              <Typography variant="h3" gutterBottom>
                {year}
              </Typography>
              <ColorKey shiftTypes={shiftTypes} />
              <ScheduleGrid months={months} typesById={typesById} today={today} />
            </Box>
          </ScaleToFit>
        </>
      ) : (
        <Typography align="center" color="text.secondary">
          Set a start date and a pattern with at least one day to see your schedule.
        </Typography>
      )}

      <Snackbar open={Boolean(message)} autoHideDuration={5000} onClose={() => setMessage('')} message={message} />
    </Box>
  );
};

export default FourShiftScheduleWithGrid;
