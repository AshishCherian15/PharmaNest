import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import Link from 'next/link';

export function LandingFooter() {
  return (
    <footer className="border-t bg-card">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Icons.Logo className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">Pharma Nest</span>
            </Link>
            <p className="text-muted-foreground">
              Your trusted partner in health and wellness.
            </p>
            <div className="flex space-x-2">
              <Button size="icon" variant="ghost">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost">
                <Instagram className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary"
                >
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary"
                >
                  My Account
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary"
                >
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-primary"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Newsletter</h3>
            <p className="mb-4 text-muted-foreground">
              Subscribe to get the latest health news and deals.
            </p>
            <form className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1"
              />
              <Button>Subscribe</Button>
            </form>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Pharma Nest. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
