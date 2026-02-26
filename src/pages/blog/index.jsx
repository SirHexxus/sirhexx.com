import { useState } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout/Layout';
import PostCard from '../../components/PostCard/PostCard';
import BlogFilter from '../../components/BlogFilter/BlogFilter';
import ScrollReveal from '../../components/ScrollReveal/ScrollReveal';
import { get_all_posts } from '../../lib/posts';
import styles from './BlogIndexStyle.module.css';

const CATEGORIES = [
  { value: 'all',          label: 'All' },
  { value: 'homelab',      label: 'Homelab' },
  { value: 'cybersecurity',label: 'Cybersecurity' },
  { value: 'dev',          label: 'Dev' },
  { value: 'career',       label: 'Career' },
  { value: 'hobbies',      label: 'Hobbies' },
  { value: 'philosophy',   label: 'Philosophy' },
  { value: 'commentary',   label: 'Commentary' },
];

const BlogIndex = ({ posts }) => {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredPosts = activeCategory === 'all'
    ? posts
    : posts.filter(p => p.category === activeCategory);

  return (
    <Layout>
      <Head>
        <title>Blog — SIRHEXXUS</title>
        <meta
          name="description"
          content="Homelab builds, security notes, dev logs, career thoughts, and whatever else is on my mind."
        />
      </Head>

      <div className={styles.blog_index}>
        <div className="container">
          {/* Page header */}
          <header className={styles.blog_index__header}>
            <span className="section__eyebrow section__eyebrow--prompt">The Blog</span>
            <span className="section-divider" aria-hidden="true">// ─────────────</span>
            <h1 className={styles.blog_index__title}>
              All Posts
            </h1>
            <p className={styles.blog_index__sub}>
              Homelabs, security, dev, career, and whatever I can't stop thinking about.
            </p>
          </header>

          {/* Category filter */}
          <BlogFilter
            categories={CATEGORIES}
            activeCategory={activeCategory}
            onFilterChange={setActiveCategory}
          />

          {/* Post grid */}
          <ScrollReveal>
            {filteredPosts.length > 0 ? (
              <div className={styles.blog_index__grid}>
                {filteredPosts.map((post) => (
                  <PostCard key={post.slug} {...post} />
                ))}
              </div>
            ) : (
              <div className={styles.blog_index__empty} role="status">
                <span className={styles.blog_index__empty_icon} aria-hidden="true">_</span>
                <p>No posts in this category yet.</p>
                <p className={styles.blog_index__empty_sub}>Check back soon — content incoming.</p>
              </div>
            )}
          </ScrollReveal>
        </div>
      </div>
    </Layout>
  );
};

export const getStaticProps = () => {
  const posts = get_all_posts();
  return { props: { posts } };
};

export default BlogIndex;
