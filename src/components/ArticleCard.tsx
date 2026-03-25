import type { Article } from '../types/nyt';
import { formatDate } from '../utils/formatDate';
import './ArticleCard.css';

interface ArticleCardProps {
  article: Article;
  imageUrl: string | null;
}

export default function ArticleCard({ article, imageUrl }: ArticleCardProps) {
  const byline = article.byline
    ? article.byline.replace(/^By /i, '')
    : 'Redacción NYT';

  return (
    <article className="card">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Imagen del artículo"
          className="card-img"
          loading="lazy"
        />
      ) : (
        <div className="card-img card-img-placeholder">
          <span>Sin Imagen</span>
        </div>
      )}
      <div className="card-content">
        <div className="card-category">{article.section || 'Noticias'}</div>
        <h3 className="card-title">{article.title || 'Titular de NYT'}</h3>
        <div className="card-meta">
          <span>
            <strong>Autor:</strong> {byline}
          </span>
          <span>
            <strong>Fecha:</strong> {formatDate(article.published_date)}
          </span>
        </div>
        <p className="card-desc">
          {article.abstract || 'Resumen no disponible para este artículo.'}
        </p>
        <a
          href={article.url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="card-btn"
        >
          Leer artículo
        </a>
      </div>
    </article>
  );
}
