import { useState } from 'react';
import BookHistoryCard from '../BookHistoryCard';
import Loader from '../Loader';
import ErrorMessage from '../ErrorMessage';
import ContentGrid from '../ContentGrid';
import Pagination from '../Pagination';
import ExportButton from '../ExportButton';
import { fetchBestsellersHistory } from '../../services/api';
import type { BookHistory } from '../../types/nyt';
import '../views/views.css';

const PAGE_SIZE = 20;

export default function HistorySearchView() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [books, setBooks] = useState<BookHistory[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [isMerged, setIsMerged] = useState(false);

  async function doSearch(newOffset: number) {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchBestsellersHistory({
        title: title.trim() || undefined,
        author: author.trim() || undefined,
        offset: newOffset,
      });
      setBooks(result.data.results || []);
      setTotalResults(result.data.num_results ?? 0);
      setOffset(newOffset);
      setSearched(true);
      setIsMerged(!!result.merged);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setOffset(0);
    doSearch(0);
  }

  function handlePageChange(newOffset: number) {
    doSearch(newOffset);
  }

  return (
    <div className="view-container">
      <h2 className="section-title">Buscar en Best Sellers</h2>

      <form className="search-form multi-field" onSubmit={handleSubmit}>
        <input
          type="text"
          className="search-input"
          placeholder="Titulo..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          className="search-input"
          placeholder="Autor..."
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <button type="submit" className="search-btn">
          Buscar
        </button>
      </form>

      {loading && <Loader />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && searched && books.length === 0 && (
        <p style={{ color: 'var(--meta-text)', marginTop: '1.5rem' }}>
          No se encontraron resultados. Intenta con otros terminos.
        </p>
      )}

      {!loading && !error && books.length > 0 && (
        <>
          {isMerged && (
            <p style={{
              color: 'var(--meta-text)',
              fontSize: '0.85rem',
              marginBottom: '1rem',
              borderLeft: '3px solid var(--border-color)',
              paddingLeft: '0.75rem',
            }}>
              Resultados combinados de busqueda por titulo y autor (duplicados eliminados).
            </p>
          )}
          <ExportButton data={books} filename="historial_bestsellers" />
          <ContentGrid
            title={`${totalResults} resultado${totalResults !== 1 ? 's' : ''} encontrado${totalResults !== 1 ? 's' : ''}`}
          >
            {books.map((book, i) => (
              <BookHistoryCard key={`${book.title}-${i}`} book={book} />
            ))}
          </ContentGrid>
          {!isMerged && totalResults > PAGE_SIZE && (
            <Pagination
              currentOffset={offset}
              totalResults={totalResults}
              pageSize={PAGE_SIZE}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
}
