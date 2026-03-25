import type {
  BooksListResponse,
  BookSubSection,
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
  console.log('🔍 URL construida:', url);
  console.log('🔑 API Key (masked):', API_KEY ? '***' + API_KEY.slice(-4) : 'MISSING');

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
  console.log('[NYT API] URL final (Bestsellers):', url);
  return fetchAPI<BooksListResponse>(url);
}

/**
 * Verifica si la API Key está configurada
 */
export function isApiKeyConfigured(): boolean {
  return !!API_KEY;
}
