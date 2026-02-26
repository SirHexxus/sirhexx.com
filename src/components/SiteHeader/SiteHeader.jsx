import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from './SiteHeaderStyle.module.css';

const NAV_LINKS = [
  { label: 'Blog',    href: '/blog/' },
  { label: 'About',   href: '/#about' },
];

const SiteHeader = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const is_active = (href) => {
    if (href.startsWith('/#')) return false;
    return router.pathname === href || router.pathname.startsWith(href);
  };

  const close_menu = () => setMenuOpen(false);
  const handle_toggle = () => setMenuOpen(prev => !prev);

  useEffect(() => {
    const handle_scroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handle_scroll, { passive: true });
    handle_scroll();
    return () => window.removeEventListener('scroll', handle_scroll);
  }, []);

  useEffect(() => {
    const handle_key = (event) => {
      if (event.key === 'Escape' && menuOpen) {
        close_menu();
      }
    };
    document.addEventListener('keydown', handle_key);
    return () => document.removeEventListener('keydown', handle_key);
  }, [menuOpen]);

  // Close menu on route change
  useEffect(() => {
    close_menu();
  }, [router.pathname]);

  return (
    <header
      className={`${styles.site_header} ${scrolled ? styles['site_header--scrolled'] : ''}`}
      data-nav-header
    >
      <div className={`container ${styles.site_header__inner}`}>
        {/* Logo */}
        <Link href="/" className={styles.site_header__logo}>
          <span className={styles.site_header__logo_name}>SIRHEXXUS</span>
          <span className={styles.site_header__logo_sub}>personal site</span>
        </Link>

        {/* Desktop nav */}
        <nav className={styles.site_nav} aria-label="Primary navigation">
          <ul className={styles.site_nav__list} role="list">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`${styles.site_nav__link} ${is_active(href) ? styles['site_nav__link--active'] : ''}`}
                >
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href="https://hexxusweb.com"
                className={`${styles.site_nav__link} ${styles['site_nav__link--hire']}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Hire Me
              </a>
            </li>
          </ul>
        </nav>

        {/* Hamburger button */}
        <button
          className={styles.site_header__toggle}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={handle_toggle}
        >
          <span className={`${styles.hamburger} ${menuOpen ? styles['hamburger--open'] : ''}`} aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`${styles.mobile_menu} ${menuOpen ? styles['mobile_menu--open'] : ''}`}
        aria-hidden={!menuOpen}
      >
        <nav aria-label="Mobile navigation">
          <ul className={styles.mobile_menu__list} role="list">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`${styles.mobile_menu__link} ${is_active(href) ? styles['mobile_menu__link--active'] : ''}`}
                  onClick={close_menu}
                >
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href="https://hexxusweb.com"
                className={`${styles.mobile_menu__link} ${styles['mobile_menu__link--hire']}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={close_menu}
              >
                Hire Me
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default SiteHeader;
