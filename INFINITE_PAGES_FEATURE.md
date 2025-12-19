# Infinite Pages Feature Implementation

## Overview

The book now simulates an infinite page system where:
- Pages never run out (like a real book)
- Flipping pages doesn't decrease stack sizes
- The book always opens in the middle
- Spine thickness reflects page count
- Page size matches cover dimensions

---

## Key Features

### 1. **Spine Thickness Linked to Page Count**

**Formula**: `spineDepth = pageCount × 0.002`

Each page adds 2mm of thickness to the spine (realistic paper thickness).

```tsx
// 30 pages → 0.06 spine depth
// 50 pages → 0.10 spine depth
// 100 pages → 0.20 spine depth
```

**Benefits**:
- Visual consistency (thick book = many pages)
- Realistic proportions
- Automatic calculation

### 2. **Page Size Linked to Cover Dimensions**

**Formula**:
```tsx
pageWidth = coverWidth × 0.93   // 93% of cover width
pageHeight = coverHeight × 0.95  // 95% of cover height
```

Pages are slightly smaller than covers (natural book appearance).

**Benefits**:
- Always proportional
- Scales with book size
- Looks professional

### 3. **Book Opens in the Middle**

**Behavior**:
- Pages before `currentPage` lean left (already read)
- Pages at/after `currentPage` lean right (unread)
- Current page stands upright in center

**Visual Effect**:
```
LEFT STACK          CENTER          RIGHT STACK
(pages 0-14)      (page 15)       (pages 16-29)
      |||            |               |||
     |||             |                |||
    |||              |                 |||
  Back Cover    Current Page      Front Cover
```

### 4. **Infinite Page System**

**How It Works**:
- Total pages: Fixed (e.g., 30 pages)
- Current page: Index 0 to 29
- Flipping forward: `currentPage++` (wraps to 0 at end)
- Flipping backward: `currentPage--` (wraps to 29 at start)

**Magic**: Pages don't physically move between stacks. Instead, their **rotation** changes based on `currentPage`:

```tsx
if (pageIndex < currentPage) {
  // This page is on the LEFT (already read)
  rotation = positive (lean toward back cover)
} else {
  // This page is on the RIGHT (unread)
  rotation = negative (lean toward front cover)
}
```

**Result**: Infinite pages - you can flip forever!

---

## Implementation Details

### Store State

```typescript
interface BookState {
  pageCount: number;      // Total pages (10-100)
  currentPage: number;    // Which page book is open to (0 to pageCount-1)
  dimensions: {
    height: number;       // Cover height
    width: number;        // Cover width
    depth: number;        // Auto-calculated from pageCount
  };
  // ...
}
```

### Actions

```typescript
setPageCount(count: number)
// Updates page count, recalculates spine depth, resets to middle

flipPage(direction: 'forward' | 'backward')
// Changes currentPage, wraps around at boundaries

setCurrentPage(page: number)
// Directly set which page the book is open to
```

### Page Component Logic

```tsx
function Page({ index, totalPages, currentPage, coverWidth, coverHeight }) {
  // 1. Calculate page dimensions from cover
  const pageWidth = coverWidth * 0.93;
  const pageHeight = coverHeight * 0.95;
  
  // 2. Calculate z-position (depth in book)
  const pageThickness = 0.002;
  const totalDepth = totalPages * pageThickness;
  const zOffset = -totalDepth / 2 + index * pageThickness;
  
  // 3. Calculate rotation based on current page
  const isLeftSide = index < currentPage;
  
  if (isLeftSide) {
    // Lean toward back cover
    const distance = currentPage - index;
    rotation = Math.PI * 0.85 * leanFactor;
  } else {
    // Lean toward front cover
    const distance = index - currentPage;
    rotation = -Math.PI * 0.85 * leanFactor;
  }
  
  return <mesh rotation={[0, rotation, 0]} />;
}
```

---

## User Interface

### Leva Controls

**Book Controls Folder**:
- **Total Pages**: 10-100 (affects spine thickness)
- **Current Page**: 0-99 (where book opens)
- **→ Next Page**: Button to flip forward
- **← Previous Page**: Button to flip backward

**Dimensions**:
- **height**: Cover height (pages scale automatically)
- **width**: Cover width (pages scale automatically)
- ~~**depth**~~: Removed (auto-calculated from pageCount)

### Debug Mode

When enabled, shows:
```
Total Pages: 30
Current Page: 15
Spine Depth: 0.060
Left Stack: 15 pages
Right Stack: 15 pages
```

---

## Visual Behavior

### Closed Book (hinges = 0)
```
[Back Cover][PAGES][Front Cover]
     All pages vertical, hidden inside
```

### Open Book (hinges = 1.57)
```
[Back]     [LEFT STACK]  [CENTER]  [RIGHT STACK]     [Front]
          ||||||||||||     |      ||||||||||||
        (pages 0-14)   (page 15) (pages 16-29)
```

### After Flipping Forward (currentPage → 16)
```
[Back]    [LEFT STACK]  [CENTER]  [RIGHT STACK]     [Front]
         |||||||||||||     |      |||||||||||
       (pages 0-15)   (page 16)  (pages 17-29)
```

**Notice**: Left stack got bigger, right stack got smaller, but **total pages unchanged**!

### After 30 Flips (wraps to page 0)
```
[Back]  [LEFT]  [CENTER]  [RIGHT STACK]           [Front]
          |       |       ||||||||||||||||||
      (none)  (page 0)   (pages 1-29)
```

---

## Mathematical Formulas

### Spine Depth from Page Count
```
spineDepth = max(0.2, pageCount × 0.002)
```
- Minimum: 0.2 (even with 10 pages)
- Each page: 2mm
- 50 pages: 0.1 depth

### Page Dimensions from Covers
```
pageWidth = coverWidth × 0.93
pageHeight = coverHeight × 0.95
```

### Page Z-Position
```
totalDepth = pageCount × 0.002
zOffset = -totalDepth/2 + index × 0.002
```
Pages distributed evenly through spine.

### Page Rotation
```
For pages on LEFT (index < currentPage):
  distance = currentPage - index
  leanFactor = min(distance / currentPage, 1)
  rotation = +0.85π × leanFactor

For pages on RIGHT (index >= currentPage):
  distance = index - currentPage
  leanFactor = min(distance / (totalPages - currentPage), 1)
  rotation = -0.85π × leanFactor
```

Pages closer to current page lean less (transitional effect).

---

## Benefits

### 1. Realism
- Thick book = many pages (visual consistency)
- Pages match cover size (natural proportions)
- Opens in middle (like a real book)

### 2. Usability
- Infinite browsing (never run out)
- Smooth transitions (rotation-based)
- Intuitive controls (flip buttons)

### 3. Performance
- Pages don't move (only rotate)
- No geometry recreation
- React handles updates efficiently

### 4. Expandability
- Easy to add page numbers
- Easy to add page content (different for each page index)
- Easy to add bookmarks (jump to specific pages)

---

## Testing

### Test Scenarios

1. **Spine Thickness**
   - Set pageCount to 10 → thin spine
   - Set pageCount to 100 → thick spine
   - Verify spine visually matches page count

2. **Page Sizing**
   - Set cover width to 2 → small pages
   - Set cover width to 5 → large pages
   - Verify pages always fit inside covers

3. **Open in Middle**
   - Set currentPage to 15 (middle of 30)
   - Open covers (hinges to 1.57)
   - Verify 15 pages lean left, 15 lean right

4. **Flip Forward**
   - Click "→ Next Page" multiple times
   - Verify left stack grows
   - Verify right stack shrinks
   - At page 29, next flip wraps to 0

5. **Flip Backward**
   - Click "← Previous Page" multiple times
   - Verify left stack shrinks
   - Verify right stack grows
   - At page 0, previous flip wraps to 29

6. **Infinite Loop**
   - Flip forward 100 times
   - Verify still flipping (wraps around)
   - Verify stacks always add up to pageCount

---

## Future Enhancements

### Phase 1 (Implemented)
- ✅ Spine thickness from page count
- ✅ Page size from cover dimensions
- ✅ Open in middle
- ✅ Infinite page loop
- ✅ Flip controls

### Phase 2 (Future)
- [ ] Page numbers (display on each page)
- [ ] Page content (different text per page)
- [ ] Animated page turn (smooth curl effect)
- [ ] Bookmarks (save favorite pages)
- [ ] Search (jump to specific page)

### Phase 3 (Future)
- [ ] Page thumbnails (preview grid)
- [ ] Table of contents
- [ ] Chapter markers
- [ ] Reading progress bar

---

## Code Files Changed

1. **types/book.ts**
   - Added `currentPage` to BookConfig
   - Added `currentPage`, `totalPages` to PageProps
   - Added `coverWidth`, `coverHeight` to PageProps
   - Added `pageCount` to SpineProps

2. **stores/bookStore.ts**
   - Added `currentPage` state
   - Added `setCurrentPage` action
   - Added `flipPage` action
   - Auto-calculate spine depth from pageCount
   - Wrap currentPage at boundaries

3. **components/Book/Page.tsx**
   - Calculate page dimensions from cover size
   - Calculate z-position from index
   - Calculate rotation based on currentPage
   - Smart lean (pages near current lean less)

4. **components/Book/Spine.tsx**
   - Calculate depth from pageCount
   - Use realistic thickness formula

5. **components/Book/Book.tsx**
   - Pass coverWidth/Height to pages
   - Pass currentPage to pages
   - Display debug info (stacks, current page)

6. **pages/r3f-dev.tsx**
   - Added currentPage slider
   - Added flip forward button
   - Added flip backward button
   - Updated pageCount range (10-100)
   - Removed manual depth control (auto-calculated)

---

## Summary

The book now behaves like a **real, infinite book**:
- Physical properties linked (spine thickness, page size)
- Opens naturally in the middle
- Infinite pages (flip forever, wraps around)
- Realistic visual behavior
- Intuitive controls

This creates an authentic book experience while maintaining the technical flexibility for expansion (page content, numbers, search, etc.).

**Test it**: http://localhost:3000/r3f-dev
- Adjust "Total Pages" slider → spine thickness changes ✨
- Click "→ Next Page" → pages flip forward ✨
- Click "← Previous Page" → pages flip backward ✨
- Never runs out of pages! ✨

