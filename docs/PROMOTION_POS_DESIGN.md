# POS V2 — Promotion Integration Design Spec
**Project:** The Coffee House — POS D4-504
**Author:** Senior POS UX Designer & System Analyst
**Version:** 1.0 (2026-04-24)
**Scope:** ผนวกระบบ Promotion เข้ากับ POS V2 เดิม โดยคงโครง UX หลักไว้ เปลี่ยนเฉพาะส่วนที่เกี่ยวกับโปรโมชัน

---

## 0. Quick Reference — Parallelization Matrix (สรุปทั้งระบบในตารางเดียว)

ตารางนี้คือ "แผนที่" ของทั้งเอกสาร — อ่านแถวเดียวก็รู้ว่า promo แต่ละชนิดทำงานต่างกันอย่างไรในทุกมิติ

| Promo Type | Apply Mode | Trigger | Display (Cart) | Display (Summary) | Priority | Stackable? | Conflict Policy | Edge Case |
|---|---|---|---|---|---|---|---|---|
| **BOGO** (ซื้อ1แถม1) | Auto | สินค้าเข้าตะกร้า | เพิ่ม line ใหม่ `(ฟรี)` + badge เขียว | รวมใน `ส่วนลดโปรโมชัน` | P3 | ✕ กับ %off สินค้านั้น | เลือก 1 ได้ ← ถาม user | สินค้าเดิม qty≥2 เท่านั้น |
| **ANY_FREE** (ซื้อA แถมฟรี B อะไรก็ได้) | Manual → auto ต่อ | สินค้าเข้าตะกร้า | เปิด picker → line `(ฟรี)` | รวมใน `ส่วนลดโปรโมชัน` | P3 | ✕ กับ BOGO ตัวเดียวกัน | pick one | ถ้า user ยกเลิกต้นทาง free item ต้องหาย |
| **%off Item** | Auto/Opt-in | สินค้าเข้าตะกร้า | price ตกคร่อม (฿80→฿72) + tag -10% | รวมใน `ส่วนลดโปรโมชัน` | P4 | ✓ กับ bill-level | ชน BOGO → best deal | คิดก่อน VAT/SC |
| **฿off Item** | Auto/Opt-in | สินค้าเข้าตะกร้า | ฿80 → ฿70 + tag -฿10 | รวมใน `ส่วนลดโปรโมชัน` | P4 | ✓ กับ bill-level | ชน %off → best deal | ห้าม < 0 |
| **Bundle/Combo** (Buy 2 Pay ฿X) | Auto | เข้าเงื่อนไขครบ | group 2 lines + เส้นคั่น + badge bundle | รวมใน `ส่วนลดโปรโมชัน` | P2 | ✕ กับ BOGO ของสินค้าเดียวกัน | dissolve ถ้า qty เปลี่ยน | ถ้า qty ไม่ครบ → แจ้ง "เพิ่ม 1 ชิ้นรับส่วนลด ฿X" |
| **Coupon Code** | Manual | User ใส่ code | แสดงใน Promotion Panel + tag ม่วง | บรรทัดแยก `คูปอง [CODE]` | P5 | ✓ กับทุกอย่าง (config ได้) | reject ถ้าไม่ตรงเงื่อนไข | 1 ใบ/บิล default |
| **Member-Tier** | Auto | Bill มี member | % ของ subtotal หลังหักโปร | บรรทัดแยก `ส่วนลดสมาชิก (Gold)` | P6 | ✓ | — | ไม่มี member → hidden |
| **Time-based** (Happy Hour) | Auto | เวลาตรงช่วง | badge นาฬิกา + countdown | รวมใน `ส่วนลดโปรโมชัน` | P2 | ✓ | — | แสดง countdown 15 นาทีก่อนหมด |
| **Free Gift** (ซื้อครบ ฿X แถม Y) | Auto | Subtotal ≥ threshold | line `🎁 ของแถม` + badge | รวมใน `ส่วนลดโปรโมชัน` | P3 | ✓ | — | retract ถ้าลดต่ำกว่า threshold |
| **Step Discount** (ซื้อครบ ฿X ลด Y%) | Auto | Subtotal ≥ threshold | — | บรรทัดแยก `ซื้อครบ ลด Y%` | P4 | ✓ | — | แสดง progress bar "อีก ฿50 ลด 10%" |
| **Custom Discount** (พนักงานกด) | Manual | พนักงานกด | — | บรรทัดแยก `ส่วนลดพิเศษ` | P1 (สูงสุด) | ✓ | — | ต้องมีเหตุผล + PIN อนุมัติเกิน 20% |

> **Priority scale:** P1=สูงสุด (override ทุกอย่าง) → P6=ต่ำสุด (คิดหลังสุด)
> **คอลัมน์ที่เป็น ✓/✕** = stackable กับ promo อื่น (default behavior; admin ปรับได้)

---

## 1. บทสรุปผู้บริหาร (Executive Summary)

### 1.1 ปัญหาปัจจุบัน
จากการ audit โค้ด `app.js` ระบบเดิมรองรับ promo ได้เพียง **2 ประเภท** (`ANY_FREE`, `BOGO`) และยัง **ไม่มี**:

- Auto-applied promotion ที่เช็คทั้งบิล (bundle, threshold, happy hour)
- Coupon code input
- Stacking/conflict logic เมื่อโปรชนกัน
- Best-deal suggestion
- Visual feedback เมื่อ "อีกนิดเดียวได้โปร"
- Promo panel ที่ดูได้ทุก promo ที่ active พร้อมสถานะ

### 1.2 หลักการออกแบบ (Design Principles)
1. **Non-disruptive** — 3-col layout เดิม (88 / flex / 400) คงไว้ 100%; promotion panel ฝังใน cart footer ไม่แย่งพื้นที่เลือกสินค้า
2. **Zero-click auto** — promo ที่ชัดเจน (member, happy hour, threshold) ทำงานอัตโนมัติ ไม่ต้องกด
3. **One-click opt-in** — promo ที่ต้องเลือก (BOGO, ANY_FREE, coupon) ต้องจบใน 1 แตะ
4. **Always show savings** — ทุก state ต้องเห็นว่าลูกค้า "ประหยัดไปเท่าไหร่" (anchoring)
5. **Conflict = user choice** — ระบบแนะนำ best deal แต่ให้พนักงานกดยืนยัน (ตาม requirement ของลูกค้า)
6. **Low interaction cost** — ≤2 แตะสำหรับโปรทุกชนิด, ≤5 วินาทีในการปิดบิล

### 1.3 สิ่งที่เพิ่ม vs ของเดิม

| ของเดิม | คงไว้ | ขยาย | เพิ่มใหม่ |
|---|---|---|---|
| 3-col layout | ✓ | — | — |
| Cart item structure | ✓ | เพิ่ม `promoId`, `promoLabel`, `lockQty` | — |
| `totals` computed | — | เพิ่ม `promoLines[]`, `savings` | — |
| `promo-choice` modal | ✓ | เพิ่ม "Best deal" highlight | — |
| Cart footer | — | — | **PromotionPanel** (3 sections) |
| `customDiscount` | ✓ | — | — |
| — | — | — | **CouponInput**, **PromoBadge**, **ProgressHint**, **ConflictDialog** |

---

## 2. วิเคราะห์ระบบเดิม (Baseline Audit)

### 2.1 Integration Points (จุดที่ต้องแก้)

ไฟล์ `app.js` จุดที่ต้องขยาย:

| Line ref | Method | การแก้ |
|---|---|---|
| L10-34 | `products[]` | เพิ่ม field `autoPromos: PromoRef[]` (สำหรับ %off/฿off ระดับสินค้า) |
| L35-39 | `promoItems[]` | เปลี่ยนจาก display-only เป็น data source จริงพร้อม `type`, `conditions`, `priority` |
| L104-122 | `totals()` computed | refactor → ใช้ `PromoEngine.evaluate(bill)` |
| L163-168 | `addToCart()` | เพิ่ม trigger `promoEngine.onItemAdded()` |
| L176-179 | `handleProduct()` | ยังคง logic opt-in modal เดิม (เพิ่ม best-deal indicator) |
| L189-200 | `applyPromo()` | refactor เป็น `applyPromoChoice(promoId, target)` |
| L290-297 | `openPayment()` | ก่อนเปิด payment → `promoEngine.finalize()` (lock promos) |

### 2.2 ของดีในระบบเดิม (Keep)
- การใช้ `cartId: Date.now()` แยก instance สินค้าที่ซ้ำ — ใช้ต่อได้
- Modal pattern (`modalType` + `buildModalBody`) — ใช้ต่อสำหรับ promo-choice
- Toast system — ใช้ announce promo events (`ใช้โปร: Buy 2 Pay ฿90 ✨`)
- Badge `badge-pro` สีเขียว + `.ci.free` highlight เส้นซ้าย — pattern ที่ดี ขยายต่อเป็น `.ci.bundled`, `.ci.discounted`

---

## 3. Promotion Data Model

### 3.1 Promo Schema (ของใหม่ — ใช้แทน `promoItems` เดิม)

```js
// promotion.model.js
const PromoType = {
  BOGO: 'BOGO',                  // ซื้อ A แถม A (รายการเดียวกัน)
  ANY_FREE: 'ANY_FREE',          // ซื้อ A แถมอะไรก็ได้
  PERCENT_ITEM: 'PERCENT_ITEM',  // ลด % ที่สินค้า
  AMOUNT_ITEM: 'AMOUNT_ITEM',    // ลด ฿ ที่สินค้า
  BUNDLE: 'BUNDLE',              // Buy X+Y Pay ฿Z
  COUPON: 'COUPON',              // โค้ดส่วนลด
  MEMBER_TIER: 'MEMBER_TIER',    // ส่วนลดระดับสมาชิก
  TIME_BASED: 'TIME_BASED',      // Happy Hour / วันเกิด
  FREE_GIFT: 'FREE_GIFT',        // ซื้อครบ ฿X แถม Y
  STEP_DISCOUNT: 'STEP_DISCOUNT',// ซื้อครบ ฿X ลด Y%
  CUSTOM: 'CUSTOM',              // พนักงานกดส่วนลดเอง
};

const PromoShape = {
  id: 'string',
  code: 'string|null',            // สำหรับ COUPON
  type: 'PromoType',
  title: 'string',                // "Buy 2 Pay ฿90"
  desc: 'string',
  priority: 1,                    // 1=สูง 6=ต่ำ
  applyMode: 'auto|opt-in|manual',
  stackGroup: 'item|bill|member|coupon',  // โปรใน group เดียวกันห้าม stack (default)
  stackableWith: ['groupId'],     // whitelist override
  conditions: {
    products: ['sku...'] | 'any',
    minQty: 0,
    minAmount: 0,
    memberTier: ['Gold'|'Silver'|'Platinum'] | null,
    timeRange: { start:'14:00', end:'17:00', days:[0,1,2,3,4,5,6] },
    validFrom: 'ISO',
    validTo: 'ISO',
  },
  reward: {
    kind: 'free_item'|'percent'|'amount'|'fixed_total'|'free_any',
    value: number,                // 10 สำหรับ 10%, 90 สำหรับ Pay ฿90
    target: 'same'|'cheapest'|'any'|'pickable',
    maxPerBill: 1,
  },
  badge: { color:'red|green|blue|purple', icon:'fa-xxx' },
};
```

### 3.2 ตัวอย่างข้อมูล (Sample Fixtures)

```js
const promotions = [
  // 1. BOGO (เดิม)
  { id:'p-bogo-matcha', type:'BOGO', title:'ซื้อ 1 แถม 1 — Matcha Latte',
    priority:3, applyMode:'auto', stackGroup:'item',
    conditions:{ products:['TE001'], minQty:2 },
    reward:{ kind:'free_item', target:'same', maxPerBill:10 } },

  // 2. Bundle (ใหม่)
  { id:'p-bundle-honey-ame', type:'BUNDLE', title:'Buy 2 Pay ฿90',
    desc:'น้ำผึ้งมะนาว + อเมริกาโน่ = ฿90', priority:2, applyMode:'auto',
    stackGroup:'bundle',
    conditions:{ products:['CF001','SP005'], minQty:2 },
    reward:{ kind:'fixed_total', value:90 } },

  // 3. Coupon (ใหม่)
  { id:'p-cp-welcome10', code:'WELCOME10', type:'COUPON', title:'ส่วนลด 10%',
    priority:5, applyMode:'manual', stackGroup:'coupon',
    conditions:{ products:'any', minAmount:100 },
    reward:{ kind:'percent', value:10, target:'bill' } },

  // 4. Happy Hour (ใหม่)
  { id:'p-hh-15', type:'TIME_BASED', title:'Happy Hour ลด 15%',
    priority:2, applyMode:'auto', stackGroup:'bill',
    conditions:{ products:'any', timeRange:{start:'14:00',end:'17:00',days:[1,2,3,4,5]} },
    reward:{ kind:'percent', value:15, target:'bill' } },

  // 5. Free Gift (ใหม่)
  { id:'p-gift-500', type:'FREE_GIFT', title:'ซื้อครบ ฿500 แถม Cookie',
    priority:3, applyMode:'auto', stackGroup:'gift',
    conditions:{ minAmount:500 },
    reward:{ kind:'free_item', target:'fixed', fixedSku:'BK004', maxPerBill:1 } },

  // 6. Step Discount (ใหม่)
  { id:'p-step-300', type:'STEP_DISCOUNT', title:'ซื้อครบ ฿300 ลด 10%',
    priority:4, applyMode:'auto', stackGroup:'bill',
    conditions:{ minAmount:300 },
    reward:{ kind:'percent', value:10, target:'bill' } },
];
```

---

## 4. UI/UX Design — Layout

### 4.1 Overall Layout (คงเดิม 100%)

```
┌─────┬──────────────────────────────────────┬─────────────────────┐
│ 88  │                                      │  400px              │
│     │    Branch / Time / Toggles           │  CART HEADER        │
│  S  │  ──────────────────────────────────  │  ─────────────────  │
│  I  │    Category pills  |  🔍 AI 🔎       │  Search / Tabs      │
│  D  │  ──────────────────────────────────  │  ─────────────────  │
│  E  │                                      │                     │
│  B  │     PRODUCT GRID                     │    CART ITEMS       │
│  A  │     (4 cols)                         │    (w/ promo tags)  │
│  R  │                                      │                     │
│     │  ──────────────────────────────────  │  ─────────────────  │
│     │    PROMO BAR (3 cards — existing)   │  🎁 PROMOTION PANEL │
│     │                                      │     (NEW)           │
│     │                                      │  ─────────────────  │
│     │                                      │    Summary + Pay    │
└─────┴──────────────────────────────────────┴─────────────────────┘
```

### 4.2 สิ่งที่เปลี่ยน (Promotion-related changes only)

**(A) Product Card** — เพิ่ม `PromoBadge`
- มุมบนขวา badge สีตาม promo type
- รอง 2 badges ซ้อน (เช่น "-10%" + "Happy Hour")
- เมื่อ promo ชนกัน → badge มี ring สีทองบอกว่า "เข้าหลายโปร"

**(B) Promo Bar (เดิม)** — เปลี่ยน role
- เดิม: แสดง promo แบบ static (p1, p2, p3) + คลิกดู detail เฉยๆ
- ใหม่: แสดงเฉพาะ promo ที่ active ตอนนี้ (time-based, threshold) + แสดง progress
- ถ้ามี promo ที่เข้าเงื่อนไขแล้วยังไม่ apply → pulse สีแดง

**(C) Cart Item** — เพิ่ม `PromoLineBadge` + `ci.bundled` style
- สินค้าปกติ: เหมือนเดิม
- สินค้าฟรี (`isFree`): เหมือนเดิม (green left border + "PRO" badge)
- สินค้าที่โดน %off: ราคาขีดคร่อม + tag "-10%" สีแดง
- สินค้าที่อยู่ใน bundle: จัดกลุ่ม 2 lines + เส้นประคั่น + badge "Bundle"

**(D) Cart Footer** — แทรก `PromotionPanel` ก่อน summary
- Collapsible (default: open ถ้ามี promo apply อยู่)
- 3 sections: Auto / Available / Manual

**(E) Summary (ในบิลและ payment)** — แตก promo breakdown
- เดิม: บรรทัดเดียว "ส่วนลด -฿XX"
- ใหม่: แตกย่อย
  - `ส่วนลดโปรโมชัน  -฿50`   (รวม auto promos)
  - `คูปอง [WELCOME10] -฿30`
  - `ส่วนลดสมาชิก (Gold)  -฿20`
  - `ส่วนลดพิเศษ  -฿10`

---

## 5. Promotion Panel Design (หัวใจของงาน)

### 5.1 Location: Cart footer — เหนือ `summary-row`s

```
╭──────────────────────────────────────╮
│  🎁 โปรโมชัน                    ⯆   │  ← header (collapsible)
│  ──────────────────────────────────  │
│  ✨ AUTO — 2 โปรใช้งาน (-฿120)       │  ← section A
│  ┌─────────────────────────────────┐ │
│  │ 🏷 Buy 2 Pay ฿90   -฿50   ✕   │ │
│  │ 🕐 Happy Hour 15%  -฿70   ✕   │ │
│  └─────────────────────────────────┘ │
│  ──────────────────────────────────  │
│  💡 น่าใช้ — 1 โปรเข้าเงื่อนไขแล้ว    │  ← section B
│  ┌─────────────────────────────────┐ │
│  │ 🎁 ซื้อครบ ฿500 แถม Cookie      │ │
│  │    [ ใช้โปรนี้ ]                 │ │
│  └─────────────────────────────────┘ │
│  📊 อีก ฿85 ได้ลด 10%  ▓▓▓▓░░░░     │  ← progress hint
│  ──────────────────────────────────  │
│  🎟 ใส่โค้ด / ส่วนลดพิเศษ           │  ← section C
│  ┌──────────────────┐ ┌───────────┐  │
│  │ โค้ด...          │ │  ใช้โค้ด  │  │
│  └──────────────────┘ └───────────┘  │
│  [ส่วนลดพิเศษ] [สมาชิก] [สิทธิ์]     │  ← quick actions
╰──────────────────────────────────────╯
```

### 5.2 Section A — Auto Applied

- Background: `#f0fdf4` (green-50) — สื่อว่า "ดีแล้ว ไม่ต้องทำอะไร"
- แต่ละ row: icon + title + ยอดลด + ปุ่มกากบาท (X) เพื่อ "สละสิทธิ์" (rare action)
- กดกากบาท → confirm dialog "ยืนยันไม่ใช้โปรนี้?" (ป้องกันพลาด)
- Header แสดงจำนวนโปร + รวมประหยัด

**Edge cases:**
- ไม่มี auto promo → ซ่อน section ทั้งก้อน (ลด noise)
- มี > 3 โปร → แสดง 3 ตัวแรก + "ดูทั้งหมด ({n})"

### 5.3 Section B — Available (เข้าเงื่อนไขแล้ว แต่ยังไม่ apply)

- Background: `#fefce8` (yellow-50) — สื่อว่า "มีโอกาสดี รอจับ"
- แต่ละ row: icon + title + ปุ่ม **"ใช้โปรนี้"** สีน้ำเงิน (primary)
- ถ้ากดใช้ แล้วชนกับ auto ที่มีอยู่ → เปิด `ConflictDialog` (หัวข้อ 6.4)
- **Progress hint** (ถ้ามี threshold-based ที่ยังไม่ครบ):
  - "อีก ฿85 ได้ลด 10%" + progress bar
  - กดที่ hint → แนะนำ product "เพิ่ม 1 Croissant (฿65) ได้ลด"

**Edge cases:**
- ไม่มี available → ซ่อน section ทั้งก้อน (ยกเว้น progress hint)
- Promo หมดเวลาในขณะใช้ → toast "โปรหมดเวลา 3 นาทีที่แล้ว" + auto-remove

### 5.4 Section C — Manual Input

- Background: `#fff` (neutral)
- **Coupon input:** text field + ปุ่ม "ใช้โค้ด"
  - กด Enter = กดปุ่ม (low interaction cost)
  - โค้ดผิด → shake animation + toast "ไม่พบโค้ด / หมดอายุ / ไม่ตรงเงื่อนไข"
  - โค้ดถูก → ย้าย badge ขึ้น Section A พร้อม animation
- **Quick actions:** ปุ่มแนว (4 ปุ่ม)
  - `ส่วนลดพิเศษ` (Custom discount — เดิม `openDiscount()`)
  - `สมาชิก` (เดิม `openMember()`)
  - `สิทธิ์พนักงาน` (เดิม privileges)
  - `ล้างโปรทั้งหมด` (reset)

### 5.5 Empty state

เมื่อยังไม่มีสินค้าในตะกร้า → Panel collapse เหลือแค่ header
```
🎁 โปรโมชัน —  เพิ่มสินค้าเพื่อดูโปร ⯆
```

### 5.6 Scroll behavior

- Panel เป็นส่วนหนึ่งของ `cart-footer` (ซึ่งมี `max-height:45vh; overflow-y:auto`)
- ถ้า panel ยาว → scroll ภายใน panel (ไม่ดัน summary ตก)

---

## 6. Interaction Design (Flow-by-flow)

### 6.1 Flow — เพิ่มสินค้า (เดิม+)

```
พนักงานกด [Americano]
  ├─ products[0].autoPromos.length > 0 ?
  │    ├─ no  → addToCart() + promoEngine.evaluate()
  │    └─ yes → modal promo-choice (เดิม)
  │              + highlight "Best deal 💎" บน option ที่ลดมากสุด
  │              + ปุ่มด้านล่าง "ข้าม โปร (ไม่รับสิทธิ์)"
  └─ หลัง addToCart:
       promoEngine.evaluate()
         ├─ scan auto promos → apply ที่เข้าเงื่อนไข
         ├─ ตรวจ bundle: ถ้า basket มี A+B ครบ → apply bundle
         ├─ ตรวจ threshold: ถ้า subtotal ≥ min → apply
         └─ trigger `on-available-changed` → panel.sectionB refresh
```

**Toast events:**
- `เพิ่ม Americano` (เดิม)
- `🎁 ใช้โปรอัตโนมัติ: Happy Hour -฿10.50` (ใหม่)
- `💡 อีก ฿85 ได้ลด 10%` (ใหม่ — แสดงครั้งเดียว ไม่กวน)

### 6.2 Flow — เมื่อโปรเข้าเงื่อนไข (เพิ่งครบ)

```
subtotal = 498 → เพิ่ม Cookie ฿45 → subtotal = 543
  promoEngine.evaluate():
    ├─ p-gift-500 เดิม: not-qualified → now qualified ✓
    └─ emit 'promo-qualified' → { id:'p-gift-500', kind:'FREE_GIFT' }

PromotionPanel listens:
  ├─ ถ้า applyMode='auto' → apply ทันที + toast celebration
  │     toast: "🎉 ซื้อครบ ฿500 — แถม Cookie ฟรี!"
  │     cart: push line "🎁 Cookie (ของแถม)" พร้อม bounce animation
  └─ ถ้า applyMode='opt-in' → section B เด้งขึ้น + ปุ่ม "ใช้โปรนี้"
        pulse ring สีเหลือง 3 วินาทีเพื่อดึงสายตา
```

### 6.3 Flow — User เลือกใช้โปร (Manual / opt-in)

```
กดปุ่ม [ ใช้โปรนี้ ] ใน Section B
  ├─ promoEngine.canApply(promoId, currentBill) ?
  │    ├─ ok → move to Section A + animate slide-up
  │    │       + toast "ใช้ [ชื่อโปร] สำเร็จ -฿XX"
  │    └─ conflict → เปิด ConflictDialog (6.4)
  └─ ถ้าเป็น ANY_FREE → เปิด FreeItemPicker (เดิม) ก่อน add line
```

**Coupon code flow:**
```
user พิมพ์ "WELCOME10" → กด Enter หรือ [ใช้โค้ด]
  ├─ call promoEngine.redeemCoupon(code)
  │    ├─ not found → shake + "ไม่พบโค้ด"
  │    ├─ expired → "โค้ดหมดอายุ"
  │    ├─ condition fail → "ยอดขั้นต่ำ ฿100 (ยังขาด ฿25)"
  │    └─ ok → apply + badge เด้งขึ้น Section A
  └─ input clear + focus ยังคงอยู่ (รองรับคูปอง multiple)
```

### 6.4 Flow — เมื่อโปรชนกัน (Conflict) — ตาม requirement: "ต้องมีให้เลือก"

**Trigger:** user กดใช้ promo ที่ stackGroup ซ้ำกับ promo ที่ apply อยู่

```
ConflictDialog เด้งขึ้น (modal size: md)
  ┌─────────────────────────────────────────┐
  │  ⚠️ โปรชนกัน — เลือกใช้โปรใดโปรหนึ่ง    │
  ├─────────────────────────────────────────┤
  │                                         │
  │  [ ใช้อยู่ ]                            │
  │  ╭────────────────────────────────────╮ │
  │  │ ☑ Buy 2 Pay ฿90                    │ │
  │  │   ลด ฿50 · priority: 2             │ │
  │  ╰────────────────────────────────────╯ │
  │                                         │
  │  [ ต้องการใช้ ]                         │
  │  ╭────────────────────────────────────╮ │
  │  │ ☐ BOGO Matcha                      │ │
  │  │   ลด ฿85 · priority: 3  💎 ดีกว่า  │ │
  │  ╰────────────────────────────────────╯ │
  │                                         │
  │  💡 ระบบแนะนำ: "BOGO Matcha"            │
  │     ประหยัดมากกว่า ฿35                  │
  │                                         │
  ├─────────────────────────────────────────┤
  │    [ ยกเลิก ]       [ ยืนยันเลือก ]     │
  └─────────────────────────────────────────┘
```

**Key behaviors:**
- **Best-deal badge** (💎 ดีกว่า) บนตัวเลือกที่ประหยัดมากสุด — คำนวณจาก `savings` ของแต่ละ promo
- ปุ่มยืนยันเริ่มต้น selected = ตัวที่เลือกใหม่ (แต่ user เปลี่ยนได้)
- เลือก = swap promo; ยกเลิก = คง promo เดิม
- ถ้ามี > 2 ตัวชน → radio group + sort by priority then savings

### 6.5 Flow — สินค้าถูกลบ → auto-retract promo

```
กดกากบาทลบ Americano
  ├─ removeItem(cartId)
  └─ promoEngine.evaluate() again
       ├─ ถ้า promo ใดไม่เข้าเงื่อนไขอีก → retract
       │    toast: "⚠️ โปร [ชื่อ] ถูกยกเลิก เนื่องจากสินค้าไม่พอ"
       └─ ถ้า free_item เคย pair กับสินค้าที่ถูกลบ → remove ของแถมด้วย
            toast: "ของแถม [ชื่อ] ถูกลบด้วย"
```

### 6.6 Flow — Qty เปลี่ยน → re-evaluate

```
กด +/- บน cart item
  ├─ qty = 0 → removeItem
  ├─ ถ้า item อยู่ใน bundle/BOGO → check minQty
  │    → dissolve bundle ถ้าไม่ครบ + reimburse free item
  └─ promoEngine.evaluate()
```

---

## 7. Display Specification

### 7.1 Cart — ระดับ Item

**สินค้าปกติ (ไม่มีโปร):**
```
┌─────────────────────────────────────┐
│ Americano                 -  1  +   │
│ ฿70                         ฿70  🗑 │
└─────────────────────────────────────┘
```

**สินค้าที่โดน %off (auto promo):**
```
┌─────────────────────────────────────┐
│ Americano  [-15% Happy Hr]  - 2 +   │
│ ฿̶1̶4̶0̶  ฿119                  ฿119 🗑│  ← ราคาเดิมขีดคร่อม
└─────────────────────────────────────┘
```

**สินค้าฟรีจาก BOGO (เดิม — คงไว้):**
```
┌─────────────────────────────────────┐
│ 🎁 Matcha Latte (ฟรี)  [PRO] -1+ 🔒 │  ← qty lock
│ ฿̶8̶5̶  ฿0                      ฿0     │
└─────────────────────────────────────┘
(green left border — ของเดิม)
```

**สินค้าใน Bundle:**
```
╭──── Buy 2 Pay ฿90 ─────────────────╮
│ Americano               -  1  +     │
│ ฿70                        ฿45  🗑  │
│ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─│
│ Honey Lemon             -  1  +     │
│ ฿70                        ฿45  🗑  │
╰─[Bundle ฿90 — ประหยัด ฿50]─────────╯
```

**Free Gift (threshold-based):**
```
┌─────────────────────────────────────┐
│ 🎁 Cookie (ของแถม ฿500+) [PRO]  🔒  │
│ ฿̶4̶5̶  ฿0                      ฿0     │
└─────────────────────────────────────┘
```

### 7.2 Summary — ระดับ Order

```
─────────────────────────────────
ยอดรวม                    ฿635.00
ส่วนลดโปรโมชัน            -฿120.00    (auto promos รวม)
  └ Buy 2 Pay ฿90         -฿50
  └ Happy Hour 15%        -฿70
คูปอง [WELCOME10]          -฿51.50    (ถ้ามี)
ส่วนลดสมาชิก (Gold)        -฿46.35    (ถ้ามี)
ส่วนลดพิเศษ                -฿20.00    (ถ้ามี)
─────────────────────────────────
ยอดสุทธิ                   ฿397.15
SC 10% (ถ้ามี)              ฿39.72
VAT 7%                     ฿30.58
─────────────────────────────────
ชำระทั้งสิ้น              ฿467.45

💚 คุณประหยัดไป ฿237.85       ← savings indicator
─────────────────────────────────
```

**Collapse/Expand:** บรรทัด "ส่วนลดโปรโมชัน" คลิกได้ — ขยายดู detail หรือย่อเหลือแถวเดียว (default = ขยาย)

**Print Receipt:** แสดงครบทุก line promo + code ของ coupon (audit)

### 7.3 Color Token (ใช้จาก CSS เดิม)

| เหตุการณ์ | Color | Code |
|---|---|---|
| Auto applied | green | `#22c55e` (ของเดิม `.ci.free`) |
| Bundle active | blue | `#2563eb` (primary เดิม) |
| Available (qualified) | amber | `#f59e0b` |
| Conflict warning | red | `#ef4444` (ของเดิม) |
| Coupon | purple | `#8b5cf6` (ใหม่) |
| Savings indicator | emerald | `#10b981` |

---

## 8. Logic System — Parallelization Matrix (Full)

### 8.1 Priority Matrix (เรียงจาก P1 สูงสุด)

| Priority | Promo Kind | Stack Group | Override-able By | Rationale |
|---|---|---|---|---|
| **P1** | Custom Discount (พนักงาน) | `staff` | — | พนักงานเลือกเอง + มี PIN อนุมัติ = intent ชัดเจน |
| **P2** | Bundle / Time-based | `bundle` / `bill-time` | P1 | ร้านกำหนดตายตัว; time-sensitive |
| **P3** | BOGO / Free Gift | `item` / `gift` | P1, P2 | ระดับสินค้า/ขั้นต่ำ |
| **P4** | %off / ฿off / Step Discount | `item` / `bill` | — | ส่วนลดเปอร์เซ็นต์หรือจำนวน |
| **P5** | Coupon | `coupon` | — | ต้อง user กระทำ |
| **P6** | Member-tier | `member` | — | คำนวณบน "ยอดสุดท้ายก่อน VAT" |

### 8.2 Stacking Matrix (✓ = stack ได้, ✕ = ชนกัน, ◐ = config ได้)

|  | Custom | Bundle | Time | BOGO | Gift | %off | ฿off | Step | Coupon | Member |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| **Custom** | — | ✓ | ✓ | ✓ | ✓ | ◐ | ◐ | ✓ | ◐ | ✓ |
| **Bundle** | ✓ | ✕(ชุดเดียว) | ✓ | ✕(item ซ้ำ) | ✓ | ✕ | ✕ | ✓ | ◐ | ✓ |
| **Time** | ✓ | ✓ | ✕ | ✓ | ✓ | ◐ | ◐ | ✕ | ✓ | ✓ |
| **BOGO** | ✓ | ✕ | ✓ | ✕ | ✓ | ✕(item เดียวกัน) | ✕ | ✓ | ✓ | ✓ |
| **Gift** | ✓ | ✓ | ✓ | ✓ | ✕(1 ชิ้น/บิล) | ✓ | ✓ | ✓ | ✓ | ✓ |
| **%off** | ◐ | ✕ | ◐ | ✕ | ✓ | ✕ | ✕ | ✓ | ✓ | ✓ |
| **฿off** | ◐ | ✕ | ◐ | ✕ | ✓ | ✕ | ✕ | ✓ | ✓ | ✓ |
| **Step** | ✓ | ✓ | ✕ | ✓ | ✓ | ✓ | ✓ | ✕ | ✓ | ✓ |
| **Coupon** | ◐ | ◐ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✕(1 ใบ default) | ✓ |
| **Member** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✕(1 tier) |

**หลักการ:**
- Default = ห้าม stack กับ promo ใน `stackGroup` เดียวกัน
- Override ได้ผ่าน field `stackableWith: [groupId]` ใน promo config
- Member discount stackได้ทุกอย่าง (เพราะคิดหลังสุด)

### 8.3 Calculation Order (Order of Operations)

```
1. รวม cart items → subtotal
2. Apply item-level promos (P3–P4 ระดับ item: BOGO, %off, ฿off)
   → item.price = min(promo results) ถ้าชนกัน → default best-deal, 
     user override ได้ผ่าน ConflictDialog
3. Apply bundle promos (P2) — จับกลุ่มสินค้า
4. รวม items → itemTotal
5. Apply bill-level auto promos (P2 Time-based, P4 Step Discount, P3 Free Gift)
6. Apply Coupon (P5)
7. Apply Custom Discount (P1 — override ทุกอย่างก่อนหน้าได้)
8. Apply Member Tier (P6) บนยอดสุทธิหลังหักทุกโปร
9. Apply Service Charge
10. Apply VAT
11. Grand Total
```

### 8.4 Conflict Resolution — Algorithm

```js
function resolveConflict(existingPromo, newPromo, bill) {
  // 1. ตรวจ stackable
  if (canStack(existingPromo, newPromo)) {
    return { action: 'stack', keep: [existingPromo, newPromo] };
  }

  // 2. คำนวณ savings ของแต่ละตัวเลือก
  const savingsA = calcSavings(existingPromo, bill);
  const savingsB = calcSavings(newPromo, bill);

  // 3. ถ้า priority ต่างกันมาก → auto resolve
  if (existingPromo.priority < newPromo.priority - 2) {
    return { action: 'keep-existing', reason: 'priority-lock' };
  }

  // 4. ตามที่ user choose (requirement หลัก):
  //    เปิด ConflictDialog — highlight best-deal, แต่ user กดเลือก
  return {
    action: 'ask-user',
    options: [existingPromo, newPromo],
    recommended: savingsA > savingsB ? existingPromo.id : newPromo.id,
    diff: Math.abs(savingsA - savingsB),
  };
}
```

### 8.5 Best-Deal Suggestion Algorithm

เมื่อเกิด conflict หรือเปิด promo-choice:
```js
function suggestBestDeal(promos, bill) {
  return promos
    .map(p => ({
      promo: p,
      savings: calcSavings(p, bill),
      pillarScore: p.priority * 10 + estimatedSavings, // weighted
    }))
    .sort((a, b) => b.savings - a.savings)  // มากสุดขึ้นก่อน
    [0];
}
```

Display: badge `💎 ดีกว่า ฿XX` บน option ที่แนะนำ

### 8.6 Edge cases ที่ต้องจัดการ

| Case | Behavior |
|---|---|
| เพิ่มสินค้าหลัง apply coupon → ยอดเกิน cap | Coupon ยังใช้ได้ แต่ไม่คูณเพิ่ม |
| ลบสินค้าจน subtotal ต่ำกว่า coupon min | Retract coupon + toast แจ้ง + restore ได้ 1 คลิก |
| Happy Hour หมดเวลาขณะ pay | Lock promo ณ เวลา `openPayment()` — ไม่ retract กลางคัน |
| Member ใช้สิทธิ์ + ครบ ฿500 แถม → ซ้อนกันได้ | ✓ stackable |
| Free gift แต่สินค้าในคลังไม่พอ | Toast "ของแถมหมด — ขออภัย" + ไม่ apply |
| Coupon คนละสาขา | reject ตอน redeem + บอกสาขาที่ใช้ได้ |
| สินค้าใน bundle ถูกลบ | dissolve bundle + คืนราคาเต็ม + toast |
| BOGO ของแถมถูก user ลบเอง | คืนสิทธิ์ — ยอมให้เลือกใหม่ได้ |

---

## 9. Vue Component Structure

### 9.1 Component Tree

```
App.vue (existing)
├── SidebarNav  (existing)
├── CenterPane  (existing)
│   ├── TopBar
│   ├── CategoryBar
│   ├── AiBar
│   ├── ProductGrid
│   │   └── ProductCard
│   │       └── ⭐ PromoBadge      ← NEW
│   └── PromoBar                   ← MODIFY (dynamic data)
│       └── ⭐ PromoQuickCard       ← NEW (replace static)
└── CartPane
    ├── CartHeader (existing)
    ├── CartSearch (existing)
    ├── BillTabs (existing)
    ├── CartItems
    │   └── CartItemRow
    │       ├── ⭐ PromoItemTag    ← NEW (price strike, -% tag)
    │       └── ⭐ BundleWrapper   ← NEW (group 2+ items)
    └── CartFooter
        ├── ⭐ PromotionPanel     ← NEW (THE FEATURE)
        │   ├── PromoAutoList
        │   │   └── PromoAutoRow
        │   ├── PromoAvailableList
        │   │   ├── PromoAvailableRow
        │   │   └── ProgressHint
        │   └── PromoManualInput
        │       ├── CouponInput
        │       └── QuickActionsRow (existing buttons re-grouped)
        ├── OrderSummary         ← MODIFY (breakdown)
        └── PayButton (existing)

⭐ Dialogs (teleported)
├── PromoChoiceDialog   (existing, enhance)
├── FreeItemPicker      (existing)
├── CouponErrorToast    (new)
└── ⭐ PromoConflictDialog  ← NEW
```

### 9.2 Props / Emits / State Contract

**PromotionPanel.vue**
```js
props: {
  bill: { type: Object, required: true },          // currentBill
  allPromos: { type: Array, required: true },      // promotions[]
  engine: { type: Object, required: true },        // PromoEngine instance
},
emits: [
  'apply-promo',         // (promoId, ctx)
  'remove-promo',        // (appliedId)
  'redeem-coupon',       // (code) -> promise
  'open-conflict',       // ({ options, recommended })
  'open-custom-discount',
],
computed: {
  autoApplied,           // List<AppliedPromo>
  available,             // List<PromoRef>
  progressHints,         // List<{ promoId, need, progress }>
  totalSavings,
},
```

**PromoEngine (composable)** — หัวใจของ logic
```js
// composables/usePromoEngine.js
export function usePromoEngine(billRef, promotionsRef, settingsRef) {
  const applied = ref([]);       // AppliedPromo[]
  const available = ref([]);
  const conflicts = ref([]);

  function evaluate() { /* ตาม §8.3 order */ }
  function canApply(promoId) { /* check conditions + stacking */ }
  function applyPromo(promoId, opts={}) { /* … + conflict detect */ }
  function removePromo(appliedId) { /* undo */ }
  function redeemCoupon(code) { /* async */ }
  function suggestBestDeal(promoList) { /* §8.5 */ }
  function finalize() { /* lock ก่อน payment */ }

  watch(billRef, evaluate, { deep:true });
  watchEffect(() => /* time-based re-eval every 60s */);

  return { applied, available, conflicts, evaluate, canApply,
           applyPromo, removePromo, redeemCoupon, suggestBestDeal, finalize };
}
```

**PromoConflictDialog.vue**
```js
props: {
  existing: Object,      // AppliedPromo
  incoming: Object,      // PromoRef
  recommended: String,   // promoId
  diff: Number,          // savings gap
},
emits: ['confirm', 'cancel'],  // confirm(selectedId)
```

**CartItemRow.vue (modify)**
```js
// เพิ่ม props
props: {
  ...existing,
  promoApplied: Object,   // { type, label, savedAmount, lockQty }
  bundleInfo: Object,     // { bundleId, memberIds[] }
},
// render:
//   - ถ้า promoApplied → แสดงราคาขีดคร่อม + tag
//   - ถ้า bundleInfo → render ภายใน <BundleWrapper>
```

### 9.3 Store / State (Vuex / Pinia — หรือ inject ใน root)

หากยังใช้ options-API ตามเดิม: ขยาย `data()` ใน root ด้วย
```js
data(){return{
  ...existing,
  promotions: [],              // fetched from admin API
  promoEngine: null,           // init ใน mounted()
  appliedPromos: [],           // persist per bill
  availablePromos: [],
  coupons: [],                 // list of applied coupon IDs
  pendingConflict: null,       // { existing, incoming, recommended }
}}
```

### 9.4 API Integration (assumed)

```
GET  /api/promotions/active?branchId=&datetime=  → PromoRef[]
POST /api/coupons/redeem                         → { valid, promo }
POST /api/bills/:id/applied-promos               → sync state
GET  /api/members/:id/tier                       → member info
```

---

## 10. Additional UX Improvements (Proactive)

### 10.1 Upsell hints (ไม่ intrusive)
- บน product card: ถ้าเพิ่มชิ้นนี้ได้ bundle → small tag "จับคู่ ฿90"
- ถ้าบิลยังขาดอีกเล็กน้อยจะได้ลด → แสดงใน Panel Section B ด้วย progress bar

### 10.2 Keyboard shortcuts (เพื่อ low interaction cost)
- `F2` — เปิด Promotion Panel expand
- `F3` — focus CouponInput
- `F4` — Custom Discount
- `Enter` ใน coupon field — redeem
- `Esc` ใน ConflictDialog — ยกเลิก

### 10.3 Barcode coupon
- handleBarcode เดิม (L180–184) เพิ่ม fallback: ถ้าไม่ match product → ลอง `redeemCoupon(code)`
- ลูกค้ายื่น QR/barcode coupon → พนักงานสแกนเดียวจบ

### 10.4 Preview savings ก่อน pay
ปุ่ม Pay เดิม เปลี่ยน label:
- เดิม: `ชำระเงิน ฿467.45`
- ใหม่: `ชำระเงิน ฿467.45  |  ประหยัด ฿237.85` (anchoring effect)

### 10.5 Undo recent promo removal
- เมื่อกด X ใน Section A → toast "ลบโปรแล้ว [กู้คืน]"
- ปุ่มกู้คืน 5 วินาที แล้วหาย

### 10.6 Audit log
- ทุกครั้งที่ promo ถูก apply/remove/override → log `{ promoId, by, timestamp, billId }`
- แสดงใน receipt detail (optional) + report ฝ่ายจัดการ

### 10.7 Accessibility
- ทุก promo row มี `aria-label` เต็ม (ไม่อ่านแค่ icon)
- Conflict Dialog — focus trap + default focus = recommended option
- สีทั้งหมดผ่าน WCAG AA (ใช้ token เดิม + purple ใหม่ผ่านเกณฑ์)

### 10.8 Error recovery
- Network down ตอน redeem coupon → queue + retry
- Promo state corrupt → "รีเซ็ตโปร" button ใน menu (ไม่ลบสินค้า)

---

## 11. Acceptance Criteria (สำหรับ QA)

### 11.1 Functional
- [ ] BOGO เดิมยังทำงานได้ (regression)
- [ ] ANY_FREE เดิมยังทำงานได้ (regression)
- [ ] เพิ่มสินค้าที่เข้า bundle → apply อัตโนมัติ + toast
- [ ] ใส่ coupon ผิด → reject + error msg ถูกต้อง
- [ ] ใส่ coupon ถูก → apply + summary update
- [ ] 2 promo ชนกัน → เปิด ConflictDialog
- [ ] ConflictDialog แสดง "ดีกว่า" ถูกต้อง
- [ ] ลบสินค้าที่ trigger promo → promo ถูก retract
- [ ] Happy Hour ตรงเวลา → apply; นอกเวลา → ไม่ apply
- [ ] Member + bill-level + coupon stack ได้
- [ ] Custom discount override ทุกโปรได้
- [ ] Receipt print ครบทุก promo line

### 11.2 Non-functional
- [ ] เพิ่มสินค้าถึงแสดง promo result ≤ 200ms
- [ ] ConflictDialog เปิดใน ≤ 150ms
- [ ] Promo Panel scroll smooth (60fps)
- [ ] Bundle 20 รายการในบิล — evaluate ≤ 500ms
- [ ] Keyboard shortcuts ทำงานทุกปุ่ม

### 11.3 UX
- [ ] พนักงานใหม่เทรนในเวลา ≤ 15 นาทีใช้ได้คล่อง (measure)
- [ ] ปิดบิลเฉลี่ย ≤ 20 วินาที (compared to baseline)
- [ ] Error rate การใช้ promo ผิด ≤ 2% (compared to baseline)

---

## 12. Rollout Plan (แนะนำ)

| Phase | Scope | Duration |
|---|---|---|
| 1 | Data model + PromoEngine core (no UI) + unit tests | 1 สัปดาห์ |
| 2 | PromotionPanel UI + Auto section | 1 สัปดาห์ |
| 3 | Coupon input + Available section + ConflictDialog | 1 สัปดาห์ |
| 4 | Cart item display + Summary breakdown + Receipt | 3 วัน |
| 5 | Shadow test ที่ 1 สาขา + iterate | 1 สัปดาห์ |
| 6 | Rollout 4 สาขา + training | 2 วัน |

---

## 13. Appendix — Changes to app.js (minimal diff summary)

```diff
 data(){return{
   ...
+  promotions: [],
+  appliedPromos: [],
+  availablePromos: [],
+  pendingConflict: null,
+  couponInput: '',
+  promoPanelOpen: true,
 }}

 computed:{
-  totals(){ /* existing */ }
+  totals(){ return this.promoEngine.computeTotals(this.currentBill, this.settings) }
+  autoPromos(){ return this.appliedPromos.filter(p=>p.applyMode==='auto') }
+  totalSavings(){ return this.totals.totalDisc }
 }

 methods:{
   addToCart(p){
     /* existing */
+    this.promoEngine.evaluate();
   },
+  applyPromoById(id, opts){ /* calls engine */ },
+  removeAppliedPromo(id){ /* calls engine */ },
+  redeemCoupon(code){ /* calls engine; returns Promise */ },
+  handleConflict(choice){ /* swap promos */ },
 }
```

**CSS ที่เพิ่ม:** ~250 บรรทัด (promotion-panel, promo-item-tag, bundle-wrapper, conflict-dialog)
**Impact กับ bundle size:** +~8KB gzipped (engine + new components + CSS)

---

*เอกสารนี้ใช้เป็น source of truth สำหรับ sprint planning และ dev handoff*
*แก้ไขได้ที่: `D:\antigravity\POS_V2\docs\PROMOTION_POS_DESIGN.md`*
