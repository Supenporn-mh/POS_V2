<template>
  <div>
    <!-- ===================== LOGIN ===================== -->
    <div v-if="appScreen === 'login'" class="upos-login">
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

    <!-- ===== CANCEL ORDER MODAL ===== -->
    <div v-if="cancelOrderModal" class="modal-overlay" @click.self="cancelOrderModal = false">
      <div class="modal-box sm">
        <div class="confirm-modal-body">
          <div class="confirm-icon-wrap red"><i class="fa fa-exclamation-triangle"></i></div>
          <div class="confirm-title">ยืนยันยกเลิกออเดอร์?</div>
          <div class="confirm-sub">เลขที่ใบเสร็จ : {{ selectedOrder && selectedOrder.receiptNo }}</div>
          <label class="cancel-reason-label">เหตุผลการยกเลิก *</label>
          <textarea class="cancel-reason-textarea" v-model="cancelOrderReason" placeholder="ระบุเหตุผลการยกเลิก..." rows="3"></textarea>
          <div class="confirm-actions">
            <button class="btn-no" @click="cancelOrderModal = false">ไม่ยกเลิก</button>
            <button class="btn-yes-red" :disabled="!cancelOrderReason.trim()" @click="cancelOrderModal = false; openCancelPin('order')">ยืนยันยกเลิก</button>
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
  { id: 1, roomNo: '100101-1', phone: '0987894561', receiptNo: '1202602250010', date: '25-02-2026', time: '18:08', total: 564.96, paymentStatus: 'success', foodStatus: 'cooking', customerName: 'สมชาย ใจดี', paymentMethod: 'แม่ณี', subtotal: 480, discount: 0, vat: 48, sc: 39.96, items: [{ name: 'กะเพราไก่ไข่ดาว', qty: 2, price: 320.00, options: ['เพิ่มข้าว', 'เพิ่มเนื้อสัตว์'], note: 'โม่ใส่นัก' }, { name: 'อเมริกาโน่เย็น', qty: 1, price: 80.00, options: ['หวานน้อย 25%', 'เพิ่มช็อตกาแฟ'], note: 'แยกน้ำแข็ง' }, { name: 'น้ำเปล่า', qty: 2, price: 80.00, options: [], note: '' }], note: 'ใส่กล่อง, Delivery Info: Pickup Now, Payment Method: แม่ณี' },
  { id: 2, roomNo: '100101-2', phone: '0987894561', receiptNo: '1202602250009', date: '25-02-2026', time: '17:08', total: 564.96, paymentStatus: '', foodStatus: 'sending', customerName: 'สมหญิง รักดี', paymentMethod: 'เงินสด', subtotal: 480, discount: 0, vat: 48, sc: 39.96, items: [{ name: 'กะเพราไก่ไข่ดาว', qty: 2, price: 320.00, options: ['เพิ่มข้าว', 'เพิ่มเนื้อสัตว์'], note: 'โม่ใส่นัก' }, { name: 'อเมริกาโน่เย็น', qty: 1, price: 80.00, options: ['หวานน้อย 25%', 'เพิ่มช็อตกาแฟ'], note: 'แยกน้ำแข็ง' }, { name: 'น้ำเปล่า', qty: 2, price: 80.00, options: [], note: '' }], note: 'ใส่กล่อง, Delivery Info: Pickup Now, Payment Method: แม่ณี' },
  { id: 3, roomNo: '100101-3', phone: '0987894561', receiptNo: '1202602250008', date: '25-02-2026', time: '16:45', total: 257.00, paymentStatus: '', foodStatus: 'cancelled', customerName: 'วิชัย สุขใจ', paymentMethod: 'QR Code', subtotal: 220, discount: 0, vat: 22, sc: 19.80, items: [{ name: 'Café Latte', qty: 2, price: 160.00, options: ['ไม่ใส่น้ำตาล'], note: '' }, { name: 'คุกกี้', qty: 1, price: 45.00, options: [], note: '' }], note: '' },
  { id: 4, roomNo: '100108', phone: '0987894561', receiptNo: '1202602250007', date: '25-02-2026', time: '16:20', total: 398.00, paymentStatus: 'success', foodStatus: 'cooking', customerName: 'สมชาย ใจดี', paymentMethod: 'EDC', subtotal: 340, discount: 0, vat: 34, sc: 30.60, items: [{ name: 'Matcha Latte', qty: 2, price: 170.00, options: ['เพิ่มน้ำตาล'], note: '' }, { name: 'Croissant', qty: 2, price: 130.00, options: [], note: '' }], note: '' },
  { id: 5, roomNo: '100102', phone: '0987894561', receiptNo: '1202602250006', date: '25-02-2026', time: '15:55', total: 689.00, paymentStatus: 'success', foodStatus: 'served', customerName: 'นิดา มีสุข', paymentMethod: 'แม่ณี', subtotal: 590, discount: 0, vat: 59, sc: 53.10, items: [{ name: 'Strawberry Matcha', qty: 3, price: 360.00, options: ['หวานน้อย'], note: 'เร่งด่วน' }, { name: 'Cheesecake', qty: 2, price: 220.00, options: [], note: '' }], note: '' },
  { id: 6, roomNo: '100111', phone: '0987894561', receiptNo: '1202602250005', date: '25-02-2026', time: '15:30', total: 879.00, paymentStatus: '', foodStatus: 'pending', customerName: 'ปิยะ วงศ์ไทย', paymentMethod: 'เงินสด', subtotal: 750, discount: 0, vat: 75, sc: 67.50, items: [{ name: 'Caramel Macchiato', qty: 4, price: 360.00, options: ['เพิ่มช็อต'], note: '' }, { name: 'Banana Bread', qty: 2, price: 110.00, options: [], note: '' }, { name: 'Cookie', qty: 6, price: 270.00, options: [], note: '' }], note: 'แยกถุง' },
  { id: 7, roomNo: '100112', phone: '0987894561', receiptNo: '1202602250004', date: '25-02-2026', time: '14:50', total: 548.00, paymentStatus: '', foodStatus: 'cancelled', customerName: 'ศิรินภา ดีงาม', paymentMethod: 'QR Code', subtotal: 468, discount: 0, vat: 46.80, sc: 42.12, items: [{ name: 'Thai Tea', qty: 4, price: 260.00, options: ['หวานปกติ'], note: '' }, { name: 'Waffle', qty: 2, price: 170.00, options: [], note: '' }], note: '' },
  { id: 8, roomNo: '100202', phone: '0987894561', receiptNo: '1202602250003', date: '25-02-2026', time: '14:10', total: 497.00, paymentStatus: '', foodStatus: 'sending', customerName: 'อรุณ สว่าง', paymentMethod: 'EDC', subtotal: 424, discount: 0, vat: 42.40, sc: 38.16, items: [{ name: 'Honey Lemon', qty: 3, price: 210.00, options: [], note: '' }, { name: 'Chocolate Cake', qty: 2, price: 180.00, options: [], note: '' }], note: '' },
  { id: 9, roomNo: '100109', phone: '0987894561', receiptNo: '1202602250002', date: '25-02-2026', time: '13:30', total: 1879.00, paymentStatus: 'success', foodStatus: 'cooking', customerName: 'ธนพล รุ่งเรือง', paymentMethod: 'แม่ณี', subtotal: 1600, discount: 0, vat: 160, sc: 144, items: [{ name: 'Americano Pandan', qty: 5, price: 500.00, options: ['ไม่ใส่น้ำตาล', 'เพิ่มแพนดาน'], note: '' }, { name: 'กะเพราไก่ไข่ดาว', qty: 4, price: 640.00, options: ['เพิ่มข้าว'], note: 'ไม่เผ็ด' }, { name: 'น้ำเปล่า', qty: 5, price: 200.00, options: [], note: '' }], note: 'จัดส่ง ห้อง 302' },
  { id: 10, roomNo: '100206', phone: '0987894561', receiptNo: '1202602250001', date: '25-02-2026', time: '12:00', total: 789.00, paymentStatus: '', foodStatus: 'complete', customerName: 'มาลี ศรีดี', paymentMethod: 'เงินสด', subtotal: 674, discount: 0, vat: 67.40, sc: 60.66, items: [{ name: 'Butterfly Pea Latte', qty: 4, price: 320.00, options: ['หวานน้อย 25%'], note: '' }, { name: 'Passion Fruit Soda', qty: 3, price: 225.00, options: [], note: '' }, { name: 'Croissant', qty: 2, price: 130.00, options: [], note: '' }], note: '' },
  {
    id: 11, roomNo: '100301', phone: '0912-345-678', receiptNo: '1202604240011',
    date: '24-04-2026', time: '10:30', paymentStatus: 'success', foodStatus: 'cooking',
    customerName: 'พิมพ์ใจ แสงทอง', paymentMethod: 'แม่ณี',
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
  { id: 12, roomNo: '201A', phone: '0811111111', receiptNo: '1202605050012', date: '05-05-2026', time: '08:45', total: 340.00, paymentStatus: 'success', foodStatus: 'complete', customerName: 'ธนา พัฒนา', paymentMethod: 'QR Code', subtotal: 290, discount: 0, vat: 29, sc: 26.10, items: [{ name: 'Caramel Macchiato', qty: 2, price: 180.00, options: ['หวานน้อย 25%'], note: '' }, { name: 'น้ำเปล่า', qty: 2, price: 60.00, options: [], note: '' }], note: '' },
  { id: 13, roomNo: '202B', phone: '0822222222', receiptNo: '1202605050013', date: '05-05-2026', time: '09:10', total: 510.00, paymentStatus: 'success', foodStatus: 'complete', customerName: 'สุดา รักสวย', paymentMethod: 'แม่ณี', subtotal: 435, discount: 0, vat: 43.50, sc: 39.15, items: [{ name: 'Matcha Latte', qty: 3, price: 255.00, options: ['ไม่ใส่น้ำตาล'], note: '' }, { name: 'Strawberry Matcha', qty: 2, price: 240.00, options: ['หวานน้อย'], note: '' }], note: '' },
  { id: 14, roomNo: '203C', phone: '0833333333', receiptNo: '1202605050014', date: '05-05-2026', time: '09:55', total: 420.00, paymentStatus: 'success', foodStatus: 'complete', customerName: 'มานะ ดีใจ', paymentMethod: 'เงินสด', subtotal: 360, discount: 0, vat: 36, sc: 32.40, items: [{ name: 'Thai Tea', qty: 2, price: 180.00, options: ['หวานปกติ'], note: '' }, { name: 'Honey Lemon', qty: 2, price: 160.00, options: [], note: '' }], note: '' },
  { id: 15, roomNo: '204D', phone: '0844444444', receiptNo: '1202605050015', date: '05-05-2026', time: '10:30', total: 390.00, paymentStatus: 'success', foodStatus: 'complete', customerName: 'ปณิตา ชัยมงคล', paymentMethod: 'EDC', subtotal: 333, discount: 0, vat: 33.30, sc: 29.97, items: [{ name: 'Butterfly Pea Latte', qty: 2, price: 200.00, options: ['หวานน้อย 25%'], note: '' }, { name: 'Americano Pandan', qty: 1, price: 110.00, options: ['ไม่ใส่น้ำตาล'], note: '' }], note: '' },
  { id: 16, roomNo: '205E', phone: '0855555555', receiptNo: '1202605050016', date: '05-05-2026', time: '11:15', total: 560.00, paymentStatus: 'success', foodStatus: 'complete', customerName: 'ชัยชนะ วิชิต', paymentMethod: 'แม่ณี', subtotal: 478, discount: 0, vat: 47.80, sc: 43.02, items: [{ name: 'Americano Pandan', qty: 3, price: 330.00, options: ['ไม่ใส่น้ำตาล', 'เพิ่มแพนดาน'], note: '' }, { name: 'Café Latte', qty: 2, price: 180.00, options: ['เพิ่มช็อต'], note: '' }], note: '' },
  { id: 17, roomNo: '206F', phone: '0866666666', receiptNo: '1202605050017', date: '05-05-2026', time: '12:20', total: 620.00, paymentStatus: 'success', foodStatus: 'complete', customerName: 'วลัยพร สุขสม', paymentMethod: 'QR Code', subtotal: 529, discount: 0, vat: 52.90, sc: 47.61, items: [{ name: 'Strawberry Matcha', qty: 2, price: 240.00, options: ['หวานน้อย'], note: 'เร่งด่วน' }, { name: 'Passion Fruit Soda', qty: 3, price: 285.00, options: [], note: '' }], note: '' },
  { id: 18, roomNo: '207G', phone: '0877777777', receiptNo: '1202605050018', date: '05-05-2026', time: '13:05', total: 310.00, paymentStatus: 'success', foodStatus: 'complete', customerName: 'ณัฐพล ตรงดี', paymentMethod: 'เงินสด', subtotal: 265, discount: 0, vat: 26.50, sc: 23.85, items: [{ name: 'Café Latte', qty: 2, price: 180.00, options: [], note: '' }, { name: 'น้ำเปล่า', qty: 3, price: 90.00, options: [], note: '' }], note: '' },
  { id: 19, roomNo: '208H', phone: '0888888888', receiptNo: '1202605050019', date: '05-05-2026', time: '14:00', total: 0, paymentStatus: '', foodStatus: 'cancelled', customerName: 'กาญจนา ยิ้มแย้ม', paymentMethod: 'เงินสด', subtotal: 0, discount: 0, vat: 0, sc: 0, items: [{ name: 'Caramel Macchiato', qty: 1, price: 90.00, options: ['เพิ่มช็อต'], note: '' }, { name: 'Matcha Latte', qty: 2, price: 170.00, options: [], note: '' }], note: 'ยกเลิกโดยลูกค้า' },
  // --- Mock history: เมื่อวาน 04-05-2026 ---
  { id: 20, roomNo: '301A', phone: '0811110001', receiptNo: '1202605040020', date: '04-05-2026', time: '10:00', total: 480.00, paymentStatus: 'success', foodStatus: 'complete', customerName: 'รัชนี ใจงาม', paymentMethod: 'แม่ณี', subtotal: 410, discount: 0, vat: 41, sc: 36.90, items: [{ name: 'Matcha Latte', qty: 2, price: 170.00, options: ['หวานน้อย'], note: '' }, { name: 'Caramel Macchiato', qty: 2, price: 180.00, options: [], note: '' }], note: '' },
  { id: 21, roomNo: '302B', phone: '0822220002', receiptNo: '1202605040021', date: '04-05-2026', time: '11:30', total: 345.00, paymentStatus: 'success', foodStatus: 'complete', customerName: 'ประเสริฐ ดีมาก', paymentMethod: 'EDC', subtotal: 295, discount: 0, vat: 29.50, sc: 26.55, items: [{ name: 'Thai Tea', qty: 3, price: 270.00, options: ['หวานปกติ'], note: '' }, { name: 'น้ำเปล่า', qty: 1, price: 30.00, options: [], note: '' }], note: '' },
  { id: 22, roomNo: '303C', phone: '0833330003', receiptNo: '1202605040022', date: '04-05-2026', time: '13:45', total: 580.00, paymentStatus: 'success', foodStatus: 'complete', customerName: 'อำพร สดใส', paymentMethod: 'QR Code', subtotal: 495, discount: 0, vat: 49.50, sc: 44.55, items: [{ name: 'Butterfly Pea Latte', qty: 3, price: 300.00, options: ['หวานน้อย 25%'], note: '' }, { name: 'Americano', qty: 2, price: 160.00, options: ['ร้อน'], note: '' }], note: '' },
  { id: 23, roomNo: '304D', phone: '0844440004', receiptNo: '1202605040023', date: '04-05-2026', time: '15:00', total: 0, paymentStatus: '', foodStatus: 'cancelled', customerName: 'บุญรอด แข็งแรง', paymentMethod: 'เงินสด', subtotal: 0, discount: 0, vat: 0, sc: 0, items: [{ name: 'Honey Lemon', qty: 2, price: 160.00, options: [], note: '' }], note: 'ยกเลิกก่อนชำระเงิน' },
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
      cancelOrderReason: '',
      cancelPinModal: false,
      cancelPinValue: '',
      cancelPinError: '',
      cancelPinAction: null,
      systemUsers: [
        { code: 'ADM001', name: 'ผู้จัดการ', role: 'admin' },
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
        { key: 'card',      label: 'เครดิต / เดบิต',  icon: 'fa fa-credit-card',     color: '#5856D6' },
        { key: 'promptpay', label: 'พร้อมเพย์',        icon: 'fa fa-qrcode',          color: '#007AFF' },
        { key: 'maenee',    label: 'แม่ณี',            icon: 'fa fa-wallet',          color: '#FF9500' },
        { key: 'wechat',    label: 'Wechat Pay',       icon: 'fa fa-comment',         color: '#34C759' },
        { key: 'alipay',    label: 'Alipay',           icon: 'fa fa-a',               color: '#007AFF' },
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
      this.cancelOrderReason = ''
      this.cancelOrderModal = true
    },
    doCancelOrder() {
      if (!this.cancelOrderReason.trim()) return
      this.selectedOrder.isCancelled = true
      this.selectedOrder.cancelReason = this.cancelOrderReason.trim()
      this.cancelledOrdersList.push(this.selectedOrder)
      this.cancelOrderModal = false
      this.cancelOrderReason = ''
      this.addToast('ยกเลิกออเดอร์แล้ว', 'info')
      this.appScreen = 'cancelled-orders'
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
      else if (action === 'order') this.doCancelOrder()
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
      this.fsCurrentTime = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    }
    updateFsClock()
    setInterval(updateFsClock, 1000)
    window.__pos__ = this
  }
}
</script>
