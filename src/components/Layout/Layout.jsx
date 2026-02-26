import SiteHeader from '../SiteHeader/SiteHeader';
import SiteFooter from '../SiteFooter/SiteFooter';
import styles from './LayoutStyle.module.css';

const Layout = ({ children }) => (
  <div className={styles.layout}>
    <a href="#main-content" className="skip-link">Skip to content</a>
    <SiteHeader />
    <main id="main-content" className={styles.layout__main}>
      {children}
    </main>
    <SiteFooter />
  </div>
);

export default Layout;
