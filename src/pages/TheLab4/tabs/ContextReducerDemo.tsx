import {
  Alert, Box, Button, Card, CardContent, CardMedia,
  Chip, Divider, IconButton, Stack, Tooltip, Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { createContext, useContext, useReducer } from 'react';

// ── Types ────────────────────────────────────────────────────────────────────
type Product = { id: number; name: string; price: number; category: string; emoji: string };
type CartItem = Product & { qty: number };
type CartState = { items: CartItem[] };
type CartAction =
  | { type: 'ADD';      product: Product }
  | { type: 'REMOVE';   id: number }
  | { type: 'INCREMENT'; id: number }
  | { type: 'DECREMENT'; id: number }
  | { type: 'CLEAR' };

// ── Reducer ──────────────────────────────────────────────────────────────────
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      const exists = state.items.find((i) => i.id === action.product.id);
      if (exists) return { items: state.items.map((i) => i.id === action.product.id ? { ...i, qty: i.qty + 1 } : i) };
      return { items: [...state.items, { ...action.product, qty: 1 }] };
    }
    case 'REMOVE':    return { items: state.items.filter((i) => i.id !== action.id) };
    case 'INCREMENT': return { items: state.items.map((i) => i.id === action.id ? { ...i, qty: i.qty + 1 } : i) };
    case 'DECREMENT': return { items: state.items.map((i) => i.id === action.id ? { ...i, qty: Math.max(1, i.qty - 1) } : i) };
    case 'CLEAR':     return { items: [] };
    default:          return state;
  }
}

// ── Context ──────────────────────────────────────────────────────────────────
type CartCtx = { state: CartState; dispatch: React.Dispatch<CartAction> };
const CartContext = createContext<CartCtx | null>(null);
const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
};

// ── Data ─────────────────────────────────────────────────────────────────────
const PRODUCTS: Product[] = [
  { id: 1, name: 'Teclado Mecánico',  price: 89.99,  category: 'Periféricos', emoji: '⌨️' },
  { id: 2, name: 'Monitor 27"',       price: 349.00, category: 'Pantallas',   emoji: '🖥️' },
  { id: 3, name: 'Mouse Inalámbrico', price: 45.50,  category: 'Periféricos', emoji: '🖱️' },
  { id: 4, name: 'Webcam 4K',         price: 129.00, category: 'Accesorios',  emoji: '📷' },
  { id: 5, name: 'Hub USB-C',         price: 39.99,  category: 'Accesorios',  emoji: '🔌' },
  { id: 6, name: 'Auriculares BT',    price: 79.00,  category: 'Audio',       emoji: '🎧' },
];

// ── Product card ─────────────────────────────────────────────────────────────
function ProductCard({ product }: { product: Product }) {
  const { state, dispatch } = useCart();
  const inCart = state.items.find((i) => i.id === product.id);

  return (
    <Card>
      <CardMedia sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: 80, backgroundColor: 'background.elevated', fontSize: '2.5rem' }}>
        {product.emoji}
      </CardMedia>
      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Chip label={product.category} size="small" variant="outlined" sx={{ mb: 0.75, fontSize: '0.65rem', height: 18 }} />
        <Typography variant="body2" fontWeight="bold" gutterBottom>{product.name}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="subtitle2" sx={{ color: 'primary.main' }}>${product.price}</Typography>
          <Button size="small" variant={inCart ? 'outlined' : 'contained'}
            startIcon={<AddIcon sx={{ fontSize: '0.9rem !important' }} />}
            onClick={() => dispatch({ type: 'ADD', product })}
            sx={{ minWidth: 0, px: 1, py: 0.25, fontSize: '0.7rem' }}>
            {inCart ? `+1 (${inCart.qty})` : 'Agregar'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

// ── Cart panel ───────────────────────────────────────────────────────────────
function CartPanel() {
  const { state, dispatch } = useCart();
  const total    = state.items.reduce((s, i) => s + i.price * i.qty, 0);
  const count    = state.items.reduce((s, i) => s + i.qty, 0);

  return (
    <Box sx={{ p: 2, backgroundColor: 'background.elevated', borderRadius: 1, border: '1px solid', borderColor: 'divider', position: 'sticky', top: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <ShoppingCartIcon fontSize="small" sx={{ color: 'primary.main' }} />
        <Typography variant="subtitle2">Carrito</Typography>
        {count > 0 && <Chip label={count} size="small" color="primary" sx={{ height: 18, fontSize: '0.65rem', ml: 'auto' }} />}
      </Box>

      {state.items.length === 0 ? (
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>Sin productos</Typography>
      ) : (
        <>
          <Stack spacing={1} sx={{ mb: 2 }}>
            {state.items.map((item) => (
              <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" sx={{ flex: 1 }}>{item.emoji} {item.name}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <IconButton size="small" onClick={() => dispatch({ type: 'DECREMENT', id: item.id })}
                    sx={{ width: 20, height: 20 }}><RemoveIcon sx={{ fontSize: '0.75rem' }} /></IconButton>
                  <Typography variant="caption" sx={{ minWidth: 16, textAlign: 'center' }}>{item.qty}</Typography>
                  <IconButton size="small" onClick={() => dispatch({ type: 'INCREMENT', id: item.id })}
                    sx={{ width: 20, height: 20 }}><AddIcon sx={{ fontSize: '0.75rem' }} /></IconButton>
                </Box>
                <Typography variant="caption" sx={{ fontFamily: 'monospace', minWidth: 52, textAlign: 'right' }}>
                  ${(item.price * item.qty).toFixed(2)}
                </Typography>
                <Tooltip title="Eliminar">
                  <IconButton size="small" onClick={() => dispatch({ type: 'REMOVE', id: item.id })}
                    sx={{ width: 20, height: 20 }}><DeleteIcon sx={{ fontSize: '0.75rem' }} /></IconButton>
                </Tooltip>
              </Box>
            ))}
          </Stack>

          <Divider sx={{ mb: 1.5 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
            <Typography variant="subtitle2">Total</Typography>
            <Typography variant="subtitle2" sx={{ color: 'primary.main', fontFamily: 'monospace' }}>
              ${total.toFixed(2)}
            </Typography>
          </Box>
          <Stack spacing={0.75}>
            <Button variant="contained" size="small" fullWidth
              onClick={() => { alert(`Compra confirmada: $${total.toFixed(2)}`); dispatch({ type: 'CLEAR' }); }}>
              Confirmar compra
            </Button>
            <Button variant="text" size="small" fullWidth sx={{ color: 'text.secondary' }}
              onClick={() => dispatch({ type: 'CLEAR' })}>
              Vaciar
            </Button>
          </Stack>
        </>
      )}
    </Box>
  );
}

// ── Reference ─────────────────────────────────────────────────────────────────
function PatternReference() {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
      {[
        { label: 'Cuándo usar Context + useReducer',
          items: ['Estado compartido entre múltiples componentes no relacionados', 'Lógica de actualización compleja o con múltiples sub-valores', 'Querés evitar prop drilling sin agregar dependencias externas'] },
        { label: 'Cuándo preferir Zustand / Redux',
          items: ['El estado es muy grande o muy frecuentemente actualizado', 'Necesitás persistencia, devtools o middleware avanzado', 'El árbol de componentes es muy profundo y los re-renders importan'] },
      ].map(({ label, items }) => (
        <Box key={label} sx={{ p: 2, backgroundColor: 'background.elevated', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>{label}</Typography>
          <Stack spacing={0.75}>
            {items.map((item) => (
              <Box key={item} sx={{ display: 'flex', gap: 1 }}>
                <Typography variant="caption" sx={{ color: 'primary.main' }}>▸</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>{item}</Typography>
              </Box>
            ))}
          </Stack>
        </Box>
      ))}
    </Box>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function ContextReducerDemo() {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      <Box>
        <Alert severity="info" sx={{ mb: 3 }}>
          <code>CartContext</code> comparte el estado entre <code>ProductCard</code> y <code>CartPanel</code> sin prop drilling. Cualquier componente dentro del Provider puede leer y despachar acciones.
        </Alert>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 300px' }, gap: 3, mb: 6 }}>
          {/* Products */}
          <Box>
            <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mb: 1.5 }}>
              Productos
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5 }}>
              {PRODUCTS.map((p) => <ProductCard key={p.id} product={p} />)}
            </Box>
          </Box>

          {/* Cart */}
          <Box>
            <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mb: 1.5 }}>
              Carrito
            </Typography>
            <CartPanel />
          </Box>
        </Box>

        <Box>
          <Typography variant="h6" sx={{ mb: 0.5 }}>¿Context o Zustand?</Typography>
          <Divider sx={{ mb: 3 }} />
          <PatternReference />
        </Box>
      </Box>
    </CartContext.Provider>
  );
}
