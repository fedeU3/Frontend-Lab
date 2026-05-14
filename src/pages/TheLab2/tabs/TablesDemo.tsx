import {
  Box, Checkbox, Chip, Divider, IconButton, InputAdornment,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TablePagination, TableRow, TableSortLabel, TextField,
  Toolbar, Tooltip, Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import { useMemo, useState } from 'react';

// ── Mock data ──────────────────────────────────────────────────────────────
type Row = {
  id: number;
  nombre: string;
  rol: 'admin' | 'editor' | 'viewer';
  estado: 'activo' | 'inactivo' | 'pendiente';
  fechaAlta: string;
  pedidos: number;
};

const ROL_COLOR: Record<Row['rol'], 'error' | 'warning' | 'default'> = {
  admin: 'error',
  editor: 'warning',
  viewer: 'default',
};
const ESTADO_COLOR: Record<Row['estado'], 'success' | 'error' | 'warning'> = {
  activo: 'success',
  inactivo: 'error',
  pendiente: 'warning',
};

const ROWS: Row[] = [
  { id: 1,  nombre: 'Ana García',     rol: 'admin',  estado: 'activo',   fechaAlta: '2024-01-15', pedidos: 142 },
  { id: 2,  nombre: 'Bruno López',    rol: 'editor', estado: 'activo',   fechaAlta: '2024-02-03', pedidos: 87  },
  { id: 3,  nombre: 'Carla Méndez',   rol: 'viewer', estado: 'inactivo', fechaAlta: '2024-02-18', pedidos: 3   },
  { id: 4,  nombre: 'Diego Ruiz',     rol: 'editor', estado: 'activo',   fechaAlta: '2024-03-07', pedidos: 54  },
  { id: 5,  nombre: 'Elena Torres',   rol: 'viewer', estado: 'pendiente',fechaAlta: '2024-03-22', pedidos: 0   },
  { id: 6,  nombre: 'Facundo Vera',   rol: 'admin',  estado: 'activo',   fechaAlta: '2024-04-01', pedidos: 210 },
  { id: 7,  nombre: 'Gabriela Soto',  rol: 'editor', estado: 'activo',   fechaAlta: '2024-04-15', pedidos: 66  },
  { id: 8,  nombre: 'Hernán Díaz',    rol: 'viewer', estado: 'inactivo', fechaAlta: '2024-05-02', pedidos: 1   },
  { id: 9,  nombre: 'Iris Morales',   rol: 'viewer', estado: 'activo',   fechaAlta: '2024-05-20', pedidos: 23  },
  { id: 10, nombre: 'Juan Cabrera',   rol: 'editor', estado: 'pendiente',fechaAlta: '2024-06-08', pedidos: 0   },
  { id: 11, nombre: 'Karina Flores',  rol: 'admin',  estado: 'activo',   fechaAlta: '2024-06-25', pedidos: 188 },
  { id: 12, nombre: 'Lucas Peralta',  rol: 'viewer', estado: 'activo',   fechaAlta: '2024-07-10', pedidos: 9   },
  { id: 13, nombre: 'Martina Ríos',   rol: 'editor', estado: 'inactivo', fechaAlta: '2024-07-28', pedidos: 37  },
  { id: 14, nombre: 'Nicolás Vargas', rol: 'viewer', estado: 'activo',   fechaAlta: '2024-08-14', pedidos: 44  },
  { id: 15, nombre: 'Olivia Reyes',   rol: 'editor', estado: 'activo',   fechaAlta: '2024-09-01', pedidos: 91  },
];

type SortKey = keyof Omit<Row, 'id'>;
type SortDir = 'asc' | 'desc';

function stableSort(rows: Row[], key: SortKey, dir: SortDir): Row[] {
  return [...rows].sort((a, b) => {
    const av = a[key];
    const bv = b[key];
    const cmp = av < bv ? -1 : av > bv ? 1 : 0;
    return dir === 'asc' ? cmp : -cmp;
  });
}

// ── Component ──────────────────────────────────────────────────────────────
export default function TablesDemo() {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('nombre');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setPage(0);
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return ROWS.filter(
      (r) =>
        r.nombre.toLowerCase().includes(q) ||
        r.rol.includes(q) ||
        r.estado.includes(q)
    );
  }, [search]);

  const sorted = useMemo(() => stableSort(filtered, sortKey, sortDir), [filtered, sortKey, sortDir]);

  const paginated = sorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const allVisibleIds = paginated.map((r) => r.id);
  const allSelected = allVisibleIds.every((id) => selected.has(id)) && allVisibleIds.length > 0;
  const someSelected = allVisibleIds.some((id) => selected.has(id)) && !allSelected;

  const toggleAll = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allSelected) allVisibleIds.forEach((id) => next.delete(id));
      else allVisibleIds.forEach((id) => next.add(id));
      return next;
    });
  };

  const toggleOne = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const deleteSelected = () => {
    setSelected(new Set());
  };

  const cols: { key: SortKey; label: string; align?: 'right' }[] = [
    { key: 'nombre',    label: 'Nombre' },
    { key: 'rol',       label: 'Rol' },
    { key: 'estado',    label: 'Estado' },
    { key: 'fechaAlta', label: 'Fecha de alta' },
    { key: 'pedidos',   label: 'Pedidos', align: 'right' },
  ];

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 0.5 }}>
        Table con sorting, filtro y selección
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
        Sorting por columna, búsqueda global, selección con checkboxes y paginación. Todo con MUI Table.
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Box
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          overflow: 'hidden',
          backgroundColor: 'background.elevated',
        }}
      >
        {/* ── Toolbar ── */}
        <Toolbar
          sx={{
            pl: 2, pr: 1,
            gap: 2,
            ...(selected.size > 0 && { backgroundColor: 'primary.main', '& *': { color: '#080808 !important' } }),
          }}
        >
          {selected.size > 0 ? (
            <>
              <Typography sx={{ flex: 1, fontWeight: 'bold' }}>
                {selected.size} seleccionado{selected.size > 1 ? 's' : ''}
              </Typography>
              <Tooltip title="Eliminar selección">
                <IconButton onClick={deleteSelected}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </>
          ) : (
            <>
              <TextField
                size="small"
                placeholder="Buscar por nombre, rol o estado…"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                sx={{ flex: 1, maxWidth: 360 }}
              />
              <Tooltip title="Filtros avanzados (demo)">
                <IconButton>
                  <FilterListIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Toolbar>

        {/* ── Table ── */}
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={someSelected}
                    checked={allSelected}
                    onChange={toggleAll}
                  />
                </TableCell>
                {cols.map(({ key, label, align }) => (
                  <TableCell key={key} align={align}>
                    <TableSortLabel
                      active={sortKey === key}
                      direction={sortKey === key ? sortDir : 'asc'}
                      onClick={() => handleSort(key)}
                    >
                      {label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                    Sin resultados para "{search}"
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((row) => (
                  <TableRow
                    key={row.id}
                    hover
                    selected={selected.has(row.id)}
                    onClick={() => toggleOne(row.id)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox checked={selected.has(row.id)} onClick={(e) => e.stopPropagation()} onChange={() => toggleOne(row.id)} />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{row.nombre}</TableCell>
                    <TableCell>
                      <Chip label={row.rol} size="small" color={ROL_COLOR[row.rol]} variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Chip label={row.estado} size="small" color={ESTADO_COLOR[row.estado]} />
                    </TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{row.fechaAlta}</TableCell>
                    <TableCell align="right" sx={{ fontFamily: 'monospace' }}>{row.pedidos}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* ── Pagination ── */}
        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, p) => setPage(p)}
          onRowsPerPageChange={(e) => { setRowsPerPage(+e.target.value); setPage(0); }}
          rowsPerPageOptions={[5, 10, 15]}
          labelRowsPerPage="Filas:"
          labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
        />
      </Box>
    </Box>
  );
}
