import { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout/Layout';
import { get_all_posts, get_post_by_slug } from '../../lib/posts';
import styles from './BlogPostStyle.module.css';

const format_date = (dateStr) => {
  const d = new Date(dateStr);
  const year  = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day   = String(d.getUTCDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};

const BlogPost = ({ slug, frontmatter, contentHtml }) => {
  const { title, date, category, readTime } = frontmatter;

  useEffect(() => {
    const reached = new Set();
    const THRESHOLDS = [50, 90];

    const handle_scroll = () => {
      const scrolled = window.scrollY + window.innerHeight;
      const total = document.documentElement.scrollHeight;
      const pct = Math.round((scrolled / total) * 100);

      for (const threshold of THRESHOLDS) {
        if (pct >= threshold && !reached.has(threshold)) {
          reached.add(threshold);
          window.umami?.track('post-scroll-depth', { slug, depth: `${threshold}%` });
        }
      }
    };

    window.addEventListener('scroll', handle_scroll, { passive: true });
    return () => window.removeEventListener('scroll', handle_scroll);
  }, [slug]);

  return (
    <Layout>
      <Head>
        <title>{title} — SIRHEXXUS</title>
        <meta name="description" content={frontmatter.excerpt ?? ''} />
      </Head>

      <article className={styles.blog_post}>
        <div className={`container container--narrow ${styles.blog_post__inner}`}>

          {/* Back link */}
          <Link href="/blog/" className={styles.blog_post__back}>
            ← Back to Blog
          </Link>

          {/* Post header */}
          <header className={styles.blog_post__header}>
            <div className={styles.blog_post__meta}>
              <span className="badge badge--category">{category}</span>
              <time className="post-meta__date" dateTime={date}>
                {format_date(date)}
              </time>
              <span className={styles.blog_post__read_time}>{readTime} min read</span>
            </div>
            <h1 className={styles.blog_post__title}>{title}</h1>
          </header>

          {/* Post body */}
          <div
            className="post-body"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />

          {/* Post footer */}
          <footer className={styles.blog_post__footer}>
            <Link href="/blog/" className={styles.blog_post__back}>
              ← Back to Blog
            </Link>
          </footer>
        </div>
      </article>
    </Layout>
  );
};

export const getStaticPaths = () => {
  const posts = get_all_posts();
  return {
    paths: posts.map((p) => ({ params: { slug: p.slug } })),
    fallback: false,
  };
};

export const getStaticProps = async ({ params }) => {
  const post = await get_post_by_slug(params.slug);
  return { props: post };
};

export default BlogPost;
