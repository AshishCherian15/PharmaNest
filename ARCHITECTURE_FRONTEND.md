# PharmaNest Frontend Architecture

## Technology Stack
- **Framework**: Next.js 15.5.9 (App Router)
- **React**: 19.0.0 with Server Components support
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 4.x + Custom Stitch Design System
- **UI Components**: Shadcn/ui (customized)
- **Theming**: next-themes with system preference detection
- **State Management**: React Context + Local State (React 19 useOptimistic)
- **HTTP Client**: Fetch API (built-in, no external library)

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Landing splash screen
│   ├── layout.tsx                # Root layout with theme provider
│   ├── globals.css               # Stitch design tokens + Tailwind config
│   ├── login/
│   │   └── page.tsx              # Login form (customer + staff)
│   ├── register/
│   │   └── page.tsx              # Registration form (customer signup)
│   ├── dashboard/                # Protected admin/staff routes
│   │   ├── layout.tsx            # Dashboard shell with sidebar
│   │   ├── page.tsx              # Dashboard home (KPI cards)
│   │   ├── _components/          # Reusable dashboard components
│   │   │   ├── stat-card.tsx     # KPI card component
│   │   │   ├── data-table.tsx    # Generic data table with sorting/filtering
│   │   │   ├── header.tsx        # Page header component
│   │   │   ├── sidebar-nav.tsx   # Navigation sidebar
│   │   │   ├── alerts-card.tsx   # Alert/notification card
│   │   │   ├── sales-chart.tsx   # Chart visualization
│   │   │   └── recent-sales.tsx  # Recent transaction list
│   │   ├── inventory/            # Medicine inventory management
│   │   │   ├── page.tsx
│   │   │   └── _components/
│   │   │       ├── columns.tsx   # Table column definitions
│   │   │       ├── data-table.tsx
│   │   │       └── add-medicine-dialog.tsx
│   │   ├── orders/               # Purchase order management
│   │   │   ├── page.tsx
│   │   │   └── _components/
│   │   │       ├── columns.tsx
│   │   │       └── add-order-dialog.tsx
│   │   ├── prescriptions/        # Prescription tracking
│   │   │   ├── page.tsx
│   │   │   └── _components/
│   │   │       └── columns.tsx
│   │   ├── reports/              # Analytics & reporting
│   │   │   ├── page.tsx          # Report dashboard with period filters
│   │   │   └── _components/
│   │   │       ├── sales-over-time-chart.tsx
│   │   │       └── sales-by-category-chart.tsx
│   │   ├── suppliers/            # Supplier management
│   │   │   ├── page.tsx
│   │   │   └── _components/
│   │   │       ├── columns.tsx
│   │   │       └── add-supplier-dialog.tsx
│   │   ├── users/                # Staff & user management
│   │   │   ├── page.tsx          # User table with role filters & export
│   │   │   └── _components/
│   │   │       ├── columns.tsx
│   │   │       └── add-customer-dialog.tsx
│   │   ├── settings/             # System settings
│   │   │   └── page.tsx
│   │   ├── sales/                # POS & sales tracking
│   │   │   └── page.tsx
│   │   └── loading.tsx           # Dashboard loading skeleton
│   ├── customer/                 # Protected customer routes
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Customer dashboard
│   │   ├── cart/
│   │   │   └── page.tsx          # Shopping cart with live stock
│   │   ├── checkout/
│   │   │   └── page.tsx          # Order checkout with prescription validation
│   │   ├── orders/
│   │   │   └── page.tsx          # Customer order history
│   │   └── loading.tsx
│   ├── catalog/                  # Product catalog browsing
│   │   └── page.tsx              # Medicine catalog with search/filter
│   ├── knowledge-hub/            # Educational content
│   │   └── page.tsx
│   ├── products/                 # Product detail pages
│   │   └── [id]/
│   │       └── page.tsx
│   ├── api/                      # API route handlers
│   │   ├── auth/
│   │   │   ├── login/route.ts    # Login endpoint
│   │   │   ├── register/route.ts # User registration
│   │   │   ├── logout/route.ts   # Session invalidation
│   │   │   └── me/route.ts       # Current user profile
│   │   ├── catalog/
│   │   │   └── stock/route.ts    # Live stock snapshot
│   │   ├── customer/
│   │   │   ├── orders/route.ts   # Customer order CRUD
│   │   │   └── prescriptions/
│   │   │       └── eligibility/route.ts
│   │   └── admin/
│   │       └── customer-orders/route.ts
│   ├── error.tsx                 # Global error boundary
│   ├── not-found.tsx             # 404 page
│   └── loading.tsx               # Root loading state
├── components/                   # Reusable UI components
│   ├── ui/                       # Base UI primitives (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── form.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   ├── badge.tsx
│   │   ├── alert.tsx
│   │   ├── pagination.tsx
│   │   ├── select.tsx
│   │   ├── textarea.tsx
│   │   ├── switch.tsx
│   │   ├── checkbox.tsx
│   │   ├── slider.tsx
│   │   ├── carousel.tsx
│   │   ├── progress.tsx
│   │   ├── skeleton.tsx
│   │   ├── tooltip.tsx
│   │   ├── sheet.tsx
│   │   ├── separator.tsx
│   │   ├── scroll-area.tsx
│   │   ├── popover.tsx
│   │   ├── accordion.tsx
│   │   ├── collapsible.tsx
│   │   ├── radio-group.tsx
│   │   ├── calendar.tsx
│   │   └── alert-dialog.tsx
│   ├── landing/                  # Landing page components
│   │   ├── header.tsx            # Navigation header
│   │   ├── footer.tsx            # Page footer
│   │   └── product-card.tsx      # Product showcase card
│   ├── customer/                 # Customer-facing components
│   │   ├── ...
│   ├── dashboard/                # Admin/staff specific components
│   │   └── page-header.tsx       # Branded page header
│   ├── navigation/               # Navigation components
│   │   └── ...
│   ├── app-providers.tsx         # Root context providers
│   ├── theme-provider.tsx        # Theme switching
│   ├── theme-toggle.tsx          # Theme toggle button
│   ├── user-nav.tsx              # User profile menu
│   ├── error-boundary.tsx        # React error boundary
│   ├── icons.tsx                 # Custom icon library
│   ├── delete-confirmation-dialog.tsx
│   ├── edit-profile-dialog.tsx
│   └── logo.tsx                  # Brand logo component
├── hooks/                        # Custom React hooks
│   ├── use-mobile.tsx            # Mobile viewport detection
│   ├── use-toast.ts              # Toast notification hook
│   └── use-store-cart.ts         # Shopping cart state management
├── lib/                          # Utility functions & helpers
│   ├── types.ts                  # TypeScript type definitions
│   ├── data.ts                   # Mock data for development
│   ├── utils.ts                  # Common utilities (cn, etc.)
│   ├── auth.ts                   # Authentication utilities
│   ├── logger.ts                 # Centralized logging
│   ├── validation.ts             # Form validation rules
│   ├── catalog-stock.ts          # Stock management logic
│   ├── customer-orders.ts        # Order processing logic
│   ├── prescriptions.ts          # Prescription validation
│   └── placeholder-images.ts     # Image asset handling
└── public/                       # Static assets
    ├── PharmaNest.png            # Brand assets
    └── placeholder-images/       # Default image files
```

## Key Frontend Features

### 1. **Responsive Dashboard**
- **Admin/Staff View**: Inventory, orders, prescriptions, reports, users, suppliers
- **Customer View**: Product catalog, shopping cart, order history, prescriptions
- **Responsive**: Mobile-first design with breakpoints (sm, md, lg, xl, 2xl)

### 2. **Authentication Flow**
- **Splash Screen**: Public landing page with theme selection
- **Login**: Email + password for staff/customers
- **Registration**: Customer self-signup only
- **Session**: Cookie-based with JWT token validation
- **Protected Routes**: Middleware enforces role-based access
- **Roles**: Admin, Pharmacist, Staff, Customer

### 3. **Data Tables**
- **Generic DataTable Component**: Sorting, filtering, pagination
- **Column Definitions**: TypeScript interfaces for type safety
- **Bulk Actions**: Select, delete, export functionality
- **Live Search**: Real-time filtering
- **Pagination**: Configurable page size

### 4. **Forms & Dialogs**
- **React Hook Form**: Integration via `form.tsx` component
- **Validation**: Real-time with custom rules (email, phone, etc.)
- **Add/Edit Dialogs**: Medicine, suppliers, orders, users
- **Delete Confirmation**: Safety dialog for destructive actions

### 5. **Reports & Analytics**
- **KPI Cards**: Revenue, sales count, stock alerts, expired items
- **Period Filters**: Last 7 days, Last 30 days, Year to date
- **Charts**: Sales over time, sales by category (Recharts integration)
- **Watchlist Panels**: Low stock medicines, top revenue drivers
- **CSV Export**: Export summary & filtered records

### 6. **Shopping & Checkout**
- **Catalog Page**: Browse medicines with search/filter
- **Product Cards**: Image, name, price, stock count, ratings
- **Shopping Cart**: Add to cart, update quantity, remove items
- **Live Stock Sync**: Real-time availability checking (30s refresh)
- **Checkout Form**: Address entry, prescription validation, order placement
- **Order Confirmation**: Email-style receipt preview

### 7. **Prescription Management**
- **Prescription Tracking**: Status (pending, verified, rejected)
- **Medicine Prescriptions**: Link medicines requiring Rx
- **Eligibility Check**: Verify customer has valid prescription before Rx purchase
- **Doctor Integration**: Doctor name, prescription details storage

### 8. **Stitch Design System**
- **Color Tokens**: CSS custom properties + RGB variables
- **Typography**: Modular scale for headings, body, captions
- **Spacing**: Consistent 4px grid (4, 8, 12, 16, 24, 32, 48, 64)
- **Shadows**: Layered shadow system (sm, md, lg, xl)
- **Border Radius**: Consistent curve values (sm, md, lg, full)
- **Transitions**: Smooth animations (200ms, 300ms, 500ms)
- **Accessibility**: WCAG 2.1 AA compliant contrast ratios

## Frontend State Management

### Local State (React 19)
```typescript
// Server Component
function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('Last 30 days');
  // ...
}
```

### Context API
```typescript
// App-level providers
<ThemeProvider>
  <QueryClientProvider>
    <App />
  </QueryClientProvider>
</ThemeProvider>
```

### Shopping Cart State
```typescript
// src/hooks/use-store-cart.ts
export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  // Persist to localStorage
}
```

## Form Validation

**Custom Rules (src/lib/validation.ts):**
- `email`: RFC 5322 format
- `phone`: Indian 10-digit format (+91)
- `password`: Min 8 chars, uppercase, lowercase, number
- `medicinePrice`: Positive decimal (2 decimals)
- `quantity`: Positive integer
- `dosage`: Pattern validation

## API Consumption

### Authentication
```typescript
// src/app/api/auth/login/route.ts
POST /api/auth/login
{
  "email": "user@pharmacy.com",
  "password": "SecurePass123"
}
Response: { token, user, session }
```

### Catalog Stock
```typescript
// src/app/api/catalog/stock/route.ts
GET /api/catalog/stock
Response: { medicines[], version, timestamp }
```

### Orders
```typescript
// src/app/api/customer/orders/route.ts
POST /api/customer/orders
{
  "items": [{ medicineId, quantity }],
  "shippingAddress": "...",
  "prescriptionIds": ["RX001"]
}
```

## Performance Optimizations

1. **Code Splitting**: Automatic via Next.js App Router
2. **Image Optimization**: Next.js Image component
3. **CSS**: Tailwind's minification & purging
4. **Font Loading**: CSS font-display: swap
5. **Server Components**: Minimal JS on client
6. **Caching**: HTTP cache headers on static assets
7. **Pagination**: Table virtualization ready

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile: iOS Safari 14+, Chrome Mobile 90+

## Environment Configuration

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=PharmaNest
```

## Development Workflow

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Type check
npm run typecheck

# Build for production
npm run build

# Start production server
npm start
```

## Future Improvements

1. **Real Database**: Replace mock data with Prisma ORM + PostgreSQL
2. **Payment Gateway**: Razorpay or Stripe integration
3. **Real-time Updates**: WebSocket for live order/stock notifications
4. **Advanced Analytics**: Drill-down reporting, custom date ranges
5. **Mobile App**: React Native version
6. **Internationalization**: Multi-language support
7. **Dark Mode**: Complete theme system with AI-powered suggestions
8. **Accessibility**: Screen reader optimizations
