import { Box, Chip, Divider, Stack, Tab, Tabs, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useState } from 'react';

const INITIAL_MD = `# Markdown con react-markdown

## Texto

Podés escribir **negrita**, *cursiva*, ~~tachado~~ y \`código inline\`.

## Listas

- Elemento 1
- Elemento 2
  - Sub-elemento
  - Sub-elemento

1. Primero
2. Segundo
3. Tercero

## Código

\`\`\`typescript
const greet = (name: string) => \`Hola, \${name}!\`;
console.log(greet('Mundo'));
\`\`\`

## Tabla (GFM)

| Librería        | Tamaño | Nota              |
|-----------------|--------|-------------------|
| react-markdown  | ~12 kB | Con remark-gfm    |
| marked          | ~14 kB | Sin React wrapper |
| @uiw/react-md-editor | ~60 kB | Editor completo |

## Links y blockquotes

> **Tip:** \`remark-gfm\` agrega soporte para tablas, listas de tarea, y sintaxis extendida de GitHub.

[Ver documentación](https://github.com/remarkjs/react-markdown)

## Lista de tareas (GFM)

- [x] Instalar react-markdown
- [x] Agregar remark-gfm
- [ ] Implementar resaltado de sintaxis
- [ ] Agregar soporte para math
`;

const SNIPPETS = [
  {
    label: 'Básico',
    code: `import ReactMarkdown from 'react-markdown';

<ReactMarkdown>{markdown}</ReactMarkdown>`,
  },
  {
    label: 'Con GFM',
    code: `import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

<ReactMarkdown remarkPlugins={[remarkGfm]}>
  {markdown}
</ReactMarkdown>`,
  },
  {
    label: 'Custom components',
    code: `<ReactMarkdown
  remarkPlugins={[remarkGfm]}
  components={{
    h1: ({ children }) => (
      <Typography variant="h4">{children}</Typography>
    ),
    code: ({ children }) => (
      <Box component="code" sx={{ fontFamily: 'monospace',
        backgroundColor: 'background.elevated', px: 0.5 }}>
        {children}
      </Box>
    ),
  }}
>
  {markdown}
</ReactMarkdown>`,
  },
];

const mdStyles = {
  '& h1,& h2,& h3,& h4': { color: 'text.primary', mt: 2, mb: 1 },
  '& h1': { fontSize: '1.5rem', fontWeight: 700 },
  '& h2': { fontSize: '1.15rem', fontWeight: 600, borderBottom: '1px solid', borderColor: 'divider', pb: 0.5 },
  '& h3': { fontSize: '1rem', fontWeight: 600 },
  '& p':  { color: 'text.secondary', lineHeight: 1.7, fontSize: '0.875rem', my: 1 },
  '& ul,& ol': { pl: 2.5, color: 'text.secondary', fontSize: '0.875rem' },
  '& li': { mb: 0.25 },
  '& code': { fontFamily: 'monospace', fontSize: '0.8rem', backgroundColor: 'background.elevated',
    px: 0.75, py: 0.25, borderRadius: 0.5, color: 'primary.main' },
  '& pre': { backgroundColor: 'background.elevated', p: 2, borderRadius: 1,
    border: '1px solid', borderColor: 'divider', overflow: 'auto',
    '& code': { backgroundColor: 'transparent', px: 0, color: 'text.primary' } },
  '& table': { width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' },
  '& th': { borderBottom: '2px solid', borderColor: 'divider', pb: 0.5, textAlign: 'left',
    color: 'text.primary', fontWeight: 600, px: 1 },
  '& td': { borderBottom: '1px solid', borderColor: 'divider', py: 0.5, px: 1, color: 'text.secondary' },
  '& blockquote': { borderLeft: '3px solid', borderColor: 'primary.main', pl: 2, ml: 0,
    color: 'text.secondary', fontStyle: 'italic', my: 1.5 },
  '& a': { color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } },
  '& input[type="checkbox"]': { accentColor: '#FF7043', mr: 0.5 },
};

export default function MarkdownDemo() {
  const [markdown, setMarkdown] = useState(INITIAL_MD);
  const [view, setView]         = useState<'split' | 'preview'>('split');
  const [snippetTab, setSnippetTab] = useState(0);

  return (
    <Box>
      {/* Editor / Preview */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="h6">Editor en vivo</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {(['split', 'preview'] as const).map((v) => (
              <Chip key={v} label={v === 'split' ? 'Split' : 'Preview'} size="small" clickable
                variant={view === v ? 'filled' : 'outlined'}
                color={view === v ? 'primary' : 'default'}
                onClick={() => setView(v)} />
            ))}
          </Box>
        </Box>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
          Editá el Markdown a la izquierda y mirá el resultado renderizado en tiempo real.
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Box sx={{ display: 'grid', gridTemplateColumns: view === 'split' ? '1fr 1fr' : '1fr', gap: 2 }}>
          {/* Raw editor */}
          {view === 'split' && (
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
                Markdown
              </Typography>
              <Box
                component="textarea"
                value={markdown}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMarkdown(e.target.value)}
                spellCheck={false}
                sx={{
                  width: '100%', height: 420, resize: 'vertical',
                  fontFamily: 'monospace', fontSize: '0.8rem', lineHeight: 1.6,
                  backgroundColor: 'background.elevated', color: 'text.primary',
                  border: '1px solid', borderColor: 'divider', borderRadius: 1,
                  p: 1.5, outline: 'none', boxSizing: 'border-box',
                  '&:focus': { borderColor: 'primary.main' },
                }}
              />
            </Box>
          )}

          {/* Preview */}
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
              Preview
            </Typography>
            <Box sx={{ height: 420, overflowY: 'auto', border: '1px solid', borderColor: 'divider',
              borderRadius: 1, backgroundColor: 'background.elevated', p: 2, ...mdStyles }}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Code snippets */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h6" sx={{ mb: 0.5 }}>Uso</Typography>
        <Divider sx={{ mb: 3 }} />
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 0 }}>
          <Tabs value={snippetTab} onChange={(_, v) => setSnippetTab(v)}>
            {SNIPPETS.map(({ label }) => (
              <Tab key={label} label={label} sx={{ fontSize: '0.78rem', minHeight: 40 }} />
            ))}
          </Tabs>
        </Box>
        <Box sx={{ backgroundColor: 'background.elevated', border: '1px solid', borderTop: 0,
          borderColor: 'divider', borderRadius: '0 0 4px 4px', p: 2 }}>
          <Typography component="pre" variant="caption"
            sx={{ fontFamily: 'monospace', color: 'text.primary', whiteSpace: 'pre-wrap', m: 0 }}>
            {SNIPPETS[snippetTab].code}
          </Typography>
        </Box>
      </Box>

      {/* Plugins */}
      <Box>
        <Typography variant="h6" sx={{ mb: 0.5 }}>Plugins remark</Typography>
        <Divider sx={{ mb: 3 }} />
        <Stack spacing={1.5}>
          {[
            { label: 'remark-gfm',         desc: 'GitHub Flavored Markdown: tablas, listas de tarea, tachado, autolinks.' },
            { label: 'remark-math',         desc: 'Sintaxis $LaTeX$ para ecuaciones matemáticas inline y en bloque.' },
            { label: 'rehype-highlight',    desc: 'Resaltado de sintaxis en bloques de código usando highlight.js.' },
            { label: 'rehype-sanitize',     desc: 'Sanitización de HTML embebido — importante si el contenido viene del usuario.' },
            { label: 'remark-emoji',        desc: 'Convierte :shortcodes: de emoji a su carácter Unicode.' },
          ].map(({ label, desc }) => (
            <Box key={label} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <Chip label={label} size="small" variant="outlined"
                sx={{ fontFamily: 'monospace', fontSize: '0.68rem', flexShrink: 0 }} />
              <Typography variant="caption" sx={{ color: 'text.secondary', alignSelf: 'center' }}>{desc}</Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
