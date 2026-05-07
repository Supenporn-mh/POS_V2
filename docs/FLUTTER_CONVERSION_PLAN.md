# แผนการแปลง POS V2 (Vue 3) → Flutter

## บริบท
UPOS POS V2 ปัจจุบันเป็น Vue 3 SPA (App.vue + app.js) รันบน browser
เป้าหมายคือสร้าง Flutter project ใหม่ที่ reproduce ทุก feature สำหรับ tablet/desktop
โดยยังคง business logic ทั้งหมด (PromoEngine, multi-bill, totals cascade) และ UI ภาษาไทย

---

## ขอบเขตภาพรวม

| มิติ | จำนวน |
|---|---|
| Screens | 13 |
| Modals / Dialogs | 25+ |
| Data models | 8 |
| ประเภทโปรโมชัน | 11 (priority P1–P6) |
| วิธีชำระเงิน | 4 (Cash, QR, Wallet, EDC) |

---

## 1. Flutter Architecture

### State Management: Riverpod 2.x (with code generation)
Vue Options API แมปกับ Riverpod ได้ตรงมาก:

| Vue | Flutter/Riverpod |
|---|---|
| `data()` | `Notifier` class state |
| `computed` | derived `Provider` (watch หลาย source) |
| `methods` | methods บน `Notifier` |
| `watch:` | `ref.listen()` / `ref.watch()` |

### Navigation: go_router 14.x
- `ShellRoute` สำหรับ sidebar ที่คงอยู่ใน `/pos/*`, `/kitchen/*`, `/food-serving`
- 14 named routes

### โครงสร้างโฟลเดอร์

```
lib/
├── core/
│   ├── theme/          ← AppTheme, AppColors (map Tailwind tokens)
│   ├── router/         ← AppRouter (go_router)
│   └── utils/          ← currency_formatter, thai_number_words, date_helpers
├── data/
│   ├── models/         ← freezed models: Product, CartItem, Bill, Order, Promo, Member, Employee, Settings
│   ├── repositories/   ← ProductRepository, OrderRepository, SettingsRepository
│   └── static/         ← product_data.dart, promo_data.dart, kitchen_data.dart (port จาก App.vue)
├── features/
│   ├── auth/           ← LoginScreen, auth_provider
│   ├── pos/            ← PosScreen (3-col), ProductGrid, CartPanel, totals_display
│   ├── payment/        ← PaymentNotifier, 4 payment dialogs
│   ├── promotions/
│   │   └── engine/     ← PromoEngine (pure Dart ไม่มี Flutter deps)
│   ├── orders/         ← OrdersScreen, OrderDetailScreen, CancelledOrdersScreen
│   ├── kitchen/        ← KitchenSelectScreen, KitchenDisplayScreen
│   ├── food_serving/   ← FoodServingScreen (4-col kanban)
│   ├── tax_invoice/    ← TaxInvoiceListScreen, TaxInvoiceFormScreen
│   ├── money_management/ ← MoneyManagementScreen, MoneyTopupScreen, MoneyDailyScreen
│   ├── members/        ← MemberSearchDialog, member_provider
│   ├── employees/      ← EmpIdentDialog, PrivilegeDialog, employee_provider
│   ├── settings/       ← SettingsScreen, settings_provider
│   └── feature_select/ ← FeatureSelectScreen
└── shared/
    └── widgets/        ← ToastOverlay, ConfirmDialog, AppSidebar, StatusBadge
```

---

## 2. Screen → Route Mapping (ครบ 13 screens)

| Vue `appScreen` | Flutter Route | Widget |
|---|---|---|
| `login` | `/login` | `auth/login_screen.dart` |
| `feature` | `/feature` | `feature_select/feature_select_screen.dart` |
| `pos` | `/pos` | `pos/pos_screen.dart` |
| `orders` | `/pos/orders` | `orders/orders_screen.dart` |
| `order-detail` | `/pos/orders/:id` | `orders/order_detail_screen.dart` |
| `cancelled-orders` | `/pos/orders/cancelled` | `orders/cancelled_orders_screen.dart` |
| `tax-invoice-list` | `/pos/tax-invoice` | `tax_invoice/tax_invoice_list_screen.dart` |
| `tax-invoice-form` | `/pos/tax-invoice/:receiptNo` | `tax_invoice/tax_invoice_form_screen.dart` |
| `food-serving` | `/food-serving` | `food_serving/food_serving_screen.dart` |
| `kitchen-select` | `/kitchen` | `kitchen/kitchen_select_screen.dart` |
| `kitchen-display` | `/kitchen/:kitchenId` | `kitchen/kitchen_display_screen.dart` |
| `money-management` | `/money` | `money_management/money_management_screen.dart` |
| `money-topup` | `/money/topup` | `money_management/money_topup_screen.dart` |
| `money-daily` | `/money/daily` | `money_management/money_daily_screen.dart` |

---

## 3. State Management Plan

| Vue `data()` field | Flutter Provider |
|---|---|
| `bills[]`, `activeBill`, `heldBills[]` | `CartNotifier` |
| `totals` computed | `TotalsProvider` (derived, watch Cart + Settings + Promo + Member) |
| `appliedBillPromos[]`, `promoDefinitions[]` | `PromoNotifier` |
| `appliedPrivileges[]` | `PrivilegeNotifier` |
| `selectedEmployee`, member บน bill | `MemberNotifier` |
| `settings` | `SettingsNotifier` (persist ด้วย shared_preferences) |
| `cashStr`, `payProcessing` | `PaymentNotifier` |
| `ordersData[]` | `OrdersNotifier` |
| `kitchenPrintStatus` (Map) | `KitchenNotifier` |
| `toasts[]` | `ToastNotifier` (auto-remove 3s) |

---

## 4. Business Logic Layer

### PromoEngine (pure Dart — ไม่มี Flutter deps)
**ไฟล์:** `lib/features/promotions/engine/promo_engine.dart`

ยึด contract จาก CLAUDE.md §0c ทุกอย่าง:

```dart
class PromoEngine {
  PromoEvalResult evaluate(Bill bill, List<PromoDefinition> defs);
  void onItemAdded(CartItem item, Bill bill);
  PromoEvalResult finalize(Bill bill); // เรียกก่อน openPayment
}

class PromoEvalResult {
  final List<PromoLine> promoLines;
  final double savings;
  final List<PromoConflict> conflicts;
}
```

**ลำดับ Priority (P1→P6) — ห้ามเปลี่ยน:**

| Priority | ประเภทโปร |
|---|---|
| P1 | Custom Discount (staff, PIN ถ้า > 20%) |
| P2 | Bundle/Combo, Time-based (Happy Hour) |
| P3 | BOGO, ANY_FREE, Free Gift |
| P4 | %off Item, ฿off Item, Step Discount |
| P5 | Coupon Code |
| P6 | Member-Tier |

### TotalsProvider — critical (port จาก `totals()` computed ใน App.vue)
Pure derived `Provider` ที่ watch CartNotifier, SettingsNotifier, PromoNotifier, MemberNotifier

cascade ทั้งหมด:
```
subtotal → itemTotal → promoDisc → billPromoDisc
  → customDisc → memberDisc → privDisc
  → net → scAmt → vatAmt → grand
```

### Free Item Retraction
ใน `CartNotifier.removeItem()`: หลังลบ parent ให้ scan items หา
`item.isFree == true && item.promoId == removedItem.promoId` แล้วลบออกด้วย

### Multi-bill Hold/Recall
ด้วย `freezed` immutable models: `List.from(bill.items)` พอสำหรับ deep clone
(ไม่ต้องใช้ `JSON.parse(JSON.stringify(...))` แบบ Vue)

### Thai Number Words
Utility ที่ `lib/core/utils/thai_number_words.dart` — ใช้ใน Tax Invoice form

---

## 5. Packages ที่ใช้

| Package | เหตุผล |
|---|---|
| `flutter_riverpod ^2.5` + `riverpod_annotation` | State management — แมปกับ Vue Options API ได้ตรงที่สุด |
| `go_router ^14.0` | Declarative routing, `ShellRoute` สำหรับ sidebar layout |
| `freezed ^2.4` + `json_serializable` | Immutable data models พร้อม `copyWith`, `==`, `hashCode` |
| `google_fonts ^6.2` | Font Sarabun / Kanit สำหรับภาษาไทย |
| `shared_preferences ^2.2` | Persist settings + shift data |
| `qr_flutter ^4.1` | Render QR code สำหรับ QR payment |
| `intl ^0.19` | Thai locale วันที่/เวลา (`th_TH`) |
| `collection ^1.18` | `firstWhereOrNull`, `groupBy`, `sorted` |
| `printing ^5.12` | พิมพ์ receipt thermal printer |
| `pdf ^3.10` | สร้าง PDF สำหรับ Tax Invoice |
| `cached_network_image ^3.3` | รูปสินค้าจาก URL พร้อม cache |
| `build_runner` | Code generation สำหรับ freezed + riverpod |

---

## 6. Development Phases

### Phase 1 — Foundation (สัปดาห์ 1–2)
**เป้าหมาย:** App boot, navigate, เพิ่มสินค้าเข้า cart, เห็น totals ถูกต้อง

- [ ] `flutter create --org com.upos upos_flutter`
- [ ] เพิ่ม packages ทั้งหมดใน `pubspec.yaml`
- [ ] สร้าง `freezed` data models ทั้งหมด
- [ ] Port static data (products, categories, promos, kitchens) จาก `App.vue`
- [ ] `AppTheme`: font Sarabun + color tokens จาก CLAUDE.md §5
- [ ] `go_router` skeleton — 14 routes, placeholder screens
- [ ] `CartNotifier` + `SettingsNotifier` + unit tests
- [ ] `TotalsProvider` + unit tests (empty cart, BOGO, custom disc, SC+VAT)
- [ ] `LoginScreen` + `FeatureSelectScreen`
- [ ] `PosScreen` 3-col layout: `AppSidebar` | `ProductGrid` | `CartPanel`

**Milestone:** Login → browse products → add to cart → totals ถูกต้อง

---

### Phase 2 — POS Core (สัปดาห์ 3–4)
**เป้าหมาย:** ขายได้ครบ flow ตั้งแต่เลือกสินค้าจนถึงชำระเงิน

- [ ] `AddonDialog` — เลือก modifier (size, extra shot ฯลฯ)
- [ ] `PromoChoiceDialog` + `PromoFreeItemDialog` (BOGO, ANY_FREE)
- [ ] `CashPaymentDialog` — numpad + quick amounts + คำนวณเงินทอน
- [ ] `QrSubTypeDialog` + `QrPaymentDialog` — เลือก QR provider + แสดง QR code
- [ ] `WalletConfirmDialog` + `EdcPaymentDialog`
- [ ] `MemberSearchDialog` + `EmpIdentDialog` + `PrivilegeDialog`
- [ ] `DiscountDialog` + `PinDialog` (guard > 20%)
- [ ] `CouponDialog`
- [ ] `NewSaleModal` — hold/recall/delete bills
- [ ] `ToastOverlay`
- [ ] Receipt print trigger

**Milestone:** ขายครบ cycle ได้จริง

---

### Phase 3 — Promotion Engine (สัปดาห์ 5)
**เป้าหมาย:** `PromoEngine` ทำงานได้จริง, promo panel ใน cart

- [ ] Port `promoDefinitions[]` data
- [ ] `PromoEngine.evaluate()` P1–P6 (port เฉพาะที่ implement แล้ว: BOGO, ANY_FREE, DISCOUNT, REDEEM, FREE_GIFT)
- [ ] Stub 6 ประเภทที่เหลือด้วย `UnsupportedError` (defer Phase 6)
- [ ] `availableBillPromosProvider` + `nearbyBillPromos`
- [ ] `PromoListDialog`, `PromoRedeemDialog`, `PromoGiftDialog`
- [ ] Free item retraction on parent delete
- [ ] Conflict detection + `ConflictDialog`
- [ ] `TotalsProvider` อัปเดต lane `billPromoDisc`

**Milestone:** โปรทุกประเภทที่ active apply/remove ถูกต้อง, totals ถูกต้องทุก edge case

---

### Phase 4 — Supporting Screens (สัปดาห์ 6–7)
**เป้าหมาย:** ครบทุก 13 screens

- [ ] `OrdersScreen` (paginated, filtered) + `OrderDetailScreen` + `CancelledOrdersScreen`
- [ ] `FoodServingScreen` — 4-column kanban (Pending → Cooking → Served → Cancelled)
- [ ] `KitchenSelectScreen` + `KitchenDisplayScreen` + history panel
- [ ] `TaxInvoiceListScreen` + `TaxInvoiceFormScreen` (export PDF)
- [ ] `MoneyManagementScreen` + `MoneyTopupScreen` + `MoneyDailyScreen`
- [ ] `SettingsScreen` (VAT/SC toggles, POS screen management)
- [ ] Shift open/close dialogs, logout confirm

**Milestone:** ทุก screen navigate ได้ไม่ crash

---

### Phase 5 — Polish & Platform (สัปดาห์ 8)
**เป้าหมาย:** production-ready บน tablet landscape + desktop

- [ ] Responsive breakpoints — cart panel 400px (≥ 1100px) → 340px (≥ 900px) → BottomSheet (< 768px)
- [ ] Keyboard / barcode scanner integration
- [ ] Thermal printing (package `printing`)
- [ ] `shared_preferences` persist settings + shift data
- [ ] Error boundaries + empty states
- [ ] `const` widgets ทุกที่ + `ListView.builder` ทุก list
- [ ] Thai locale test ครบ (วันที่, ฿ currency, ข้อความทั้งหมด)

---

## 7. Parallelization Matrix

หลัง Phase 1 เสร็จ — 5 tracks รันพร้อมกันได้:

| Track | ขอบเขต | Dependency |
|---|---|---|
| A: POS Core | CartNotifier, TotalsProvider, CartPanel, 4 payment dialogs | Phase 1 |
| B: PromoEngine | PromoEngine (pure Dart), PromoNotifier, promo dialogs | CartNotifier interface (mock ได้) |
| C: Supporting Screens | Orders, Kitchen, FoodServing, TaxInvoice, MoneyMgmt | Shared Order model + router |
| D: Auth + Settings | LoginScreen, FeatureSelectScreen, SettingsScreen | Phase 1 เท่านั้น |
| E: Theme + Shared Widgets | AppTheme, AppSidebar, ToastOverlay, ConfirmDialog | ไม่มี dependency |

**Critical Path:**
```
Data Models → CartNotifier → TotalsProvider → POS Integration → Payment Complete Flow
                                    ↑
             PromoEngine → PromoNotifier → Totals with PromoDisc (merge point Phase 3)
```

---

## 8. Risks

| ความเสี่ยง | ระดับ | วิธีลด |
|---|---|---|
| `totals()` cascade correctness | สูง | Port เป็น pure Dart function ก่อน, unit test ทุก lane แล้วค่อย wire เข้า Riverpod |
| Free item retraction logic | สูง | เขียน `retractFreeItems()` เป็น pure function แยก test ก่อน |
| PromoEngine complexity (11 types) | สูง | Port เฉพาะ 5 ประเภทที่มีอยู่แล้ว, stub 6 ที่เหลือ |
| Addon deduplication key | ปานกลาง | `addonKey()` utility ใช้ `json.encode(sortedEntries)` + unit test |
| Thai font rendering (vowel marks) | ปานกลาง | ทดสอบตอนจบ Phase 1; ถ้ามีปัญหาให้ embed font ใน `assets/fonts/` |
| 3-col layout บน tablet | ปานกลาง | `LayoutBuilder` ควบคุม cart panel width |
| Modal state isolation (20+ modals) | ปานกลาง | `showDialog()` โดยตรงสำหรับ simple dialogs; เฉพาะ multi-step flow ผ่าน Notifier |

---

## 9. ไฟล์ Source ที่ต้องอ้างอิงระหว่าง implement

| ไฟล์ | อ่านส่วนไหน |
|---|---|
| `src/App.vue` บรรทัด 1–500 | template ทุก screen + modal |
| `src/App.vue` บรรทัด 2345–2753 | `data()`, `computed`, `methods` → แมป 1:1 กับ Riverpod providers |
| `src/App.vue` บรรทัด 2621–2639 | `totals()` cascade — port ทีละบรรทัด |
| `app.js` | PromoEngine contract, priority order, cart invariants |
| `CLAUDE.md §0c` | Domain rules + color tokens |
| `docs/PROMOTION_POS_DESIGN.md` | 11-promo stackability matrix, conflict policies |

---

## 10. Verification Criteria (เกณฑ์ตัดสิน Done)

- [ ] `TotalsProvider` unit tests ผ่าน: empty cart, BOGO promo, billPromo + member disc stacking, SC only, VAT only, SC+VAT
- [ ] `PromoEngine` unit tests: P1 override P2–P6, free item retract เมื่อ parent ถูกลบ, conflict detected เมื่อ 2 โปรชนกัน
- [ ] Full sale flow: Login → เพิ่มสินค้า → apply โปร → ชำระ Cash → order ปรากฏใน Orders screen
- [ ] Multi-bill: Hold bill → New bill → เพิ่มสินค้า → Recall held bill → cart กลับมาถูกต้อง
- [ ] Thai text render ถูกต้อง (vowel marks, ฿ symbol, วันที่ th_TH locale)
- [ ] Custom discount > 20% ต้องใส่ PIN; ≤ 20% apply ได้ทันที
- [ ] ทุก 13 screens navigate ได้โดยไม่ crash; sidebar highlight active screen ถูกต้อง
