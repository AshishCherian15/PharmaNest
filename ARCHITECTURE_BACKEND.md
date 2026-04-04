# PharmaNest Backend Architecture

## Technology Stack
- **Runtime**: Node.js 18+ (via Next.js)
- **Framework**: Next.js 15.5.9 API Routes
- **Language**: TypeScript 5.x
- **Authentication**: JWT-based with HMAC signing
- **Session Management**: HTTP-only cookies
- **Data Persistence**: Mock data layer (ready for Prisma + PostgreSQL)
- **Validation**: Custom validation schemas
- **Logging**: Centralized logger with environment-aware levels

## API Architecture Overview

### Base URL
```
http://localhost:3000/api
```

### Response Format (Standard)
```typescript
// Success
{
  "success": true,
  "data": { /* payload */ },
  "status": 200
}

// Error
{
  "success": false,
  "error": "Error message",
  "status": 400,
  "details": { /* optional */ }
}
```

## Authentication System

### 1. **Session Token Management**
- **Token Type**: HMAC-SHA256 signed JWT-like structure
- **Payload**: 
  ```typescript
  {
    userId: string;
    role: 'Admin' | 'Pharmacist' | 'Staff' | 'Customer';
    email: string;
    expiresAt: number; // Unix timestamp
  }
  ```
- **Signing**: HMAC-SHA256 with AUTH_SECRET environment variable
- **Storage**: HTTP-only cookie `pharmanest_session`
- **Expiry**: Default 7 days (configurable)

### 2. **Login Endpoint**
```typescript
// POST /api/auth/login
{
  "email": "pharmacist@pharmacy.com",
  "password": "SecurePass123"
}

// Response 200
{
  "success": true,
  "data": {
    "user": {
      "id": "USR001",
      "name": "John Pharmacist",
      "email": "pharmacist@pharmacy.com",
      "role": "Pharmacist"
    },
    "token": "eyJhbGc..." // JWT token
  }
}

// Response 401
{
  "success": false,
  "error": "Invalid email or password"
}
```

### 3. **Register Endpoint**
```typescript
// POST /api/auth/register
{
  "name": "New Customer",
  "email": "customer@email.com",
  "password": "SecurePass123",
  "phone": "+919876543210"
}

// Response 201
{
  "success": true,
  "data": {
    "user": {
      "id": "CUS001",
      "name": "New Customer",
      "email": "customer@email.com",
      "role": "Customer"  // Always customer for public registration
    }
  }
}

// Security Notes:
// - Public registration is customer-only
// - Admin/Pharmacist/Staff roles can only be created by existing admins
// - Password validated: min 8 chars, uppercase, lowercase, number
// - Phone validated for Indian format (+91 XXXXX XXXXX)
```

### 4. **Current User Endpoint**
```typescript
// GET /api/auth/me
// Requires: Valid session cookie or Authorization header

// Response 200
{
  "success": true,
  "data": {
    "id": "USR001",
    "name": "John Pharmacist",
    "email": "pharmacist@pharmacy.com",
    "role": "Pharmacist",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}

// Response 401
{
  "success": false,
  "error": "Unauthorized"
}
```

### 5. **Logout Endpoint**
```typescript
// POST /api/auth/logout
// Requires: Valid session

// Response 200
{
  "success": true,
  "message": "Logged out successfully"
}
```

## Catalog & Stock Management

### 1. **Stock Snapshot Endpoint**
```typescript
// GET /api/catalog/stock
// Purpose: Real-time stock checking for checkout & cart

// Response 200
{
  "success": true,
  "data": {
    "medicines": [
      {
        "id": "MED001",
        "name": "Aspirin",
        "quantity": 150,
        "price": 2000,
        "requiresPrescription": false,
        "expiryDate": "2025-12-31"
      },
      {
        "id": "MED002",
        "name": "Amoxicillin",
        "quantity": 45,
        "price": 15000,
        "requiresPrescription": true,
        "expiryDate": "2025-11-15"
      }
    ],
    "version": 1234567890,     // For optimistic locking
    "timestamp": "2026-04-04T14:30:00Z"
  }
}
```

### 2. **Inventory Data Model**
```typescript
// src/lib/types.ts
type Medicine = {
  id: string;
  name: string;
  genericName: string;
  description: string;
  category: string;                    // e.g., "Antibiotics", "Pain Relief"
  requiresPrescription?: boolean;
  price: number;                        // In paise (100 = ₹1)
  quantity: number;                     // Current stock
  expiryDate: string;                   // ISO date
  imageId: string;                      // Reference to asset
  rating?: number;                      // 1-5 stars
  reviews?: number;                     // Review count
  isNew?: boolean;
  previousPrice?: number;               // For discount calculation
};
```

## Order Management

### 1. **Create Customer Order**
```typescript
// POST /api/customer/orders
// Requires: Customer session

{
  "items": [
    {
      "medicineId": "MED001",
      "quantity": 2
    },
    {
      "medicineId": "MED002",
      "quantity": 1,
      "prescriptionId": "RX001"  // Required for Rx items
    }
  ],
  "shippingAddress": "123 Main St, City, State 12345",
  "stockVersion": 1234567890       // Version from stock endpoint
}

// Response 201
{
  "success": true,
  "data": {
    "orderId": "ORD20260404001",
    "status": "Placed",
    "items": [ /* echoed */ ],
    "subtotal": 10000,
    "deliveryFee": 2000,
    "total": 12000,
    "createdAt": "2026-04-04T14:30:00Z"
  }
}

// Response 409 (Stock Conflict - Optimistic Locking)
{
  "success": false,
  "error": "Stock has changed. Please review your cart.",
  "status": 409,
  "details": {
    "stockConflicts": [
      {
        "medicineId": "MED001",
        "requested": 10,
        "available": 5
      }
    ],
    "currentVersion": 1234567891
  }
}

// Response 422 (Validation - Missing Prescription)
{
  "success": false,
  "error": "Prescription required",
  "status": 422,
  "details": {
    "requirePrescriptionItems": ["MED002"]
  }
}
```

### 2. **Get Customer Orders**
```typescript
// GET /api/customer/orders
// Requires: Customer session

// Response 200
{
  "success": true,
  "data": [
    {
      "id": "ORD20260404001",
      "items": [ /* items array */ ],
      "total": 12000,
      "status": "Processing",
      "createdAt": "2026-04-04T14:30:00Z",
      "updatedAt": "2026-04-04T15:45:00Z"
    }
  ]
}
```

### 3. **Admin: Get All Customer Orders**
```typescript
// GET /api/admin/customer-orders
// Requires: Admin/Staff session

// Query params:
// ?status=Placed&limit=20&offset=0&sortBy=createdAt&sortOrder=desc

// Response 200
{
  "success": true,
  "data": {
    "orders": [ /* paginated orders */ ],
    "total": 150,
    "page": 0,
    "pageSize": 20
  }
}
```

### 4. **Admin: Update Order Status**
```typescript
// PATCH /api/admin/customer-orders/{orderId}
// Requires: Admin/Staff session

{
  "status": "Shipped",
  "trackingNumber": "TRK123456789"
}

// Response 200
{
  "success": true,
  "data": { /* updated order */ }
}
```

### 5. **Order Data Model**
```typescript
// src/lib/types.ts
type CustomerOrder = {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  address: string;
  items: CustomerOrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'Placed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
};

type CustomerOrderItem = {
  medicineId: string;
  name: string;
  genericName: string;
  unitPrice: number;
  quantity: number;
};
```

## Prescription Management

### 1. **Check Prescription Eligibility**
```typescript
// GET /api/customer/prescriptions/eligibility
// Requires: Customer session

// Response 200
{
  "success": true,
  "data": {
    "hasValidPrescription": true,
    "prescriptions": [
      {
        "id": "RX001",
        "patientName": "John Doe",
        "doctorName": "Dr. Smith",
        "date": "2026-03-01",
        "status": "verified",
        "medicines": [
          { "name": "Amoxicillin", "dosage": "500mg", "quantity": 30 }
        ]
      }
    ]
  }
}

// Response 200 (No prescription)
{
  "success": true,
  "data": {
    "hasValidPrescription": false,
    "prescriptions": []
  }
}
```

### 2. **Prescription Data Model**
```typescript
type Prescription = {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;                    // Prescription issue date
  status: 'pending' | 'verified' | 'rejected';
  medicines: PrescriptionMedicine[];
  patientId: string;               // Link to customer/patient
};

type PrescriptionMedicine = {
  name: string;
  dosage: string;                  // e.g., "500mg"
  quantity: number;                // Prescribed quantity
};
```

## User & Staff Management

### 1. **Create/Update User (Admin Only)**
```typescript
// POST /api/admin/users
// Requires: Admin session

{
  "name": "New Pharmacist",
  "email": "new.pharma@pharmacy.com",
  "password": "TemporaryPass123",
  "phone": "+919876543210",
  "role": "Pharmacist"
}

// Response 201
{
  "success": true,
  "data": {
    "id": "USR002",
    "name": "New Pharmacist",
    "email": "new.pharma@pharmacy.com",
    "role": "Pharmacist"
  }
}
```

### 2. **List Users (Admin Only)**
```typescript
// GET /api/admin/users?role=Pharmacist&limit=20&offset=0
// Requires: Admin session

// Response 200
{
  "success": true,
  "data": {
    "users": [ /* user array */ ],
    "total": 45,
    "page": 0,
    "pageSize": 20
  }
}
```

### 3. **User Data Model**
```typescript
type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Admin' | 'Pharmacist' | 'Staff';
  avatarId: string;              // Asset reference
  createdAt: string;
  lastLogin?: string;
};
```

## Inventory Management (Admin/Staff)

### 1. **Add/Update Medicine**
```typescript
// POST /api/admin/inventory
// Requires: Admin/Staff session

{
  "name": "Ibuprofen",
  "genericName": "Ibuprofen",
  "description": "Pain relief...",
  "category": "Pain Relief",
  "price": 10000,
  "quantity": 500,
  "expiryDate": "2025-12-31",
  "requiresPrescription": false
}

// Response 201
{
  "success": true,
  "data": {
    "id": "MED100",
    "name": "Ibuprofen",
    "createdAt": "2026-04-04T14:30:00Z"
  }
}
```

### 2. **Low Stock Alerts**
```typescript
// GET /api/admin/inventory/alerts
// Requires: Admin/Staff session

// Response 200
{
  "success": true,
  "data": {
    "lowStock": [
      { "id": "MED050", "name": "Vitamin D", "quantity": 5, "threshold": 10 }
    ],
    "expiring": [
      { "id": "MED075", "name": "Antibiotic", "expiryDate": "2026-05-15" }
    ]
  }
}
```

## Supplier Management

### 1. **Manage Suppliers**
```typescript
// POST /api/admin/suppliers
{
  "name": "MedSupply Co.",
  "contactPerson": "John Manager",
  "email": "contact@medsupply.com",
  "phone": "+91-11-12345678"
}

// Response 201
{
  "success": true,
  "data": {
    "id": "SUP001",
    "name": "MedSupply Co.",
    "createdAt": "2026-04-04T14:30:00Z"
  }
}
```

### 2. **Purchase Orders**
```typescript
// POST /api/admin/purchase-orders
{
  "supplierId": "SUP001",
  "items": [
    { "medicineId": "MED001", "quantity": 100, "unitPrice": 1000 }
  ],
  "expectedDeliveryDate": "2026-04-15"
}

// Response 201
{
  "success": true,
  "data": {
    "id": "PO001",
    "supplierId": "SUP001",
    "status": "Pending",
    "total": 100000,
    "createdAt": "2026-04-04T14:30:00Z"
  }
}
```

## Reports & Analytics

### 1. **Sales Summary**
```typescript
// GET /api/admin/reports/sales?startDate=2026-04-01&endDate=2026-04-04
// Requires: Admin/Staff session

// Response 200
{
  "success": true,
  "data": {
    "totalRevenue": 500000,        // In paise
    "totalOrders": 125,
    "averageOrderValue": 4000,
    "topMedicines": [
      { "name": "Aspirin", "units": 450, "revenue": 900000 }
    ],
    "period": "2026-04-01 to 2026-04-04"
  }
}
```

### 2. **Inventory Reports**
```typescript
// GET /api/admin/reports/inventory?sortBy=quantity
// Requires: Admin/Staff session

// Response 200
{
  "success": true,
  "data": {
    "totalMedicines": 250,
    "totalValue": 50000000,        // Inventory valuation
    "lowStockCount": 15,
    "expiredCount": 2,
    "byCategory": {
      "Antibiotics": { "count": 45, "value": 15000000 },
      "Pain Relief": { "count": 60, "value": 12000000 }
    }
  }
}
```

## Error Handling

### Standard Error Codes
```typescript
// 400 Bad Request
{ "success": false, "error": "Invalid input parameters", "status": 400 }

// 401 Unauthorized
{ "success": false, "error": "Authentication required", "status": 401 }

// 403 Forbidden
{ "success": false, "error": "Insufficient permissions", "status": 403 }

// 404 Not Found
{ "success": false, "error": "Resource not found", "status": 404 }

// 409 Conflict
{ "success": false, "error": "Stock conflict or duplicate entry", "status": 409 }

// 422 Unprocessable Entity
{ "success": false, "error": "Validation failed", "status": 422, "details": {} }

// 429 Too Many Requests
{ "success": false, "error": "Rate limit exceeded", "status": 429 }

// 500 Internal Server Error
{ "success": false, "error": "Internal server error", "status": 500 }
```

## Rate Limiting
- **Login endpoint**: 5 attempts per 15 minutes per IP
- **General endpoints**: 100 requests per minute per authenticated user
- **Public endpoints**: 300 requests per hour per IP

## CORS Configuration
```typescript
// Allowed origins
http://localhost:3000
https://pharmanest.com
https://www.pharmanest.com

// Allowed methods
GET, POST, PUT, PATCH, DELETE, OPTIONS

// Allowed headers
Content-Type, Authorization

// Credentials
true (cookies allowed)
```

## Security Headers
```typescript
// Added automatically by middleware
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'
```

## Logging

### Log Levels (src/lib/logger.ts)
```typescript
logger.debug('Debug message');              // Development only
logger.info('Operation completed');         // General info
logger.warn('Deprecation warning');         // Warnings
logger.error('Operation failed', error);    // Errors
logger.fatal('System failure');             // Critical
```

### Log Format
```json
{
  "timestamp": "2026-04-04T14:30:00.123Z",
  "level": "INFO",
  "message": "User logged in",
  "userId": "USR001",
  "endpoint": "POST /api/auth/login",
  "duration": "45ms",
  "ip": "192.168.1.100"
}
```

## Environment Variables

```bash
# Required for Production
AUTH_SECRET=your-secret-key-min-32-chars
AUTH_DEFAULT_PASSWORD=TemporaryPass123    # Min 8 chars in production

# Optional
NODE_ENV=production                        # development | production
LOG_LEVEL=info                             # debug | info | warn | error | fatal
CORS_ORIGIN=https://pharmanest.com
DATABASE_URL=postgresql://...             # For future DB

# Feature flags
ENABLE_STOCK_LOCKING=true
ENABLE_PRESCRIPTION_VALIDATION=true
ENABLE_EMAIL_NOTIFICATIONS=false
```

## Database Schema (Future - Prisma)

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String
  phone     String
  role      Role
  createdAt DateTime @default(now())
  
  orders         CustomerOrder[]
  prescriptions  Prescription[]
}

model Medicine {
  id                  String   @id @default(cuid())
  name                String
  genericName         String
  category            String
  price               Int
  quantity            Int
  expiryDate          DateTime
  requiresPrescription Boolean  @default(false)
  
  orderItems         CustomerOrderItem[]
  prescriptionMedicines PrescriptionMedicine[]
}

model CustomerOrder {
  id              String   @id @default(cuid())
  customerId      String
  customer        User     @relation(fields: [customerId], references: [id])
  items           CustomerOrderItem[]
  total           Int
  status          OrderStatus
  shippingAddress String
  createdAt       DateTime @default(now())
}

model Prescription {
  id        String   @id @default(cuid())
  patientId String
  patient   User     @relation(fields: [patientId], references: [id])
  medicines PrescriptionMedicine[]
  status    PrescriptionStatus
  createdAt DateTime @default(now())
}
```

## Testing API Endpoints

### Using cURL
```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@pharmacy.com","password":"AdminPass123"}'

# Get current user
curl -X GET http://localhost:3000/api/auth/me \
  -H "Cookie: pharmanest_session=..."

# Create order
curl -X POST http://localhost:3000/api/customer/orders \
  -H "Content-Type: application/json" \
  -H "Cookie: pharmanest_session=..." \
  -d '{"items":[{"medicineId":"MED001","quantity":2}],...}'
```

### Using Postman
- Import collection from: `docs/postman-collection.json`
- Environment setup: `docs/postman-environment.json`
- Pre-configured auth flow and variables

## Performance Metrics

- **Login Response**: < 200ms
- **Catalog Stock**: < 100ms
- **Order Creation**: < 500ms
- **Reports Generation**: < 2s
- **Database Query**: < 50ms (MockDB)
- **API P95**: < 1s for all endpoints

## Future Backend Enhancements

1. **Database**: Migrate to Prisma + PostgreSQL
2. **Payment Processing**: Razorpay/Stripe webhooks
3. **Email Notifications**: SendGrid/AWS SES integration
4. **SMS Alerts**: Twilio for order status
5. **Real-time Updates**: WebSocket for live notifications
6. **Advanced Search**: Elasticsearch for medicine catalog
7. **Analytics**: Event tracking, business intelligence
8. **Caching**: Redis for session & catalog caching
9. **GraphQL**: Alternative to REST API
10. **Microservices**: Separate inventory, order, notification services
