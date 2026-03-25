import './Pagination.css';

interface PaginationProps {
  currentOffset: number;
  totalResults: number;
  pageSize: number;
  onPageChange: (newOffset: number) => void;
}

export default function Pagination({
  currentOffset,
  totalResults,
  pageSize,
  onPageChange,
}: PaginationProps) {
  const currentPage = Math.floor(currentOffset / pageSize) + 1;
  const totalPages = Math.ceil(totalResults / pageSize);
  const hasPrev = currentOffset > 0;
  const hasNext = currentOffset + pageSize < totalResults;

  const goTo = (offset: number) => {
    onPageChange(offset);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="pagination">
      <button
        className="pagination-btn"
        disabled={!hasPrev}
        onClick={() => goTo(currentOffset - pageSize)}
      >
        Anterior
      </button>
      <span className="pagination-info">
        Pagina <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
        <br />
        {totalResults} resultados
      </span>
      <button
        className="pagination-btn"
        disabled={!hasNext}
        onClick={() => goTo(currentOffset + pageSize)}
      >
        Siguiente
      </button>
    </div>
  );
}
