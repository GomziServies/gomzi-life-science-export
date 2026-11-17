import { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Filter,
  Search,
  Sparkles,
  Tag,
  User,
  X,
} from 'lucide-react';
import { BLOG_CATEGORIES, getStoredBlogs, type BlogPost } from '../data/blogData';
import Certifications from '../sections/Certifications';
import './BlogPage.css';

const ALL = 'All Articles';

function ArticleCard({ blog, featured = false }: { blog: BlogPost; featured?: boolean }) {
  return (
    <article className={`bh-card${featured ? ' bh-card--featured' : ''}`}>
      <Link to={`/blog/${blog.slug}`} className="bh-card-image-link" tabIndex={-1} aria-hidden="true">
        <div className="bh-card-image-wrap">
          <img
            src={blog.coverImage}
            alt=""
            loading={featured ? 'eager' : 'lazy'}
            className="bh-card-image"
          />
          <span className="bh-card-category">{blog.category}</span>
        </div>
      </Link>

      <div className="bh-card-body">
        {featured && (
          <span className="bh-featured-badge">
            <Sparkles size={12} /> Featured article
          </span>
        )}
        <div className="bh-card-meta">
          <span><Calendar size={13} /> {blog.date}</span>
          <span><Clock size={13} /> {blog.readTime}</span>
        </div>

        <h2 className="bh-card-title">
          <Link to={`/blog/${blog.slug}`}>{blog.title}</Link>
        </h2>

        <p className="bh-card-excerpt">{blog.excerpt}</p>

        <div className="bh-card-footer">
          <div className="bh-card-author">
            <span className="bh-author-name">{blog.author.name}</span>
            <span className="bh-author-role">{blog.author.role}</span>
          </div>

          <Link to={`/blog/${blog.slug}`} className="bh-read-link" aria-label={`Read ${blog.title}`}>
            <span>Read article</span>
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function BlogPage({ onInquiry }: { onInquiry: () => void }) {
  const { slug } = useParams<{ slug?: string }>();
  const [blogs] = useState<BlogPost[]>(() => getStoredBlogs());
  const [selectedCategory, setSelectedCategory] = useState<string>(ALL);
  const [searchQuery, setSearchQuery] = useState('');

  // If a slug is present in URL, find the active post
  const activePost = useMemo(() => {
    if (!slug) return null;
    return blogs.find((b) => b.slug === slug) || null;
  }, [slug, blogs]);

  const filteredBlogs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return blogs.filter((blog) => {
      const matchesCategory = selectedCategory === ALL || blog.category === selectedCategory;
      const matchesSearch =
        !q ||
        blog.title.toLowerCase().includes(q) ||
        blog.excerpt.toLowerCase().includes(q) ||
        blog.category.toLowerCase().includes(q) ||
        blog.tags.some((tag) => tag.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [blogs, selectedCategory, searchQuery]);

  const resetFilters = () => {
    setSelectedCategory(ALL);
    setSearchQuery('');
  };

  // Single article view
  if (activePost) {
    const relatedPosts = blogs
      .filter((b) => b.slug !== activePost.slug)
      .slice(0, 3);

    return (
      <main id="main-content" className="blog-reader-page">
        <section className="br-hero">
          <div className="container br-hero-inner">
            <nav className="br-breadcrumb" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <ChevronRight size={13} aria-hidden="true" />
              <Link to="/blog">Knowledge Hub</Link>
              <ChevronRight size={13} aria-hidden="true" />
              <span>{activePost.category}</span>
            </nav>

            <span className="br-category-pill">{activePost.category}</span>
            <h1 className="br-title">{activePost.title}</h1>

            <div className="br-meta">
              <div className="br-author-info">
                <div className="br-avatar">
                  <User size={16} />
                </div>
                <div>
                  <strong>{activePost.author.name}</strong>
                  <span>{activePost.author.role}</span>
                </div>
              </div>

              <div className="br-timing">
                <span><Calendar size={14} /> {activePost.date}</span>
                <span><Clock size={14} /> {activePost.readTime}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="br-body section">
          <div className="container br-grid">
            <article className="br-content">
              <div className="br-cover-wrap">
                <img src={activePost.coverImage} alt={activePost.title} className="br-cover" />
              </div>

              <p className="br-lead">{activePost.excerpt}</p>

              {activePost.keyTakeaways && activePost.keyTakeaways.length > 0 && (
                <div className="br-takeaways">
                  <div className="br-takeaways-title">
                    <Sparkles size={18} />
                    <h3>Key Insights &amp; Technical Takeaways</h3>
                  </div>
                  <ul>
                    {activePost.keyTakeaways.map((item, idx) => (
                      <li key={idx}>
                        <CheckCircle2 size={16} className="br-check" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="br-paragraphs">
                {activePost.content.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>

              <div className="br-tags">
                <Tag size={16} className="br-tag-icon" />
                {activePost.tags.map((tag) => (
                  <span className="br-tag-pill" key={tag}>
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="br-footer-nav">
                <Link to="/blog" className="button button--secondary">
                  <ArrowLeft size={16} /> Back to all articles
                </Link>
                <button type="button" className="button button--lime" onClick={onInquiry}>
                  Discuss this formulation <ArrowUpRight size={17} />
                </button>
              </div>
            </article>

            <aside className="br-sidebar">
              <div className="br-sidebar-card">
                <h3>About Gomzi Manufacturing</h3>
                <p>Gomzi Life Science LLP is a certified CDMO partner in Surat, India specializing in custom formulations, whey protein, gummies, effervescents, sachets, and export documentation across 45+ countries.</p>
                <button type="button" className="button button--lime" onClick={onInquiry}>
                  Start an Inquiry <ArrowUpRight size={16} />
                </button>
              </div>

              <div className="br-related-card">
                <h4>More from the Knowledge Hub</h4>
                <div className="br-related-list">
                  {relatedPosts.map((rel) => (
                    <Link to={`/blog/${rel.slug}`} key={rel.id} className="br-related-item">
                      <span className="br-related-cat">{rel.category}</span>
                      <strong>{rel.title}</strong>
                      <span className="br-related-time">{rel.readTime}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </section>

        <Certifications />
      </main>
    );
  }

  // Listing view: the newest article is featured when nothing is filtered
  const isFiltered = selectedCategory !== ALL || searchQuery.trim() !== '';
  const showFeatured = !isFiltered && filteredBlogs.length > 1;
  const [featured, ...rest] = filteredBlogs;
  const gridPosts = showFeatured ? rest : filteredBlogs;

  return (
    <main id="main-content" className="blog-hub-page">
      <section className="bh-hero" aria-labelledby="bh-title">
        <div className="container bh-hero-inner">
          <nav className="bh-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <ChevronRight size={13} aria-hidden="true" />
            <span aria-current="page">Knowledge Hub &amp; Insights</span>
          </nav>

          <span className="bh-kicker">
            <span className="bh-dot" />
            SCIENCE · FORMULATION · EXPORT STRATEGY
          </span>
          <h1 id="bh-title">
            Nutraceutical insights.<br />
            <em>Manufactured for your world.</em>
          </h1>
          <p className="bh-hero-tagline">Expert articles on whey protein engineering, pectin gummies, effervescent technology, sachet packaging, and international regulatory compliance from India’s leading CDMO.</p>

          <div className="bh-hero-toolbar">
            <div className="bh-search-box">
              <Search size={18} className="bh-search-icon" />
              <input
                type="search"
                placeholder="Search articles by topic, format, ingredient (e.g. whey, gummies, stability)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search blog articles"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="bh-search-clear"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  <X size={15} />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bh-categories-bar">
        <div className="container bh-cat-scroll">
          <span className="bh-filter-label">
            <Filter size={14} /> Categories:
          </span>
          {BLOG_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              aria-pressed={selectedCategory === cat}
              className={`bh-cat-pill ${selectedCategory === cat ? 'is-active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <section className="bh-articles section">
        <div className="container">
          <div className="bh-grid-header">
            <p className="bh-count-info" aria-live="polite">
              Showing <strong>{filteredBlogs.length}</strong> {filteredBlogs.length === 1 ? 'article' : 'articles'}
              {selectedCategory !== ALL && ` in "${selectedCategory}"`}
              {searchQuery.trim() && ` matching "${searchQuery.trim()}"`}
            </p>

            {isFiltered && (
              <button type="button" className="bh-reset-filter" onClick={resetFilters}>
                Reset filters
              </button>
            )}
          </div>

          {filteredBlogs.length === 0 ? (
            <div className="bh-empty-state">
              <BookOpen size={48} className="bh-empty-icon" />
              <h3>No articles found</h3>
              <p>We couldn’t find any articles matching your search query. Try different keywords or reset category filters.</p>
              <button type="button" className="button button--secondary" onClick={resetFilters}>
                View all articles
              </button>
            </div>
          ) : (
            <>
              {showFeatured && featured && <ArticleCard blog={featured} featured />}
              {gridPosts.length > 0 && (
                <div className="bh-grid">
                  {gridPosts.map((blog) => (
                    <ArticleCard blog={blog} key={blog.id} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Certifications />
    </main>
  );
}
