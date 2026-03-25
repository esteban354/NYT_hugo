import { useState, useEffect } from 'react';
import BookCard from '../BookCard';
import Loader from '../Loader';
import ErrorMessage from '../ErrorMessage';
import ContentGrid from '../ContentGrid';
import Pagination from '../Pagination';
import ExportButton from '../ExportButton';
import { fetchCurrentBestsellers } from '../../services/api';
import type { Book } from '../../types/nyt';
import '../views/views.css';

// Configuración de paginación cliente
const ITEMS_PER_PAGE = 5;

export default function HistorySearchView() {
  const [titleQuery, setTitleQuery] = useState('');
  const [authorQuery, setAuthorQuery] = useState('');
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Carga inicial de datos (todos los mejores vendidos actuales)
  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true);
        setError(null);
        // Usamos una lista general para tener un pool de datos
        const response = await fetchCurrentBestsellers('trade-fiction-paperback');
        setAllBooks(response.results.books || []);
        setFilteredBooks(response.results.books || []);
      } catch (err) {
        console.error('Error al cargar libros:', err);
        setError('No se pudieron obtener los datos de la API. Verifica tu conexión o API Key.');
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, []);

  // Lógica de búsqueda y filtrado CLIENTE
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    setLoading(true);
    
    // Simular un pequeño delay de búsqueda para feedback visual
    setTimeout(() => {
      const results = allBooks.filter(book => {
        const matchesTitle = book.title.toLowerCase().includes(titleQuery.toLowerCase().trim());
        const matchesAuthor = book.author.toLowerCase().includes(authorQuery.toLowerCase().trim());
        return matchesTitle && matchesAuthor;
      });

      setFilteredBooks(results);
      setCurrentPage(1); // Resetear a la primera página al buscar
      setLoading(false);
    }, 300);
  };

  // Lógica de paginación CLIENTE (usando .slice)
  const totalResults = filteredBooks.length;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedBooks = filteredBooks.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (newOffset: number) => {
    // El componente Pagination espera un offset (index), lo convertimos a número de página
    const newPage = Math.floor(newOffset / ITEMS_PER_PAGE) + 1;
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="view-container">
      <h2 className="section-title">Buscador NYT (Explorador de Libros)</h2>

      {/* Formulario de búsqueda funcional */}
      <form className="search-form multi-field" onSubmit={handleSearch}>
        <input
          type="text"
          className="search-input"
          placeholder="Buscar por título..."
          value={titleQuery}
          onChange={(e) => setTitleQuery(e.target.value)}
        />
        <input
          type="text"
          className="search-input"
          placeholder="Buscar por autor..."
          value={authorQuery}
          onChange={(e) => setAuthorQuery(e.target.value)}
        />
        <button type="submit" className="search-btn">
          Buscar
        </button>
      </form>

      {loading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <>
          <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-muted">
              Mostrando {paginatedBooks.length} de {totalResults} resultados
            </span>
            <ExportButton data={filteredBooks} filename="busqueda_nyt" />
          </div>

          {filteredBooks.length > 0 ? (
            <ContentGrid title={titleQuery || authorQuery ? `Resultados para su búsqueda` : "Libros Destacados"}>
              {paginatedBooks.map((book) => (
                <BookCard key={book.title} book={book} />
              ))}
            </ContentGrid>
          ) : (
            <div className="error-msg">
              No se encontraron libros que coincidan con "{titleQuery || authorQuery}". 
              Intenta con otros términos o deja los campos vacíos para ver todo.
            </div>
          )}

          {/* Componente de paginación integrado */}
          {totalResults > ITEMS_PER_PAGE && (
            <Pagination
              currentOffset={startIndex}
              totalResults={totalResults}
              pageSize={ITEMS_PER_PAGE}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
}
