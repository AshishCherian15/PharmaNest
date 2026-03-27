import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Heart,
  Search,
  ShoppingCart,
  Star,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { landingProducts, landingCategories } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ProductCard } from '@/components/landing/product-card';
import { LandingHeader } from '@/components/landing/header';
import { LandingFooter } from '@/components/landing/footer';

export default function LandingPage() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-1');

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <LandingHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[300px] w-full md:h-[400px]">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt="Hero banner"
              fill
              className="object-cover"
              data-ai-hint={heroImage.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-primary/20" />
          <div className="container relative z-10 flex h-full flex-col items-start justify-center gap-4 text-left">
            <h1 className="text-3xl font-bold tracking-tight text-primary-foreground md:text-5xl">
              Special Medicine <br /> Discounts Just for You!
            </h1>
            <p className="max-w-md text-lg text-primary-foreground/90">
              Get the best deals on healthcare products.
            </p>
            <Button asChild size="lg">
              <Link href="#">Shop Now</Link>
            </Button>
          </div>
        </section>

        {/* Popular Categories */}
        <section className="py-12 md:py-16">
          <div className="container">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
                Popular Categories
              </h2>
              <Button variant="link" className="group" asChild>
                <Link href="#">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              {landingCategories.map((category) => {
                const categoryImage = PlaceHolderImages.find(
                  (img) => img.id === category.imageId
                );
                return (
                  <Link
                    href="#"
                    key={category.id}
                    className="group flex flex-col items-center gap-3 rounded-lg border bg-card p-4 text-center transition-colors hover:border-primary"
                  >
                    <div className="relative h-20 w-20">
                      {categoryImage && (
                        <Image
                          src={categoryImage.imageUrl}
                          alt={category.name}
                          fill
                          className="object-contain"
                          data-ai-hint={categoryImage.imageHint}
                        />
                      )}
                    </div>
                    <span className="font-medium text-card-foreground">
                      {category.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Latest Products */}
        <section className="bg-muted py-12 md:py-16">
          <div className="container">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
                Latest Products
              </h2>
              <Button variant="link" className="group" asChild>
                <Link href="#">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {landingProducts
                .filter((p) => p.isNew)
                .slice(0, 5)
                .map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </div>
          </div>
        </section>

        {/* Best Deals */}
        <section className="py-12 md:py-16">
          <div className="container">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
                Best Deals of the Week
              </h2>
              <Button variant="link" className="group" asChild>
                <Link href="#">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {landingProducts
                .filter((p) => p.previousPrice)
                .slice(0, 10)
                .map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
