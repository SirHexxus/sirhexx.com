import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout/Layout';
import FocusCard from '../components/FocusCard/FocusCard';
import PostCard from '../components/PostCard/PostCard';
import ScrollReveal from '../components/ScrollReveal/ScrollReveal';
import styles from './IndexStyle.module.css';

const FOCUS_ITEMS = [
  {
    label:       'Infrastructure',
    title:       'Homelab Phase 1 — IaC Foundation',
    description: 'Proxmox cluster + Terraform + Ansible. Building reproducible infra from scratch. Documenting everything.',
    status:      'Active',
    statusVariant: 'active',
  },
  {
    label:       'Certification',
    title:       'CompTIA Security+',
    description: 'Studying for SY0-701. Professor Messer + practice labs. Targeting Q2 2026.',
    status:      'In progress',
    statusVariant: 'active',
  },
  {
    label:       'Certification',
    title:       'Google Cybersecurity Certificate',
    description: 'Coursera professional certificate. Hands-on with SIEM tools, Python automation, and incident response.',
    status:      'In progress',
    statusVariant: 'active',
  },
  {
    label:       'Career Target',
    title:       'SOC Analyst — June 2026',
    description: "Everything I'm building is aimed here. Certs + homelab + blue team knowledge = the foundation I need.",
    status:      'Target',
    statusVariant: 'pending',
  },
];

const INTERESTS = [
  { icon: '⚔',  label: 'D&D / TTRPGs',   sub: 'Perpetual GM. Occasional player.' },
  { icon: '🤖', label: 'BattleTech',       sub: 'Tabletop & lore obsessive.' },
  { icon: '🛡',  label: 'SCA',             sub: 'Society for Creative Anachronism.' },
  { icon: '🎮', label: 'Video Games',      sub: 'Strategy, RPGs, and whatever else.' },
  { icon: '📖', label: 'Philosophy',       sub: 'Epistemology & ethics.' },
  { icon: '📚', label: 'Literature',       sub: 'Fiction & nonfiction, anything interesting.' },
];

const RECENT_POSTS = [
  {
    slug:     'homelab-phase-1-iac-foundation',
    title:    'Building My Homelab from Code: IaC with Terraform and Ansible',
    date:     '2026-02-25',
    category: 'homelab',
    excerpt:  'How I went from manually clicking through Proxmox menus to provisioning VMs with a single command — and why infrastructure-as-code changed the way I think about my home network.',
    readTime: 8,
  },
];

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>SIRHEXXUS — Builder. Breaker. Thinker.</title>
        <meta
          name="description"
          content="James Stacy — IT professional, homelab builder, security student. I write about homelabs, cybersecurity, dev, and whatever else has my attention."
        />
      </Head>

      {/* ── Hero ─────────────────────────────── */}
      <section className={styles.hero} aria-label="Introduction">
        <div className={styles.hero__crt_vignette} aria-hidden="true"></div>
        <div className={`container ${styles.hero__content}`}>
          <p className={`section__eyebrow section__eyebrow--prompt ${styles.hero__eyebrow}`}>
            builder / breaker / thinker
          </p>
          <h1 className={styles.hero__heading}>
            I build homelabs,{' '}
            <span className={styles.hero__heading_accent}>break things on purpose,</span>{' '}
            and write about all of it.
          </h1>
          <p className={styles.hero__sub}>
            IT career. Security cert grind. Homelab as a learning machine. Creating TTRPG
            worlds with which to torment my players.
          </p>
          <div className={styles.hero__actions}>
            <Link href="/#focus" className="btn btn--primary" onClick={() => window.umami?.track('hero-cta-click', { label: 'what-im-building' })}>
              What I'm Building
            </Link>
            <Link href="/blog/" className="btn btn--outline" onClick={() => window.umami?.track('hero-cta-click', { label: 'read-the-blog' })}>
              Read the Blog
            </Link>
          </div>
        </div>
        <div className={styles.hero__scroll_hint} aria-hidden="true">
          <span className={styles.hero__scroll_arrow}></span>
        </div>
      </section>

      {/* ── Current Focus ────────────────────── */}
      <section id="focus" className={`section section--alt ${styles.focus_section}`}>
        <div className="container">
          <header className="section__header">
            <span className="section__eyebrow section__eyebrow--prompt">Current Focus</span>
            <span className="section-divider" aria-hidden="true">// ─────────────</span>
            <h2 className="section__title">What I'm Working On</h2>
          </header>
          <ScrollReveal>
            <div className={styles.focus_grid}>
              {FOCUS_ITEMS.map((item) => (
                <FocusCard key={item.title} {...item} />
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── About ────────────────────────────── */}
      <section id="about" className="section">
        <div className="container">
          <header className="section__header">
            <span className={`section__eyebrow section__eyebrow--prompt ${styles.about__eyebrow}`}>
              About
            </span>
            <span className="section-divider" aria-hidden="true">// ─────────────</span>
            <h2 className="section__title text-amber">Who's behind this terminal</h2>
          </header>
          <ScrollReveal>
            <div className={styles.about_grid}>
              {/* Bio */}
              <div className={styles.about_bio}>
                <p>
                  I'm James — IT professional with a background in calibration and weighing
                  instruments. Spent years keeping precision measurement equipment honest.
                </p>
                <p>
                  These days I'm moving into cybersecurity: building out a Proxmox
                  homelab managed entirely with Terraform and Ansible, grinding through Security+
                  and Google's Cybersecurity certificate, and aiming for a SOC Analyst role by
                  June 2026.
                </p>
                <p>
                  I have ADHD, which means I hyper-focus when something captures my interest —
                  and right now, it's security. The same brain that spent three hours optimizing
                  a shell script or theorycrafting BattleTech unit compositions is now pointed at log
                  analysis and threat modeling.
                </p>
                <p>
                  For professional services (web design, dev), head to{' '}
                  <a href="https://hexxusweb.com?utm_source=sirhexx&utm_medium=internal&utm_campaign=blog-referral" target="_blank" rel="noopener noreferrer" onClick={() => window.umami?.track('outbound-link-click', { destination: 'hexxusweb.com' })}>
                    hexxusweb.com
                  </a>
                  . This site is the whole person.
                </p>

                {/* Skills */}
                <div className={styles.about_skills}>
                  <p className={styles.about_skills__label}>Currently working with:</p>
                  <div className={styles.about_skills__list}>
                    {[
                      'Proxmox', 'Terraform', 'Ansible', 'Linux',
                      'Bash', 'Python', 'React', 'Next.js',
                      'Git', 'Docker', 'SIEM', 'Wireshark',
                    ].map((skill) => (
                      <span key={skill} className="badge badge--skill">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Interests + Certs */}
              <div className={styles.about_sidebar}>
                <div className={styles.about_interests}>
                  <h3 className={styles.about_interests__title}>
                    <span aria-hidden="true" className="text-amber">// </span>
                    Interests
                  </h3>
                  <ul className={styles.about_interests__list} role="list">
                    {INTERESTS.map(({ icon, label, sub }) => (
                      <li key={label} className={styles.about_interests__item}>
                        <span className={styles.about_interests__icon} aria-hidden="true">{icon}</span>
                        <div>
                          <span className={styles.about_interests__label}>{label}</span>
                          <span className={styles.about_interests__sub}>{sub}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={styles.about_certs}>
                  <h3 className={styles.about_certs__title}>
                    <span aria-hidden="true" className="text-amber">// </span>
                    Certifications
                  </h3>
                  <ul className={styles.about_certs__list} role="list">
                    <li className={styles.about_certs__item}>
                      <span className="badge badge--amber">In Progress</span>
                      <span>CompTIA Security+ (SY0-701)</span>
                    </li>
                    <li className={styles.about_certs__item}>
                      <span className="badge badge--amber">In Progress</span>
                      <span>Google Cybersecurity Certificate</span>
                    </li>
                    <li className={styles.about_certs__item}>
                      <span className="badge badge--skill">Target</span>
                      <span>SOC Analyst role — June 2026</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Recent Posts ─────────────────────── */}
      <section className="section section--alt">
        <div className="container">
          <header className="section__header">
            <span className="section__eyebrow section__eyebrow--prompt">Recent Posts</span>
            <span className="section-divider" aria-hidden="true">// ─────────────</span>
            <h2 className="section__title">From the blog</h2>
          </header>
          <ScrollReveal>
            <div className={styles.recent_posts_grid}>
              {RECENT_POSTS.map((post) => (
                <PostCard key={post.slug} {...post} />
              ))}
            </div>
          </ScrollReveal>
          <div className={styles.recent_posts_cta}>
            <Link href="/blog/" className="btn btn--outline" onClick={() => window.umami?.track('homepage-cta-click', { label: 'all-posts' })}>
              All posts →
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
