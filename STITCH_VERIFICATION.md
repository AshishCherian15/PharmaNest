# Pharma Nest Stitch Design System — Verification Checklist

## ✅ Verification Steps

### 1. Dev Server Status
```bash
npm run dev
# Expected: Running on http://localhost:9002
```

### 2. Home Page (Landing)
Visit `http://localhost:9002`

**Expected Visual Elements:**
- [ ] Top info bar: **Deep green background** (#004532)
- [ ] Main buttons: **Green gradient** (light → dark green)
- [ ] Category cards: **Stitch primary green** section with teal section
- [ ] Product cards: **White background** with subtle border
- [ ] Add to cart button: **Green** with hover effect
- [ ] Badges: Rx badge = green, New badge = green, Discount = orange

**Color Verification:**
```
✓ Top bar background:     rgb(0, 69, 50)      [Deep green]
✓ Button gradient:        rgb(0, 69, 50) → rgb(6, 95, 70)  [Green gradient]
✓ Card background:        rgb(255, 255, 255)  [White]
✓ Border color:           rgb(190, 201, 194) / 0.2  [Light outline]
```

### 3. Dashboard Page
Visit `http://localhost:9002/dashboard`

**Expected Visual Elements:**
- [ ] Sidebar: **Light surface** with green accents
- [ ] Logo background: **Deep green** (#004532)
- [ ] "+ New Order" button: **Green gradient**
- [ ] Navigation items hover: **Green text** on light background
- [ ] Dot pattern background: **Subtle gray dots** on white

**Color Verification:**
```
✓ Sidebar background:     rgb(243, 244, 243)  [Off-white]
✓ Logo bg:                rgb(0, 69, 50)      [Deep green]
✓ Action button:          Green gradient
✓ Hover effects:          Primary green text
```

### 4. Inventory Page
Visit `http://localhost:9002/dashboard/inventory`

**Expected Visual Elements:**
- [ ] "Add Medicine" button: **Green gradient**
- [ ] Category/Status dropdowns: **Light background** with clean borders
- [ ] Pagination buttons: **Gray border** (inactive), **Green gradient** (active)
- [ ] Status badges: In Stock = light green, Low Stock = orange, Out = red
- [ ] Table headers: **Light gray** background
- [ ] Table rows: **White** with hover effect

**Color Verification:**
```
✓ Add button:             Green gradient
✓ Pagination active:      Green gradient button
✓ Pagination inactive:    Light border button
✓ In Stock badge:         Light green background
✓ Low Stock badge:        Orange background
✓ Out of Stock:           Red background
```

### 5. Product Pages
Visit `http://localhost:9002/catalog`

**Expected Visual Elements:**
- [ ] Product cards: **White background** with clean borders
- [ ] Price text: **Stitch primary green**
- [ ] Add to cart button: **Green** with checkmark on click
- [ ] Low stock badge: **Orange** in top-left
- [ ] Rx badge: **Green** in top-right
- [ ] Bestseller badge: **White** with green text

**Color Verification:**
```
✓ Card background:        rgb(255, 255, 255)  [White]
✓ Price text:             rgb(0, 69, 50)      [Deep green]
✓ Add button:             rgb(0, 69, 50)      [Green]
✓ Low stock badge:        Orange background
✓ Rx badge:               Green background
```

### 6. Customer Order Pages
Visit `http://localhost:9002/customer/orders` (after login)

**Expected Visual Elements:**
- [ ] Status badges: Placed = blue, Processing = orange, Shipped = purple, Delivered = green
- [ ] Action buttons: **Green** theme
- [ ] Order cards: **White** backgrounds

### 7. Prescriptions Page
Visit `http://localhost:9002/customer/prescriptions` (after login)

**Expected Visual Elements:**
- [ ] Verified badges: **Green background** with checkmark
- [ ] Pending badges: **Orange background**
- [ ] Rejected badges: **Red background**

---

## 🔍 DevTools Inspection

### Check CSS Variables Are Applied

**Open DevTools (F12) and inspect any green button:**

```javascript
// In DevTools console:
const style = window.getComputedStyle(document.querySelector('.btn-primary-gradient'));
console.log(style.background);

// Expected output:
// linear-gradient(135deg, rgb(0, 69, 50) 0%, rgb(6, 95, 70) 100%)
```

**Inspect Element to see:**
```css
.btn-primary-gradient {
  background: linear-gradient(135deg, rgb(var(--stitch-primary)) 0%, rgb(var(--stitch-primary-container)) 100%);
  color: rgb(var(--stitch-primary-fixed));
}
```

### Check Classes Are Using Variables

**Right-click any element → Inspect:**
1. Look for classes like `.btn-primary-gradient`, `.stitch-product-card`, etc.
2. In Styles panel, verify CSS uses `rgb(var(--...))`
3. Should NOT see hardcoded colors like `#004532`

---

## 📱 Color Reference Guide

### Primary Palette (Stitch Green)
| Color | Hex | RGB | Usage |
|-------|-----|-----|-------|
| Primary | #004532 | rgb(0, 69, 50) | Buttons, active states, main accent |
| Container | #065f46 | rgb(6, 95, 70) | Hover states, gradients |
| Fixed | #a6f2d1 | rgb(166, 242, 209) | Text on primary, light backgrounds |
| Fixed Dim | #8bd6b6 | rgb(139, 214, 182) | Alternative light shade |

### Secondary Palette (Stitch Teal)
| Color | Hex | RGB | Usage |
|-------|-----|-----|-------|
| Secondary | #006a61 | rgb(0, 106, 97) | Secondary accent, teal cards |
| Container | #86f2e4 | rgb(134, 242, 228) | Light teal backgrounds |
| Fixed | #89f5e7 | rgb(137, 245, 231) | Light teal text/backgrounds |

### Surface Hierarchy
| Color | Hex | RGB | Usage |
|-------|-----|-----|-------|
| Lowest (White) | #ffffff | rgb(255, 255, 255) | Card backgrounds, text background |
| Low | #f3f4f3 | rgb(243, 244, 243) | Sidebar, light sections |
| Container | #eeeeed | rgb(238, 238, 237) | Panels, containers |
| High | #e8e8e7 | rgb(232, 232, 231) | Hover states, elevated elements |
| Highest | #e2e2e2 | rgb(226, 226, 226) | Highest surface |

### Text & Borders
| Color | Hex | RGB | Usage |
|-------|-----|-----|-------|
| On Surface | #1a1c1c | rgb(26, 28, 28) | Primary text |
| On Surface Variant | #3f4944 | rgb(63, 73, 68) | Secondary text |
| Outline | #6f7973 | rgb(111, 121, 115) | Strong border |
| Outline Variant | #bec9c2 | rgb(190, 201, 194) | Light border, subtle elements |

### Status Colors
| Color | Hex | RGB | Usage |
|-------|-----|-----|-------|
| Error | #ba1a1a | rgb(186, 26, 26) | Error states, red badges |
| Warning | #f59e0b | rgb(245, 158, 11) | Orange badges, warnings |

---

## ✨ Expected Behaviors

### Button Hover Effects
```
Default state:    rgb(0, 69, 50) [deep green]
Hover state:      Slightly brighter green with -1px translate (lift effect)
Click state:      Scale down to 0.95 (active press feel)
Disabled state:   opacity 0.6, no hover effect
```

### Card Hover Effects
```
Default state:    White background, subtle border
Hover state:      -2px translate (lift), shadow-xl
```

### Navigation Hover Effects
```
Default text:     rgb(63, 73, 68) [gray]
Hover text:       rgb(0, 69, 50) [green]
Hover border:     Green bottom border appears
Active state:     Green text + bold + green border
```

### Pagination Effects
```
Inactive button:  Light border, gray text
Hover inactive:   Light background on hover
Active button:    Green gradient background, white text
First/Last:       Disabled when at boundary
```

---

## 🎯 Common Verification Points

### ✅ Correct - All Using CSS Variables
```css
✓ background: linear-gradient(135deg, rgb(var(--stitch-primary)) 0%, rgb(var(--stitch-primary-container)) 100%);
✓ color: rgb(var(--on-surface));
✓ border-color: rgb(var(--outline-variant) / 0.2);
✓ background-color: rgb(var(--surface-container-lowest));
```

### ❌ Incorrect - Hardcoded Values (Should Not See)
```css
❌ background: linear-gradient(135deg, #004532 0%, #065f46 100%);
❌ background: #ffffff;
❌ color: #1a1c1c;
❌ border: 1px solid #bec9c2;
```

---

## 🚨 Troubleshooting

### Issue: Colors don't look right
**Solution**: 
1. Hard refresh browser: `Ctrl+Shift+R` (Cmd+Shift+R on Mac)
2. Clear browser cache
3. Restart dev server: `npm run dev`

### Issue: CSS variables not showing
**Solution**:
1. Check DevTools → Styles → Look for `.root { --stitch-primary: ... }`
2. Verify `globals.css` is imported in `layout.tsx`
3. Check for CSS conflicts with other stylesheets

### Issue: Dark mode colors not working
**Solution**:
1. Add `.dark` class to `<html>` element to test
2. Check `.dark` overrides in globals.css
3. Verify dark mode color variables are defined

---

## 📊 Before/After Comparison

### Before Fixes
```
Components:       14 utility classes (hardcoded colors)
Color Instances:  #004532 appears 3 times (duplication)
Maintenance:      Change color = find & replace in multiple files
Theme Support:    If modified
Consistency:      Manual verification needed
```

### After Fixes
```
Components:       14 utility classes (CSS variables)
Color Instances:  Defined once in :root (single source)
Maintenance:      Change variable = all components update
Theme Support:    ✅ Via .dark class override
Consistency:      ✅ Guaranteed by variable system
```

---

## 🎓 What Was Fixed

| Aspect | Before | After |
|--------|--------|-------|
| Color Duplication | 3+ instances of #004532 | 1 variable `--stitch-primary` |
| Button Gradients | Hardcoded hex | CSS variables |
| Card Backgrounds | Hardcoded white | CSS variable `--surface-container-lowest` |
| Border Colors | Hardcoded outline | CSS variable `--outline-variant` |
| Maintainability | ⚠️ Manual updates | ✅ Automatic propagation |
| Dark Mode | ❌ Not supported | ✅ Ready via .dark override |
| Consistency | ⚠️ Manual checks | ✅ Guaranteed |

---

## ✅ Final Checklist

- [ ] Dev server running on http://localhost:9002
- [ ] Landing page shows green theme correctly
- [ ] Dashboard sidebar shows light surface
- [ ] Buttons show green gradient
- [ ] Pagination shows correct colors
- [ ] Cards have proper styling
- [ ] No hardcoded color issues in DevTools
- [ ] Hover effects work smoothly
- [ ] All badges show correct colors
- [ ] Responsive design works on mobile

---

**Status**: ✅ Stitch Design System Integration Complete

All CSS utilities now properly use design system variables. Your Pharma Nest frontend is visually consistent and maintainable!
