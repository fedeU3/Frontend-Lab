import { Box, Button, Chip, Divider, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useRef, useState } from 'react';

const Section = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <Box sx={{ mb: 6 }}>
    <Typography variant="h6" sx={{ mb: 0.5 }}>{title}</Typography>
    {subtitle && <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>{subtitle}</Typography>}
    <Divider sx={{ mb: 3 }} />
    {children}
  </Box>
);

interface Product { id: number; name: string; category: string; price: number; stock: number }

const INITIAL_DATA: Product[] = [
  { id: 1, name: 'Teclado mecánico', category: 'Periféricos', price: 120, stock: 45 },
  { id: 2, name: 'Monitor 4K', category: 'Pantallas', price: 450, stock: 12 },
  { id: 3, name: 'Mouse inalámbrico', category: 'Periféricos', price: 60, stock: 88 },
  { id: 4, name: 'Auriculares USB-C', category: 'Audio', price: 200, stock: 33 },
  { id: 5, name: 'Webcam HD', category: 'Video', price: 80, stock: 27 },
  { id: 6, name: 'Hub USB 7 puertos', category: 'Accesorios', price: 35, stock: 120 },
];

function generateCSV(headers: string[], rows: Record<string, unknown>[]): string {
  const escape = (v: unknown) => {
    const s = String(v ?? '');
    return s.includes(',') || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [headers.join(','), ...rows.map((r) => headers.map((h) => escape(r[h])).join(','))].join('\n');
}

function parseCSV(text: string): { headers: string[]; rows: Record<string, string>[] } {
  const lines = text.trim().split('\n').map((l) => l.split(',').map((c) => c.trim().replace(/^"|"$/g, '')));
  const [headers, ...rest] = lines;
  return { headers, rows: rest.map((r) => Object.fromEntries(headers.map((h, i) => [h, r[i] ?? '']))) };
}

const HEADERS: (keyof Product)[] = ['id', 'name', 'category', 'price', 'stock'];

export default function CSVExportDemo() {
  const [data, setData] = useState<Product[]>(INITIAL_DATA);
  const [filter, setFilter] = useState('');
  const [filterField, setFilterField] = useState<keyof Product>('category');
  const [imported, setImported] = useState<{ headers: string[]; rows: Record<string, string>[] } | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const categories = Array.from(new Set(INITIAL_DATA.map((p) => p.category)));
  const filtered = filter ? data.filter((p) => String(p[filterField]).toLowerCase().includes(filter.toLowerCase())) : data;

  const exportCSV = () => {
    const csv = generateCSV(HEADERS, filtered as unknown as Record<string, unknown>[]);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'productos.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setImported(parseCSV(text));
    };
    reader.readAsText(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.name.endsWith('.csv')) processFile(file);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  return (
    <Box>
      <Section title="Exportar CSV" subtitle="Generación pura en el cliente sin librerías. Descarga directa desde Blob URL.">
        <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            size="small" label="Filtrar" value={filter}
            onChange={(e) => setFilter(e.target.value)}
            sx={{ minWidth: 180 }}
          />
          <Select size="small" value={filterField} onChange={(e) => setFilterField(e.target.value as keyof Product)}>
            {HEADERS.map((h) => <MenuItem key={h} value={h}>{h}</MenuItem>)}
          </Select>
          <Chip label={`${filtered.length} filas`} size="small" />
          <Button variant="contained" onClick={exportCSV} startIcon={<DownloadIcon />} size="small">
            Exportar CSV
          </Button>
          <Button variant="outlined" onClick={() => { setFilter(''); setData(INITIAL_DATA); }} size="small" sx={{ color: 'text.secondary' }}>
            Reset
          </Button>
        </Box>

        <TableContainer component={Paper} variant="outlined" sx={{ backgroundColor: 'background.elevated' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ '& th': { fontWeight: 'bold', color: 'text.primary', borderColor: 'divider' } }}>
                {HEADERS.map((h) => <TableCell key={h}>{h}</TableCell>)}
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((row) => (
                <TableRow key={row.id} sx={{ '& td': { borderColor: 'divider' }, '&:last-child td': { border: 0 } }}>
                  {HEADERS.map((h) => (
                    <TableCell key={h}>
                      <Typography variant="caption" sx={{ color: h === 'price' ? 'primary.main' : 'text.secondary', fontFamily: typeof row[h] === 'number' ? 'monospace' : 'inherit' }}>
                        {h === 'price' ? `$${row[h]}` : row[h]}
                      </Typography>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Section>

      <Section title="Importar CSV (drag & drop)" subtitle="Arrastrá un archivo .csv o hacé click para seleccionarlo. Se parsea en el cliente sin servidor.">
        <Box
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => fileRef.current?.click()}
          sx={{
            p: 4, mb: 3, borderRadius: 1, border: '2px dashed',
            borderColor: dragging ? 'primary.main' : 'divider',
            backgroundColor: dragging ? 'rgba(255,112,67,0.05)' : 'background.elevated',
            cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s',
            '&:hover': { borderColor: 'primary.main', backgroundColor: 'rgba(255,112,67,0.03)' },
          }}
        >
          <UploadFileIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Arrastrá un archivo CSV aquí o hacé click para seleccionarlo
          </Typography>
          <input ref={fileRef} type="file" accept=".csv" hidden onChange={onFileChange} />
        </Box>

        {imported && (
          <Box>
            <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
              <Chip label={`${imported.rows.length} filas importadas`} color="success" size="small" />
              <Chip label={`${imported.headers.length} columnas`} size="small" variant="outlined" />
              <Button variant="text" size="small" onClick={() => setImported(null)} sx={{ color: 'text.secondary' }}>Limpiar</Button>
            </Box>
            <TableContainer component={Paper} variant="outlined" sx={{ backgroundColor: 'background.elevated', maxHeight: 300, overflow: 'auto' }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow sx={{ '& th': { fontWeight: 'bold', color: 'text.primary', backgroundColor: 'background.paper', borderColor: 'divider' } }}>
                    {imported.headers.map((h) => <TableCell key={h}>{h}</TableCell>)}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {imported.rows.slice(0, 50).map((row, i) => (
                    <TableRow key={i} sx={{ '& td': { borderColor: 'divider' }, '&:last-child td': { border: 0 } }}>
                      {imported.headers.map((h) => (
                        <TableCell key={h}>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>{row[h]}</Typography>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {!imported && (
          <Stack spacing={1}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
              Ejemplo de CSV válido:
            </Typography>
            <Box sx={{ p: 2, backgroundColor: 'background.elevated', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
              <Typography component="pre" variant="caption" sx={{ fontFamily: 'monospace', color: 'text.primary', m: 0 }}>
                {`id,name,category,price,stock\n1,Teclado,Periféricos,120,45\n2,Monitor,Pantallas,450,12`}
              </Typography>
            </Box>
          </Stack>
        )}
      </Section>
    </Box>
  );
}
