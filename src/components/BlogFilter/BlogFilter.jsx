import styles from './BlogFilterStyle.module.css';

const BlogFilter = ({ categories, activeCategory, onFilterChange }) => (
  <div className={styles.blog_filter} role="group" aria-label="Filter posts by category">
    {categories.map((cat) => (
      <button
        key={cat.value}
        className={`badge badge--category ${activeCategory === cat.value ? 'is-active' : ''}`}
        aria-pressed={activeCategory === cat.value}
        onClick={() => onFilterChange(cat.value)}
      >
        {cat.label}
      </button>
    ))}
  </div>
);

export default BlogFilter;
