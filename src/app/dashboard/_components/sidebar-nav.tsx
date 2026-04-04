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
  ClipboardType,
  ClipboardList,
  Home,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard',               label: 'Dashboard',     icon: LayoutDashboard },
  { href: '/dashboard/inventory',     label: 'Inventory',     icon: Boxes           },
  { href: '/dashboard/sales',         label: 'Sales / POS',   icon: ShoppingCart    },
  { href: '/dashboard/orders',        label: 'Orders',        icon: ClipboardList   },
  { href: '/dashboard/prescriptions', label: 'Prescriptions', icon: ClipboardType   },
  { href: '/dashboard/suppliers',     label: 'Suppliers',     icon: Truck           },
  { href: '/dashboard/reports',       label: 'Reports',       icon: BarChart3       },
  { href: '/dashboard/users',         label: 'Users / CRM',   icon: Users           },
  { href: '/dashboard/settings',      label: 'Settings',      icon: Settings        },
  { href: '/',                        label: 'Storefront',    icon: Home            },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => {
        const isActive =
          item.href === '/dashboard'
            ? pathname === '/dashboard'
            : item.href === '/'
            ? false
            : pathname.startsWith(item.href);

        return (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={isActive}
              tooltip={{ children: item.label }}
              className={isActive
                ? 'bg-surface-container-lowest text-stitch-primary shadow-sm font-bold'
                : 'text-outline hover:bg-surface-container-high hover:text-on-surface font-semibold'
              }
            >
              <Link href={item.href} className="flex items-center gap-3 transition-all active:translate-x-0.5">
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
