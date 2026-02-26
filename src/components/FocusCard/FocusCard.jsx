import styles from './FocusCardStyle.module.css';

const FocusCard = ({ label, title, description, status, statusVariant = 'active' }) => (
  <article className={styles.focus_card} data-reveal>
    <div className={styles.focus_card__header}>
      <span className={styles.focus_card__label}>{label}</span>
      <span className={`${styles.focus_card__status} ${styles[`focus_card__status--${statusVariant}`]}`}>
        <span className={styles.focus_card__dot} aria-hidden="true"></span>
        {status}
      </span>
    </div>
    <h3 className={styles.focus_card__title}>{title}</h3>
    <p className={styles.focus_card__desc}>{description}</p>
  </article>
);

export default FocusCard;
