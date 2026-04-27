# CLAUDE.md — Project Conventions for POS V2

> เอกสารนี้คือ single source of truth สำหรับ AI agents และ contributors ที่ทำงานกับ POS V2
> ครอบคลุม tech stack, โครงสร้างโปรเจกต์, domain rules, code conventions, และ document conventions

---

## 0. Tech Stack

| Layer | Technology | Version |
|---|---|---|
| UI Framework | Vue 3 (Options API) | ^3.4 |
| Build Tool | Vite | ^5.0 |
| CSS | Tailwind CSS | ^3.4 |
| Icons | Font Awesome Free | ^6.5 |
| Language | Vanilla JS (ES Modules) + single-file Vue SFC | — |
| Runtime | Browser-only (no SSR) | — |

---

## 0a. Project Structure

```
POS_V2/
├── app.js                  ← logic หลัก (cart, promo, payment) — vanilla JS
├── index.html              ← entry HTML
├── style.css               ← global styles
├── src/
│   ├── main.js             ← Vue mount point
│   ├── App.vue             ← root Vue component
│   └── style.css           ← Vue-scoped styles
├── dist/                   ← build output (อย่า commit)
├── docs/
│   ├── PROMOTION_POS_DESIGN.md     ← UX/UI spec + business logic
│   ├── PARALLELIZATION_MATRIX.md   ← cross-reference 8 เลเยอร์
│   └── promotion_wireframe.html    ← interactive wireframe
└── CLAUDE.md (this file)
```

**กฎสำคัญ:** `app.js` คือ source of truth สำหรับ business logic — แก้ logic ที่นี่เท่านั้น ไม่ใช่ใน App.vue

---

## 0b. Dev Commands

```bash
npm run dev      # start dev server → http://localhost:5173 (หรือ 5174 ถ้า port ชน)
npm run build    # production build → dist/
npm run preview  # preview build output locally
```

---

## 0c. POS Domain Rules

### PromoEngine Contract

- `PromoEngine.evaluate(bill)` — คำนวณโปร ทั้งหมดสำหรับบิล → คืน `{ promoLines[], savings, conflicts[] }`
- `promoEngine.onItemAdded(item)` — trigger เมื่อเพิ่มสินค้าเข้า cart
- `promoEngine.finalize()` — lock โปรก่อนเปิด payment (เรียกใน `openPayment()`)
- `applyPromoChoice(promoId, target)` — apply โปรที่ user เลือก (แทน `applyPromo()` เดิม)

### Cart State Invariants

- `cart[]` item ต้องมี field: `id`, `name`, `price`, `qty`, `promoId?`, `promoLabel?`, `lockQty?`
- `totals` ต้อง reactive และ recompute ทุกครั้งที่ cart เปลี่ยน
- `savings` ต้องแสดงเสมอ (ถ้า 0 ให้ hidden แต่ยังคำนวณอยู่)
- free item ต้อง retract อัตโนมัติถ้า parent item ถูกลบ

### Priority Order (สำคัญมาก)

```
P1 Custom Discount (staff PIN)
P2 Bundle/Combo, Time-based (Happy Hour)
P3 BOGO, ANY_FREE, Free Gift
P4 %off Item, ฿off Item, Step Discount
P5 Coupon Code
P6 Member-Tier
```

โปรลำดับสูงกว่าคำนวณก่อน — ห้ามเปลี่ยน order นี้โดยไม่ผ่าน design review

### High-Risk Business Logic (ต้องผ่าน explicit approval)

- การแก้ `totals()` computed — กระทบทุก promo และ payment
- การแก้ priority order
- Custom Discount เกิน 20% (ต้องมี PIN)
- การ retract โปรที่ apply ไปแล้ว

---

## 0d. Code Conventions

### Vue (Options API)

- ใช้ **Options API** เท่านั้น (ไม่ใช่ Composition API) เพื่อ consistency กับ codebase เดิม
- `data()` → reactive state, `computed` → derived values, `methods` → actions
- Component ชื่อ **PascalCase** ทั้งไฟล์และ template tag

### JavaScript (app.js)

- method naming: **camelCase** + กริยานำหน้า (`addToCart`, `removeItem`, `applyPromoChoice`)
- event handler: `handle` + noun (`handleProduct`, `handleCouponInput`)
- boolean: `is` / `has` นำหน้า (`isLoading`, `hasPromo`)
- ห้ามใช้ `var` — ใช้ `const` / `let` เท่านั้น

### Tailwind

- ลำดับ class: layout → spacing → color → text → border → interaction
- ใช้ color token ตาม §5 (green=auto, blue=primary, amber=available, purple=coupon, red=warn, emerald=savings)
- ห้าม hardcode hex color ใน class

---

## 1. Document Hierarchy

```
docs/
├── PROMOTION_POS_DESIGN.md         ← หลัก: UX/UI spec + logic
├── PARALLELIZATION_MATRIX.md       ← หลัก: cross-reference ทุกมิติ (ต้องมี)
├── promotion_wireframe.html        ← interactive wireframe
└── CLAUDE.md (this file)           ← conventions
```

## 2. Parallelization Matrix — รูปแบบที่ต้องใช้

เอกสาร Parallelization Matrix ต้องครอบคลุม **8 เลเยอร์** ต่อไปนี้เสมอ:

| # | Layer | Purpose | Format |
|---|---|---|---|
| L1 | Master Feature Matrix | Feature × Concern (what × how) | Grid ✓/✕/◐ |
| L2 | Type × Dimension Matrix | Promo type × พฤติกรรมทุกมิติ | Dense table |
| L3 | Component DAG | Depend-on graph + parallel groups | Graph + tier table |
| L4 | Dev Workstream Matrix | Agent/Squad × Sprint × Task | Gantt-like |
| L5 | Test Parallelization | Test type × Target × Parallelism | Matrix + criteria |
| L6 | Failure Mode Matrix | Fault × Impact × Mitigation | FMEA-style |
| L7 | RACI | Role × Deliverable | RACI table |
| L8 | Data × Event Matrix | State × Trigger × Side effect | State machine + matrix |

## 3. Matrix Notation

- `✓` = รองรับ/เข้ากันได้/ทำงานเต็มที่
- `✕` = ห้าม/ไม่รองรับ/ชนกัน (ต้องตัดสินใจ)
- `◐` = configurable (admin override ได้)
- `—` = N/A
- `P1..P6` = priority (P1 = สูงสุด)
- `T0..T4` = tier ใน DAG (T0 = leaf / ไม่พึ่งใคร)
- `R/A/C/I` = Responsible / Accountable / Consulted / Informed

## 4. Parallelism Rules

1. **Independent by default** — assume คู่ใด ๆ ทำ parallel ได้ ถ้าไม่ระบุ dependency
2. **Explicit edges** — ถ้าจำเป็นต้อง serialize → วาดเส้นใน DAG พร้อมเหตุผล
3. **Critical Path** — ต้องระบุ path ที่ยาวที่สุด + คนที่เป็น bottleneck
4. **Parallel tier** — node ใน tier เดียวกันต้อง parallelizable 100%
5. **Merge points** — ระบุทุก sync point (integration test, preview, release)

## 5. Naming

### Promotion (Data)
- Promo IDs: `p-<kind>-<slug>` → `p-bogo-matcha`, `p-cp-welcome10`
- Stack Groups: `item | bill | bundle | coupon | member | staff | gift | bill-time`
- Priority labels: P1 (staff) → P6 (member-tier)

### UI Colors (Tailwind token)
| Token | Tailwind class prefix | ใช้กับ |
|---|---|---|
| green | `bg-green-*` / `text-green-*` | auto-applied promo |
| blue | `bg-blue-*` | primary action |
| amber | `bg-amber-*` | available/opt-in promo |
| purple | `bg-purple-*` | coupon |
| red | `bg-red-*` | warning / error |
| emerald | `bg-emerald-*` | savings total |

### Vue Components
- `PromotionPanel` — panel หลักใน cart footer (3 sections: applied, available, coupon)
- `CouponInput` — input + validate coupon code
- `PromoBadge` — badge แสดงบน cart item
- `ProgressHint` — "อีก ฿X ได้โปร" hint
- `ConflictDialog` — modal เลือกเมื่อโปรชนกัน

### CSS / HTML IDs
- section IDs: `kebab-case` → `promo-panel`, `coupon-input`, `conflict-dialog`
- JS hook attributes: `data-action="<verb>"` → ไม่ใช้ `id` สำหรับ JS selectors

## 6. Definition of Done

### 6a. Code Feature
feature/bug fix ถือว่า done เมื่อ:
- [ ] logic ถูกต้องตาม PROMOTION_POS_DESIGN.md
- [ ] `totals()` recompute ถูกต้อง (ทดสอบด้วย edge case: cart ว่าง, ลบ parent ของ free item)
- [ ] ไม่มี regression บน custom discount flow และ payment flow
- [ ] Tailwind class ใช้ token ถูกต้อง (ไม่มี hardcode สี)
- [ ] ไม่มี `console.error` / `console.warn` ขึ้นใน browser DevTools

### 6b. Parallelization Matrix (เอกสาร)
เอกสารจะถือว่าเสร็จสมบูรณ์ก็ต่อเมื่อ:
- [ ] ครบ 8 เลเยอร์
- [ ] ทุก promo type ปรากฏใน L2 ครบ 11 rows
- [ ] L3 มี critical path ระบุชัด
- [ ] L4 รวม effort estimate (hr หรือ sprint-point)
- [ ] L5 แยก unit / integration / e2e / load
- [ ] L6 คลุม top 10 failure modes
- [ ] L7 มี owner ทุก deliverable
- [ ] L8 ลิสต์ทุก event ที่ trigger engine.evaluate()
