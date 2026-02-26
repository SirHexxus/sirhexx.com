'use strict';

const fs     = require('fs');
const path   = require('path');
const matter = require('gray-matter');

const POSTS_DIR = path.join(process.cwd(), 'posts');

const get_all_posts = () => {
  const files = fs.readdirSync(POSTS_DIR);
  return files
    .filter(f => f.endsWith('.md'))
    .map(filename => {
      const slug      = filename.replace(/\.md$/, '');
      const raw       = fs.readFileSync(path.join(POSTS_DIR, filename), 'utf-8');
      const { data }  = matter(raw);
      return { slug, ...data };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
};

const get_post_by_slug = async (slug) => {
  const { remark }   = await import('remark');
  const remarkHtml   = (await import('remark-html')).default;
  const raw          = fs.readFileSync(path.join(POSTS_DIR, `${slug}.md`), 'utf-8');
  const { data, content } = matter(raw);
  const processed    = await remark().use(remarkHtml).process(content);
  return { slug, frontmatter: data, contentHtml: processed.toString() };
};

module.exports = { get_all_posts, get_post_by_slug };
