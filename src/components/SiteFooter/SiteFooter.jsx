import styles from './SiteFooterStyle.module.css';

const SiteFooter = () => {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.site_footer}>
      <div className={`container ${styles.site_footer__inner}`}>
        <p className={styles.site_footer__copy}>
          <span className={styles.site_footer__prompt} aria-hidden="true">&gt; </span>
          © {year} James Stacy
        </p>
        <nav aria-label="Footer navigation">
          <ul className={styles.site_footer__links} role="list">
            <li>
              <a
                href="https://github.com/SirHexxus"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href="https://linkedin.com/in/jamesstacy"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
              >
                LinkedIn
              </a>
            </li>
            <li>
              <a
                href="https://hexxusweb.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                hexxusweb.com
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
};

export default SiteFooter;
