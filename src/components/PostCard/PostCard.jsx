import Link from 'next/link';
import styles from './PostCardStyle.module.css';

const format_date = (dateStr) => {
  const d = new Date(dateStr);
  const year  = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day   = String(d.getUTCDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};

const PostCard = ({ slug, title, date, category, excerpt, readTime }) => (
  <article className={styles.post_card} data-reveal>
    <Link href={`/blog/${slug}/`} className={styles.post_card__link} tabIndex={-1} aria-hidden="true">
      <span></span>
    </Link>
    <header className={styles.post_card__header}>
      <span className="badge badge--category">{category}</span>
      <time className="post-meta__date" dateTime={date}>{format_date(date)}</time>
    </header>
    <h2 className={styles.post_card__title}>
      <Link href={`/blog/${slug}/`}>{title}</Link>
    </h2>
    <p className={styles.post_card__excerpt}>{excerpt}</p>
    <footer className={styles.post_card__footer}>
      <span className={styles.post_card__read_time}>{readTime} min read</span>
      <Link href={`/blog/${slug}/`} className={styles.post_card__cta} aria-label={`Read ${title}`}>
        Read →
      </Link>
    </footer>
  </article>
);

export default PostCard;
