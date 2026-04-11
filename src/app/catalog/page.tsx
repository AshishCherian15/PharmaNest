import Link from 'next/link';
import { Suspense } from 'react';
import { LandingHeader } from '@/components/landing/header';
import { LandingFooter } from '@/components/landing/footer';
import { ProductCard } from '@/components/landing/product-card';
import { getAllProducts } from '@/lib/product-store';

const ITEMS_PER_PAGE = 12;

const allCategories = [
  { label: 'All Products',    value: 'all',           icon: '🏪' },
  { label: 'Medicines',       value: 'Painkiller',    icon: '💊' },
  { label: 'Antibiotics',     value: 'Antibiotic',    icon: '🧬' },
  { label: 'Vitamins',        value: 'Vitamins',      icon: '💪' },
  { label: 'Personal Care',   value: 'Personal Care', icon: '🧴' },
  { label: 'Baby Care',       value: 'Baby Care',     icon: '🍼' },
  { label: 'Medical Devices', value: 'Medical Devices', icon: '🩺' },
  { label: 'Gastrointestinal',value: 'Gastrointestinal', icon: '🫁' },
  { label: 'Respiratory',     value: 'Respiratory',   icon: '🌬️' },
  { label: 'Cardiovascular',  value: 'Cardiovascular',icon: '❤️' },
  { label: 'Diabetes',        value: 'Diabetes',      icon: '🩸' },
  { label: 'Antihistamine',   value: 'Antihistamine', icon: '🌸' },
  { label: 'Health Foods',    value: 'Health Foods',  icon: '🥗' },
];

const sortOptions = [
  { label: 'Popularity',        value: 'popular'   },
  { label: 'Price: Low → High', value: 'price_asc' },
  { label: 'Price: High → Low', value: 'price_desc'},
  { label: 'Newest',            value: 'newest'    },
];

type SearchParams = Record<string, string | string[] | undefined>;

export default async function CatalogPage({ searchParams }: { searchParams?: Promise<SearchParams> }) {
  const params   = (await searchParams) ?? {};
  const category = typeof params.category === 'string' ? params.category : 'all';
  const sort     = typeof params.sort     === 'string' ? params.sort     : 'popular';
  const query    = (typeof params.q === 'string' ? params.q : '').trim().toLowerCase();
  const inStockOnly = typeof params.inStock === 'string' && params.inStock === '1';
  const rxOnly      = typeof params.rx === 'string' && params.rx === '1';
  const page     = Math.max(1, parseInt(typeof params.page === 'string' ? params.page : '1', 10));

  /* ── combine + deduplicate ── */
  const uniqueProducts = getAllProducts();

  /* ── filter ── */
  let filtered = uniqueProducts.filter((p) => {
    if (category !== 'all' && p.category !== category) return false;
    if (inStockOnly && p.quantity <= 0) return false;
    if (rxOnly && !p.requiresPrescription) return false;
    if (!query) return true;
    return [p.name, p.genericName, p.category, p.description].join(' ').toLowerCase().includes(query);
  });

  /* ── sort ── */
  if (sort === 'price_asc')  filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sort === 'price_desc') filtered = [...filtered].sort((a, b) => b.price - a.price);
  if (sort === 'newest')     filtered = [...filtered].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));

  const totalPages      = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const currentPage     = Math.min(page, totalPages);
  const paginatedProducts = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  /* ── URL builder ── */
  const buildUrl = (overrides: Record<string, string>) => {
    const p = new URLSearchParams();
    if (category !== 'all')   p.set('category', category);
    if (sort !== 'popular')   p.set('sort', sort);
    if (query)                p.set('q', query);
    if (inStockOnly)          p.set('inStock', '1');
    if (rxOnly)               p.set('rx', '1');
    p.set('page', String(currentPage));
    Object.entries(overrides).forEach(([k, v]) => {
      if (!v || v === 'all' || v === 'popular') p.delete(k);
      else p.set(k, v);
    });
    const qs = p.toString();
    return qs ? `/catalog?${qs}` : '/catalog';
  };

  const activeCategory = allCategories.find((c) => c.value === category) ?? allCategories[0];

  /* ── pagination page numbers ── */
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
    .reduce<(number | '…')[]>((acc, p, idx, arr) => {
      if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('…');
      acc.push(p);
      return acc;
    }, []);

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Suspense fallback={<div className="h-[88px] bg-white border-b border-outline-variant/20" />}>
        <LandingHeader />
      </Suspense>

      <main className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row">

          {/* ══ SIDEBAR ══ */}
          <aside className="w-full flex-shrink-0 md:w-64">
            <div className="sticky top-24 space-y-5">
              <div className="rounded-2xl bg-surface-container-low p-5 space-y-6">

                {/* Back to home */}
                <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-on-surface-variant hover:text-stitch-primary transition">
                  ← Back to Home
                </Link>

                {/* Categories */}
                <div>
                  <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-outline">Categories</h3>
                  <div className="space-y-0.5">
                    {allCategories.map((cat) => (
                      <Link
                        key={cat.value}
                        href={buildUrl({ category: cat.value, page: '1' })}
                        className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition active:scale-95 ${
                          category === cat.value
                            ? 'bg-stitch-primary-fixed/30 font-bold text-stitch-primary'
                            : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                        }`}
                      >
                        <span className="text-base">{cat.icon}</span>
                        <span>{cat.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div className="border-t border-outline-variant/20 pt-4">
                  <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-outline">Availability</h3>
                  <div className="space-y-2 text-sm">
                    <Link
                      href={buildUrl({ inStock: inStockOnly ? '' : '1', page: '1' })}
                      className={`chip w-full justify-start ${inStockOnly ? 'chip-active' : ''}`}
                    >
                      <span>{inStockOnly ? '✓' : '○'}</span>
                      <span>In Stock Only</span>
                    </Link>
                    <Link
                      href={buildUrl({ rx: rxOnly ? '' : '1', page: '1' })}
                      className={`chip w-full justify-start ${rxOnly ? 'chip-active' : ''}`}
                    >
                      <span>{rxOnly ? '✓' : '○'}</span>
                      <span>Prescription Required</span>
                    </Link>
                  </div>
                </div>

                {/* Promo card */}
                <div className="relative overflow-hidden rounded-xl bg-stitch-primary p-5">
                  <div className="relative z-10">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-stitch-primary-fixed/70">Promotion</p>
                    <p className="mt-1 font-bold leading-tight text-white">20% OFF on Vitamins</p>
                    <Link
                      href={buildUrl({ category: 'Vitamins', page: '1' })}
                      className="mt-3 inline-block rounded-full bg-white px-4 py-1.5 text-xs font-bold text-stitch-primary transition hover:bg-stitch-primary-fixed"
                    >
                      Shop Now
                    </Link>
                  </div>
                  <span className="pointer-events-none absolute -bottom-4 -right-4 text-[80px] opacity-10 select-none">💊</span>
                </div>
              </div>
            </div>
          </aside>

          {/* ══ MAIN CONTENT ══ */}
          <section className="min-w-0 flex-grow">

            {/* Breadcrumb + header */}
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <nav className="mb-2 flex items-center gap-1.5 text-sm text-on-surface-variant">
                  <Link href="/" className="hover:text-stitch-primary transition">Home</Link>
                  <span className="text-outline">›</span>
                  <Link href="/catalog" className="hover:text-stitch-primary transition">Catalog</Link>
                  {category !== 'all' && (
                    <>
                      <span className="text-outline">›</span>
                      <span className="font-semibold text-on-surface">{activeCategory.label}</span>
                    </>
                  )}
                </nav>
                <h1 className="font-headline text-3xl font-extrabold text-stitch-primary">
                  {query ? `Results for "${query}"` : activeCategory.label}
                </h1>
                <p className="mt-1 text-sm text-outline">
                  Showing {paginatedProducts.length} of {filtered.length} products
                  {totalPages > 1 && ` · Page ${currentPage} of ${totalPages}`}
                </p>
              </div>

              {/* Sort */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-outline">Sort:</span>
                {sortOptions.map((opt) => (
                  <Link
                    key={opt.value}
                    href={buildUrl({ sort: opt.value, page: '1' })}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                      sort === opt.value
                        ? 'bg-stitch-primary text-white shadow-sm'
                        : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    {opt.label}
                  </Link>
                ))}
              </div>
            </div>

            {(query || category !== 'all' || sort !== 'popular' || inStockOnly || rxOnly) && (
              <div className="mb-6 flex flex-wrap items-center gap-2 rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-3">
                <span className="text-xs font-bold uppercase tracking-wide text-outline">Active Filters</span>
                {category !== 'all' && (
                  <Link href={buildUrl({ category: 'all', page: '1' })} className="chip chip-active px-3 py-1 text-xs">
                    Category: {activeCategory.label} ×
                  </Link>
                )}
                {query && (
                  <Link href={buildUrl({ q: '', page: '1' })} className="chip chip-active px-3 py-1 text-xs">
                    Search: {query} ×
                  </Link>
                )}
                {inStockOnly && (
                  <Link href={buildUrl({ inStock: '', page: '1' })} className="chip chip-active px-3 py-1 text-xs">
                    In Stock ×
                  </Link>
                )}
                {rxOnly && (
                  <Link href={buildUrl({ rx: '', page: '1' })} className="chip chip-active px-3 py-1 text-xs">
                    Rx Only ×
                  </Link>
                )}
                {sort !== 'popular' && (
                  <Link href={buildUrl({ sort: 'popular', page: '1' })} className="chip chip-active px-3 py-1 text-xs">
                    Sort: {sortOptions.find((s) => s.value === sort)?.label ?? 'Custom'} ×
                  </Link>
                )}
                <Link href="/catalog" className="ml-auto rounded-lg bg-surface-container-high px-3 py-1.5 text-xs font-bold text-on-surface-variant transition hover:bg-surface-container">
                  Reset All
                </Link>
              </div>
            )}

            {/* Products grid */}
            {paginatedProducts.length === 0 ? (
              <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-16 text-center shadow-sm">
                <p className="text-5xl mb-4">🔍</p>
                <p className="font-headline text-lg font-bold text-on-surface">No products found</p>
                <p className="mt-1 text-sm text-on-surface-variant">Try a different category or search term.</p>
                <Link href="/catalog" className="mt-5 inline-block rounded-xl bg-stitch-primary px-6 py-2.5 text-sm font-bold text-white transition hover:bg-stitch-primary-container">
                  Clear filters
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {paginatedProducts.map((product, idx) => {
                  /* Featured wide card every 7th item (stitch asymmetric layout) */
                  if (idx === 6 && paginatedProducts.length > 8) {
                    return (
                      <div key={`featured-${product.id}`} className="col-span-2 rounded-2xl bg-gradient-to-br from-stitch-primary to-stitch-primary-container p-7 flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden group">
                        <div className="relative z-10 text-white space-y-3 flex-1">
                          <span className="inline-block rounded-full bg-stitch-secondary px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-stitch-primary">
                            Featured
                          </span>
                          <h2 className="font-headline text-2xl font-extrabold leading-tight">{product.name}</h2>
                          <p className="text-sm text-white/80 max-w-xs">{product.description}</p>
                          <div className="flex items-center gap-4 pt-2">
                            <span className="text-2xl font-black">
                              {(product.price / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                            </span>
                            <Link href={`/products/${product.id}`} className="rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-stitch-primary transition hover:bg-stitch-primary-fixed active:scale-95">
                              Add Now
                            </Link>
                          </div>
                        </div>
                        <span className="pointer-events-none absolute -right-8 -bottom-8 text-[200px] text-white/5 select-none">🌿</span>
                      </div>
                    );
                  }
                  return <ProductCard key={product.id} product={product} />;
                })}
              </div>
            )}

            {/* ══ PAGINATION ══ */}
            {totalPages > 1 && (
              <nav aria-label="Pagination" className="mt-14 flex items-center justify-center gap-2">
                {/* Prev */}
                {currentPage > 1 ? (
                  <Link href={buildUrl({ page: String(currentPage - 1) })} className="page-btn border border-outline-variant/30 hover:border-stitch-primary/40">
                    ‹
                  </Link>
                ) : (
                  <span className="page-btn cursor-not-allowed border border-outline-variant/20 opacity-30">‹</span>
                )}

                {pageNumbers.map((p, idx) =>
                  p === '…' ? (
                    <span key={`ell-${idx}`} className="px-2 text-outline">…</span>
                  ) : (
                    <Link
                      key={p}
                      href={buildUrl({ page: String(p) })}
                      className={`page-btn ${currentPage === p ? 'page-btn-active shadow-sm' : 'border border-outline-variant/30 hover:border-stitch-primary/40'}`}
                    >
                      {p}
                    </Link>
                  )
                )}

                {/* Next */}
                {currentPage < totalPages ? (
                  <Link href={buildUrl({ page: String(currentPage + 1) })} className="page-btn border border-outline-variant/30 hover:border-stitch-primary/40">
                    ›
                  </Link>
                ) : (
                  <span className="page-btn cursor-not-allowed border border-outline-variant/20 opacity-30">›</span>
                )}
              </nav>
            )}

            {/* Page info */}
            {totalPages > 1 && (
              <p className="mt-4 text-center text-xs text-outline">
                Page {currentPage} of {totalPages} · {filtered.length} total products
              </p>
            )}
          </section>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
