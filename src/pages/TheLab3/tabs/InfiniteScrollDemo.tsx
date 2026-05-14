import {
  Avatar, Box, Card, CardContent, CardHeader,
  Chip, CircularProgress, Divider, Skeleton, Typography,
} from '@mui/material';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

type Post = { id: number; title: string; body: string; author: string; tag: string };

const TAGS = ['React', 'TypeScript', 'MUI', 'Testing', 'Performance', 'Design'];
const AUTHORS = ['Ana García', 'Luis Torres', 'María López', 'Carlos Ruiz', 'Sofia Chen'];
const PREFIXES = ['Cómo usar', 'Guía de', 'Introducción a', 'Deep dive en', 'Best practices de'];

function generatePage(page: number, size = 8): { posts: Post[]; nextPage: number | null } {
  const posts: Post[] = Array.from({ length: size }, (_, i) => {
    const id = page * size + i + 1;
    return {
      id,
      title: `Artículo #${id}: ${PREFIXES[i % PREFIXES.length]} ${TAGS[id % TAGS.length]}`,
      body: `Este artículo explora los patrones más importantes cuando trabajás con ${TAGS[id % TAGS.length]}. Cubrimos casos reales de uso en producción.`,
      author: AUTHORS[id % AUTHORS.length],
      tag: TAGS[id % TAGS.length],
    };
  });
  return { posts, nextPage: page < 4 ? page + 1 : null };
}

async function fetchPosts({ pageParam }: { pageParam: number }) {
  await new Promise((res) => setTimeout(res, 600));
  return generatePage(pageParam);
}

function PostSkeleton() {
  return (
    <Card>
      <CardHeader
        avatar={<Skeleton variant="circular" width={40} height={40} />}
        title={<Skeleton width="60%" />}
        subheader={<Skeleton width="30%" />}
      />
      <CardContent>
        <Skeleton variant="text" />
        <Skeleton variant="text" width="85%" />
      </CardContent>
    </Card>
  );
}

export default function InfiniteScrollDemo() {
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ['lab3-posts'],
    queryFn: fetchPosts,
    getNextPageParam: (last) => last.nextPage ?? undefined,
    initialPageParam: 0,
  });

  useEffect(() => {
    const el = bottomRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage();
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const posts = data?.pages.flatMap((p) => p.posts) ?? [];

  return (
    <Box>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
        El scroll dispara <code>fetchNextPage()</code> automáticamente vía IntersectionObserver. 5 páginas × 8 artículos = 40 en total.
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {isLoading ? (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
          {[1, 2, 3, 4].map((i) => <PostSkeleton key={i} />)}
        </Box>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
          {posts.map((post) => (
            <Card key={post.id}>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontSize: '0.8rem' }}>
                    {post.author.split(' ').map((n) => n[0]).join('')}
                  </Avatar>
                }
                title={post.title}
                titleTypographyProps={{ variant: 'body2', fontWeight: 'bold' }}
                subheader={post.author}
                subheaderTypographyProps={{ variant: 'caption' }}
                action={<Chip label={post.tag} size="small" variant="outlined" sx={{ mt: 1, mr: 1 }} />}
              />
              <CardContent sx={{ pt: 0 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>{post.body}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <Box ref={bottomRef} sx={{ textAlign: 'center', py: 4 }}>
        {isFetchingNextPage && <CircularProgress size={28} />}
        {!hasNextPage && posts.length > 0 && (
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            — Fin — {posts.length} artículos cargados
          </Typography>
        )}
      </Box>
    </Box>
  );
}
