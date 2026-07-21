<template>
  <div>
    <!-- ===================== PRE-ORDER CUSTOMER DISPLAY (จอ 2) ===================== -->
    <!-- ใช้ component เดียวกับผลลัพธ์จอ 1 ทั้งหมด (po-result-card/po-icon-*/po-badge ฯลฯ) — light theme
         เดียวกันทั้งระบบ ไม่มีธีมมืด/สีแยกสำหรับจอนี้ตามที่ยืนยันไว้ -->
    <div v-if="poIsCustomerDisplay" class="po-display-root">
      <template v-if="!poResult">
        <div class="po-idle-card">
          <div class="po-idle-icon"><i class="fa fa-utensils"></i></div>
          <div class="po-idle-title">ยินดีต้อนรับ</div>
          <div class="po-idle-meal">แตะบัตรเพื่อรับอาหาร Pre-Order</div>
        </div>
      </template>
      <template v-else-if="poResult.case === 'success'">
        <div class="po-result-card">
          <div class="po-result-icon po-icon-success"><i class="fa fa-check-circle"></i></div>
          <div class="po-result-title">ขอบคุณค่ะ/ครับ</div>
          <div class="po-result-name">{{ poResult.card && poResult.card.name }}</div>
          <div class="po-result-items">
            <div v-for="(it, i) in (poResult.reservation ? poResult.reservation.items : [])" :key="i" class="po-result-item-row"><span>{{ it.name }}</span><span>×{{ it.qty }}</span></div>
          </div>
        </div>
      </template>
      <template v-else-if="poResult.case === 'duplicate'">
        <div class="po-result-card">
          <div class="po-result-icon po-icon-warning"><i class="fa fa-triangle-exclamation"></i></div>
          <div class="po-result-title">รับอาหารไปแล้ว</div>
          <div class="po-result-name">{{ poResult.card && poResult.card.name }}</div>
        </div>
      </template>
      <template v-else-if="poResult.case === 'detail'">
        <div class="po-result-card">
          <div class="po-result-name">{{ poResult.card && poResult.card.name }}</div>
          <div class="po-result-items">
            <div v-for="(it, i) in (poResult.reservation ? poResult.reservation.items : [])" :key="i" class="po-result-item-row"><span>{{ it.name }}</span><span>×{{ it.qty }}</span></div>
          </div>
        </div>
      </template>
      <template v-else-if="poResult.case === 'case1'">
        <div class="po-result-card"><div class="po-result-icon po-icon-neutral"><i class="fa fa-circle-info"></i></div><div class="po-result-title">ไม่พบรายการจอง</div></div>
      </template>
      <template v-else-if="poResult.case === 'case2'">
        <div class="po-result-card">
          <div class="po-result-icon po-icon-warning"><i class="fa fa-triangle-exclamation"></i></div>
          <div class="po-result-title">จองไว้{{ poResult.period ? poResult.period.mealName : '' }}</div>
          <div class="po-result-sub">รับได้ {{ poFormatWindow(poResult.period) }}</div>
        </div>
      </template>
      <template v-else-if="poResult.case === 'case3'">
        <div class="po-result-card">
          <div class="po-result-icon po-icon-info"><i class="fa fa-clock"></i></div>
          <div class="po-result-title">ยังไม่ถึงเวลารับ</div>
          <div class="po-result-sub">เปิดรับ {{ poResult.period ? poResult.period.start : '' }} น.</div>
        </div>
      </template>
      <template v-else-if="poResult.case === 'case4'">
        <div class="po-result-card">
          <div class="po-result-icon po-icon-danger"><i class="fa fa-circle-xmark"></i></div>
          <div class="po-result-title">พ้นเวลารับแล้ว</div><div class="po-result-sub">กรุณาติดต่อพนักงาน</div>
        </div>
      </template>
      <template v-else-if="poResult.case === 'case5'">
        <div class="po-result-card"><div class="po-result-icon po-icon-neutral"><i class="fa fa-circle-info"></i></div><div class="po-result-title">ไม่พบข้อมูลบัตรนี้</div><div class="po-result-sub">กรุณาติดต่อพนักงาน</div></div>
      </template>
      <template v-else-if="poResult.case === 'case6'">
        <div class="po-result-card"><div class="po-result-icon po-icon-danger"><i class="fa fa-ban"></i></div><div class="po-result-title">บัตรถูกระงับใช้งาน</div><div class="po-result-sub">กรุณาติดต่อพนักงาน</div></div>
      </template>
      <template v-else-if="poResult.case === 'case7'">
        <div class="po-result-card"><div class="po-result-icon po-icon-danger"><i class="fa fa-ban"></i></div><div class="po-result-title">การจองนี้ถูกยกเลิกแล้ว</div><div class="po-result-sub">กรุณาติดต่อพนักงาน</div></div>
      </template>
      <template v-else-if="poResult.case === 'case8'">
        <div class="po-result-card"><div class="po-result-icon po-icon-warning"><i class="fa fa-circle-exclamation"></i></div><div class="po-result-title">ยังไม่ชำระเงิน</div><div class="po-result-sub">แจ้งพนักงานก่อนรับอาหาร</div></div>
      </template>
      <template v-else-if="poResult.case === 'case9-loading' || poResult.case === 'case9-timeout'">
        <div class="po-result-card"><div class="po-result-icon po-icon-neutral"><i class="fa fa-spinner fa-spin"></i></div><div class="po-result-title">กำลังตรวจสอบข้อมูล...</div></div>
      </template>
      <!-- §4.5 เคส B/C — fallback กลางเดียวกัน ไม่แยกรายละเอียดให้ลูกค้าเห็น (เคส A/D ไม่ส่งอะไรมาเลย จอนี้เลยไม่มี branch) -->
      <template v-else-if="poResult.case === 'hw-contact-staff'">
        <div class="po-result-card"><div class="po-result-icon po-icon-neutral"><i class="fa fa-circle-info"></i></div><div class="po-result-title">กรุณาติดต่อพนักงาน</div></div>
      </template>
    </div>

    <!-- ===================== BUFFET CUSTOMER DISPLAY (จอ 2) ===================== -->
    <!-- ใช้ component/token เดียวกับ Pre-Order (light theme เดียวกันทั้งระบบ) แต่ผลลัพธ์/BroadcastChannel แยกกันคนละตัว -->
    <div v-else-if="bufIsCustomerDisplay" class="po-display-root">
      <!-- §2.1/§8b — mirror 3 หน้าของเส้นทางสแกน QR (ระบุตัวตน/เลือกช่องทาง/นับถอยหลัง) -->
      <template v-if="bufQrDisplayStep === 'channel'">
        <div class="po-idle-card">
          <div class="po-idle-icon"><i class="fa fa-utensils"></i></div>
          <div class="po-idle-title">แตะบัตรเพื่อชำระเงิน</div>
          <div class="po-idle-meal">ยอดบุฟเฟต์ ฿{{ bufDisplayTier ? bufDisplayTier.price : 0 }}</div>
        </div>
      </template>
      <template v-else-if="bufQrDisplayStep === 'countdown'">
        <div class="po-idle-card">
          <div class="po-idle-icon" style="width:160px;height:160px;border-radius:12px;font-size:64px;background:#F2F2F7;color:#1C1C1E">
            <i class="fa fa-qrcode"></i>
          </div>
          <div class="po-idle-title">฿{{ bufDisplayTier ? bufDisplayTier.price : 0 }}</div>
          <div class="po-idle-meal">เหลือเวลา {{ Math.floor(bufQrDisplayCountdown / 60) }}:{{ String(bufQrDisplayCountdown % 60).padStart(2, '0') }} นาที</div>
        </div>
      </template>
      <template v-else-if="bufQrDisplayStep === 'cancelled'">
        <div class="po-result-card">
          <div class="po-result-icon po-icon-danger"><i class="fa fa-circle-xmark"></i></div>
          <div class="po-result-title">หมดเวลา — ยกเลิกรายการแล้ว</div>
        </div>
      </template>
      <template v-else-if="!bufResult">
        <div class="po-idle-card">
          <div class="po-idle-icon"><i class="fa fa-utensils"></i></div>
          <template v-if="bufDisplayTier">
            <div class="po-idle-title">แตะบัตรเพื่อชำระเงิน</div>
            <div class="po-idle-meal">ยอดบุฟเฟต์ ฿{{ bufDisplayTier.price }}</div>
          </template>
          <template v-else>
            <div class="po-idle-title">ยินดีต้อนรับ</div>
            <div class="po-idle-meal">บุฟเฟต์ — แตะบัตรเพื่อชำระเงิน</div>
          </template>
        </div>
      </template>
      <template v-else-if="bufResult.case === 'success'">
        <div class="po-result-card">
          <div class="po-result-icon po-icon-success"><i class="fa fa-check-circle"></i></div>
          <div class="po-result-title">ขอบคุณค่ะ</div>
          <div class="buf-display-amount">฿{{ bufResult.amount }}</div>
          <div class="po-result-sub" v-if="bufResult.balance !== null && bufResult.balance !== undefined">คงเหลือ ฿{{ bufResult.balance }}</div>
          <div class="po-result-time">{{ bufFormatDate(bufResult.date) }} · {{ bufResult.time }} น.</div>
        </div>
      </template>
      <!-- §4 บุฟเฟต์ (แก้ไข) — mirror เนื้อหาเดียวกับจอ 1 ทุกเคส ตัดแค่ error code ทางเทคนิคออก -->
      <template v-else-if="bufResult.case === 'buf-duplicate'">
        <div class="po-result-card">
          <div class="po-result-icon po-icon-warning"><i class="fa fa-triangle-exclamation"></i></div>
          <div class="po-result-title">มื้อนี้ชำระบุฟเฟต์ไปแล้ว</div>
          <div class="po-result-sub">{{ bufResult.name }} จ่ายไปแล้วเมื่อ {{ bufResult.time }}</div>
          <div class="po-result-sub">ถ้าจ่ายให้คนอื่น กรุณาใช้วิธีสแกน QR แทน</div>
        </div>
      </template>
      <template v-else-if="bufResult.case === 'buf-insufficient'">
        <div class="po-result-card">
          <div class="po-result-icon po-icon-warning"><i class="fa fa-circle-exclamation"></i></div>
          <div class="po-result-title">ยอดเงินไม่เพียงพอ</div>
          <div class="po-result-sub">ยอดที่ต้องจ่าย ฿{{ bufResult.amount }} · ยอดคงเหลือ ฿{{ bufResult.balance }}</div>
          <div class="po-result-sub">กรุณาเติมเงินหรือติดต่อพนักงาน · หรือเปลี่ยนไปใช้วิธีสแกน QR แทน</div>
        </div>
      </template>
      <template v-else-if="bufResult.case === 'case5'">
        <div class="po-result-card"><div class="po-result-icon po-icon-neutral"><i class="fa fa-circle-info"></i></div><div class="po-result-title">ไม่พบข้อมูลบัตรนี้</div><div class="po-result-sub">กรุณาติดต่อพนักงาน</div></div>
      </template>
      <template v-else-if="bufResult.case === 'case6'">
        <div class="po-result-card"><div class="po-result-icon po-icon-danger"><i class="fa fa-ban"></i></div><div class="po-result-title">บัตรถูกระงับใช้งาน</div><div class="po-result-sub">กรุณาติดต่อพนักงาน</div></div>
      </template>
      <template v-else-if="bufResult.case === 'hwB'">
        <div class="po-result-card"><div class="po-result-icon po-icon-warning"><i class="fa fa-id-card"></i></div><div class="po-result-title">อ่านบัตรไม่ได้ กรุณาติดต่อพนักงาน</div></div>
      </template>
      <template v-else-if="bufResult.case === 'hwC'">
        <div class="po-result-card"><div class="po-result-icon po-icon-danger"><i class="fa fa-screwdriver-wrench"></i></div><div class="po-result-title">เครื่องอ่านบัตรขัดข้อง กรุณาติดต่อพนักงาน</div></div>
      </template>
      <template v-else-if="bufResult.case === 'case9-loading' || bufResult.case === 'case9-timeout'">
        <div class="po-result-card"><div class="po-result-icon po-icon-neutral"><i class="fa fa-spinner fa-spin"></i></div><div class="po-result-title">กำลังตรวจสอบข้อมูล...</div></div>
      </template>
    </div>

    <!-- ===================== LOGIN ===================== -->
    <div v-else-if="appScreen === 'login'" class="upos-login">
      <div class="login-left">
        <div class="login-brand">
          <div class="login-logo-box"><i class="fa fa-cash-register"></i></div>
          <h1>UPOS</h1>
          <p>ระบบจุดขาย • Point of Sale</p>
          <div class="login-features">
            <div class="login-feature-item">
              <div class="login-feature-icon"><i class="fa fa-bolt"></i></div>
              <span>ระบบรวดเร็ว ใช้งานง่าย</span>
            </div>
            <div class="login-feature-item">
              <div class="login-feature-icon"><i class="fa fa-shield-alt"></i></div>
              <span>ปลอดภัย มั่นใจได้</span>
            </div>
            <div class="login-feature-item">
              <div class="login-feature-icon"><i class="fa fa-sync"></i></div>
              <span>ซิงค์ข้อมูลแบบเรียลไทม์</span>
            </div>
          </div>
        </div>
        <div class="login-copy">© 2026 UPOS Systems</div>
      </div>
      <div class="login-right">
        <div class="login-form-wrap">
          <h2>เข้าสู่ระบบ</h2>
          <p>Sign In</p>
          <div class="login-field">
            <i class="fa fa-user"></i>
            <input v-model="loginUsername" placeholder="ชื่อผู้ใช้ / รหัสพนักงาน" @keydown.enter="doLogin()">
          </div>
          <div class="login-field">
            <i class="fa fa-lock"></i>
            <input v-model="loginPassword" :type="loginShowPass ? 'text' : 'password'" placeholder="รหัสผ่าน" @keydown.enter="doLogin()">
            <i class="fa toggle-pass" :class="loginShowPass ? 'fa-eye-slash' : 'fa-eye'" @click="loginShowPass = !loginShowPass"></i>
          </div>
          <button class="btn-login" @click="doLogin()">เข้าสู่ระบบ</button>
          <p v-if="loginError" class="login-error">{{ loginError }}</p>
        </div>
      </div>
      <button class="login-settings-btn" @click="openSettings()"><i class="fa fa-cog"></i></button>
    </div>

    <!-- ===================== FEATURE SELECT ===================== -->
    <div v-else-if="appScreen === 'feature'" class="feature-layout">
      <aside class="pos-sidebar">
        <div class="sidebar-brand">
          <div class="sidebar-brand-icon"><i class="fa fa-cash-register"></i></div>
          <div class="sidebar-brand-text">
            <span class="brand-tag">POS</span>
            <span class="brand-name">UPOS</span>
            <div class="brand-sub">ระบบจุดขาย</div>
          </div>
        </div>
        <div class="sidebar-nav" style="flex:1">
          <div class="nav-divider" style="margin-top:8px"></div>
        </div>
        <div class="sidebar-bottom">
          <div class="sidebar-user">
            <div class="sidebar-user-avatar"><i class="fa fa-user"></i></div>
            <div>
              <div class="sidebar-user-name">{{ loginUsername }}</div>
              <div class="sidebar-user-role">admin</div>
            </div>
          </div>
          <div class="sidebar-branch">Central</div>
          <div class="nav-item" @click="appScreen='login'" style="margin:0 4px 4px">
            <i class="fa fa-sign-out-alt"></i><span>ออกจากระบบ</span>
          </div>
        </div>
      </aside>
      <div class="feature-content">
        <h1>เลือก Feature</h1>
        <p>เลือกโหมดการทำงานที่ต้องการใช้</p>
        <div class="feature-grid">
          <div class="feature-card" @click="appScreen = 'pos'">
            <div class="feature-card-icon fi-blue"><i class="fa fa-shopping-cart"></i></div>
            <div><div class="feature-card-name">ขาย</div><div class="feature-card-sub">POS Sale</div></div>
          </div>
          <div class="feature-card" @click="appScreen = 'kitchen-select'">
            <div class="feature-card-icon fi-red"><i class="fa fa-utensils"></i></div>
            <div><div class="feature-card-name">ครัว</div><div class="feature-card-sub">Kitchen Display</div></div>
          </div>
          <div class="feature-card" @click="appScreen = 'food-serving'">
            <div class="feature-card-icon fi-green"><i class="fa fa-concierge-bell"></i></div>
            <div><div class="feature-card-name">เสิร์ฟอาหาร</div><div class="feature-card-sub">Food Serving</div></div>
          </div>
          <div class="feature-card" @click="appScreen = 'food-delivery'">
            <div class="feature-card-icon fi-orange"><i class="fa fa-motorcycle"></i></div>
            <div><div class="feature-card-name">ส่งอาหาร</div><div class="feature-card-sub">Food Delivery</div></div>
          </div>
          <div class="feature-card">
            <div class="feature-card-icon fi-purple"><i class="fa fa-table"></i></div>
            <div><div class="feature-card-name">จัดการโต๊ะ</div><div class="feature-card-sub">Table Management</div></div>
          </div>
          <div class="feature-card" @click="appScreen = 'money-management'">
            <div class="feature-card-icon fi-teal"><i class="fa fa-wallet"></i></div>
            <div><div class="feature-card-name">การจัดการเงิน</div><div class="feature-card-sub">Money Management</div></div>
          </div>
          <div class="feature-card" @click="openPreOrderIdle()">
            <div class="feature-card-icon fi-blue"><i class="fa fa-id-card-clip"></i></div>
            <div><div class="feature-card-name">Pre-Order</div><div class="feature-card-sub">แตะบัตรรับอาหาร</div></div>
          </div>
          <div class="feature-card" @click="openBuffetTypeSelect()">
            <div class="feature-card-icon fi-orange"><i class="fa fa-utensils"></i></div>
            <div><div class="feature-card-name">บุฟเฟต์</div><div class="feature-card-sub">Walk-in แตะบัตรจ่ายเลย</div></div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== BUFFET: IDLE / TAP (จอ 1 walk-in) — §3.1/3.2/3.3/3.4 ===== -->
    <div v-else-if="appScreen === 'buffet-idle'" class="buf-lock-root">
      <div class="po-topbar">
        <button class="po-back-btn" @click="bufOpenIdleBackPin()"><i class="fa fa-chevron-left"></i> ย้อนกลับ (ต้องใส่รหัส)</button>
        <div>
          <h1 class="po-page-title">บุฟเฟต์ {{ bufSelectedTierInfo ? bufSelectedTierInfo.label : '' }}</h1>
          <span class="po-page-sub">Walk-in แตะบัตรจ่ายเลย · ฿{{ bufSelectedTierInfo ? bufSelectedTierInfo.price : 0 }}</span>
        </div>
        <div class="po-topbar-right">
          <div class="po-clock">{{ bufCurrentTime }}</div>
          <button class="po-btn-ghost" @click="bufOpenCustomerDisplay()"><i class="fa fa-tv"></i> เปิดจอลูกค้า</button>
        </div>
      </div>

      <div class="po-idle-body">
        <template v-if="!bufResult">
          <!-- §3.1 layout มาตรฐาน — แบ่งซ้าย-ขวา (ใช้ template เดียวกันทุกประเภทอาหาร) -->
          <div class="buf-tap-card">
            <div class="buf-tap-head">
              <span>หน้าแตะบัตร — เมนูบุฟเฟต์</span>
              <button class="buf-tap-menu-btn" @click="bufShowTestTools = !bufShowTestTools"><i class="fa fa-ellipsis"></i></button>
            </div>
            <div class="buf-tap-body">
              <div class="buf-tap-left">
                <span class="po-badge po-badge-ready" style="align-self:flex-start">บุฟเฟต์</span>
                <div class="buf-tap-info-row"><span>เลขบัตร</span><span>–</span></div>
                <div class="buf-tap-info-row"><span>ชื่อนักเรียน</span><span>–</span></div>
                <div class="buf-tap-info-row buf-tap-info-row--amount"><span>ยอดก่อนชำระ</span><span>{{ bufSelectedTierInfo ? bufSelectedTierInfo.price.toFixed(2) : '0.00' }}</span></div>
                <div class="buf-tap-bottom">
                  <div class="buf-tap-bottom-row"><i class="fa fa-money-bill-wave"></i> 0.00</div>
                  <div class="buf-tap-bottom-row"><i class="fa fa-qrcode"></i> 0.00</div>
                  <div class="buf-tap-bottom-date">{{ bufTapDateLabel }}</div>
                </div>
              </div>
              <div class="buf-tap-right">
                <div class="buf-tap-center">
                  <div class="po-idle-title">แตะบัตรเพื่อชำระเงิน</div>
                  <div class="buf-tap-card-icon"><i class="fa fa-credit-card"></i></div>
                  <input class="po-scan-input" v-model="bufCardInput" placeholder="พิมพ์เลขบัตรแล้วกด Enter" autofocus @keydown.enter="bufSubmitCardInput()">
                </div>
              </div>
            </div>
          </div>

          <div class="po-testtools">
            <button class="po-testtools-toggle" @click="bufShowTestTools = !bufShowTestTools">
              <i class="fa fa-flask"></i> เครื่องมือทดสอบ
              <i :class="['fa', bufShowTestTools ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
            </button>
            <div v-if="bufShowTestTools" class="po-testtools-panel">
              <button v-for="qp in bufQuickPicks" :key="qp.label" class="po-qp-btn" @click="bufQuickPickTap(qp)">{{ qp.label }}</button>
              <button class="po-qp-btn po-qp-btn--offline" :class="{ active: bufOfflineSim }" @click="bufToggleOfflineSim()">
                <i class="fa fa-wifi"></i> จำลองระบบออฟไลน์ ({{ bufOfflineSim ? 'เปิด' : 'ปิด' }})
              </button>
              <button class="po-qp-btn" @click="bufSimulateMisread()">แตะบัตรไม่สำเร็จ ({{ bufMisreadCount }}/3)</button>
              <button class="po-qp-btn" @click="bufSimulateReaderFailure()">เครื่องอ่านบัตรขัดข้อง</button>
              <button class="po-qp-btn" @click="bufDemoDebounce()">แตะซ้ำระหว่างประมวลผล (debounce)</button>
            </div>
          </div>
        </template>

        <!-- ===== RESULT OVERLAY ===== -->
        <div v-else class="po-result-card">
          <button v-if="['buf-insufficient', 'hwB', 'hwC', 'case9-timeout'].includes(bufResult.case)" class="po-result-close" @click="bufBackToIdle()">×</button>

          <template v-if="bufResult.case === 'success'">
            <div class="po-result-icon po-icon-success"><i class="fa fa-check-circle"></i></div>
            <div class="po-result-title">ชำระเงินสำเร็จ</div>
            <div class="po-result-name">{{ bufResult.card ? bufResult.card.name : bufResult.guestName }}</div>
            <div class="po-result-class">{{ bufResult.tier ? bufResult.tier.label : '' }} · บุฟเฟต์</div>
            <div class="buf-display-amount">฿{{ bufResult.amount }}</div>
            <div class="po-result-sub" v-if="bufResult.card">คงเหลือ ฿{{ bufResult.card.balance }}</div>
            <div class="po-result-time">{{ bufFormatDate(bufResult.tx.date) }} · {{ bufResult.tx.time }} น.</div>

            <!-- §2.1(7) — เฉพาะสาย QR (ไม่มี card ผูก) ถามเตรียมหน้าจอถัดไป auto 5 วิ -->
            <template v-if="!bufResult.card && bufNextScreenPrompt">
              <div class="nav-divider" style="margin:14px 0;width:100%"></div>
              <div class="po-result-sub">รายการถัดไปเตรียมหน้าจอแบบไหน?</div>
              <div style="display:flex;flex-direction:column;gap:8px;width:220px;margin-top:8px">
                <button class="po-btn-secondary" @click="bufNextScreenScanAgain()">สแกน QR ต่อ</button>
                <button class="po-btn-primary" @click="bufNextScreenGoIdle()">ไปหน้าแตะบัตร</button>
              </div>
            </template>
          </template>

          <template v-else-if="bufResult.case === 'buf-duplicate'">
            <div class="po-result-icon po-icon-warning"><i class="fa fa-triangle-exclamation"></i></div>
            <div class="po-result-title">มื้อนี้ชำระบุฟเฟต์ไปแล้ว</div>
            <div class="po-result-sub">{{ bufResult.card.name }} จ่ายไปแล้วเมื่อ {{ bufResult.time }}</div>
            <div class="po-result-sub">ถ้าจ่ายให้คนอื่น กรุณาใช้วิธีสแกน QR แทน</div>
          </template>

          <template v-else-if="bufResult.case === 'buf-insufficient'">
            <div class="po-result-icon po-icon-warning"><i class="fa fa-circle-exclamation"></i></div>
            <div class="po-result-title">ยอดเงินไม่เพียงพอ</div>
            <div class="po-result-sub">ยอดที่ต้องจ่าย ฿{{ bufResult.amount }} · ยอดคงเหลือ ฿{{ bufResult.balance }}</div>
            <div class="po-result-sub">กรุณาเติมเงินหรือติดต่อพนักงาน · หรือเปลี่ยนไปใช้วิธีสแกน QR แทน</div>
          </template>

          <template v-else-if="bufResult.case === 'case5'">
            <div class="po-result-icon po-icon-neutral"><i class="fa fa-circle-info"></i></div>
            <div class="po-result-title">ไม่พบข้อมูลบัตรนี้</div>
            <div class="po-result-sub">กรุณาติดต่อพนักงาน</div>
          </template>

          <template v-else-if="bufResult.case === 'case6'">
            <div class="po-result-icon po-icon-danger"><i class="fa fa-ban"></i></div>
            <div class="po-result-title">บัตรถูกระงับใช้งาน</div>
            <div class="po-result-sub">กรุณาติดต่อพนักงาน</div>
          </template>

          <template v-else-if="bufResult.case === 'case9-loading'">
            <div class="po-result-icon po-icon-neutral"><i class="fa fa-spinner fa-spin"></i></div>
            <div class="po-result-title">กำลังตรวจสอบข้อมูล...</div>
          </template>
          <template v-else-if="bufResult.case === 'case9-timeout'">
            <div class="po-result-icon po-icon-neutral"><i class="fa fa-wifi"></i></div>
            <div class="po-result-title">เชื่อมต่อไม่ได้ ลองใหม่อีกครั้ง</div>
            <button class="po-btn-secondary" @click="bufToggleOfflineSim(); bufBackToIdle()"><i class="fa fa-rotate-right"></i> ปิดโหมดทดสอบ / ลองใหม่</button>
          </template>

          <template v-else-if="bufResult.case === 'hwA'">
            <div class="po-result-icon po-icon-info"><i class="fa fa-arrows-rotate"></i></div>
            <div class="po-result-title">แตะบัตรอีกครั้ง</div>
          </template>
          <template v-else-if="bufResult.case === 'hwB'">
            <div class="po-result-icon po-icon-warning"><i class="fa fa-id-card"></i></div>
            <div class="po-result-title">อ่านบัตรไม่ได้ กรุณาติดต่อพนักงาน</div>
          </template>
          <template v-else-if="bufResult.case === 'hwC'">
            <div class="po-result-icon po-icon-danger"><i class="fa fa-screwdriver-wrench"></i></div>
            <div class="po-result-title">เครื่องอ่านบัตรขัดข้อง กรุณาติดต่อพนักงาน</div>
          </template>
          <template v-else-if="bufResult.case === 'hwD'">
            <div class="po-result-icon po-icon-neutral"><i class="fa fa-spinner fa-spin"></i></div>
            <div class="po-result-title">กำลังดำเนินการ กรุณารอสักครู่</div>
          </template>
        </div>
      </div>
    </div>

    <!-- ===================== MAIN POS / ORDERS ===================== -->
    <div v-else :class="appScreen === 'pos' ? 'pos-layout' : 'fullscreen-layout'">
      <!-- SIDEBAR -->
      <aside class="pos-sidebar">
        <div class="sidebar-brand">
          <div class="sidebar-brand-icon"><i class="fa fa-cash-register"></i></div>
          <div class="sidebar-brand-text">
            <span class="brand-tag">POS</span>
            <span class="brand-name">UPOS</span>
            <div class="brand-sub">ระบบจุดขาย</div>
          </div>
        </div>
        <nav class="sidebar-nav">
          <template v-if="appScreen === 'kitchen-select' || appScreen === 'kitchen-display'">
            <div class="nav-item active">
              <i class="fa fa-utensils"></i><span>ครัว</span>
            </div>
          </template>
          <template v-else-if="appScreen === 'food-serving'">
            <div class="nav-item active">
              <i class="fa fa-concierge-bell"></i><span>เสิร์ฟอาหาร</span>
            </div>
          </template>
          <template v-else-if="appScreen === 'food-delivery'">
            <div class="nav-item active">
              <i class="fa fa-motorcycle"></i><span>ส่งอาหาร</span>
            </div>
          </template>
          <template v-else-if="appScreen === 'preorder-idle'">
            <div class="nav-item active">
              <i class="fa fa-id-card-clip"></i><span>Pre-Order</span>
            </div>
          </template>
          <template v-else-if="appScreen === 'preorder-staff'">
            <div class="nav-item active">
              <i class="fa fa-clipboard-list"></i><span>ภาพรวม Pre-Order</span>
            </div>
          </template>
          <template v-else-if="appScreen === 'buffet-idle'">
            <div class="nav-item active">
              <i class="fa fa-utensils"></i><span>บุฟเฟต์</span>
            </div>
          </template>
          <template v-else-if="appScreen === 'buffet-staff'">
            <div class="nav-item active">
              <i class="fa fa-clipboard-list"></i><span>ภาพรวมบุฟเฟต์</span>
            </div>
          </template>
          <template v-else>
            <div class="nav-item" :class="{ active: appScreen === 'pos' }" @click="appScreen = 'pos'">
              <i class="fa fa-store"></i><span>หน้าขาย</span>
            </div>
            <div class="nav-item" :class="{ active: appScreen === 'orders' || appScreen === 'order-detail' }" @click="appScreen = 'orders'">
              <i class="fa fa-list-alt"></i><span>ออเดอร์</span>
            </div>
            <div class="nav-item" :class="{ active: appScreen === 'cancelled-orders' }" @click="appScreen = 'cancelled-orders'">
              <i class="fa fa-times-circle"></i><span>ยกเลิกออเดอร์</span>
            </div>
            <div class="nav-item" :class="{ active: appScreen === 'tax-invoice-list' || appScreen === 'tax-invoice-form' }" @click="appScreen = 'tax-invoice-list'">
              <i class="fa fa-file-invoice"></i><span>ใบกำกับภาษี</span>
            </div>
            <div class="nav-divider"></div>
            <div class="nav-item" @click="appScreen = 'food-serving'">
              <i class="fa fa-concierge-bell"></i><span>เสิร์ฟอาหาร</span>
            </div>
            <div class="nav-item">
              <i class="fa fa-border-none"></i><span>จัดการโต๊ะ</span>
            </div>
            <div class="nav-item">
              <i class="fa fa-users"></i><span>จัดการพนักงาน</span>
            </div>
          </template>
        </nav>
        <div class="sidebar-bottom">
          <div class="nav-divider"></div>
          <div class="nav-item" @click="appScreen = 'feature'" style="margin: 2px 4px;">
            <i class="fa fa-chevron-left"></i><span>ย้อนกลับ</span>
          </div>
          <div class="nav-item" @click="settingsOpen = true" style="margin: 2px 4px;">
            <i class="fa fa-cog"></i><span>ตั้งค่า</span>
          </div>
          <div class="nav-item" @click="logoutConfirm = true" style="margin: 2px 4px;">
            <i class="fa fa-sign-out-alt"></i><span>ออกจากระบบ</span>
          </div>
          <div class="sidebar-version">UPOS v1.0.0</div>
        </div>
      </aside>

      <!-- ===== POS MAIN CONTENT ===== -->
      <div v-if="appScreen === 'pos'" class="pos-main">
        <!-- Header -->
        <div class="pos-header">
          <div class="header-search">
            <i class="fa fa-search"></i>
            <input v-model="searchQ" placeholder="Search Product..." @keydown.enter="handleHeaderSearch">
          </div>
          <div class="header-branch">
            <i class="fa fa-store"></i>
            <span>{{ branches[selectedBranch].name }}</span>
          </div>
        </div>

        <!-- Screen Bar -->
        <div class="screen-bar">
          <button
            v-for="s in settings.posScreens"
            :key="s.id"
            class="screen-tab"
            :class="{ active: selectedScreen === s.id }"
            @click="selectScreen(s.id)"
          >
            <i class="fa" :class="s.icon"></i>
            {{ s.name }}
          </button>
        </div>

        <!-- Category Chips -->
        <div class="cat-chip-bar">
          <button
            v-for="c in visibleCategories"
            :key="c.id"
            class="cat-chip"
            :class="{ 'cat-chip--active': selectedCat === c.id }"
            @click="selectedCat = (c.id !== 'all' && selectedCat === c.id ? 'all' : c.id)"
          >
            <div class="cat-chip-icon-wrap">
              <i :class="['fa', 'fa-solid', c.icon]"></i>
            </div>
            <div class="cat-chip-info">
              <span class="cat-chip-name">{{ c.name }}</span>
              <span class="cat-chip-count">{{ catCount[c.id] ?? 0 }} รายการ</span>
            </div>
          </button>
        </div>

        <!-- Product Grid -->
        <div class="product-area">
          <div class="product-grid-new">
            <div
              v-for="p in displayedProducts"
              :key="p.id"
              class="prod-card-new"
              :class="{ 'in-cart': cartQty(p.id) > 0 }"
              @click="handleProduct(p)"
            >
              <div class="prod-card-img"
                :class="{ 'has-photo': p.imageUrl }"
                :style="p.imageUrl ? { backgroundImage: `url('${p.imageUrl}')` } : {}">
                <span v-if="!p.imageUrl" class="prod-emoji">{{ p.image }}</span>
                <div class="prod-price-tag">฿{{ p.price.toFixed(2) }}</div>
                <div v-if="cartQty(p.id) > 0" class="prod-qty-badge">{{ cartQty(p.id) }}</div>
                <div v-if="p.promos && p.promos.length" class="promo-dot">โปร</div>
                <div v-if="p.stock <= 10" class="stock-badge low">{{ p.stock }} Left</div>
                <div class="prod-card-overlay">
                  <div class="prod-card-name">{{ p.name }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- ─── EMPTY STATE ─── -->
          <div v-if="displayedProducts.length === 0" class="pos-empty-state">
            <div class="ti-empty-icon"><i class="fa fa-search"></i></div>
            <div class="ti-empty-title">ไม่พบสินค้า</div>
            <div class="ti-empty-desc">ลองค้นหาด้วยคำอื่น หรือเลือกหมวดหมู่อื่น</div>
            <button class="ti-btn-clear-filter" @click="searchQ = ''; selectedCat = 'all'">ล้างการค้นหา</button>
          </div>
        </div>
      </div>

      <!-- ===== ORDERS LIST ===== -->
      <div v-else-if="appScreen === 'orders'" class="orders-main">
        <div class="orders-page-header">
          <h1 class="orders-page-title">OrderList</h1>
          <div class="orders-filter-bar">
            <input class="orders-filter-input" v-model="orderFilterRoom" placeholder="ทดลองห้อง">
            <select class="orders-filter-select" v-model="orderFilterPayment">
              <option value="">สถานะการจ่ายเงิน</option>
              <option value="">ทั้งหมด</option>
              <option value="success">success</option>
              <option value="waiting">waiting</option>
              <option value="cancel">cancel</option>
            </select>
            <select class="orders-filter-select" v-model="orderFilterFood">
              <option value="">ทั้งหมด</option>
              <option value="pending">Pending</option>
              <option value="cooking">Cooking</option>
              <option value="sending">Sending</option>
              <option value="complete">Complete</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button class="orders-btn-search" @click="orderPage = 1"><i class="fa fa-search" style="margin-right:6px"></i>SEARCH</button>
            <button class="orders-btn-refresh" @click="orderFilterRoom = ''; orderFilterPayment = ''; orderFilterFood = ''; orderPage = 1"><i class="fa fa-sync" style="margin-right:6px"></i>REFRESH</button>
          </div>
        </div>
        <div class="orders-content-wrap">
          <div style="margin-bottom:14px">
            <button class="orders-btn-date"><i class="fa fa-calendar" style="margin-right:6px"></i>DATE</button>
          </div>
          <div class="orders-table-wrap">
            <table class="orders-table">
              <thead>
                <tr>
                  <th>ลำดับที่</th>
                  <th>เลขห้อง</th>
                  <th>เบอร์โทรศัพท์</th>
                  <th>เลขใบเสร็จ</th>
                  <th>วันที่ทำรายการ</th>
                  <th>ยอดเงินสุทธิ</th>
                  <th>สถานะการจ่ายเงิน</th>
                  <th>สถานะอาหาร</th>
                  <th>โน้ต</th>
                  <th>ตรวจสอบออเดอร์</th>
                </tr>
              </thead>
              <tbody>
                <!-- ─── LOADING SKELETON ─── -->
                <template v-if="ordersLoading">
                  <tr v-for="i in 5" :key="`sk-${i}`" class="ti-skeleton-row">
                    <td v-for="c in 10" :key="c"><div class="ti-skeleton-cell"></div></td>
                  </tr>
                </template>

                <!-- ─── DATA ROWS ─── -->
                <template v-else-if="paginatedOrders.length > 0">
                  <tr v-for="(ord, idx) in paginatedOrders" :key="ord.id">
                    <td>{{ (orderPage - 1) * rowsPerPage + idx + 1 }}</td>
                    <td>{{ ord.roomNo }}</td>
                    <td>{{ ord.phone }}</td>
                    <td>{{ ord.receiptNo }}</td>
                    <td>{{ ord.date }}</td>
                    <td>{{ ord.total }}</td>
                    <td>
                      <span v-if="ord.paymentStatus" :class="'order-status-badge pay-' + ord.paymentStatus">{{ ord.paymentStatus }}</span>
                      <span v-else style="color:#C7C7CC">-</span>
                    </td>
                    <td>
                      <span :class="'order-status-badge food-' + ord.foodStatus">{{ ord.foodStatus }}</span>
                    </td>
                    <td class="orders-note-cell">{{ ord.note || '—' }}</td>
                    <td>
                      <div style="display:flex;align-items:center;gap:8px">
                        <button class="orders-upstatus-btn" @click="cycleOrderStatus(ord)">UPSTATUS</button>
                        <button class="orders-detail-btn" @click="openOrderDetail(ord)"><i class="fa fa-clipboard-list"></i></button>
                      </div>
                    </td>
                  </tr>
                </template>

                <!-- ─── EMPTY STATE ─── -->
                <tr v-else>
                  <td colspan="10">
                    <div class="ti-empty-state">
                      <div class="ti-empty-icon"><i class="fa fa-clipboard-list"></i></div>
                      <div class="ti-empty-title">ไม่พบออเดอร์</div>
                      <div class="ti-empty-desc">ลองปรับเงื่อนไขการค้นหา</div>
                      <button class="ti-btn-clear-filter" @click="orderFilterRoom = ''; orderFilterPayment = ''; orderFilterFood = ''; orderPage = 1">ล้างตัวกรอง</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="orders-pagination">
            <span class="orders-pg-label">Rows per page: {{ rowsPerPage }}</span>
            <span class="orders-pg-count">{{ (orderPage-1)*rowsPerPage + 1 }}-{{ Math.min(orderPage*rowsPerPage, filteredOrders.length) }} of {{ filteredOrders.length }}</span>
            <button class="orders-pg-btn" :disabled="orderPage <= 1" @click="orderPage--"><i class="fa fa-chevron-left"></i></button>
            <button class="orders-pg-btn" :disabled="orderPage >= orderTotalPages" @click="orderPage++"><i class="fa fa-chevron-right"></i></button>
          </div>
        </div>
      </div>

      <!-- ===== ORDER DETAIL ===== -->
      <div v-else-if="appScreen === 'order-detail' && selectedOrder" class="orders-main">
        <div class="order-detail-page-header">
          <button class="ti-back-btn" @click="appScreen = orderDetailSource"><i class="fa fa-chevron-left"></i> กลับ</button>
          <h1 class="orders-page-title">ตรวจสอบออเดอร์</h1>
        </div>
        <div class="order-detail-layout">
          <div class="order-detail-left">
            <div class="order-detail-card">
              <div class="order-detail-ids">
                <div>เลขห้อง/โต๊ะ : <strong>{{ selectedOrder.roomNo }}</strong></div>
                <div style="margin-top:6px">เลขที่ใบเสร็จ : <strong>{{ selectedOrder.receiptNo }}</strong></div>
              </div>
              <div class="order-detail-meta">
                <div class="order-detail-meta-col">
                  <div class="order-detail-meta-label">ชื่อลูกค้า</div>
                  <div class="order-detail-meta-val">{{ selectedOrder.customerName }}</div>
                  <div class="order-detail-meta-label" style="margin-top:16px">วันที่/เวลา</div>
                  <div class="order-detail-meta-val">{{ selectedOrder.date }} {{ selectedOrder.time }}</div>
                </div>
                <div class="order-detail-meta-col">
                  <div class="order-detail-meta-label">HN/เบอร์ติดต่อ</div>
                  <div class="order-detail-meta-val">{{ selectedOrder.phone }}</div>
                  <div class="order-detail-meta-label" style="margin-top:16px">ช่องทางชำระ</div>
                  <div class="order-detail-meta-val">{{ selectedOrder.paymentMethod }}</div>
                </div>
              </div>
              <table class="order-detail-items-table">
                <thead>
                  <tr>
                    <th>รายการ</th>
                    <th style="text-align:center;width:80px">จำนวน</th>
                    <th style="text-align:right;width:90px">ราคา</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, i) in selectedOrder.items" :key="i">
                    <td>
                      <div style="font-weight:500;display:flex;align-items:center;gap:6px;flex-wrap:wrap">
                        {{ item.name }}
                        <span v-if="item.promoLabel" class="order-item-promo-badge">{{ item.promoLabel }}</span>
                      </div>
                      <div v-if="item.originalPrice && item.originalPrice !== item.price" class="order-item-original-price">
                        ราคาปกติ ฿{{ item.originalPrice.toFixed(2) }}
                      </div>
                      <div v-for="opt in item.options" :key="opt" class="order-detail-item-opt">• {{ opt }}</div>
                      <div v-if="item.note" class="order-detail-item-note">หมายเหตุ: {{ item.note }}</div>
                    </td>
                    <td style="text-align:center">{{ item.qty }}</td>
                    <td style="text-align:right">{{ item.price.toFixed(2) }}</td>
                  </tr>
                </tbody>
              </table>
              <div v-if="selectedOrder.note" class="order-detail-note-row">
                <div class="order-detail-note-label">หมายเหตุออเดอร์</div>
                <div class="order-detail-note-val">{{ selectedOrder.note }}</div>
              </div>
            </div>
          </div>
          <div class="order-detail-right">
            <div class="order-summary-card">
              <div class="order-summary-title">สรุปยอดชำระ</div>
              <div class="order-summary-row"><span>รวม</span><span>{{ selectedOrder.subtotal.toFixed(2) }} ฿</span></div>
              <div class="order-summary-row"><span>ส่วนลด</span><span>{{ selectedOrder.discount.toFixed(2) }} ฿</span></div>
              <template v-if="selectedOrder.promos && selectedOrder.promos.length">
                <div class="order-summary-promo-title">โปรโมชั่นที่ใช้</div>
                <div v-for="(promo, pi) in selectedOrder.promos" :key="pi" class="order-summary-promo-row">
                  <span>{{ promo.label }}</span>
                  <span>-{{ promo.discount.toFixed(2) }} ฿</span>
                </div>
              </template>
              <div class="order-summary-row"><span>VAT 7%</span><span>{{ selectedOrder.vat.toFixed(2) }} ฿</span></div>
              <div class="order-summary-row"><span>Service Charge 10%</span><span>{{ selectedOrder.sc.toFixed(2) }} ฿</span></div>
              <div class="order-summary-total">
                <span>ชำระทั้งหมด</span>
                <span class="order-summary-total-amount">{{ selectedOrder.total.toFixed(2) }} ฿</span>
              </div>
            </div>
            <div class="order-detail-actions">
              <button v-if="!selectedOrder.isCancelled && selectedOrder.paymentStatus !== 'success'" class="order-action-btn edit" @click="addToast('แก้ไขออเดอร์ (Demo)', 'info')">
                <i class="fa fa-pencil-alt"></i> แก้ไขออเดอร์
              </button>
              <button class="order-action-btn print" @click="addToast('พิมพ์ออเดอร์ (Demo)', 'info')">
                <i class="fa fa-print"></i> พิมพ์ออเดอร์
              </button>
              <button v-if="!selectedOrder.isCancelled" class="order-action-btn cancel" @click="openCancelOrderModal()">
                <i class="fa fa-times-circle"></i> ยกเลิกออเดอร์
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== CANCELLED ORDERS ===== -->
      <div v-else-if="appScreen === 'cancelled-orders'" class="orders-main">
        <div class="orders-page-header">
          <h1 class="orders-page-title">ยกเลิกออเดอร์</h1>
          <div class="orders-filter-bar">
            <input class="orders-filter-input" v-model="cancelledFilterSearch" placeholder="ค้นหาเลขใบเสร็จ / ห้อง">
            <button class="orders-btn-date"><i class="fa fa-calendar" style="margin-right:6px"></i>DATE</button>
            <select class="orders-filter-select" v-model="cancelledFilterPayment">
              <option value="">สถานะการจ่ายเงิน</option>
              <option value="">ทั้งหมด</option>
              <option value="success">ชำระแล้ว</option>
              <option value="waiting">รอชำระ</option>
              <option value="">ยังไม่ชำระ</option>
            </select>
          </div>
        </div>
        <div class="orders-content-wrap">
          <div class="orders-table-wrap">
            <table class="orders-table">
              <thead>
                <tr>
                  <th>ลำดับที่</th>
                  <th>เลขห้อง</th>
                  <th>เลขใบเสร็จ</th>
                  <th>วันที่</th>
                  <th>ยอดรวม</th>
                  <th>สถานะการจ่ายเงิน</th>
                  <th>เหตุผลยกเลิก</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <template v-if="paginatedCancelledOrders.length > 0">
                  <tr v-for="(ord, idx) in paginatedCancelledOrders" :key="ord.receiptNo">
                    <td>{{ (cancelledPage - 1) * rowsPerPage + idx + 1 }}</td>
                    <td>{{ ord.roomNo }}</td>
                    <td>{{ ord.receiptNo }}</td>
                    <td>{{ ord.date }}</td>
                    <td>{{ ord.total.toFixed(2) }} ฿</td>
                    <td>
                      <span v-if="ord.paymentStatus === 'success'" class="order-status-badge pay-success">ชำระแล้ว</span>
                      <span v-else-if="ord.paymentStatus === 'waiting'" class="order-status-badge pay-waiting">รอชำระ</span>
                      <span v-else class="cancelled-badge">ยังไม่ชำระ</span>
                    </td>
                    <td>{{ ord.cancelReason }}</td>
                    <td>
                      <button class="orders-detail-btn" @click="openOrderDetail(ord, 'cancelled-orders')"><i class="fa fa-clipboard-list"></i></button>
                    </td>
                  </tr>
                </template>
                <tr v-else>
                  <td colspan="8">
                    <div class="ti-empty-state">
                      <div class="ti-empty-icon"><i class="fa fa-times-circle"></i></div>
                      <div class="ti-empty-title">ไม่มีออเดอร์ที่ยกเลิก</div>
                      <div class="ti-empty-desc">ออเดอร์ที่ถูกยกเลิกจะแสดงที่นี่</div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="orders-pagination">
            <span class="orders-pg-label">Rows per page: {{ rowsPerPage }}</span>
            <span class="orders-pg-count">{{ paginatedCancelledOrders.length > 0 ? (cancelledPage-1)*rowsPerPage+1 : 0 }}-{{ Math.min(cancelledPage*rowsPerPage, filteredCancelledOrders.length) }} of {{ filteredCancelledOrders.length }}</span>
            <button class="orders-pg-btn" :disabled="cancelledPage <= 1" @click="cancelledPage--"><i class="fa fa-chevron-left"></i></button>
            <button class="orders-pg-btn" :disabled="cancelledPage >= cancelledTotalPages" @click="cancelledPage++"><i class="fa fa-chevron-right"></i></button>
          </div>
        </div>
      </div>

      <!-- ===== TAX INVOICE LIST ===== -->
      <div v-else-if="appScreen === 'tax-invoice-list'" class="tax-invoice-main">
        <div class="tax-invoice-page-header">
          <button class="ti-back-btn" @click="appScreen = 'pos'"><i class="fa fa-chevron-left"></i></button>
          <h1 class="ti-page-title">รายการยอดขาย</h1>
        </div>
        <div class="ti-content-wrap">
          <div class="ti-filter-card">
            <div class="ti-filter-label">ตัวกรองและค้นหา</div>
            <div class="ti-filter-row">
              <div class="ti-filter-group">
                <label>วันที่</label>
                <input type="date" class="ti-input" v-model="taxFilter.date" placeholder="เลือกวันที่">
              </div>
              <div class="ti-filter-group">
                <label>ช่องทางการชำระ</label>
                <select class="ti-select" v-model="taxFilter.paymentMethod">
                  <option value="">ทั้งหมด</option>
                  <option>แม่ณี</option>
                  <option>เงินสด</option>
                  <option>พร้อมเพย์</option>
                  <option>คูปอง</option>
                  <option>เครดิต/เดบิต</option>
                </select>
              </div>
              <div class="ti-filter-group" style="flex:1">
                <label>ค้นหา</label>
                <input class="ti-input" style="width:100%" v-model="taxFilter.search" placeholder="ค้นหาชื่อลูกค้า, เลขใบเสร็จ">
              </div>
              <button class="ti-btn-search" @click="taxPage = 1"><i class="fa fa-search" style="margin-right:4px"></i>ค้นหา</button>
              <button class="ti-btn-refresh" @click="resetTaxFilter()"><i class="fa fa-sync" style="margin-right:4px"></i>รีเฟรช</button>
            </div>
          </div>
          <div class="ti-count-badge">พบ {{ filteredTaxTransactions.length }} รายการ, หน้า {{ taxPage }} จาก {{ taxTotalPages }}</div>
          <div class="ti-table-wrap">
            <table class="ti-table">
              <thead>
                <tr>
                  <th>ลำดับ</th>
                  <th>เลขที่รายการ</th>
                  <th>วันที่รายการ</th>
                  <th>ร้านค้า</th>
                  <th>ช่องทางชำระ</th>
                  <th>สถานะอาหาร</th>
                  <th>สถานการชำระเงิน</th>
                  <th>ยอดรวม</th>
                  <th>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                <!-- ─── LOADING SKELETON ─── -->
                <template v-if="taxLoading">
                  <tr v-for="i in 5" :key="`sk-${i}`" class="ti-skeleton-row">
                    <td v-for="c in 9" :key="c"><div class="ti-skeleton-cell"></div></td>
                  </tr>
                </template>

                <!-- ─── DATA ROWS ─── -->
                <template v-else-if="paginatedTaxTransactions.length > 0">
                  <tr v-for="(tx, idx) in paginatedTaxTransactions" :key="tx.receiptNo">
                    <td>{{ (taxPage - 1) * taxRowsPerPage + idx + 1 }}</td>
                    <td>{{ tx.receiptNo }}</td>
                    <td>{{ tx.date }}</td>
                    <td>{{ tx.store }}</td>
                    <td>{{ tx.paymentMethod }}</td>
                    <td><span class="ti-badge-green">{{ tx.foodStatus }}</span></td>
                    <td><span class="ti-badge-green">{{ tx.paymentStatus }}</span></td>
                    <td>{{ tx.total.toFixed(2) }}</td>
                    <td><button class="ti-btn-manage" @click="openTaxInvoiceForm(tx)">จัดการ</button></td>
                  </tr>
                </template>

                <!-- ─── EMPTY STATE ─── -->
                <tr v-else>
                  <td colspan="9">
                    <div class="ti-empty-state">
                      <div class="ti-empty-icon"><i class="fa fa-file-invoice"></i></div>
                      <div class="ti-empty-title">ไม่พบรายการ</div>
                      <div class="ti-empty-desc">ลองปรับเงื่อนไขการค้นหา</div>
                      <button class="ti-btn-clear-filter" @click="resetTaxFilter()">ล้างตัวกรอง</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="ti-pagination">
            <span>แสดง {{ Math.min((taxPage-1)*taxRowsPerPage + 1, filteredTaxTransactions.length) }}-{{ Math.min(taxPage*taxRowsPerPage, filteredTaxTransactions.length) }} จาก {{ filteredTaxTransactions.length }} รายการ</span>
            <button class="ti-pg-btn" :disabled="taxPage <= 1" @click="taxPage--">ก่อนหน้า</button>
            <span class="ti-pg-current">หน้า {{ taxPage }} จาก {{ taxTotalPages }}</span>
            <button class="ti-pg-btn" :disabled="taxPage >= taxTotalPages" @click="taxPage++">ถัดไป</button>
          </div>
        </div>
      </div>

      <!-- ===== TAX INVOICE FORM ===== -->
      <div v-else-if="appScreen === 'tax-invoice-form' && selectedTaxTransaction" class="tax-invoice-main">
        <div class="tax-invoice-page-header">
          <button class="ti-back-btn" @click="appScreen = 'tax-invoice-list'"><i class="fa fa-chevron-left"></i></button>
          <h1 class="ti-page-title">ระบบจัดการใบกำกับภาษี</h1>
        </div>
        <div class="ti-content-wrap">
          <div class="ti-form-card">
            <div class="ti-form-top">
              <div>
                <div class="ti-invoice-title">ใบกำกับภาษี</div>
                <div class="ti-invoice-ref">อ้างอิงใบเสร็จ: {{ selectedTaxTransaction.receiptNo }}</div>
              </div>
              <div class="ti-form-top-right">
                <div class="ti-form-top-field">
                  <label>เลขที่ใบกำกับ:</label>
                  <input class="ti-field-input" v-model="taxInvoiceForm.invoiceNo">
                </div>
                <div class="ti-form-top-field">
                  <label>วันที่:</label>
                  <input class="ti-field-input" v-model="taxInvoiceForm.invoiceDate">
                </div>
              </div>
            </div>
            <div class="ti-two-col">
              <div class="ti-seller-card">
                <div class="ti-seller-header">
                  <div class="ti-seller-logo">SiS</div>
                  <div class="ti-seller-title">ข้อมูลผู้ขาย</div>
                </div>
                <div class="ti-seller-row"><span class="ti-seller-label">ชื่อผู้ขาย:</span><span>{{ settings.storeName }}</span></div>
                <div class="ti-seller-row"><span class="ti-seller-label">ที่อยู่:</span><span>{{ settings.storeAddress }}</span></div>
                <div class="ti-seller-row"><span class="ti-seller-label">เลขประจำตัวผู้เสียภาษี:</span><span>{{ settings.taxId }}</span></div>
                <div class="ti-seller-row"><span class="ti-seller-label">สาขา:</span><span>ทดสอบ</span></div>
                <div class="ti-seller-row"><span class="ti-seller-label">เบอร์โทรศัพท์:</span><span>ไม่ระบุ</span></div>
                <div class="ti-seller-row"><span class="ti-seller-label">อีเมล:</span><span>ไม่ระบุ</span></div>
              </div>
              <div class="ti-buyer-form">
                <div class="ti-form-section-title">ข้อมูลผู้ซื้อ</div>
                <div class="ti-buyer-list">
                  <div class="ti-form-field">
                    <label>ชื่อผู้ซื้อ</label>
                    <input class="ti-input" v-model="taxInvoiceForm.buyerName" placeholder="กรุณากรอกชื่อผู้ซื้อ">
                  </div>
                  <div class="ti-form-field">
                    <label>ที่อยู่</label>
                    <textarea class="ti-textarea" v-model="taxInvoiceForm.buyerAddress" placeholder="กรุณากรอกที่อยู่"></textarea>
                  </div>
                  <div class="ti-form-field">
                    <label>เลขประจำตัวผู้เสียภาษี</label>
                    <input class="ti-input" v-model="taxInvoiceForm.buyerTaxId" placeholder="กรุณากรอกเลขประจำตัวผู้เสียภาษี">
                  </div>
                  <div class="ti-form-field">
                    <label>สาขา</label>
                    <input class="ti-input" v-model="taxInvoiceForm.buyerBranch" placeholder="สำนักงานใหญ่">
                  </div>
                  <div class="ti-form-field">
                    <label>อีเมล</label>
                    <input class="ti-input" v-model="taxInvoiceForm.buyerEmail" placeholder="กรุณากรอกอีเมล">
                  </div>
                </div>
                <div class="ti-form-section-title" style="margin-top:14px">ช่องทางชำระเงิน</div>
                <div class="ti-buyer-list">
                  <div class="ti-form-field">
                    <label>ช่องทาง</label>
                    <select class="ti-select" v-model="taxInvoiceForm.paymentMethod">
                      <option>แม่ณี</option>
                      <option>เงินสด</option>
                      <option>พร้อมเพย์</option>
                      <option>คูปอง</option>
                      <option>เครดิต/เดบิต</option>
                      <option>QR Code</option>
                    </select>
                  </div>
                </div>
                <div class="ti-form-section-title" style="margin-top:14px">หมายเหตุ</div>
                <div class="ti-buyer-list">
                  <div class="ti-form-field">
                    <textarea class="ti-textarea" v-model="taxInvoiceForm.notes" placeholder="กรุณากรอกหมายเหตุ (ถ้ามี)"></textarea>
                  </div>
                </div>
              </div>
            </div>
            <div class="ti-items-section">
              <div class="ti-items-title">รายการสินค้า</div>
              <table class="ti-items-table">
                <thead>
                  <tr>
                    <th>ลำดับ</th>
                    <th>รหัสสินค้า</th>
                    <th>รายการ</th>
                    <th>จำนวน</th>
                    <th>หน่วย</th>
                    <th>ราคาต่อหน่วย</th>
                    <th>จำนวนเงิน</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, i) in selectedTaxTransaction.items" :key="i">
                    <td>{{ i + 1 }}</td>
                    <td>{{ item.sku }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.qty }}</td>
                    <td>{{ item.unit }}</td>
                    <td>฿{{ item.price.toFixed(2) }}</td>
                    <td>฿{{ item.amount.toFixed(2) }}</td>
                  </tr>
                </tbody>
              </table>
              <div class="ti-summary-wrap">
                <div class="ti-summary-box">
                  <div class="ti-summary-row">
                    <span>ยอดรวมก่อนภาษี</span>
                    <span>฿{{ taxInvoiceSubtotal.toFixed(2) }}</span>
                  </div>
                  <div class="ti-summary-row">
                    <span>ภาษีมูลค่าเพิ่ม 7%</span>
                    <span>฿{{ taxInvoiceVat.toFixed(2) }}</span>
                  </div>
                  <div class="ti-summary-total">
                    <span>ยอดรวมทั้งสิ้น</span>
                    <span class="ti-total-amount">฿{{ taxInvoiceGrand.toFixed(2) }}</span>
                  </div>
                  <div class="ti-summary-words">{{ numberToThaiWords(taxInvoiceGrand) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="ti-action-bar">
          <button class="ti-btn-clear" @click="clearTaxInvoiceForm()"><i class="fa fa-times" style="margin-right:6px"></i>ล้างข้อมูล</button>
          <button class="ti-btn-save" @click="saveTaxInvoice()"><i class="fa fa-save" style="margin-right:6px"></i>บันทึก/พิมพ์ใบกำกับภาษี</button>
          <button class="ti-btn-copy" @click="printCopyTaxInvoice()"><i class="fa fa-copy" style="margin-right:6px"></i>พิมพ์สำเนาใบกำกับภาษี</button>
        </div>
      </div>

      <!-- ===== FOOD SERVING ===== -->
      <div v-else-if="appScreen === 'food-serving'" class="fs-main">
        <div class="fs-topbar">
          <div class="fs-topbar-left">
            <h1 class="fs-page-title">เสิร์ฟอาหาร</h1>
            <span class="fs-page-sub">Food Serving</span>
          </div>
          <div class="fs-topbar-right">
            <div class="fs-stat-chip fs-stat-pending">
              <i class="fa fa-hourglass-half"></i>
              <span>{{ ordersData.filter(o => o.foodStatus === 'pending').length }} รอรับ</span>
            </div>
            <div class="fs-stat-chip fs-stat-cooking">
              <i class="fa fa-fire"></i>
              <span>{{ ordersData.filter(o => o.foodStatus === 'cooking').length }} กำลังทำ</span>
            </div>
            <div class="fs-clock">{{ fsCurrentTime }}</div>
          </div>
        </div>

        <div class="fs-board">
          <!-- PENDING -->
          <div class="fs-col">
            <div class="fs-col-head">
              <div class="fs-col-label fs-col-label--pending"><i class="fa fa-hourglass-half"></i> Pending</div>
              <span class="fs-col-badge fs-col-badge--pending">{{ ordersData.filter(o => o.foodStatus === 'pending').length }}</span>
            </div>
            <div class="fs-col-body">
              <div v-for="ord in ordersData.filter(o => o.foodStatus === 'pending')" :key="ord.id"
                :class="['fs-card', fsOverdueMinutes(ord.time) >= 15 ? 'fs-card--overdue' : '']">
                <div class="fs-card-top">
                  <span class="fs-card-room">{{ ord.roomNo }}</span>
                  <span class="fs-card-time">{{ ord.time }}</span>
                </div>
                <div class="fs-card-customer">{{ ord.customerName }}</div>
                <div v-if="fsOverdueMinutes(ord.time) >= 15" class="fs-card-overdue-badge">
                  <i class="fa fa-clock"></i> รอนาน {{ fsOverdueMinutes(ord.time) }} นาที
                </div>
                <div class="fs-card-items">
                  <div v-for="(item, i) in ord.items" :key="i" class="fs-item-row">
                    <span class="fs-item-qty">×{{ item.qty }}</span>
                    <span class="fs-item-name">{{ item.name }}</span>
                  </div>
                </div>
                <div v-if="ord.note" class="fs-card-note"><i class="fa fa-sticky-note"></i> {{ ord.note.split(',')[0] }}</div>
                <button class="fs-btn-items" @click="openItemModal(ord)"><i class="fa fa-list-ul"></i> ดูรายการเมนู</button>
                <div class="fs-card-actions">
                  <button class="fs-btn-primary" @click="updateFoodStatus(ord, 'cooking')"><i class="fa fa-fire"></i> รับออเดอร์</button>
                  <button class="fs-btn-ghost-red" @click="fsCancelConfirm(ord)"><i class="fa fa-times"></i></button>
                </div>
              </div>
              <div v-if="ordersData.filter(o => o.foodStatus === 'pending').length === 0" class="fs-col-empty">
                <i class="fa fa-check-circle"></i><span>ไม่มีออเดอร์รอ</span>
              </div>
            </div>
          </div>

          <!-- COOKING -->
          <div class="fs-col">
            <div class="fs-col-head">
              <div class="fs-col-label fs-col-label--cooking"><i class="fa fa-fire"></i> Cooking</div>
              <span class="fs-col-badge fs-col-badge--cooking">{{ ordersData.filter(o => o.foodStatus === 'cooking').length }}</span>
            </div>
            <div class="fs-col-body">
              <div v-for="ord in ordersData.filter(o => o.foodStatus === 'cooking')" :key="ord.id"
                :class="['fs-card', fsOverdueMinutes(ord.time) >= 30 ? 'fs-card--overdue' : '']">
                <div class="fs-card-top">
                  <span class="fs-card-room">{{ ord.roomNo }}</span>
                  <span class="fs-card-time">{{ ord.time }}</span>
                </div>
                <div class="fs-card-customer">{{ ord.customerName }}</div>
                <div v-if="fsOverdueMinutes(ord.time) >= 30" class="fs-card-overdue-badge">
                  <i class="fa fa-clock"></i> ทำนาน {{ fsOverdueMinutes(ord.time) }} นาที
                </div>
                <div class="fs-card-items">
                  <div v-for="(item, i) in ord.items" :key="i" class="fs-item-row">
                    <span class="fs-item-qty">×{{ item.qty }}</span>
                    <span class="fs-item-name">{{ item.name }}</span>
                  </div>
                </div>
                <div v-if="ord.note" class="fs-card-note"><i class="fa fa-sticky-note"></i> {{ ord.note.split(',')[0] }}</div>
                <button class="fs-btn-items" @click="openItemModal(ord)"><i class="fa fa-list-ul"></i> ดูรายการเมนู</button>
                <div class="fs-card-actions">
                  <button class="fs-btn-success" @click="updateFoodStatus(ord, 'sending')"><i class="fa fa-paper-plane"></i> ส่งอาหาร</button>
                </div>
              </div>
              <div v-if="ordersData.filter(o => o.foodStatus === 'cooking').length === 0" class="fs-col-empty">
                <i class="fa fa-utensils"></i><span>ไม่มีออเดอร์กำลังทำ</span>
              </div>
            </div>
          </div>

          <!-- SENDING -->
          <div class="fs-col">
            <div class="fs-col-head">
              <div class="fs-col-label fs-col-label--sending"><i class="fa fa-paper-plane"></i> Sending</div>
              <span class="fs-col-badge fs-col-badge--sending">{{ ordersData.filter(o => o.foodStatus === 'sending').length }}</span>
            </div>
            <div class="fs-col-body">
              <div v-for="ord in ordersData.filter(o => o.foodStatus === 'sending')" :key="ord.id" class="fs-card fs-card--muted">
                <div class="fs-card-top">
                  <span class="fs-card-room">{{ ord.roomNo }}</span>
                  <span class="fs-card-time">{{ ord.time }}</span>
                </div>
                <div class="fs-card-customer">{{ ord.customerName }}</div>
                <div v-if="ord.paymentStatus !== 'success'" class="fs-card-unpaid-badge">
                  <i class="fa fa-exclamation-circle"></i> ยังไม่ชำระเงิน
                </div>
                <div class="fs-card-items">
                  <div v-for="(item, i) in ord.items" :key="i" class="fs-item-row">
                    <span class="fs-item-qty">×{{ item.qty }}</span>
                    <span class="fs-item-name">{{ item.name }}</span>
                  </div>
                </div>
                <button class="fs-btn-items" @click="openItemModal(ord)"><i class="fa fa-list-ul"></i> ดูรายการเมนู</button>
                <div class="fs-card-actions">
                  <button class="fs-btn-complete" @click="fdCheckPayment(ord)"><i class="fa fa-check-double"></i> เสร็จสิ้น</button>
                  <button class="fs-btn-ghost-red" @click="fsCancelConfirm(ord)"><i class="fa fa-times"></i></button>
                </div>
              </div>
              <div v-if="ordersData.filter(o => o.foodStatus === 'sending').length === 0" class="fs-col-empty">
                <i class="fa fa-paper-plane"></i><span>ไม่มีออเดอร์กำลังส่ง</span>
              </div>
            </div>
          </div>

          <!-- COMPLETE -->
          <div class="fs-col">
            <div class="fs-col-head">
              <div class="fs-col-label fs-col-label--complete"><i class="fa fa-check-circle"></i> Complete</div>
              <span class="fs-col-badge fs-col-badge--complete">{{ ordersData.filter(o => o.foodStatus === 'complete').length }}</span>
            </div>
            <div class="fs-col-body">
              <div v-for="ord in ordersData.filter(o => o.foodStatus === 'complete')" :key="ord.id" class="fs-card fs-card--complete">
                <div class="fs-card-top">
                  <span class="fs-card-room">{{ ord.roomNo }}</span>
                  <span class="fs-card-time">{{ ord.time }}</span>
                </div>
                <div class="fs-card-customer">{{ ord.customerName }}</div>
                <div class="fs-card-items">
                  <div v-for="(item, i) in ord.items" :key="i" class="fs-item-row">
                    <span class="fs-item-qty">×{{ item.qty }}</span>
                    <span class="fs-item-name">{{ item.name }}</span>
                  </div>
                </div>
                <button class="fs-btn-items" @click="openItemModal(ord)"><i class="fa fa-list-ul"></i> ดูรายการเมนู</button>
                <div class="fs-card-status-label fs-card-status-label--complete"><i class="fa fa-check-circle"></i> เสร็จสิ้น</div>
              </div>
              <div v-if="ordersData.filter(o => o.foodStatus === 'complete').length === 0" class="fs-col-empty">
                <i class="fa fa-check-circle"></i><span>ยังไม่มีออเดอร์เสร็จ</span>
              </div>
            </div>
          </div>

          <!-- CANCELLED -->
          <div class="fs-col">
            <div class="fs-col-head">
              <div class="fs-col-label fs-col-label--cancelled"><i class="fa fa-ban"></i> Cancelled</div>
              <span class="fs-col-badge fs-col-badge--cancelled">{{ ordersData.filter(o => o.foodStatus === 'cancelled').length }}</span>
            </div>
            <div class="fs-col-body">
              <div v-for="ord in ordersData.filter(o => o.foodStatus === 'cancelled')" :key="ord.id" class="fs-card fs-card--cancelled">
                <div class="fs-card-top">
                  <span class="fs-card-room">{{ ord.roomNo }}</span>
                  <span class="fs-card-time">{{ ord.time }}</span>
                </div>
                <div class="fs-card-customer fs-card-customer--faded">{{ ord.customerName }}</div>
                <div class="fs-card-items fs-card-items--struck">
                  <div v-for="(item, i) in ord.items" :key="i" class="fs-item-row">
                    <span class="fs-item-qty">×{{ item.qty }}</span>
                    <span class="fs-item-name">{{ item.name }}</span>
                  </div>
                </div>
                <button class="fs-btn-items" @click="openItemModal(ord)"><i class="fa fa-list-ul"></i> ดูรายการเมนู</button>
                <div class="fs-card-status-label fs-card-status-label--cancelled"><i class="fa fa-ban"></i> ยกเลิกแล้ว</div>
              </div>
              <div v-if="ordersData.filter(o => o.foodStatus === 'cancelled').length === 0" class="fs-col-empty">
                <i class="fa fa-smile"></i><span>ไม่มีออเดอร์ยกเลิก</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Cancel Confirm Modal -->
        <div v-if="fsCancelModal" class="modal-overlay" @click.self="fsCancelModal = false; fsCancelTarget = null">
          <div class="fs-cancel-modal">
            <div class="fs-cancel-icon"><i class="fa fa-exclamation-triangle"></i></div>
            <div class="fs-cancel-title">ยืนยันการยกเลิกออเดอร์</div>
            <div class="fs-cancel-body">
              ต้องการยกเลิกออเดอร์หมายเลข
              <span class="fs-cancel-order-no">{{ fsCancelTarget ? fsCancelTarget.roomNo : '' }}</span>
              ใช่หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้
            </div>
            <div v-if="fsCancelTarget && fsCancelTarget.customerName" class="fs-cancel-customer">
              <i class="fa fa-user"></i> {{ fsCancelTarget.customerName }}
            </div>
            <label class="cancel-reason-label" style="margin-top:12px">เหตุผลการยกเลิก *</label>
            <textarea class="cancel-reason-textarea" v-model="fsCancelReason" placeholder="ระบุเหตุผลการยกเลิก..." rows="3"></textarea>
            <div class="fs-cancel-actions">
              <button class="fs-cancel-btn-no" @click="fsCancelModal = false; fsCancelTarget = null; fsCancelReason = ''">ยกเลิก</button>
              <button class="fs-cancel-btn-yes" :disabled="!fsCancelReason.trim()" @click="fsCancelModal = false; openCancelPin('food')">ยืนยันการยกเลิก</button>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== FOOD DELIVERY ===== -->
      <div v-else-if="appScreen === 'food-delivery'" class="fs-main">
        <div class="fs-topbar">
          <div class="fs-topbar-left">
            <h1 class="fs-page-title">ส่งอาหาร</h1>
            <span class="fs-page-sub">Food Delivery</span>
          </div>
          <div class="fs-topbar-right">
            <div class="fs-stat-chip fs-stat-cooking">
              <i class="fa fa-fire"></i>
              <span>{{ ordersData.filter(o => o.foodStatus === 'cooking').length }} กำลังทำ</span>
            </div>
            <div class="fs-stat-chip fs-stat-sending">
              <i class="fa fa-paper-plane"></i>
              <span>{{ ordersData.filter(o => o.foodStatus === 'sending').length }} กำลังส่ง</span>
            </div>
            <div class="fs-stat-chip fs-stat-complete">
              <i class="fa fa-check-circle"></i>
              <span>{{ ordersData.filter(o => o.foodStatus === 'complete').length }} เสร็จสิ้น</span>
            </div>
            <div class="fs-clock">{{ fsCurrentTime }}</div>
          </div>
        </div>

        <div class="fs-board">
          <!-- COOKING -->
          <div class="fs-col">
            <div class="fs-col-head">
              <div class="fs-col-label fs-col-label--cooking"><i class="fa fa-fire"></i> Cooking</div>
              <span class="fs-col-badge fs-col-badge--cooking">{{ ordersData.filter(o => o.foodStatus === 'cooking').length }}</span>
            </div>
            <div class="fs-col-body">
              <div v-for="ord in ordersData.filter(o => o.foodStatus === 'cooking')" :key="ord.id"
                :class="['fs-card', fsOverdueMinutes(ord.time) >= 30 ? 'fs-card--overdue' : '']">
                <div class="fs-card-top">
                  <span class="fs-card-room">{{ ord.roomNo }}</span>
                  <span class="fs-card-time">{{ ord.time }}</span>
                </div>
                <div class="fs-card-customer">{{ ord.customerName }}</div>
                <div v-if="fsOverdueMinutes(ord.time) >= 30" class="fs-card-overdue-badge">
                  <i class="fa fa-clock"></i> ทำนาน {{ fsOverdueMinutes(ord.time) }} นาที
                </div>
                <div class="fs-card-items">
                  <div v-for="(item, i) in ord.items" :key="i" class="fs-item-row">
                    <span class="fs-item-qty">×{{ item.qty }}</span>
                    <span class="fs-item-name">{{ item.name }}</span>
                  </div>
                </div>
                <div v-if="ord.note" class="fs-card-note"><i class="fa fa-sticky-note"></i> {{ ord.note.split(',')[0] }}</div>
                <button class="fs-btn-items" @click="openItemModal(ord)"><i class="fa fa-list-ul"></i> ดูรายการเมนู</button>
                <div class="fs-card-actions">
                  <button class="fs-btn-success" @click="updateFoodStatus(ord, 'sending')"><i class="fa fa-motorcycle"></i> ส่งออเดอร์</button>
                </div>
              </div>
              <div v-if="ordersData.filter(o => o.foodStatus === 'cooking').length === 0" class="fs-col-empty">
                <i class="fa fa-utensils"></i><span>ไม่มีออเดอร์กำลังทำ</span>
              </div>
            </div>
          </div>

          <!-- SENDING -->
          <div class="fs-col">
            <div class="fs-col-head">
              <div class="fs-col-label fs-col-label--sending"><i class="fa fa-motorcycle"></i> Sending</div>
              <span class="fs-col-badge fs-col-badge--sending">{{ ordersData.filter(o => o.foodStatus === 'sending').length }}</span>
            </div>
            <div class="fs-col-body">
              <div v-for="ord in ordersData.filter(o => o.foodStatus === 'sending')" :key="ord.id" class="fs-card fs-card--muted">
                <div class="fs-card-top">
                  <span class="fs-card-room">{{ ord.roomNo }}</span>
                  <span class="fs-card-time">{{ ord.time }}</span>
                </div>
                <div class="fs-card-customer">{{ ord.customerName }}</div>
                <div class="fs-card-items">
                  <div v-for="(item, i) in ord.items" :key="i" class="fs-item-row">
                    <span class="fs-item-qty">×{{ item.qty }}</span>
                    <span class="fs-item-name">{{ item.name }}</span>
                  </div>
                </div>
                <div v-if="ord.paymentStatus !== 'success'" class="fs-card-unpaid-badge">
                  <i class="fa fa-exclamation-circle"></i> ยังไม่ชำระเงิน
                </div>
                <button class="fs-btn-items" @click="openItemModal(ord)"><i class="fa fa-list-ul"></i> ดูรายการเมนู</button>
                <div class="fs-card-actions">
                  <button class="fs-btn-complete" @click="fdCheckPayment(ord)"><i class="fa fa-check-double"></i> ส่งสำเร็จ</button>
                </div>
              </div>
              <div v-if="ordersData.filter(o => o.foodStatus === 'sending').length === 0" class="fs-col-empty">
                <i class="fa fa-motorcycle"></i><span>ไม่มีออเดอร์กำลังส่ง</span>
              </div>
            </div>
          </div>

          <!-- COMPLETE -->
          <div class="fs-col">
            <div class="fs-col-head">
              <div class="fs-col-label fs-col-label--complete"><i class="fa fa-check-circle"></i> Complete</div>
              <span class="fs-col-badge fs-col-badge--complete">{{ ordersData.filter(o => o.foodStatus === 'complete').length }}</span>
            </div>
            <div class="fs-col-body">
              <div v-for="ord in ordersData.filter(o => o.foodStatus === 'complete')" :key="ord.id" class="fs-card fs-card--complete">
                <div class="fs-card-top">
                  <span class="fs-card-room">{{ ord.roomNo }}</span>
                  <span class="fs-card-time">{{ ord.time }}</span>
                </div>
                <div class="fs-card-customer">{{ ord.customerName }}</div>
                <div class="fs-card-items">
                  <div v-for="(item, i) in ord.items" :key="i" class="fs-item-row">
                    <span class="fs-item-qty">×{{ item.qty }}</span>
                    <span class="fs-item-name">{{ item.name }}</span>
                  </div>
                </div>
                <button class="fs-btn-items" @click="openItemModal(ord)"><i class="fa fa-list-ul"></i> ดูรายการเมนู</button>
                <div class="fs-card-status-label fs-card-status-label--complete">
                  <i class="fa fa-check-circle"></i> ส่งสำเร็จ · ชำระแล้ว
                  <span v-if="ord.paymentMethod" class="fs-pay-method-tag">{{ ord.paymentMethod }}</span>
                </div>
              </div>
              <div v-if="ordersData.filter(o => o.foodStatus === 'complete').length === 0" class="fs-col-empty">
                <i class="fa fa-check-circle"></i><span>ยังไม่มีออเดอร์เสร็จสิ้น</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- ===== KITCHEN SELECT ===== -->
      <div v-else-if="appScreen === 'kitchen-select'" class="kd-select-main">
        <div class="kd-select-topbar">
          <button class="kd-back-btn" @click="appScreen = 'feature'"><i class="fa fa-chevron-left"></i> กลับ</button>
          <div>
            <h1 class="kd-select-title">เลือกครัว</h1>
            <p class="kd-select-sub">Kitchen Display</p>
          </div>
        </div>
        <div class="kd-select-grid">
          <div v-for="k in kitchensData" :key="k.id" class="kd-select-card" @click="selectKitchen(k.id)">
            <div :class="['kd-select-icon', k.color]"><i :class="['fa', k.icon]"></i></div>
            <div class="kd-select-name">{{ k.name }}</div>
            <div class="kd-select-meta">{{ k.menus.length }} เมนู</div>
            <div class="kd-select-counts">
              <span class="kd-badge-notprint"><i class="fa fa-print"></i> {{ kitchenUnprintedCount(k.id) }} รอปริ้น</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== KITCHEN DISPLAY ===== -->
      <div v-else-if="appScreen === 'kitchen-display'" class="kd-main">
        <div class="kd-header">
          <div class="kd-header-left">
            <button class="kd-header-back" @click="appScreen = 'kitchen-select'"><i class="fa fa-chevron-left"></i></button>
            <h1 class="kd-header-title">{{ currentKitchen ? currentKitchen.name : '' }}</h1>
          </div>
          <div class="kd-header-center">
            <span class="kd-toggle-label">Auto print</span>
            <label class="kd-toggle-wrap">
              <input type="checkbox" v-model="kitchenAutoPrint[selectedKitchenId]" class="kd-toggle-input">
              <span class="kd-toggle-track"></span>
            </label>
          </div>
          <div class="kd-header-right">
            <button class="kd-hdr-btn" @click="kitchenShowHistory = true"><i class="fa fa-history"></i><span>ประวัติ</span></button>
            <button class="kd-hdr-btn" @click="refreshKitchen()"><i class="fa fa-sync"></i><span>Refresh</span></button>
          </div>
        </div>
        <div class="kd-summary-bar">
          <div class="kd-summary-chip kd-chip-all">ทั้งหมด {{ kitchenOrders.length }}</div>
          <div class="kd-summary-chip kd-chip-notprint">รอปริ้น {{ kitchenOrders.filter(o => !kitchenPrintStatus[o.id + '_' + selectedKitchenId]).length }}</div>
          <div class="kd-summary-chip kd-chip-printed">ปริ้นแล้ว {{ kitchenOrders.filter(o => !!kitchenPrintStatus[o.id + '_' + selectedKitchenId]).length }}</div>
        </div>
        <div class="kd-order-list">
          <div v-if="kitchenOrders.length === 0" class="kd-empty">
            <i class="fa fa-inbox"></i><p>ไม่มี Order สำหรับครัวนี้</p>
          </div>
          <div v-for="ord in kitchenOrders" :key="ord.id" :class="['kd-order-card', isKitchenPrinted(ord) ? 'kd-card--printed' : 'kd-card--notprinted']">
            <div class="kd-card-left">
              <button :class="['kd-print-btn', isKitchenPrinted(ord) ? 'kd-print-btn--done' : '']" @click.stop="kitchenPrint(ord)"><i class="fa fa-print"></i></button>
              <div class="kd-card-meta">
                <div class="kd-card-orderno">order no : {{ ord.receiptNo }}</div>
                <div class="kd-card-date">order date : {{ ord.date }}</div>
              </div>
            </div>
            <div class="kd-card-body">
              <div class="kd-card-info-row">
                <span>เลขห้อง/โต๊ะ : <b>{{ ord.roomNo }}</b></span>
                <span class="kd-sep">|</span>
                <span>ลูกค้า : <b>{{ ord.customerName }}</b></span>
              </div>
              <div class="kd-card-time">เวลา : <b>{{ ord.time }}</b></div>
              <div class="kd-card-preview">เมนู: {{ kitchenItemsPreview(ord) }}</div>
            </div>
            <div class="kd-card-right">
              <span :class="['kd-status-label', isKitchenPrinted(ord) ? 'kd-status--printed' : 'kd-status--notprinted']">
                Status Print : <b>{{ isKitchenPrinted(ord) ? 'Printed' : 'Not Printed' }}</b>
              </span>
              <button class="kd-detail-btn" @click="kitchenOrderModal = ord"><i class="fa fa-chevron-right"></i></button>
            </div>
          </div>
        </div>
        <!-- History Panel -->
        <div v-if="kitchenShowHistory" class="kd-overlay" @click.self="kitchenShowHistory = false">
          <div class="kd-history-panel">
            <div class="kd-history-header">
              <button class="kd-back-btn" @click="kitchenShowHistory = false"><i class="fa fa-chevron-left"></i> กลับ</button>
              <div>
                <h2 class="kd-history-title">ประวัติ Order</h2>
                <span class="kd-history-kitchen-tag">{{ currentKitchen ? currentKitchen.name : '' }}</span>
              </div>
            </div>
            <div class="kd-history-date-row">
              <label class="kd-date-label"><i class="fa fa-calendar-alt"></i> วันที่</label>
              <input type="date" v-model="kitchenHistoryDate" class="kd-date-input">
            </div>
            <div class="kd-summary-bar kd-summary-bar--inner">
              <div class="kd-summary-chip kd-chip-all">ทั้งหมด {{ kitchenHistoryOrders.length }}</div>
              <div class="kd-summary-chip kd-chip-printed">ปริ้นแล้ว {{ kitchenHistoryOrders.filter(o => !!kitchenPrintStatus[o.id + '_' + selectedKitchenId]).length }}</div>
              <div class="kd-summary-chip kd-chip-notprint">ยังไม่ปริ้น {{ kitchenHistoryOrders.filter(o => !kitchenPrintStatus[o.id + '_' + selectedKitchenId]).length }}</div>
            </div>
            <div class="kd-history-list">
              <div v-if="kitchenHistoryOrders.length === 0" class="kd-empty">
                <i class="fa fa-calendar-times"></i><p>ไม่มี Order ในวันที่เลือก</p>
              </div>
              <div v-for="ord in kitchenHistoryOrders" :key="ord.id" :class="['kd-order-card', isKitchenPrinted(ord) ? 'kd-card--printed' : 'kd-card--notprinted']">
                <div class="kd-card-left">
                  <button :class="['kd-print-btn', isKitchenPrinted(ord) ? 'kd-print-btn--done' : '']" @click.stop="kitchenPrint(ord)"><i class="fa fa-print"></i></button>
                  <div class="kd-card-meta">
                    <div class="kd-card-orderno">order no : {{ ord.receiptNo }}</div>
                    <div class="kd-card-date">order date : {{ ord.date }}</div>
                  </div>
                </div>
                <div class="kd-card-body">
                  <div class="kd-card-info-row">
                    <span>เลขห้อง/โต๊ะ : <b>{{ ord.roomNo }}</b></span>
                    <span class="kd-sep">|</span>
                    <span>ลูกค้า : <b>{{ ord.customerName }}</b></span>
                  </div>
                  <div class="kd-card-time">เวลา : <b>{{ ord.time }}</b></div>
                  <div class="kd-card-preview">เมนู: {{ kitchenItemsPreview(ord) }}</div>
                </div>
                <div class="kd-card-right">
                  <span :class="['kd-status-label', isKitchenPrinted(ord) ? 'kd-status--printed' : 'kd-status--notprinted']">
                    Status Print : <b>{{ isKitchenPrinted(ord) ? 'Printed' : 'Not Printed' }}</b>
                  </span>
                  <button class="kd-detail-btn" @click="kitchenOrderModal = ord; kitchenShowHistory = false"><i class="fa fa-chevron-right"></i></button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Order Detail Modal -->
        <div v-if="kitchenOrderModal" class="kd-overlay" @click.self="kitchenOrderModal = null">
          <div class="kd-modal">
            <div class="kd-modal-header">
              <h3 class="kd-modal-title">รายละเอียด Order</h3>
              <button class="kd-modal-close" @click="kitchenOrderModal = null"><i class="fa fa-times"></i></button>
            </div>
            <div class="kd-modal-meta">
              <div class="kd-modal-meta-row"><span class="kd-modal-meta-label">Order no</span><span>{{ kitchenOrderModal.receiptNo }}</span></div>
              <div class="kd-modal-meta-row"><span class="kd-modal-meta-label">วันที่</span><span>{{ kitchenOrderModal.date }} เวลา {{ kitchenOrderModal.time }}</span></div>
              <div class="kd-modal-meta-row"><span class="kd-modal-meta-label">ห้อง/โต๊ะ</span><span>{{ kitchenOrderModal.roomNo }}</span></div>
              <div class="kd-modal-meta-row"><span class="kd-modal-meta-label">ลูกค้า</span><span>{{ kitchenOrderModal.customerName }}</span></div>
            </div>
            <div class="kd-modal-items-section">
              <div class="kd-modal-items-label">เมนูของครัวนี้ ({{ kitchenModalItems.length }} รายการ)</div>
              <div v-for="(item, i) in kitchenModalItems" :key="i" class="kd-modal-item-row">
                <span class="kd-modal-qty">×{{ item.qty }}</span>
                <div class="kd-modal-item-info">
                  <div class="kd-modal-item-name">{{ item.name }}</div>
                  <div v-if="item.options && item.options.length" class="kd-modal-item-opts">{{ item.options.join(' · ') }}</div>
                  <div v-if="item.note" class="kd-modal-item-note"><i class="fa fa-sticky-note"></i> {{ item.note }}</div>
                </div>
              </div>
            </div>
            <div v-if="kitchenOrderModal.note" class="kd-modal-order-note">
              <i class="fa fa-sticky-note"></i> หมายเหตุ: {{ kitchenOrderModal.note }}
            </div>
            <div class="kd-modal-footer">
              <button :class="['kd-modal-print-btn', isKitchenPrinted(kitchenOrderModal) ? 'kd-modal-print-btn--done' : '']" @click="kitchenPrint(kitchenOrderModal)">
                <i class="fa fa-print"></i>
                {{ isKitchenPrinted(kitchenOrderModal) ? 'ปริ้นแล้ว (ปริ้นซ้ำ)' : 'พิมพ์ใบครัว' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== MONEY MANAGEMENT LANDING ===== -->
      <div v-else-if="appScreen === 'money-management'" class="money-content-area">
        <div class="money-page-header">เติมเงิน / เช็คยอด / ถอนเงิน</div>
        <div class="money-landing-grid">
          <div class="money-landing-card" @click="appScreen = 'money-topup'">
            <div class="money-landing-icon"><i class="fa fa-exchange-alt"></i></div>
            <div class="money-landing-name">จัดการยอดเงิน (เติม-ถอนเงิน)</div>
          </div>
          <div class="money-landing-card" @click="appScreen = 'money-daily'">
            <div class="money-landing-icon"><i class="fa fa-chart-bar"></i></div>
            <div class="money-landing-name">เช็คยอดเงินรายวัน</div>
          </div>
        </div>
      </div>

      <!-- ===== MONEY TOPUP / REFUND ===== -->
      <div v-else-if="appScreen === 'money-topup'" class="money-topup-layout">
        <!-- LEFT: Form -->
        <div class="money-form-area">
          <div class="money-page-header">จัดการยอดเงิน</div>
          <div class="money-form-card">
            <div class="money-emp-row">
              <span class="money-emp-label">ชื่อพนักงาน</span>
              <span class="money-emp-val">{{ moneyEmployee.name || '—' }}</span>
            </div>
            <div class="money-emp-row">
              <span class="money-emp-label">รหัสพนักงาน</span>
              <span class="money-emp-val">{{ moneyEmployee.code || '—' }}</span>
            </div>

            <!-- Balance display -->
            <div class="money-balance-box" :class="moneyMode === 'topup' ? 'balance-topup' : 'balance-refund'">
              <div class="money-balance-label">{{ moneyMode === 'topup' ? 'ยอดปัจจุบันก่อนเติม' : 'ยอดเงินที่สามารถถอนได้' }}</div>
              <div class="money-balance-icon"><i class="fa fa-baht-sign"></i></div>
              <div class="money-balance-amount">{{ moneyBalance !== null ? moneyBalance.toFixed(2) : '0.00' }}</div>
            </div>

            <!-- Toggle -->
            <div class="money-toggle-row">
              <button class="money-toggle-btn" :class="{ active: moneyMode === 'topup' }" @click="moneyMode = 'topup'; moneyAmount = ''">
                <span class="money-toggle-radio"></span> เติมเงิน
              </button>
              <button class="money-toggle-btn" :class="{ active: moneyMode === 'refund' }" @click="moneyMode = 'refund'; moneyAmount = ''; moneyPayChannel = ''">
                <span class="money-toggle-radio"></span> คืนเงิน
              </button>
            </div>

            <!-- User code input -->
            <div class="money-field-label">รหัสผู้ใช้งาน / รหัสบัตร <span style="color:#FF3B30">*</span></div>
            <input class="money-input" v-model="moneyUserId" placeholder="ระบุรหัสพนักงาน / รหัสบัตร" @blur="lookupMoneyEmployee()">

            <!-- Amount input (topup only) -->
            <template v-if="moneyMode === 'topup'">
              <div class="money-field-label" style="margin-top:14px">จำนวนเงินที่ต้องการเติม</div>
              <input class="money-input" v-model="moneyAmount" type="number" placeholder="ระบุจำนวนเงินที่ต้องการเติม">
              <div class="money-quick-amounts">
                <button v-for="q in [20,30,50,100,200,500]" :key="q" class="money-quick-btn" @click="moneyAmount = String(q)">{{ q }}</button>
              </div>
            </template>

            <!-- Refund amount input -->
            <template v-else>
              <div class="money-field-label" style="margin-top:14px">จำนวนเงินที่ต้องการคืน</div>
              <input class="money-input" v-model="moneyAmount" type="number" placeholder="ระบุจำนวนเงินที่ต้องการคืน">
            </template>
          </div>
        </div>

        <!-- RIGHT: Payment channels (topup) / Summary (refund) -->
        <div class="money-right-panel">
          <!-- Topup mode: payment channels -->
          <template v-if="moneyMode === 'topup'">
            <div class="money-panel-title">ช่องทางการชำระเงิน</div>
            <div class="money-channels">
              <button v-for="ch in moneyChannels" :key="ch.key"
                class="money-channel-btn"
                :class="{ 'channel-active': moneyPayChannel === ch.key }"
                @click="moneyPayChannel = ch.key">
                <span class="money-channel-icon" :style="{ color: ch.color }"><i :class="ch.icon"></i></span>
                <span>{{ ch.label }}</span>
              </button>
            </div>
          </template>
          <!-- Refund mode: summary -->
          <template v-else>
            <div class="money-panel-title">ยอดรวม</div>
            <div class="money-refund-summary">
              <div class="money-refund-label">ยอดคืนเงิน:</div>
              <div class="money-refund-amount">{{ parseFloat(moneyAmount || 0).toFixed(2) }}</div>
            </div>
          </template>

          <!-- Bottom actions -->
          <div class="money-action-bar">
            <button class="money-btn-clear" @click="clearMoneyForm()">
              <i class="fa fa-times" style="margin-right:6px"></i>ล้างข้อมูล
            </button>
            <button class="money-btn-submit" :class="{ 'submit-ready': moneyEmployeeFound }" @click="doMoneyAction()">
              <i class="fa fa-credit-card" style="margin-right:6px"></i>{{ moneyMode === 'topup' ? 'เติมเงิน' : 'คืนเงิน' }}
            </button>
          </div>
        </div>
      </div>

      <!-- ===== MONEY DAILY CHECK ===== -->
      <div v-else-if="appScreen === 'money-daily'" class="money-topup-layout">
        <div class="money-daily-left">
          <div class="money-page-header">เช็คยอดเงินรายวัน</div>
          <div v-if="!moneyDailyData" class="money-daily-lookup">
            <div class="money-field-label">รหัสบัตร / รหัสพนักงาน</div>
            <input class="money-input" v-model="moneyDailyUserId" placeholder="ระบุรหัสบัตร" @keydown.enter="checkMoneyDaily()">
            <button class="money-btn-submit" style="margin-top:16px;width:100%" @click="checkMoneyDaily()">
              <i class="fa fa-search" style="margin-right:6px"></i>ค้นหา
            </button>
          </div>
          <div v-else class="money-daily-result">
            <div class="money-daily-title">ยอดเงินคงเหลือ</div>
            <div class="money-daily-card-type">ประเภทบัตร: {{ moneyDailyData.cardType }}</div>
            <div class="money-daily-name">{{ moneyDailyData.name }}</div>
            <div class="money-daily-amount-box">
              <div class="money-daily-amount">{{ moneyDailyData.balance.toFixed(2) }}</div>
              <div class="money-daily-currency">THB</div>
            </div>
            <button class="money-btn-clear" style="margin-top:20px" @click="moneyDailyData = null; moneyDailyUserId = ''">
              ค้นหาใหม่
            </button>
          </div>
        </div>
        <div class="money-daily-right">
          <div class="money-panel-title">รายการใช้จ่ายล่าสุด</div>
          <div class="money-tx-list">
            <div v-for="(tx, i) in moneyTransactionsData" :key="i" class="money-tx-row">
              <div class="money-tx-datetime">{{ tx.datetime }}</div>
              <div class="money-tx-top">
                <span class="money-tx-desc">{{ tx.type === 'spend' ? 'ใช้จ่าย - ' : 'เติมเงิน - ' }}{{ tx.merchant }}</span>
                <span class="money-tx-amount">{{ tx.amount.toFixed(2) }}</span>
              </div>
              <div v-for="item in tx.items" :key="item" class="money-tx-item">• {{ item }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== PRE-ORDER: IDLE / TAP (จอ 1 นักเรียน) — §3.1-3.4 ===== -->
      <div v-else-if="appScreen === 'preorder-idle'" class="po-main">
        <div class="po-topbar">
          <div>
            <h1 class="po-page-title">Pre-Order</h1>
            <span class="po-page-sub">แตะบัตรรับอาหาร</span>
          </div>
          <div class="po-topbar-right">
            <div class="po-clock">{{ poCurrentTime }}</div>
            <button class="po-btn-ghost" @click="poOpenCustomerDisplay()"><i class="fa fa-tv"></i> เปิดจอลูกค้า</button>
          </div>
        </div>

        <div class="po-idle-body">
          <template v-if="!poResult">
            <div class="po-idle-card">
              <div class="po-idle-icon"><i class="fa fa-id-card-clip"></i></div>
              <div class="po-idle-title">แตะบัตรเพื่อรับอาหาร</div>
              <div class="po-idle-meal">
                <span v-if="poIdleCurrentPeriod">กำลังเปิดรับ {{ poIdleCurrentPeriod.mealName }} ({{ poFormatWindow(poIdleCurrentPeriod) }})</span>
                <span v-else>ขณะนี้ยังไม่เปิดรับมื้อใดอยู่</span>
              </div>
              <input class="po-scan-input" v-model="poCardInput" placeholder="แตะบัตร หรือพิมพ์เลขบัตรแล้วกด Enter" autofocus @keydown.enter="poSubmitCardInput()">
            </div>
            <button class="po-history-btn" @click="appScreen = 'preorder-staff'"><i class="fa fa-history"></i> ประวัติการจอง</button>

            <div class="po-testtools">
              <button class="po-testtools-toggle" @click="poShowTestTools = !poShowTestTools">
                <i class="fa fa-flask"></i> เครื่องมือทดสอบ
                <i :class="['fa', poShowTestTools ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
              </button>
              <div v-if="poShowTestTools" class="po-testtools-panel">
                <button v-for="qp in poQuickPicks" :key="qp.label" class="po-qp-btn" @click="poQuickPickTap(qp)">{{ qp.label }}</button>
                <button class="po-qp-btn po-qp-btn--offline" :class="{ active: poOfflineSim }" @click="poToggleOfflineSim()">
                  <i class="fa fa-wifi"></i> จำลองระบบออฟไลน์ ({{ poOfflineSim ? 'เปิด' : 'ปิด' }})
                </button>
                <button class="po-qp-btn" @click="poSimulateMisread()">แตะบัตรไม่สำเร็จ ({{ poMisreadCount }}/3)</button>
                <button class="po-qp-btn" @click="poSimulateReaderFailure()">เครื่องอ่านบัตรขัดข้อง</button>
                <button class="po-qp-btn" @click="poDemoDebounce()">แตะซ้ำระหว่างประมวลผล (debounce)</button>
              </div>
            </div>
          </template>

          <!-- ===== RESULT OVERLAY — §3.2/3.3/3.4 + edge cases §4/§4.5 ===== -->
          <div v-else class="po-result-card">
            <button v-if="['detail', 'case4', 'case8', 'case9-timeout', 'hwB', 'hwC'].includes(poResult.case)" class="po-result-close" @click="poBackToIdle()">×</button>

            <template v-if="poResult.case === 'detail'">
              <div class="po-badge" :class="poStatusMeta(poEffectiveStatus(poResult.reservation, poResult.mockNow)).badge">{{ poStatusMeta(poEffectiveStatus(poResult.reservation, poResult.mockNow)).label }}</div>
              <div class="po-result-avatar"><i class="fa fa-user"></i></div>
              <div class="po-result-name">{{ poResult.card.name }}</div>
              <div class="po-result-class">{{ poResult.card.cls }}</div>
              <div class="po-result-items">
                <div v-for="(it, i) in poResult.reservation.items" :key="i" class="po-result-item-row"><span>{{ it.name }}</span><span>×{{ it.qty }}</span></div>
                <div v-if="poResult.reservation.allergyNote" class="po-result-allergy"><i class="fa fa-triangle-exclamation"></i> {{ poResult.reservation.allergyNote }}</div>
              </div>
              <button class="po-btn-primary" @click="poConfirmCollect()"><i class="fa fa-check"></i> ยืนยันรับอาหาร</button>
            </template>

            <template v-else-if="poResult.case === 'success'">
              <div class="po-result-icon po-icon-success"><i class="fa fa-check-circle"></i></div>
              <div class="po-result-title">รับอาหารสำเร็จ</div>
              <div class="po-result-name">{{ poResult.card.name }}</div>
              <div class="po-result-items">
                <div v-for="(it, i) in poResult.reservation.items" :key="i" class="po-result-item-row"><span>{{ it.name }}</span><span>×{{ it.qty }}</span></div>
              </div>
              <div class="po-result-time">เวลา {{ poResult.reservation.collectedAt }}</div>
            </template>

            <template v-else-if="poResult.case === 'duplicate'">
              <div class="po-result-icon po-icon-warning"><i class="fa fa-triangle-exclamation"></i></div>
              <div class="po-result-title">รับอาหารไปแล้ว</div>
              <div class="po-result-sub">{{ poResult.card.name }} รับไปแล้วเมื่อ {{ poResult.reservation.collectedAt }}</div>
              <div class="po-result-footnote">หากมีข้อสงสัย ติดต่อพนักงานโรงอาหาร</div>
            </template>

            <template v-else-if="poResult.case === 'case1'">
              <div class="po-result-icon po-icon-neutral"><i class="fa fa-circle-info"></i></div>
              <div class="po-result-title">ไม่พบรายการจอง</div>
              <div class="po-result-sub">{{ poResult.card.name }} ยังไม่ได้จองมื้อนี้</div>
            </template>

            <template v-else-if="poResult.case === 'case2'">
              <div class="po-result-icon po-icon-warning"><i class="fa fa-triangle-exclamation"></i></div>
              <div class="po-result-title">จองไว้{{ poResult.period.mealName }}</div>
              <div class="po-result-sub">รับได้ {{ poFormatWindow(poResult.period) }}</div>
            </template>

            <template v-else-if="poResult.case === 'case3'">
              <div class="po-result-icon po-icon-info"><i class="fa fa-clock"></i></div>
              <div class="po-result-title">ยังไม่ถึงเวลารับ</div>
              <div class="po-result-sub">เปิดรับ {{ poResult.period.start }} น.</div>
            </template>

            <template v-else-if="poResult.case === 'case4'">
              <div class="po-result-icon po-icon-danger"><i class="fa fa-circle-xmark"></i></div>
              <div class="po-result-title">พ้นเวลารับแล้ว</div>
              <button class="po-btn-secondary" @click="poRequestOverride(poResult.reservation)"><i class="fa fa-user-shield"></i> แจ้งพนักงานให้ override</button>
            </template>

            <template v-else-if="poResult.case === 'case5'">
              <div class="po-result-icon po-icon-neutral"><i class="fa fa-circle-info"></i></div>
              <div class="po-result-title">ไม่พบข้อมูลบัตรนี้</div>
              <div class="po-result-sub">กรุณาติดต่อพนักงาน</div>
            </template>

            <template v-else-if="poResult.case === 'case6'">
              <div class="po-result-icon po-icon-danger"><i class="fa fa-ban"></i></div>
              <div class="po-result-title">บัตรถูกระงับใช้งาน</div>
              <div class="po-result-sub">กรุณาติดต่อพนักงาน</div>
            </template>

            <template v-else-if="poResult.case === 'case7'">
              <div class="po-result-icon po-icon-danger"><i class="fa fa-ban"></i></div>
              <div class="po-result-title">การจองนี้ถูกยกเลิกแล้ว</div>
              <div class="po-result-sub">กรุณาติดต่อพนักงาน</div>
            </template>

            <template v-else-if="poResult.case === 'case8'">
              <div class="po-result-icon po-icon-warning"><i class="fa fa-circle-exclamation"></i></div>
              <div class="po-result-title">ยังไม่ชำระเงิน</div>
              <div class="po-result-sub">แจ้งพนักงานก่อนรับอาหาร</div>
            </template>

            <template v-else-if="poResult.case === 'case9-loading'">
              <div class="po-result-icon po-icon-neutral"><i class="fa fa-spinner fa-spin"></i></div>
              <div class="po-result-title">กำลังตรวจสอบข้อมูล...</div>
            </template>

            <template v-else-if="poResult.case === 'case9-timeout'">
              <div class="po-result-icon po-icon-neutral"><i class="fa fa-wifi"></i></div>
              <div class="po-result-title">เชื่อมต่อไม่ได้ ลองใหม่อีกครั้ง</div>
              <button class="po-btn-secondary" @click="poToggleOfflineSim(); poBackToIdle()"><i class="fa fa-rotate-right"></i> ปิดโหมดทดสอบ / ลองใหม่</button>
            </template>

            <!-- §4.5 เคสแตะบัตรไม่ผ่าน (ฮาร์ดแวร์) — คนละกลุ่มจาก business case ด้านบน -->
            <template v-else-if="poResult.case === 'hwA'">
              <div class="po-result-icon po-icon-info"><i class="fa fa-arrows-rotate"></i></div>
              <div class="po-result-title">แตะบัตรอีกครั้ง</div>
            </template>

            <template v-else-if="poResult.case === 'hwB'">
              <div class="po-result-icon po-icon-warning"><i class="fa fa-id-card"></i></div>
              <div class="po-result-title">อ่านบัตรไม่ได้ กรุณาติดต่อพนักงาน</div>
            </template>

            <template v-else-if="poResult.case === 'hwC'">
              <div class="po-result-icon po-icon-danger"><i class="fa fa-screwdriver-wrench"></i></div>
              <div class="po-result-title">เครื่องอ่านบัตรขัดข้อง กรุณาติดต่อพนักงาน</div>
            </template>

            <template v-else-if="poResult.case === 'hwD'">
              <div class="po-result-icon po-icon-neutral"><i class="fa fa-spinner fa-spin"></i></div>
              <div class="po-result-title">กำลังดำเนินการ กรุณารอสักครู่</div>
            </template>
          </div>
        </div>
      </div>

      <!-- ===== PRE-ORDER: STAFF OVERVIEW (§6) — ปุ่ม "ประวัติการจอง" บนหน้า idle พาตรงมาที่นี่ ===== -->
      <div v-else-if="appScreen === 'preorder-staff'" class="po-main">
        <div class="po-topbar">
          <div><h1 class="po-page-title">ภาพรวม Pre-Order</h1><span class="po-page-sub">สำหรับพนักงาน</span></div>
        </div>

        <div class="po-filter-bar">
          <input type="date" class="po-date-input" v-model="poStaffFrom">
          <span>ถึง</span>
          <input type="date" class="po-date-input" v-model="poStaffTo">
          <input class="po-search-input" v-model="poStaffSearch" placeholder="ค้นหาชื่อ / รหัสนักเรียน / เลขบัตร">
        </div>
        <div class="po-tab-bar">
          <button class="po-tab" :class="{ active: poStaffPeriodTab === 'all' }" @click="poStaffPeriodTab = 'all'">ทั้งหมด</button>
          <button v-for="p in preOrderMealPeriods" :key="p.key" class="po-tab" :class="{ active: poStaffPeriodTab === p.key }" @click="poStaffPeriodTab = p.key">{{ p.tabName }}</button>
        </div>

        <div class="po-summary-row">
          <div class="po-summary-tile"><div class="po-summary-num">{{ poStaffSummary.total }}</div><div class="po-summary-label">จองทั้งหมด</div></div>
          <div class="po-summary-tile po-summary--confirmed"><div class="po-summary-num">{{ poStaffSummary.confirmed }}</div><div class="po-summary-label">จองแล้ว</div></div>
          <div class="po-summary-tile po-summary--ready"><div class="po-summary-num">{{ poStaffSummary.ready }}</div><div class="po-summary-label">รอวันรับ</div></div>
          <div class="po-summary-tile po-summary--collected"><div class="po-summary-num">{{ poStaffSummary.collected }}</div><div class="po-summary-label">รับแล้ว</div></div>
          <div class="po-summary-tile po-summary--missed"><div class="po-summary-num">{{ poStaffSummary.missed }}</div><div class="po-summary-label">ไม่มารับ</div></div>
          <div class="po-summary-tile po-summary--cancelled"><div class="po-summary-num">{{ poStaffSummary.cancelled }}</div><div class="po-summary-label">ยกเลิกแล้ว</div></div>
        </div>

        <div class="po-staff-list">
          <div v-if="poStaffFilteredList.length === 0" class="po-empty"><i class="fa fa-inbox"></i><span>ไม่พบรายการ</span></div>
          <div v-for="res in poStaffFilteredList" :key="res.id" class="po-history-row" @click="poOpenDetail(res)">
            <div class="po-history-row-main">
              <span class="po-history-student-name">{{ poCardInfo(res.cardId) ? poCardInfo(res.cardId).name : res.cardId }}</span>
              <span class="po-history-meta">{{ poCardInfo(res.cardId) ? poCardInfo(res.cardId).cls : '' }} · {{ poFormatDate(res.date) }} · {{ poPeriodOf(res.mealKey) ? poPeriodOf(res.mealKey).mealName : '' }}</span>
            </div>
            <span class="po-badge" :class="poStatusMeta(poEffectiveStatus(res)).badge">{{ poStatusMeta(poEffectiveStatus(res)).label }}</span>
          </div>
        </div>
      </div>

      <!-- ===== BUFFET: TYPE SELECT (จอ 1) — §2/§3.3 จุดเข้าทางเดียวของบุฟเฟต์ (ทั้งสายแตะบัตรและสาย QR) ===== -->
      <div v-else-if="appScreen === 'buffet-type-select'" class="po-main">
        <div class="po-topbar">
          <div>
            <h1 class="po-page-title">บุฟเฟต์</h1>
            <span class="po-page-sub">เลือกประเภทบุฟเฟต์</span>
          </div>
          <div class="po-topbar-right">
            <button class="po-btn-ghost" @click="bufOpenCustomerDisplay()"><i class="fa fa-tv"></i> เปิดจอลูกค้า</button>
            <button class="po-history-btn" @click="appScreen = 'buffet-staff'"><i class="fa fa-clipboard-list"></i> ภาพรวมบุฟเฟต์</button>
          </div>
        </div>
        <div class="po-idle-body">
          <div class="buf-type-wrap" style="max-width: 480px; width: 100%; display: flex; flex-direction: column; gap: 10px;">
            <input class="po-search-input" v-model="bufTypeSearch" placeholder="ค้นหาประเภทบุฟเฟต์...">
            <div class="po-staff-list buf-type-list" style="width: 100%;">
              <div v-if="bufFilteredGradeTiers.length === 0" class="po-empty"><i class="fa fa-inbox"></i><span>ไม่พบรายการ</span></div>
              <div v-for="t in bufFilteredGradeTiers" :key="t.key" class="po-history-row" @click="bufSelectTier(t.key)">
                <div class="po-history-row-main">
                  <span class="po-history-student-name">บุฟเฟต์ {{ t.label }}</span>
                  <span class="po-history-meta">ราคา ฿{{ t.price }} ต่อคน</span>
                </div>
                <span class="po-badge po-badge-ready"><i class="fa fa-chevron-right"></i></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== BUFFET: PAYMENT METHOD SELECT (จอ 1) — §2.1 มาหลังเลือกประเภทบุฟเฟต์แล้วเสมอ ===== -->
      <div v-else-if="appScreen === 'buffet-pay-method'" class="po-main">
        <div class="po-topbar">
          <div>
            <h1 class="po-page-title">บุฟเฟต์</h1>
            <span class="po-page-sub">เลือกวิธีชำระเงิน · {{ bufSelectedTierInfo ? ('บุฟเฟต์ ' + bufSelectedTierInfo.label + ' · ฿' + bufSelectedTierInfo.price) : '' }}</span>
          </div>
          <div class="po-topbar-right">
            <button class="po-back-btn" @click="openBuffetTypeSelect()"><i class="fa fa-chevron-left"></i> กลับ</button>
            <button class="po-btn-ghost" @click="bufOpenCustomerDisplay()"><i class="fa fa-tv"></i> เปิดจอลูกค้า</button>
            <button class="po-history-btn" @click="appScreen = 'buffet-staff'"><i class="fa fa-clipboard-list"></i> ภาพรวมบุฟเฟต์</button>
          </div>
        </div>
        <div class="po-idle-body">
          <div class="po-idle-card">
            <button class="po-btn-primary" @click="bufChoosePayMethod('card')"><i class="fa fa-id-card-clip"></i> แตะบัตร</button>
            <button class="po-btn-secondary" @click="bufChoosePayMethod('qr')"><i class="fa fa-qrcode"></i> สแกน QR</button>
          </div>
        </div>
      </div>

      <!-- ===== BUFFET: QR ขั้น 1 — เลือกช่องทางชำระเงิน — §2.1 (ตัดขั้นระบุตัวตนออกแล้ว ตามที่ยืนยัน — QR ไม่รู้ตัวตนผู้จ่าย) ===== -->
      <div v-else-if="appScreen === 'buffet-qr-channel'" class="po-main">
        <div class="po-topbar">
          <div>
            <h1 class="po-page-title">สแกน QR — บุฟเฟต์ {{ bufSelectedTierInfo ? bufSelectedTierInfo.label : '' }}</h1>
            <span class="po-page-sub">เลือกช่องทางชำระเงิน · ยอดบุฟเฟต์ ฿{{ bufSelectedTierInfo ? bufSelectedTierInfo.price : 0 }}</span>
          </div>
          <div class="po-topbar-right">
            <button class="po-back-btn" @click="bufQrBackToTypeSelect()"><i class="fa fa-chevron-left"></i> กลับ</button>
          </div>
        </div>
        <div class="po-idle-body">
          <div class="buf-channel-grid">
            <div v-for="c in bufQrChannels" :key="c.key" class="buf-channel-box" @click="bufSelectQrChannel(c.key)">
              <div class="buf-channel-box-icons">
                <i :class="c.icon" :style="{ color: c.color }"></i>
                <i v-if="c.icon2" :class="c.icon2" :style="{ color: c.color2 }"></i>
              </div>
              <span class="buf-channel-box-label">{{ c.label }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== BUFFET: QR ขั้น 2 — แสดง QR + นับถอยหลัง 180 วิ — §2.1 ===== -->
      <div v-else-if="appScreen === 'buffet-qr-code'" class="po-main">
        <div class="po-topbar">
          <div>
            <h1 class="po-page-title">สแกนเพื่อชำระเงิน</h1>
            <span class="po-page-sub">บุฟเฟต์ {{ bufSelectedTierInfo ? bufSelectedTierInfo.label : '' }}</span>
          </div>
          <div class="po-topbar-right">
            <button class="po-back-btn" @click="bufQrBackToTypeSelect()"><i class="fa fa-chevron-left"></i> ยกเลิก</button>
          </div>
        </div>
        <div class="po-idle-body">
          <div class="po-idle-card">
            <div class="po-idle-icon" style="width:160px;height:160px;border-radius:12px;font-size:64px;background:#F2F2F7;color:#1C1C1E">
              <i class="fa fa-qrcode"></i>
            </div>
            <div class="po-idle-title">฿{{ bufSelectedTierInfo ? bufSelectedTierInfo.price : 0 }}</div>
            <div class="po-idle-meal">เหลือเวลา {{ Math.floor(bufQrCountdown / 60) }}:{{ String(bufQrCountdown % 60).padStart(2, '0') }} นาที</div>
            <button class="po-btn-secondary" @click="bufQrSimulateSuccess()"><i class="fa fa-flask"></i> จำลองจ่ายสำเร็จ (เครื่องมือทดสอบ)</button>
          </div>
        </div>
      </div>

      <!-- ===== BUFFET: STAFF OVERVIEW + DRILL-DOWN (§5) ===== -->
      <div v-else-if="appScreen === 'buffet-staff'" class="po-main">
        <div class="po-topbar">
          <div><h1 class="po-page-title">ภาพรวมบุฟเฟต์</h1><span class="po-page-sub">สำหรับพนักงาน</span></div>
        </div>

        <template v-if="!bufDrillTier">
          <div class="po-filter-bar">
            <input type="date" class="po-date-input" v-model="bufStaffFrom">
            <span>ถึง</span>
            <input type="date" class="po-date-input" v-model="bufStaffTo">
            <button class="po-history-btn" @click="addToast('แสดงผลตามช่วงวันที่ที่เลือกแล้ว', 'info')"><i class="fa fa-magnifying-glass"></i> ค้นหา</button>
          </div>

          <div class="po-summary-row">
            <div class="po-summary-tile"><div class="po-summary-num">{{ bufStaffSummary.totalPeople }}</div><div class="po-summary-label">จำนวนคนทั้งหมด</div></div>
            <div class="po-summary-tile po-summary--confirmed"><div class="po-summary-num">฿{{ bufStaffSummary.totalAmount }}</div><div class="po-summary-label">ยอดรวม</div></div>
          </div>

          <div class="po-staff-list">
            <div v-if="bufTierBreakdown.length === 0" class="po-empty"><i class="fa fa-inbox"></i><span>ไม่พบรายการ</span></div>
            <div v-for="row in bufTierBreakdown" :key="row.tier.key" class="po-history-row" :class="{ 'po-history-row--teacher': row.tier.key === 'teacher' }" @click="bufOpenDrill(row.tier.key)">
              <div class="po-history-row-main">
                <span class="po-history-student-name">{{ row.tier.label }}</span>
                <span class="po-history-meta">฿{{ row.tier.price }}/คน · {{ row.count }} คน</span>
              </div>
              <span class="po-badge po-badge-ready">฿{{ row.subtotal }}</span>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="po-filter-bar">
            <button class="po-back-btn" @click="bufCloseDrill()"><i class="fa fa-chevron-left"></i> กลับ</button>
            <div class="po-history-student" style="margin:0">{{ bufGradeTierOf(bufDrillTier) ? bufGradeTierOf(bufDrillTier).label : '' }}</div>
            <input class="po-search-input" v-model="bufDrillSearch" placeholder="ค้นหาชื่อ">
          </div>
          <div class="po-staff-list">
            <div v-if="bufDrillList.length === 0" class="po-empty"><i class="fa fa-inbox"></i><span>ไม่พบรายการ</span></div>
            <div v-for="tx in bufDrillList" :key="tx.id" class="po-history-row" @click="bufOpenVoid(tx)">
              <div class="po-history-row-main">
                <span class="po-history-student-name">{{ bufCardInfo(tx.cardId) ? bufCardInfo(tx.cardId).name : (tx.guestName || tx.cardId) }}</span>
                <span class="po-history-meta">{{ bufGradeTierOf(tx.gradeTier) ? bufGradeTierOf(tx.gradeTier).label : '' }} · {{ tx.time }} น. · {{ tx.paymentMethod === 'card' ? 'แตะบัตร' : 'สแกน QR' }}</span>
              </div>
              <span class="po-badge po-badge-confirmed">฿{{ tx.amount }}</span>
            </div>
          </div>
        </template>
      </div>

      <!-- RIGHT PANEL: Order Summary -->
      <div v-if="appScreen === 'pos'" class="order-panel">
        <!-- Header -->
        <div class="order-header">
          <div>
            <div class="order-title">Order's Summary</div>
            <div class="order-subtitle">Total Items ({{ totals.count }})</div>
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px">
            <div class="badge-in-progress">In Progress</div>
            <div v-if="heldBills.length" class="held-text-badge">มี {{ heldBills.length }} order ที่พักไว้</div>
          </div>
        </div>

        <!-- Cart items -->
        <div class="order-items">
          <div v-if="!currentBill.items.length" class="order-empty">
            <i class="fa fa-shopping-cart"></i>
            <p>ยังไม่มีรายการ</p>
          </div>
          <div v-for="item in currentBill.items" :key="item.cartId" class="order-item-row">
            <div class="order-item-icon">{{ item.image }}</div>
            <div style="flex:1;min-width:0">
              <div class="order-item-name">
                <span v-if="item.type === 'PRO'" style="font-size:10px;background:#34C759;color:#fff;padding:1px 6px;border-radius:4px;margin-right:4px">ฟรี</span>
                {{ item.name }}
              </div>
              <div class="order-item-sub">฿{{ (item.originalPrice || item.price).toFixed(2) }} x {{ item.qty || 1 }}</div>
              <div v-if="item.addOns && item.addOns.length" class="item-addons-row">
                <span v-for="ao in item.addOns" :key="ao.name" class="addon-chip">
                  {{ ao.name }}<span v-if="ao.price > 0"> +฿{{ ao.price }}</span>
                </span>
              </div>
              <div v-if="!item.isFree">
                <input
                  v-if="editingNoteId === item.cartId"
                  class="item-note-input"
                  v-model="item.note"
                  placeholder="หมายเหตุ..."
                  @blur="editingNoteId = null"
                  @keydown.enter.prevent="editingNoteId = null"
                  :ref="'noteInput_' + item.cartId"
                >
                <div v-else class="item-note-row" @click="startEditNote(item)">
                  <i class="fa fa-pen item-note-icon"></i>
                  <span v-if="item.note" class="item-note-text">{{ item.note }}</span>
                  <span v-else class="item-note-placeholder">เพิ่มโน้ต...</span>
                </div>
              </div>
            </div>
            <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px">
              <div class="order-item-price">฿{{ (item.price * (item.qty || 1)).toFixed(2) }}</div>
              <div style="display:flex;gap:4px">
                <button class="order-item-btn" @click="changeQty(item, -1)" :disabled="item.isFree">
                  <i class="fa fa-minus"></i>
                </button>
                <span class="order-item-qty">{{ item.qty || 1 }}</span>
                <button class="order-item-btn" @click="changeQty(item, 1)" :disabled="item.isFree">
                  <i class="fa fa-plus"></i>
                </button>
                <button class="order-item-btn del" @click="removeItem(item.cartId)" :disabled="item.isFree">
                  <i class="fa fa-trash-alt"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Note -->
        <div class="order-note-wrap">
          <div class="order-note-input">
            <i class="fa fa-sticky-note"></i>
            <input v-model="orderNote" placeholder="เพิ่มหมายเหตุออเดอร์..." style="flex:1;border:none;background:transparent;font-size:12px;font-family:'Kanit',sans-serif;outline:none">
            <i class="fa fa-pen" style="font-size:11px;color:#C7C7CC"></i>
          </div>
        </div>


        <!-- Nearby promo hints -->
        <div v-if="nearbyBillPromos.length" class="promo-panel promo-panel-hint">
          <div v-for="np in nearbyBillPromos" :key="np.id" class="promo-hint-row">
            <i class="fa fa-fire-alt"></i>
            อีก <strong>฿{{ Math.ceil(np.gap) }}</strong> รับ: {{ np.name }}
          </div>
        </div>

        <!-- Payment tabs -->
        <div class="pay-tabs-wrap">
          <div class="pay-tabs-row">
            <button v-for="tab in payTabs" :key="tab.key" class="pay-tab-btn" :class="{ active: activePayTab === tab.key }" @click="activePayTab = tab.key">
              <i class="fa" :class="tab.icon"></i>{{ tab.label }}
            </button>
          </div>
        </div>

        <!-- Employee section -->
        <div class="order-emp-section">
          <div v-if="!selectedEmployee">
            <button class="emp-select-btn" @click="empIdentModal = true">
              <i class="fa fa-user-plus" style="margin-right:6px"></i>ระบุสมาชิก
            </button>
          </div>
          <div v-else>
            <div class="emp-row">
              <div class="emp-row-label"><i class="fa fa-user"></i> สมาชิก — {{ selectedEmployee.name }}</div>
              <button class="emp-change-btn" @click="empIdentModal = true">เปลี่ยน</button>
            </div>
            <div v-if="appliedPrivileges.length" class="emp-row">
              <div class="emp-row-label"><i class="fa fa-tag" style="color:#34C759"></i> สิทธิ์สมาชิก — {{ appliedPrivileges.map(p => p.name).join(', ') }}</div>
              <button class="emp-change-btn" @click="clearAllPrivileges()">ลบ</button>
            </div>
          </div>
          <div class="priv-coupon-row">
            <button v-if="selectedEmployee" class="priv-btn" :class="{ applied: appliedPrivileges.length > 0 }" @click="openPrivModal()">
              <i class="fa fa-id-badge"></i> สิทธิ์สมาชิก
            </button>
            <button class="priv-btn" :class="{ applied: appliedBillPromos.length > 0 }" @click="promoListModalOpen = true">
              <i class="fa fa-wand-magic-sparkles"></i> โปรโมชั่น
              <span v-if="appliedBillPromos.length" class="priv-badge">{{ appliedBillPromos.length }}</span>
            </button>
            <button class="priv-btn" :class="{ applied: currentBill.customDiscount && currentBill.customDiscount.reason }" @click="couponModalOpen = true">
              <i class="fa fa-ticket-alt"></i> คูปอง
            </button>
            <button class="priv-btn" :class="{ applied: currentBill.customDiscount && !currentBill.customDiscount.reason }" @click="discountModalOpen = true">
              <i class="fa fa-tag"></i> ส่วนลด
            </button>
          </div>
        </div>

        <!-- Totals -->
        <div class="order-totals">
          <div class="total-row"><span>ยอดรวม</span><span>฿{{ totals.subtotal.toFixed(2) }}</span></div>
          <div class="total-row disc" v-if="totals.promoDisc > 0"><span>ส่วนลด (โปรสินค้า)</span><span>-฿{{ totals.promoDisc.toFixed(2) }}</span></div>
          <div class="total-row disc" v-if="totals.billPromoDisc > 0"><span>ส่วนลด (โปรโมชัน)</span><span>-฿{{ totals.billPromoDisc.toFixed(2) }}</span></div>
          <div class="total-row disc" v-if="totals.customDisc > 0"><span>ส่วนลดพิเศษ</span><span>-฿{{ totals.customDisc.toFixed(2) }}</span></div>
          <div class="total-row disc" v-if="totals.memberDisc > 0"><span>ส่วนลดสมาชิก</span><span>-฿{{ totals.memberDisc.toFixed(2) }}</span></div>
          <div class="total-row" v-if="settings.scEnabled"><span>ค่าบริการ ({{ settings.scRate }}%)</span><span>฿{{ totals.scAmt.toFixed(2) }}</span></div>
          <div class="total-row" v-if="settings.vatEnabled"><span>VAT {{ settings.vatRate }}%</span><span>฿{{ totals.vatAmt.toFixed(2) }}</span></div>
          <div class="total-grand">
            <span>ยอดสุทธิ</span>
            <span>฿{{ totals.grand.toFixed(2) }}</span>
          </div>
        </div>

        <!-- Action buttons -->
        <div class="order-actions">
          <button class="btn-cancel-order" @click="cancelOrderConfirm()" :disabled="!totals.count">ยกเลิก</button>
          <button class="btn-hold-bill"
            @click="totals.count ? holdBill() : openNewSaleModal()">
            <i :class="totals.count ? 'fa fa-pause-circle' : 'fa fa-layer-group'"></i>
            {{ totals.count ? 'พักบิล' : 'บิลที่ค้างอยู่' }}
            <span v-if="!totals.count && heldBills.length" class="hold-bill-count">{{ heldBills.length }}</span>
          </button>
          <button class="btn-confirm-order" @click="openPayModal()" :disabled="!totals.count">
            {{ totals.count ? 'ชำระเงิน' : 'ยืนยันออเดอร์' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ===================== MODALS ===================== -->

    <!-- Item Status Modal -->
    <div v-if="fsItemModal" class="modal-overlay" @click.self="closeItemModal()">
      <div class="modal-box" style="width:480px;max-width:95vw">
        <div class="modal-inner">
          <div class="fs-imodal-header">
            <div>
              <div class="fs-imodal-room">{{ fsSelectedOrder ? fsSelectedOrder.roomNo : '' }}</div>
              <div class="fs-imodal-customer">{{ fsSelectedOrder ? fsSelectedOrder.customerName : '' }}</div>
            </div>
            <button class="modal-close-btn" @click="closeItemModal()"><i class="fa fa-times"></i></button>
          </div>
          <div class="fs-imodal-list" v-if="fsSelectedOrder">
            <div v-for="(item, i) in fsSelectedOrder.items" :key="i" class="fs-imodal-row">
              <div class="fs-imodal-item-info">
                <span class="fs-imodal-qty">×{{ item.qty }}</span>
                <span class="fs-imodal-name">{{ item.name }}</span>
                <span v-if="item.note" class="fs-imodal-note">{{ item.note }}</span>
              </div>
              <div class="fs-imodal-status-wrap">
                <button
                  class="fs-imodal-chip"
                  :class="'fs-imodal-chip--' + (item.itemStatus || 'pending')"
                  @click="fsOpenItemIdx = (fsOpenItemIdx === i ? null : i)"
                >
                  {{ fsItemStatusLabel(item.itemStatus || 'pending') }}
                  <i class="fa fa-chevron-down" style="font-size:10px;margin-left:4px"></i>
                </button>
                <div v-if="fsOpenItemIdx === i" class="fs-imodal-dropdown">
                  <div
                    v-for="s in fsAvailableStatuses(item.itemStatus || 'pending')"
                    :key="s.value"
                    class="fs-imodal-opt"
                    :class="'fs-imodal-opt--' + s.value"
                    @click="updateItemStatus(item, s.value)"
                  >
                    <i :class="s.icon"></i> {{ s.label }}
                  </div>
                  <div v-if="fsAvailableStatuses(item.itemStatus || 'pending').length === 0" class="fs-imodal-opt-done">
                    สถานะสุดท้ายแล้ว
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Employee Identification -->
    <div v-if="empIdentModal" class="modal-overlay" @click.self="empIdentModal = false">
      <div class="modal-box sm">
        <div class="modal-inner">
          <div class="modal-close-row">
            <div>
              <div class="modal-title">{{ empIdentStep === 'add' ? 'เพิ่มสมาชิกใหม่' : 'ระบุตัวตนสมาชิก' }}</div>
              <div class="modal-sub">{{ empIdentStep === 'add' ? 'กรอกข้อมูลสมาชิก' : 'กรอกรหัสสมาชิก' }}</div>
            </div>
            <button class="modal-close-btn" @click="empIdentModal = false">ยกเลิก</button>
          </div>

          <!-- State: ค้นหา -->
          <div v-if="empIdentStep === 'choose'" class="emp-code-input-wrap">
            <input
              class="emp-code-input"
              v-model="empCodeInput"
              placeholder="รหัสสมาชิก"
              @keydown.enter="verifyEmployee()"
              ref="empInput"
            >
            <p class="emp-hint-text">ทดสอบ: EMP001, EMP002, EMP003</p>
            <button class="btn-verify" @click="verifyEmployee()">
              <i class="fa fa-search" style="margin-right:8px"></i>ยืนยันตัวตน
            </button>
            <div v-if="empNotFound" class="emp-not-found-box">
              <div class="emp-not-found-msg">
                <i class="fa fa-exclamation-circle"></i>
                ไม่พบรหัส "{{ empCodeInput }}" ในระบบ
              </div>
              <div class="emp-not-found-sub">ต้องการเพิ่มสมาชิกใหม่?</div>
            </div>
            <div class="emp-or-row"><span>หรือ</span></div>
            <button class="btn-add-member-new" @click="empIdentStep = 'add'">
              <i class="fa fa-user-plus" style="margin-right:8px"></i>เพิ่มสมาชิกใหม่
            </button>
          </div>

          <!-- State: เพิ่มสมาชิก -->
          <div v-if="empIdentStep === 'add'" class="emp-code-input-wrap">
            <input class="emp-code-input" v-model="empNewName" placeholder="ชื่อสมาชิก *">
            <input class="emp-code-input" v-model="empNewMemberId" placeholder="รหัสสมาชิก *" style="margin-top:8px">
            <input class="emp-code-input" v-model="empNewCard" placeholder="เลขบัตร (ถ้ามี)" @keydown.enter="addNewEmployee()" style="margin-top:8px">
            <button class="btn-add-emp" @click="addNewEmployee()">
              <i class="fa fa-user-plus" style="margin-right:8px"></i>บันทึกสมาชิก
            </button>
            <button class="btn-back-emp" @click="empIdentStep = 'choose'">
              <i class="fa fa-arrow-left" style="margin-right:8px"></i>กลับ
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Privilege Selection -->
    <div v-if="privModalOpen" class="modal-overlay" @click.self="privModalOpen = false">
      <div class="modal-box sm">
        <div class="modal-inner">
          <div class="modal-close-row">
            <div>
              <div class="modal-title">เลือกสิทธิ์พิเศษ</div>
              <div class="modal-sub" v-if="selectedEmployee">{{ selectedEmployee.name }}</div>
            </div>
            <button class="modal-close-btn" @click="privModalOpen = false">ยกเลิก</button>
          </div>
          <div class="priv-check-list">
            <div
              v-for="pt in privilegeTypes"
              :key="pt.id"
              class="priv-check-item"
              :class="{ checked: selectedPrivTypes.includes(pt.id) }"
              @click="togglePrivType(pt.id)"
            >
              <div class="priv-checkbox" :class="{ checked: selectedPrivTypes.includes(pt.id) }">
                <i v-if="selectedPrivTypes.includes(pt.id)" class="fa fa-check"></i>
              </div>
              <div class="priv-check-label">
                {{ pt.name }}
                <div style="font-size:11px;color:#8E8E93">฿{{ employeePrivileges.find(p => p.id === pt.id)?.balance.toFixed(2) }}</div>
              </div>
              <i class="fa fa-chevron-down priv-check-expand"></i>
            </div>
          </div>
          <button class="btn-verify" @click="applyPrivileges(); privModalOpen = false" :disabled="!selectedPrivTypes.length">
            <i class="fa fa-check" style="margin-right:8px"></i>ยืนยัน
          </button>
        </div>
      </div>
    </div>

    <!-- Promo List Modal -->
    <div v-if="promoListModalOpen" class="modal-overlay" @click.self="promoListModalOpen = false">
      <div class="modal-box sm">
        <div class="modal-inner">
          <div class="modal-close-row">
            <div>
              <div class="modal-title">โปรโมชั่น</div>
              <div class="modal-sub">โปรโมชั่นสำหรับบิลนี้</div>
            </div>
            <button class="modal-close-btn" @click="promoListModalOpen = false"><i class="fa fa-times"></i></button>
          </div>

          <!-- Applied promos -->
          <div v-if="appliedBillPromos.length" class="promo-section" style="margin-bottom:16px">
            <div class="promo-section-title"><i class="fa fa-check-circle" style="color:#34C759"></i> โปรที่ใช้งานอยู่</div>
            <div v-for="ap in appliedBillPromos" :key="ap.id" class="promo-avail-row">
              <div class="promo-avail-info">
                <span class="promo-avail-name">{{ ap.name }}</span>
                <span class="promo-applied-saving" style="margin-left:6px">-฿{{ ap.discountAmount.toFixed(2) }}</span>
              </div>
              <button class="promo-remove-btn" @click="removeAppliedPromo(ap.id)"><i class="fa fa-times"></i></button>
            </div>
          </div>

          <!-- Available promos -->
          <div v-if="availableBillPromos.length" class="promo-section" style="margin-bottom:16px">
            <div class="promo-section-title"><i class="fa fa-gift" style="color:#FF9500"></i> โปรที่ใช้ได้ตอนนี้</div>
            <div v-for="promo in availableBillPromos" :key="promo.id" class="promo-avail-row">
              <div class="promo-avail-info">
                <span class="promo-avail-badge" :class="'badge-' + promo.type.toLowerCase()">
                  {{ promo.type === 'DISCOUNT' ? 'ส่วนลด' : promo.type === 'REDEEM' ? 'แลกซื้อ' : 'ของแถม' }}
                </span>
                <span class="promo-avail-name">{{ promo.name }}</span>
              </div>
              <button class="promo-use-btn" @click="handleBillPromo(promo); promoListModalOpen = false">ใช้สิทธิ์</button>
            </div>
          </div>

          <div v-if="!availableBillPromos.length && !appliedBillPromos.length" style="text-align:center;padding:32px 0;color:#8E8E93">
            <i class="fa fa-tag" style="font-size:32px;margin-bottom:10px;display:block;opacity:.3"></i>
            ไม่มีโปรโมชั่นสำหรับบิลนี้
          </div>
        </div>
      </div>
    </div>

    <!-- Discount Modal -->
    <div v-if="discountModalOpen" class="modal-overlay" @click.self="discountModalOpen = false">
      <div class="modal-box sm">
        <div class="modal-inner">
          <div class="modal-close-row">
            <div>
              <div class="modal-title">ส่วนลดบิล</div>
              <div class="modal-sub">เลือกประเภทส่วนลด</div>
            </div>
            <button class="modal-close-btn" @click="discountModalOpen = false"><i class="fa fa-times"></i></button>
          </div>

          <div class="disc-type-row" style="margin-bottom:14px">
            <button :class="['disc-type-btn', { active: discountType === 'amount' }]" @click="discountType = 'amount'">
              <i class="fa fa-baht-sign"></i> จำนวนเงิน (฿)
            </button>
            <button :class="['disc-type-btn', { active: discountType === 'percent' }]" @click="discountType = 'percent'">
              <i class="fa fa-percent"></i> เปอร์เซ็นต์ (%)
            </button>
          </div>

          <div class="disc-input-row" style="margin-bottom:14px">
            <span class="disc-unit">{{ discountType === 'amount' ? '฿' : '' }}</span>
            <input class="disc-amount-input" type="number" min="0" :max="discountType === 'percent' ? 100 : undefined" v-model="discountInput" placeholder="0" @keyup.enter="applyManualDiscount()">
            <span class="disc-unit suffix">{{ discountType === 'percent' ? '%' : '' }}</span>
          </div>

          <div v-if="currentBill.customDiscount && !currentBill.customDiscount.reason" class="disc-applied-info" style="margin-bottom:12px">
            <i class="fa fa-check-circle"></i>
            ส่วนลดปัจจุบัน: <strong>{{ currentBill.customDiscount.type === 'percent' ? currentBill.customDiscount.value + '%' : '฿' + currentBill.customDiscount.value }}</strong>
            <button class="disc-remove-btn" @click="removeManualDiscount()"><i class="fa fa-times"></i> ยกเลิก</button>
          </div>

          <button class="disc-apply-btn" @click="applyManualDiscount()" :disabled="!discountInput || parseFloat(discountInput) <= 0">
            <i class="fa fa-check"></i> ใช้ส่วนลด
          </button>
        </div>
      </div>
    </div>

    <!-- Coupon Modal -->
    <div v-if="couponModalOpen" class="modal-overlay" @click.self="couponModalOpen = false">
      <div class="modal-box sm">
        <div class="modal-inner">
          <div class="modal-close-row">
            <div>
              <div class="modal-title">ใช้คูปองส่วนลด</div>
              <div class="modal-sub"></div>
            </div>
            <button class="modal-close-btn" @click="couponModalOpen = false">ยกเลิก</button>
          </div>
          <input class="coupon-input" v-model="couponCode" placeholder="กรอกรหัสคูปอง เช่น DISC50" @keydown.enter="applyCoupon()">
          <button class="btn-use-coupon" @click="applyCoupon()">ใช้คูปอง</button>
        </div>
      </div>
    </div>

    <!-- Cash Payment Modal -->
    <div v-if="cashModalOpen" class="modal-overlay">
      <div class="modal-box sm">
        <div class="modal-inner">
          <div class="modal-close-row">
            <div><div class="modal-title">ชำระด้วยเงินสด</div></div>
            <button class="modal-close-btn" @click="cashModalOpen = false"><i class="fa fa-times"></i></button>
          </div>
          <div class="cash-amount-display">
            <div class="cash-label">ยอดที่ต้องชำระ</div>
            <div class="cash-amount">฿{{ totals.grand.toFixed(2) }}</div>
          </div>
          <div v-if="parseFloat(cashStr) > 0" class="cash-received-box">
            <div class="cash-label">รับเงิน</div>
            <div class="cash-amount">฿{{ cashStr }}</div>
          </div>
          <div v-if="cashChange >= 0 && parseFloat(cashStr) > 0" class="cash-change-box">
            <div class="cash-label">เงินทอน</div>
            <div class="cash-amount">฿{{ cashChange.toFixed(2) }}</div>
          </div>
          <div class="quick-cash-row">
            <button class="quick-cash-btn" @click="cashStr = String(Math.ceil(totals.grand))">พอดี</button>
            <button class="quick-cash-btn" @click="cashStr = String(Math.ceil(totals.grand / 100) * 100)">฿{{ Math.ceil(totals.grand / 100) * 100 }}</button>
            <button class="quick-cash-btn" @click="cashStr = '500'">฿500</button>
            <button class="quick-cash-btn" @click="cashStr = '1000'">฿1,000</button>
          </div>
          <div class="numpad-grid">
            <template v-for="k in [1,2,3,4,5,6,7,8,9,'.',0,'del']" :key="k">
              <button v-if="k === 'del'" class="numpad-btn del" @click="cashStr = cashStr.slice(0, -1)"><i class="fa fa-delete-left"></i></button>
              <button v-else class="numpad-btn" @click="cashInputFn(k)">{{ k }}</button>
            </template>
          </div>
          <button class="btn-confirm-pay" :disabled="cashChange < 0" @click="completePay('cash'); cashModalOpen = false">
            <i class="fa fa-check" style="margin-right:8px"></i>ยืนยันรับเงิน
          </button>
        </div>
      </div>
    </div>

    <!-- QR Sub-type Modal -->
    <div v-if="qrSubModal" class="modal-overlay" @click.self="qrSubModal = false">
      <div class="modal-box md">
        <div class="modal-inner">
          <div class="modal-close-row">
            <div>
              <div class="modal-title">เลือกช่องทาง QR</div>
              <div class="modal-sub">Select QR payment method</div>
            </div>
          </div>
          <div class="qr-provider-grid">
            <div v-for="qr in qrProviders" :key="qr.key" class="qr-provider-card" @click="selectQrProvider(qr)">
              <div class="qr-provider-logo">{{ qr.icon }}</div>
              <div class="qr-provider-name">{{ qr.name }}</div>
            </div>
          </div>
          <button class="btn-cancel-modal" @click="qrSubModal = false">ยกเลิก</button>
        </div>
      </div>
    </div>

    <!-- ─── QR CODE PAYMENT MODAL ─── -->
    <div v-if="qrPayModal" class="modal-overlay" @click.self="qrPayModal = false">
      <div class="modal-box sm">
        <div class="modal-inner qr-pay-inner">
          <!-- Header -->
          <div class="qr-pay-header">
            <div class="qr-pay-provider-badge">
              <span class="qr-pay-provider-icon">{{ qrPayProvider?.icon }}</span>
              <span class="qr-pay-provider-name">{{ qrPayProvider?.name }}</span>
            </div>
            <button class="modal-close-btn" @click="qrPayModal = false; qrPayProvider = null">
              <i class="fa fa-times"></i>
            </button>
          </div>

          <!-- Amount -->
          <div class="qr-pay-amount-row">
            <span class="qr-pay-amount-label">ยอดที่ต้องชำระ</span>
            <span class="qr-pay-amount">฿{{ totals.grand.toFixed(2) }}</span>
          </div>

          <!-- QR Code -->
          <div class="qr-code-wrap">
            <img
              :src="qrCodeUrl"
              class="qr-code-img"
              alt="QR Code"
            >
            <div class="qr-code-hint">
              <i class="fa fa-mobile-alt"></i>
              สแกน QR Code เพื่อชำระเงิน
            </div>
          </div>

          <!-- Actions -->
          <div class="qr-pay-actions">
            <button class="qr-pay-confirm-btn" @click="confirmQrPay()">
              <i class="fa fa-check-circle"></i> ยืนยันชำระแล้ว
            </button>
            <button class="qr-pay-cancel-btn" @click="qrPayModal = false; qrPayProvider = null">
              ยกเลิก
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Wallet Confirm Modal -->
    <div v-if="walletConfirmModal" class="modal-overlay">
      <div class="modal-box sm">
        <div class="wallet-modal-inner">
          <div style="font-size:15px;font-weight:700;color:#1C1C1E;margin-bottom:4px">ชำระด้วย Wallet</div>
          <div style="font-size:12px;color:#8E8E93;margin-bottom:16px">กรุณายืนยันการชำระเงิน</div>
          <div class="wallet-person">
            <div class="wallet-avatar"><i class="fa fa-user"></i></div>
            <div>
              <div class="wallet-name">{{ selectedEmployee ? selectedEmployee.name : 'ไม่ระบุ' }}</div>
              <div class="wallet-sub">Wallet Member</div>
            </div>
          </div>
          <div class="wallet-amount-box">
            <div class="wallet-amount-label">ยอดชำระ</div>
            <div class="wallet-amount">฿{{ totals.grand.toFixed(2) }}</div>
            <div class="wallet-order-no">⊞ {{ currentOrderNo }}</div>
          </div>
          <div class="wallet-status-box">
            <i class="fa fa-spinner fa-spin wallet-status-icon" v-if="payProcessing"></i>
            <i class="fa fa-info-circle wallet-status-icon" v-else></i>
            <div class="wallet-status-text">
              <strong>{{ payProcessing ? 'กำลังดำเนินการ...' : 'รอการยืนยัน' }}</strong>
              ยืนยันการทักสิทธิ์ Wallet แล้วกด "ยืนยันชำระ"
            </div>
          </div>
          <div class="wallet-actions">
            <button class="btn-wallet-cancel" @click="walletConfirmModal = false">ยกเลิก</button>
            <button class="btn-wallet-confirm" @click="processElectronic('wallet')">
              <i class="fa fa-check-circle"></i> ยืนยันชำระ
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Promo choice modal -->
    <!-- Promo Choice Modal -->
    <!-- ─── ADDON / MODIFIER MODAL ─── -->
    <div v-if="addonModal" class="modal-overlay" @click.self="addonModal = false">
      <div class="modal-box sm">
        <div class="modal-inner">
          <!-- Header -->
          <div class="addon-modal-header">
            <div class="addon-modal-hero"
              :style="addonProduct?.imageUrl ? { backgroundImage: `url('${addonProduct.imageUrl}')` } : {}">
              <span v-if="!addonProduct?.imageUrl" style="font-size:40px;line-height:1">{{ addonProduct?.image }}</span>
            </div>
            <div class="addon-modal-title-wrap">
              <div class="modal-title" style="margin:0">{{ addonProduct?.name }}</div>
              <div class="addon-modal-base-price">ราคาเริ่มต้น ฿{{ addonProduct?.price.toFixed(2) }}</div>
            </div>
            <button class="modal-close-btn" style="margin-left:auto" @click="addonModal = false">
              <i class="fa fa-times"></i>
            </button>
          </div>

          <!-- Addon groups -->
          <div class="addon-groups">
            <div v-for="group in (addonProduct?.addons || [])" :key="group.id" class="addon-group">
              <div class="addon-group-label">
                {{ group.label }}
                <span v-if="group.required" class="addon-required-dot"></span>
              </div>
              <div class="addon-pills">
                <button
                  v-for="opt in group.options"
                  :key="opt.id"
                  class="addon-pill"
                  :class="{ active: addonSelections[group.id] === opt.id }"
                  @click="addonSelections = { ...addonSelections, [group.id]: opt.id }"
                >
                  {{ opt.label }}
                  <span v-if="opt.priceAdd > 0" class="addon-pill-price">+฿{{ opt.priceAdd }}</span>
                  <span v-if="opt.priceAdd < 0" class="addon-pill-price">฿{{ opt.priceAdd }}</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="addon-modal-footer">
            <div class="addon-total">
              <span class="addon-total-label">ราคารวม</span>
              <span class="addon-total-price">฿{{ addonFinalPrice().toFixed(2) }}</span>
            </div>
            <button class="addon-confirm-btn" @click="confirmAddon">
              <i class="fa fa-plus"></i> เพิ่มในออเดอร์
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="promoChoiceModal" class="modal-overlay" @click.self="promoChoiceModal = false">
      <div class="modal-box sm">
        <div class="modal-inner">
          <div class="promo-modal-header">
            <div class="promo-modal-icon fi-purple"><i class="fa fa-wand-magic-sparkles"></i></div>
            <div>
              <div class="modal-title">เลือกโปรโมชัน</div>
              <div class="promo-modal-sub">{{ pendingProduct ? pendingProduct.name : '' }}</div>
            </div>
            <button class="modal-close-btn" style="margin-left:auto" @click="promoChoiceModal = false"><i class="fa fa-times"></i></button>
          </div>
          <div class="promo-row-list">
            <div
              v-for="(pr, idx) in (pendingProduct ? pendingProduct.promos : [])"
              :key="pr.id"
              class="promo-row-item"
              @click="handlePromo(pr)"
            >
              <div class="promo-row-icon" :class="idx === 0 ? 'fi-blue' : 'fi-purple'">
                <i class="fa" :class="idx === 0 ? 'fa-gift' : 'fa-plus'"></i>
              </div>
              <div class="promo-row-text">
                <div class="promo-row-title">{{ pr.title }}</div>
                <div class="promo-row-desc">{{ pr.desc }}</div>
              </div>
              <i class="fa fa-chevron-right promo-row-chevron"></i>
            </div>
          </div>
          <div class="promo-modal-footer">
            <span class="promo-modal-note">* เลือกของแถมได้ 1 อย่างต่อ 1 สิทธิ์</span>
            <button class="promo-skip-btn" @click="promoChoiceModal = false; addToCart(pendingProduct)">ไม่รับสิทธิ์</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Promo Free Item Modal -->
    <div v-if="promoFreeModal" class="modal-overlay" @click.self="promoFreeModal = false">
      <div class="modal-box md">
        <div class="modal-inner">
          <div class="promo-modal-header">
            <div class="promo-modal-icon fi-purple"><i class="fa fa-wand-magic-sparkles"></i></div>
            <div>
              <div class="modal-title">เลือกของแถมฟรี!</div>
              <div class="promo-modal-sub">{{ pendingProduct ? pendingProduct.name : '' }}</div>
            </div>
            <button class="modal-close-btn" style="margin-left:auto" @click="promoFreeModal = false"><i class="fa fa-times"></i></button>
          </div>
          <div class="free-item-grid">
            <div
              v-for="p in freeItemChoices"
              :key="p.id"
              class="free-item-card"
              @click="selectFreeItem(p)"
            >
              <div class="free-item-img">{{ p.image }}</div>
              <div>
                <div class="free-item-name">{{ p.name }}</div>
                <div class="free-item-label">เลือกเป็นของแถม</div>
              </div>
            </div>
          </div>
          <div class="promo-modal-footer">
            <span class="promo-modal-note">* เลือกของแถมได้ 1 อย่างต่อ 1 สิทธิ์</span>
            <div style="display:flex;gap:8px">
              <button class="promo-back-btn" @click="promoFreeModal = false; promoChoiceModal = true">ย้อนกลับ</button>
              <button class="promo-skip-btn" @click="promoFreeModal = false">ไม่รับสิทธิ์</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Redeem Picker Modal -->
    <div v-if="promoRedeemModal" class="modal-overlay" @click.self="promoRedeemModal = false">
      <div class="modal-box md">
        <div class="modal-inner">
          <div class="promo-modal-header">
            <div class="promo-modal-icon fi-blue"><i class="fa fa-exchange-alt"></i></div>
            <div>
              <div class="modal-title">แลกซื้อสินค้าราคาพิเศษ</div>
              <div class="promo-modal-sub">{{ pendingBillPromo ? pendingBillPromo.name : '' }}</div>
            </div>
            <button class="modal-close-btn" style="margin-left:auto" @click="promoRedeemModal = false"><i class="fa fa-times"></i></button>
          </div>
          <div class="promo-pick-grid" v-if="pendingBillPromo">
            <div v-for="item in pendingBillPromo.redeemItems" :key="item.productId"
                 class="promo-pick-card" @click="selectRedeemItem(item)">
              <div class="promo-pick-img">{{ item.image }}</div>
              <div class="promo-pick-name">{{ item.name }}</div>
              <div class="promo-pick-original">฿{{ products.find(p => p.id === item.productId)?.price || 0 }}</div>
              <div class="promo-pick-special">฿{{ item.specialPrice }}</div>
            </div>
          </div>
          <div class="promo-modal-footer">
            <span class="promo-modal-note">* เลือกได้ 1 รายการต่อสิทธิ์</span>
            <button class="promo-skip-btn" @click="promoRedeemModal = false">ไม่รับสิทธิ์</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Gift Picker Modal -->
    <div v-if="promoGiftModal" class="modal-overlay" @click.self="promoGiftModal = false">
      <div class="modal-box md">
        <div class="modal-inner">
          <div class="promo-modal-header">
            <div class="promo-modal-icon fi-green"><i class="fa fa-gift"></i></div>
            <div>
              <div class="modal-title">รับของแถมฟรี!</div>
              <div class="promo-modal-sub">{{ pendingBillPromo ? pendingBillPromo.name : '' }}</div>
            </div>
            <button class="modal-close-btn" style="margin-left:auto" @click="promoGiftModal = false"><i class="fa fa-times"></i></button>
          </div>
          <div class="promo-pick-grid" v-if="pendingBillPromo">
            <div v-for="item in pendingBillPromo.giftItems" :key="item.productId"
                 class="promo-pick-card" @click="selectGiftItem(item)">
              <div class="promo-pick-img">{{ item.image }}</div>
              <div class="promo-pick-name">{{ item.name }}</div>
              <div class="promo-pick-original">฿{{ products.find(p => p.id === item.productId)?.price || 0 }}</div>
              <div class="promo-pick-special" style="color:#34C759">ฟรี!</div>
            </div>
          </div>
          <div class="promo-modal-footer">
            <span class="promo-modal-note">* เลือกของแถมได้ 1 อย่างต่อ 1 สิทธิ์</span>
            <button class="promo-skip-btn" @click="promoGiftModal = false">ไม่รับสิทธิ์</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Settings Modal -->
    <div v-if="settingsOpen" class="modal-overlay" @click.self="settingsOpen = false">
      <div class="modal-box md">
        <div class="modal-inner">
          <div class="modal-close-row">
            <div class="modal-title">ตั้งค่าระบบ</div>
            <button class="modal-close-btn" @click="settingsOpen = false"><i class="fa fa-times"></i></button>
          </div>
          <div class="settings-field">
            <label class="settings-label">ชื่อร้านค้า</label>
            <input class="settings-input" v-model="settingsForm.storeName">
          </div>
          <div class="settings-field">
            <label class="settings-label">ที่อยู่</label>
            <input class="settings-input" v-model="settingsForm.storeAddress">
          </div>
          <div class="settings-field">
            <label class="settings-label">เลขผู้เสียภาษี</label>
            <input class="settings-input" v-model="settingsForm.taxId">
          </div>
          <hr style="border-color:#F2F2F7;margin:16px 0">
          <div class="settings-toggle-row">
            <div>
              <div class="settings-toggle-label">ภาษีมูลค่าเพิ่ม (VAT)</div>
              <div class="settings-toggle-sub">{{ settingsForm.vatRate }}% (อัตราคงที่ตามกฎหมาย)</div>
            </div>
            <div style="display:flex;align-items:center;gap:10px">
              <span style="font-size:12px;background:#EBF5FF;color:#007AFF;padding:3px 8px;border-radius:6px;font-weight:600">{{ settingsForm.vatRate }}%</span>
              <div class="toggle-track" :class="settingsForm.vatEnabled ? 'on' : 'off'" @click="settingsForm.vatEnabled = !settingsForm.vatEnabled">
                <div class="toggle-knob"></div>
              </div>
            </div>
          </div>
          <div class="settings-toggle-row">
            <div>
              <div class="settings-toggle-label">ค่าบริการ</div>
              <div class="settings-toggle-sub">Service Charge</div>
            </div>
            <div style="display:flex;align-items:center;gap:10px">
              <div class="toggle-track" :class="settingsForm.scEnabled ? 'on' : 'off'" @click="settingsForm.scEnabled = !settingsForm.scEnabled">
                <div class="toggle-knob"></div>
              </div>
            </div>
          </div>
          <div v-if="settingsForm.scEnabled" class="settings-field" style="margin-top:8px">
            <label class="settings-label">อัตราค่าบริการ (%)</label>
            <input class="settings-input" type="number" v-model="settingsForm.scRate">
          </div>
          <hr style="border-color:#F2F2F7;margin:16px 0">
          <div class="settings-section-title">หน้าจอการขาย</div>
          <div class="settings-screens-list">
            <div
              v-for="(s, idx) in settingsForm.posScreens"
              :key="s.id"
              class="settings-screen-row"
            >
              <div class="settings-screen-header">
                <i class="fa" :class="s.icon" style="color:#8E8E93;width:16px"></i>
                <input
                  class="settings-input settings-screen-name"
                  v-model="s.name"
                  :disabled="s.id === 'all'"
                  placeholder="ชื่อหน้าจอ"
                >
                <button
                  v-if="s.id !== 'all'"
                  class="settings-screen-del"
                  @click="settingsForm.posScreens.splice(idx, 1)"
                ><i class="fa fa-trash"></i></button>
              </div>
              <div v-if="s.id !== 'all'" class="settings-screen-cats">
                <label v-for="c in allCategories" :key="c.id" class="settings-cat-check">
                  <input type="checkbox" :value="c.id" v-model="s.cats">
                  <span>{{ c.name }}</span>
                </label>
              </div>
            </div>
          </div>
          <button class="settings-add-screen-btn" @click="addSettingsScreen()">
            <i class="fa fa-plus"></i> เพิ่มหน้าจอ
          </button>

          <div class="settings-footer">
            <button class="btn-settings-cancel" @click="settingsOpen = false">ยกเลิก</button>
            <button class="btn-settings-save" @click="saveSettings()">บันทึก</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Logout Confirm -->
    <div v-if="logoutConfirm" class="modal-overlay">
      <div class="modal-box sm">
        <div class="confirm-modal-body">
          <div class="confirm-icon-wrap red"><i class="fa fa-sign-out-alt"></i></div>
          <div class="confirm-title">ออกจากระบบ?</div>
          <div class="confirm-actions">
            <button class="btn-no" @click="logoutConfirm = false">ยกเลิก</button>
            <button class="btn-yes-red" @click="doLogout()">ออกจากระบบ</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== CANCEL PIN MODAL ===== -->
    <div v-if="cancelPinModal" class="modal-overlay" @click.self="cancelPinModal = false; cancelPinAction = null">
      <div class="modal-box sm">
        <div class="confirm-modal-body">
          <div class="confirm-icon-wrap red"><i class="fa fa-shield-alt"></i></div>
          <div class="confirm-title">ยืนยันยกเลิกออเดอร์</div>
          <div class="confirm-sub">กรุณากรอกรหัสพนักงาน Admin</div>
          <div style="width:100%;margin:12px 0 4px">
            <input
              class="cancel-reason-textarea"
              style="width:100%;padding:10px 14px;font-size:15px;letter-spacing:4px;text-align:center;border-radius:10px;border:1.5px solid #E5E5EA;outline:none;box-sizing:border-box"
              type="password"
              v-model="cancelPinValue"
              placeholder="รหัสพนักงาน"
              @keydown.enter="verifyCancelPin()"
              @input="cancelPinError = ''"
              autofocus
            />
          </div>
          <div v-if="cancelPinError" style="color:#FF3B30;font-size:13px;margin-bottom:4px">{{ cancelPinError }}</div>
          <div class="confirm-actions">
            <button class="btn-no" @click="cancelPinModal = false; cancelPinAction = null; cancelPinValue = ''; cancelPinError = ''">ยกเลิก</button>
            <button class="btn-yes-red" :disabled="!cancelPinValue.trim()" @click="verifyCancelPin()">ยืนยัน</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== BUFFET: ปุ่มย้อนกลับหน้าแตะบัตร — ต้องใส่รหัส Supervisor (§3.1) ===== -->
    <div v-if="bufIdleBackPinModal" class="modal-overlay" @click.self="bufCloseIdleBackPin()">
      <div class="modal-box sm">
        <div class="confirm-modal-body">
          <div class="confirm-icon-wrap red"><i class="fa fa-shield-alt"></i></div>
          <div class="confirm-title">ยืนยันออกจากหน้านี้</div>
          <div class="confirm-sub">กรอกรหัสพนักงานเพื่อกลับไปเลือกวิธีชำระเงิน</div>
          <div style="width:100%;margin:12px 0 4px">
            <input
              class="cancel-reason-textarea"
              style="width:100%;padding:10px 14px;font-size:15px;letter-spacing:4px;text-align:center;border-radius:10px;border:1.5px solid #E5E5EA;outline:none;box-sizing:border-box"
              type="password"
              v-model="bufIdleBackPinValue"
              placeholder="รหัสพนักงาน (Supervisor)"
              @keydown.enter="bufConfirmIdleBack()"
              @input="bufIdleBackPinError = ''"
              autofocus
            />
          </div>
          <div v-if="bufIdleBackPinError" style="color:#FF3B30;font-size:13px;margin-bottom:4px">{{ bufIdleBackPinError }}</div>
          <div class="confirm-actions">
            <button class="btn-no" @click="bufCloseIdleBackPin()">ยกเลิก</button>
            <button class="btn-yes-blue" :disabled="!bufIdleBackPinValue.trim()" @click="bufConfirmIdleBack()">ยืนยัน</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== BUFFET: เกรดบัตรไม่ตรงกับประเภทที่เลือกไว้ล่วงหน้า (§2) — warn แต่ยอมให้ดำเนินต่อได้ ===== -->
    <div v-if="bufTapMismatchModal && bufTapMismatchPending" class="modal-overlay" @click.self="bufCancelTapMismatch()">
      <div class="modal-box sm">
        <div class="confirm-modal-body">
          <div class="confirm-icon-wrap red"><i class="fa fa-triangle-exclamation"></i></div>
          <div class="confirm-title">เกรดบัตรไม่ตรงกับประเภทที่เลือกไว้</div>
          <div class="confirm-sub">
            บัตรนี้คือ {{ bufTapMismatchPending.actualTier ? bufTapMismatchPending.actualTier.label : '-' }}
            แต่เลือกไว้ล่วงหน้าเป็น {{ bufSelectedTierInfo ? bufSelectedTierInfo.label : '-' }} (฿{{ bufSelectedTierInfo ? bufSelectedTierInfo.price : 0 }})
            — ยืนยันเก็บเงินตามราคาที่เลือกไว้หรือไม่?
          </div>
          <div class="confirm-actions">
            <button class="btn-no" @click="bufCancelTapMismatch()">ยกเลิก</button>
            <button class="btn-yes-blue" @click="bufConfirmTapMismatch()">ดำเนินการต่อ</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== PRE-ORDER: RESERVATION DETAIL MODAL (§5) ===== -->
    <div v-if="poDetailModal && poDetailReservation" class="modal-overlay" @click.self="poCloseDetail()">
      <div class="modal-box sm" style="position:relative">
        <button class="po-result-close" @click="poCloseDetail()">×</button>
        <div class="confirm-modal-body" style="align-items:stretch;text-align:left">
          <div style="display:flex;align-items:center;gap:10px;width:100%">
            <div class="po-modal-icon-box"><i class="fa fa-calendar-days"></i></div>
            <div style="flex:1;min-width:0">
              <div class="confirm-title po-modal-title" style="margin:0">รายละเอียดการจอง</div>
              <div class="po-modal-id">{{ poDetailReservation.id }}</div>
            </div>
            <span class="po-badge" :class="poStatusMeta(poEffectiveStatus(poDetailReservation)).badge">{{ poStatusMeta(poEffectiveStatus(poDetailReservation)).label }}</span>
          </div>
          <div style="margin-top:14px;font-size:14px;line-height:1.7;color:#3C3C43;width:100%">
            <div><b>{{ poCardInfo(poDetailReservation.cardId) ? poCardInfo(poDetailReservation.cardId).name : poDetailReservation.cardId }}</b> · {{ poCardInfo(poDetailReservation.cardId) ? poCardInfo(poDetailReservation.cardId).cls : '' }}</div>
            <div>วันที่ {{ poFormatDate(poDetailReservation.date) }} · {{ poPeriodOf(poDetailReservation.mealKey) ? poPeriodOf(poDetailReservation.mealKey).mealName : '' }}</div>
            <div v-if="poDetailReservation.collectedAt">เวลารับจริง {{ poDetailReservation.collectedAt }}</div>
            <div style="margin-top:6px">
              <div v-for="(it, i) in poDetailReservation.items" :key="i">• {{ it.name }} ×{{ it.qty }}</div>
            </div>
            <div v-if="poDetailReservation.allergyNote" style="color:#FF9500;margin-top:4px"><i class="fa fa-triangle-exclamation"></i> {{ poDetailReservation.allergyNote }}</div>
            <div v-if="poDetailReservation.status === 'cancelled'" style="margin-top:8px;color:#8E8E93">
              ยกเลิกโดย {{ poDetailReservation.cancelledBy }} เมื่อ {{ poDetailReservation.cancelledAt }}<br>
              เหตุผล: {{ poDetailReservation.cancelReason }}
            </div>
          </div>

          <template v-if="!['collected', 'cancelled'].includes(poEffectiveStatus(poDetailReservation))">
            <div class="nav-divider" style="margin:14px 0;width:100%"></div>

            <label class="cancel-reason-label po-modal-label" style="margin-top:0">เหตุผลการยกเลิก *</label>
            <div class="po-reason-chips">
              <button
                v-for="r in poCancelReasonOptions" :key="r" type="button"
                class="po-reason-chip" :class="{ active: poCancelReasonSel === r }"
                @click="poCancelReasonSel = r"
              >{{ r }}</button>
            </div>

            <label class="cancel-reason-label po-modal-label">รายละเอียดเพิ่มเติม</label>
            <textarea class="cancel-reason-textarea po-modal-textarea" style="width:100%" v-model="poCancelReasonOther" placeholder="รายละเอียดเพิ่มเติม..." rows="2"></textarea>

            <label class="cancel-reason-label po-modal-label">รหัสยืนยัน (PIN) *</label>
            <input type="password" class="po-pin-input" v-model="poCancelPinValue" placeholder="••••" maxlength="6" @input="poCancelPinError = ''" @keydown.enter="poConfirmCancelReservation()">
            <div class="po-pin-hint">กรอก PIN ของคุณเพื่อยืนยันการยกเลิก</div>
            <div v-if="poCancelPinError" class="po-pin-error">{{ poCancelPinError }}</div>

            <div class="po-cancel-warning">
              <i class="fa fa-triangle-exclamation"></i>
              <span>การยกเลิกนี้ไม่สามารถย้อนกลับได้ และจะถูกบันทึกไว้ในระบบ</span>
            </div>

            <div class="confirm-actions po-modal-actions" style="width:100%;margin-top:14px">
              <button class="btn-no po-modal-btn" @click="poCloseDetail()">ย้อนกลับ</button>
              <button class="btn-yes-red po-modal-btn" :disabled="!poCancelReasonSel || (poCancelReasonSel === 'อื่นๆ' && !poCancelReasonOther.trim()) || !poCancelPinValue.trim()" @click="poConfirmCancelReservation()">ยืนยันยกเลิก</button>
            </div>
          </template>
          <template v-else>
            <div class="confirm-actions po-modal-actions" style="width:100%;margin-top:14px">
              <button class="btn-no po-modal-btn" @click="poCloseDetail()">ปิด</button>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- ===== BUFFET: VOID/REFUND MODAL (§6) ===== -->
    <div v-if="bufVoidModal && bufVoidTarget" class="modal-overlay" @click.self="bufCloseVoid()">
      <div class="modal-box sm" style="position:relative">
        <button class="po-result-close" @click="bufCloseVoid()">×</button>
        <div class="confirm-modal-body" style="align-items:stretch;text-align:left">
          <div style="display:flex;align-items:center;gap:10px;width:100%">
            <div class="po-modal-icon-box"><i class="fa fa-receipt"></i></div>
            <div style="flex:1;min-width:0">
              <div class="confirm-title po-modal-title" style="margin:0">ยกเลิกรายการบุฟเฟต์</div>
              <div class="po-modal-id">{{ bufVoidTarget.id }}</div>
            </div>
          </div>
          <div style="margin-top:14px;font-size:14px;line-height:1.7;color:#3C3C43;width:100%">
            <div><b>{{ bufCardInfo(bufVoidTarget.cardId) ? bufCardInfo(bufVoidTarget.cardId).name : bufVoidTarget.cardId }}</b> · {{ bufGradeTierOf(bufVoidTarget.gradeTier) ? bufGradeTierOf(bufVoidTarget.gradeTier).label : '' }}</div>
            <div>วันที่ {{ bufFormatDate(bufVoidTarget.date) }} · เวลา {{ bufVoidTarget.time }} น.</div>
            <div style="margin-top:6px">ยอดที่จ่าย ฿{{ bufVoidTarget.amount }}</div>
          </div>

          <div class="nav-divider" style="margin:14px 0;width:100%"></div>

          <label class="cancel-reason-label po-modal-label" style="margin-top:0">เหตุผลการยกเลิก *</label>
          <div class="po-reason-chips">
            <button v-for="r in bufVoidReasonOptions" :key="r" type="button" class="po-reason-chip" :class="{ active: bufVoidReasonSel === r }" @click="bufVoidReasonSel = r">{{ r }}</button>
          </div>

          <label class="cancel-reason-label po-modal-label">รายละเอียดเพิ่มเติม</label>
          <textarea class="cancel-reason-textarea po-modal-textarea" style="width:100%" v-model="bufVoidReasonOther" placeholder="รายละเอียดเพิ่มเติม..." rows="2"></textarea>

          <label class="cancel-reason-label po-modal-label">รหัสยืนยัน (PIN) *</label>
          <input type="password" class="po-pin-input" v-model="bufVoidPinValue" placeholder="รหัสพนักงาน (Supervisor)" maxlength="6" @input="bufVoidPinError = ''" @keydown.enter="bufConfirmVoid()">
          <div class="po-pin-hint">กรอกรหัสพนักงานระดับ Supervisor เพื่อยืนยันการยกเลิก</div>
          <div v-if="bufVoidPinError" class="po-pin-error">{{ bufVoidPinError }}</div>

          <div class="po-cancel-warning">
            <i class="fa fa-triangle-exclamation"></i>
            <span>การยกเลิกนี้จะคืนเงินเข้าเครดิตนักเรียนอัตโนมัติ และไม่สามารถย้อนกลับได้</span>
          </div>

          <div class="confirm-actions po-modal-actions" style="width:100%;margin-top:14px">
            <button class="btn-no po-modal-btn" @click="bufCloseVoid()">ย้อนกลับ</button>
            <button class="btn-yes-red po-modal-btn" :disabled="!bufVoidReasonSel || (bufVoidReasonSel === 'อื่นๆ' && !bufVoidReasonOther.trim()) || !bufVoidPinValue.trim()" @click="bufConfirmVoid()">ยืนยันยกเลิกรายการ</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== BUFFET: QR TIMEOUT MODAL (§2.1) — เด้งเมื่อ countdown หมด, ไม่กดใน 5 วิ auto กลับหน้าแตะบัตร ===== -->
    <div v-if="bufQrTimeoutModal" class="modal-overlay">
      <div class="modal-box sm">
        <div class="confirm-modal-body">
          <div class="confirm-icon-wrap red"><i class="fa fa-clock"></i></div>
          <div class="confirm-title">QR หมดเวลาแล้ว</div>
          <div class="confirm-sub">ไม่กดเลือกใน 5 วิ จะกลับหน้าแตะบัตรอัตโนมัติ</div>
          <div class="confirm-actions">
            <button class="btn-no" @click="bufQrTimeoutCancel()">ยกเลิก</button>
            <button class="btn-yes-blue" @click="bufQrTimeoutContinue()">ทำรายการต่อ</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Cancel Order Confirm -->
    <div v-if="cancelConfirm" class="modal-overlay">
      <div class="modal-box sm">
        <div class="confirm-modal-body">
          <div class="confirm-icon-wrap red"><i class="fa fa-exclamation-triangle"></i></div>
          <div class="confirm-title">ยืนยันยกเลิกบิลนี้?</div>
          <div class="confirm-sub">{{ currentBill.items.length }} รายการจะถูกลบทั้งหมด</div>
          <div class="confirm-actions">
            <button class="btn-no" @click="cancelConfirm = false">ไม่ยกเลิก</button>
            <button class="btn-yes-red" @click="doCancelBill()">ยืนยันยกเลิก</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== CANCEL ORDER MODAL (เมนูการขาย) — layout เดียวกับ Pre-order/Buffet cancel (§5/§6) ===== -->
    <div v-if="cancelOrderModal && selectedOrder" class="modal-overlay" @click.self="cancelOrderModal = false">
      <div class="modal-box sm" style="position:relative">
        <button class="po-result-close" @click="cancelOrderModal = false">×</button>
        <div class="confirm-modal-body" style="align-items:stretch;text-align:left">
          <div style="display:flex;align-items:center;gap:10px;width:100%">
            <div class="po-modal-icon-box"><i class="fa fa-receipt"></i></div>
            <div style="flex:1;min-width:0">
              <div class="confirm-title po-modal-title" style="margin:0">ยืนยันยกเลิกออเดอร์</div>
              <div class="po-modal-id">{{ selectedOrder.receiptNo }}</div>
            </div>
          </div>
          <div style="margin-top:14px;font-size:14px;line-height:1.7;color:#3C3C43;width:100%">
            <div><b>{{ orderCardInfo(selectedOrder.cardId) ? orderCardInfo(selectedOrder.cardId).name : selectedOrder.customerName }}</b> · {{ orderCardInfo(selectedOrder.cardId) ? orderCardInfo(selectedOrder.cardId).cls : '' }}</div>
            <div>วันที่ซื้อ {{ selectedOrder.date }} · {{ selectedOrder.time }} น.</div>
            <div style="margin-top:6px">
              <div v-for="(it, i) in selectedOrder.items" :key="i">• {{ it.name }} ×{{ it.qty }}</div>
            </div>
            <div style="margin-top:6px">ยอดรวม ฿{{ selectedOrder.total.toFixed(2) }}</div>
          </div>

          <div class="nav-divider" style="margin:14px 0;width:100%"></div>

          <label class="cancel-reason-label po-modal-label" style="margin-top:0">เหตุผลการยกเลิก *</label>
          <div class="po-reason-chips">
            <button
              v-for="r in poCancelReasonOptions" :key="r" type="button"
              class="po-reason-chip" :class="{ active: cancelOrderReasonSel === r }"
              @click="cancelOrderReasonSel = r; cancelOrderReasonOther = r === 'อื่นๆ' ? '' : r"
            >{{ r }}</button>
          </div>

          <label class="cancel-reason-label po-modal-label">รายละเอียดเพิ่มเติม *</label>
          <textarea class="cancel-reason-textarea po-modal-textarea" style="width:100%" v-model="cancelOrderReasonOther" placeholder="เลือกเหตุผลด้านบน หรือพิมพ์รายละเอียดเอง..." rows="2"></textarea>

          <label class="cancel-reason-label po-modal-label">รหัสยืนยัน (PIN) *</label>
          <input type="password" class="po-pin-input" v-model="cancelOrderPinValue" placeholder="รหัสพนักงาน (Supervisor)" maxlength="6" @input="cancelOrderPinError = ''" @keydown.enter="doCancelOrder()">
          <div class="po-pin-hint">กรอกรหัสพนักงานระดับ Supervisor เพื่อยืนยันการยกเลิก</div>
          <div v-if="cancelOrderPinError" class="po-pin-error">{{ cancelOrderPinError }}</div>

          <div class="po-cancel-warning">
            <i class="fa fa-triangle-exclamation"></i>
            <span>การยกเลิกนี้ไม่สามารถย้อนกลับได้ และจะถูกบันทึกไว้ในระบบ</span>
          </div>

          <div class="confirm-actions po-modal-actions" style="width:100%;margin-top:14px">
            <button class="btn-no po-modal-btn" @click="cancelOrderModal = false">ย้อนกลับ</button>
            <button class="btn-yes-red po-modal-btn" :disabled="!cancelOrderReasonSel || !cancelOrderReasonOther.trim() || !cancelOrderPinValue.trim()" @click="doCancelOrder()">ยืนยันยกเลิก</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== CANCEL ORDER SUCCESS POPUP ===== -->
    <div v-if="cancelOrderSuccessModal" class="modal-overlay">
      <div class="modal-box sm">
        <div class="confirm-modal-body">
          <div class="confirm-icon-wrap green"><i class="fa fa-check-circle"></i></div>
          <div class="confirm-title">ยกเลิกออเดอร์สำเร็จ</div>
          <template v-if="cancelOrderSuccessData.refunded">
            <div class="confirm-sub">คืนเงิน ฿{{ cancelOrderSuccessData.amount.toFixed(2) }}</div>
            <div class="confirm-sub">ยอดเงินคงเหลือของนักเรียน ฿{{ cancelOrderSuccessData.balance.toFixed(2) }}</div>
          </template>
          <div v-else class="confirm-sub">ออเดอร์นี้ยังไม่ได้ชำระเงิน จึงไม่มีการคืนเงิน</div>
          <div class="confirm-actions">
            <button class="btn-yes-blue" @click="cancelOrderSuccessModal = false; appScreen = 'cancelled-orders'">ตกลง</button>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== NEW SALE MODAL ===== -->
    <div v-if="newSaleModal" class="held-bills-overlay" @click.self="newSaleModal = false">
      <div class="held-bills-modal">
        <div class="held-bills-header">
          <span class="held-bills-title">New Sale</span>
          <button class="held-bills-close" @click="newSaleModal = false">×</button>
        </div>
        <div class="held-bills-list">
          <!-- รายการบิลพัก -->
          <template v-if="heldBills.length">
            <div style="font-size:13px;color:#8E8E93;font-weight:600;padding:2px 0 6px">มี {{ heldBills.length }} order ที่พักไว้</div>
            <div v-for="(hb, idx) in heldBills" :key="hb.heldAt" class="held-bill-item">
              <div class="held-bill-info">
                <div class="held-bill-label">{{ hb.id }} · พักไว้ {{ hb.heldTime }}</div>
                <div class="held-bill-meta">{{ hb.items.length }} รายการ · {{ hb.items.map(i=>i.name).join(', ') }}</div>
                <div class="held-bill-meta" style="color:#007AFF;font-weight:600">฿{{ hb.total.toFixed(2) }}</div>
              </div>
              <div class="held-bill-actions">
                <button class="held-delete-btn" @click="deleteHeldBill(idx)">ลบ</button>
                <button class="held-recall-btn" @click="recallBill(idx)">กลับมาทำต่อ</button>
              </div>
            </div>
            <div class="held-bills-divider"></div>
          </template>

          <!-- ตัวเลือกสำหรับ order ปัจจุบัน -->
          <div v-if="totals.count" class="new-sale-option" @click="holdThenNew()">
            <div class="new-sale-option-icon" style="background:#FFF4E5;color:#FF9500"><i class="fa fa-pause-circle"></i></div>
            <div class="new-sale-option-text">
              <div class="new-sale-option-title">พัก order นี้ก่อน</div>
              <div class="new-sale-option-sub">เริ่ม order ใหม่ได้เลย</div>
            </div>
            <i class="fa fa-chevron-right" style="color:#C7C7CC"></i>
          </div>
          <div v-if="totals.count" class="new-sale-option" @click="openCancelPin('bill-new')">
            <div class="new-sale-option-icon" style="background:#FFF0EF;color:#FF3B30"><i class="fa fa-trash"></i></div>
            <div class="new-sale-option-text">
              <div class="new-sale-option-title">ยกเลิก order นี้</div>
              <div class="new-sale-option-sub">ลบรายการทั้งหมดออก</div>
            </div>
            <i class="fa fa-chevron-right" style="color:#C7C7CC"></i>
          </div>
          <div v-if="!totals.count && !heldBills.length" class="held-bills-empty">
            <i class="fa fa-shopping-cart"></i>
            <div>ไม่มีรายการในบิลปัจจุบัน</div>
          </div>
        </div>
        <div style="padding:12px 16px;border-top:1px solid #F2F2F7">
          <button style="width:100%;padding:12px;border-radius:10px;border:none;background:#F2F2F7;font-size:14px;font-weight:600;cursor:pointer;font-family:'Inter','Kanit',sans-serif;color:#48484A" @click="newSaleModal = false">ปิด</button>
        </div>
      </div>
    </div>

    <!-- ===== MONEY CONFIRM MODAL ===== -->
    <div v-if="moneyConfirmModal && moneyConfirmData" class="modal-overlay" @click.self="moneyConfirmModal = false">
      <div class="money-confirm-modal">
        <button class="money-modal-close" @click="moneyConfirmModal = false">×</button>
        <div class="money-modal-title">{{ moneyConfirmData.type === 'topup' ? 'เติมเงินสำเร็จ' : 'ถอนเงินสำเร็จ' }}</div>
        <div class="money-modal-body">
          <div class="money-modal-row">{{ moneyConfirmData.type === 'topup' ? 'เติมเงินจำนวน:' : 'คืนเงินจำนวน:' }} <strong>฿{{ moneyConfirmData.amount.toFixed(2) }}</strong></div>
          <div class="money-modal-row">ชื่อพนักงาน: {{ moneyConfirmData.employeeName || '—' }}</div>
          <div class="money-modal-row">วันที่ & เวลา: {{ new Date().toLocaleString('th-TH') }}</div>
          <div class="money-modal-balance">
            ยอดเงินคงเหลือ: <span>฿{{ moneyConfirmData.newBalance.toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== MONEY ERROR MODAL ===== -->
    <div v-if="moneyErrorModal" class="modal-overlay" @click.self="moneyErrorModal = false">
      <div class="money-confirm-modal">
        <button class="money-modal-close" @click="moneyErrorModal = false">×</button>
        <div class="money-modal-title error">ถอนเงินไม่สำเร็จ</div>
        <div class="money-modal-error-msg">ยอดเงินคงเหลือไม่เพียงพอ<br>หรืออินเทอร์เน็ตขัดของ</div>
        <div class="money-modal-body">
          <div class="money-modal-row">คืนเงินจำนวน: <strong>฿{{ parseFloat(moneyAmount || 0).toFixed(2) }}</strong></div>
          <div class="money-modal-row">ยอดเงินคงเหลือ: <strong>฿{{ moneyBalance.toFixed(2) }}</strong></div>
        </div>
        <button class="money-btn-retry" @click="moneyErrorModal = false">ลองอีกครั้ง</button>
      </div>
    </div>

    <!-- Food Payment Modal (shared: food-serving + food-delivery) -->
    <div v-if="fdPaymentModal" class="modal-overlay" @click.self="closeFdPaymentModal()">
      <div class="fs-payment-modal">
        <!-- Header -->
        <div class="fs-pm-header">
          <div class="fs-pm-title">เลือกวิธีชำระเงิน</div>
          <div class="fs-pm-order-info">
            ออเดอร์ <b>{{ fdPaymentTarget ? fdPaymentTarget.roomNo : '' }}</b>
            · {{ fdPaymentTarget ? fdPaymentTarget.customerName : '' }}
          </div>
          <div class="fs-pm-total">฿ {{ fdPaymentTarget ? fdPaymentTarget.total.toLocaleString('th-TH', { minimumFractionDigits: 2 }) : '' }}</div>
        </div>

        <!-- Payment tabs — same style as เมนูการขาย -->
        <div class="fs-pm-tabs-wrap">
          <div class="fs-pm-tabs-row">
            <button v-for="tab in payTabs" :key="tab.key"
              class="fs-pm-tab-btn" :class="{ active: fdActivePayTab === tab.key }"
              @click="fdActivePayTab = tab.key">
              <i class="fa" :class="tab.icon"></i>{{ tab.label }}
            </button>
          </div>
        </div>

        <!-- Member -->
        <div class="fs-pm-extra-section">
          <button class="fs-pm-extra-btn fs-pm-full"
            :class="{ applied: fdMemberName }"
            @click="fdActiveInput = fdActiveInput === 'member' ? null : 'member'">
            <i class="fa fa-user-plus"></i>
            <span>{{ fdMemberName || 'ระบุสมาชิก' }}</span>
          </button>
          <div v-if="fdActiveInput === 'member'" class="fs-pm-inline-row">
            <input class="fs-pm-inline-input" v-model="fdMemberName" placeholder="ชื่อสมาชิก / รหัสบัตร" @keydown.enter="fdActiveInput = null">
            <button class="fs-pm-inline-ok" @click="fdActiveInput = null">ตกลง</button>
          </div>
        </div>

        <!-- Promo + Coupon -->
        <div class="fs-pm-extra-section">
          <div class="fs-pm-btn-pair">
            <button class="fs-pm-extra-btn" :class="{ applied: fdPromoCode }"
              @click="fdActiveInput = fdActiveInput === 'promo' ? null : 'promo'">
              <i class="fa fa-wand-magic-sparkles"></i><span>โปรโมชัน</span>
            </button>
            <button class="fs-pm-extra-btn" :class="{ applied: fdCouponCode }"
              @click="fdActiveInput = fdActiveInput === 'coupon' ? null : 'coupon'">
              <i class="fa fa-ticket-alt"></i><span>{{ fdCouponCode || 'คูปอง' }}</span>
            </button>
          </div>
          <div v-if="fdActiveInput === 'promo'" class="fs-pm-inline-row">
            <input class="fs-pm-inline-input" v-model="fdPromoCode" placeholder="รหัสโปรโมชัน" @keydown.enter="fdActiveInput = null">
            <button class="fs-pm-inline-ok" @click="fdActiveInput = null">ใช้</button>
          </div>
          <div v-if="fdActiveInput === 'coupon'" class="fs-pm-inline-row">
            <input class="fs-pm-inline-input" v-model="fdCouponCode" placeholder="รหัสคูปอง" @keydown.enter="fdActiveInput = null">
            <button class="fs-pm-inline-ok" @click="fdActiveInput = null">ใช้</button>
          </div>
        </div>

        <!-- Discount -->
        <div class="fs-pm-extra-section">
          <button class="fs-pm-extra-btn fs-pm-full" :class="{ applied: fdDiscountAmt }"
            @click="fdActiveInput = fdActiveInput === 'discount' ? null : 'discount'">
            <i class="fa fa-tag"></i>
            <span>{{ fdDiscountAmt ? 'ส่วนลด  -฿' + fdDiscountAmt : 'ส่วนลด' }}</span>
          </button>
          <div v-if="fdActiveInput === 'discount'" class="fs-pm-inline-row">
            <input class="fs-pm-inline-input" v-model="fdDiscountAmt" type="number" min="0" placeholder="ระบุส่วนลด (฿)" @keydown.enter="fdActiveInput = null">
            <button class="fs-pm-inline-ok" @click="fdActiveInput = null">ใช้</button>
          </div>
        </div>

        <!-- Actions -->
        <div class="fs-pm-actions">
          <button class="fs-pm-cancel-btn" @click="closeFdPaymentModal()">ยกเลิก</button>
          <button class="fs-pm-confirm-btn" @click="fdCompleteWithPayment(fdActivePayTab)">ชำระเงิน</button>
        </div>
      </div>
    </div>

    <!-- Toasts -->
    <div class="toast-wrap">
      <div v-for="t in toasts" :key="t.id" class="toast-item" :class="t.type">
        <i class="fa" :class="t.icon"></i><span>{{ t.msg }}</span>
      </div>
    </div>
  </div>
</template>

<script>
const categories = [
  { id: 'all', name: 'ทั้งหมด', icon: 'fa-border-all' },
  { id: 'coffee', name: 'กาแฟ', icon: 'fa-mug-hot' },
  { id: 'tea', name: 'ชา', icon: 'fa-leaf' },
  { id: 'specialty', name: 'พิเศษ', icon: 'fa-wand-magic-sparkles' },
  { id: 'bakery', name: 'เบเกอรี่', icon: 'fa-cookie-bite' }
]

const UNS = 'https://images.unsplash.com/photo-'
const SZ  = '?w=480&h=480&fit=crop&auto=format&q=80'
const products = [
  { id: 1, name: 'Americano', price: 70, image: '☕', imageUrl: UNS+'1509042239860-f550ce710b93'+SZ, cat: 'coffee', sku: 'CF001', stock: 99, promos: [
    { id: 'bogo-any', title: 'ซื้อ 1 แถม 1 (เลือกได้ทุกเมนู)', desc: 'แถมฟรีเครื่องดื่มหมวดเดียวกันอะไรก็ได้!', type: 'ANY_FREE' },
    { id: 'bogo-same', title: 'ซื้อ 1 แถม 1 (เมนูเดิม)', desc: 'รับ Americano เพิ่มอีก 1 แก้วฟรี', type: 'BOGO' }
  ], addons: [
    { id: 'size', label: 'ขนาด', required: true, options: [
      { id: 's', label: 'S', priceAdd: -10 },
      { id: 'm', label: 'M', priceAdd: 0, default: true },
      { id: 'l', label: 'L', priceAdd: +10 },
    ]},
    { id: 'shot', label: 'Extra Shot', required: false, options: [
      { id: 'none', label: 'ไม่เพิ่ม', priceAdd: 0, default: true },
      { id: '1shot', label: '+1 ช็อต', priceAdd: 15 },
      { id: '2shot', label: '+2 ช็อต', priceAdd: 30 },
    ]},
  ]},
  { id: 2, name: 'Espresso', price: 65, image: '☕', imageUrl: UNS+'1510591509098-f4fdc6d0ff04'+SZ, cat: 'coffee', sku: 'CF002', stock: 45, promos: [] },
  { id: 3, name: 'Café Latte', price: 80, image: '☕', imageUrl: UNS+'1461023058943-e3c8eae83d5e'+SZ, cat: 'coffee', sku: 'CF003', stock: 32, promos: [], addons: [
    { id: 'size', label: 'ขนาด', required: true, options: [
      { id: 's', label: 'S', priceAdd: -10 },
      { id: 'm', label: 'M', priceAdd: 0, default: true },
      { id: 'l', label: 'L', priceAdd: +10 },
    ]},
  ]},
  { id: 4, name: 'Cappuccino', price: 80, image: '☕', imageUrl: UNS+'1572442388796-11668a67e53d'+SZ, cat: 'coffee', sku: 'CF004', stock: 28, promos: [] },
  { id: 5, name: 'Mocha', price: 85, image: '🍫', imageUrl: UNS+'1542990253-0d0f5be5f0ed'+SZ, cat: 'coffee', sku: 'CF005', stock: 17, promos: [] },
  { id: 6, name: 'Caramel Macchiato', price: 90, image: '☕', imageUrl: UNS+'1485808191215-127544f38265'+SZ, cat: 'coffee', sku: 'CF006', stock: 8, promos: [] },
  { id: 7, name: 'Matcha Latte', price: 85, image: '🍵', imageUrl: UNS+'1536256263959-770b48d82b0a'+SZ, cat: 'tea', sku: 'TE001', stock: 6, promos: [{ id: 'bogo-matcha', title: 'ซื้อ 1 แถม 1', desc: 'Matcha Latte แถมฟรีอีก 1 แก้วทันที', type: 'BOGO' }] },
  { id: 8, name: 'Thai Tea', price: 65, image: '🧋', imageUrl: UNS+'1558618666-fcd25c85cd64'+SZ, cat: 'tea', sku: 'TE002', stock: 34, promos: [] },
  { id: 9, name: 'Oolong Tea', price: 70, image: '🍵', imageUrl: UNS+'1564890369478-c89ca6d9cde9'+SZ, cat: 'tea', sku: 'TE003', stock: 15, promos: [] },
  { id: 10, name: 'Earl Grey', price: 65, image: '🍵', imageUrl: UNS+'1544787219-7f47ccb76574'+SZ, cat: 'tea', sku: 'TE004', stock: 22, promos: [] },
  { id: 11, name: 'Jasmine Green Tea', price: 60, image: '🍵', imageUrl: UNS+'1556679343-c7306c1976bc'+SZ, cat: 'tea', sku: 'TE005', stock: 19, promos: [] },
  { id: 12, name: 'Strawberry Matcha', price: 120, image: '🍓', imageUrl: UNS+'1582196016295-f8c8bd4b3a99'+SZ, cat: 'specialty', sku: 'SP001', stock: 12, promos: [] },
  { id: 13, name: 'Americano Pandan', price: 100, image: '🌿', imageUrl: UNS+'1556679343-c7306c1976bc'+SZ, cat: 'specialty', sku: 'SP002', stock: 9, promos: [] },
  { id: 14, name: 'Chocolate Latte', price: 95, image: '🍫', imageUrl: UNS+'1578374173703-5cb8a1ed9e20'+SZ, cat: 'specialty', sku: 'SP003', stock: 5, promos: [] },
  { id: 15, name: 'Red Lemon Soda', price: 60, image: '🍋', imageUrl: UNS+'1513558161293-cdaf765ed2fd'+SZ, cat: 'specialty', sku: 'SP004', stock: 30, promos: [] },
  { id: 16, name: 'Honey Lemon', price: 70, image: '🍯', imageUrl: UNS+'1469258943754-db25a90b53c9'+SZ, cat: 'specialty', sku: 'SP005', stock: 26, promos: [] },
  { id: 17, name: 'Passion Fruit Soda', price: 75, image: '🥝', imageUrl: UNS+'1464305408-2ab8f7b6ade9'+SZ, cat: 'specialty', sku: 'SP006', stock: 14, promos: [] },
  { id: 18, name: 'Butterfly Pea Latte', price: 80, image: '💜', imageUrl: UNS+'1571066811602-716837d681de'+SZ, cat: 'specialty', sku: 'SP007', stock: 18, promos: [] },
  { id: 19, name: 'Croissant', price: 65, image: '🥐', imageUrl: UNS+'1555507036-ab1f4038808a'+SZ, cat: 'bakery', sku: 'BK001', stock: 20, promos: [] },
  { id: 20, name: 'Chocolate Cake', price: 90, image: '🍰', imageUrl: UNS+'1578985545062-69928b1d9587'+SZ, cat: 'bakery', sku: 'BK002', stock: 15, promos: [] },
  { id: 21, name: 'Cheesecake', price: 110, image: '🧁', imageUrl: UNS+'1567620905732-2d1ec7ab7445'+SZ, cat: 'bakery', sku: 'BK003', stock: 18, promos: [] },
  { id: 22, name: 'Cookie', price: 45, image: '🍪', imageUrl: UNS+'1499636136210-6f4ee915583e'+SZ, cat: 'bakery', sku: 'BK004', stock: 34, promos: [] },
  { id: 23, name: 'Banana Bread', price: 55, image: '🍞', imageUrl: UNS+'1605807646983-377bc5a76493'+SZ, cat: 'bakery', sku: 'BK005', stock: 11, promos: [] },
  { id: 24, name: 'Waffle', price: 85, image: '🧇', imageUrl: UNS+'1562376552-0d160a2f238d'+SZ, cat: 'bakery', sku: 'BK006', stock: 8, promos: [] }
]

const ordersData = [
  { id: 1, cardId: '1001001', roomNo: '100101-1', phone: '0987894561', receiptNo: '1202602250010', date: '25-02-2026', time: '18:08', total: 564.96, paymentStatus: 'success', foodStatus: 'cooking', customerName: 'ด.ช. ปกรณ์ วงศ์สุข', paymentMethod: 'แม่ณี', subtotal: 480, discount: 0, vat: 48, sc: 39.96, items: [{ name: 'กะเพราไก่ไข่ดาว', qty: 2, price: 320.00, options: ['เพิ่มข้าว', 'เพิ่มเนื้อสัตว์'], note: 'โม่ใส่นัก' }, { name: 'อเมริกาโน่เย็น', qty: 1, price: 80.00, options: ['หวานน้อย 25%', 'เพิ่มช็อตกาแฟ'], note: 'แยกน้ำแข็ง' }, { name: 'น้ำเปล่า', qty: 2, price: 80.00, options: [], note: '' }], note: 'ใส่กล่อง, Delivery Info: Pickup Now, Payment Method: แม่ณี' },
  { id: 2, cardId: '1001002', roomNo: '100101-2', phone: '0987894561', receiptNo: '1202602250009', date: '25-02-2026', time: '17:08', total: 564.96, paymentStatus: '', foodStatus: 'sending', customerName: 'ด.ญ. พิมพ์ชนก แสงทอง', paymentMethod: 'เงินสด', subtotal: 480, discount: 0, vat: 48, sc: 39.96, items: [{ name: 'กะเพราไก่ไข่ดาว', qty: 2, price: 320.00, options: ['เพิ่มข้าว', 'เพิ่มเนื้อสัตว์'], note: 'โม่ใส่นัก' }, { name: 'อเมริกาโน่เย็น', qty: 1, price: 80.00, options: ['หวานน้อย 25%', 'เพิ่มช็อตกาแฟ'], note: 'แยกน้ำแข็ง' }, { name: 'น้ำเปล่า', qty: 2, price: 80.00, options: [], note: '' }], note: 'ใส่กล่อง, Delivery Info: Pickup Now, Payment Method: แม่ณี' },
  { id: 3, cardId: '1001003', roomNo: '100101-3', phone: '0987894561', receiptNo: '1202602250008', date: '25-02-2026', time: '16:45', total: 257.00, paymentStatus: '', foodStatus: 'cancelled', customerName: 'ด.ช. ธนกฤต ศรีสุข', paymentMethod: 'QR Code', subtotal: 220, discount: 0, vat: 22, sc: 19.80, items: [{ name: 'Café Latte', qty: 2, price: 160.00, options: ['ไม่ใส่น้ำตาล'], note: '' }, { name: 'คุกกี้', qty: 1, price: 45.00, options: [], note: '' }], note: '' },
  { id: 4, cardId: '1001004', roomNo: '100108', phone: '0987894561', receiptNo: '1202602250007', date: '25-02-2026', time: '16:20', total: 398.00, paymentStatus: 'success', foodStatus: 'cooking', customerName: 'ด.ญ. ชนิสรา บุญมี', paymentMethod: 'EDC', subtotal: 340, discount: 0, vat: 34, sc: 30.60, items: [{ name: 'Matcha Latte', qty: 2, price: 170.00, options: ['เพิ่มน้ำตาล'], note: '' }, { name: 'Croissant', qty: 2, price: 130.00, options: [], note: '' }], note: '' },
  { id: 5, cardId: '1001005', roomNo: '100102', phone: '0987894561', receiptNo: '1202602250006', date: '25-02-2026', time: '15:55', total: 689.00, paymentStatus: 'success', foodStatus: 'served', customerName: 'ด.ช. ภูริณัฐ เจริญสุข', paymentMethod: 'แม่ณี', subtotal: 590, discount: 0, vat: 59, sc: 53.10, items: [{ name: 'Strawberry Matcha', qty: 3, price: 360.00, options: ['หวานน้อย'], note: 'เร่งด่วน' }, { name: 'Cheesecake', qty: 2, price: 220.00, options: [], note: '' }], note: '' },
  { id: 6, cardId: '1001006', roomNo: '100111', phone: '0987894561', receiptNo: '1202602250005', date: '25-02-2026', time: '15:30', total: 879.00, paymentStatus: '', foodStatus: 'pending', customerName: 'ด.ญ. ณัฏฐณิชา ทองดี', paymentMethod: 'เงินสด', subtotal: 750, discount: 0, vat: 75, sc: 67.50, items: [{ name: 'Caramel Macchiato', qty: 4, price: 360.00, options: ['เพิ่มช็อต'], note: '' }, { name: 'Banana Bread', qty: 2, price: 110.00, options: [], note: '' }, { name: 'Cookie', qty: 6, price: 270.00, options: [], note: '' }], note: 'แยกถุง' },
  { id: 7, cardId: '1001007', roomNo: '100112', phone: '0987894561', receiptNo: '1202602250004', date: '25-02-2026', time: '14:50', total: 548.00, paymentStatus: '', foodStatus: 'cancelled', customerName: 'ด.ช. กิตติภูมิ รุ่งเรือง', paymentMethod: 'QR Code', subtotal: 468, discount: 0, vat: 46.80, sc: 42.12, items: [{ name: 'Thai Tea', qty: 4, price: 260.00, options: ['หวานปกติ'], note: '' }, { name: 'Waffle', qty: 2, price: 170.00, options: [], note: '' }], note: '' },
  { id: 8, cardId: '1001008', roomNo: '100202', phone: '0987894561', receiptNo: '1202602250003', date: '25-02-2026', time: '14:10', total: 497.00, paymentStatus: '', foodStatus: 'sending', customerName: 'ด.ญ. อรวรรณ พันธ์ทอง', paymentMethod: 'EDC', subtotal: 424, discount: 0, vat: 42.40, sc: 38.16, items: [{ name: 'Honey Lemon', qty: 3, price: 210.00, options: [], note: '' }, { name: 'Chocolate Cake', qty: 2, price: 180.00, options: [], note: '' }], note: '' },
  { id: 9, cardId: '1001001', roomNo: '100109', phone: '0987894561', receiptNo: '1202602250002', date: '25-02-2026', time: '13:30', total: 1879.00, paymentStatus: 'success', foodStatus: 'cooking', customerName: 'ด.ช. ปกรณ์ วงศ์สุข', paymentMethod: 'แม่ณี', subtotal: 1600, discount: 0, vat: 160, sc: 144, items: [{ name: 'Americano Pandan', qty: 5, price: 500.00, options: ['ไม่ใส่น้ำตาล', 'เพิ่มแพนดาน'], note: '' }, { name: 'กะเพราไก่ไข่ดาว', qty: 4, price: 640.00, options: ['เพิ่มข้าว'], note: 'ไม่เผ็ด' }, { name: 'น้ำเปล่า', qty: 5, price: 200.00, options: [], note: '' }], note: 'จัดส่ง ห้อง 302' },
  { id: 10, cardId: '1001002', roomNo: '100206', phone: '0987894561', receiptNo: '1202602250001', date: '25-02-2026', time: '12:00', total: 789.00, paymentStatus: '', foodStatus: 'complete', customerName: 'ด.ญ. พิมพ์ชนก แสงทอง', paymentMethod: 'เงินสด', subtotal: 674, discount: 0, vat: 67.40, sc: 60.66, items: [{ name: 'Butterfly Pea Latte', qty: 4, price: 320.00, options: ['หวานน้อย 25%'], note: '' }, { name: 'Passion Fruit Soda', qty: 3, price: 225.00, options: [], note: '' }, { name: 'Croissant', qty: 2, price: 130.00, options: [], note: '' }], note: '' },
  {
    id: 11, cardId: '1001003', roomNo: '100301', phone: '0912-345-678', receiptNo: '1202604240011',
    date: '24-04-2026', time: '10:30', paymentStatus: 'success', foodStatus: 'cooking',
    customerName: 'ด.ช. ธนกฤต ศรีสุข', paymentMethod: 'แม่ณี',
    subtotal: 625, discount: 175, vat: 0, sc: 0, total: 450.00,
    items: [
      {
        name: 'Caramel Macchiato', qty: 2, price: 360.00, originalPrice: 360.00,
        options: ['เพิ่มช็อตกาแฟ +20฿', 'หวานน้อย 25%', 'ไม่ใส่วิปครีม'],
        note: 'แยกแก้ว', promoLabel: null
      },
      {
        name: 'Matcha Latte', qty: 1, price: 0.00, originalPrice: 85.00,
        options: ['ไม่ใส่น้ำตาล'],
        note: '', promoLabel: '🎁 ฟรี — Buy 2 Get 1'
      },
      {
        name: 'Croissant', qty: 3, price: 90.00, originalPrice: 180.00,
        options: ['อุ่นร้อน'],
        note: '', promoLabel: '🏷️ แลกซื้อราคาพิเศษ'
      },
    ],
    promos: [
      { label: 'Buy 2 Get 1 Free — Matcha Latte ฟรี 1 แก้ว', discount: 85 },
      { label: 'แลกซื้อขนมราคาพิเศษ ซื้อครบ ฿200 (Croissant 3 ชิ้น ลด ฿90)', discount: 90 },
    ],
    note: 'ลูกค้า VIP — จัดส่งด่วน ห้อง 301',
  },
  // --- Mock history: วันนี้ 05-05-2026 ---
  { id: 12, cardId: '1001004', roomNo: '201A', phone: '0811111111', receiptNo: '1202605050012', date: '05-05-2026', time: '08:45', total: 340.00, paymentStatus: 'success', foodStatus: 'complete', customerName: 'ด.ญ. ชนิสรา บุญมี', paymentMethod: 'QR Code', subtotal: 290, discount: 0, vat: 29, sc: 26.10, items: [{ name: 'Caramel Macchiato', qty: 2, price: 180.00, options: ['หวานน้อย 25%'], note: '' }, { name: 'น้ำเปล่า', qty: 2, price: 60.00, options: [], note: '' }], note: '' },
  { id: 13, cardId: '1001005', roomNo: '202B', phone: '0822222222', receiptNo: '1202605050013', date: '05-05-2026', time: '09:10', total: 510.00, paymentStatus: 'success', foodStatus: 'complete', customerName: 'ด.ช. ภูริณัฐ เจริญสุข', paymentMethod: 'แม่ณี', subtotal: 435, discount: 0, vat: 43.50, sc: 39.15, items: [{ name: 'Matcha Latte', qty: 3, price: 255.00, options: ['ไม่ใส่น้ำตาล'], note: '' }, { name: 'Strawberry Matcha', qty: 2, price: 240.00, options: ['หวานน้อย'], note: '' }], note: '' },
  { id: 14, cardId: '1001006', roomNo: '203C', phone: '0833333333', receiptNo: '1202605050014', date: '05-05-2026', time: '09:55', total: 420.00, paymentStatus: 'success', foodStatus: 'complete', customerName: 'ด.ญ. ณัฏฐณิชา ทองดี', paymentMethod: 'เงินสด', subtotal: 360, discount: 0, vat: 36, sc: 32.40, items: [{ name: 'Thai Tea', qty: 2, price: 180.00, options: ['หวานปกติ'], note: '' }, { name: 'Honey Lemon', qty: 2, price: 160.00, options: [], note: '' }], note: '' },
  { id: 15, cardId: '1001007', roomNo: '204D', phone: '0844444444', receiptNo: '1202605050015', date: '05-05-2026', time: '10:30', total: 390.00, paymentStatus: 'success', foodStatus: 'complete', customerName: 'ด.ช. กิตติภูมิ รุ่งเรือง', paymentMethod: 'EDC', subtotal: 333, discount: 0, vat: 33.30, sc: 29.97, items: [{ name: 'Butterfly Pea Latte', qty: 2, price: 200.00, options: ['หวานน้อย 25%'], note: '' }, { name: 'Americano Pandan', qty: 1, price: 110.00, options: ['ไม่ใส่น้ำตาล'], note: '' }], note: '' },
  { id: 16, cardId: '1001008', roomNo: '205E', phone: '0855555555', receiptNo: '1202605050016', date: '05-05-2026', time: '11:15', total: 560.00, paymentStatus: 'success', foodStatus: 'complete', customerName: 'ด.ญ. อรวรรณ พันธ์ทอง', paymentMethod: 'แม่ณี', subtotal: 478, discount: 0, vat: 47.80, sc: 43.02, items: [{ name: 'Americano Pandan', qty: 3, price: 330.00, options: ['ไม่ใส่น้ำตาล', 'เพิ่มแพนดาน'], note: '' }, { name: 'Café Latte', qty: 2, price: 180.00, options: ['เพิ่มช็อต'], note: '' }], note: '' },
  { id: 17, cardId: '1001001', roomNo: '206F', phone: '0866666666', receiptNo: '1202605050017', date: '05-05-2026', time: '12:20', total: 620.00, paymentStatus: 'success', foodStatus: 'complete', customerName: 'ด.ช. ปกรณ์ วงศ์สุข', paymentMethod: 'QR Code', subtotal: 529, discount: 0, vat: 52.90, sc: 47.61, items: [{ name: 'Strawberry Matcha', qty: 2, price: 240.00, options: ['หวานน้อย'], note: 'เร่งด่วน' }, { name: 'Passion Fruit Soda', qty: 3, price: 285.00, options: [], note: '' }], note: '' },
  { id: 18, cardId: '1001002', roomNo: '207G', phone: '0877777777', receiptNo: '1202605050018', date: '05-05-2026', time: '13:05', total: 310.00, paymentStatus: 'success', foodStatus: 'complete', customerName: 'ด.ญ. พิมพ์ชนก แสงทอง', paymentMethod: 'เงินสด', subtotal: 265, discount: 0, vat: 26.50, sc: 23.85, items: [{ name: 'Café Latte', qty: 2, price: 180.00, options: [], note: '' }, { name: 'น้ำเปล่า', qty: 3, price: 90.00, options: [], note: '' }], note: '' },
  { id: 19, cardId: '1001003', roomNo: '208H', phone: '0888888888', receiptNo: '1202605050019', date: '05-05-2026', time: '14:00', total: 0, paymentStatus: '', foodStatus: 'cancelled', customerName: 'ด.ช. ธนกฤต ศรีสุข', paymentMethod: 'เงินสด', subtotal: 0, discount: 0, vat: 0, sc: 0, items: [{ name: 'Caramel Macchiato', qty: 1, price: 90.00, options: ['เพิ่มช็อต'], note: '' }, { name: 'Matcha Latte', qty: 2, price: 170.00, options: [], note: '' }], note: 'ยกเลิกโดยลูกค้า' },
  // --- Mock history: เมื่อวาน 04-05-2026 ---
  { id: 20, cardId: '1001004', roomNo: '301A', phone: '0811110001', receiptNo: '1202605040020', date: '04-05-2026', time: '10:00', total: 480.00, paymentStatus: 'success', foodStatus: 'complete', customerName: 'ด.ญ. ชนิสรา บุญมี', paymentMethod: 'แม่ณี', subtotal: 410, discount: 0, vat: 41, sc: 36.90, items: [{ name: 'Matcha Latte', qty: 2, price: 170.00, options: ['หวานน้อย'], note: '' }, { name: 'Caramel Macchiato', qty: 2, price: 180.00, options: [], note: '' }], note: '' },
  { id: 21, cardId: '1001005', roomNo: '302B', phone: '0822220002', receiptNo: '1202605040021', date: '04-05-2026', time: '11:30', total: 345.00, paymentStatus: 'success', foodStatus: 'complete', customerName: 'ด.ช. ภูริณัฐ เจริญสุข', paymentMethod: 'EDC', subtotal: 295, discount: 0, vat: 29.50, sc: 26.55, items: [{ name: 'Thai Tea', qty: 3, price: 270.00, options: ['หวานปกติ'], note: '' }, { name: 'น้ำเปล่า', qty: 1, price: 30.00, options: [], note: '' }], note: '' },
  { id: 22, cardId: '1001006', roomNo: '303C', phone: '0833330003', receiptNo: '1202605040022', date: '04-05-2026', time: '13:45', total: 580.00, paymentStatus: 'success', foodStatus: 'complete', customerName: 'ด.ญ. ณัฏฐณิชา ทองดี', paymentMethod: 'QR Code', subtotal: 495, discount: 0, vat: 49.50, sc: 44.55, items: [{ name: 'Butterfly Pea Latte', qty: 3, price: 300.00, options: ['หวานน้อย 25%'], note: '' }, { name: 'Americano', qty: 2, price: 160.00, options: ['ร้อน'], note: '' }], note: '' },
  { id: 23, cardId: '1001007', roomNo: '304D', phone: '0844440004', receiptNo: '1202605040023', date: '04-05-2026', time: '15:00', total: 0, paymentStatus: '', foodStatus: 'cancelled', customerName: 'ด.ช. กิตติภูมิ รุ่งเรือง', paymentMethod: 'เงินสด', subtotal: 0, discount: 0, vat: 0, sc: 0, items: [{ name: 'Honey Lemon', qty: 2, price: 160.00, options: [], note: '' }], note: 'ยกเลิกก่อนชำระเงิน' },
]

const kitchensData = [
  {
    id: 'k-thai', name: 'ครัวไทย', icon: 'fa-fire', color: 'fi-red',
    menus: ['กะเพราไก่ไข่ดาว', 'ผัดไทย', 'ต้มยำกุ้ง', 'ต้มยำ', 'ข้าวผัด', 'ผัดซีอิ๊ว'],
  },
  {
    id: 'k-beverage', name: 'ครัวเครื่องดื่ม', icon: 'fa-mug-hot', color: 'fi-blue',
    menus: ['Americano', 'Americano Pandan', 'Matcha Latte', 'Café Latte', 'Thai Tea',
            'น้ำเปล่า', 'Honey Lemon', 'Butterfly Pea Latte', 'Passion Fruit Soda',
            'Strawberry Matcha', 'Caramel Macchiato'],
  },
  {
    id: 'k-bakery', name: 'ครัวเบเกอรี่', icon: 'fa-cookie-bite', color: 'fi-orange',
    menus: ['Croissant', 'Cheesecake', 'Waffle', 'คุกกี้', 'Cookie', 'Banana Bread', 'Chocolate Cake'],
  },
]

const branches = [
  { id: 1, name: 'สาขาพระราม 6' },
  { id: 2, name: 'สาขาสยามพารากอน' },
  { id: 3, name: 'สาขาเซ็นทรัลเวิลด์' },
  { id: 4, name: 'สาขาอโศก' }
]

const membersData = [
  { id: 'M001', name: 'คุณสมชาย ใจดี', phone: '081-234-5678', level: 'Gold', points: 2450, discount: 10 },
  { id: 'M002', name: 'คุณสมหญิง รักดี', phone: '089-876-5432', level: 'Silver', points: 850, discount: 5 },
  { id: 'M003', name: 'คุณวิชัย สุขใจ', phone: '062-111-2222', level: 'Platinum', points: 5200, discount: 15 }
]


const taxTransactions = [
  { receiptNo: '1202604020004', date: '02/04/2026', store: 'Canteen1', paymentMethod: 'แม่ณี', foodStatus: 'เสร็จสิ้น', paymentStatus: 'ชำระเงินแล้ว', total: 30.00, items: [{ sku: 'P001', name: 'ช็อคโกแลต', qty: 2, unit: 'ชิ้น', price: 15.00, amount: 30.00 }] },
  { receiptNo: '1202603240003', date: '24/03/2026', store: 'WEB001', paymentMethod: 'เงินสด', foodStatus: 'เสร็จสิ้น', paymentStatus: 'ชำระเงินแล้ว', total: 170.00, items: [{ sku: 'P002', name: 'กาแฟ', qty: 2, unit: 'แก้ว', price: 85.00, amount: 170.00 }] },
  { receiptNo: '1202602190009', date: '19/02/2026', store: 'POS BIH room service', paymentMethod: 'แม่ณี', foodStatus: 'เสร็จสิ้น', paymentStatus: 'ชำระเงินแล้ว', total: 270.00, items: [{ sku: 'P003', name: 'อาหารชุด', qty: 3, unit: 'ชุด', price: 90.00, amount: 270.00 }] },
  { receiptNo: '1202602100004', date: '10/02/2026', store: 'POS BIH room service', paymentMethod: 'พร้อมเพย์', foodStatus: 'เสร็จสิ้น', paymentStatus: 'ชำระเงินแล้ว', total: 148.00, items: [{ sku: 'P004', name: 'เซ็ตอาหาร', qty: 2, unit: 'ชุด', price: 74.00, amount: 148.00 }] },
  { receiptNo: '1202602100003', date: '10/02/2026', store: 'POS BIH room service', paymentMethod: 'พร้อมเพย์', foodStatus: 'เสร็จสิ้น', paymentStatus: 'ชำระเงินแล้ว', total: 30.00, items: [{ sku: 'P005', name: 'น้ำดื่ม', qty: 3, unit: 'ขวด', price: 10.00, amount: 30.00 }] },
  { receiptNo: '1202602100002', date: '10/02/2026', store: 'Canteen1', paymentMethod: 'พร้อมเพย์', foodStatus: 'เสร็จสิ้น', paymentStatus: 'ชำระเงินแล้ว', total: 23.54, items: [{ sku: 'P006', name: 'ขนม', qty: 2, unit: 'ชิ้น', price: 11.77, amount: 23.54 }] },
  { receiptNo: '1202602090002', date: '09/02/2026', store: 'Canteen1', paymentMethod: 'แม่ณี', foodStatus: 'เสร็จสิ้น', paymentStatus: 'ชำระเงินแล้ว', total: 210.00, items: [{ sku: 'P007', name: 'อาหารกลางวัน', qty: 3, unit: 'ชุด', price: 70.00, amount: 210.00 }] },
  { receiptNo: '1202602090001', date: '09/02/2026', store: 'Canteen1', paymentMethod: 'แม่ณี', foodStatus: 'เสร็จสิ้น', paymentStatus: 'ชำระเงินแล้ว', total: 20.00, items: [{ sku: 'P008', name: 'น้ำชา', qty: 2, unit: 'แก้ว', price: 10.00, amount: 20.00 }] },
  { receiptNo: '1202602050005', date: '05/02/2026', store: 'POS BIH room service', paymentMethod: 'คูปอง', foodStatus: 'เสร็จสิ้น', paymentStatus: 'ชำระเงินแล้ว', total: 260.00, items: [{ sku: 'P009', name: 'อาหารชุดพิเศษ', qty: 2, unit: 'ชุด', price: 130.00, amount: 260.00 }] },
  { receiptNo: '1202601170002', date: '17/01/2026', store: 'Canteen1', paymentMethod: 'เครดิต/เดบิต', foodStatus: 'เสร็จสิ้น', paymentStatus: 'ชำระเงินแล้ว', total: 141.00, items: [{ sku: 'P010', name: 'สเต็ก', qty: 1, unit: 'ชิ้น', price: 141.00, amount: 141.00 }] },
  { receiptNo: '1202601150003', date: '15/01/2026', store: 'Canteen1', paymentMethod: 'เงินสด', foodStatus: 'เสร็จสิ้น', paymentStatus: 'ชำระเงินแล้ว', total: 95.00, items: [{ sku: 'P011', name: 'ข้าวไข่เจียว', qty: 1, unit: 'จาน', price: 95.00, amount: 95.00 }] },
  { receiptNo: '1202601100001', date: '10/01/2026', store: 'WEB001', paymentMethod: 'แม่ณี', foodStatus: 'เสร็จสิ้น', paymentStatus: 'ชำระเงินแล้ว', total: 320.00, items: [{ sku: 'P012', name: 'อาหารเซ็ต', qty: 4, unit: 'ชุด', price: 80.00, amount: 320.00 }] },
  { receiptNo: '1202601080004', date: '08/01/2026', store: 'Canteen1', paymentMethod: 'พร้อมเพย์', foodStatus: 'เสร็จสิ้น', paymentStatus: 'ชำระเงินแล้ว', total: 55.00, items: [{ sku: 'P013', name: 'ก๋วยเตี๋ยว', qty: 1, unit: 'ชาม', price: 55.00, amount: 55.00 }] },
  { receiptNo: '1202601050002', date: '05/01/2026', store: 'POS BIH room service', paymentMethod: 'แม่ณี', foodStatus: 'เสร็จสิ้น', paymentStatus: 'ชำระเงินแล้ว', total: 480.00, items: [{ sku: 'P014', name: 'บุฟเฟต์', qty: 4, unit: 'คน', price: 120.00, amount: 480.00 }] },
  { receiptNo: '1202601030001', date: '03/01/2026', store: 'Canteen1', paymentMethod: 'เงินสด', foodStatus: 'เสร็จสิ้น', paymentStatus: 'ชำระเงินแล้ว', total: 75.00, items: [{ sku: 'P015', name: 'ข้าวผัด', qty: 1, unit: 'จาน', price: 75.00, amount: 75.00 }] },
]

const promoDefinitions = [
  {
    id: 'disc-001', name: 'ส่วนลด 10% ซื้อครบ ฿300', code: 'DISC10', type: 'DISCOUNT',
    eligibility: 'ALL', purchaseType: 'AMOUNT', minAmount: 300,
    discountType: 'PERCENT', discountValue: 10, discountMax: 80,
    startDate: '2026-01-01', endDate: '2026-12-31', startTime: '00:01', endTime: '23:59', active: true,
  },
  {
    id: 'disc-002', name: 'ลด ฿50 ซื้อครบ ฿500', code: 'SAVE50', type: 'DISCOUNT',
    eligibility: 'ALL', purchaseType: 'AMOUNT', minAmount: 500,
    discountType: 'AMOUNT', discountValue: 50, discountMax: 0,
    startDate: '2026-01-01', endDate: '2026-12-31', startTime: '00:01', endTime: '23:59', active: true,
  },
  {
    id: 'redeem-001', name: 'แลกซื้อขนมราคาพิเศษ ซื้อครบ ฿200', code: 'REDEEM_SNACK', type: 'REDEEM',
    eligibility: 'ALL', purchaseType: 'AMOUNT', minAmount: 200, redeemCondition: 'ANY',
    redeemItems: [
      { productId: 22, name: 'Cookie', image: '🍪', qty: 1, specialPrice: 20 },
      { productId: 23, name: 'Banana Bread', image: '🍞', qty: 1, specialPrice: 25 },
      { productId: 19, name: 'Croissant', image: '🥐', qty: 1, specialPrice: 30 },
    ],
    startDate: '2026-01-01', endDate: '2026-12-31', startTime: '00:01', endTime: '23:59', active: true,
  },
  {
    id: 'gift-001', name: 'รับขนมฟรี 1 ชิ้น ซื้อครบ ฿400', code: 'GIFT_SNACK', type: 'FREE_GIFT',
    eligibility: 'ALL', purchaseType: 'AMOUNT', minAmount: 400, giftCondition: 'ANY',
    giftItems: [
      { productId: 22, name: 'Cookie', image: '🍪', qty: 1 },
      { productId: 23, name: 'Banana Bread', image: '🍞', qty: 1 },
      { productId: 19, name: 'Croissant', image: '🥐', qty: 1 },
    ],
    startDate: '2026-01-01', endDate: '2026-12-31', startTime: '00:01', endTime: '23:59', active: true,
  },
]

const moneyTransactionsData = [
  { datetime: '24/04/2026  10:53:57', type: 'spend',  merchant: 'ร้านน้ำนิภา',       items: ['ชาเขียว', 'ชานม'],   amount: 20.00 },
  { datetime: '24/04/2026  10:53:51', type: 'spend',  merchant: 'สหกรณ์โรงเรียน',    items: ['ดินสอ', 'ยางลบ'],    amount: 35.00 },
  { datetime: '24/04/2026  10:52:21', type: 'topup',  merchant: 'ผ่านพร้อมเพย์',     items: [],                    amount: 45.00 },
  { datetime: '24/04/2026  10:52:21', type: 'topup',  merchant: 'ผ่านเงินสด',         items: [],                    amount: 45.00 },
  { datetime: '24/04/2026  09:30:10', type: 'spend',  merchant: 'ร้านกาแฟ D4',        items: ['อเมริกาโน่', 'ขนม'], amount: 65.00 },
  { datetime: '24/04/2026  08:15:00', type: 'topup',  merchant: 'ผ่านแม่ณี',          items: [],                    amount: 200.00 },
]

// ══════════════════════════════════════════════════════════════════════════
// PRE-ORDER TAP-TO-COLLECT — mock data (POS_D4504_TAP_TO_COLLECT_SPEC.md)
// ══════════════════════════════════════════════════════════════════════════
const preOrderMealPeriods = [
  { key: 'breakfast', tabName: 'รอบเช้า',    mealName: 'มื้อเช้า',    start: '07:00', end: '08:30' },
  { key: 'lunch',     tabName: 'รอบกลางวัน', mealName: 'มื้อกลางวัน', start: '11:00', end: '13:00' },
  { key: 'dinner',    tabName: 'รอบเย็น',    mealName: 'มื้อเย็น',    start: '16:00', end: '17:30' },
]

function poDateStr(offsetDays) {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  return d.toISOString().slice(0, 10)
}
const PO_TODAY = poDateStr(0)
const PO_YESTERDAY = poDateStr(-1)
const PO_TOMORROW = poDateStr(1)

// cardId → student directory (no real hardware — cardId is whatever the scanner/keyboard-wedge types)
const preOrderCards = {
  '1001001': { name: 'ด.ช. ปกรณ์ วงศ์สุข',      cls: 'ป.4/1', studentId: 'STD24001' },
  '1001002': { name: 'ด.ญ. พิมพ์ชนก แสงทอง',    cls: 'ป.4/2', studentId: 'STD24002' },
  '1001003': { name: 'ด.ช. ธนกฤต ศรีสุข',        cls: 'ป.5/1', studentId: 'STD24003' },
  '1001004': { name: 'ด.ญ. ชนิสรา บุญมี',        cls: 'ป.5/2', studentId: 'STD24004' },
  '1001005': { name: 'ด.ช. ภูริณัฐ เจริญสุข',    cls: 'ป.6/1', studentId: 'STD24005' },
  '1001006': { name: 'ด.ญ. ณัฏฐณิชา ทองดี',      cls: 'ป.3/1', studentId: 'STD24006' },
  '1001007': { name: 'ด.ช. กิตติภูมิ รุ่งเรือง', cls: 'ป.3/2', studentId: 'STD24007' },
  '1001008': { name: 'ด.ญ. อรวรรณ พันธ์ทอง',    cls: 'ป.4/1', studentId: 'STD24008' }, // ไม่มีจองวันนี้เลย (case 1)
  '9009009': { name: 'ด.ช. วีรภัทร ขันแข็ง',      cls: 'ป.6/2', studentId: 'STD24009' }, // บัตรถูกระงับ (case 6)
}
const preOrderSuspendedCards = ['9009009']

let poResSeq = 0
function poRes(fields) {
  poResSeq++
  return {
    id: 'PORES' + String(poResSeq).padStart(4, '0'),
    allergyNote: '', paid: true, status: 'confirmed',
    collectedAt: null, cancelReason: null, cancelledBy: null, cancelledAt: null, overridden: false,
    demoLabel: null, demoMockNow: null,
    ...fields,
  }
}

// demoMockNow: เฉพาะรายการ quick-pick ที่ผลลัพธ์ขึ้นกับเวลาปัจจุบัน (case 2/3/4/ปกติ) — บังคับเวลาให้ demo
// ได้ผลลัพธ์ตรงเคสเสมอไม่ว่าจะทดสอบตอนไหน ส่วนการพิมพ์เลขบัตรจริงในช่อง input จะใช้เวลาจริงเสมอ (ไม่ผ่าน mockNow)
const preOrderReservations = [
  poRes({ cardId: '1001001', date: PO_TODAY, mealKey: 'lunch',
    items: [{ name: 'ข้าวผัดกะเพราไก่ไข่ดาว', qty: 1 }, { name: 'น้ำเปล่า', qty: 1 }],
    demoLabel: 'ปกติ (จองแล้ว/รอรับ)', demoMockNow: '12:00' }),
  poRes({ cardId: '1001002', date: PO_TODAY, mealKey: 'lunch',
    items: [{ name: 'ข้าวหมูทอดกระเทียม', qty: 1 }],
    status: 'collected', collectedAt: '11:32',
    demoLabel: 'รับไปแล้ว (ทดสอบแตะซ้ำ)' }),
  poRes({ cardId: '1001003', date: PO_TODAY, mealKey: 'breakfast',
    items: [{ name: 'ข้าวต้มหมู', qty: 1 }],
    demoLabel: 'จองไว้คนละมื้อ', demoMockNow: '12:00' }),
  poRes({ cardId: '1001004', date: PO_TODAY, mealKey: 'dinner',
    items: [{ name: 'ก๋วยเตี๋ยวน้ำใส', qty: 1 }],
    demoLabel: 'มาก่อนเวลาเปิดรับ', demoMockNow: '10:00' }),
  poRes({ cardId: '1001005', date: PO_TODAY, mealKey: 'breakfast',
    items: [{ name: 'ข้าวเหนียวหมูปิ้ง', qty: 1 }],
    demoLabel: 'พ้นเวลารับแล้ว', demoMockNow: '13:30' }),
  poRes({ cardId: '1001006', date: PO_TODAY, mealKey: 'lunch',
    items: [{ name: 'ข้าวมันไก่', qty: 1 }],
    status: 'cancelled', cancelReason: 'ผู้ปกครองยกเลิกล่วงหน้า', cancelledBy: 'ผู้จัดการ (ADM001)', cancelledAt: PO_YESTERDAY + ' 18:20',
    demoLabel: 'ออเดอร์ถูกยกเลิกแล้ว' }),
  poRes({ cardId: '1001007', date: PO_TODAY, mealKey: 'lunch',
    items: [{ name: 'สปาเก็ตตี้ผัดขี้เมาไก่', qty: 1 }],
    paid: false,
    demoLabel: 'ยังไม่ชำระเงิน' }),
  // ประวัติ (ไม่มี demoLabel — ใช้ทดสอบหน้าประวัติ/ภาพรวม staff เท่านั้น ไม่โชว์เป็น quick-pick)
  poRes({ cardId: '1001001', date: PO_YESTERDAY, mealKey: 'lunch',
    items: [{ name: 'ข้าวผัดหมู', qty: 1 }], status: 'collected', collectedAt: '11:45' }),
  poRes({ cardId: '1001001', date: PO_TOMORROW, mealKey: 'breakfast',
    items: [{ name: 'ข้าวต้มไก่', qty: 1 }] }),
  poRes({ cardId: '1001002', date: PO_YESTERDAY, mealKey: 'dinner',
    items: [{ name: 'ข้าวผัดอเมริกัน', qty: 1 }] }), // ผ่านมื้อไปแล้ว → คำนวณเป็น "ไม่มารับ" อัตโนมัติ
  poRes({ cardId: '1001003', date: PO_YESTERDAY, mealKey: 'breakfast',
    items: [{ name: 'ข้าวต้มหมู', qty: 1 }], status: 'collected', collectedAt: '07:40' }),
]

// ══════════════════════════════════════════════════════════════════════════
// BUFFET (WALK-IN, ไม่มีการจอง) — POS_D4504_BUFFET_SPEC.md
// แยก table/state จาก Pre-Order ทั้งหมดตามที่สเปกกำหนดไว้ (ไม่มีสถานะการจอง 5 แบบ,
// เป็น transaction ทันที) — แม้ตัวอย่างข้อมูลจะใช้นักเรียน/บัตรชุดเดียวกันเพื่อความสมจริง
// ก็ไม่ import/อ้างอิง object ของ Pre-Order เลยแม้แต่จุดเดียว
// ══════════════════════════════════════════════════════════════════════════
function bufDateStr(offsetDays) {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  return d.toISOString().slice(0, 10)
}
const BUF_TODAY = bufDateStr(0)
const BUF_YESTERDAY = bufDateStr(-1)

// ราคาต่อระดับชั้น — mock ตามที่ยืนยันไว้ (รอตัวเลขจริงจากทีม)
const buffetGradeTiers = [
  { key: 'p-junior', label: 'ป.1-3', price: 20 },
  { key: 'p-senior', label: 'ป.4-6', price: 25 },
  { key: 'm-junior', label: 'ม.ต้น', price: 30 },
  { key: 'm-senior', label: 'ม.ปลาย', price: 35 },
  { key: 'teacher',  label: 'คุณครู', price: 40 }, // ราคาจริงยังไม่ยืนยัน (spec §7) — mock placeholder ไปก่อน
]

// รอบมื้อของบุฟเฟต์ (คนละ config กับ preOrderMealPeriods แม้ค่าจะใกล้เคียงกัน — ใช้ตรวจ "แตะซ้ำในมื้อเดียวกัน")
const buffetRounds = [
  { key: 'breakfast', tabName: 'รอบเช้า',    mealName: 'มื้อเช้า',    start: '07:00', end: '08:30' },
  { key: 'lunch',     tabName: 'รอบกลางวัน', mealName: 'มื้อกลางวัน', start: '11:00', end: '13:00' },
  { key: 'dinner',    tabName: 'รอบเย็น',    mealName: 'มื้อเย็น',    start: '16:00', end: '17:30' },
]

// cardId → นักเรียนฝั่งบุฟเฟต์ (ระดับชั้นอย่างเดียว ไม่มี /ห้อง ตามสเปก + ยอดเครดิตคงเหลือในบัตร)
const buffetCards = {
  '1001001': { name: 'ด.ช. ปกรณ์ วงศ์สุข',      gradeTier: 'p-senior', balance: 150 },
  '1001002': { name: 'ด.ญ. พิมพ์ชนก แสงทอง',    gradeTier: 'p-senior', balance: 80 },
  '1001003': { name: 'ด.ช. ธนกฤต ศรีสุข',        gradeTier: 'p-junior', balance: 15 },   // ยอดน้อยกว่าราคา แต่ยังไม่ชนเพดาน -200
  '1001004': { name: 'ด.ญ. ชนิสรา บุญมี',        gradeTier: 'm-junior', balance: 200 },
  '1001005': { name: 'ด.ช. ภูริณัฐ เจริญสุข',    gradeTier: 'm-senior', balance: 300 },
  '1001006': { name: 'ด.ญ. ณัฏฐณิชา ทองดี',      gradeTier: 'p-junior', balance: -190 },  // ใกล้เพดาน -200 (เดโม insufficient-blocked)
  '1001007': { name: 'ด.ช. กิตติภูมิ รุ่งเรือง', gradeTier: 'm-junior', balance: 100 },
  '1001008': { name: 'ด.ญ. อรวรรณ พันธ์ทอง',    gradeTier: 'p-senior', balance: 50 },
  '9009009': { name: 'ด.ช. วีรภัทร ขันแข็ง',      gradeTier: 'm-senior', balance: 100 }, // บัตรถูกระงับ
}
const buffetSuspendedCards = ['9009009']

let bufTxSeq = 0
function bufTx(fields) {
  bufTxSeq++
  return {
    id: 'BUFTX' + String(bufTxSeq).padStart(4, '0'),
    voided: false, voidReason: null, voidedBy: null, voidedAt: null,
    demoLabel: null, demoMockNow: null,
    paymentMethod: 'card', // §5.1/§6 — ค่า default เป็น 'card'; QR ตั้งเป็น 'qr' ตอนสร้าง tx
    guestName: null, // QR ไม่รู้ตัวตนผู้จ่าย (ยืนยันแล้ว) ใช้ label generic แทน cardId
    ...fields,
  }
}

const buffetTransactions = [
  bufTx({ cardId: '1001001', date: BUF_TODAY, round: 'lunch', time: '11:20', gradeTier: 'p-senior', amount: 25 }),
  bufTx({ cardId: '1001004', date: BUF_TODAY, round: 'lunch', time: '11:35', gradeTier: 'm-junior', amount: 30 }),
  bufTx({ cardId: '1001005', date: BUF_TODAY, round: 'lunch', time: '11:50', gradeTier: 'm-senior', amount: 35 }),
  bufTx({ cardId: '1001007', date: BUF_TODAY, round: 'breakfast', time: '07:15', gradeTier: 'm-junior', amount: 30 }),
  bufTx({ cardId: '1001008', date: BUF_TODAY, round: 'breakfast', time: '07:25', gradeTier: 'p-senior', amount: 25 }),
  bufTx({ cardId: '1001002', date: BUF_YESTERDAY, round: 'lunch', time: '11:40', gradeTier: 'p-senior', amount: 25,
    voided: true, voidReason: 'จ่ายผิดคน', voidedBy: 'ผู้จัดการ (ADM001)', voidedAt: BUF_YESTERDAY + ' 15:00' }),
]

// รายการ quick-pick demo — ไม่บันทึกเป็น transaction จริงจนกว่าจะแตะ (ต่างจาก Pre-Order ที่ demo ผูกกับ reservation ที่มีอยู่แล้ว)
const buffetQuickPicks = [
  { label: 'ปกติ (จ่ายสำเร็จ)', cardId: '1001002', mockNow: '12:00' },
  { label: 'แตะซ้ำ (จ่ายมื้อนี้ไปแล้ว)', cardId: '1001001', mockNow: '12:00' },
  { label: 'ยอดไม่พอ แต่ไม่เกิน -200 (ผ่าน)', cardId: '1001003', mockNow: '12:00' },
  { label: 'ยอดไม่พอ เกิน -200 (บล็อก)', cardId: '1001006', mockNow: '12:00' },
  { label: 'ไม่พบข้อมูลบัตรนี้', cardId: '0000000', mockNow: null },
  { label: 'บัตรถูกระงับใช้งาน', cardId: '9009009', mockNow: null },
]

export default {
  name: 'App',
  data() {
    return {
      // ─── SCREEN ──────────────────────────────────────────────────────────
      appScreen: 'login',
      loginUsername: '',
      loginPassword: '',
      loginShowPass: false,
      loginError: '',

      // ─── STATIC DATA ─────────────────────────────────────────────────────
      categories,
      products,
      branches,
      membersData,
      storeName: 'The Coffee House',

      // ─── POS STATE ───────────────────────────────────────────────────────
      selectedScreen: 'all',
      selectedCat: 'all',
      selectedAudience: 'all',
      searchQ: '',
      selectedBranch: 0,
      orderNote: '',

      // ─── BILLS ───────────────────────────────────────────────────────────
      bills: [
        { id: 1, items: [], member: null, customDiscount: null },
        {
          id: 2, customDiscount: null,
          member: { id: 'M001', name: 'คุณสมชาย ใจดี', phone: '081-234-5678', level: 'Gold', points: 2450, discount: 10 },
          items: [
            { id: 1, name: 'Americano', price: 80, image: '☕', cat: 'coffee', sku: 'CF001', stock: 99, promos: [],
              cartId: 90001, qty: 1, type: 'NORMAL', note: 'แยกน้ำแข็ง',
              addOns: [{ name: 'เพิ่มช็อต', price: 10 }] },
            { id: 7, name: 'Matcha Latte', price: 100, image: '🍵', cat: 'tea', sku: 'TE001', stock: 6, promos: [],
              cartId: 90002, qty: 2, type: 'NORMAL', note: '',
              addOns: [{ name: 'น้ำตาลน้อย', price: 0 }, { name: 'เพิ่มมัทฉะ', price: 15 }] },
          ],
        },
      ],
      activeBill: 0,
      billCounter: 2,
      orderCounter: 0,

      // ─── PAYMENT ─────────────────────────────────────────────────────────
      activePayTab: 'Cash',
      payTabs: [
        { key: 'QR', label: 'QR', icon: 'fa-qrcode' },
        { key: 'Cash', label: 'Cash', icon: 'fa-money-bill-wave' },
        { key: 'Wallet', label: 'Wallet', icon: 'fa-wallet' },
        { key: 'EDC', label: 'EDC', icon: 'fa-credit-card' },
      ],
      discountType: 'amount',
      discountInput: '',
      discountModalOpen: false,
      promoListModalOpen: false,
      bottomTab: 'note',
      qrProviders: [
        { key: 'promptpay', name: 'PromptPay', icon: '🏦' },
        { key: 'alipay', name: 'Alipay', icon: '💙' },
        { key: 'wechat', name: 'WeChat Pay', icon: '💚' },
        { key: 'qrcredit', name: 'QR Credit', icon: '💳' },
        { key: 'truemoney', name: 'TrueMoney', icon: '🧡' },
      ],
      cashStr: '',
      payProcessing: false,
      payDone: false,

      // ─── EMPLOYEE ────────────────────────────────────────────────────────
      selectedEmployee: null,
      empIdentModal: false,
      empIdentStep: 'choose',
      empCodeInput: '',
      empNotFound: false,
      empNewName: '',
      empNewMemberId: '',
      empNewCard: '',
      employeeDB: [
        { code: 'EMP001', card: '9000001', name: 'สมชาย ใจดี', dept: 'ฝ่ายขาย', type: 'employee' },
        { code: 'EMP002', card: '9000002', name: 'สมหญิง รักดี', dept: 'ฝ่ายการตลาด', type: 'employee' },
        { code: 'EMP003', card: '9000003', name: 'วิชัย สุขใจ', dept: 'ฝ่ายปฏิบัติการ', type: 'employee' },
      ],
      employeePrivileges: [
        { id: 'meal', name: 'ค่าอาหารพนักงาน', balance: 5.00 },
        { id: 'travel', name: 'เบี้ยเลี้ยงเดินทาง', balance: 20.00 },
        { id: 'welfare', name: 'กระเป๋าเงินสวัสดิการ', balance: 10.00 },
        { id: 'member-disc', name: 'ส่วนลดสมาชิก', balance: 5.00 },
      ],
      privilegeTypes: [
        { id: 'meal', name: 'ค่าอาหารพนักงาน' },
        { id: 'travel', name: 'เบี้ยเลี้ยงเดินทาง' },
        { id: 'welfare', name: 'กระเป๋าเงินสวัสดิการ' },
        { id: 'member-disc', name: 'ส่วนลดสมาชิก' },
      ],
      selectedPrivTypes: [],
      appliedPrivileges: [],
      privModalOpen: false,

      // ─── COUPON ──────────────────────────────────────────────────────────
      couponModalOpen: false,
      couponCode: '',

      // ─── MODALS ──────────────────────────────────────────────────────────
      cashModalOpen: false,
      qrSubModal: false,
      qrPayModal: false,
      qrPayProvider: null,
      walletConfirmModal: false,
      promoChoiceModal: false,
      promoFreeModal: false,
      settingsOpen: false,
      logoutConfirm: false,
      cancelConfirm: false,
      cancelOrderModal: false,
      cancelOrderReasonSel: '',
      cancelOrderReasonOther: '',
      cancelOrderPinValue: '',
      cancelOrderPinError: '',
      cancelOrderSuccessModal: false,
      cancelOrderSuccessData: { amount: 0, balance: 0, refunded: false },
      cancelPinModal: false,
      cancelPinValue: '',
      cancelPinError: '',
      cancelPinAction: null,
      systemUsers: [
        { code: 'ADM001', name: 'ผู้จัดการ', role: 'admin' },
        { code: 'SUP001', name: 'หัวหน้างาน', role: 'supervisor' },
        { code: 'CSH001', name: 'สมชาย ใจดี', role: 'cashier' },
        { code: 'CSH002', name: 'สมหญิง รักดี', role: 'cashier' },
      ],
      heldBills: [],
      newSaleModal: false,

      pendingProduct: null,
      pendingPromo: null,

      // ─── ADDON MODAL ─────────────────────────────────────────────────────
      addonModal: false,
      addonProduct: null,
      addonSelections: {},

      // ─── FOOD SERVING ────────────────────────────────────────────────────
      fsCurrentTime: '',
      fsItemModal: false,
      fsSelectedOrder: null,
      fsCancelModal: false,
      fsCancelTarget: null,
      fsCancelReason: '',
      fdPaymentModal: false,
      fdPaymentTarget: null,
      fdActivePayTab: 'Cash',
      fdMemberName: '',
      fdCouponCode: '',
      fdDiscountAmt: '',
      fdPromoCode: '',
      fdActiveInput: null,
      fsOpenItemIdx: null,

      // ─── ORDERS ──────────────────────────────────────────────────────────
      ordersLoading: false,
      ordersData,
      orderFilterRoom: '',
      orderFilterPayment: '',
      orderFilterFood: '',
      orderPage: 1,
      rowsPerPage: 10,
      selectedOrder: null,
      orderDetailSource: 'orders',

      // ─── CANCELLED ORDERS ────────────────────────────────────────────────
      cancelledOrdersList: [],
      cancelledFilterSearch: '',
      cancelledFilterPayment: '',
      cancelledPage: 1,

      // ─── MONEY MANAGEMENT ────────────────────────────────────────────────
      moneyMode: 'topup',
      moneyUserId: '',
      moneyAmount: '',
      moneyPayChannel: '',
      moneyBalance: null,
      moneyEmployeeFound: false,
      moneyEmployee: { name: '', code: '' },
      moneyConfirmModal: false,
      moneyConfirmData: null,
      moneyErrorModal: false,
      moneyDailyUserId: '',
      moneyDailyData: null,
      moneyTransactionsData,
      moneyChannels: [
        { key: 'cash',      label: 'เงินสด',          icon: 'fa fa-money-bill-wave', color: '#FF3B30' },
        // เครดิต/เดบิตครอบคลุมหลายเครือข่าย — โชว์โลโก้ Visa + Mastercard คู่กัน (icon2 ใช้เฉพาะจอที่รองรับ ไม่กระทบจอเดิม)
        { key: 'card',      label: 'เครดิต / เดบิต',  icon: 'fa-brands fa-cc-visa', color: '#1A1F71', icon2: 'fa-brands fa-cc-mastercard', color2: '#EB001B' },
        // PromptPay ไม่มีไอคอนแบรนด์ทางการใน Font Awesome Free — คงไอคอน QR แทน (ไม่ใช่โลโก้จริง)
        { key: 'promptpay', label: 'พร้อมเพย์',        icon: 'fa fa-qrcode',          color: '#0055B8' },
        { key: 'maenee',    label: 'แม่ณี',            icon: 'fa fa-wallet',          color: '#FF9500' },
        { key: 'wechat',    label: 'Wechat Pay',       icon: 'fa-brands fa-weixin',   color: '#07C160' },
        { key: 'alipay',    label: 'Alipay',           icon: 'fa-brands fa-alipay',   color: '#1677FF' },
      ],

      // ─── TAX INVOICE ─────────────────────────────────────────────────────
      taxTransactions,
      taxFilter: { date: '', paymentMethod: '', search: '' },
      taxPage: 1,
      taxRowsPerPage: 10,
      selectedTaxTransaction: null,
      taxLoading: false,
      taxInvoiceForm: {
        invoiceNo: '', invoiceDate: '', buyerName: '', buyerAddress: '',
        buyerTaxId: '', buyerBranch: 'สำนักงานใหญ่', buyerEmail: '', paymentMethod: '', notes: ''
      },

      // ─── SETTINGS ────────────────────────────────────────────────────────
      settings: {
        storeName: 'The Coffee House',
        storeAddress: '123 ถ.พระราม 6 แขวงพญาไท กรุงเทพฯ 10400',
        taxId: '0-1234-56789-01-2',
        vatEnabled: false,
        vatRate: 7,
        scEnabled: true,
        scRate: 10,
        posScreens: [
          { id: 'all',  name: 'ทั้งหมด',   icon: 'fa-border-all',    cats: [] },
          { id: 's-drinks', name: 'เครื่องดื่ม', icon: 'fa-mug-hot',     cats: ['coffee', 'tea', 'specialty'] },
          { id: 's-food',   name: 'เบเกอรี่',   icon: 'fa-cookie-bite', cats: ['bakery'] },
        ],
      },
      settingsForm: {},

      // ─── SHIFT ───────────────────────────────────────────────────────────
      shiftData: { isOpen: true, totalSales: 0, cashSales: 0, cardSales: 0, qrSales: 0, billCount: 0, cancelCount: 0 },

      // ─── TOASTS ──────────────────────────────────────────────────────────
      toasts: [],
      clock: '',

      // ─── BILL PROMOS ─────────────────────────────────────────────────────
      appliedBillPromos: [],
      promoRedeemModal: false,
      promoGiftModal: false,
      pendingBillPromo: null,
      editingNoteId: null,

      // ─── KITCHEN DISPLAY ─────────────────────────────────────────────────
      kitchensData,
      selectedKitchenId: null,
      kitchenAutoPrint: { 'k-thai': false, 'k-beverage': false, 'k-bakery': false },
      kitchenPrintStatus: {
        '12_k-beverage': true, '13_k-beverage': true, '14_k-beverage': true,
        '16_k-beverage': true, '20_k-beverage': true, '21_k-beverage': true,
      },
      kitchenOrderModal: null,
      kitchenShowHistory: false,
      kitchenHistoryDate: new Date().toLocaleDateString('en-CA'),

      // ─── PRE-ORDER TAP-TO-COLLECT ────────────────────────────────────────
      preOrderMealPeriods,
      preOrderCards,
      preOrderSuspendedCards,
      preOrderReservations,
      poCurrentTime: '',
      poCardInput: '',
      poShowTestTools: false,
      poOfflineSim: false,
      poResult: null,
      poResultTimer: null,
      // §4.5 เคสแตะบัตรไม่ผ่าน (hardware) — คนละกลุ่มกับ business edge case §4
      poMisreadCount: 0,
      poProcessing: false,
      // ภาพรวม staff (§6) — ปุ่ม "ประวัติการจอง" บนหน้า idle พาตรงมาหน้านี้เลย (ไม่ต้องแตะบัตรระบุตัวตนอีกต่อไป)
      poStaffFrom: '',
      poStaffTo: '',
      poStaffPeriodTab: 'all',
      poStaffSearch: '',
      // modal รายละเอียด + ยกเลิก (§5) — PIN ยืนยันอยู่ในโมดัลนี้เอง ไม่ใช้ cancelPinModal กลางแล้ว
      poDetailModal: false,
      poDetailReservation: null,
      poCancelReasonSel: '',
      poCancelReasonOther: '',
      poCancelReasonOptions: ['นักเรียนลาป่วย', 'ผู้ปกครองยกเลิกล่วงหน้า', 'สั่งอาหารผิดรายการ', 'อื่นๆ'],
      poCancelPinValue: '',
      poCancelPinError: '',
      // จอ 2 — customer display (หน้าต่างเบราว์เซอร์ที่ 2 + BroadcastChannel)
      poCustomerWindow: null,
      poBroadcastChannel: null,
      poIsCustomerDisplay: false,

      // ─── BUFFET (WALK-IN) ─────────────────────────────────────────────────
      // table/state ทั้งหมดตั้งแต่ตรงนี้เป็นต้นไปแยกจาก Pre-Order (po*) 100% ตามสเปก
      buffetGradeTiers,
      buffetRounds,
      buffetCards,
      buffetSuspendedCards,
      buffetTransactions,
      buffetQuickPicks,
      bufCurrentTime: '',
      // §2/§3.1 — เลือกประเภทบุฟเฟต์ก่อนแตะบัตร (ราคาผูกไว้ล่วงหน้า ไม่ใช่คำนวณหลังแตะ)
      bufSelectedTier: null,
      bufTypeSearch: '', // ค้นหาประเภทบุฟเฟต์ — เผื่อกรณีมี tier เยอะ
      // เพดานติดลบของบัตร (ตัวเลข +) — ตัวอย่าง 200 ตามสเปก ยังไม่ยืนยันค่าจริงจากทีม (§7) แก้จุดเดียวที่นี่เมื่อได้ค่าจริง
      bufNegativeCapLimit: 200,
      bufCardInput: '',
      bufShowTestTools: false,
      bufOfflineSim: false,
      bufResult: null,
      bufResultTimer: null,
      bufProcessing: false,
      bufMisreadCount: 0,
      // เกรดบัตรไม่ตรงกับ tier ที่เลือกไว้ล่วงหน้า — warn แต่ยอมให้ staff กดดำเนินต่อได้ (ยืนยันแล้ว)
      bufTapMismatchModal: false,
      bufTapMismatchPending: null,
      // §2.1/§8b — เส้นทางสแกน QR (ไม่รู้ตัวตนผู้จ่าย ยืนยันแล้ว — จ่ายจริงผ่าน QR provider โดยตรง)
      bufQrChannel: null,
      bufQrCountdown: 0,
      bufQrTimer: null,
      bufQrTimeoutModal: false,
      bufQrTimeoutAutoTimer: null,
      bufNextScreenPrompt: false, // §2.1 หลัง QR สำเร็จ — ถามเตรียมหน้าจอถัดไป (auto 5 วิ)
      bufNextScreenAutoTimer: null,
      // ภาพรวม staff + drill-down ตามระดับชั้น (§5)
      bufStaffFrom: '',
      bufStaffTo: '',
      bufDrillTier: null,
      bufDrillSearch: '',
      // modal ยกเลิกรายการ/void-refund (§6)
      bufVoidModal: false,
      bufVoidTarget: null,
      bufVoidReasonSel: '',
      bufVoidReasonOther: '',
      bufVoidReasonOptions: ['จ่ายผิดคน', 'จ่ายซ้ำโดยไม่ตั้งใจ', 'ไม่ได้เข้าบุฟเฟต์จริง', 'อื่นๆ'],
      bufVoidPinValue: '',
      bufVoidPinError: '',
      // ปุ่มย้อนกลับหน้าแตะบัตร — ต้องใส่รหัส Supervisor (§3.1)
      bufIdleBackPinModal: false,
      bufIdleBackPinValue: '',
      bufIdleBackPinError: '',
      // จอ 2 — customer display (ช่องทาง BroadcastChannel แยกจาก Pre-Order)
      bufCustomerWindow: null,
      bufBroadcastChannel: null,
      bufIsCustomerDisplay: false,
      bufDisplayTier: null, // sync จากจอ 1 — ใช้โชว่ยอดที่ผูกไว้ก่อนแตะบัตร (§4)
      // จอ 2 — mirror เส้นทาง QR (ระบุตัวตน/เลือกช่องทาง/นับถอยหลัง/หมดเวลา) แบบ real-time
      bufQrDisplayStep: null,
      bufQrDisplayCountdown: 0,
      bufQrDisplayTimer: null,
    }
  },

  computed: {
    currentBill() { return this.bills[this.activeBill] },
    qrCodeUrl() {
      if (!this.qrPayProvider) return ''
      const amount = this.totals ? this.totals.grand.toFixed(2) : '0.00'
      const data = `${this.qrPayProvider.name}:0812345678:THB${amount}`
      return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=16&data=${encodeURIComponent(data)}`
    },
    allCategories() {
      return categories.filter(c => c.id !== 'all')
    },
    visibleCategories() {
      const screen = this.settings.posScreens.find(s => s.id === this.selectedScreen)
      if (!screen || !screen.cats.length) return categories
      return categories.filter(c => c.id === 'all' || screen.cats.includes(c.id))
    },
    catCount() {
      const screen = this.settings.posScreens.find(s => s.id === this.selectedScreen)
      const list = (screen && screen.cats.length)
        ? products.filter(p => screen.cats.includes(p.cat))
        : products
      const map = {}
      for (const c of this.visibleCategories) {
        map[c.id] = c.id === 'all' ? list.length : list.filter(p => p.cat === c.id).length
      }
      return map
    },
    displayedProducts() {
      const screen = this.settings.posScreens.find(s => s.id === this.selectedScreen)
      let list = (screen && screen.cats.length)
        ? products.filter(p => screen.cats.includes(p.cat))
        : products
      if (this.selectedAudience !== 'all') list = list.filter(p => p.audience === this.selectedAudience || p.audience === 'all')
      if (this.selectedCat !== 'all') list = list.filter(p => p.cat === this.selectedCat)
      if (this.searchQ.trim()) {
        const q = this.searchQ.trim().toLowerCase()
        list = list.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q))
      }
      return list
    },
    currentOrderNo() {
      const d = new Date()
      return `A6-${String(this.orderCounter + 1000).slice(1)}`
    },
    freeItemChoices() {
      if (!this.pendingProduct) return []
      return products.filter(p => p.cat === this.pendingProduct.cat && p.id !== this.pendingProduct.id).slice(0, 8)
    },
    totals() {
      const items = this.currentBill.items
      const subtotal = items.reduce((s, i) => s + (i.originalPrice || i.price) * (i.qty || 1), 0)
      const itemTotal = items.reduce((s, i) => s + i.price * (i.qty || 1), 0)
      const promoDisc = subtotal - itemTotal
      const billPromoDisc = this.appliedBillPromos.reduce((s, p) => s + p.discountAmount, 0)
      let customDisc = 0
      const cd = this.currentBill.customDiscount
      if (cd) customDisc = cd.type === 'percent' ? itemTotal * cd.value / 100 : Math.min(cd.value, itemTotal)
      let memberDisc = 0
      const mb = this.currentBill.member
      if (mb) memberDisc = (itemTotal - customDisc) * mb.discount / 100
      const privDisc = this.appliedPrivileges.reduce((s, p) => s + p.amount, 0)
      const totalDisc = promoDisc + billPromoDisc + customDisc + memberDisc + privDisc
      const net = Math.max(subtotal - totalDisc, 0)
      const scAmt = this.settings.scEnabled ? net * this.settings.scRate / 100 : 0
      const bv = net + scAmt
      const vatAmt = this.settings.vatEnabled ? bv * this.settings.vatRate / 100 : 0
      return { subtotal, promoDisc, billPromoDisc, customDisc, memberDisc, privDisc, totalDisc, net, scAmt, vatAmt, grand: bv + vatAmt, count: items.length }
    },
    cashChange() { return (parseFloat(this.cashStr) || 0) - this.totals.grand },
    filteredOrders() {
      return this.ordersData.filter(o => {
        const matchRoom = !this.orderFilterRoom || o.roomNo.includes(this.orderFilterRoom)
        const matchPay = !this.orderFilterPayment || o.paymentStatus === this.orderFilterPayment
        const matchFood = !this.orderFilterFood || o.foodStatus === this.orderFilterFood
        return matchRoom && matchPay && matchFood
      })
    },
    paginatedOrders() {
      const start = (this.orderPage - 1) * this.rowsPerPage
      return this.filteredOrders.slice(start, start + this.rowsPerPage)
    },
    orderTotalPages() {
      return Math.ceil(this.filteredOrders.length / this.rowsPerPage) || 1
    },
    filteredCancelledOrders() {
      return this.cancelledOrdersList.filter(o => {
        const matchSearch = !this.cancelledFilterSearch || o.roomNo.includes(this.cancelledFilterSearch) || o.receiptNo.includes(this.cancelledFilterSearch)
        const matchPay = !this.cancelledFilterPayment || o.paymentStatus === this.cancelledFilterPayment
        return matchSearch && matchPay
      })
    },
    paginatedCancelledOrders() {
      const start = (this.cancelledPage - 1) * this.rowsPerPage
      return this.filteredCancelledOrders.slice(start, start + this.rowsPerPage)
    },
    cancelledTotalPages() {
      return Math.ceil(this.filteredCancelledOrders.length / this.rowsPerPage) || 1
    },
    filteredTaxTransactions() {
      return this.taxTransactions.filter(tx => {
        const matchPayment = !this.taxFilter.paymentMethod || tx.paymentMethod === this.taxFilter.paymentMethod
        const matchSearch = !this.taxFilter.search || tx.receiptNo.includes(this.taxFilter.search) || tx.store.toLowerCase().includes(this.taxFilter.search.toLowerCase())
        return matchPayment && matchSearch
      })
    },
    paginatedTaxTransactions() {
      const start = (this.taxPage - 1) * this.taxRowsPerPage
      return this.filteredTaxTransactions.slice(start, start + this.taxRowsPerPage)
    },
    taxTotalPages() {
      return Math.ceil(this.filteredTaxTransactions.length / this.taxRowsPerPage) || 1
    },
    availableBillPromos() {
      const now = new Date()
      const today = now.toISOString().split('T')[0]
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      const rawSubtotal = this.currentBill.items.reduce((s, i) => s + (i.originalPrice || i.price) * (i.qty || 1), 0)
      const member = this.currentBill.member
      return promoDefinitions.filter(promo => {
        if (!promo.active) return false
        if (today < promo.startDate || today > promo.endDate) return false
        if (currentTime < promo.startTime || currentTime > promo.endTime) return false
        if (promo.eligibility === 'MEMBER' && !member) return false
        if (promo.eligibility === 'GENERAL' && member) return false
        if (this.appliedBillPromos.find(a => a.id === promo.id)) return false
        if ((promo.type === 'FREE_GIFT' || promo.type === 'REDEEM') &&
            this.currentBill.items.find(i => i.promoId === promo.id)) return false
        if (promo.purchaseType === 'AMOUNT') return rawSubtotal >= promo.minAmount
        return false
      })
    },
    nearbyBillPromos() {
      const rawSubtotal = this.currentBill.items.reduce((s, i) => s + (i.originalPrice || i.price) * (i.qty || 1), 0)
      if (!rawSubtotal) return []
      return promoDefinitions.filter(promo => {
        if (!promo.active) return false
        if (this.appliedBillPromos.find(a => a.id === promo.id)) return false
        if (this.availableBillPromos.find(a => a.id === promo.id)) return false
        if (promo.purchaseType === 'AMOUNT') {
          const gap = promo.minAmount - rawSubtotal
          return gap > 0 && gap <= 150
        }
        return false
      }).map(promo => ({ ...promo, gap: promo.minAmount - rawSubtotal }))
    },
    taxInvoiceSubtotal() {
      if (!this.selectedTaxTransaction) return 0
      return this.selectedTaxTransaction.items.reduce((s, item) => s + item.amount, 0)
    },
    taxInvoiceVat() { return 0 },
    taxInvoiceGrand() { return this.taxInvoiceSubtotal + this.taxInvoiceVat },

    currentKitchen() {
      return this.kitchensData.find(k => k.id === this.selectedKitchenId) || null
    },
    kitchenOrders() {
      if (!this.selectedKitchenId) return []
      const kitchen = this.kitchensData.find(k => k.id === this.selectedKitchenId)
      if (!kitchen) return []
      return this.ordersData.filter(ord =>
        ord.items.some(item => kitchen.menus.includes(item.name))
      )
    },
    kitchenHistoryOrders() {
      if (!this.selectedKitchenId || !this.kitchenHistoryDate) return []
      const kitchen = this.kitchensData.find(k => k.id === this.selectedKitchenId)
      if (!kitchen) return []
      return this.ordersData.filter(ord => {
        const [d, m, y] = ord.date.split('-')
        const iso = `${y}-${m}-${d}`
        return iso === this.kitchenHistoryDate &&
          ord.items.some(item => kitchen.menus.includes(item.name))
      })
    },
    kitchenModalItems() {
      if (!this.kitchenOrderModal || !this.selectedKitchenId) return []
      const kitchen = this.kitchensData.find(k => k.id === this.selectedKitchenId)
      if (!kitchen) return []
      return this.kitchenOrderModal.items.filter(item => kitchen.menus.includes(item.name))
    },

    // ─── PRE-ORDER TAP-TO-COLLECT ────────────────────────────────────────
    poQuickPicks() {
      const fromRes = this.preOrderReservations
        .filter(r => r.demoLabel)
        .map(r => ({ label: r.demoLabel, cardId: r.cardId, mockNow: r.demoMockNow }))
      return [
        ...fromRes,
        { label: 'ไม่พบรายการจอง', cardId: '1001008', mockNow: null },
        { label: 'ไม่พบข้อมูลบัตรนี้', cardId: '0000000', mockNow: null },
        { label: 'บัตรถูกระงับใช้งาน', cardId: '9009009', mockNow: null },
      ]
    },
    poIdleCurrentPeriod() {
      return this.poFindActivePeriod(this.poNowMinutes(null))
    },
    poStaffFilteredList() {
      const q = this.poStaffSearch.trim().toLowerCase()
      return this.preOrderReservations.filter(r => {
        if (this.poStaffFrom && r.date < this.poStaffFrom) return false
        if (this.poStaffTo && r.date > this.poStaffTo) return false
        if (this.poStaffPeriodTab !== 'all' && r.mealKey !== this.poStaffPeriodTab) return false
        if (q) {
          const card = this.poCardInfo(r.cardId)
          const hay = [card && card.name, card && card.cls, card && card.studentId, r.cardId].filter(Boolean).join(' ')
          if (!hay.toLowerCase().includes(q)) return false
        }
        return true
      }).sort((a, b) => b.date.localeCompare(a.date))
    },
    poStaffSummary() {
      const list = this.poStaffFilteredList
      const counts = { confirmed: 0, ready: 0, collected: 0, missed: 0, cancelled: 0 }
      list.forEach(r => { counts[this.poEffectiveStatus(r)]++ })
      return { total: list.length, ...counts }
    },

    // ─── BUFFET (WALK-IN) ─────────────────────────────────────────────────
    bufQuickPicks() { return this.buffetQuickPicks },
    // ตัดรายการที่ถูก void ออกจากทั้งสรุปยอดและ drill-down ทันทีตามสเปก §6 ("ตัดออกจากยอดสรุปภาพรวม")
    bufStaffFilteredTx() {
      return this.buffetTransactions.filter(t => {
        if (t.voided) return false
        if (this.bufStaffFrom && t.date < this.bufStaffFrom) return false
        if (this.bufStaffTo && t.date > this.bufStaffTo) return false
        return true
      })
    },
    bufStaffSummary() {
      const list = this.bufStaffFilteredTx
      return { totalPeople: list.length, totalAmount: list.reduce((s, t) => s + t.amount, 0) }
    },
    bufTierBreakdown() {
      const list = this.bufStaffFilteredTx
      return this.buffetGradeTiers.map(tier => {
        const rows = list.filter(t => t.gradeTier === tier.key)
        return { tier, count: rows.length, subtotal: rows.reduce((s, t) => s + t.amount, 0) }
      })
    },
    // §2/§3.1 — ประเภทบุฟเฟต์ที่ cashier เลือกไว้ล่วงหน้า (ราคาผูกไว้ก่อนแตะบัตร)
    bufSelectedTierInfo() {
      return this.bufGradeTierOf(this.bufSelectedTier)
    },
    // เผื่อกรณีมี tier เยอะ — กรองรายการหน้าเลือกประเภทบุฟเฟต์ด้วยชื่อ
    bufFilteredGradeTiers() {
      const q = this.bufTypeSearch.trim().toLowerCase()
      if (!q) return this.buffetGradeTiers
      return this.buffetGradeTiers.filter(t => t.label.toLowerCase().includes(q))
    },
    // §3.1 — วันที่ dd-mm-พ.ศ. มุมล่างซ้ายของหน้าแตะบัตร
    bufTapDateLabel() {
      const [y, m, d] = BUF_TODAY.split('-')
      return `${d}-${m}-${Number(y) + 543}`
    },
    // §2.1 — "ใช้ list เดียวกับหน้าเติมเงิน" กรอง+เรียงเหลือ 4 ช่องทางตามสเปก (ไม่คิด hex ใหม่ ใช้ของเดิมที่มีอยู่แล้ว)
    bufQrChannels() {
      const order = ['promptpay', 'card', 'alipay', 'wechat']
      return order.map(k => this.moneyChannels.find(c => c.key === k)).filter(Boolean)
    },
    bufDrillList() {
      if (!this.bufDrillTier) return []
      const q = this.bufDrillSearch.trim().toLowerCase()
      return this.bufStaffFilteredTx
        .filter(t => t.gradeTier === this.bufDrillTier)
        .filter(t => {
          if (!q) return true
          const card = this.bufCardInfo(t.cardId)
          return ((card && card.name) || '').toLowerCase().includes(q)
        })
        .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time))
    },
  },

  methods: {
    cartQty(productId) {
      return this.currentBill.items
        .filter(i => i.id === productId && i.type === 'NORMAL')
        .reduce((s, i) => s + (i.qty || 1), 0)
    },
    doLogin() {
      if (!this.loginUsername.trim() || !this.loginPassword.trim()) {
        this.loginError = 'กรุณากรอกข้อมูลให้ครบถ้วน'
        return
      }
      if (this.loginPassword === '1234') {
        this.loginError = ''
        this.appScreen = 'feature'
        this.addToast('เข้าสู่ระบบสำเร็จ', 'success')
      } else {
        this.loginError = 'รหัสผ่านไม่ถูกต้อง'
      }
    },
    doLogout() {
      this.appScreen = 'login'
      this.loginPassword = ''
      this.logoutConfirm = false
      this.bills = [{ id: 1, items: [], member: null, customDiscount: null }]
      this.activeBill = 0
      this.selectedEmployee = null
      this.appliedPrivileges = []
    },
    openSettings() {
      this.settingsForm = { ...this.settings }
      this.settingsOpen = true
    },
    saveSettings() {
      Object.assign(this.settings, this.settingsForm)
      this.settingsOpen = false
      this.addToast('บันทึกการตั้งค่าสำเร็จ', 'success')
    },

    // Cart
    addToCart(p) {
      const existing = this.currentBill.items.find(i => i.id === p.id && !i.isFree && i.type === 'NORMAL')
      if (existing) { existing.qty = (existing.qty || 1) + 1 }
      else { this.currentBill.items.push({ ...p, cartId: Date.now(), qty: 1, type: 'NORMAL', note: '' }) }
      this.addToast('เพิ่ม ' + p.name, 'success')
    },
    removeItem(cid) { this.currentBill.items = this.currentBill.items.filter(i => i.cartId !== cid) },
    changeQty(item, d) {
      if (item.isFree) return
      const nq = (item.qty || 1) + d
      if (nq <= 0) { this.removeItem(item.cartId); return }
      item.qty = nq
    },
    handleProduct(p) {
      if (p.addons && p.addons.length) {
        this.openAddonModal(p)
      } else if (p.promos && p.promos.length) {
        this.pendingProduct = p
        this.promoChoiceModal = true
      } else {
        this.addToCart(p)
      }
    },
    selectScreen(id) {
      this.selectedScreen = id
      this.selectedCat = 'all'
    },
    addSettingsScreen() {
      const id = 's-' + Date.now()
      this.settingsForm.posScreens.push({ id, name: 'หน้าจอใหม่', icon: 'fa-star', cats: [] })
    },
    openAddonModal(p) {
      this.addonProduct = p
      const sel = {}
      p.addons.forEach(g => {
        const def = g.options.find(o => o.default) || g.options[0]
        sel[g.id] = def.id
      })
      this.addonSelections = sel
      this.addonModal = true
    },
    addonFinalPrice() {
      if (!this.addonProduct) return 0
      let price = this.addonProduct.price
      this.addonProduct.addons.forEach(g => {
        const opt = g.options.find(o => o.id === this.addonSelections[g.id])
        if (opt) price += (opt.priceAdd || 0)
      })
      return price
    },
    confirmAddon() {
      const p = this.addonProduct
      const finalPrice = this.addonFinalPrice()
      const addOns = []
      p.addons.forEach(g => {
        const opt = g.options.find(o => o.id === this.addonSelections[g.id])
        if (opt && opt.id !== 'none') {
          addOns.push({ name: g.id === 'size' ? `Size ${opt.label}` : opt.label, price: opt.priceAdd > 0 ? opt.priceAdd : 0 })
        }
      })
      const addonKey = JSON.stringify(this.addonSelections)
      const existing = this.currentBill.items.find(i => i.id === p.id && i.addonKey === addonKey && !i.isFree && i.type === 'NORMAL')
      if (existing) {
        existing.qty = (existing.qty || 1) + 1
      } else {
        this.currentBill.items.push({ ...p, price: finalPrice, addOns, addonKey, cartId: Date.now(), qty: 1, type: 'NORMAL', note: '' })
      }
      this.addToast('เพิ่ม ' + p.name, 'success')
      this.addonModal = false
    },
    handleHeaderSearch() {
      if (!this.searchQ.trim()) return
      const p = products.find(x => x.sku.toLowerCase() === this.searchQ.trim().toLowerCase())
      if (p) { this.addToCart(p); this.searchQ = '' }
    },

    // Held Bills
    openNewSaleModal() {
      this.newSaleModal = true
    },
    holdBill() {
      const b = this.currentBill
      const now = new Date()
      const heldTime = now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
      this.heldBills.push({
        id: b.id,
        heldAt: now.getTime(),
        heldTime,
        items: JSON.parse(JSON.stringify(b.items)),
        member: b.member,
        customDiscount: b.customDiscount,
        total: this.totals.grand,
      })
      this.clearBill()
    },
    holdThenNew() {
      this.holdBill()
      this.newSaleModal = false
      this.addToast('พักออเดอร์แล้ว · เริ่มออเดอร์ใหม่', 'info')
    },
    cancelThenNew() {
      this.clearBill()
      this.newSaleModal = false
      this.addToast('ยกเลิกออเดอร์แล้ว · เริ่มออเดอร์ใหม่', 'info')
    },
    recallBill(idx) {
      const hb = this.heldBills[idx]
      if (this.totals.count) this.holdBill()
      const b = this.currentBill
      b.items = JSON.parse(JSON.stringify(hb.items))
      b.member = hb.member
      b.customDiscount = hb.customDiscount
      this.heldBills.splice(idx, 1)
      this.newSaleModal = false
      this.addToast('กลับมาทำออเดอร์ต่อแล้ว', 'success')
    },
    deleteHeldBill(idx) {
      this.heldBills.splice(idx, 1)
    },

    // Bills
    addBill() {
      this.billCounter++
      this.bills.push({ id: this.billCounter, items: [], member: null, customDiscount: null })
      this.activeBill = this.bills.length - 1
      this.addToast('สร้างบิลใหม่', 'info')
    },
    clearBill() {
      const b = this.currentBill
      b.items = []; b.member = null; b.customDiscount = null
      this.appliedBillPromos = []
    },

    // Promo
    handlePromo(pr) {
      this.pendingPromo = pr
      this.promoChoiceModal = false
      if (pr.type === 'ANY_FREE') {
        this.promoFreeModal = true
      } else if (pr.type === 'BOGO') {
        const p = this.pendingProduct
        const tid = Date.now()
        this.currentBill.items.push({ ...p, cartId: tid, qty: 1, type: 'NORMAL', note: '' })
        this.currentBill.items.push({ ...p, name: p.name + ' (ฟรี)', cartId: tid + 1, isFree: true, price: 0, originalPrice: p.price, qty: 1, type: 'PRO', note: 'แถมฟรี' })
        this.addToast('ใช้โปร BOGO สำเร็จ — ' + p.name + ' แถมฟรี 1 แก้ว', 'success')
      }
    },
    selectFreeItem(freeProduct) {
      const p = this.pendingProduct
      const tid = Date.now()
      this.currentBill.items.push({ ...p, cartId: tid, qty: 1, type: 'NORMAL', note: '' })
      this.currentBill.items.push({ ...freeProduct, name: freeProduct.name + ' (ฟรี)', cartId: tid + 1, isFree: true, price: 0, originalPrice: freeProduct.price, qty: 1, type: 'PRO', note: 'ของแถม' })
      this.promoFreeModal = false
      this.addToast('ได้รับ ' + freeProduct.name + ' ฟรี!', 'success')
    },

    // Orders screen
    openOrderDetail(ord, source = 'orders') {
      this.selectedOrder = ord
      this.orderDetailSource = source
      this.appScreen = 'order-detail'
    },
    openCancelOrderModal() {
      this.cancelOrderReasonSel = ''
      this.cancelOrderReasonOther = ''
      this.cancelOrderPinValue = ''
      this.cancelOrderPinError = ''
      this.cancelOrderModal = true
    },
    doCancelOrder() {
      if (!this.selectedOrder) return
      const reason = this.cancelOrderReasonOther.trim()
      if (!this.cancelOrderReasonSel || !reason) return
      const code = this.cancelOrderPinValue.trim()
      const admin = this.systemUsers.find(u => u.code === code && u.role === 'supervisor')
      if (!admin) {
        this.cancelOrderPinError = 'รหัสไม่ถูกต้อง หรือไม่มีสิทธิ์ยกเลิกออเดอร์'
        this.cancelOrderPinValue = ''
        return
      }
      const ord = this.selectedOrder
      ord.isCancelled = true
      ord.foodStatus = 'cancelled'
      ord.cancelReason = reason
      ord.cancelledBy = `${admin.name} (${admin.code})`
      ord.cancelledAt = new Date().toLocaleString('th-TH')
      this.cancelledOrdersList.push(ord)
      this.cancelOrderModal = false

      // คืนเงินเข้าเครดิตบัตรนักเรียนเฉพาะออเดอร์ที่ชำระเงินแล้วจริง (เหมือน bufConfirmVoid)
      const card = this.buffetCards[ord.cardId]
      const refunded = ord.paymentStatus === 'success' && !!card
      if (refunded) card.balance += ord.total
      this.cancelOrderSuccessData = { amount: ord.total, balance: card ? card.balance : 0, refunded }
      this.cancelOrderSuccessModal = true
    },
    cycleOrderStatus(ord) {
      const cycle = { pending: 'cooking', cooking: 'sending', sending: 'served', served: 'complete', complete: 'pending', cancelled: 'pending' }
      ord.foodStatus = cycle[ord.foodStatus] || 'pending'
      this.addToast('อัปเดตสถานะ: ' + ord.roomNo + ' → ' + ord.foodStatus, 'info')
    },

    updateFoodStatus(ord, newStatus) {
      const allowed = { pending: ['cooking', 'cancelled'], cooking: ['sending', 'cancelled'], sending: ['complete', 'cancelled'], complete: [], cancelled: [] }
      if (allowed[ord.foodStatus]?.includes(newStatus)) {
        ord.foodStatus = newStatus
        const labels = { cooking: 'กำลังทำ', sending: 'กำลังส่ง', complete: 'เสร็จสิ้น', cancelled: 'ยกเลิก' }
        this.addToast(ord.roomNo + ' → ' + (labels[newStatus] || newStatus), 'success')
      }
    },

    fsOverdueMinutes(timeStr) {
      if (!this.fsCurrentTime || !timeStr) return 0
      const [h, m] = timeStr.split(':').map(Number)
      const now = new Date()
      const orderTime = new Date()
      orderTime.setHours(h, m, 0, 0)
      return Math.max(0, Math.floor((now - orderTime) / 60000))
    },

    fsCancelConfirm(ord) {
      this.fsCancelTarget = ord
      this.fsCancelReason = ''
      this.fsCancelModal = true
    },
    fsConfirmCancel() {
      if (this.fsCancelTarget) {
        this.fsCancelTarget.cancelReason = this.fsCancelReason
        this.updateFoodStatus(this.fsCancelTarget, 'cancelled')
      }
      this.fsCancelModal = false
      this.fsCancelTarget = null
      this.fsCancelReason = ''
    },
    fdCheckPayment(ord) {
      if (ord.paymentStatus === 'success') {
        this.updateFoodStatus(ord, 'complete')
      } else {
        this.fdPaymentTarget = ord
        this.fdPaymentModal = true
      }
    },
    fdCompleteWithPayment(method) {
      if (!this.fdPaymentTarget) return
      this.fdPaymentTarget.paymentStatus = 'success'
      this.fdPaymentTarget.paymentMethod = method
      this.updateFoodStatus(this.fdPaymentTarget, 'complete')
      this.addToast(`ชำระเงินสำเร็จ · ${this.fdPaymentTarget.roomNo} (${method})`, 'success')
      this.closeFdPaymentModal()
    },
    closeFdPaymentModal() {
      this.fdPaymentModal = false
      this.fdPaymentTarget = null
      this.fdActivePayTab = 'Cash'
      this.fdMemberName = ''
      this.fdCouponCode = ''
      this.fdDiscountAmt = ''
      this.fdPromoCode = ''
      this.fdActiveInput = null
    },

    openItemModal(ord) {
      ord.items.forEach(item => { if (!item.itemStatus) item.itemStatus = 'pending' })
      this.fsSelectedOrder = ord
      this.fsOpenItemIdx = null
      this.fsItemModal = true
    },
    closeItemModal() {
      this.fsItemModal = false
      this.fsOpenItemIdx = null
    },
    updateItemStatus(item, newStatus) {
      const allowed = { pending: ['cooking', 'served', 'cancelled'], cooking: ['served', 'cancelled'], sending: ['served', 'cancelled'], served: ['complete'], complete: [], cancelled: [] }
      if (allowed[item.itemStatus || 'pending']?.includes(newStatus)) {
        item.itemStatus = newStatus
        this.fsOpenItemIdx = null
        const labels = { cooking: 'Cooking', sending: 'Sending', served: 'Served', complete: 'Complete', cancelled: 'Cancelled' }
        this.addToast(item.name + ' → ' + (labels[newStatus] || newStatus), 'success')
      }
    },
    fsItemStatusLabel(status) {
      return { pending: 'Pending', cooking: 'Cooking', sending: 'Sending', served: 'Served', complete: 'Complete', cancelled: 'Cancelled' }[status] || status
    },
    fsAvailableStatuses(currentStatus) {
      const map = {
        pending:   [{ value: 'cooking',   label: 'Cooking',   icon: 'fa fa-fire' },
                    { value: 'served',    label: 'Served',    icon: 'fa fa-concierge-bell' },
                    { value: 'cancelled', label: 'Cancelled', icon: 'fa fa-ban'  }],
        cooking:   [{ value: 'served',    label: 'Served',    icon: 'fa fa-concierge-bell' },
                    { value: 'cancelled', label: 'Cancelled', icon: 'fa fa-ban'  }],
        sending:   [{ value: 'served',    label: 'Served',    icon: 'fa fa-concierge-bell' },
                    { value: 'cancelled', label: 'Cancelled', icon: 'fa fa-ban'  }],
        served:    [{ value: 'complete',  label: 'Complete',  icon: 'fa fa-check-double' }],
        complete:  [],
        cancelled: [],
      }
      return map[currentStatus] || []
    },

    // Employee
    verifyEmployee() {
      const v = this.empCodeInput.trim()
      if (!v) { this.addToast('กรุณากรอกรหัส', 'warning'); return }
      const found = this.employeeDB.find(e => e.code.toLowerCase() === v.toLowerCase() || e.card === v)
      if (found) {
        this.selectedEmployee = found
        this.empIdentModal = false
        this.empCodeInput = ''
        this.empNotFound = false
        this.empNewName = ''
        this.empNewMemberId = ''
        this.empNewCard = ''
        this.addToast('ยืนยันตัวตน: ' + found.name, 'success')
      } else {
        this.empNotFound = true
        this.empNewName = ''
        this.empNewMemberId = ''
      }
    },
    addNewEmployee() {
      const code = this.empIdentStep === 'add'
        ? this.empNewMemberId.trim()
        : this.empCodeInput.trim()
      const name = this.empNewName.trim()
      if (!name) { this.addToast('กรุณากรอกชื่อสมาชิก', 'warning'); return }
      if (!code) { this.addToast('กรุณากรอกรหัสสมาชิก', 'warning'); return }
      const emp = { code, card: this.empNewCard.trim(), memberId: this.empNewMemberId.trim(), name, dept: '', type: 'member' }
      this.employeeDB.push(emp)
      this.selectedEmployee = emp
      this.empIdentModal = false
      this.empCodeInput = ''
      this.empNotFound = false
      this.empNewName = ''
      this.empNewMemberId = ''
      this.empNewCard = ''
      this.empIdentStep = 'choose'
      this.addToast('เพิ่มสมาชิก ' + name + ' สำเร็จ', 'success')
    },
    togglePrivType(id) {
      const idx = this.selectedPrivTypes.indexOf(id)
      if (idx >= 0) this.selectedPrivTypes.splice(idx, 1)
      else this.selectedPrivTypes.push(id)
    },
    applyPrivileges() {
      let remaining = this.totals.subtotal - this.appliedPrivileges.reduce((s, p) => s + p.amount, 0)
      let count = 0
      for (const privId of this.selectedPrivTypes) {
        if (this.appliedPrivileges.find(a => a.id === privId)) continue
        const priv = this.employeePrivileges.find(p => p.id === privId)
        if (!priv || priv.balance <= 0) continue
        const amount = Math.min(priv.balance, remaining)
        if (amount <= 0) continue
        this.appliedPrivileges.push({ id: privId, name: priv.name, amount })
        priv.balance -= amount
        remaining -= amount
        count++
      }
      this.selectedPrivTypes = []
      if (count) this.addToast('ใช้สิทธิ์สำเร็จ ' + count + ' รายการ', 'success')
    },
    openPrivModal() {
      const available = this.privilegeTypes.filter(pt => {
        const priv = this.employeePrivileges.find(p => p.id === pt.id)
        return priv && priv.balance > 0
      })
      if (available.length === 1) {
        this.selectedPrivTypes = [available[0].id]
        this.applyPrivileges()
      } else {
        this.privModalOpen = true
      }
    },
    clearAllPrivileges() {
      this.appliedPrivileges.forEach(ap => {
        const priv = this.employeePrivileges.find(p => p.id === ap.id)
        if (priv) priv.balance += ap.amount
      })
      this.appliedPrivileges = []
      this.addToast('ล้างสิทธิ์ทั้งหมดแล้ว', 'info')
    },

    // Coupon
    applyCoupon() {
      if (!this.couponCode.trim()) { this.addToast('กรุณากรอกรหัสคูปอง', 'warning'); return }
      this.currentBill.customDiscount = { type: 'percent', value: 10, reason: 'คูปอง: ' + this.couponCode }
      this.couponModalOpen = false
      this.couponCode = ''
      this.addToast('ใช้คูปองสำเร็จ ส่วนลด 10%', 'success')
    },

    // Manual discount
    applyManualDiscount() {
      const val = parseFloat(this.discountInput)
      if (!val || val <= 0) return
      if (this.discountType === 'percent' && val > 100) { this.addToast('เปอร์เซ็นต์ไม่เกิน 100%', 'warning'); return }
      this.currentBill.customDiscount = { type: this.discountType, value: val }
      this.addToast(`ใช้ส่วนลด${this.discountType === 'percent' ? ' ' + val + '%' : ' ฿' + val} แล้ว`, 'success')
      this.discountInput = ''
      this.discountModalOpen = false
    },
    removeManualDiscount() {
      this.currentBill.customDiscount = null
      this.discountInput = ''
      this.addToast('ยกเลิกส่วนลดแล้ว', 'info')
    },

    // Payment
    openPayModal() {
      if (!this.totals.count) { this.addToast('ไม่มีรายการ', 'warning'); return }
      this.cashStr = ''
      if (this.activePayTab === 'Cash') { this.cashModalOpen = true }
      else if (this.activePayTab === 'QR') { this.qrSubModal = true }
      else if (this.activePayTab === 'Wallet') { this.walletConfirmModal = true }
      else if (this.activePayTab === 'EDC') { this.completePay('card') }
    },
    cashInputFn(k) {
      if (k === '.' && this.cashStr.includes('.')) return
      this.cashStr += k
    },
    processElectronic(method) {
      this.payProcessing = true
      setTimeout(() => {
        this.payProcessing = false
        this.walletConfirmModal = false
        this.completePay(method)
      }, 1500)
    },
    selectQrProvider(qr) {
      this.qrPayProvider = qr
      this.qrSubModal = false
      this.qrPayModal = true
    },
    confirmQrPay() {
      const name = this.qrPayProvider ? this.qrPayProvider.name : 'QR'
      this.qrPayModal = false
      this.qrPayProvider = null
      this.completePay('qr')
      this.addToast('ชำระด้วย ' + name + ' สำเร็จ', 'success')
    },
    completePay(method) {
      this.orderCounter++
      const t = this.totals
      this.shiftData.totalSales += t.grand
      this.shiftData.billCount++
      if (method === 'cash') this.shiftData.cashSales += t.grand
      if (method === 'card') this.shiftData.cardSales += t.grand
      if (['qr', 'wallet'].includes(method)) this.shiftData.qrSales += t.grand
      this.addToast(`ชำระสำเร็จ! ${this.currentOrderNo}`, 'success')
      this.clearBill()
      this.appliedPrivileges = []
      this.orderNote = ''
    },

    // Cancel PIN
    openCancelPin(action) {
      this.cancelPinValue = ''
      this.cancelPinError = ''
      this.cancelPinAction = action
      this.cancelPinModal = true
    },
    verifyCancelPin() {
      const code = this.cancelPinValue.trim()
      const admin = this.systemUsers.find(u => u.code === code && u.role === 'admin')
      if (!admin) {
        this.cancelPinError = 'รหัสไม่ถูกต้อง หรือไม่มีสิทธิ์ยกเลิกออเดอร์'
        this.cancelPinValue = ''
        return
      }
      this.cancelPinModal = false
      this.cancelPinError = ''
      const action = this.cancelPinAction
      this.cancelPinAction = null
      if (action === 'bill') this.doCancelBill()
      else if (action === 'bill-new') this.cancelThenNew()
      else if (action === 'food') this.fsConfirmCancel()
    },

    // Cancel
    cancelOrderConfirm() {
      if (!this.currentBill.items.length) { this.addToast('ไม่มีรายการ', 'warning'); return }
      this.openCancelPin('bill')
    },
    doCancelBill() {
      this.shiftData.cancelCount++
      this.clearBill()
      this.cancelConfirm = false
      this.addToast('ยกเลิกบิลแล้ว', 'info')
    },

    // ─── MONEY MANAGEMENT ────────────────────────────────────────────────
    lookupMoneyEmployee() {
      const id = this.moneyUserId.trim()
      if (!id) return
      const emp = this.employeeDB.find(e => e.code === id || e.card === id)
      if (emp) {
        this.moneyEmployee = { name: emp.name, code: emp.code }
        this.moneyBalance = 10015.00  // mock — จะมาจาก API จริง
        this.moneyEmployeeFound = true
      } else {
        this.moneyEmployee = { name: '', code: '' }
        this.moneyBalance = null
        this.moneyEmployeeFound = false
        this.addToast('ไม่พบรหัสพนักงาน / รหัสบัตรในระบบ', 'error')
      }
    },
    doMoneyAction() {
      if (!this.moneyEmployeeFound) { this.addToast('กรุณากรอกรหัสพนักงาน / รหัสบัตรก่อน', 'error'); return }
      const amount = parseFloat(this.moneyAmount) || 0
      if (this.moneyMode === 'topup') {
        if (!amount) { this.addToast('กรุณากรอกจำนวนเงิน', 'error'); return }
        if (!this.moneyPayChannel) { this.addToast('กรุณาเลือกช่องทางชำระเงิน', 'error'); return }
        this.moneyBalance += amount
        this.moneyConfirmData = { type: 'topup', amount, employeeName: this.moneyEmployee.name, newBalance: this.moneyBalance }
        this.moneyConfirmModal = true
      } else {
        if (!amount) { this.addToast('กรุณากรอกจำนวนเงินที่ต้องการคืน', 'error'); return }
        if (amount > this.moneyBalance) { this.moneyErrorModal = true; return }
        this.moneyBalance -= amount
        this.moneyConfirmData = { type: 'refund', amount, employeeName: this.moneyEmployee.name, newBalance: this.moneyBalance }
        this.moneyConfirmModal = true
      }
    },
    clearMoneyForm() {
      this.moneyUserId = ''
      this.moneyAmount = ''
      this.moneyPayChannel = ''
      this.moneyEmployee = { name: '', code: '' }
      this.moneyBalance = null
      this.moneyEmployeeFound = false
    },
    checkMoneyDaily() {
      if (!this.moneyDailyUserId.trim()) { this.addToast('กรุณากรอกรหัสบัตร', 'error'); return }
      this.moneyDailyData = { cardType: 'A', name: 'เจิมจันทร์ จิรวาณิชย์', balance: 591.00 }
    },

    // ─── TAX INVOICE ─────────────────────────────────────────────────────
    openTaxInvoiceForm(tx) {
      this.selectedTaxTransaction = tx
      this.taxInvoiceForm = {
        invoiceNo: `INV-${tx.receiptNo}`,
        invoiceDate: tx.date,
        buyerName: '', buyerAddress: '', buyerTaxId: '',
        buyerBranch: 'สำนักงานใหญ่', buyerEmail: '',
        paymentMethod: tx.paymentMethod, notes: ''
      }
      this.appScreen = 'tax-invoice-form'
    },
    clearTaxInvoiceForm() {
      const tx = this.selectedTaxTransaction
      this.taxInvoiceForm = {
        invoiceNo: tx ? `INV-${tx.receiptNo}` : '',
        invoiceDate: tx ? tx.date : '',
        buyerName: '', buyerAddress: '', buyerTaxId: '',
        buyerBranch: 'สำนักงานใหญ่', buyerEmail: '',
        paymentMethod: tx ? tx.paymentMethod : '', notes: ''
      }
      this.addToast('ล้างข้อมูลแล้ว', 'info')
    },
    saveTaxInvoice() { this.addToast('บันทึกและพิมพ์ใบกำกับภาษีสำเร็จ', 'success') },
    printCopyTaxInvoice() { this.addToast('พิมพ์สำเนาใบกำกับภาษีสำเร็จ', 'info') },
    resetTaxFilter() {
      this.taxFilter = { date: '', paymentMethod: '', search: '' }
      this.taxPage = 1
      this.addToast('รีเฟรชรายการแล้ว', 'info')
    },
    numberToThaiWords(amount) {
      if (!amount || amount === 0) return 'ศูนย์บาทถ้วน'
      const ones = ['', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า']
      const pos = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน', 'ล้าน']
      function cvt(n) {
        if (n === 0) return ''
        let t = '', s = n.toString(), l = s.length
        for (let i = 0; i < l; i++) {
          const d = parseInt(s[i]), p = l - 1 - i
          if (d === 0) continue
          if (p === 1 && d === 1) t += 'สิบ'
          else if (p === 1 && d === 2) t += 'ยี่สิบ'
          else if (p === 0 && d === 1 && l > 1) t += 'เอ็ด'
          else t += ones[d] + pos[p]
        }
        return t
      }
      const ip = Math.floor(amount), dp = Math.round((amount - ip) * 100)
      let r = ip >= 1000000 ? cvt(Math.floor(ip / 1000000)) + 'ล้าน' + cvt(ip % 1000000) : cvt(ip)
      r += 'บาท'
      r += dp > 0 ? cvt(dp) + 'สตางค์' : 'ถ้วน'
      return r
    },

    // Bill-level promos
    handleBillPromo(promo) {
      if (promo.type === 'DISCOUNT') {
        this.applyDiscountPromo(promo)
      } else if (promo.type === 'REDEEM') {
        this.pendingBillPromo = promo
        this.promoRedeemModal = true
      } else if (promo.type === 'FREE_GIFT') {
        this.pendingBillPromo = promo
        this.promoGiftModal = true
      }
    },
    applyDiscountPromo(promo) {
      const rawSubtotal = this.currentBill.items.reduce((s, i) => s + (i.originalPrice || i.price) * (i.qty || 1), 0)
      let discountAmount = promo.discountType === 'PERCENT'
        ? rawSubtotal * promo.discountValue / 100
        : promo.discountValue
      if (promo.discountMax > 0) discountAmount = Math.min(discountAmount, promo.discountMax)
      discountAmount = Math.round(discountAmount * 100) / 100
      this.appliedBillPromos.push({ id: promo.id, name: promo.name, discountAmount })
      this.addToast(`ใช้โปร ${promo.name} ส่วนลด ฿${discountAmount.toFixed(2)}`, 'success')
    },
    selectRedeemItem(item) {
      const product = products.find(p => p.id === item.productId)
      if (!product) return
      this.currentBill.items.push({
        ...product,
        name: `${product.name} (แลกซื้อ ฿${item.specialPrice})`,
        cartId: Date.now(),
        isFree: true,
        price: item.specialPrice,
        originalPrice: product.price,
        qty: item.qty,
        type: 'PRO',
        promoId: this.pendingBillPromo.id,
        note: 'แลกซื้อราคาพิเศษ',
      })
      this.promoRedeemModal = false
      this.addToast(`แลกซื้อ ${product.name} ฿${item.specialPrice} สำเร็จ`, 'success')
    },
    selectGiftItem(item) {
      const product = products.find(p => p.id === item.productId)
      if (!product) return
      this.currentBill.items.push({
        ...product,
        name: product.name + ' (ฟรี)',
        cartId: Date.now(),
        isFree: true,
        price: 0,
        originalPrice: product.price,
        qty: item.qty,
        type: 'PRO',
        promoId: this.pendingBillPromo.id,
        note: 'ของแถมฟรี',
      })
      this.promoGiftModal = false
      this.addToast(`รับ ${product.name} ฟรี!`, 'success')
    },
    removeAppliedPromo(promoId) {
      this.appliedBillPromos = this.appliedBillPromos.filter(p => p.id !== promoId)
      this.currentBill.items = this.currentBill.items.filter(i => i.promoId !== promoId)
      this.addToast('ยกเลิกโปรโมชันแล้ว', 'info')
    },

    // Item note inline edit
    startEditNote(item) {
      if (item.isFree) return
      this.editingNoteId = item.cartId
      this.$nextTick(() => {
        const el = this.$refs['noteInput_' + item.cartId]
        if (el) el.focus()
      })
    },

    // Toast
    addToast(msg, type = 'info') {
      const icons = { success: 'fa-check-circle', error: 'fa-times-circle', warning: 'fa-exclamation-triangle', info: 'fa-info-circle' }
      const id = Date.now()
      this.toasts.push({ id, msg, type, icon: icons[type] || icons.info })
      setTimeout(() => { this.toasts = this.toasts.filter(t => t.id !== id) }, 3000)
    },

    // Kitchen Display
    selectKitchen(id) {
      this.selectedKitchenId = id
      this.appScreen = 'kitchen-display'
    },
    isKitchenPrinted(ord) {
      return !!this.kitchenPrintStatus[`${ord.id}_${this.selectedKitchenId}`]
    },
    kitchenPrint(ord) {
      const key = `${ord.id}_${this.selectedKitchenId}`
      this.kitchenPrintStatus = { ...this.kitchenPrintStatus, [key]: true }
      this.addToast(`ปริ้น Order ${ord.receiptNo} เรียบร้อย`, 'success')
    },
    kitchenItemsPreview(ord) {
      const kitchen = this.kitchensData.find(k => k.id === this.selectedKitchenId)
      if (!kitchen) return ''
      const items = ord.items.filter(item => kitchen.menus.includes(item.name))
      const preview = items.map(i => `${i.name} x${i.qty}`).join(', ')
      return preview.length > 65 ? preview.slice(0, 62) + '...' : preview
    },
    kitchenUnprintedCount(kitchenId) {
      const kitchen = this.kitchensData.find(k => k.id === kitchenId)
      if (!kitchen) return 0
      return this.ordersData.filter(ord =>
        ord.items.some(item => kitchen.menus.includes(item.name)) &&
        !this.kitchenPrintStatus[`${ord.id}_${kitchenId}`]
      ).length
    },
    refreshKitchen() {
      this.addToast('รีเฟรชข้อมูลแล้ว', 'info')
    },

    // ═══════════════════════════════════════════════════════════════════
    // PRE-ORDER TAP-TO-COLLECT
    // ═══════════════════════════════════════════════════════════════════
    openPreOrderIdle() {
      this.appScreen = 'preorder-idle'
      this.poResult = null
      this.poCardInput = ''
      this.poShowTestTools = false
      this.poOfflineSim = false
      this.poInitBroadcast()
    },
    poMinutesOf(hhmm) {
      const [h, m] = hhmm.split(':').map(Number)
      return h * 60 + m
    },
    poNowMinutes(mockNow) {
      if (mockNow) return this.poMinutesOf(mockNow)
      const d = new Date()
      return d.getHours() * 60 + d.getMinutes()
    },
    poFindActivePeriod(nowMin) {
      return this.preOrderMealPeriods.find(p => nowMin >= this.poMinutesOf(p.start) && nowMin <= this.poMinutesOf(p.end)) || null
    },
    poCardInfo(cardId) {
      return this.preOrderCards[cardId] || null
    },
    // ผูกออเดอร์เมนูการขายเข้ากับบัตรนักเรียน — รวมชื่อ/ชั้นจาก preOrderCards + ยอดเครดิตจาก buffetCards (คนละก้อนแต่ cardId ตรงกัน)
    orderCardInfo(cardId) {
      const card = this.preOrderCards[cardId]
      if (!card) return null
      const credit = this.buffetCards[cardId]
      return { name: card.name, cls: card.cls, balance: credit ? credit.balance : 0 }
    },
    poPeriodOf(mealKey) {
      return this.preOrderMealPeriods.find(p => p.key === mealKey) || null
    },
    poFormatWindow(period) {
      return period ? `${period.start}-${period.end} น.` : ''
    },
    poFormatDate(dateStr) {
      if (!dateStr) return ''
      const d = new Date(dateStr + 'T00:00:00')
      return d.toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: 'numeric' })
    },
    // สถานะที่แสดงจริง — confirmed/ready/missed คำนวณจากเวลาปัจจุบันเทียบวันที่+ช่วงเวลาของรอบที่จอง (ดู assumption ในแผน)
    // mockNow: ใช้เฉพาะตอนแสดงผล poResult ที่มาจากปุ่ม quick-pick (ดู poHandleTap) เพื่อให้ badge
    // สอดคล้องกับเคสที่ demo อยู่จริง — หน้าประวัติ/ภาพรวม staff ไม่ส่ง mockNow จึงคำนวณจากเวลาจริงเสมอ
    poEffectiveStatus(res, mockNow = null) {
      if (res.status === 'collected') return 'collected'
      if (res.status === 'cancelled') return 'cancelled'
      if (res.date > PO_TODAY) return 'confirmed'
      if (res.date < PO_TODAY) return 'missed'
      const period = this.poPeriodOf(res.mealKey)
      if (!period) return 'confirmed'
      const nowMin = this.poNowMinutes(mockNow)
      if (nowMin > this.poMinutesOf(period.end)) return 'missed'
      if (nowMin >= this.poMinutesOf(period.start)) return 'ready'
      return 'confirmed'
    },
    poStatusMeta(effStatus) {
      const map = {
        confirmed: { label: 'จองแล้ว',   badge: 'po-badge-confirmed' },
        ready:     { label: 'รอวันรับ',   badge: 'po-badge-ready' },
        collected: { label: 'รับแล้ว',    badge: 'po-badge-collected' },
        missed:    { label: 'ไม่มารับ',   badge: 'po-badge-missed' },
        cancelled: { label: 'ยกเลิกแล้ว', badge: 'po-badge-cancelled' },
      }
      return map[effStatus] || map.confirmed
    },
    poSubmitCardInput() {
      const code = this.poCardInput.trim()
      if (!code) return
      this.poHandleTap(code)
      this.poCardInput = ''
    },
    poQuickPickTap(qp) {
      this.poHandleTap(qp.cardId, { mockNow: qp.mockNow })
    },
    poToggleOfflineSim() {
      this.poOfflineSim = !this.poOfflineSim
      if (!this.poOfflineSim && this.poResult && (this.poResult.case === 'case9-loading' || this.poResult.case === 'case9-timeout')) {
        this.poBackToIdle()
      }
    },
    // ลำดับการตรวจตามสเปก §4 — mockNow ใช้เฉพาะปุ่ม quick-pick เพื่อ demo เคสที่ขึ้นกับเวลาให้ตรงเสมอ
    // การพิมพ์เลขบัตรจริงในช่อง input (ไม่ส่ง mockNow) จะใช้เวลาปัจจุบันจริงเสมอ
    poHandleTap(cardId, opts = {}) {
      // §4.5 เคส D — แตะซ้ำระหว่างเครื่องกำลังประมวลผลรายการก่อนหน้า กันไม่ให้ยิง request ซ้ำ (UI-level เท่านั้น)
      if (this.poProcessing) { this.poShowResult({ case: 'hwD' }); return }
      this.poProcessing = true
      clearTimeout(this.poResultTimer)
      const mockNow = opts.mockNow || null

      if (this.poOfflineSim) {
        this.poResult = { case: 'case9-loading', cardId }
        this.poBroadcastResult()
        this.poResultTimer = setTimeout(() => {
          this.poResult = { case: 'case9-timeout', cardId }
          this.poBroadcastResult()
          this.poProcessing = false
        }, 1500)
        return
      }

      const card = this.poCardInfo(cardId)
      if (!card) { this.poShowResult({ case: 'case5', cardId }); return }
      if (this.preOrderSuspendedCards.includes(cardId)) { this.poShowResult({ case: 'case6', cardId, card }); return }

      const todays = this.preOrderReservations.filter(r => r.cardId === cardId && r.date === PO_TODAY)
      if (todays.length === 0) { this.poShowResult({ case: 'case1', cardId, card }); return }

      const res = todays[0]
      if (res.status === 'cancelled') { this.poShowResult({ case: 'case7', cardId, card, reservation: res }); return }
      if (res.paid === false) { this.poShowResult({ case: 'case8', cardId, card, reservation: res }); return }
      if (res.status === 'collected') { this.poShowResult({ case: 'duplicate', cardId, card, reservation: res }); return }

      const period = this.poPeriodOf(res.mealKey)
      const nowMin = this.poNowMinutes(mockNow)
      const active = this.poFindActivePeriod(nowMin)
      if (active && active.key !== res.mealKey) { this.poShowResult({ case: 'case2', cardId, card, reservation: res, period }); return }
      if (nowMin < this.poMinutesOf(period.start)) { this.poShowResult({ case: 'case3', cardId, card, reservation: res, period }); return }
      if (nowMin > this.poMinutesOf(period.end)) { this.poShowResult({ case: 'case4', cardId, card, reservation: res, period }); return }
      this.poShowResult({ case: 'detail', cardId, card, reservation: res, period, mockNow })
    },
    // §4.5 เคส A/B — อ่านบัตรไม่สำเร็จระดับฮาร์ดแวร์ (คนละกลุ่มกับ business case §4 ที่อ่านผ่านแต่ข้อมูลมีปัญหา)
    // นับ retry ใน session นี้ ถ้าเกิน limit สลับไปเคส B อัตโนมัติ ไม่ให้แตะไม่รู้จบ
    poSimulateMisread() {
      if (this.poProcessing) { this.poShowResult({ case: 'hwD' }); return }
      const RETRY_LIMIT = 3
      this.poMisreadCount++
      if (this.poMisreadCount >= RETRY_LIMIT) {
        this.poShowResult({ case: 'hwB', errorCode: 'CARD_MISREAD_LIMIT' })
      } else {
        this.poShowResult({ case: 'hwA', errorCode: 'CARD_MISREAD_RETRY', attempt: this.poMisreadCount })
      }
    },
    // §4.5 เคส C — ตัวอ่านบัตรขัดข้องทั้งเครื่อง แยก errorCode จากเคส B ชัดเจนระดับโค้ด ไม่ปนกับบัตรชำรุด
    poSimulateReaderFailure() {
      if (this.poProcessing) { this.poShowResult({ case: 'hwD' }); return }
      this.addToast('แจ้งพนักงาน/แอดมิน: เครื่องอ่านบัตรขัดข้อง (errorCode: READER_HW_FAULT)', 'error')
      this.poShowResult({ case: 'hwC', errorCode: 'READER_HW_FAULT' })
    },
    // ปุ่ม demo เดียว จำลอง §4.5 เคส D จริง — ยิง tap ซ้ำระหว่างที่ tap แรกกำลังประมวลผล (offline-sim) อยู่
    poDemoDebounce() {
      this.poOfflineSim = true
      this.poHandleTap('demo-debounce')
      this.poHandleTap('demo-debounce')
    },
    poShowResult(payload) {
      this.poProcessing = false
      if (payload.case !== 'hwA') this.poMisreadCount = 0
      this.poResult = payload
      this.poBroadcastResult()
      // case4/case8/hwB/hwC รอ action พนักงาน ไม่ auto กลับ — ตาม spec §4/§4.5
      const delayMap = {
        success: 3000, duplicate: 3000,
        case1: 4000, case2: 4000, case3: 4000, case5: 4000, case6: 4000, case7: 4000,
        hwA: 2500, hwD: 2000,
      }
      if (delayMap[payload.case]) {
        this.poResultTimer = setTimeout(() => this.poBackToIdle(), delayMap[payload.case])
      }
    },
    poBackToIdle() {
      // หมายเหตุ: ไม่ reset poMisreadCount ตรงนี้ — เคส A auto-dismiss กลับ idle ทุกครั้งด้วยตัวมันเอง
      // ถ้า reset ที่นี่ นับ retry ข้าม session (A→idle→A→idle→A) ไม่ได้เลย ต้องปล่อยให้ poShowResult
      // เป็นคนคุม (reset เฉพาะตอนเจอเคสอื่นที่ไม่ใช่ hwA เท่านั้น)
      clearTimeout(this.poResultTimer)
      this.poProcessing = false
      this.poResult = null
      this.poBroadcastResult()
    },
    poConfirmCollect() {
      if (!this.poResult || !this.poResult.reservation) return
      const res = this.poResult.reservation
      res.status = 'collected'
      res.collectedAt = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
      this.poShowResult({ case: 'success', cardId: this.poResult.cardId, card: this.poResult.card, reservation: res })
    },
    // เคส 4 override — ยืนยันกับทีมแล้วว่าไม่ต้องขอรหัส supervisor เหมือนยกเลิก กดแล้วเปลี่ยนสถานะทันที (spec §8)
    poRequestOverride(reservation) {
      reservation.status = 'collected'
      reservation.overridden = true
      reservation.collectedAt = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
      this.addToast('Override รับอาหารสำเร็จ', 'success')
      this.poShowResult({ case: 'success', cardId: reservation.cardId, card: this.poCardInfo(reservation.cardId), reservation })
    },
    // modal รายละเอียดร่วม (§5) — ใช้ร่วมกับหน้าภาพรวม staff
    // PIN ยืนยันยกเลิกอยู่ในโมดัลเดียวกันนี้เลย ไม่แยกไปเปิด modal PIN กลางอีกต่อไป (ตาม UI ที่ยืนยันไว้)
    poOpenDetail(reservation) {
      this.poDetailReservation = reservation
      this.poCancelReasonSel = ''
      this.poCancelReasonOther = ''
      this.poCancelPinValue = ''
      this.poCancelPinError = ''
      this.poDetailModal = true
    },
    poCloseDetail() {
      this.poDetailModal = false
      this.poDetailReservation = null
      this.poCancelReasonSel = ''
      this.poCancelReasonOther = ''
      this.poCancelPinValue = ''
      this.poCancelPinError = ''
    },
    poConfirmCancelReservation() {
      if (!this.poDetailReservation) return
      const note = this.poCancelReasonOther.trim()
      const reason = this.poCancelReasonSel === 'อื่นๆ' ? note : (note ? `${this.poCancelReasonSel} — ${note}` : this.poCancelReasonSel)
      if (!reason) return
      const code = this.poCancelPinValue.trim()
      const admin = this.systemUsers.find(u => u.code === code && u.role === 'admin')
      if (!admin) {
        this.poCancelPinError = 'รหัสไม่ถูกต้อง หรือไม่มีสิทธิ์ยกเลิกการจอง'
        this.poCancelPinValue = ''
        return
      }
      const res = this.poDetailReservation
      res.status = 'cancelled'
      res.cancelReason = reason
      res.cancelledBy = `${admin.name} (${admin.code})`
      res.cancelledAt = new Date().toLocaleString('th-TH')
      this.poCloseDetail()
      this.addToast('ยกเลิกการจองแล้ว', 'info')
    },
    // จอ 2 — customer display (หน้าต่างที่ 2 + BroadcastChannel, ดูรายละเอียดใน plan)
    poInitBroadcast() {
      if (this.poBroadcastChannel || typeof BroadcastChannel === 'undefined') return
      this.poBroadcastChannel = new BroadcastChannel('preorder-sync')
      if (this.poIsCustomerDisplay) {
        this.poBroadcastChannel.onmessage = (ev) => {
          this.poResult = (ev.data && ev.data.type === 'result') ? ev.data.payload : null
        }
      }
    },
    poBroadcastResult() {
      if (!this.poBroadcastChannel || this.poIsCustomerDisplay) return
      const r = this.poResult
      // §4.5 เคส A/D — จอ 2 "คงหน้าเดิมไว้เฉยๆ" ตามสเปก ไม่ส่งอะไรไปเลย (ต่างจาก null ที่แปลว่ากลับ idle)
      if (r && (r.case === 'hwA' || r.case === 'hwD')) return
      // JSON round-trip: poResult/reservation are Vue reactive proxies, which BroadcastChannel's
      // structured-clone algorithm can fail to clone — plain data only.
      const payload = r ? JSON.parse(JSON.stringify(this.poCustomerSafePayload(r))) : null
      this.poBroadcastChannel.postMessage({ type: 'result', payload })
    },
    // ตัดฟิลด์อ่อนไหวก่อนส่งไปจอ 2 (ไม่ส่งเหตุผลยกเลิก/PIN/ฯลฯ — ตาม spec §7)
    poCustomerSafePayload(r) {
      // §4.5 เคส B/C — จอ 2 โชว์ fallback กลาง "กรุณาติดต่อพนักงาน" เดียวกัน ไม่แยก error code ให้ลูกค้าเห็น
      if (r.case === 'hwB' || r.case === 'hwC') return { case: 'hw-contact-staff' }
      const safe = { case: r.case, cardId: r.cardId }
      if (r.card) safe.card = { name: r.card.name, cls: r.card.cls }
      if (r.reservation) {
        safe.reservation = { items: r.reservation.items, collectedAt: r.reservation.collectedAt, mealKey: r.reservation.mealKey }
      }
      if (r.period) safe.period = { mealName: r.period.mealName, start: r.period.start, end: r.period.end }
      return safe
    },
    poOpenCustomerDisplay() {
      this.poInitBroadcast()
      const url = window.location.origin + window.location.pathname + '?display=preorder-customer'
      this.poCustomerWindow = window.open(url, 'preorderCustomerDisplay', 'width=480,height=854')
      if (!this.poCustomerWindow) this.addToast('เบราว์เซอร์บล็อกป๊อปอัป กรุณาอนุญาตแล้วลองใหม่', 'error')
    },

    // ═══════════════════════════════════════════════════════════════════
    // BUFFET (WALK-IN) — table/state/method ทั้งหมดแยกจาก Pre-Order (po*) 100%
    // ═══════════════════════════════════════════════════════════════════
    // §2/§3.3 — จุดเข้าทางเดียวของบุฟเฟต์ตอนนี้ คือเลือกประเภท+ราคาก่อนเสมอ (ยืนยันแล้ว) แล้วค่อยเลือกวิธีชำระ
    openBuffetTypeSelect() {
      this.appScreen = 'buffet-type-select'
      this.bufSelectedTier = null
      this.bufTypeSearch = ''
    },
    // เลือกประเภท+ราคา (จุดเข้าทางเดียวของทั้ง 2 สายแล้ว — ยืนยันแล้ว) แล้วไปเลือกวิธีชำระเงินต่อ
    bufSelectTier(tierKey) {
      this.bufSelectedTier = tierKey
      this.appScreen = 'buffet-pay-method'
    },
    // สายแตะบัตร: ราคาผูกกับ tier ที่เลือกไว้ล่วงหน้าแล้ว (ไม่ auto-detect จากบัตรอีกต่อไป — ยืนยันแล้ว)
    //   เกรดบัตรไม่ตรง tier ที่เลือกไว้ → warn ใน bufHandleTap แต่ยอมให้ staff กดดำเนินต่อได้ (ยืนยันแล้ว)
    // สาย QR: ยังไม่รู้ตัวตนผู้จ่าย ใช้ tier ที่เลือกไว้เหมือนกัน
    bufChoosePayMethod(method) {
      if (method === 'card') {
        this.openBuffetIdle()
        return
      }
      this.bufQrChannel = null
      this.appScreen = 'buffet-qr-channel'
      this.bufInitBroadcast()
      this.bufBroadcastQrState('channel')
    },
    // §2.1 ขั้น 1-2 — เลือกช่องทาง แล้วแสดง QR + นับถอยหลัง 180 วิ (ยืนยันแล้ว)
    bufSelectQrChannel(channelKey) {
      this.bufQrChannel = channelKey
      this.appScreen = 'buffet-qr-code'
      this.bufQrTimeoutModal = false
      clearTimeout(this.bufQrTimeoutAutoTimer)
      this.bufQrCountdown = 180
      clearInterval(this.bufQrTimer)
      this.bufBroadcastQrState('countdown') // จอ 2 รับค่าเริ่ม 180 แล้วนับถอยหลังเองฝั่งตัวเอง
      this.bufQrTimer = setInterval(() => {
        this.bufQrCountdown--
        if (this.bufQrCountdown <= 0) {
          clearInterval(this.bufQrTimer)
          this.bufQrTimeoutModal = true
          this.bufBroadcastQrState('cancelled')
          // ไม่กดเลือกใน 5 วิ → auto กลับหน้าแตะบัตร (ยืนยันแล้ว)
          this.bufQrTimeoutAutoTimer = setTimeout(() => {
            this.bufQrTimeoutModal = false
            this.openBuffetIdle()
          }, 5000)
        }
      }, 1000)
    },
    // ปุ่ม "ทำรายการต่อ" ใน modal หมดเวลา — ขอ QR ใหม่ด้วยช่องทางเดิม (รีเซ็ต countdown)
    bufQrTimeoutContinue() {
      clearTimeout(this.bufQrTimeoutAutoTimer)
      this.bufQrTimeoutModal = false
      this.bufSelectQrChannel(this.bufQrChannel)
    },
    // ปุ่ม "ยกเลิก" ใน modal หมดเวลา — เลิกทำรายการ กลับไปเลือกประเภทบุฟเฟต์
    bufQrTimeoutCancel() {
      clearTimeout(this.bufQrTimeoutAutoTimer)
      this.bufQrTimeoutModal = false
      this.bufQrBackToTypeSelect()
    },
    // ปุ่มทดสอบเท่านั้น (ไม่มี payment gateway จริงผูกอยู่) — จำลองว่าลูกค้าสแกนจ่ายสำเร็จแล้ว
    // §2.1 — QR ไม่รู้ตัวตนผู้จ่าย (ยืนยันแล้ว) บันทึกเป็น guestName generic แทนชื่อจริง ไม่มี cardId/balance ผูกอยู่
    bufQrSimulateSuccess() {
      clearInterval(this.bufQrTimer)
      const tier = this.bufSelectedTierInfo
      const amount = tier ? tier.price : 0
      const nowMin = this.bufNowMinutes(null)
      const active = this.bufFindActiveRound(nowMin)
      const newTx = bufTx({
        cardId: null, guestName: 'ลูกค้า (สแกน QR)', date: BUF_TODAY, round: active ? active.key : null,
        time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
        gradeTier: tier ? tier.key : this.bufSelectedTier, amount,
        paymentMethod: 'qr', qrChannel: this.bufQrChannel,
      })
      this.buffetTransactions.push(newTx)
      this.openBuffetIdle()
      this.bufShowResult({ case: 'success', card: null, guestName: 'ลูกค้า (สแกน QR)', tier, amount, tx: newTx })
      // §2.1(7) — QR สำเร็จ ถามเตรียมหน้าจอถัดไป แทน auto-กลับหน้าแตะบัตรใน 3 วิ ปกติ (ยืนยันแล้ว)
      this.bufNextScreenPrompt = true
      this.bufNextScreenAutoTimer = setTimeout(() => this.bufNextScreenGoIdle(), 5000)
    },
    // ปุ่ม "ไปหน้าแตะบัตร" (primary/default) — dismiss ผลลัพธ์ กลับหน้าแตะบัตรรอลูกค้าถัดไป
    bufNextScreenGoIdle() {
      this.bufBackToIdle()
    },
    // ปุ่ม "สแกน QR ต่อ" — dismiss ผลลัพธ์ แล้วให้เลือกประเภทบุฟเฟต์ใหม่สำหรับลูกค้าถัดไป
    bufNextScreenScanAgain() {
      this.bufBackToIdle()
      this.openBuffetTypeSelect()
    },
    bufQrBackToTypeSelect() {
      clearInterval(this.bufQrTimer)
      clearTimeout(this.bufQrTimeoutAutoTimer)
      this.bufQrChannel = null
      this.bufQrTimeoutModal = false
      this.openBuffetTypeSelect()
    },
    openBuffetIdle() {
      this.appScreen = 'buffet-idle'
      // bufSelectedTier ไม่ reset แล้ว — หน้านี้ผูกราคากับ tier ที่เลือกไว้ล่วงหน้า (ยืนยันแล้ว)
      this.bufResult = null
      this.bufCardInput = ''
      this.bufShowTestTools = false
      this.bufOfflineSim = false
      this.bufTapMismatchModal = false
      this.bufTapMismatchPending = null
      this.bufInitBroadcast()
      this.bufBroadcastResult() // sync ยอดที่ผูกไว้ไปจอ 2 ทันทีที่เข้าหน้าแตะบัตร ก่อนแตะจริงด้วยซ้ำ
    },
    bufMinutesOf(hhmm) {
      const [h, m] = hhmm.split(':').map(Number)
      return h * 60 + m
    },
    bufNowMinutes(mockNow) {
      if (mockNow) return this.bufMinutesOf(mockNow)
      const d = new Date()
      return d.getHours() * 60 + d.getMinutes()
    },
    bufFindActiveRound(nowMin) {
      return this.buffetRounds.find(r => nowMin >= this.bufMinutesOf(r.start) && nowMin <= this.bufMinutesOf(r.end)) || null
    },
    bufCardInfo(cardId) {
      return this.buffetCards[cardId] || null
    },
    bufGradeTierOf(key) {
      return this.buffetGradeTiers.find(t => t.key === key) || null
    },
    bufFormatDate(dateStr) {
      if (!dateStr) return ''
      const d = new Date(dateStr + 'T00:00:00')
      return d.toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: 'numeric' })
    },
    bufSubmitCardInput() {
      const code = this.bufCardInput.trim()
      if (!code) return
      this.bufHandleTap(code)
      this.bufCardInput = ''
    },
    bufQuickPickTap(qp) {
      this.bufHandleTap(qp.cardId, { mockNow: qp.mockNow })
    },
    bufToggleOfflineSim() {
      this.bufOfflineSim = !this.bufOfflineSim
      if (!this.bufOfflineSim && this.bufResult && (this.bufResult.case === 'case9-loading' || this.bufResult.case === 'case9-timeout')) {
        this.bufBackToIdle()
      }
    },
    // §3.3 — เคสฮาร์ดแวร์ใช้ข้อความ/สีเดียวกับ Pre-Order ตรงๆ ตามสเปก (ไม่ออกแบบใหม่) แต่ state แยกกันคนละตัว
    bufSimulateMisread() {
      if (this.bufProcessing) { this.bufShowResult({ case: 'hwD' }); return }
      const RETRY_LIMIT = 3
      this.bufMisreadCount++
      if (this.bufMisreadCount >= RETRY_LIMIT) {
        this.bufShowResult({ case: 'hwB', errorCode: 'CARD_MISREAD_LIMIT' })
      } else {
        this.bufShowResult({ case: 'hwA', errorCode: 'CARD_MISREAD_RETRY' })
      }
    },
    bufSimulateReaderFailure() {
      if (this.bufProcessing) { this.bufShowResult({ case: 'hwD' }); return }
      this.addToast('แจ้งพนักงาน/แอดมิน: เครื่องอ่านบัตรขัดข้อง (errorCode: READER_HW_FAULT)', 'error')
      this.bufShowResult({ case: 'hwC', errorCode: 'READER_HW_FAULT' })
    },
    bufDemoDebounce() {
      this.bufOfflineSim = true
      this.bufHandleTap('demo-debounce')
      this.bufHandleTap('demo-debounce')
    },
    // ลำดับตรวจ: ฮาร์ดแวร์/ออฟไลน์ → บัตร → แตะซ้ำในมื้อเดียวกัน (§3.4) → ยอดเงิน (ปล่อยผ่านได้ถึงเพดานติดลบ) → จ่ายสำเร็จ
    // §2 — ราคาผูกกับ tier ที่เลือกไว้ล่วงหน้าแล้ว (ยืนยันแล้ว) ไม่ auto-detect จากเกรดบัตรอีกต่อไป
    // เกรดบัตรไม่ตรงกับ tier ที่เลือกไว้ → warn ผ่าน bufTapMismatchModal แต่ยอมให้ staff กดดำเนินต่อได้ (ยืนยันแล้ว)
    bufHandleTap(cardId, opts = {}) {
      if (this.bufProcessing) { this.bufShowResult({ case: 'hwD' }); return }
      this.bufProcessing = true
      clearTimeout(this.bufResultTimer)
      const mockNow = opts.mockNow || null

      if (this.bufOfflineSim) {
        this.bufResult = { case: 'case9-loading', cardId }
        this.bufBroadcastResult()
        this.bufResultTimer = setTimeout(() => {
          this.bufResult = { case: 'case9-timeout', cardId }
          this.bufBroadcastResult()
          this.bufProcessing = false
        }, 1500)
        return
      }

      const card = this.bufCardInfo(cardId)
      if (!card) { this.bufShowResult({ case: 'case5', cardId }); return }
      if (this.buffetSuspendedCards.includes(cardId)) { this.bufShowResult({ case: 'case6', cardId, card }); return }

      const nowMin = this.bufNowMinutes(mockNow)
      const active = this.bufFindActiveRound(nowMin)

      if (active) {
        const already = this.buffetTransactions.find(t => !t.voided && t.cardId === cardId && t.date === BUF_TODAY && t.round === active.key)
        if (already) { this.bufShowResult({ case: 'buf-duplicate', cardId, card, time: already.time }); return }
      }

      const selectedTier = this.bufSelectedTierInfo
      const actualTier = this.bufGradeTierOf(card.gradeTier)
      if (selectedTier && actualTier && actualTier.key !== selectedTier.key) {
        this.bufProcessing = false
        this.bufTapMismatchPending = { cardId, card, active, actualTier }
        this.bufTapMismatchModal = true
        return
      }

      this._bufFinalizeTap(cardId, card, selectedTier, active)
    },
    // ปุ่ม "ดำเนินการต่อ" ใน modal เกรดไม่ตรง — เก็บเงินตามราคา tier ที่เลือกไว้ล่วงหน้า (ไม่ใช่ราคาตามเกรดบัตรจริง)
    bufConfirmTapMismatch() {
      const p = this.bufTapMismatchPending
      this.bufTapMismatchModal = false
      this.bufTapMismatchPending = null
      if (!p) return
      this.bufProcessing = true
      this._bufFinalizeTap(p.cardId, p.card, this.bufSelectedTierInfo, p.active)
    },
    // ปุ่ม "ยกเลิก" ใน modal เกรดไม่ตรง — ไม่เก็บเงิน กลับหน้าแตะบัตรเดิม (tier ที่เลือกไว้ยังคงอยู่)
    bufCancelTapMismatch() {
      this.bufTapMismatchModal = false
      this.bufTapMismatchPending = null
      this.bufProcessing = false
    },
    _bufFinalizeTap(cardId, card, tier, active) {
      const amount = tier ? tier.price : 0
      const projected = card.balance - amount
      if (projected < -this.bufNegativeCapLimit) {
        this.bufShowResult({ case: 'buf-insufficient', cardId, card, tier, amount, balance: card.balance })
        return
      }

      card.balance = projected
      const newTx = bufTx({
        cardId, date: BUF_TODAY, round: active ? active.key : null,
        time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
        gradeTier: tier ? tier.key : card.gradeTier, amount,
      })
      this.buffetTransactions.push(newTx)
      this.bufShowResult({ case: 'success', cardId, card, tier, amount, tx: newTx })
    },
    bufShowResult(payload) {
      this.bufProcessing = false
      if (payload.case !== 'hwA') this.bufMisreadCount = 0
      this.bufResult = payload
      this.bufBroadcastResult()
      // 'buf-insufficient', case9-*, hwB, hwC รอ action พนักงาน ไม่ auto กลับ (เหมือนหลักการเดียวกับ Pre-Order)
      // QR success (card === null) ใช้ bufNextScreenPrompt คุม auto-dismiss เอง (5 วิ) แทนค่า delayMap ปกติ
      const isQrSuccess = payload.case === 'success' && !payload.card
      const delayMap = { success: 3000, 'buf-duplicate': 3000, case5: 4000, case6: 4000, hwA: 2500, hwD: 2000 }
      if (delayMap[payload.case] && !isQrSuccess) {
        this.bufResultTimer = setTimeout(() => this.bufBackToIdle(), delayMap[payload.case])
      }
    },
    bufBackToIdle() {
      clearTimeout(this.bufResultTimer)
      clearTimeout(this.bufNextScreenAutoTimer)
      this.bufNextScreenPrompt = false
      this.bufProcessing = false
      this.bufResult = null
      this.bufBroadcastResult()
    },
    // §3.1 — ปุ่มย้อนกลับหน้าแตะบัตร ต้องใส่รหัส Supervisor (ยืนยันแล้ว) ก่อนออกไปหน้าเลือกวิธีชำระเงิน
    bufOpenIdleBackPin() {
      this.bufIdleBackPinValue = ''
      this.bufIdleBackPinError = ''
      this.bufIdleBackPinModal = true
    },
    bufCloseIdleBackPin() {
      this.bufIdleBackPinModal = false
      this.bufIdleBackPinValue = ''
      this.bufIdleBackPinError = ''
    },
    bufConfirmIdleBack() {
      const code = this.bufIdleBackPinValue.trim()
      const supervisor = this.systemUsers.find(u => u.code === code && u.role === 'supervisor')
      if (!supervisor) {
        this.bufIdleBackPinError = 'รหัสไม่ถูกต้อง หรือไม่มีสิทธิ์ย้อนกลับ'
        this.bufIdleBackPinValue = ''
        return
      }
      this.bufIdleBackPinModal = false
      this.appScreen = 'buffet-pay-method'
    },
    // ภาพรวม staff + drill-down ตามระดับชั้น (§5)
    bufOpenDrill(tierKey) {
      this.bufDrillTier = tierKey
      this.bufDrillSearch = ''
    },
    bufCloseDrill() {
      this.bufDrillTier = null
      this.bufDrillSearch = ''
    },
    // modal ยกเลิกรายการ/void-refund (§6)
    // §6 — ยกเลิก/คืนเงินได้เฉพาะรายการที่จ่ายด้วยแตะบัตร (เงินอยู่ในระบบโรงเรียนเอง) QR คืนไม่ได้เพราะจ่ายผ่านธนาคาร/ผู้ให้บริการโดยตรง
    bufOpenVoid(tx) {
      if (tx.paymentMethod !== 'card') {
        this.addToast('รายการนี้ชำระผ่าน QR ไม่สามารถยกเลิก/คืนเงินผ่านระบบได้ กรุณาติดต่อธนาคาร/ผู้ให้บริการโดยตรง', 'error')
        return
      }
      this.bufVoidTarget = tx
      this.bufVoidReasonSel = ''
      this.bufVoidReasonOther = ''
      this.bufVoidPinValue = ''
      this.bufVoidPinError = ''
      this.bufVoidModal = true
    },
    bufCloseVoid() {
      this.bufVoidModal = false
      this.bufVoidTarget = null
      this.bufVoidReasonSel = ''
      this.bufVoidReasonOther = ''
      this.bufVoidPinValue = ''
      this.bufVoidPinError = ''
    },
    bufConfirmVoid() {
      if (!this.bufVoidTarget) return
      const note = this.bufVoidReasonOther.trim()
      const reason = this.bufVoidReasonSel === 'อื่นๆ' ? note : (note ? `${this.bufVoidReasonSel} — ${note}` : this.bufVoidReasonSel)
      if (!reason) return
      const code = this.bufVoidPinValue.trim()
      const admin = this.systemUsers.find(u => u.code === code && u.role === 'supervisor')
      if (!admin) {
        this.bufVoidPinError = 'รหัสไม่ถูกต้อง หรือไม่มีสิทธิ์ยกเลิกรายการ'
        this.bufVoidPinValue = ''
        return
      }
      const tx = this.bufVoidTarget
      tx.voided = true
      tx.voidReason = reason
      tx.voidedBy = `${admin.name} (${admin.code})`
      tx.voidedAt = new Date().toLocaleString('th-TH')
      // refund เข้าเครดิตอัตโนมัติ ตามที่ยืนยันไว้
      const card = this.bufCardInfo(tx.cardId)
      if (card) card.balance += tx.amount
      this.bufCloseVoid()
      this.addToast('ยกเลิกรายการและคืนเงินเข้าเครดิตแล้ว', 'info')
    },
    // จอ 2 — customer display (BroadcastChannel แยกช่องจาก Pre-Order)
    bufInitBroadcast() {
      if (this.bufBroadcastChannel || typeof BroadcastChannel === 'undefined') return
      this.bufBroadcastChannel = new BroadcastChannel('buffet-sync')
      if (this.bufIsCustomerDisplay) {
        this.bufBroadcastChannel.onmessage = (ev) => {
          if (!ev.data) return
          if (ev.data.type === 'result') {
            this.bufQrDisplayStep = null
            clearInterval(this.bufQrDisplayTimer)
            this.bufResult = ev.data.payload
            this.bufDisplayTier = ev.data.tier || null
          } else if (ev.data.type === 'qr-state') {
            this.bufResult = null
            this.bufDisplayTier = ev.data.tier || null
            this.bufQrDisplayStep = ev.data.step
            clearInterval(this.bufQrDisplayTimer)
            if (ev.data.step === 'countdown') {
              this.bufQrDisplayCountdown = ev.data.countdown
              this.bufQrDisplayTimer = setInterval(() => {
                this.bufQrDisplayCountdown--
                if (this.bufQrDisplayCountdown <= 0) clearInterval(this.bufQrDisplayTimer)
              }, 1000)
            }
          }
        }
      }
    },
    // §4 บุฟเฟต์ — ก่อนแตะบัตร จอ 2 ต้องโชว์ยอดที่ผูกไว้แล้วเหมือนจอ 1 เป๊ะ ไม่ใช่แค่ตอนจ่ายสำเร็จ
    bufBroadcastResult() {
      if (!this.bufBroadcastChannel || this.bufIsCustomerDisplay) return
      const r = this.bufResult
      if (r && (r.case === 'hwA' || r.case === 'hwD')) return
      const payload = r ? JSON.parse(JSON.stringify(this.bufCustomerSafePayload(r))) : null
      const tier = this.bufSelectedTierInfo ? { label: this.bufSelectedTierInfo.label, price: this.bufSelectedTierInfo.price } : null
      this.bufBroadcastChannel.postMessage({ type: 'result', payload, tier })
    },
    // §2.1/§8b — mirror สถานะระหว่าง flow สแกน QR ไปจอ 2 แบบ real-time (คนละ message type จาก 'result')
    bufBroadcastQrState(step) {
      if (!this.bufBroadcastChannel || this.bufIsCustomerDisplay) return
      const tier = this.bufSelectedTierInfo ? { label: this.bufSelectedTierInfo.label, price: this.bufSelectedTierInfo.price } : null
      this.bufBroadcastChannel.postMessage({ type: 'qr-state', step, tier, countdown: this.bufQrCountdown })
    },
    // §4 บุฟเฟต์ — จอ 2 ต้อง mirror เนื้อหาเดียวกับจอ 1 ทุกเคส (ยืนยันกับทีมแล้ว ไม่ใช่ fallback กลาง)
    // ตัดออกเฉพาะ error code ทางเทคนิคระดับฮาร์ดแวร์/backend (เช่น READER_HW_FAULT) ไม่ส่งไปจอ 2
    bufCustomerSafePayload(r) {
      if (r.case === 'success') return { case: 'success', amount: r.amount, balance: r.card ? r.card.balance : null, date: r.tx.date, time: r.tx.time }
      if (r.case === 'buf-duplicate') return { case: 'buf-duplicate', name: r.card ? r.card.name : '', time: r.time }
      if (r.case === 'buf-insufficient') return { case: 'buf-insufficient', amount: r.amount, balance: r.balance }
      if (r.case === 'hwB' || r.case === 'hwC') return { case: r.case }
      return { case: r.case }
    },
    bufOpenCustomerDisplay() {
      this.bufInitBroadcast()
      const url = window.location.origin + window.location.pathname + '?display=buffet-customer'
      this.bufCustomerWindow = window.open(url, 'buffetCustomerDisplay', 'width=480,height=854')
      if (!this.bufCustomerWindow) this.addToast('เบราว์เซอร์บล็อกป๊อปอัป กรุณาอนุญาตแล้วลองใหม่', 'error')
    },
  },

  watch: {
    empIdentModal(v) {
      if (v) {
        this.empNotFound = false
        this.empNewName = ''
        this.empNewMemberId = ''
        this.empNewCard = ''
        this.empIdentStep = 'choose'
        this.$nextTick(() => this.$refs.empInput?.focus())
      }
    },
    empCodeInput() {
      if (this.empNotFound) this.empNotFound = false
    },
    settingsOpen(v) {
      if (v) this.settingsForm = JSON.parse(JSON.stringify(this.settings))
    },
    appScreen(v) {
      if (v === 'pos') {
        setInterval(() => {
          this.clock = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
        }, 60000)
      }
    }
  },

  mounted() {
    this.clock = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
    const updateFsClock = () => {
      const t = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      this.fsCurrentTime = t
      this.poCurrentTime = t
      this.bufCurrentTime = t
    }
    updateFsClock()
    setInterval(updateFsClock, 1000)

    const displayParam = new URLSearchParams(window.location.search).get('display')
    if (displayParam === 'preorder-customer') {
      this.poIsCustomerDisplay = true
      this.poInitBroadcast()
    } else if (displayParam === 'buffet-customer') {
      this.bufIsCustomerDisplay = true
      this.bufInitBroadcast()
    }

    window.__pos__ = this
  },

  beforeUnmount() {
    if (this.poBroadcastChannel) this.poBroadcastChannel.close()
    if (this.bufBroadcastChannel) this.bufBroadcastChannel.close()
    clearTimeout(this.poResultTimer)
    clearTimeout(this.bufResultTimer)
  }
}
</script>
