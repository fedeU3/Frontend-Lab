import { Box, Button, ButtonGroup, Chip, Divider, Typography } from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import StrikethroughSIcon from '@mui/icons-material/StrikethroughS';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { useState } from 'react';

const Section = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <Box sx={{ mb: 6 }}>
    <Typography variant="h6" sx={{ mb: 0.5 }}>{title}</Typography>
    {subtitle && <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>{subtitle}</Typography>}
    <Divider sx={{ mb: 3 }} />
    {children}
  </Box>
);

const INITIAL_CONTENT = `<h2>Editor de texto rico con Tiptap</h2><p>Seleccioná texto y usá la barra de herramientas para aplicar formato. Podés escribir <strong>negrita</strong>, <em>cursiva</em>, y <s>tachado</s>.</p><ul><li>Elemento de lista</li><li>Otro elemento</li></ul><p>Probá agregar un <a href="https://tiptap.dev">link</a> o una lista numerada.</p>`;

function Toolbar({ editor }: { editor: ReturnType<typeof useEditor> }) {
  if (!editor) return null;

  const setLink = () => {
    const url = window.prompt('URL del link:', 'https://');
    if (!url) return;
    editor.chain().focus().setLink({ href: url }).run();
  };

  const btnSx = (active: boolean) => ({
    minWidth: 36, p: 0.5,
    backgroundColor: active ? 'rgba(255,112,67,0.15)' : 'transparent',
    color: active ? 'primary.main' : 'text.secondary',
    border: '1px solid',
    borderColor: active ? 'primary.main' : 'divider',
    '&:hover': { backgroundColor: 'rgba(255,112,67,0.1)' },
  });

  return (
    <Box sx={{ display: 'flex', gap: 0.5, p: 1, borderBottom: '1px solid', borderColor: 'divider', flexWrap: 'wrap' }}>
      <ButtonGroup size="small" variant="outlined">
        <Button sx={btnSx(editor.isActive('bold'))} onClick={() => editor.chain().focus().toggleBold().run()}>
          <FormatBoldIcon fontSize="small" />
        </Button>
        <Button sx={btnSx(editor.isActive('italic'))} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <FormatItalicIcon fontSize="small" />
        </Button>
        <Button sx={btnSx(editor.isActive('strike'))} onClick={() => editor.chain().focus().toggleStrike().run()}>
          <StrikethroughSIcon fontSize="small" />
        </Button>
      </ButtonGroup>

      <ButtonGroup size="small" variant="outlined">
        <Button sx={btnSx(editor.isActive('bulletList'))} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <FormatListBulletedIcon fontSize="small" />
        </Button>
        <Button sx={btnSx(editor.isActive('orderedList'))} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <FormatListNumberedIcon fontSize="small" />
        </Button>
      </ButtonGroup>

      <ButtonGroup size="small" variant="outlined">
        <Button sx={btnSx(editor.isActive('link'))} onClick={setLink}>
          <LinkIcon fontSize="small" />
        </Button>
        <Button sx={btnSx(false)} onClick={() => editor.chain().focus().unsetLink().run()} disabled={!editor.isActive('link')}>
          <LinkOffIcon fontSize="small" />
        </Button>
      </ButtonGroup>

      <ButtonGroup size="small" variant="outlined">
        <Button sx={btnSx(false)} onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
          <UndoIcon fontSize="small" />
        </Button>
        <Button sx={btnSx(false)} onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
          <RedoIcon fontSize="small" />
        </Button>
      </ButtonGroup>
    </Box>
  );
}

export default function TiptapDemo() {
  const [showJson, setShowJson] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
    ],
    content: INITIAL_CONTENT,
  });

  const editorStyles = {
    '& .ProseMirror': {
      outline: 'none',
      minHeight: 200,
      p: 2,
      color: 'text.primary',
      '& h1,& h2,& h3': { color: 'text.primary', my: 1 },
      '& h2': { fontSize: '1.3rem', fontWeight: 700 },
      '& p': { my: 0.5, lineHeight: 1.7, color: 'text.secondary' },
      '& strong': { color: 'text.primary' },
      '& ul,& ol': { pl: 2.5, color: 'text.secondary' },
      '& li': { mb: 0.25 },
      '& a': { color: 'primary.main', textDecoration: 'underline' },
      '& s': { color: 'text.secondary' },
    },
  };

  return (
    <Box>
      <Section
        title="Editor Tiptap"
        subtitle="ProseMirror bajo el capó. Extensible con plugins. Usa useEditor() de @tiptap/react para integración con React."
      >
        <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'hidden', maxWidth: 720 }}>
          <Toolbar editor={editor} />
          <Box sx={{ backgroundColor: 'background.elevated', ...editorStyles }}>
            <EditorContent editor={editor} />
          </Box>
        </Box>

        <Box sx={{ mt: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
          <Chip
            label={showJson ? 'Mostrar editor' : 'Ver JSON del documento'}
            size="small"
            clickable
            onClick={() => setShowJson((s) => !s)}
            color={showJson ? 'primary' : 'default'}
          />
          {editor && (
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {editor.storage?.characterCount?.characters?.() ?? '?'} caracteres
            </Typography>
          )}
        </Box>

        {showJson && editor && (
          <Box sx={{ mt: 2, p: 2, backgroundColor: 'background.elevated', borderRadius: 1, border: '1px solid', borderColor: 'divider', maxWidth: 720, maxHeight: 300, overflowY: 'auto' }}>
            <Typography component="pre" variant="caption" sx={{ fontFamily: 'monospace', color: 'text.primary', whiteSpace: 'pre-wrap', m: 0 }}>
              {JSON.stringify(editor.getJSON(), null, 2)}
            </Typography>
          </Box>
        )}
      </Section>

      <Section title="Uso básico">
        <Box sx={{ p: 2, backgroundColor: 'background.elevated', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
          <Typography component="pre" variant="caption" sx={{ fontFamily: 'monospace', color: 'text.primary', whiteSpace: 'pre-wrap', m: 0 }}>
{`import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';

const editor = useEditor({
  extensions: [StarterKit, Link.configure({ openOnClick: false })],
  content: '<p>Hola <strong>mundo</strong>!</p>',
});

// Comandos encadenados:
editor.chain().focus().toggleBold().run();
editor.chain().focus().setLink({ href: 'https://...' }).run();
editor.isActive('bold');   // true/false para el estado de la toolbar
editor.getJSON();          // Documento como JSON serializable
editor.getHTML();          // Documento como HTML`}
          </Typography>
        </Box>
      </Section>
    </Box>
  );
}
