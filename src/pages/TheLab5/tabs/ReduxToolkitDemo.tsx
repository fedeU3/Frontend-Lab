import { Box, Button, Checkbox, Chip, Divider, IconButton, Stack, TextField, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import { configureStore, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { Provider, useSelector, useDispatch } from 'react-redux';

const Section = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <Box sx={{ mb: 6 }}>
    <Typography variant="h6" sx={{ mb: 0.5 }}>{title}</Typography>
    {subtitle && <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>{subtitle}</Typography>}
    <Divider sx={{ mb: 3 }} />
    {children}
  </Box>
);

interface Todo { id: number; text: string; done: boolean }
interface TodosState { items: Todo[] }

const todosSlice = createSlice({
  name: 'todos',
  initialState: {
    items: [
      { id: 1, text: 'Aprender Redux Toolkit', done: true },
      { id: 2, text: 'Usar createSlice', done: false },
    ],
  } as TodosState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      state.items.push({ id: Date.now(), text: action.payload, done: false });
    },
    toggleTodo: (state, action: PayloadAction<number>) => {
      const todo = state.items.find((t) => t.id === action.payload);
      if (todo) todo.done = !todo.done;
    },
    deleteTodo: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((t) => t.id !== action.payload);
    },
  },
});

const { addTodo, toggleTodo, deleteTodo } = todosSlice.actions;

const store = configureStore({ reducer: { todos: todosSlice.reducer } });
type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

function TodoList() {
  const items = useSelector((state: RootState) => state.todos.items);
  const dispatch = useDispatch<AppDispatch>();
  const [text, setText] = useState('');

  const handleAdd = () => {
    if (!text.trim()) return;
    dispatch(addTodo(text.trim()));
    setText('');
  };

  return (
    <Box sx={{ maxWidth: 480 }}>
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          size="small" fullWidth value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Nueva tarea..."
        />
        <Button variant="contained" onClick={handleAdd} startIcon={<AddIcon />}>Agregar</Button>
      </Box>
      <Stack spacing={1}>
        {items.map((todo) => (
          <Box key={todo.id} sx={{
            display: 'flex', alignItems: 'center', gap: 1,
            p: 1.5, borderRadius: 1, border: '1px solid', borderColor: 'divider',
            backgroundColor: 'background.elevated',
          }}>
            <Checkbox size="small" checked={todo.done} onChange={() => dispatch(toggleTodo(todo.id))} sx={{ color: 'primary.main' }} />
            <Typography variant="body2" sx={{
              flex: 1,
              textDecoration: todo.done ? 'line-through' : 'none',
              color: todo.done ? 'text.secondary' : 'text.primary',
            }}>
              {todo.text}
            </Typography>
            <IconButton size="small" onClick={() => dispatch(deleteTodo(todo.id))}><DeleteIcon fontSize="small" /></IconButton>
          </Box>
        ))}
      </Stack>
      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
        <Chip label={`Total: ${items.length}`} size="small" />
        <Chip label={`Hechos: ${items.filter((t) => t.done).length}`} size="small" color="primary" />
      </Box>
    </Box>
  );
}

export default function ReduxToolkitDemo() {
  return (
    <Provider store={store}>
      <Box>
        <Section title="createSlice" subtitle="Agrupa el nombre, estado inicial y reducers. Immer está incluido — las mutaciones directas en reducers son seguras.">
          <Box sx={{ p: 2, mb: 3, backgroundColor: 'background.elevated', borderRadius: 1, border: '1px solid', borderColor: 'divider', maxWidth: 560 }}>
            <Typography component="pre" variant="caption" sx={{ fontFamily: 'monospace', color: 'text.primary', whiteSpace: 'pre-wrap', m: 0 }}>
{`const todosSlice = createSlice({
  name: 'todos',
  initialState: { items: [] as Todo[] },
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      state.items.push({ id: Date.now(), text: action.payload, done: false });
    },
    toggleTodo: (state, action: PayloadAction<number>) => {
      const todo = state.items.find((t) => t.id === action.payload);
      if (todo) todo.done = !todo.done;
    },
  },
});`}
            </Typography>
          </Box>
        </Section>

        <Section title="configureStore + Provider" subtitle="El store se crea con configureStore y se provee con <Provider>. useSelector y useDispatch son los hooks de conexión.">
          <Box sx={{ p: 2, mb: 3, backgroundColor: 'background.elevated', borderRadius: 1, border: '1px solid', borderColor: 'divider', maxWidth: 560 }}>
            <Typography component="pre" variant="caption" sx={{ fontFamily: 'monospace', color: 'text.primary', whiteSpace: 'pre-wrap', m: 0 }}>
{`const store = configureStore({
  reducer: { todos: todosSlice.reducer }
});
type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

// En componentes hijos:
const items = useSelector((s: RootState) => s.todos.items);
const dispatch = useDispatch<AppDispatch>();
dispatch(addTodo('Nueva tarea'));`}
            </Typography>
          </Box>
          <TodoList />
        </Section>
      </Box>
    </Provider>
  );
}
