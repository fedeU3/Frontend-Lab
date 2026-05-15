import { Box, Button, Checkbox, Chip, Divider, IconButton, Stack, TextField, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const Section = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <Box sx={{ mb: 6 }}>
    <Typography variant="h6" sx={{ mb: 0.5 }}>{title}</Typography>
    {subtitle && <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>{subtitle}</Typography>}
    <Divider sx={{ mb: 3 }} />
    {children}
  </Box>
);

interface CounterState {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

const useCounterStore = create<CounterState>()(
  devtools(
    (set) => ({
      count: 0,
      increment: () => set((s) => ({ count: s.count + 1 }), false, 'increment'),
      decrement: () => set((s) => ({ count: s.count - 1 }), false, 'decrement'),
      reset: () => set({ count: 0 }, false, 'reset'),
    }),
    { name: 'CounterStore' }
  )
);

interface Todo { id: number; text: string; done: boolean }
interface TodoState {
  todos: Todo[];
  addTodo: (text: string) => void;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
}

const useTodoStore = create<TodoState>()(
  devtools(
    (set) => ({
      todos: [
        { id: 1, text: 'Aprender Zustand', done: true },
        { id: 2, text: 'Implementar devtools', done: false },
      ],
      addTodo: (text) =>
        set((s) => ({ todos: [...s.todos, { id: Date.now(), text, done: false }] }), false, 'addTodo'),
      toggleTodo: (id) =>
        set((s) => ({ todos: s.todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)) }), false, 'toggleTodo'),
      deleteTodo: (id) =>
        set((s) => ({ todos: s.todos.filter((t) => t.id !== id) }), false, 'deleteTodo'),
    }),
    { name: 'TodoStore' }
  )
);

function CounterDemo() {
  const { count, increment, decrement, reset } = useCounterStore();
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Button variant="outlined" onClick={decrement}>−</Button>
      <Typography variant="h4" fontWeight="bold" sx={{ minWidth: 60, textAlign: 'center' }}>{count}</Typography>
      <Button variant="outlined" onClick={increment}>+</Button>
      <Button variant="text" onClick={reset} sx={{ ml: 2, color: 'text.secondary' }}>Reset</Button>
    </Box>
  );
}

function TodoList() {
  const { todos, addTodo, toggleTodo, deleteTodo } = useTodoStore();
  const [text, setText] = useState('');

  const handleAdd = () => {
    if (!text.trim()) return;
    addTodo(text.trim());
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
        {todos.map((todo) => (
          <Box key={todo.id} sx={{
            display: 'flex', alignItems: 'center', gap: 1,
            p: 1.5, borderRadius: 1, border: '1px solid', borderColor: 'divider',
            backgroundColor: 'background.elevated',
          }}>
            <Checkbox size="small" checked={todo.done} onChange={() => toggleTodo(todo.id)} sx={{ color: 'primary.main' }} />
            <Typography variant="body2" sx={{
              flex: 1,
              textDecoration: todo.done ? 'line-through' : 'none',
              color: todo.done ? 'text.secondary' : 'text.primary',
            }}>
              {todo.text}
            </Typography>
            <IconButton size="small" onClick={() => deleteTodo(todo.id)}><DeleteIcon fontSize="small" /></IconButton>
          </Box>
        ))}
      </Stack>
      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
        <Chip label={`Total: ${todos.length}`} size="small" />
        <Chip label={`Hechos: ${todos.filter((t) => t.done).length}`} size="small" color="primary" />
      </Box>
    </Box>
  );
}

export default function ZustandDemo() {
  return (
    <Box>
      <Section title="create() con devtools" subtitle="Cada acción recibe un nombre de string que aparece en Redux DevTools. Abrí la extensión para verlas.">
        <Box sx={{ mb: 3, p: 2, backgroundColor: 'background.elevated', borderRadius: 1, border: '1px solid', borderColor: 'divider', maxWidth: 520 }}>
          <Typography component="pre" variant="caption" sx={{ fontFamily: 'monospace', color: 'text.primary', whiteSpace: 'pre-wrap', m: 0 }}>
{`const useCounterStore = create<State>()(
  devtools(
    (set) => ({
      count: 0,
      increment: () => set(
        (s) => ({ count: s.count + 1 }),
        false,        // replace? false = merge
        'increment',  // action name en DevTools
      ),
    }),
    { name: 'CounterStore' }
  )
);`}
          </Typography>
        </Box>
        <CounterDemo />
      </Section>

      <Section title="Lista de tareas" subtitle="Store con array de objetos. Las mutaciones usan spread manual. Cada acción es visible en Redux DevTools.">
        <TodoList />
      </Section>

      <Section title="Patrón con Immer (referencia)" subtitle="Con zustand/middleware/immer podés mutar el estado directamente en lugar de hacer spread.">
        <Box sx={{ p: 2, backgroundColor: 'background.elevated', borderRadius: 1, border: '1px solid', borderColor: 'divider', maxWidth: 560 }}>
          <Typography component="pre" variant="caption" sx={{ fontFamily: 'monospace', color: 'text.primary', whiteSpace: 'pre-wrap', m: 0 }}>
{`import { immer } from 'zustand/middleware/immer';

const useStore = create<State>()(
  immer((set) => ({
    todos: [],
    addTodo: (text: string) => set((state) => {
      // mutación directa — immer crea la copia internamente
      state.todos.push({ id: Date.now(), text, done: false });
    }),
    toggleTodo: (id: number) => set((state) => {
      const todo = state.todos.find((t) => t.id === id);
      if (todo) todo.done = !todo.done;
    }),
  }))
);`}
          </Typography>
        </Box>
      </Section>
    </Box>
  );
}
