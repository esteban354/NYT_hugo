import type {
  BooksListResponse,
  BookSubSection,
  HistoryPaginatedResponse,
} from '../types/nyt';

// ═══ CONFIGURACIÓN ═══
const API_KEY = import.meta.env.VITE_NYT_API_KEY as string;
const BASE_URL = import.meta.env.DEV
  ? '/api/nyt'
  : 'https://api.nytimes.com/svc/books/v3';


// ═══ CACHÉ LOCALSTORAGE ═══
// Extra: caché persistente con localStorage
function getCache<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(`nyt_cache_${key}`);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
}

function setCache(key: string, data: unknown) {
  try {
    localStorage.setItem(`nyt_cache_${key}`, JSON.stringify(data));
  } catch (e) {
    console.warn('No se pudo guardar en localStorage (¿Límite excedido?)', e);
  }
}

// ═══ LLAMADAS A LA API ═══
async function fetchAPI<T>(url: string): Promise<T> {
    console.log('🔍 URL construida:', url);        // ← agrega esto
  console.log('🔑 API Key:', API_KEY);            // ← y esto


  const cachedData = getCache<T>(url);
  if (cachedData) {
    console.log('Servido desde localStorage:', url);
    return cachedData;
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 401)
        throw new Error('API Key inválida o no configurada.');
      if (response.status === 429)
        throw new Error('Límite de peticiones alcanzado. Intenta en unos minutos.');
      throw new Error(`Error en la petición: HTTP ${response.status}`);
    }

    const data: T = await response.json();
    setCache(url, data); // Guardar en caché antes de retornar
    return data;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Error de conexión. Verifica tu internet o la URL.');
    }
    throw error;
  }
}

// ═══ 1. Best sellers actuales ═══
export async function fetchCurrentBestsellers(
  subsection: BookSubSection = 'trade-fiction-paperback'
): Promise<BooksListResponse> {
  const url = `${BASE_URL}/lists/current/${subsection}.json?api-key=${API_KEY}`;
  return fetchAPI<BooksListResponse>(url);
}
// ═══ 2. Best sellers history (búsqueda + paginación) ═══
export interface HistorySearchParams {
  title?: string;
  author?: string;
  offset?: number;
}

export interface HistorySearchResult {
  data: HistoryPaginatedResponse;
  merged?: boolean; // true when results came from two merged requests
}

function buildHistoryUrl(params: Record<string, string>): string {
  const parts = [`api-key=${encodeURIComponent(API_KEY)}`];
  for (const [key, val] of Object.entries(params)) {
    if (val) parts.push(`${key}=${encodeURIComponent(val)}`);
  }
  const url = `${BASE_URL}/lists/best-sellers/history.json?${parts.join('&')}`;
  console.log('[NYT Search] URL final:', url);
  return url;
}

export async function fetchBestsellersHistory(
  params: HistorySearchParams = {}
): Promise<HistorySearchResult> {
  const hasTitle = !!params.title?.trim();
  const hasAuthor = !!params.author?.trim();

  // Caso: ambos campos — dos requests en paralelo + merge
  if (hasTitle && hasAuthor) {
    const [byTitle, byAuthor] = await Promise.all([
      fetchAPI<HistoryPaginatedResponse>(
        buildHistoryUrl({ title: params.title!.trim() })
      ),
      fetchAPI<HistoryPaginatedResponse>(
        buildHistoryUrl({ author: params.author!.trim() })
      ),
    ]);

    // Deduplicar por primer ISBN-13, o por título+autor como fallback
    const seen = new Set<string>();
    const merged: HistoryPaginatedResponse['results'] = [];

    for (const book of [...byTitle.results, ...byAuthor.results]) {
      const isbn = book.isbns?.[0]?.isbn13 || '';
      const key = isbn || `${book.title}||${book.author}`;
      if (!seen.has(key)) {
        seen.add(key);
        merged.push(book);
      }
    }

    return {
      data: { num_results: merged.length, results: merged },
      merged: true,
    };
  }

  // Caso: un solo campo o ninguno (soporta paginación normal)
  const urlParams: Record<string, string> = {};
  if (hasTitle) urlParams.title = params.title!.trim();
  if (hasAuthor) urlParams.author = params.author!.trim();
  if (params.offset != null && params.offset > 0)
    urlParams.offset = String(params.offset);

  const data = await fetchAPI<HistoryPaginatedResponse>(
    buildHistoryUrl(urlParams)
  );
  return { data };
}


/**
 * Verifica si la API Key está configurada
 */
export function isApiKeyConfigured(): boolean {
  return !!API_KEY;
}
