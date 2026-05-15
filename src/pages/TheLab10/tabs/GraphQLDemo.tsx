import { Box, Button, Chip, CircularProgress, Divider, Paper, Stack, TextField, Typography } from '@mui/material';
import PublicIcon from '@mui/icons-material/Public';
import { useState } from 'react';
import { request, gql } from 'graphql-request';

const Section = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <Box sx={{ mb: 6 }}>
    <Typography variant="h6" sx={{ mb: 0.5 }}>{title}</Typography>
    {subtitle && <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>{subtitle}</Typography>}
    <Divider sx={{ mb: 3 }} />
    {children}
  </Box>
);

const ENDPOINT = 'https://countries.trevorblades.com/';

interface Country { code: string; name: string; capital: string | null; currency: string | null; emoji: string }
interface Continent { code: string; name: string; countries: Country[] }

const COUNTRIES_BY_CONTINENT = gql`
  query CountriesByContinent($code: String!) {
    continent(code: $code) {
      code
      name
      countries {
        code
        name
        capital
        currency
        emoji
      }
    }
  }
`;

const SEARCH_COUNTRIES = gql`
  query SearchCountry($filter: CountryFilterInput) {
    countries(filter: $filter) {
      code
      name
      capital
      currency
      emoji
      continent { name }
    }
  }
`;

interface SearchResult extends Country { continent: { name: string } }

const CONTINENTS = [
  { code: 'EU', label: 'Europa' },
  { code: 'NA', label: 'Norteamérica' },
  { code: 'SA', label: 'Sudamérica' },
  { code: 'AS', label: 'Asia' },
  { code: 'AF', label: 'África' },
  { code: 'OC', label: 'Oceanía' },
];

export default function GraphQLDemo() {
  const [selectedContinent, setSelectedContinent] = useState('EU');
  const [continentData, setContinentData] = useState<Continent | null>(null);
  const [continentLoading, setContinentLoading] = useState(false);
  const [continentError, setContinentError] = useState<string | null>(null);

  const [searchCode, setSearchCode] = useState('AR');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const fetchContinent = async (code: string) => {
    setContinentLoading(true);
    setContinentError(null);
    try {
      const data = await request<{ continent: Continent }>(ENDPOINT, COUNTRIES_BY_CONTINENT, { code });
      setContinentData(data.continent);
    } catch (e) {
      setContinentError((e as Error).message);
      setContinentData(null);
    } finally {
      setContinentLoading(false);
    }
  };

  const searchCountry = async () => {
    if (!searchCode.trim()) return;
    setSearchLoading(true);
    setSearchError(null);
    try {
      const data = await request<{ countries: SearchResult[] }>(ENDPOINT, SEARCH_COUNTRIES, {
        filter: { code: { eq: searchCode.trim().toUpperCase() } },
      });
      setSearchResults(data.countries);
    } catch (e) {
      setSearchError((e as Error).message);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <Box>
      <Section
        title="Query con variables — países por continente"
        subtitle="graphql-request envía un POST con { query, variables } al endpoint. Sin cliente pesado — ideal para casos sin caché compleja."
      >
        <Box sx={{ mb: 2, p: 2, backgroundColor: 'background.elevated', borderRadius: 1, border: '1px solid', borderColor: 'divider', maxWidth: 560 }}>
          <Typography component="pre" variant="caption" sx={{ fontFamily: 'monospace', color: 'text.primary', whiteSpace: 'pre-wrap', m: 0 }}>
{`import { request, gql } from 'graphql-request';

const QUERY = gql\`
  query CountriesByContinent($code: String!) {
    continent(code: $code) {
      name
      countries { code name emoji capital }
    }
  }
\`;

const data = await request(ENDPOINT, QUERY, { code: 'EU' });`}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          {CONTINENTS.map(({ code, label }) => (
            <Chip
              key={code}
              label={label}
              clickable
              color={selectedContinent === code ? 'primary' : 'default'}
              onClick={() => setSelectedContinent(code)}
            />
          ))}
        </Box>
        <Button
          variant="contained"
          onClick={() => fetchContinent(selectedContinent)}
          disabled={continentLoading}
          startIcon={continentLoading ? <CircularProgress size={16} /> : <PublicIcon />}
          sx={{ mb: 2 }}
        >
          {continentLoading ? 'Cargando…' : 'Consultar continente'}
        </Button>

        {continentError && (
          <Paper variant="outlined" sx={{ p: 2, mb: 2, borderColor: 'error.main', backgroundColor: 'background.elevated' }}>
            <Typography variant="caption" sx={{ color: 'error.main' }}>{continentError}</Typography>
          </Paper>
        )}

        {continentData && (
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {continentData.name} — {continentData.countries.length} países
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, maxHeight: 260, overflowY: 'auto' }}>
              {continentData.countries.map((c) => (
                <Chip
                  key={c.code}
                  label={`${c.emoji} ${c.name}`}
                  size="small"
                  variant="outlined"
                  title={`Capital: ${c.capital ?? 'N/A'} · Moneda: ${c.currency ?? 'N/A'}`}
                />
              ))}
            </Box>
          </Box>
        )}
      </Section>

      <Section
        title="Query con filter — buscar país por código"
        subtitle="La API soporta CountryFilterInput con operadores eq, in, regex. Ejemplo: buscar un país por su código ISO."
      >
        <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            size="small"
            label="Código ISO (ej: AR, DE, JP)"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value.slice(0, 2))}
            onKeyDown={(e) => e.key === 'Enter' && searchCountry()}
            sx={{ width: 220 }}
            inputProps={{ maxLength: 2, style: { textTransform: 'uppercase', fontFamily: 'monospace' } }}
          />
          <Button variant="outlined" onClick={searchCountry} disabled={searchLoading}>
            {searchLoading ? <CircularProgress size={18} /> : 'Buscar'}
          </Button>
        </Box>

        {searchError && (
          <Typography variant="caption" sx={{ color: 'error.main', display: 'block', mb: 1 }}>{searchError}</Typography>
        )}

        <Stack spacing={1} sx={{ maxWidth: 480 }}>
          {searchResults.length === 0 && !searchLoading && !searchError && (
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Ingresá un código ISO de 2 letras y presioná Buscar.
            </Typography>
          )}
          {searchResults.map((c) => (
            <Paper key={c.code} variant="outlined" sx={{ p: 2, backgroundColor: 'background.elevated' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                <Typography sx={{ fontSize: 28 }}>{c.emoji}</Typography>
                <Box>
                  <Typography variant="subtitle2">{c.name}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>{c.continent.name}</Typography>
                </Box>
                <Chip label={c.code} size="small" sx={{ ml: 'auto', fontFamily: 'monospace' }} />
              </Box>
              <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Capital: <Typography component="span" variant="caption" sx={{ color: 'text.primary' }}>{c.capital ?? 'N/A'}</Typography>
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Moneda: <Typography component="span" variant="caption" sx={{ color: 'text.primary' }}>{c.currency ?? 'N/A'}</Typography>
                </Typography>
              </Box>
            </Paper>
          ))}
        </Stack>
      </Section>

      <Section title="graphql-request vs Apollo Client">
        <Stack spacing={1}>
          {[
            { lib: 'graphql-request', bundle: '~7KB', cache: 'No', devtools: 'No', uso: 'Queries simples, SSR, scripts' },
            { lib: 'Apollo Client', bundle: '~32KB', cache: 'InMemoryCache', devtools: 'Apollo DevTools', uso: 'Apps grandes con caché compleja' },
            { lib: '@tanstack/react-query + fetch', bundle: '~13KB', cache: 'React Query', devtools: 'RQ DevTools', uso: 'Caché estándar + mutaciones' },
          ].map((row) => (
            <Paper key={row.lib} variant="outlined" sx={{ p: 1.5, backgroundColor: 'background.elevated' }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'primary.main', minWidth: 200 }}>{row.lib}</Typography>
                <Chip label={`Bundle: ${row.bundle}`} size="small" variant="outlined" sx={{ fontSize: '0.65rem' }} />
                <Chip label={`Cache: ${row.cache}`} size="small" variant="outlined" sx={{ fontSize: '0.65rem' }} />
                <Typography variant="caption" sx={{ color: 'text.secondary', flex: 1 }}>{row.uso}</Typography>
              </Box>
            </Paper>
          ))}
        </Stack>
      </Section>
    </Box>
  );
}
