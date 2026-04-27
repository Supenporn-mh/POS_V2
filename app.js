// POS D4-504 — Vue 3 Application
const {createApp, ref, computed, watch, nextTick, reactive} = Vue;

const categories = [
    {id:'all',name:'ทั้งหมด',icon:'fa-border-all'},{id:'coffee',name:'กาแฟ',icon:'fa-mug-hot'},
    {id:'tea',name:'ชา',icon:'fa-leaf'},{id:'specialty',name:'พิเศษ',icon:'fa-wand-magic-sparkles'},
    {id:'bakery',name:'เบเกอรี่',icon:'fa-cookie-bite'}
];
const products = [
    {id:1,name:"Americano",price:70,image:"☕",cat:"coffee",sku:"CF001",audience:"general",promos:[{id:'bogo-any',title:"ซื้อ 1 แถม 1 (ฟรีทุกเมนู)",desc:"สั่งอเมริกาโน่ เลือกเครื่องดื่มอะไรก็ได้ฟรี 1 แก้ว!",type:'ANY_FREE'}]},
    {id:2,name:"Espresso",price:65,image:"☕",cat:"coffee",sku:"CF002",audience:"general",promos:[]},
    {id:3,name:"Café Latte",price:80,image:"☕",cat:"coffee",sku:"CF003",audience:"general",promos:[]},
    {id:4,name:"Cappuccino",price:80,image:"☕",cat:"coffee",sku:"CF004",audience:"general",promos:[]},
    {id:5,name:"Mocha",price:85,image:"🍫",cat:"coffee",sku:"CF005",audience:"general",promos:[]},
    {id:6,name:"Caramel Macchiato",price:90,image:"☕",cat:"coffee",sku:"CF006",audience:"general",promos:[]},
    {id:7,name:"Matcha Latte",price:85,image:"🍵",cat:"tea",sku:"TE001",audience:"general",promos:[{id:'bogo-matcha',title:"ซื้อ 1 แถม 1",desc:"Matcha Latte แถมฟรีอีก 1 แก้วทันที",type:'BOGO'}]},
    {id:8,name:"Thai Tea",price:65,image:"🧋",cat:"tea",sku:"TE002",audience:"general",promos:[]},
    {id:9,name:"Oolong Tea",price:70,image:"🍵",cat:"tea",sku:"TE003",audience:"general",promos:[]},
    {id:10,name:"Earl Grey",price:65,image:"🍵",cat:"tea",sku:"TE004",audience:"general",promos:[]},
    {id:11,name:"Jasmine Green Tea",price:60,image:"🍵",cat:"tea",sku:"TE005",audience:"general",promos:[]},
    {id:12,name:"Strawberry Matcha",price:120,image:"🍓",cat:"specialty",sku:"SP001",audience:"member",promos:[]},
    {id:13,name:"Americano Pandan",price:100,image:"🌿",cat:"specialty",sku:"SP002",audience:"member",promos:[]},
    {id:14,name:"Chocolate Latte",price:95,image:"🍫",cat:"specialty",sku:"SP003",audience:"member",promos:[]},
    {id:15,name:"Red Lemon Soda",price:60,image:"🍋",cat:"specialty",sku:"SP004",audience:"member",promos:[]},
    {id:16,name:"Honey Lemon",price:70,image:"🍯",cat:"specialty",sku:"SP005",audience:"member",promos:[]},
    {id:17,name:"Passion Fruit Soda",price:75,image:"🥝",cat:"specialty",sku:"SP006",audience:"member",promos:[]},
    {id:18,name:"Butterfly Pea Latte",price:80,image:"💜",cat:"specialty",sku:"SP007",audience:"member",promos:[]},
    {id:19,name:"Croissant",price:65,image:"🥐",cat:"bakery",sku:"BK001",audience:"all",promos:[]},
    {id:20,name:"Chocolate Cake",price:90,image:"🍰",cat:"bakery",sku:"BK002",audience:"all",promos:[]},
    {id:21,name:"Cheesecake",price:110,image:"🧁",cat:"bakery",sku:"BK003",audience:"all",promos:[]},
    {id:22,name:"Cookie",price:45,image:"🍪",cat:"bakery",sku:"BK004",audience:"all",promos:[]},
    {id:23,name:"Banana Bread",price:55,image:"🍞",cat:"bakery",sku:"BK005",audience:"all",promos:[]},
    {id:24,name:"Waffle",price:85,image:"🧇",cat:"bakery",sku:"BK006",audience:"all",promos:[]}
];
const promoItems = [
    {id:'p1',title:'Buy 2 Pay ฿90',desc:'น้ำผึ้งมะนาว + อเมริกาโน่ ราคาพิเศษเพียง 90 บาท',icon:'fa-percentage',highlight:false},
    {id:'p2',title:'Buy 2 Pay ฿100',desc:'กาแฟสังขยา + สังขยาลาเต้ ราคาเพียง 100 บาท',icon:'fa-percentage',highlight:false},
    {id:'p3',title:'Americano Special',desc:'ซื้ออเมริกาโน่ 1 แก้ว แถมฟรีเครื่องดื่มอะไรก็ได้ 1 แก้ว',icon:'fa-star',highlight:true}
];
const branches = [{id:1,name:'สาขาพระราม 6'},{id:2,name:'สาขาสยามพารากอน'},{id:3,name:'สาขาเซ็นทรัลเวิลด์'},{id:4,name:'สาขาอโศก'}];
const membersData = [
    {id:'M001',name:'คุณสมชาย ใจดี',phone:'081-234-5678',level:'Gold',points:2450,discount:10},
    {id:'M002',name:'คุณสมหญิง รักดี',phone:'089-876-5432',level:'Silver',points:850,discount:5},
    {id:'M003',name:'คุณวิชัย สุขใจ',phone:'062-111-2222',level:'Platinum',points:5200,discount:15}
];

createApp({
    data(){return{
        // Auth
        loggedIn:true, pinCode:'', pinError:'',
        // UI
        clock:'', menuEnabled:true, autoPrint:false, branchOpen:false, selectedBranch:0,
        selectedCat:'all', searchOpen:false, searchQ:'',
        aiInput:'', aiLoading:false,
        // Bills
        bills:[{id:1,items:[],member:null,customDiscount:null}], activeBill:0, billCounter:1, orderCounter:0,
        // Shift
        shiftData:{isOpen:false,openedAt:null,openingCash:0,totalSales:0,cashSales:0,cardSales:0,qrSales:0,billCount:0,cancelCount:0},
        // Settings
        settings:{storeName:'The Coffee House',storeAddress:'123 ถ.พระราม 6 แขวงพญาไท กรุงเทพฯ 10400',taxId:'0-1234-56789-01-2',vatEnabled:true,vatRate:7,scEnabled:false,scRate:10},
        // Privileges
        paySection:'privileges',
        employeePrivileges:[
            {id:'meal',name:'ค่าอาหารพนักงาน',balance:5.00},
            {id:'travel',name:'เบี้ยเลี้ยงเดินทาง',balance:20.00},
            {id:'welfare',name:'กระเป๋าเงินสวัสดิการ',balance:10.00},
            {id:'member-disc',name:'ส่วนลดสมาชิก',balance:5.00},
        ],
        privilegeTypes:[
            {id:'meal',name:'ค่าอาหารพนักงาน'},
            {id:'travel',name:'เบี้ยเลี้ยงเดินทาง'},
            {id:'welfare',name:'กระเป๋าเงินสวัสดิการ'},
            {id:'member-disc',name:'ส่วนลดสมาชิก'},
        ],
        selectedPrivTypes:[],
        privAuth:false, privAuthInput:'', privAuthUser:null,
        appliedPrivileges:[],
        payDcType:'percent', payDcValue:'', payDcReason:'',
        // Modal
        modalShow:false, modalType:'', modalData:{},
        // Payment
        payOpen:false, payMethod:'cash', cashStr:'', payProcessing:false, payDone:false,
        // Receipt
        receiptOpen:false, receiptHtml:'',
        // Toast
        toasts:[],
        // Constants
        categories, products, promoItems, branches, membersData,
        // Temp
        _selectedProduct:null, _noteItem:null, _dcType:'percent',
        _shiftCash:1000, _countCash:0, _cancelReason:'ลูกค้ายกเลิก',
        _memberQ:'', _dcValue:'', _dcReason:'',
        // Settings temp
        _sName:'',_sAddr:'',_sTax:'',_sVatRate:7,_sVatOn:true,_sScRate:10,_sScOn:false,
    }},
    computed:{
        currentBill(){return this.bills[this.activeBill]},
        filteredProducts(){return this.selectedCat==='all'?products:products.filter(p=>p.cat===this.selectedCat)},
        searchResults(){const q=this.searchQ.trim().toLowerCase();return q?products.filter(p=>p.name.toLowerCase().includes(q)||p.sku.toLowerCase().includes(q)):products},
        currentOrderNo(){
            const d=new Date(),ds=`${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
            return `${ds}${String(this.currentBill.id).padStart(3,'0')}`;
        },
        totals(){
            const items=this.currentBill.items;
            const subtotal=items.reduce((s,i)=>s+(i.originalPrice||i.price)*(i.qty||1),0);
            const itemTotal=items.reduce((s,i)=>s+i.price*(i.qty||1),0);
            const promoDisc=subtotal-itemTotal;
            let customDisc=0;
            const cd=this.currentBill.customDiscount;
            if(cd) customDisc=cd.type==='percent'?itemTotal*cd.value/100:cd.value;
            let memberDisc=0;
            const mb=this.currentBill.member;
            if(mb) memberDisc=(itemTotal-customDisc)*mb.discount/100;
            const privDisc=this.appliedPrivileges.reduce((s,p)=>s+p.amount,0);
            const totalDisc=promoDisc+customDisc+memberDisc+privDisc;
            const net=Math.max(subtotal-totalDisc,0);
            const scAmt=this.settings.scEnabled?net*this.settings.scRate/100:0;
            const bv=net+scAmt;
            const vatAmt=this.settings.vatEnabled?bv*this.settings.vatRate/100:0;
            return{subtotal,promoDisc,customDisc,memberDisc,privDisc,totalDisc,net,scAmt,vatAmt,grand:bv+vatAmt,count:items.length};
        },
        cashChange(){return(parseFloat(this.cashStr)||0)-this.totals.grand},
        payLeftHtml(){
            const t=this.totals,b=this.currentBill;
            let h='<h3 style="font-size:16px;font-weight:700;margin-bottom:14px"><i class="fa fa-receipt mr-2"></i>สรุปรายการ</h3>';
            b.items.forEach(i=>{h+=`<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f1f5f9;font-size:13px"><span>${i.type==='PRO'?'🎁 ':''}${i.name} <span style="color:#94a3b8">x${i.qty||1}</span></span><span style="font-weight:600">฿${(i.price*(i.qty||1)).toFixed(2)}</span></div>`});
            h+='<div style="margin-top:14px;padding-top:14px;border-top:2px solid #e2e8f0">';
            h+=`<div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px"><span>ยอดรวม</span><span>฿${t.subtotal.toFixed(2)}</span></div>`;
            if(t.totalDisc>0)h+=`<div style="display:flex;justify-content:space-between;font-size:13px;color:#ef4444;margin-bottom:4px"><span>ส่วนลด</span><span>-฿${t.totalDisc.toFixed(2)}</span></div>`;
            if(this.settings.scEnabled)h+=`<div style="display:flex;justify-content:space-between;font-size:13px;color:#64748b;margin-bottom:4px"><span>SC ${this.settings.scRate}%</span><span>฿${t.scAmt.toFixed(2)}</span></div>`;
            if(this.settings.vatEnabled)h+=`<div style="display:flex;justify-content:space-between;font-size:13px;color:#64748b;margin-bottom:4px"><span>VAT ${this.settings.vatRate}%</span><span>฿${t.vatAmt.toFixed(2)}</span></div>`;
            h+=`<div style="display:flex;justify-content:space-between;font-size:22px;font-weight:700;color:#2563eb;margin-top:10px;padding-top:10px;border-top:2px solid #2563eb"><span>ชำระทั้งสิ้น</span><span>฿${t.grand.toFixed(2)}</span></div></div>`;
            return h;
        },
        modalTitle(){
            const m={settings:'ตั้งค่าระบบ',logout:'ออกจากระบบ','promo-list':'โปรโมชันทั้งหมด','promo-detail':'รายละเอียดโปรโมชัน','promo-choice':'เลือกโปรโมชัน','free-item':'เลือกรายการแถมฟรี','item-note':'หมายเหตุ',discount:'ส่วนลดพิเศษ',member:'ค้นหาสมาชิก','member-info':'สมาชิกปัจจุบัน','shift-open':'เปิดกะ','shift-close':'ปิดกะ','cancel-bill':'ยกเลิกบิล'};
            return m[this.modalType]||'';
        },
        modalColor(){const c={'settings':'slate','logout':'red','cancel-bill':'red','shift-close':'red','shift-open':'green','free-item':'green','discount':'red'};return c[this.modalType]||'blue'},
        modalSize(){return ['settings','shift-close','free-item'].includes(this.modalType)?'md':'sm'},
        modalBody(){return this.buildModalBody()},
        modalFoot(){return this.buildModalFoot()},
        filteredMembersComputed(){
            const q=(this._memberQ||'').trim();
            const list=q?membersData.filter(m=>m.phone.includes(q)||m.name.includes(q)):membersData;
            if(!list.length)return '<div style="text-align:center;padding:20px;color:#94a3b8">ไม่พบสมาชิก</div>';
            return list.map(m=>`<div onclick="app.selectMember(app.membersData.find(x=>x.id==='${m.id}'))" style="display:flex;align-items:center;padding:12px;border:2px solid #e2e8f0;border-radius:12px;margin-bottom:8px;cursor:pointer" onmouseenter="this.style.borderColor='#2563eb'" onmouseleave="this.style.borderColor='#e2e8f0'"><div style="width:40px;height:40px;border-radius:50%;background:#eff6ff;color:#2563eb;display:flex;align-items:center;justify-content:center;margin-right:12px"><i class="fa fa-user"></i></div><div style="flex:1"><div style="font-weight:600;font-size:14px">${m.name}</div><div style="font-size:11px;color:#94a3b8">${m.phone} • ${m.level}</div></div><div style="font-size:12px;font-weight:700;color:#22c55e">-${m.discount}%</div></div>`).join('');
        },
    },
    methods:{
        // PIN
        pinInput(k){
            this.pinError='';
            if(k==='del'){this.pinCode=this.pinCode.slice(0,-1);return}
            if(this.pinCode.length<4)this.pinCode+=k;
            if(this.pinCode.length===4){
                if(this.pinCode==='1234'){this.loggedIn=true;this.addToast('เข้าสู่ระบบสำเร็จ','success')}
                else{this.pinError='PIN ไม่ถูกต้อง';this.pinCode=''}
            }
        },
        // Cart
        addToCart(p){
            const existing=this.currentBill.items.find(i=>i.id===p.id&&!i.isFree&&i.type==='NORMAL');
            if(existing){existing.qty=(existing.qty||1)+1}
            else{this.currentBill.items.push({...p,cartId:Date.now(),qty:1,type:'NORMAL',note:''})}
            this.addToast('เพิ่ม '+p.name,'success');
        },
        removeItem(cid){this.currentBill.items=this.currentBill.items.filter(i=>i.cartId!==cid)},
        changeQty(item,d){
            if(item.isFree)return;
            const nq=(item.qty||1)+d;
            if(nq<=0){this.removeItem(item.cartId);return}
            item.qty=nq;
        },
        handleProduct(p){
            if(p.promos&&p.promos.length){this._selectedProduct=p;this.modalType='promo-choice';this.modalShow=true}
            else this.addToCart(p);
        },
        handleBarcode(e){
            const v=e.target.value.trim().toLowerCase();if(!v)return;
            const p=products.find(x=>x.sku.toLowerCase()===v||x.name.toLowerCase().includes(v));
            if(p){this.addToCart(p);e.target.value=''}else this.addToast('ไม่พบสินค้า','error');
        },
        // Bills
        addBill(){this.billCounter++;this.bills.push({id:this.billCounter,items:[],member:null,customDiscount:null});this.activeBill=this.bills.length-1;this.addToast('สร้างบิลใหม่','info')},
        clearBill(){const b=this.currentBill;b.items=[];b.member=null;b.customDiscount=null},
        // Promos
        applyPromo(prId){
            const p=this._selectedProduct,pr=p.promos.find(x=>x.id===prId);
            const tid=Date.now();
            if(pr.type==='ANY_FREE'){
                this.currentBill.items.push({...p,cartId:tid,qty:1,type:'NORMAL',note:''});
                this.modalType='free-item';
            }else if(pr.type==='BOGO'){
                this.currentBill.items.push({...p,cartId:tid,qty:1,type:'NORMAL',note:''});
                this.currentBill.items.push({...p,name:p.name+' (ฟรี)',cartId:tid+1,isFree:true,price:0,originalPrice:p.price,qty:1,type:'PRO',note:'แถมฟรี'});
                this.modalShow=false;this.addToast('ใช้โปร BOGO สำเร็จ','success');
            }
        },
        addFreeItem(p){
            this.currentBill.items.push({...p,name:p.name+' (ฟรี)',cartId:Date.now(),isFree:true,price:0,originalPrice:p.price,qty:1,type:'PRO',note:'ของแถม'});
            this.modalShow=false;this.addToast('เพิ่มของแถม: '+p.name,'success');
        },
        skipPromo(){this.addToCart(this._selectedProduct);this.modalShow=false},
        showPromoDetail(p){this.modalData={...p};this.modalType='promo-detail';this.modalShow=true},
        // Note
        openNote(item){this._noteItem=item;this.modalData={note:item.note||''};this.modalType='item-note';this.modalShow=true},
        saveNote(){if(this._noteItem){this._noteItem.note=this.modalData.note}this.modalShow=false;this.addToast('บันทึกหมายเหตุแล้ว','success')},
        setNote(n){this.modalData.note=n},
        // Discount
        openDiscount(){
            if(!this.currentBill.items.length){this.addToast('ยังไม่มีรายการ','warning');return}
            const cd=this.currentBill.customDiscount;
            this._dcType=cd?.type||'percent';this._dcValue=cd?.value||'';this._dcReason=cd?.reason||'';
            this.modalType='discount';this.modalShow=true;
        },
        applyDiscountAction(){
            const v=parseFloat(this._dcValue);if(!v||v<=0){this.addToast('กรุณาใส่จำนวน','error');return}
            this.currentBill.customDiscount={type:this._dcType,value:v,reason:this._dcReason||'ส่วนลดพิเศษ'};
            this.modalShow=false;this.addToast('ใช้ส่วนลดสำเร็จ','success');
        },
        removeDiscount(){this.currentBill.customDiscount=null;this.modalShow=false;this.addToast('ลบส่วนลดแล้ว','info')},
        // Member
        openMember(){
            if(this.currentBill.member){this.modalType='member-info';this.modalShow=true;return}
            this._memberQ='';this.modalType='member';this.modalShow=true;
        },
        selectMember(m){this.currentBill.member={...m};this.modalShow=false;this.addToast('เลือกสมาชิก: '+m.name,'success')},
        removeMember(){this.currentBill.member=null;this.modalShow=false;this.addToast('ยกเลิกสมาชิก','info')},
        // Privileges
        // Privilege Auth
        verifyPrivAuth(){
            const v=this.privAuthInput.trim();
            if(!v){this.addToast('กรุณากรอกรหัสหรือสแกนบัตร','warning');return}
            const employees=[
                {code:'EMP001',card:'9000001',name:'สมชาย ใจดี',dept:'ฝ่ายขาย',type:'employee'},
                {code:'EMP002',card:'9000002',name:'สมหญิง รักดี',dept:'ฝ่ายการตลาด',type:'employee'},
                {code:'EMP003',card:'9000003',name:'วิชัย สุขใจ',dept:'ฝ่ายปฏิบัติการ',type:'employee'},
                {code:'M001',card:'8000001',name:'คุณสมชาย ใจดี',dept:'Gold Member',type:'member'},
                {code:'M002',card:'8000002',name:'คุณสมหญิง รักดี',dept:'Silver Member',type:'member'},
                {code:'M003',card:'8000003',name:'คุณวิชัย สุขใจ',dept:'Platinum Member',type:'member'},
            ];
            const found=employees.find(e=>e.code.toLowerCase()===v.toLowerCase()||e.card===v);
            if(found){this.privAuth=true;this.privAuthUser=found;this.addToast('ยืนยันตัวตน: '+found.name,'success')}
            else{this.addToast('ไม่พบรหัสพนักงาน/สมาชิก','error')}
        },
        removePrivilege(id){
            const idx=this.appliedPrivileges.findIndex(a=>a.id===id);
            if(idx<0) return;
            const ap=this.appliedPrivileges[idx];
            const priv=this.employeePrivileges.find(p=>p.id===ap.id);
            if(priv) priv.balance+=ap.amount;
            this.appliedPrivileges.splice(idx,1);
            this.addToast('ลบสิทธิ์ '+ap.name+' แล้ว','info');
        },
        togglePrivType(id){
            const idx=this.selectedPrivTypes.indexOf(id);
            if(idx>=0) this.selectedPrivTypes.splice(idx,1);
            else this.selectedPrivTypes.push(id);
        },
        applyPrivileges(){
            if(!this.selectedPrivTypes.length){this.addToast('กรุณาเลือกสิทธิ์อย่างน้อย 1 รายการ','warning');return}
            let remaining=this.totals.subtotal-this.appliedPrivileges.reduce((s,p)=>s+p.amount,0);
            let count=0;
            for(const privId of this.selectedPrivTypes){
                if(this.appliedPrivileges.find(a=>a.id===privId)) continue;
                const priv=this.employeePrivileges.find(p=>p.id===privId);
                if(!priv||priv.balance<=0) continue;
                const amount=Math.min(priv.balance,remaining);
                if(amount<=0) continue;
                this.appliedPrivileges.push({id:privId,name:priv.name,amount});
                priv.balance-=amount;
                remaining-=amount;
                count++;
            }
            if(count) this.addToast('ใช้สิทธิ์สำเร็จ '+count+' รายการ','success');
            else this.addToast('สิทธิ์ที่เลือกถูกใช้ไปแล้วหรือหมดแล้ว','warning');
        },
        clearAllPrivileges(){
            this.appliedPrivileges.forEach(ap=>{
                const priv=this.employeePrivileges.find(p=>p.id===ap.id);
                if(priv)priv.balance+=ap.amount;
            });
            this.appliedPrivileges=[];
            this.addToast('ล้างสิทธิ์ทั้งหมดแล้ว','info');
        },
        isPrivilegeUsed(id){return!!this.appliedPrivileges.find(a=>a.id===id)},
        // Payment
        openPayment(){
            if(!this.totals.count){this.addToast('ไม่มีรายการ','warning');return}
            this.payOpen=true;this.paySection='privileges';this.payMethod='cash';this.cashStr='';this.payProcessing=false;this.payDone=false;
            this.privAuth=false;this.privAuthInput='';this.privAuthUser=null;this.selectedPrivTypes=[];
            this.payDcType=this.currentBill.customDiscount?.type||'percent';
            this.payDcValue=this.currentBill.customDiscount?.value||'';
            this.payDcReason=this.currentBill.customDiscount?.reason||'';
        },
        cashInput(k){if(k==='.'&&this.cashStr.includes('.'))return;this.cashStr+=k},
        processElectronic(method){
            this.payProcessing=true;this.payDone=false;
            setTimeout(()=>{this.payProcessing=false;this.payDone=true;setTimeout(()=>this.completePay(method),1000)},method==='card'?2000:2500);
        },
        completePay(method){
            const t=this.totals,b=this.currentBill;
            this.orderCounter++;
            const d=new Date(),ds=`${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
            const orderNo=`#${ds}${String(this.orderCounter).padStart(3,'0')}`;
            this.shiftData.totalSales+=t.grand;this.shiftData.billCount++;
            if(method==='cash')this.shiftData.cashSales+=t.grand;
            if(method==='card')this.shiftData.cardSales+=t.grand;
            if(method==='qr')this.shiftData.qrSales+=t.grand;
            if(this.autoPrint){
                this.buildReceipt({method,orderNo,totals:t,items:[...b.items],member:b.member,received:parseFloat(this.cashStr)||0,change:this.cashChange,timestamp:d});
                this.receiptOpen=true;
            }else this.addToast('ชำระสำเร็จ! '+orderNo,'success');
            this.payOpen=false;b.items=[];b.member=null;b.customDiscount=null;this.appliedPrivileges=[];
        },
        buildReceipt(data){
            const t=data.totals,mn={cash:'เงินสด',card:'บัตร',qr:'QR Code'};
            let r=`<div style="text-align:center"><h2 style="font-size:16px;margin:0">${this.settings.storeName}</h2><p style="font-size:11px;color:#666">${this.settings.storeAddress}</p><p style="font-size:10px;color:#999">Tax ID: ${this.settings.taxId}</p></div><hr>`;
            r+=`<div style="display:flex;justify-content:space-between;font-size:11px"><span>${data.orderNo}</span><span>${this.branches[this.selectedBranch].name}</span></div><div style="font-size:11px;color:#666">${data.timestamp.toLocaleString('th-TH')}</div><hr>`;
            data.items.forEach(i=>{r+=`<div style="display:flex;justify-content:space-between;font-size:12px;padding:2px 0"><span>${i.qty||1}x ${i.name}</span><span>฿${(i.price*(i.qty||1)).toFixed(2)}</span></div>`});
            r+=`<hr><div style="display:flex;justify-content:space-between;font-size:12px"><span>ยอดรวม</span><span>฿${t.subtotal.toFixed(2)}</span></div>`;
            if(t.totalDisc>0)r+=`<div style="display:flex;justify-content:space-between;font-size:12px;color:red"><span>ส่วนลด</span><span>-฿${t.totalDisc.toFixed(2)}</span></div>`;
            if(this.settings.scEnabled)r+=`<div style="display:flex;justify-content:space-between;font-size:12px"><span>SC ${this.settings.scRate}%</span><span>฿${t.scAmt.toFixed(2)}</span></div>`;
            if(this.settings.vatEnabled)r+=`<div style="display:flex;justify-content:space-between;font-size:12px"><span>VAT ${this.settings.vatRate}%</span><span>฿${t.vatAmt.toFixed(2)}</span></div>`;
            r+=`<hr><div style="display:flex;justify-content:space-between;font-size:14px;font-weight:700"><span>ชำระทั้งสิ้น</span><span>฿${t.grand.toFixed(2)}</span></div><hr>`;
            r+=`<div style="font-size:11px">ชำระด้วย: ${mn[data.method]}</div>`;
            if(data.method==='cash')r+=`<div style="font-size:11px">รับมา: ฿${data.received.toFixed(2)} | ทอน: ฿${data.change.toFixed(2)}</div>`;
            r+=`<hr><div style="text-align:center;font-size:11px;color:#999">ขอบคุณที่ใช้บริการ</div>`;
            this.receiptHtml=r;
        },
        // Shift
        openShiftModal(){this.modalType=this.shiftData.isOpen?'shift-close':'shift-open';this._shiftCash=1000;this._countCash=0;this.modalShow=true},
        doOpenShift(){
            this.shiftData={isOpen:true,openedAt:new Date(),openingCash:this._shiftCash,totalSales:0,cashSales:0,cardSales:0,qrSales:0,billCount:0,cancelCount:0};
            this.modalShow=false;this.addToast('เปิดกะสำเร็จ','success');
        },
        doCloseShift(){
            const exp=this.shiftData.openingCash+this.shiftData.cashSales,diff=this._countCash-exp;
            this.shiftData.isOpen=false;this.modalShow=false;
            if(Math.abs(diff)<1)this.addToast('ปิดกะสำเร็จ — เงินตรง!','success');
            else this.addToast(`ปิดกะ — ${diff>0?'เกิน':'ขาด'} ฿${Math.abs(diff).toFixed(2)}`,diff>0?'warning':'error');
        },
        // Cancel
        cancelBill(){
            if(!this.currentBill.items.length){this.addToast('ไม่มีรายการ','warning');return}
            this.modalType='cancel-bill';this.modalShow=true;
        },
        doCancelBill(){this.shiftData.cancelCount++;this.clearBill();this.modalShow=false;this.addToast('ยกเลิกบิลแล้ว','info')},
        // Settings
        openSettingsModal(){
            const s=this.settings;
            this._sName=s.storeName;this._sAddr=s.storeAddress;this._sTax=s.taxId;
            this._sVatRate=s.vatRate;this._sVatOn=s.vatEnabled;this._sScRate=s.scRate;this._sScOn=s.scEnabled;
            this.modalType='settings';this.modalShow=true;
        },
        saveSettings(){
            Object.assign(this.settings,{storeName:this._sName,storeAddress:this._sAddr,taxId:this._sTax,vatRate:this._sVatRate,vatEnabled:this._sVatOn,scRate:this._sScRate,scEnabled:this._sScOn});
            this.modalShow=false;this.addToast('บันทึกการตั้งค่าสำเร็จ','success');
        },
        // Logout
        doLogout(){this.loggedIn=false;this.pinCode='';this.modalShow=false;this.bills=[{id:1,items:[],member:null,customDiscount:null}];this.activeBill=0;this.billCounter=1;this.orderCounter=0},
        // AI
        async getAi(){
            if(!this.aiInput.trim())return;this.aiLoading=true;
            try{
                const res=await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({contents:[{parts:[{text:this.aiInput}]}],systemInstruction:{parts:[{text:'แนะนำเมนูจาก: '+products.map(p=>p.name).join(', ')+' ตามอารมณ์ ตอบสั้นเป็นไทย'}]}})}).then(r=>r.json());
                this.aiInput='✨ '+(res.candidates?.[0]?.content?.parts?.[0]?.text||'ลอง Café Latte ดูครับ ☕');
            }catch(e){this.aiInput='✨ ลอง Matcha Latte ดูครับ สดชื่น 🍵'}
            this.aiLoading=false;
        },
        // Toast
        addToast(msg,type='info'){
            const icons={success:'fa-check-circle',error:'fa-times-circle',warning:'fa-exclamation-triangle',info:'fa-info-circle'};
            const id=Date.now();this.toasts.push({id,msg,type,icon:icons[type]||icons.info});
            setTimeout(()=>{this.toasts=this.toasts.filter(t=>t.id!==id)},3000);
        },
        // Modal content generators
        buildModalBody(){
            const mt=this.modalType;
            if(mt==='promo-choice'&&this._selectedProduct){
                return this._selectedProduct.promos.map(pr=>`<div onclick="app.applyPromo('${pr.id}')" style="display:flex;align-items:center;padding:16px;border:2px solid #e2e8f0;border-radius:14px;margin-bottom:10px;cursor:pointer" onmouseenter="this.style.borderColor='#2563eb'" onmouseleave="this.style.borderColor='#e2e8f0'"><div style="width:50px;height:50px;background:#fef2f2;color:#ef4444;border-radius:12px;display:flex;align-items:center;justify-content:center;margin-right:14px;font-size:20px"><i class="fa fa-percentage"></i></div><div><div style="font-weight:700;font-size:16px">${pr.title}</div><div style="font-size:13px;color:#64748b;margin-top:2px">${pr.desc}</div></div></div>`).join('');
            }
            if(mt==='free-item'){
                return '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">'+products.map(p=>`<div onclick="app.addFreeItem(app.products.find(x=>x.id===${p.id}))" style="display:flex;align-items:center;padding:12px;border:2px solid #e2e8f0;border-radius:12px;cursor:pointer" onmouseenter="this.style.borderColor='#22c55e'" onmouseleave="this.style.borderColor='#e2e8f0'"><span style="font-size:26px;margin-right:8px">${p.image}</span><span style="font-size:13px;font-weight:600">${p.name}</span></div>`).join('')+'</div>';
            }
            if(mt==='promo-list'){
                return promoItems.map(p=>`<div onclick="app.showPromoDetail(app.promoItems.find(x=>x.id==='${p.id}'))" style="display:flex;align-items:center;padding:14px;border:2px solid #e2e8f0;border-radius:14px;margin-bottom:8px;cursor:pointer" onmouseenter="this.style.borderColor='#2563eb'" onmouseleave="this.style.borderColor='#e2e8f0'"><div style="width:44px;height:44px;border-radius:10px;display:flex;align-items:center;justify-content:center;margin-right:12px;font-size:18px;${p.highlight?'background:#ef4444;color:#fff':'background:#fef2f2;color:#ef4444'}"><i class="fa ${p.icon}"></i></div><div style="flex:1"><div style="font-weight:700;font-size:15px">${p.title}</div><div style="font-size:12px;color:#94a3b8">${p.desc}</div></div><i class="fa fa-chevron-right" style="color:#cbd5e1"></i></div>`).join('');
            }
            if(mt==='promo-detail'){
                const p=this.modalData;
                return `<div style="text-align:center;padding:20px 0"><div style="width:80px;height:80px;background:#fef2f2;color:#ef4444;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:32px"><i class="fa fa-gift"></i></div><h3 style="font-size:22px;font-weight:700;margin-bottom:8px">${p.title||''}</h3><p style="color:#64748b;font-size:15px">${p.desc||''}</p></div>`;
            }
            if(mt==='item-note'){
                const notes=['น้ำตาลน้อย','ไม่ใส่นม','เพิ่มช็อต','ร้อน','เย็น','ปั่น','ไม่ใส่น้ำแข็ง'];
                return `<p style="font-size:13px;color:#64748b;margin-bottom:10px">เพิ่มหมายเหตุ</p><input id="vnote" value="${this.modalData.note||''}" oninput="app.modalData.note=this.value" placeholder="เช่น น้ำตาลน้อย" style="width:100%;padding:12px;border:2px solid #e2e8f0;border-radius:10px;font-size:14px;outline:none"><div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:10px">${notes.map(n=>`<span onclick="app.setNote('${n}');document.getElementById('vnote').value='${n}'" style="padding:6px 12px;background:#f1f5f9;border-radius:6px;font-size:12px;cursor:pointer">${n}</span>`).join('')}</div>`;
            }
            if(mt==='discount'){
                return `<div style="display:flex;gap:8px;margin-bottom:14px"><button onclick="app._dcType='percent';this.style.borderColor='#2563eb';this.nextElementSibling.style.borderColor='#e2e8f0'" style="flex:1;padding:12px;border:2px solid ${this._dcType==='percent'?'#2563eb':'#e2e8f0'};border-radius:10px;font-weight:600;cursor:pointer">ส่วนลด %</button><button onclick="app._dcType='amount';this.style.borderColor='#2563eb';this.previousElementSibling.style.borderColor='#e2e8f0'" style="flex:1;padding:12px;border:2px solid ${this._dcType==='amount'?'#2563eb':'#e2e8f0'};border-radius:10px;font-weight:600;cursor:pointer">ส่วนลดบาท</button></div><input type="number" value="${this._dcValue}" oninput="app._dcValue=this.value" placeholder="จำนวน" style="width:100%;padding:12px;border:2px solid #e2e8f0;border-radius:10px;font-size:16px;outline:none;margin-bottom:10px"><input value="${this._dcReason}" oninput="app._dcReason=this.value" placeholder="เหตุผล" style="width:100%;padding:12px;border:2px solid #e2e8f0;border-radius:10px;font-size:14px;outline:none">`;
            }
            if(mt==='member'){
                return `<input placeholder="เบอร์โทร / ชื่อ" oninput="app._memberQ=this.value" style="width:100%;padding:12px;border:2px solid #e2e8f0;border-radius:10px;font-size:14px;outline:none;margin-bottom:14px">`+this.filteredMembersComputed;
            }
            if(mt==='member-info'){
                const m=this.currentBill.member;if(!m)return '';
                return `<div style="text-align:center;padding:16px"><div style="width:64px;height:64px;border-radius:50%;background:#eff6ff;color:#2563eb;display:flex;align-items:center;justify-content:center;margin:0 auto 12px;font-size:28px"><i class="fa fa-user"></i></div><h3 style="font-size:18px;font-weight:700">${m.name}</h3><p style="margin:8px 0;font-size:13px;color:#64748b">${m.level} • ${m.points} pts • ส่วนลด ${m.discount}%</p></div>`;
            }
            if(mt==='shift-open')return `<div style="text-align:center;padding:10px 0"><div style="width:64px;height:64px;border-radius:50%;background:#f0fdf4;color:#22c55e;display:flex;align-items:center;justify-content:center;margin:0 auto 14px;font-size:28px"><i class="fa fa-play-circle"></i></div><p style="font-size:15px;font-weight:600;margin-bottom:16px">กรอกเงินเปิดลิ้นชัก</p><input type="number" value="${this._shiftCash}" oninput="app._shiftCash=parseFloat(this.value)||0" style="width:100%;padding:14px;border:2px solid #e2e8f0;border-radius:10px;font-size:18px;text-align:center;outline:none;font-weight:700"></div>`;
            if(mt==='shift-close'){
                const s=this.shiftData,exp=s.openingCash+s.cashSales;
                return `<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px"><div style="background:#f0fdf4;padding:14px;border-radius:10px;text-align:center"><div style="font-size:11px;color:#64748b">เปิดกะเมื่อ</div><div style="font-size:14px;font-weight:700">${s.openedAt?.toLocaleTimeString('th-TH',{hour:'2-digit',minute:'2-digit'})}</div></div><div style="background:#eff6ff;padding:14px;border-radius:10px;text-align:center"><div style="font-size:11px;color:#64748b">จำนวนบิล</div><div style="font-size:14px;font-weight:700">${s.billCount}</div></div></div><div style="background:#f8fafc;padding:14px;border-radius:10px;margin-bottom:14px"><div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:6px"><span>💵 เงินสด</span><span style="font-weight:700">฿${s.cashSales.toFixed(2)}</span></div><div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:6px"><span>💳 บัตร</span><span style="font-weight:700">฿${s.cardSales.toFixed(2)}</span></div><div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:6px"><span>📱 QR</span><span style="font-weight:700">฿${s.qrSales.toFixed(2)}</span></div><div style="display:flex;justify-content:space-between;font-size:15px;font-weight:700;padding-top:8px;border-top:1px solid #e2e8f0;color:#2563eb"><span>ยอดรวม</span><span>฿${s.totalSales.toFixed(2)}</span></div></div><p style="font-size:13px;font-weight:600;margin-bottom:8px">คาดหวัง: ฿${exp.toFixed(2)}</p><input type="number" value="${this._countCash}" oninput="app._countCash=parseFloat(this.value)||0" placeholder="เงินนับจริง" style="width:100%;padding:14px;border:2px solid #e2e8f0;border-radius:10px;font-size:16px;text-align:center;outline:none;font-weight:700">`;
            }
            if(mt==='cancel-bill')return `<div style="text-align:center;padding:10px 0"><div style="width:64px;height:64px;border-radius:50%;background:#fef2f2;color:#ef4444;display:flex;align-items:center;justify-content:center;margin:0 auto 14px;font-size:28px"><i class="fa fa-exclamation-triangle"></i></div><p style="font-size:15px;font-weight:600;margin-bottom:16px">ยืนยันยกเลิกบิลนี้?</p><p style="font-size:13px;color:#94a3b8">${this.currentBill.items.length} รายการจะถูกลบทั้งหมด</p></div>`;
            if(mt==='settings')return `<div style="display:flex;flex-direction:column;gap:14px"><div><label style="font-size:12px;font-weight:600;color:#64748b;display:block;margin-bottom:4px">ชื่อร้าน</label><input value="${this._sName}" oninput="app._sName=this.value" style="width:100%;padding:10px;border:2px solid #e2e8f0;border-radius:8px;font-size:14px;outline:none"></div><div><label style="font-size:12px;font-weight:600;color:#64748b;display:block;margin-bottom:4px">ที่อยู่</label><textarea oninput="app._sAddr=this.value" style="width:100%;padding:10px;border:2px solid #e2e8f0;border-radius:8px;font-size:13px;outline:none;resize:none;height:60px">${this._sAddr}</textarea></div><div><label style="font-size:12px;font-weight:600;color:#64748b;display:block;margin-bottom:4px">เลขผู้เสียภาษี</label><input value="${this._sTax}" oninput="app._sTax=this.value" style="width:100%;padding:10px;border:2px solid #e2e8f0;border-radius:8px;font-size:14px;outline:none"></div><hr style="border-color:#e2e8f0"><div style="display:flex;align-items:center;justify-content:space-between"><span style="font-size:14px;font-weight:600">VAT</span><div style="display:flex;align-items:center;gap:8px"><input type="number" value="${this._sVatRate}" oninput="app._sVatRate=parseFloat(this.value)||0" style="width:60px;padding:6px;border:2px solid #e2e8f0;border-radius:6px;text-align:center;font-size:14px;outline:none"><span style="color:#64748b">%</span><div class="toggle-track ${this._sVatOn?'on':'off'}" onclick="app._sVatOn=!app._sVatOn;this.className='toggle-track '+(app._sVatOn?'on':'off')" style="cursor:pointer"><div class="toggle-knob"></div></div></div></div><div style="display:flex;align-items:center;justify-content:space-between"><span style="font-size:14px;font-weight:600">Service Charge</span><div style="display:flex;align-items:center;gap:8px"><input type="number" value="${this._sScRate}" oninput="app._sScRate=parseFloat(this.value)||0" style="width:60px;padding:6px;border:2px solid #e2e8f0;border-radius:6px;text-align:center;font-size:14px;outline:none"><span style="color:#64748b">%</span><div class="toggle-track ${this._sScOn?'on':'off'}" onclick="app._sScOn=!app._sScOn;this.className='toggle-track '+(app._sScOn?'on':'off')" style="cursor:pointer"><div class="toggle-knob"></div></div></div></div></div>`;
            if(mt==='logout')return '<div style="text-align:center;padding:20px 0"><div style="width:64px;height:64px;border-radius:50%;background:#fef2f2;color:#ef4444;display:flex;align-items:center;justify-content:center;margin:0 auto 14px;font-size:28px"><i class="fa fa-sign-out-alt"></i></div><p style="font-size:16px;font-weight:600">ออกจากระบบ?</p></div>';
            return '';
        },
        buildModalFoot(){
            const mt=this.modalType;
            const btn=(text,cls,fn)=>`<button class="mbtn ${cls}" onclick="app.${fn}">${text}</button>`;
            if(mt==='promo-choice')return btn('ไม่รับสิทธิ์','mbtn-secondary','skipPromo()');
            if(mt==='promo-list'||mt==='promo-detail')return btn('ตกลง','mbtn-primary','modalShow=false');
            if(mt==='item-note')return btn('ยกเลิก','mbtn-secondary','modalShow=false')+btn('บันทึก','mbtn-primary','saveNote()');
            if(mt==='discount'){
                let f=btn('ยกเลิก','mbtn-secondary','modalShow=false');
                if(this.currentBill.customDiscount)f+=btn('ลบส่วนลด','mbtn-secondary','removeDiscount()');
                return f+btn('ใช้ส่วนลด','mbtn-primary','applyDiscountAction()');
            }
            if(mt==='member')return btn('ปิด','mbtn-secondary','modalShow=false');
            if(mt==='member-info')return btn('ยกเลิกสมาชิก','mbtn-secondary','removeMember()')+btn('ตกลง','mbtn-primary','modalShow=false');
            if(mt==='shift-open')return btn('ยกเลิก','mbtn-secondary','modalShow=false')+btn('เปิดกะ','mbtn-primary','doOpenShift()');
            if(mt==='shift-close')return btn('ยกเลิก','mbtn-secondary','modalShow=false')+btn('ยืนยันปิดกะ','mbtn-danger','doCloseShift()');
            if(mt==='cancel-bill')return btn('ไม่ยกเลิก','mbtn-secondary','modalShow=false')+btn('ยืนยันยกเลิก','mbtn-danger','doCancelBill()');
            if(mt==='settings')return btn('ยกเลิก','mbtn-secondary','modalShow=false')+btn('บันทึก','mbtn-primary','saveSettings()');
            if(mt==='logout')return btn('ยกเลิก','mbtn-secondary','modalShow=false')+btn('ออกจากระบบ','mbtn-danger','doLogout()');
            return '';
        },
    },
    watch:{
        searchOpen(v){if(v)nextTick(()=>this.$refs.searchInput?.focus())},
        modalType(v){if(v==='settings'){const s=this.settings;this._sName=s.storeName;this._sAddr=s.storeAddress;this._sTax=s.taxId;this._sVatRate=s.vatRate;this._sVatOn=s.vatEnabled;this._sScRate=s.scRate;this._sScOn=s.scEnabled}}
    },
    mounted(){
        setInterval(()=>{this.clock=new Date().toLocaleTimeString('th-TH',{hour:'2-digit',minute:'2-digit'})},1000);
        this.clock=new Date().toLocaleTimeString('th-TH',{hour:'2-digit',minute:'2-digit'});
        window.app=this;
    }
}).mount('#app');
