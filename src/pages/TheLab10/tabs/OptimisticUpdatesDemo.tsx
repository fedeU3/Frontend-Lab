import { Box, Button, Chip, CircularProgress, Divider, IconButton, Paper, Stack, TextField, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const Section = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <Box sx={{ mb: 6 }}>
    <Typography variant="h6" sx={{ mb: 0.5 }}>{title}</Typography>
    {subtitle && <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>{subtitle}</Typography>}
    <Divider sx={{ mb: 3 }} />
    {children}
  </Box>
);

interface Post { id: number; title: string; liked: boolean; likes: number }

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
let POST_STORE: Post[] = [
  { id: 1, title: 'React 19 en producción', liked: false, likes: 42 },
  { id: 2, title: 'useOptimistic — la guía definitiva', liked: true, likes: 87 },
  { id: 3, title: 'Por qué elegí Zustand sobre Redux', liked: false, likes: 31 },
];
let nextId = 4;

async function fetchPosts(): Promise<Post[]> {
  await delay(300);
  return [...POST_STORE];
}
async function addPost(title: string): Promise<Post> {
  await delay(600);
  const post: Post = { id: nextId++, title, liked: false, likes: 0 };
  POST_STORE = [...POST_STORE, post];
  return post;
}
async function toggleLike(id: number): Promise<Post> {
  await delay(500);
  if (Math.random() < 0.25) throw new Error('Server error');
  POST_STORE = POST_STORE.map((p) => p.id === id ? { ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) } : p);
  return POST_STORE.find((p) => p.id === id)!;
}
async function deletePost(id: number): Promise<void> {
  await delay(700);
  POST_STORE = POST_STORE.filter((p) => p.id !== id);
}

export default function OptimisticUpdatesDemo() {
  const qc = useQueryClient();
  const [newTitle, setNewTitle] = useState('');
  const [rollbacks, setRollbacks] = useState(0);

  const { data: posts = [], isLoading } = useQuery({ queryKey: ['posts'], queryFn: fetchPosts });

  const likeMutation = useMutation({
    mutationFn: toggleLike,
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ['posts'] });
      const prev = qc.getQueryData<Post[]>(['posts']);
      qc.setQueryData<Post[]>(['posts'], (old) =>
        old?.map((p) => p.id === id ? { ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) } : p) ?? []
      );
      return { prev };
    },
    onError: (_, __, ctx) => {
      qc.setQueryData(['posts'], ctx?.prev);
      setRollbacks((r) => r + 1);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['posts'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ['posts'] });
      const prev = qc.getQueryData<Post[]>(['posts']);
      qc.setQueryData<Post[]>(['posts'], (old) => old?.filter((p) => p.id !== id) ?? []);
      return { prev };
    },
    onError: (_, __, ctx) => {
      qc.setQueryData(['posts'], ctx?.prev);
      setRollbacks((r) => r + 1);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['posts'] }),
  });

  const addMutation = useMutation({
    mutationFn: addPost,
    onMutate: async (title) => {
      await qc.cancelQueries({ queryKey: ['posts'] });
      const prev = qc.getQueryData<Post[]>(['posts']);
      const tempPost: Post = { id: -Date.now(), title, liked: false, likes: 0 };
      qc.setQueryData<Post[]>(['posts'], (old) => [...(old ?? []), tempPost]);
      return { prev };
    },
    onError: (_, __, ctx) => qc.setQueryData(['posts'], ctx?.prev),
    onSettled: () => qc.invalidateQueries({ queryKey: ['posts'] }),
  });

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    addMutation.mutate(newTitle.trim());
    setNewTitle('');
  };

  return (
    <Box>
      <Section
        title="React Query — useMutation optimista"
        subtitle="onMutate actualiza el cache localmente antes de que el servidor responda. onError revierte si falla. onSettled sincroniza el cache con el servidor."
      >
        <Box sx={{ mb: 3, p: 2, backgroundColor: 'background.elevated', borderRadius: 1, border: '1px solid', borderColor: 'divider', maxWidth: 560 }}>
          <Typography component="pre" variant="caption" sx={{ fontFamily: 'monospace', color: 'text.primary', whiteSpace: 'pre-wrap', m: 0 }}>
{`useMutation({
  mutationFn: toggleLike,
  onMutate: async (id) => {
    await qc.cancelQueries({ queryKey: ['posts'] }); // evitar race condition
    const prev = qc.getQueryData<Post[]>(['posts']);  // snapshot para rollback
    qc.setQueryData<Post[]>(['posts'], (old) =>       // actualización optimista
      old?.map((p) => p.id === id ? { ...p, liked: !p.liked } : p)
    );
    return { prev };                                  // contexto para onError
  },
  onError: (err, id, ctx) => {
    qc.setQueryData(['posts'], ctx?.prev);            // rollback
  },
  onSettled: () => qc.invalidateQueries({ queryKey: ['posts'] }),
})`}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mb: 3, alignItems: 'center', flexWrap: 'wrap' }}>
          <Chip label={`Rollbacks: ${rollbacks}`} color={rollbacks > 0 ? 'error' : 'default'} size="small" />
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>Like tiene ~25% de tasa de error simulada</Typography>
        </Box>

        {isLoading && <CircularProgress size={24} />}

        <Stack spacing={1.5} sx={{ maxWidth: 600, mb: 3 }}>
          {posts.map((post) => (
            <Paper key={post.id} variant="outlined" sx={{ p: 2, backgroundColor: 'background.elevated', display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" sx={{ flex: 1 }}>{post.title}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <IconButton
                  size="small"
                  onClick={() => likeMutation.mutate(post.id)}
                  disabled={likeMutation.isPending && likeMutation.variables === post.id}
                  sx={{ color: post.liked ? 'error.main' : 'text.secondary' }}
                >
                  {post.liked ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
                </IconButton>
                <Typography variant="caption" sx={{ color: 'text.secondary', minWidth: 20 }}>{post.likes}</Typography>
              </Box>
              <IconButton
                size="small"
                onClick={() => deleteMutation.mutate(post.id)}
                disabled={deleteMutation.isPending && deleteMutation.variables === post.id}
                sx={{ color: 'text.secondary' }}
              >
                {deleteMutation.isPending && deleteMutation.variables === post.id
                  ? <CircularProgress size={16} />
                  : <DeleteIcon fontSize="small" />
                }
              </IconButton>
            </Paper>
          ))}
        </Stack>

        <Box sx={{ display: 'flex', gap: 1, maxWidth: 480 }}>
          <TextField
            size="small" fullWidth value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Título del nuevo post…"
          />
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd} disabled={addMutation.isPending}>
            {addMutation.isPending ? '…' : 'Agregar'}
          </Button>
        </Box>
      </Section>
    </Box>
  );
}
