# Parallelization Matrix — POS V2 Promotion Integration
**Version:** 1.0 · 2026-04-24
**Convention:** ตาม `/CLAUDE.md` § Parallelization Matrix (L1–L8)
**Scope:** ครอบคลุม 11 promo types × ทุกมิติระบบ + โครงสร้าง parallel dev/test/rollout

---

## Executive Summary

เอกสารนี้คือ cross-reference **8 เลเยอร์** ที่ทำให้ทีม dev, QA, PO, ops เห็นภาพเดียวกันว่า:
- โปรแต่ละชนิดมีพฤติกรรมอะไรในทุกมิติ (L2)
- ส่วนไหนของระบบทำ parallel ได้ ส่วนไหน serialize (L3, L4)
- Test ตัวไหนยิง parallel ได้ ตัวไหนต้องรอ (L5)
- อะไรพังเมื่อไหร่ และแก้ด้วยอะไร (L6)
- ใครรับผิดชอบอะไร (L7)
- Event ไหน trigger อะไร (L8)

### Key numbers
- **Parallel tiers:** 5 tiers (T0–T4) · **Critical path length:** 4 tiers (PromoEngine → UI → Integration → E2E)
- **Parallel dev streams:** 4 streams × 6 sprints · **Peak concurrency:** 8 tasks
- **Test matrix size:** 11 types × 4 test levels = 44 cells · **Parallelizable:** 38/44 (86%)
- **Failure modes:** 12 tracked · **Severity SEV1:** 3

---

## L1 — Master Feature × Concern Matrix

แถว = ฟีเจอร์ที่ต้องมี · คอลัมน์ = concern/layer ของระบบ · เซลล์ = ต้องทำหรือไม่

| Feature | Data Model | UI Component | Engine Logic | State Mgmt | Persistence | API | i18n | a11y | Test |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Auto-applied promos | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Available hint list | — | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ |
| Progress bar (threshold) | — | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ |
| Coupon input | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Conflict dialog | — | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ |
| Best-deal suggestion | — | ✓ | ✓ | — | — | — | ✓ | — | ✓ |
| Promo breakdown (summary) | — | ✓ | ✓ | — | ✓ | — | ✓ | ✓ | ✓ |
| Member-tier stack | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ✓ |
| Bundle grouping UI | — | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ |
| Free gift (threshold) | ✓ | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ |
| Step discount (threshold) | ✓ | — | ✓ | — | — | — | ✓ | — | ✓ |
| Undo recent removal | — | ✓ | ✓ | ✓ | — | — | ✓ | ✓ | ✓ |
| Barcode→coupon fallback | — | — | ✓ | ✓ | — | ✓ | — | — | ✓ |
| Receipt promo lines | — | ✓ | ✓ | — | ✓ | — | ✓ | ✓ | ✓ |
| Audit log | ✓ | — | ✓ | — | ✓ | ✓ | — | — | ✓ |

**อ่านตาราง:** `✓` ในเซลล์หมายถึง "ต้องลงมือทำที่ concern นี้" — ใช้สำหรับวาง scope และไม่ลืม layer

---

## L2 — Promo Type × Dimension Matrix (ตารางหลัก เต็มรูปแบบ)

แถว = promo type · คอลัมน์ = ทุก dimension ที่พฤติกรรมอาจต่างกัน
**Legend:** Mode(A=Auto, O=Opt-in, M=Manual) · Scope(I=Item, B=Bill, M=Member) · CalcStep(1–10 ตาม §8.3 ของ DESIGN doc)

| # | Promo Type | Mode | Scope | Trigger Event | CalcStep | Priority | StackGroup | Stack w/ Same Group | Stack w/ Other | Display (Cart) | Display (Summary) | Conflict UX | Retract Trigger | Input Req | Audit |
|---|---|:-:|:-:|---|:-:|:-:|---|:-:|:-:|---|---|---|---|---|:-:|
| 1 | **BOGO** | A | I | item-added | 2 | P3 | item | ✕ | ◐ | line (ฟรี) + PRO badge green | `ส่วนลดโปรโมชัน` | Dialog: keep/swap | qty<2 → retract free | — | ✓ |
| 2 | **ANY_FREE** | O→A | I | item-added + pick | 2 | P3 | item | ✕ | ◐ | line (ฟรี) + gift icon | `ส่วนลดโปรโมชัน` | Dialog | ต้นทางลบ → retract ของแถม | user pick | ✓ |
| 3 | **PERCENT_ITEM** | A | I | item-added | 2 | P4 | item | ✕ | ✓ | price strike + `-10%` amber | `ส่วนลดโปรโมชัน` | Best-deal hint | item-removed | — | ✓ |
| 4 | **AMOUNT_ITEM** | A | I | item-added | 2 | P4 | item | ✕ | ✓ | price strike + `-฿10` amber | `ส่วนลดโปรโมชัน` | Best-deal hint | item-removed | — | ✓ |
| 5 | **BUNDLE** | A | B | cart-changed | 3 | P2 | bundle | ✕ | ✓ | grouped in `<BundleWrapper>` + blue border | `ส่วนลดโปรโมชัน` | Dialog | qty ไม่ครบ → dissolve | — | ✓ |
| 6 | **COUPON** | M | B | redeem-coupon | 6 | P5 | coupon | ◐ (1/บิล default) | ✓ | badge ม่วง ใน Panel | `คูปอง [CODE]` | Inline error | cart below min → retract | code | ✓ |
| 7 | **MEMBER_TIER** | A | M | member-selected | 8 | P6 | member | ✕ (1 tier) | ✓ | icon crown ใน Panel | `ส่วนลดสมาชิก (Gold)` | — | member removed | member | ✓ |
| 8 | **TIME_BASED** | A | B | time-tick / item-added | 5 | P2 | bill-time | ✕ | ✓ | clock badge + countdown | `ส่วนลดโปรโมชัน` | Dialog w/ Bundle | นอก time window | — | ✓ |
| 9 | **FREE_GIFT** | A | B | cart-changed | 5 | P3 | gift | ✕ (1/บิล) | ✓ | line "🎁 ของแถม" + PRO | `ส่วนลดโปรโมชัน` | — | subtotal < threshold | — | ✓ |
| 10 | **STEP_DISCOUNT** | A | B | cart-changed | 5 | P4 | bill | ✕ (1 step) | ✓ | — (แสดงใน Panel) | `ซื้อครบ ลด Y%` | — | subtotal < threshold | — | ✓ |
| 11 | **CUSTOM** | M | B | staff-action | 7 | P1 | staff | ✓ (1/บิล) | ✓ | — | `ส่วนลดพิเศษ` | — | staff remove | PIN if >20% | ✓ |

### L2.1 Stacking sub-matrix (10×10 — full expansion)

| | Custom(P1) | Bundle(P2) | Time(P2) | BOGO(P3) | Gift(P3) | %off(P4) | ฿off(P4) | Step(P4) | Coupon(P5) | Member(P6) |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| **Custom(P1)** | — | ✓ | ✓ | ✓ | ✓ | ◐ | ◐ | ✓ | ◐ | ✓ |
| **Bundle(P2)** | ✓ | ✕ | ✓ | ✕ | ✓ | ✕ | ✕ | ✓ | ◐ | ✓ |
| **Time(P2)** | ✓ | ✓ | ✕ | ✓ | ✓ | ◐ | ◐ | ✕ | ✓ | ✓ |
| **BOGO(P3)** | ✓ | ✕ | ✓ | ✕ | ✓ | ✕ | ✕ | ✓ | ✓ | ✓ |
| **Gift(P3)** | ✓ | ✓ | ✓ | ✓ | ✕ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **%off(P4)** | ◐ | ✕ | ◐ | ✕ | ✓ | ✕ | ✕ | ✓ | ✓ | ✓ |
| **฿off(P4)** | ◐ | ✕ | ◐ | ✕ | ✓ | ✕ | ✕ | ✓ | ✓ | ✓ |
| **Step(P4)** | ✓ | ✓ | ✕ | ✓ | ✓ | ✓ | ✓ | ✕ | ✓ | ✓ |
| **Coupon(P5)** | ◐ | ◐ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✕ | ✓ |
| **Member(P6)** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✕ |

**จำนวนคู่ที่ต้อง test:** C(10,2) + 10 self = 55 คู่ · ที่เป็น `✕` หรือ `◐` = 28 คู่ที่ต้องมี conflict test
**Test IDs:** `T-CONFLICT-[A]x[B]` เช่น `T-CONFLICT-Bundle-x-BOGO`

---

## L3 — Component Dependency DAG + Parallel Tiers

### L3.1 DAG (ทิศการพึ่งพา: `A → B` = B ใช้ A)

```
Tier 0  (Data / Types — NO deps)
  ┌─────────────────────────────────────────────────────┐
  │ [T0-1] promotion.model.js  (PromoType, PromoShape) │
  │ [T0-2] constants.js        (PriorityMap, Colors)   │
  │ [T0-3] fixtures/promos.js  (sample data)           │
  └────┬────────────┬────────────┬──────────────────────┘
       │            │            │
Tier 1  (Pure functions — depend only on T0)
  ┌────▼────────────▼────────────▼──────────────────────┐
  │ [T1-1] calcSavings(promo,bill)                     │
  │ [T1-2] conditionMatcher(promo,bill)                │
  │ [T1-3] stackChecker(a,b)                           │
  │ [T1-4] bestDealPicker(promos,bill)                 │
  │ [T1-5] cashFormatter / receipt builder             │
  └────┬────────────┬────────────┬──────────────────────┘
       │            │            │
Tier 2  (Composables / Stores)
  ┌────▼────────────▼────────────▼──────────────────────┐
  │ [T2-1] usePromoEngine()  (uses T1-1..4)            │
  │ [T2-2] useCoupon()       (uses T1-2, API)          │
  │ [T2-3] useMemberTier()   (uses T1-1)               │
  │ [T2-4] useAuditLog()     (uses T0-1)               │
  └──────────────┬──────────────────────────────────────┘
                 │
Tier 3  (Leaf UI Components — parallel 100%)
  ┌──────────────▼─────────────────────────────────────┐
  │ [T3-1] PromoBadge                                  │
  │ [T3-2] PromoItemTag                                │
  │ [T3-3] ProgressHint                                │
  │ [T3-4] CouponInput                                 │
  │ [T3-5] BundleWrapper                               │
  │ [T3-6] PromoQuickCard (replace promo-bar static)   │
  │ [T3-7] PromoConflictDialog                         │
  │ [T3-8] PromoRow (auto/available)                   │
  └──────────────┬─────────────────────────────────────┘
                 │
Tier 4  (Composite / Integration)
  ┌──────────────▼─────────────────────────────────────┐
  │ [T4-1] PromotionPanel   (uses T2-1..3, T3-3..4,8)  │
  │ [T4-2] CartItemRow(v2)  (uses T3-1,2,5)            │
  │ [T4-3] OrderSummary(v2) (uses T2-1)                │
  │ [T4-4] App.vue wire-up  (hook engine + panel)      │
  └────────────────────────────────────────────────────┘
```

### L3.2 Parallel Tier Table

| Tier | Nodes | Parallel? | Max concurrent | Blocked by | Typical dur | Owner hint |
|---|---|:-:|:-:|---|---|---|
| T0 | 3 files | ✓ 100% | 3 | — | 0.5 day | PO/Arch |
| T1 | 5 pure fns | ✓ 100% | 5 | T0 | 1.5 days | 1–2 devs |
| T2 | 4 composables | ✓ 100% | 4 | T1 | 2 days | 2 devs |
| T3 | 8 UI leaves | ✓ 100% | 8 | T0 (colors) | 2–3 days | 2–3 devs + 1 designer |
| T4 | 4 composites | ◐ 75% | 3 | T2, T3 | 2 days | 2 devs |

**Critical path:** `T0-1 → T1-1 → T2-1 → T4-1 → release` · **Length:** 4 tiers · **Min calendar time:** 7–8 working days (solo) · **With 4-dev team:** 4 working days

### L3.3 Edge cases (serialization forced)

| From → To | Why serialize? | Mitigation |
|---|---|---|
| T1-1 `calcSavings` → T1-4 `bestDealPicker` | bestDeal เรียก calcSavings | ทำใน T1 เดียวกัน serialize ภายใน tier |
| T2-1 `usePromoEngine` → T4-1 `PromotionPanel` | Panel ต้อง inject engine | stub engine (mock) ให้ UI ทำงาน parallel ได้ |
| T3-7 `PromoConflictDialog` → T4-4 wire-up | Dialog ต้อง dispatch เข้า engine | ใช้ event-bus mock |

---

## L4 — Development Workstream Matrix (6 sprints × 4 streams)

แถว = workstream · คอลัมน์ = sprint (1 sprint = 1 week)
Legend: ✦ = primary task · ○ = support/review · ▣ = milestone/demo

| Stream / Sprint | S1 | S2 | S3 | S4 | S5 | S6 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| **A. Core Engine** (T0–T2) | ✦ Model + calcSavings | ✦ conditionMatcher + stackChecker | ✦ engine.evaluate() | ○ fix bugs | ○ perf tune | ○ handover |
| **B. UI Components** (T3) | ✦ Tokens + PromoBadge | ✦ PromoRow + CouponInput | ✦ BundleWrapper + ConflictDialog | ○ a11y polish | ○ i18n | ○ handover |
| **C. Integration** (T4) | — | ○ shell + mocks | ✦ PromotionPanel | ✦ Cart v2 + Summary v2 | ✦ App wire-up | ○ regression |
| **D. QA / Test** | ✦ Unit matrix scaffold | ✦ Unit L1 coverage | ✦ Integration tests | ✦ E2E flows | ✦ Load + a11y | ✦ UAT @ branch |
| **Milestones** | ▣ Spec sign-off | ▣ Engine demo | ▣ Panel demo | ▣ Feature-complete | ▣ Shadow test | ▣ Go-live |

### L4.1 Parallelism per sprint

| Sprint | Concurrent tasks | Blockers | Risk |
|---|:-:|---|---|
| S1 | 3 (A,B,D parallel) | — | low — ทุกคน setup |
| S2 | 4 (A,B,C prep,D) | A→C mock | med — mock quality |
| S3 | 4 | A→C engine | high — integration surface |
| S4 | 4 | C→D E2E | med |
| S5 | 4 | — | med — perf surprises |
| S6 | 2–3 | UAT feedback loop | low-med |

### L4.2 Effort estimate (story points per stream)

| Stream | S1 | S2 | S3 | S4 | S5 | S6 | Total |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| A Engine | 5 | 8 | 13 | 3 | 3 | 1 | **33** |
| B UI | 5 | 8 | 8 | 3 | 3 | 1 | **28** |
| C Integration | — | 2 | 8 | 8 | 5 | 2 | **25** |
| D QA | 3 | 5 | 8 | 8 | 8 | 5 | **37** |
| **Sprint total** | **13** | **23** | **37** | **22** | **19** | **9** | **123 SP** |

---

## L5 — Test Parallelization Matrix

### L5.1 Test level × Promo type (44 cells)

Legend: ✓ = must test · ◐ = optional · UT=Unit, IT=Integration, E2E=End-to-end, LD=Load

| Promo Type / Level | UT | IT | E2E | LD | Parallel safe? |
|---|:-:|:-:|:-:|:-:|:-:|
| BOGO | ✓ | ✓ | ✓ | ◐ | ✓ |
| ANY_FREE | ✓ | ✓ | ✓ | ◐ | ✓ |
| PERCENT_ITEM | ✓ | ✓ | ✓ | ✓ | ✓ |
| AMOUNT_ITEM | ✓ | ✓ | ✓ | ✓ | ✓ |
| BUNDLE | ✓ | ✓ | ✓ | ✓ | ✓ |
| COUPON | ✓ | ✓ | ✓ | ✓ | ◐ (API stub) |
| MEMBER_TIER | ✓ | ✓ | ✓ | ◐ | ✓ |
| TIME_BASED | ✓ | ✓ | ✓ | ◐ | ✕ (needs clock mock) |
| FREE_GIFT | ✓ | ✓ | ✓ | ✓ | ✓ |
| STEP_DISCOUNT | ✓ | ✓ | ✓ | ✓ | ✓ |
| CUSTOM | ✓ | ✓ | ✓ | — | ✓ |

**Total tests:** 11 types × 4 levels = 44 cells · **Must-run:** 38 · **Optional:** 6
**Parallelizable:** 38/44 = 86% · **Blocker:** TIME_BASED (use Jest fake timers → ทำ parallel ได้)

### L5.2 Test Matrix (cross-cutting — 28 conflict pairs)

ดู L2.1 → ทุกคู่ที่เป็น `✕` หรือ `◐` → เขียน IT test: `T-CONFLICT-[A]x[B]`
- Parallel safe ทั้ง 28 คู่ (independent fixtures)
- Runner: vitest `--threads 8` → เสร็จใน ~30s

### L5.3 Load test — golden scenarios

| Scenario | Concurrent | Items/bill | Target P95 | Parallel? |
|---|:-:|:-:|---|:-:|
| Single-lane normal | 1 | 5 | engine.eval ≤ 50ms | ✓ |
| Peak hour (10 POS/branch) | 10 | 8 | ≤ 80ms | ✓ |
| Mega bill | 1 | 30 | ≤ 300ms | ✓ |
| All promos active | 1 | 8 | ≤ 120ms | ✓ |

### L5.4 Accessibility / i18n test

| Check | Tool | Parallel? |
|---|---|:-:|
| Color contrast (WCAG AA) | axe-core | ✓ |
| Keyboard nav (Tab/Shift-Tab/Esc) | Playwright | ✓ |
| Focus trap (ConflictDialog) | Playwright | ✓ |
| Thai / numeric format | snapshot | ✓ |
| Screen reader labels | axe + manual | ✕ (manual) |

---

## L6 — Failure Mode & Effects Analysis (FMEA)

| # | Fault | Layer | Severity | Likelihood | Detection | Impact | Mitigation | Owner |
|---|---|---|:-:|:-:|---|---|---|---|
| F-01 | engine.evaluate() crash on malformed promo | T2-1 | **SEV1** | low | logs + fallback | บิล freeze | try/catch + fallback "no-promo mode" + audit | A |
| F-02 | Coupon API timeout | API | **SEV2** | med | retry + toast | coupon ไม่ apply | retry 2x + manual re-try + offline queue | A |
| F-03 | Stacking rule config corrupt | T0-2 | **SEV1** | very low | schema validate | promo ทำงานผิดสูตร | JSON schema validation at load + CI check | A |
| F-04 | Clock drift (time-based) | T2-1 | SEV3 | low | server time sync | promo คลาดเวลา ±2 นาที | use server time, not client | A |
| F-05 | Free gift SKU out of stock | Inventory | SEV2 | med | inventory check | apply แล้วไม่มีของ | pre-check inventory + toast + suggest alt | C |
| F-06 | Member tier expired mid-bill | API | SEV2 | low | refresh on payment | ลดเกิน/น้อย | lock tier on bill open + refresh on pay | A |
| F-07 | Round-off drift (฿0.01) | T1-1 | SEV3 | med | snapshot test | totals off by ¢ | use bankers-rounding + single rounding at VAT | A |
| F-08 | Conflict dialog stuck open | T3-7 | SEV2 | very low | e2e test | UI freeze | Esc always closes + timeout 60s | B |
| F-09 | Promo applied after pay opened | T4-4 | **SEV1** | low | state freeze | bill mismatch | engine.finalize() = hard lock | C |
| F-10 | Duplicate coupon redeem | T2-2 | SEV2 | low | unique check | double discount | idempotency key + server-side dedupe | A |
| F-11 | Progress hint shown forever | T4-1 | SEV4 | med | visual review | noisy UI | TTL 10s + max 3 hints/bill | B |
| F-12 | Audit log loss | T2-4 | SEV3 | low | count diff | compliance risk | persist before commit + retry | A |

SEV legend: SEV1 = ปิดบิลไม่ได้/เงินผิด · SEV2 = ใช้โปรผิด · SEV3 = UX glitch · SEV4 = cosmetic

---

## L7 — RACI Matrix

R=Responsible (ทำจริง) · A=Accountable (1 คนต่อ 1 deliverable) · C=Consulted · I=Informed

| Deliverable | PO | Arch | FE Dev | BE Dev | QA | UX | Ops |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Promo data model & schema | A | R | C | R | I | I | I |
| Calc logic (engine) | C | A | R | R | C | I | I |
| UI components (T3) | C | C | R/A | I | C | R | I |
| Integration (T4) | C | A | R | C | C | C | I |
| Test suite | I | C | R | R | A/R | C | I |
| Performance budget | C | A | R | R | R | I | C |
| Training material | A | I | C | I | C | R | R |
| Rollout plan | A | C | C | C | C | I | R |
| Audit log & compliance | C | A | R | R | C | I | C |
| Post-launch metrics | A | C | C | C | R | C | R |

**1 deliverable = 1 Accountable** (กฎ RACI) · ถ้าพบ 2 A → ต้อง escalate ถึง PO

---

## L8 — Data × Event Matrix (State Machine + Trigger Map)

### L8.1 Event → Engine trigger map

| Event source | Event | Calls | Debounce | Notes |
|---|---|---|:-:|---|
| UI: add product | `addToCart()` | `engine.onItemAdded()` | 0 | sync |
| UI: change qty | `changeQty()` | `engine.evaluate()` | 150ms | debounce burst clicks |
| UI: remove item | `removeItem()` | `engine.onItemRemoved()` | 0 | sync + auto retract |
| UI: select member | `selectMember()` | `engine.onMemberChanged()` | 0 | recompute P6 |
| UI: apply custom | `applyDiscountAction()` | `engine.onCustomApplied()` | 0 | P1 override |
| UI: redeem coupon | `redeemCoupon(code)` | `engine.onCouponRedeem(code)` | 0 (async) | validate + apply |
| UI: user pick conflict | `handleConflict(choice)` | `engine.swap(old, new)` | 0 | sync |
| Timer: 60s tick | `setInterval` | `engine.onTimeTick()` | 60s | time-based promos |
| Timer: promo expires | derived | `engine.evaluate()` | — | countdown end |
| Pre-payment | `openPayment()` | `engine.finalize()` | 0 | hard lock |
| Post-payment | `completePay()` | `engine.commit(billId)` | 0 | persist audit |

### L8.2 AppliedPromo state machine

```
       ┌──────┐   qualify    ┌──────────┐   apply    ┌─────────┐
       │ IDLE │─────────────▶│AVAILABLE │───────────▶│ APPLIED │
       └──────┘              └──────────┘            └────┬────┘
          ▲                       │                       │
          │                       │ un-qualify            │ retract / remove
          │                       ▼                       │
          │                  ┌──────────┐                 │
          └──────────────────│ EXPIRED  │◀────────────────┘
                             └──────────┘
                                  │
            engine.finalize()     │  lock
                                  ▼
                             ┌──────────┐
                             │  LOCKED  │  (ห้ามแก้ — เข้า payment)
                             └──────────┘
```

### L8.3 Parallelism of state transitions

| Transition | Concurrent safe? | Lock scope | Why |
|---|:-:|---|---|
| IDLE → AVAILABLE | ✓ | per-promo | pure check |
| AVAILABLE → APPLIED | ◐ | per-bill | conflict detect ต้อง atomic |
| APPLIED → EXPIRED | ✓ | per-promo | retract indep. |
| APPLIED → LOCKED | ✕ | **bill-wide** | freeze ทุก promo พร้อมกัน |

**Rule:** ระหว่าง payment (state = LOCKED) ห้าม dispatch engine events ใดๆ — UI ต้อง disable

### L8.4 Data flow (single bill)

```
┌─────────────┐   item event   ┌─────────────┐   applied    ┌──────────────┐
│  Cart.items │───────────────▶│ PromoEngine │─────────────▶│ appliedPromos│
└─────────────┘                └──────┬──────┘              └──────┬───────┘
                                      │ evaluate()                 │
                                      ▼                            ▼
                              ┌──────────────┐           ┌──────────────────┐
                              │ availPromos  │           │  totals.compute()│
                              └──────────────┘           └──────┬───────────┘
                                                                ▼
                                                       ┌─────────────────┐
                                                       │   OrderSummary  │
                                                       └─────────────────┘
```

---

## Cross-Layer Index (quick lookup)

| Concern | Where |
|---|---|
| ต้องการรู้ว่าโปร A ชนกับ B ไหม? | L2.1 |
| ต้องการ kickoff sprint ไหน? | L4 |
| เจอ bug — ต้องแจ้งใครก่อน? | L6 (Owner) + L7 (RACI) |
| พัฒนา component ไหน parallel ได้? | L3.2 |
| Engine event ใหม่เข้า trigger ไหน? | L8.1 |
| ต้อง test cell ไหนเพิ่ม? | L5.1 + L5.2 |
| สถานะ applied promo เปลี่ยนเมื่อไหร่? | L8.2 |

---

## Appendix A — Parallelization Health Metrics

วัดความเป็น parallel ของโปรเจกต์จริง

| Metric | Formula | Target | Current (from matrix) |
|---|---|:-:|:-:|
| **Parallel ratio** | (parallel tasks) / (total tasks) | ≥ 70% | 86% (L5) |
| **Critical path ratio** | (CP length) / (total tiers) | ≤ 60% | 4/5 = 80% ⚠ |
| **Bottleneck count** | nodes with in-degree ≥ 4 | ≤ 2 | 2 (T2-1, T4-1) |
| **Cross-stream deps** | edges between streams | ≤ 5 | 4 |
| **Concurrent dev ceiling** | max(tier size) | ≥ 4 | 8 (T3) |

**Action items จาก metric:**
- ⚠ Critical path ratio สูง → split T2-1 engine เป็น sub-modules (evaluator/applier/finalizer) ให้ test ขนานได้มากขึ้น
- ✓ Parallel ratio 86% เหนือเป้า → รักษาไว้ด้วย strict TDD + mock discipline

## Appendix B — Parallel Execution Playbook

**Daily standup format** (15 min)
1. **Per stream** (2 min/stream × 4): ของ yesterday / today / blockers
2. **Merge points check** (5 min): S-current sprint มี integration กี่จุด
3. **Critical path health** (2 min): ใครถือเส้นสีแดงวันนี้

**When add new promo type:**
1. เพิ่ม row ใน L1, L2, L2.1, L5.1
2. ระบุ Trigger Event ใน L8.1
3. เพิ่ม failure mode ใน L6 (ถ้ามี)
4. Assign R/A ใน L7

**When dependency appears (blocks parallelism):**
1. เพิ่ม edge ใน L3.1 DAG
2. update L3.3 edge cases
3. re-evaluate Appendix A metrics

---

*เอกสารนี้เป็น living document — ทุก PR ที่แตะโครง promo ต้อง update matrix ด้วย*
*Reviewer ต้อง check DoD ใน `/CLAUDE.md` §6 ก่อน approve*
