import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { LandingHeader } from '@/components/landing/header';
import { LandingFooter } from '@/components/landing/footer';
import { getAvailableStock } from '@/lib/catalog-stock';
import { ProductDetailClient } from './product-detail-client';
import { ProductImage } from '@/components/ui/product-image';
import { ProductImageGallery } from './product-image-gallery';
import { getProductGalleryImageIds } from '@/lib/product-image-galleries';
import { getAllProducts } from '@/lib/product-store';

export async function generateStaticParams() {
  const allProducts = await getAllProducts();
  return allProducts.map((p) => ({ id: p.id }));
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const allProducts = await getAllProducts();
  const product = allProducts.find((p) => p.id === id);
  if (!product) notFound();

  const stock   = await getAvailableStock(product.id);
  const related = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4)
    .map((p) => ({ ...p, quantity: 0 }));

  const relatedImageIds = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .map((p) => p.imageId)
    .filter((imgId, idx, arr) => arr.indexOf(imgId) === idx);

  const galleryImageIds = getProductGalleryImageIds(
    product.id,
    product.imageId,
    relatedImageIds
  );

  const discount = product.previousPrice
    ? Math.round(((product.previousPrice - product.price) / product.previousPrice) * 100)
    : null;

  const stockLabel = stock === 0 ? 'Out of Stock' : stock < 10 ? `Only ${stock} left` : 'In Stock';
  const stockColor = stock === 0 ? 'text-red-600 bg-red-50' : stock < 10 ? 'text-amber-700 bg-amber-50' : 'text-green-700 bg-green-50';

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Suspense fallback={<div className="h-[88px] bg-white border-b border-outline-variant/20" />}>
        <LandingHeader />
      </Suspense>

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* ── Breadcrumb ── */}
        <nav className="mb-8 flex flex-wrap items-center gap-1.5 text-sm text-on-surface-variant">
          <Link href="/" className="hover:text-stitch-primary transition">Home</Link>
          <span className="text-outline">›</span>
          <Link href="/catalog" className="hover:text-stitch-primary transition">Catalog</Link>
          <span className="text-outline">›</span>
          <Link href={`/catalog?category=${encodeURIComponent(product.category)}`} className="hover:text-stitch-primary transition">
            {product.category}
          </Link>
          <span className="text-outline">›</span>
          <span className="font-semibold text-on-surface">{product.name}</span>
        </nav>

        {/* ── Product section ── */}
        <section className="mb-16 grid grid-cols-1 gap-12 lg:grid-cols-12">

          {/* Image panel */}
          <div className="lg:col-span-7">
            <div className="relative">
              <ProductImageGallery
                imageId={product.imageId}
                productName={product.name}
                category={product.category}
                additionalImageIds={galleryImageIds}
              />
              {product.requiresPrescription && (
                <div className="absolute right-4 top-4 rounded-full bg-stitch-primary/10 px-4 py-1.5 text-xs font-bold text-stitch-primary">
                  Prescription Required
                </div>
              )}
              {discount && (
                <div className="absolute left-4 top-4 rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-white">
                  -{discount}% OFF
                </div>
              )}
            </div>
          </div>

          {/* Info panel */}
          <div className="flex flex-col lg:col-span-5">
            <div className="mb-5">
              <span className="text-xs font-bold uppercase tracking-widest text-stitch-secondary">{product.category}</span>
              <h1 className="font-headline mt-2 text-4xl font-extrabold leading-tight text-on-surface lg:text-5xl">
                {product.name}
              </h1>
              <p className="mt-1 text-sm font-medium text-on-surface-variant">{product.genericName}</p>
              <p className="mt-4 text-base leading-relaxed text-on-surface-variant">{product.description}</p>
            </div>

            {/* Rx notice */}
            {product.requiresPrescription && (
              <div className="my-5 rounded-xl border-l-4 border-stitch-primary bg-stitch-primary-fixed/10 p-5">
                <div className="flex items-start gap-3">
                  <span className="text-xl">⚕️</span>
                  <div>
                    <h3 className="font-bold text-stitch-primary">Prescription Required</h3>
                    <p className="mt-1 text-sm text-on-surface-variant">
                      This medication requires a valid prescription. Upload your prescription after checkout or use our telehealth service to speak with a doctor.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Price */}
            <div className="mb-6">
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="font-headline text-4xl font-extrabold text-on-surface">
                  {(product.price / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                </span>
                {product.previousPrice && (
                  <span className="text-lg text-outline line-through">
                    {(product.previousPrice / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                  </span>
                )}
                {discount && (
                  <span className="rounded-full bg-stitch-secondary-container px-3 py-1 text-xs font-bold text-on-stitch-secondary-container">
                    SAVE {discount}%
                  </span>
                )}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${stockColor}`}>
                  {stock > 0 ? '✓' : '✗'} {stockLabel}
                </span>
                <span className="text-xs text-on-surface-variant">
                  Prices may vary based on insurance coverage.
                </span>
              </div>
            </div>

            {/* Add to cart — client */}
            <ProductDetailClient product={{ ...product, quantity: stock }} />

            {/* Trust badges */}
            <div className="mt-8 grid grid-cols-3 gap-3 border-t border-outline-variant/20 pt-6">
              {[
                { icon: '✓', label: 'Quality Checked' },
                { icon: '🚚', label: 'Cold Chain' },
                { icon: '💬', label: '24/7 Support' },
              ].map((b) => (
                <div key={b.label} className="flex flex-col items-center gap-1 text-center">
                  <span className="text-xl">{b.icon}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Info + Sidebar ── */}
        <section className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-12">
          <div className="space-y-6 md:col-span-8">

            {/* Dosage */}
            <div className="rounded-2xl bg-surface-container-low p-8">
              <h2 className="font-headline mb-5 flex items-center gap-2 text-xl font-bold text-on-surface">
                <span>💊</span> Dosage Instructions
              </h2>
              <p className="text-sm leading-relaxed text-on-surface-variant">
                Standard dose for adults as prescribed by your healthcare provider. Take with or without food unless otherwise directed. Store in a cool, dry place away from direct sunlight. Do not exceed the recommended dose.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-on-surface-variant">
                <li className="flex items-start gap-2"><span className="mt-1 text-stitch-primary">•</span> Follow your doctor's prescription exactly.</li>
                <li className="flex items-start gap-2"><span className="mt-1 text-stitch-primary">•</span> Do not crush or chew unless directed.</li>
                <li className="flex items-start gap-2"><span className="mt-1 text-stitch-primary">•</span> Pediatric dosing may differ — consult your pharmacist.</li>
              </ul>
            </div>

            {/* Side effects */}
            <div className="rounded-2xl bg-surface-container-low p-8">
              <h2 className="font-headline mb-5 flex items-center gap-2 text-xl font-bold text-on-surface">
                <span>⚠️</span> Side Effects & Precautions
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="mb-3 font-bold text-on-surface">Common Side Effects</h4>
                  <ul className="space-y-2 text-sm text-on-surface-variant">
                    {['Mild nausea or stomach upset', 'Headache or dizziness', 'Skin rash (rare)'].map((s) => (
                      <li key={s} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-400" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="mb-3 font-bold text-on-surface">Critical Precautions</h4>
                  <ul className="space-y-2 text-sm text-on-surface-variant">
                    {['Consult doctor if pregnant or breastfeeding', 'Avoid alcohol during treatment', 'Keep out of reach of children'].map((s) => (
                      <li key={s} className="flex items-start gap-2">
                        <span className="mt-1 text-xs text-stitch-primary">✓</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div>
              <h2 className="font-headline mb-5 px-1 text-xl font-bold text-on-surface">Frequently Asked Questions</h2>
              <div className="space-y-3">
                {[
                  'How long does it take to start working?',
                  'Can I take this with other medications?',
                  'What should I do if I miss a dose?',
                ].map((q) => (
                  <div key={q} className="rounded-xl bg-surface-container-lowest p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-on-surface text-sm">{q}</span>
                      <span className="text-outline">+</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="md:col-span-4">
            <div className="sticky top-28 space-y-5">
              {/* Telehealth CTA */}
              <div className="relative overflow-hidden rounded-2xl bg-stitch-primary p-7">
                <div className="relative z-10">
                  <h3 className="font-headline text-lg font-bold text-white">Need a Prescription?</h3>
                  <p className="mt-2 text-sm text-stitch-primary-fixed/90">
                    Talk to our certified medical professionals online and get your prescription in minutes.
                  </p>
                  <Link href="/login" className="mt-5 inline-block rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-stitch-primary transition hover:bg-stitch-primary-fixed active:scale-95">
                    Start Telehealth Visit
                  </Link>
                </div>
                <span className="pointer-events-none absolute -bottom-8 -right-8 text-[160px] text-white/10 select-none">📹</span>
              </div>

              {/* Patient resources */}
              <div className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm">
                <h3 className="font-headline mb-4 font-bold text-on-surface">Patient Resources</h3>
                <ul className="space-y-3">
                  {[
                    { icon: '📄', label: 'Full Prescription Information (PDF)' },
                    { icon: '▶️', label: 'How to Take Your Medication' },
                    { icon: '💰', label: 'Insurance Coverage Guide' },
                  ].map((r) => (
                    <li key={r.label}>
                      <button className="flex w-full items-center gap-2.5 text-sm text-on-surface-variant transition hover:text-stitch-primary">
                        <span>{r.icon}</span>
                        <span>{r.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </section>

        {/* ── Related products ── */}
        {related.length > 0 && (
          <section className="mb-16">
            <h2 className="font-headline mb-8 text-2xl font-extrabold text-on-surface">Related Products</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {related.map((p) => {
                return (
                  <Link
                    key={p.id}
                    href={`/products/${p.id}`}
                    className="stitch-product-card group p-4 border border-outline-variant/20 shadow-sm"
                  >
                    <div className="relative mb-3 flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-surface-container-low">
                      <ProductImage
                        imageId={p.imageId}
                        name={p.name}
                        category={p.category}
                        sizes="(max-width: 640px) 50vw, 25vw"
                        className="group-hover:scale-110"
                      />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-stitch-secondary">{p.category}</span>
                    <h4 className="mt-1 font-bold text-on-surface line-clamp-2">{p.name}</h4>
                    <p className="mt-1 font-bold text-stitch-primary">
                      {(p.price / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                    </p>
                    <button className="mt-3 w-full rounded-lg border border-outline-variant/30 py-2 text-xs font-bold text-on-surface transition hover:bg-surface-container hover:border-stitch-primary/30">
                      View Details
                    </button>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

      </main>
      <LandingFooter />
    </div>
  );
}
