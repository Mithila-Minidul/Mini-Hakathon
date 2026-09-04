// src/components/books/BookFilters.jsx
// Search bar + category + availability filters for the books page

const BookFilters = ({
  searchInput,
  onSearchChange,
  onSearchClear,
  category,
  categories,
  onCategoryChange,
  available,
  onAvailableChange,
  total,
  loading,
}) => (
  <>
    <div className="bk-toolbar">
      {/* Search */}
      <div className="bk-search">
        <span className="bk-search__icon">🔍</span>
        <input
          type="search"
          value={searchInput}
          onChange={onSearchChange}
          placeholder="Search by title or author…"
          aria-label="Search books"
        />
        {searchInput && (
          <button className="bk-search__clear" onClick={onSearchClear} aria-label="Clear search">
            ×
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bk-filter-group">
        <select
          className="bk-select"
          value={category}
          onChange={onCategoryChange}
          aria-label="Filter by category"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          className="bk-select"
          value={available}
          onChange={onAvailableChange}
          aria-label="Filter by availability"
        >
          <option value="">All Availability</option>
          <option value="true">In Stock</option>
          <option value="false">Out of Stock</option>
        </select>
      </div>

      {/* Stats */}
      {!loading && (
        <span className="bk-toolbar__stats">
          {total} {total === 1 ? 'book' : 'books'} found
        </span>
      )}
    </div>

    {/* Active filter chips */}
    {(category || available !== '') && (
      <div className="bk-chips">
        {category && (
          <span className="bk-chip">
            📂 {category}
            <button
              onClick={() => onCategoryChange({ target: { value: '' } })}
              aria-label="Remove category filter"
            >
              ×
            </button>
          </span>
        )}
        {available === 'true' && (
          <span className="bk-chip">
            ✅ In Stock
            <button
              onClick={() => onAvailableChange({ target: { value: '' } })}
              aria-label="Remove availability filter"
            >
              ×
            </button>
          </span>
        )}
        {available === 'false' && (
          <span className="bk-chip">
            ❌ Out of Stock
            <button
              onClick={() => onAvailableChange({ target: { value: '' } })}
              aria-label="Remove availability filter"
            >
              ×
            </button>
          </span>
        )}
      </div>
    )}
  </>
);

export default BookFilters;
