import { Box, Button, Chip, CircularProgress, Divider, Paper, Stack, Typography } from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

const Section = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <Box sx={{ mb: 6 }}>
    <Typography variant="h6" sx={{ mb: 0.5 }}>{title}</Typography>
    {subtitle && <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>{subtitle}</Typography>}
    <Divider sx={{ mb: 3 }} />
    {children}
  </Box>
);

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

interface Post { id: number; title: string; views: number }

let FETCH_COUNT = 0;
async function fetchPost(id: number): Promise<Post> {
  await delay(800);
  FETCH_COUNT++;
  return { id, title: `Post #${id} — ${['React', 'TypeScript', 'Vite', 'MUI'][id % 4]}`, views: Math.floor(Math.random() * 1000) };
}

async function fetchPopularPosts(): Promise<Post[]> {
  await delay(600);
  FETCH_COUNT++;
  return Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    title: `Popular #${i + 1}`,
    views: 1000 - i * 150,
  }));
}

function FetchCounter({ count }: { count: number }) {
  return (
    <Chip
      label={`Network requests: ${count}`}
      size="small"
      color={count === 0 ? 'default' : count < 3 ? 'success' : 'warning'}
      sx={{ fontFamily: 'monospace', mb: 2 }}
    />
  );
}

function PostCard({ post, isFetching }: { post: Post; isFetching: boolean }) {
  return (
    <Paper variant="outlined" sx={{ p: 1.5, backgroundColor: 'background.elevated', display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'primary.main', flexShrink: 0 }}>#{post.id}</Typography>
      <Typography variant="body2" sx={{ flex: 1 }}>{post.title}</Typography>
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>{post.views} views</Typography>
      {isFetching && <CircularProgress size={14} />}
    </Paper>
  );
}

function StaleTimeDemo() {
  const [postId, setPostId] = useState(1);
  const [fetchCount, setFetchCount] = useState(0);

  const { data, isFetching, dataUpdatedAt } = useQuery({
    queryKey: ['post-stale', postId],
    queryFn: async () => {
      setFetchCount((c) => c + 1);
      return fetchPost(postId);
    },
    staleTime: 10_000,
    gcTime: 30_000,
  });

  return (
    <Box>
      <FetchCounter count={fetchCount} />
      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1.5 }}>
        staleTime: 10s · gcTime: 30s — Cambiá de post y volvé: si no pasaron 10s, no hay re-fetch.
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        {[1, 2, 3, 4].map((id) => (
          <Button key={id} size="small" variant={postId === id ? 'contained' : 'outlined'} onClick={() => setPostId(id)}>
            Post {id}
          </Button>
        ))}
      </Box>
      {data && <PostCard post={data} isFetching={isFetching} />}
      {dataUpdatedAt > 0 && (
        <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block' }}>
          Última actualización: {new Date(dataUpdatedAt).toLocaleTimeString()}
        </Typography>
      )}
    </Box>
  );
}

function PrefetchDemo() {
  const qc = useQueryClient();
  const [postId, setPostId] = useState<number | null>(null);
  const [prefetched, setPrefetched] = useState<number[]>([]);
  const [fetchCount, setFetchCount] = useState(0);

  const { data, isFetching } = useQuery({
    queryKey: ['post-prefetch', postId],
    queryFn: async () => {
      setFetchCount((c) => c + 1);
      return fetchPost(postId!);
    },
    enabled: postId !== null,
    staleTime: 15_000,
  });

  const prefetch = async (id: number) => {
    await qc.prefetchQuery({
      queryKey: ['post-prefetch', id],
      queryFn: async () => {
        setFetchCount((c) => c + 1);
        return fetchPost(id);
      },
      staleTime: 15_000,
    });
    setPrefetched((prev) => prev.includes(id) ? prev : [...prev, id]);
  };

  return (
    <Box>
      <FetchCounter count={fetchCount} />
      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1.5 }}>
        Hover prefetch: pasar el mouse sobre un botón precarga en segundo plano. Al hacer click, el dato ya está en caché.
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        {[1, 2, 3, 4].map((id) => (
          <Button
            key={id}
            size="small"
            variant={postId === id ? 'contained' : 'outlined'}
            onMouseEnter={() => prefetch(id)}
            onClick={() => setPostId(id)}
            endIcon={prefetched.includes(id) ? <Chip label="cached" size="small" color="success" sx={{ height: 16, fontSize: '0.6rem' }} /> : undefined}
          >
            Post {id}
          </Button>
        ))}
      </Box>
      {isFetching && !data && <CircularProgress size={20} />}
      {data && <PostCard post={data} isFetching={isFetching} />}
    </Box>
  );
}

function InvalidationDemo() {
  const qc = useQueryClient();
  const [fetchCount, setFetchCount] = useState(0);

  const { data: posts, isFetching } = useQuery({
    queryKey: ['popular-posts'],
    queryFn: async () => {
      setFetchCount((c) => c + 1);
      return fetchPopularPosts();
    },
    staleTime: Infinity,
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ['popular-posts'] });
  const invalidateAll = () => qc.invalidateQueries();

  return (
    <Box>
      <FetchCounter count={fetchCount} />
      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1.5 }}>
        staleTime: Infinity — nunca re-fetcha solo. Invalidar fuerza refetch inmediato.
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        <Button size="small" variant="outlined" onClick={invalidate} disabled={isFetching}>
          Invalidar popular-posts
        </Button>
        <Button size="small" variant="outlined" color="warning" onClick={invalidateAll} disabled={isFetching}>
          Invalidar todo el caché
        </Button>
      </Box>
      <Stack spacing={0.75} sx={{ maxWidth: 480 }}>
        {posts?.map((p) => <PostCard key={p.id} post={p} isFetching={isFetching} />)}
      </Stack>
    </Box>
  );
}

function PlaceholderDemo() {
  const [postId, setPostId] = useState(1);
  const [fetchCount, setFetchCount] = useState(0);

  const { data, isPlaceholderData, isFetching } = useQuery({
    queryKey: ['post-placeholder', postId],
    queryFn: async () => {
      setFetchCount((c) => c + 1);
      return fetchPost(postId);
    },
    placeholderData: { id: postId, title: 'Cargando…', views: 0 },
    staleTime: 5_000,
  });

  return (
    <Box>
      <FetchCounter count={fetchCount} />
      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1.5 }}>
        placeholderData muestra un valor inmediato antes del fetch. No persiste en caché, a diferencia de initialData.
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        {[1, 2, 3].map((id) => (
          <Button key={id} size="small" variant={postId === id ? 'contained' : 'outlined'} onClick={() => setPostId(id)}>
            Post {id}
          </Button>
        ))}
      </Box>
      {data && (
        <Box>
          <PostCard post={data} isFetching={isFetching} />
          {isPlaceholderData && (
            <Chip label="placeholder" size="small" color="warning" sx={{ mt: 0.75, fontSize: '0.65rem' }} />
          )}
        </Box>
      )}
    </Box>
  );
}

export default function CachingPatterns() {
  return (
    <Box>
      <Section
        title="staleTime y gcTime"
        subtitle="staleTime controla cuándo un dato se considera obsoleto. gcTime controla cuánto tiempo se mantiene en caché tras quedar inactivo."
      >
        <StaleTimeDemo />
      </Section>

      <Section
        title="Prefetch en hover"
        subtitle="queryClient.prefetchQuery() permite cargar datos antes de que el usuario los solicite explícitamente."
      >
        <PrefetchDemo />
      </Section>

      <Section
        title="Invalidación de caché"
        subtitle="invalidateQueries() marca queries como stale y dispara un refetch si hay suscriptores activos."
      >
        <InvalidationDemo />
      </Section>

      <Section
        title="placeholderData vs initialData"
        subtitle="placeholderData: valor temporal que no se persiste en caché. initialData: valor inicial que sí se persiste (necesita initialDataUpdatedAt)."
      >
        <PlaceholderDemo />
      </Section>

      <Section title="Referencia rápida">
        <Stack spacing={1} sx={{ maxWidth: 600 }}>
          {[
            { prop: 'staleTime: 0', desc: 'Default. El dato se considera stale inmediatamente tras el fetch.' },
            { prop: 'staleTime: Infinity', desc: 'Nunca se considera stale. Solo refetcha con invalidación explícita.' },
            { prop: 'gcTime: 5min', desc: 'Default. Tiempo que el caché retiene datos sin suscriptores activos.' },
            { prop: 'refetchOnWindowFocus', desc: 'Default: true. Refetcha al recuperar foco si el dato está stale.' },
            { prop: 'placeholderData', desc: 'Dato visible inmediatamente, reemplazado cuando llega el real.' },
            { prop: 'initialData', desc: 'Como placeholderData pero persiste en caché como si fuera un fetch real.' },
            { prop: 'keepPreviousData', desc: 'Migrado a placeholderData: keepPreviousData en v5.' },
          ].map(({ prop, desc }) => (
            <Paper key={prop} variant="outlined" sx={{ p: 1.5, backgroundColor: 'background.elevated', display: 'flex', gap: 2 }}>
              <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'primary.main', flexShrink: 0, minWidth: 200 }}>{prop}</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>{desc}</Typography>
            </Paper>
          ))}
        </Stack>
      </Section>
    </Box>
  );
}
