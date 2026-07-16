---
description: Vibe-code Vue.js POS screens สำหรับ Imin Swift 2 (480 × 1067 dp) ต่อจาก POS V2 ที่มีอยู่ โดยใช้ design tokens และ layout conventions ที่ตั้งไว้
argument-hint: [ชื่อ screen หรือ feature ที่จะสร้าง]
---

# /swift2-screen — เพิ่ม screen ใหม่สำหรับ Imin Swift 2

อ่าน `$ARGUMENTS` เพื่อรู้ว่าจะสร้าง screen หรือ feature อะไร ถ้าไม่มีให้ถามผู้ใช้

---

## โครงสร้างไฟล์ที่มีอยู่

```
POS_V2/src/
├── App.vue       ← monolith — router + ทุก screen อยู่ในนี้
├── main.js
└── style.css     ← global styles + design tokens (section ล่างสุด)
```

App.vue ใช้ `v-else-if="appScreen === 'xxx'"` เป็น router ทุก screen inline

---

## เพิ่ม screen ใหม่อย่างไร

### 1. เพิ่ม block ใน App.vue

ค้นหา comment `<!-- ===================== -->` ที่ใกล้เคียงกับ feature แล้วต่อท้าย:

```html
<!-- ===================== MY-SCREEN ===================== -->
<div v-else-if="appScreen === 'my-screen'" class="u-page">
  <div class="u-appbar">
    <button class="u-btn u-btn--ghost" @click="appScreen = 'feature'">
      <i class="fa fa-arrow-left"></i>
    </button>
    <span class="u-t-title">ชื่อหน้า</span>
  </div>
  <div class="u-scroll">
    <!-- content -->
  </div>
</div>
```

### 2. เพิ่ม nav-item ใน sidebar (ถ้าต้องการ)

ค้นหา `<template v-else-if="appScreen === 'xxx'">` ใน `<nav class="sidebar-nav">` แล้วเพิ่มตาม pattern เดิม:

```html
<template v-else-if="appScreen === 'my-screen'">
  <div class="nav-item active">
    <i class="fa fa-icon-name"></i><span>ชื่อเมนู</span>
  </div>
</template>
```

### 3. เพิ่ม feature card (ถ้าต้องการให้เข้าจาก Feature Select)

ค้นหา `.feature-grid` แล้วเพิ่ม card:

```html
<div class="feature-card" @click="appScreen = 'my-screen'">
  <div class="feature-card-icon fi-blue"><i class="fa fa-icon"></i></div>
  <div>
    <div class="feature-card-name">ชื่อ</div>
    <div class="feature-card-sub">Subtitle</div>
  </div>
</div>
```

---

## Design Tokens (ใช้กับ screen ใหม่)

ตัวแปร CSS อยู่ใน `style.css` ส่วนท้าย section `DESIGN TOKENS`:

```css
/* Colors */
--c-primary, --c-success, --c-warning, --c-error
--c-surface, --c-surface-2, --c-on-surface, --c-secondary, --c-border

/* Spacing */
--px (16px)       /* horizontal padding */
--gap-item (12px) /* gap ระหว่างรายการ */
--gap-section (20px)
--h-appbar (56px), --h-bottombar (56px)
--touch-min (48px)

/* Shape */
--r-card (8px), --r-btn (10px), --r-modal (20px)
```

---

## Utility Classes ที่มีพร้อมใช้ (prefix `u-`)

### Layout shells

```html
<div class="u-page">           <!-- root ของ screen -->
  <div class="u-appbar"> ... </div>
  <div class="u-scroll"> ... </div>   <!-- scrollable content -->
  <div class="u-bottombar"> ... </div>
</div>
```

### Card

```html
<div class="u-card">...</div>
<div class="u-card u-card--tap">...</div>       <!-- hover effect -->
<div class="u-card u-card--active">...</div>    <!-- selected state -->
```

### List row

```html
<div class="u-row">
  <i class="fa fa-xxx"></i>
  <span class="u-t-body">ข้อความ</span>
  <span class="u-t-caption" style="margin-left:auto">meta</span>
</div>
```

### Buttons

```html
<button class="u-btn u-btn--primary">บันทึก</button>
<button class="u-btn u-btn--success">ยืนยัน</button>
<button class="u-btn u-btn--danger">ลบ</button>
<button class="u-btn u-btn--outline">ยกเลิก</button>
<button class="u-btn u-btn--ghost">ย้อนกลับ</button>
<button class="u-btn u-btn--primary u-btn--full">ปุ่มเต็มความกว้าง</button>
```

### Badge

```html
<span class="u-badge u-badge--primary">รอดำเนินการ</span>
<span class="u-badge u-badge--success">สำเร็จ</span>
<span class="u-badge u-badge--warning">รอชำระ</span>
<span class="u-badge u-badge--error">ยกเลิก</span>
<span class="u-badge u-badge--neutral">ทั้งหมด</span>
```

### Typography

```html
<h1 class="u-t-title">หัวข้อหน้า</h1>
<h2 class="u-t-section">หัวข้อส่วน</h2>
<p class="u-t-body">เนื้อหาทั่วไป</p>
<span class="u-t-caption">ข้อความเล็ก / meta</span>
<span class="u-t-price">฿1,234.00</span>
<span class="u-t-label">LABEL</span>
```

---

## Class เดิมที่ใช้ซ้ำได้

ก่อนเขียน CSS ใหม่ ตรวจสอบ class เหล่านี้ที่มีอยู่แล้วใน `style.css`:

| Class | ใช้ทำอะไร |
|---|---|
| `.modal-overlay` / `.modal-box` | modal backdrop + container |
| `.modal-box.sm/md/lg` | ขนาด modal (600/800/980px) |
| `.modal-inner` | padding ภายใน modal |
| `.numpad-grid` / `.numpad-btn` | numpad 3×4 |
| `.toast-wrap` / `.toast-item` | toast notification |
| `.pos-sidebar` / `.nav-item` | sidebar + nav row |
| `.feature-card` | card ใน feature select |
| `.fullscreen-layout` | layout สำหรับ screen ที่ไม่มี right panel |

---

## Target Device

| Property | Value |
|---|---|
| Device | Imin Swift 2 |
| Android API | 33 |
| Resolution (dp) | **480 × 1067** |
| Resolution (px) | 720 × 1600 |
| Density | 240 dpi (1 dp = 1.5 px) |
| Orientation | Portrait only |

**Canvas ที่ใช้งานได้:** 480 − (16×2) = **448 dp** กว้าง

**ทดสอบใน Chrome DevTools:** Dimensions → กำหนด 480 × 1067

### Layout Grid

```
┌──────────────────────────────┐  480 dp
│ status bar          24 dp   │
├──────────────────────────────┤
│ app bar (u-appbar)  56 dp   │
├──────────────────────────────┤
│                              │
│  u-scroll                    │  padding: 0 16px
│  (usable 448 dp wide)        │
│                              │
├──────────────────────────────┤
│ bottom bar (u-bottombar) 56dp│  optional
└──────────────────────────────┘
```

### Thumb Zone (portrait, single hand)

| Zone | y range | ใส่อะไร |
|---|---|---|
| Primary (easy) | > 640 dp | ปุ่มหลัก, Confirm, Pay |
| Secondary | 320–640 dp | รายการ, card |
| Danger (hard) | < 320 dp | title, nav icon เท่านั้น |

---

## Touch Target Rules

ทุก interactive element ต้อง **≥ 48px สูง** — class `u-btn` และ `u-row` ปฏิบัติตามนี้อยู่แล้ว

สำหรับ element ที่ custom เอง:

```css
.my-custom-btn { min-height: var(--touch-min); }
```

---

## Checklist ก่อนรายงานว่าเสร็จ

- [ ] Screen block อยู่ใน `App.vue` ต่อจาก block เดิม ไม่สร้างไฟล์ใหม่ *
- [ ] ใช้ CSS tokens (`--c-xxx`, `--px` ฯลฯ) แทนการ hardcode hex/px
- [ ] ไม่มี element กว้างเกิน 448 dp (480 − 2×16 padding)
- [ ] ทุกปุ่มและ row มี `min-height: var(--touch-min)` (หรือใช้ `u-btn` / `u-row`)
- [ ] ปุ่มหลักอยู่ใน Primary Zone (y > 640 dp) — ใช้ `u-bottombar` หรือ sticky bottom
- [ ] ไม่ใช้ CSS Grid — ใช้ flexbox แทน
- [ ] ไม่ใช้ `position: fixed` — ใช้ `u-page` + `u-bottombar` pattern
- [ ] ทดสอบที่ **480 × 1067** ใน Chrome DevTools

\* ยกเว้นเมื่อ markup block ยาวกว่า ~80 บรรทัด — ในกรณีนั้นให้สร้าง `src/screens/MyScreen.vue` แล้ว `<component :is>` ใน App.vue

---

## Spacing Cheatsheet

```html
<!-- Column gap -->
<div style="display:flex; flex-direction:column; gap:var(--gap-item)">

<!-- Row gap -->
<div style="display:flex; align-items:center; gap:8px">

<!-- Section padding -->
<div style="padding:var(--gap-section) var(--px)">
```

---

**Feature / screen ที่จะสร้าง:** $ARGUMENTS
