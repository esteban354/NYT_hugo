import { useState, useEffect } from 'react';
import BookCard from '../BookCard';
import Loader from '../Loader';
import ErrorMessage from '../ErrorMessage';
import ContentGrid from '../ContentGrid';
import ExportButton from '../ExportButton';
import { fetchCurrentBestsellers } from '../../services/api';
import type { Book } from '../../types/nyt';

export default function CurrentListView() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await fetchCurrentBestsellers();
        setBooks(data.results.books || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;
  
  return (
    <ContentGrid title="Best Sellers Actuales (Trade Fiction Paperback)">
      <ExportButton data={books} filename="bestsellers_actuales" />
      {books.length > 0 ? (
        books.map((book, i) => <BookCard key={`${book.title}-${i}`} book={book} />)
      ) : (
        <p>No hay libros disponibles.</p>
      )}
    </ContentGrid>
  );
}
