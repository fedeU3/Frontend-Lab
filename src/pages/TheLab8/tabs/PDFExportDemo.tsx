import { Box, Button, Divider, Grid, TextField, Typography } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Section = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <Box sx={{ mb: 6 }}>
    <Typography variant="h6" sx={{ mb: 0.5 }}>{title}</Typography>
    {subtitle && <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>{subtitle}</Typography>}
    <Divider sx={{ mb: 3 }} />
    {children}
  </Box>
);

interface InvoiceData {
  company: string;
  client: string;
  date: string;
  invoiceNo: string;
  items: { desc: string; qty: number; price: number }[];
  notes: string;
}

const DEFAULT: InvoiceData = {
  company: 'Frontend Lab S.A.',
  client: 'Cliente Ejemplo',
  date: new Date().toLocaleDateString(),
  invoiceNo: 'FAC-0042',
  items: [
    { desc: 'Desarrollo de componentes React', qty: 20, price: 80 },
    { desc: 'Diseño UX/UI', qty: 10, price: 60 },
    { desc: 'Despliegue y configuración CI/CD', qty: 5, price: 100 },
  ],
  notes: 'Pago dentro de 30 días. IVA no incluido.',
};

function InvoicePreview({ data }: { data: InvoiceData }) {
  const total = data.items.reduce((s, i) => s + i.qty * i.price, 0);
  return (
    <Box sx={{
      backgroundColor: '#ffffff', color: '#1a1a1a', p: 4, minWidth: 600,
      fontFamily: 'sans-serif',
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Box>
          <Typography sx={{ fontSize: '1.4rem', fontWeight: 700, color: '#FF7043' }}>FACTURA</Typography>
          <Typography sx={{ fontSize: '0.85rem', color: '#555' }}>N° {data.invoiceNo}</Typography>
          <Typography sx={{ fontSize: '0.85rem', color: '#555' }}>Fecha: {data.date}</Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography sx={{ fontWeight: 700, fontSize: '1rem' }}>{data.company}</Typography>
          <Typography sx={{ fontSize: '0.85rem', color: '#555' }}>contacto@frontendlab.com</Typography>
        </Box>
      </Box>

      <Box sx={{ mb: 3, p: 2, backgroundColor: '#f9f9f9', borderRadius: 1 }}>
        <Typography sx={{ fontSize: '0.8rem', color: '#888', mb: 0.5 }}>FACTURADO A</Typography>
        <Typography sx={{ fontWeight: 600 }}>{data.client}</Typography>
      </Box>

      <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', mb: 3 }}>
        <Box component="thead">
          <Box component="tr" sx={{ borderBottom: '2px solid #FF7043' }}>
            {['Descripción', 'Cant.', 'Precio unit.', 'Total'].map((h) => (
              <Box component="th" key={h} sx={{ textAlign: h === 'Descripción' ? 'left' : 'right', py: 1, fontSize: '0.8rem', color: '#888', fontWeight: 600 }}>{h}</Box>
            ))}
          </Box>
        </Box>
        <Box component="tbody">
          {data.items.map((item, i) => (
            <Box component="tr" key={i} sx={{ borderBottom: '1px solid #eee' }}>
              <Box component="td" sx={{ py: 1, fontSize: '0.875rem' }}>{item.desc}</Box>
              <Box component="td" sx={{ py: 1, fontSize: '0.875rem', textAlign: 'right' }}>{item.qty}</Box>
              <Box component="td" sx={{ py: 1, fontSize: '0.875rem', textAlign: 'right' }}>${item.price}</Box>
              <Box component="td" sx={{ py: 1, fontSize: '0.875rem', textAlign: 'right', fontWeight: 600 }}>${item.qty * item.price}</Box>
            </Box>
          ))}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Box sx={{ textAlign: 'right' }}>
          <Box sx={{ display: 'flex', gap: 4, borderTop: '2px solid #FF7043', pt: 1 }}>
            <Typography sx={{ fontWeight: 700 }}>TOTAL</Typography>
            <Typography sx={{ fontWeight: 700, color: '#FF7043', fontSize: '1.1rem' }}>${total}</Typography>
          </Box>
        </Box>
      </Box>

      {data.notes && (
        <Box sx={{ p: 1.5, backgroundColor: '#fff8f6', border: '1px solid #FFD0C2', borderRadius: 1 }}>
          <Typography sx={{ fontSize: '0.8rem', color: '#555' }}>{data.notes}</Typography>
        </Box>
      )}
    </Box>
  );
}

export default function PDFExportDemo() {
  const [data, setData] = useState<InvoiceData>(DEFAULT);
  const [loading, setLoading] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const update = (field: keyof InvoiceData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setData((d) => ({ ...d, [field]: e.target.value }));

  const downloadPDF = async () => {
    if (!previewRef.current) return;
    setLoading(true);
    try {
      const canvas = await html2canvas(previewRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = (canvas.height * pdfW) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH);
      pdf.save(`${data.invoiceNo}.pdf`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Section
        title="Exportar a PDF"
        subtitle="html2canvas captura el DOM como imagen, jsPDF la embebe en un PDF descargable. No necesita servidor."
      >
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2 }}>Datos de la factura</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <TextField size="small" label="Empresa" value={data.company} onChange={update('company')} />
              <TextField size="small" label="Cliente" value={data.client} onChange={update('client')} />
              <TextField size="small" label="N° Factura" value={data.invoiceNo} onChange={update('invoiceNo')} />
              <TextField size="small" label="Fecha" value={data.date} onChange={update('date')} />
              <TextField size="small" label="Notas" value={data.notes} onChange={update('notes')} multiline rows={2} />
            </Box>
            <Button
              variant="contained"
              onClick={downloadPDF}
              disabled={loading}
              startIcon={<PictureAsPdfIcon />}
              sx={{ mt: 3, width: '100%' }}
            >
              {loading ? 'Generando PDF…' : 'Descargar PDF'}
            </Button>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2, color: 'text.secondary' }}>
              Preview (lo que se exporta)
            </Typography>
            <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'auto' }}>
              <Box ref={previewRef}>
                <InvoicePreview data={data} />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Section>

      <Section title="Patrón html2canvas + jsPDF">
        <Box sx={{ p: 2, backgroundColor: 'background.elevated', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
          <Typography component="pre" variant="caption" sx={{ fontFamily: 'monospace', color: 'text.primary', whiteSpace: 'pre-wrap', m: 0 }}>
{`import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const downloadPDF = async (element: HTMLElement) => {
  const canvas = await html2canvas(element, {
    backgroundColor: '#ffffff',
    scale: 2,              // mayor resolución
    useCORS: true,         // para imágenes externas
  });
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const w = pdf.internal.pageSize.getWidth();
  const h = canvas.height * w / canvas.width;
  pdf.addImage(imgData, 'PNG', 0, 0, w, h);
  pdf.save('documento.pdf');
};`}
          </Typography>
        </Box>
      </Section>
    </Box>
  );
}
