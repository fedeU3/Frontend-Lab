import { Box, Chip, Divider, Paper, Stack, Typography } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors,
  DragOverlay, defaultDropAnimationSideEffects,
  type DragStartEvent, type DragEndEvent, type DragOverEvent,
} from '@dnd-kit/core';
import {
  SortableContext, verticalListSortingStrategy,
  useSortable, arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';

const Section = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <Box sx={{ mb: 6 }}>
    <Typography variant="h6" sx={{ mb: 0.5 }}>{title}</Typography>
    {subtitle && <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>{subtitle}</Typography>}
    <Divider sx={{ mb: 3 }} />
    {children}
  </Box>
);

// ── Sortable list ────────────────────────────────────────────────────────────
type SortableItem = { id: string; label: string; color: string };

const INITIAL_ITEMS: SortableItem[] = [
  { id: '1', label: 'Diseño de UI',         color: 'primary' },
  { id: '2', label: 'Setup del proyecto',   color: 'default' },
  { id: '3', label: 'Componentes base',     color: 'primary' },
  { id: '4', label: 'Integración de API',   color: 'default' },
  { id: '5', label: 'Testing',              color: 'default' },
  { id: '6', label: 'Deploy',               color: 'warning' },
];

function SortableRow({ item, isDragging }: { item: SortableItem; isDragging?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });
  return (
    <Box
      ref={setNodeRef}
      {...attributes}
      sx={{
        display: 'flex', alignItems: 'center', gap: 1.5,
        p: 1.5, borderRadius: 1, border: '1px solid',
        borderColor: isDragging ? 'primary.main' : 'divider',
        backgroundColor: isDragging ? 'rgba(255,112,67,0.06)' : 'background.elevated',
        transform: CSS.Transform.toString(transform),
        transition,
        userSelect: 'none',
      }}
    >
      <Box {...listeners} sx={{ cursor: 'grab', color: 'text.secondary', display: 'flex', '&:active': { cursor: 'grabbing' } }}>
        <DragIndicatorIcon fontSize="small" />
      </Box>
      <Typography variant="body2" sx={{ flex: 1 }}>{item.label}</Typography>
      <Chip label={item.color === 'primary' ? 'activo' : item.color === 'warning' ? 'pendiente' : 'backlog'}
        size="small" color={item.color as any} variant="outlined" />
    </Box>
  );
}

function SortableListDemo() {
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor));
  const activeItem = items.find((i) => i.id === activeId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={(e: DragStartEvent) => setActiveId(e.active.id as string)}
      onDragEnd={(e: DragEndEvent) => {
        const { active, over } = e;
        if (over && active.id !== over.id) {
          setItems((prev) => {
            const from = prev.findIndex((i) => i.id === active.id);
            const to   = prev.findIndex((i) => i.id === over.id);
            return arrayMove(prev, from, to);
          });
        }
        setActiveId(null);
      }}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <Stack spacing={1}>
          {items.map((item) => (
            <SortableRow key={item.id} item={item} isDragging={item.id === activeId} />
          ))}
        </Stack>
      </SortableContext>
      <DragOverlay dropAnimation={{ sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.4' } } }) }}>
        {activeItem && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, borderRadius: 1,
            border: '1px solid', borderColor: 'primary.main', backgroundColor: 'background.elevated',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)', userSelect: 'none' }}>
            <DragIndicatorIcon fontSize="small" sx={{ color: 'primary.main' }} />
            <Typography variant="body2" sx={{ flex: 1 }}>{activeItem.label}</Typography>
          </Box>
        )}
      </DragOverlay>
    </DndContext>
  );
}

// ── Kanban ───────────────────────────────────────────────────────────────────
type KanbanCard = { id: string; title: string };
type ColumnId = 'backlog' | 'progress' | 'done';
type KanbanState = Record<ColumnId, KanbanCard[]>;

const COLUMNS: { id: ColumnId; label: string; color: string }[] = [
  { id: 'backlog',  label: 'Backlog',      color: 'text.secondary' },
  { id: 'progress', label: 'En progreso',  color: 'warning.main' },
  { id: 'done',    label: 'Hecho',         color: 'success.main' },
];

const INITIAL_KANBAN: KanbanState = {
  backlog:  [{ id: 'k1', title: 'Diseñar mockups' }, { id: 'k2', title: 'Definir endpoints' }],
  progress: [{ id: 'k3', title: 'Implementar auth' }],
  done:     [{ id: 'k4', title: 'Setup CI/CD' }, { id: 'k5', title: 'Configurar ESLint' }],
};

function findColumn(state: KanbanState, cardId: string): ColumnId | null {
  for (const col of Object.keys(state) as ColumnId[]) {
    if (state[col].some((c) => c.id === cardId)) return col;
  }
  return null;
}

function KanbanDemo() {
  const [board, setBoard] = useState<KanbanState>(INITIAL_KANBAN);
  const [activeCard, setActiveCard] = useState<KanbanCard | null>(null);
  const sensors = useSensors(useSensor(PointerSensor));

  const onDragStart = ({ active }: DragStartEvent) => {
    const col = findColumn(board, active.id as string);
    if (col) setActiveCard(board[col].find((c) => c.id === active.id) ?? null);
  };

  const onDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) return;
    const fromCol = findColumn(board, active.id as string);
    const toCol   = (Object.keys(board) as ColumnId[]).includes(over.id as ColumnId)
      ? (over.id as ColumnId)
      : findColumn(board, over.id as string);
    if (!fromCol || !toCol || fromCol === toCol) return;
    setBoard((prev) => {
      const card = prev[fromCol].find((c) => c.id === active.id)!;
      return {
        ...prev,
        [fromCol]: prev[fromCol].filter((c) => c.id !== active.id),
        [toCol]:   [...prev[toCol], card],
      };
    });
  };

  const onDragEnd = () => setActiveCard(null);

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={onDragStart} onDragOver={onDragOver} onDragEnd={onDragEnd}>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
        {COLUMNS.map((col) => (
          <SortableContext key={col.id} id={col.id} items={board[col.id]} strategy={verticalListSortingStrategy}>
            <Paper variant="outlined" sx={{ p: 1.5, backgroundColor: 'background.elevated', minHeight: 200 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <Typography variant="caption" fontWeight="bold" sx={{ color: col.color }}>{col.label}</Typography>
                <Chip label={board[col.id].length} size="small" sx={{ height: 18, fontSize: '0.65rem' }} />
              </Box>
              <Stack spacing={1}>
                {board[col.id].map((card) => (
                  <KanbanCardItem key={card.id} card={card} isActive={card.id === activeCard?.id} />
                ))}
              </Stack>
            </Paper>
          </SortableContext>
        ))}
      </Box>
      <DragOverlay>
        {activeCard && (
          <Box sx={{ p: 1.5, borderRadius: 1, border: '1px solid', borderColor: 'primary.main',
            backgroundColor: 'background.elevated', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
            <Typography variant="body2">{activeCard.title}</Typography>
          </Box>
        )}
      </DragOverlay>
    </DndContext>
  );
}

function KanbanCardItem({ card, isActive }: { card: KanbanCard; isActive: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: card.id });
  return (
    <Box ref={setNodeRef} {...attributes} {...listeners}
      sx={{ p: 1.5, borderRadius: 1, border: '1px solid', cursor: 'grab',
        borderColor: isActive ? 'primary.main' : 'divider',
        backgroundColor: isActive ? 'rgba(255,112,67,0.06)' : 'background.paper',
        transform: CSS.Transform.toString(transform), transition,
        '&:active': { cursor: 'grabbing' } }}>
      <Typography variant="body2">{card.title}</Typography>
    </Box>
  );
}

export default function DragDropDemo() {
  return (
    <Box>
      <Section title="Lista sortable" subtitle="Arrastrá los ítems para reordenarlos. useSortable + arrayMove manejan el estado.">
        <Box sx={{ maxWidth: 480 }}>
          <SortableListDemo />
        </Box>
      </Section>
      <Section title="Tablero Kanban" subtitle="Arrastrá tarjetas entre columnas. DragOverlay renderiza el elemento flotante durante el drag.">
        <KanbanDemo />
      </Section>
    </Box>
  );
}
