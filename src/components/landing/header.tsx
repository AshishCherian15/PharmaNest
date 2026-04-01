'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
} from 'lucide-react';
import { Icons } from '../icons';

const navLinks = [
    { href: "#", label: "Home" },
    { href: "#", label: "Shop" },
    { href: "#", label: "Categories" },
    { href: "#", label: "About Us" },
    { href: "#", label: "Contact" },
]

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="flex items-center gap-2">
            <Icons.Logo className="h-6 w-6 text-primary" />
            <span className="font-bold">Pharma Nest</span>
          </Link>
        </div>
        
        <div className="md:hidden">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <div className="flex flex-col gap-4 p-4">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <Icons.Logo className="h-6 w-6 text-primary" />
                            <span className="font-bold">Pharma Nest</span>
                        </Link>
                        <nav className="flex flex-col gap-3">
                            {navLinks.map(link => (
                                <Link key={link.label} href={link.href} className="text-muted-foreground hover:text-foreground">
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </SheetContent>
            </Sheet>
        </div>

        <div className="hidden md:flex flex-1 items-center justify-center">
          <nav className="flex items-center gap-6 text-sm">
            {navLinks.map(link => (
                <Link key={link.label} href={link.href} className="text-muted-foreground transition-colors hover:text-foreground">
                    {link.label}
                </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2 md:flex-grow-0">
          <div className="relative hidden sm:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full rounded-lg bg-secondary pl-8 md:w-[200px] lg:w-[320px]"
            />
          </div>
          <Button variant="ghost" size="icon">
            <Heart className="h-5 w-5" />
            <span className="sr-only">Wishlist</span>
          </Button>
          <Button variant="ghost" size="icon">
            <ShoppingCart className="h-5 w-5" />
            <span className="sr-only">Cart</span>
          </Button>
          <Button asChild variant="ghost" size="icon">
            <Link href="/login">
                <User className="h-5 w-5" />
                <span className="sr-only">Login</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
