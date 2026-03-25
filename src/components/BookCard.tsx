import type { Book } from '../types/nyt';
import './BookCard.css';

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  return (
    <article className="card">
      {book.rank != null && <div className="card-rank">#{book.rank}</div>}
      {book.book_image ? (
        <img
          src={book.book_image}
          alt={`Portada de ${book.title}`}
          className="card-img"
          loading="lazy"
        />
      ) : (
        <div className="card-img card-img-placeholder">
          <span>Sin Imagen</span>
        </div>
      )}
      <div className="card-content">
        <div className="card-category">LIBRO</div>
        <h3 className="card-title">{book.title || 'Sin Título'}</h3>
        <div className="card-meta">
          <span>
            <strong>Autor:</strong> {book.author || 'Desconocido'}
          </span>
          <span>
            <strong>Editorial:</strong> {book.publisher || 'N/A'}
          </span>
          {book.weeks_on_list != null && (
            <span>
              <strong>Semanas listado:</strong> {book.weeks_on_list}
            </span>
          )}
        </div>
        <p className="card-desc">
          {book.description || 'Sin descripción disponible para este título.'}
        </p>
        <a
          href={book.amazon_product_url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="card-btn"
        >
          Ver en Amazon
        </a>
      </div>
    </article>
  );
}
