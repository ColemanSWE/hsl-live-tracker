import styles from './Pagination.module.scss';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (size: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
  onItemsPerPageChange,
}: PaginationProps) {
  const getVisiblePages = (current: number, total: number) => {
    const visiblePages = 3;
    let start = Math.max(1, current - 1);
    const end = Math.min(total, start + visiblePages - 1);

    if (end - start < visiblePages - 1) {
      start = Math.max(1, end - visiblePages + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visiblePages = getVisiblePages(currentPage, totalPages);

  // Calculate showing range
  const startItem = Math.min((currentPage - 1) * itemsPerPage + 1, totalItems);
  const endItem = Math.min(startItem + itemsPerPage - 1, totalItems);

  return (
    <div className={styles.paginationContainer}>
      <div className={styles.paginationInfo}>
        Showing {totalItems === 0 ? 0 : startItem}-{endItem} of {totalItems}
      </div>

      <div className={styles.paginationControls}>
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={styles.paginationButton}
        >
          Previous
        </button>

        {visiblePages[0] > 1 && (
          <button onClick={() => onPageChange(1)} className={styles.pageNumber}>
            1
          </button>
        )}

        {visiblePages[0] > 2 && <span className={styles.paginationEllipsis}>...</span>}

        {visiblePages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`${styles.pageNumber} ${currentPage === page ? styles.activePage : ''}`}
          >
            {page}
          </button>
        ))}

        {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
          <span className={styles.paginationEllipsis}>...</span>
        )}

        {visiblePages[visiblePages.length - 1] < totalPages && (
          <button onClick={() => onPageChange(totalPages)} className={styles.pageNumber}>
            {totalPages}
          </button>
        )}

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={styles.paginationButton}
        >
          Next
        </button>
      </div>

      <select
        value={itemsPerPage}
        onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
        className={styles.pageSizeSelect}
      >
        {[10, 20, 50].map((size) => (
          <option key={size} value={size}>
            Show {size}
          </option>
        ))}
      </select>
    </div>
  );
}
