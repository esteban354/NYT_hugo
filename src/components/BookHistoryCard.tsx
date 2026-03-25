import type { BookHistory } from '../types/nyt';

interface BookHistoryCardProps {
  book: BookHistory;
}

export default function BookHistoryCard({ book }: BookHistoryCardProps) {
  const listCount = book.ranks_history?.length ?? 0;

  return (
    <article className="card">
      <div className="card-img card-img-placeholder">
        <span>{book.title?.charAt(0) || '?'}</span>
      </div>
      <div className="card-content">
        <h3 className="card-title">{book.title || 'Sin Titulo'}</h3>
        <div className="card-meta">
          <span>
            <strong>Autor:</strong> {book.author || 'Desconocido'}
          </span>
          <span>
            <strong>Editorial:</strong> {book.publisher || 'N/A'}
          </span>
          {listCount > 0 && (
            <span>
              <strong>Apariciones en listas:</strong> {listCount}
            </span>
          )}
        </div>
        <p className="card-desc">
          {book.description || 'Sin descripcion disponible para este titulo.'}
        </p>
        {book.isbns && book.isbns.length > 0 && (
          <span style={{ fontSize: '0.8rem', color: 'var(--meta-text)' }}>
            ISBN: {book.isbns[0].isbn13 || book.isbns[0].isbn10}
          </span>
        )}
      </div>
    </article>
  );
}
