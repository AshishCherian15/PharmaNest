'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Boxes,
  Truck,
  ShoppingCart,
  BarChart3,
  Users,
  Settings,
  ClipboardText,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/inventory', label: 'Inventory', icon: Boxes },
  { href: '/dashboard/suppliers', label: 'Suppliers', icon: Truck },
  { href: '/dashboard/sales', label: 'Sales', icon: ShoppingCart },
  { href: '/dashboard/prescriptions', label: 'Prescriptions', icon: ClipboardText },
  { href: '/dashboard/reports', label: 'Reports', icon: BarChart3 },
  { href: '/dashboard/users', label: 'Customers', icon: Users },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href} passHref legacyBehavior>
            <SidebarMenuButton
              isActive={pathname.startsWith(item.href) && (item.href === '/dashboard' ? pathname === item.href : true)}
              tooltip={{ children: item.label }}
            >
              <item.icon />
              <span>{item.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
