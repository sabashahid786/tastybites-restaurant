/* Cart implementation used by Order.html
   - Cart persisted in localStorage under key 'tb_cart'
   - Menu item buttons should have class 'cart-btn' and data-id, and the card should include data-name and data-price
*/

const CART_KEY = 'tb_cart';

function getCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY)) || {};
    } catch (e) {
        return {};
    }
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    renderCartCount();
}

function addToCartById(id, name, price) {
    const cart = getCart();
    if (!cart[id]) {
        cart[id] = { id, name, price: Number(price), qty: 0 };
    }
    cart[id].qty += 1;
    saveCart(cart);
    renderCart();
}

function addToCartFromButton(e) {
    const btn = e.currentTarget;
    const id = btn.dataset.id;
    // fallback to parent card dataset
    const card = btn.closest('.menu-card');
    const name = card ? (card.dataset.name || card.querySelector('h3')?.innerText) : btn.dataset.name;
    const price = card ? (card.dataset.price || card.querySelector('.price')?.innerText.replace(/[^0-9.]/g,'')) : btn.dataset.price;
    addToCartById(id, name, price);
}

function changeQty(id, delta) {
    const cart = getCart();
    if (!cart[id]) return;
    cart[id].qty += delta;
    if (cart[id].qty <= 0) delete cart[id];
    saveCart(cart);
    renderCart();
}

function removeItem(id) {
    const cart = getCart();
    if (cart[id]) delete cart[id];
    saveCart(cart);
    renderCart();
}

function clearCart() {
    localStorage.removeItem(CART_KEY);
    renderCart();
}

function computeTotal(cart) {
    let total = 0;
    Object.values(cart).forEach(it => total += (it.price * (it.qty || 0)));
    return total;
}

function renderCart() {
    const cart = getCart();
    const itemsContainer = document.getElementById('cartItems');
    const emptyMsg = document.getElementById('emptyCartMsg');
    itemsContainer.innerHTML = '';
    const ids = Object.keys(cart);
    if (ids.length === 0) {
        emptyMsg.style.display = 'block';
    } else {
        emptyMsg.style.display = 'none';
        ids.forEach(id => {
            const it = cart[id];
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <div style="flex:1">
                    <div class="title">${escapeHtml(it.name)}</div>
                    <div style="font-size:13px; color:#666">${it.price}RS x ${it.qty} = ${it.price*it.qty}RS</div>
                </div>
                <div style="display:flex; flex-direction:column; align-items:flex-end">
                    <div class="qty-controls">
                        <button data-id="${id}" class="qty-decrease">-</button>
                        <span>${it.qty}</span>
                        <button data-id="${id}" class="qty-increase">+</button>
                    </div>
                    <button data-id="${id}" class="remove-item" style="margin-top:8px; background:transparent; border:none; color:#c00; cursor:pointer">Remove</button>
                </div>
            `;
            itemsContainer.appendChild(div);
        });
    }
    // totals
    const total = computeTotal(cart);
    // sidebar totals
    const tax = Math.round(total * 0.10);
    const delivery = total > 0 ? 100 : 0;
    const setIf = (id, val) => { const el = document.getElementById(id); if (el) el.innerText = val + 'RS'; };
    setIf('cartSubtotal', total);
    setIf('cartTax', tax);
    setIf('cartDelivery', delivery);
    setIf('cartTotal', total + tax + delivery);
    renderCartCount();

    // bind qty and remove
    document.querySelectorAll('.qty-increase').forEach(b=>b.addEventListener('click', ()=>changeQty(b.dataset.id, 1)));
    document.querySelectorAll('.qty-decrease').forEach(b=>b.addEventListener('click', ()=>changeQty(b.dataset.id, -1)));
    document.querySelectorAll('.remove-item').forEach(b=>b.addEventListener('click', ()=>removeItem(b.dataset.id)));
    // also update main cart view if present
    try { renderMainCart(); } catch(e) {}
}

function renderCartCount() {
    const cart = getCart();
    const count = Object.values(cart).reduce((s,it)=>s + (it.qty||0),0);
    ['cart-count','cart-count-top'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.innerText = count;
            // pulse briefly if available
            if (el.classList) {
                el.classList.add('pulse');
                setTimeout(()=>el.classList.remove('pulse'), 1200);
            }
        }
    });
}

// Render main order area (if present on the page)
function renderMainCart() {
    const cart = getCart();
    const ids = Object.keys(cart);
    const mainEmpty = document.getElementById('mainEmpty');
    const mainContent = document.getElementById('mainCartContent');
    const tbody = document.getElementById('mainCartItems');
    if (!tbody) return;
    tbody.innerHTML = '';
    if (ids.length === 0) {
        if (mainEmpty) mainEmpty.style.display = 'block';
        if (mainContent) mainContent.style.display = 'none';
        return;
    }
    if (mainEmpty) mainEmpty.style.display = 'none';
    if (mainContent) mainContent.style.display = 'block';

    ids.forEach(id => {
        const it = cart[id];
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${escapeHtml(it.name)}</td>
            <td>${it.price}RS</td>
            <td>
                <button data-id="${id}" class="qty-decrease">-</button>
                <input type="number" min="1" value="${it.qty}" data-id="${id}" class="qty-input">
                <button data-id="${id}" class="qty-increase">+</button>
            </td>
            <td>${it.price * it.qty}RS</td>
            <td><button data-id="${id}" class="remove-item" style="background:transparent;border:none;color:#c00;cursor:pointer">Remove</button></td>
        `;
        tbody.appendChild(tr);
    });

    // Bind controls inside main table
    document.querySelectorAll('#mainCartItems .qty-increase').forEach(b=>b.addEventListener('click', ()=>changeQty(b.dataset.id,1)));
    document.querySelectorAll('#mainCartItems .qty-decrease').forEach(b=>b.addEventListener('click', ()=>changeQty(b.dataset.id,-1)));
    document.querySelectorAll('#mainCartItems .remove-item').forEach(b=>b.addEventListener('click', ()=>removeItem(b.dataset.id)));
    document.querySelectorAll('#mainCartItems .qty-input').forEach(inp=>{
        inp.addEventListener('change', (e)=>{
            const id = e.target.dataset.id;
            let v = Number(e.target.value) || 1;
            const cart = getCart();
            if (!cart[id]) return;
            if (v <= 0) { removeItem(id); return; }
            cart[id].qty = v;
            saveCart(cart);
            renderCart();
        });
    });

    // Update main totals
    const subtotal = computeTotal(cart);
    const tax = Math.round(subtotal * 0.10);
    const delivery = subtotal > 0 ? 100 : 0; // flat delivery fee example
    const total = subtotal + tax + delivery;
    const setIf = (id, val) => { const el = document.getElementById(id); if (el) el.innerText = val + 'RS'; };
    setIf('mainSubtotal', subtotal);
    setIf('mainTax', tax);
    setIf('mainDelivery', delivery);
    setIf('mainTotal', total);
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, function (m) { return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[m]; });
}

// Cart sidebar open/close
function openCart() { document.getElementById('cartSidebar').classList.add('open'); document.getElementById('cartSidebar').setAttribute('aria-hidden','false'); }
function closeCart(){ document.getElementById('cartSidebar').classList.remove('open'); document.getElementById('cartSidebar').setAttribute('aria-hidden','true'); }

// Initialize on pages
document.addEventListener('DOMContentLoaded', () => {
    // Attach add-to-cart handlers
    document.querySelectorAll('.cart-btn').forEach(btn => btn.addEventListener('click', addToCartFromButton));

    document.getElementById('openCartBtn')?.addEventListener('click', openCart);
    document.getElementById('viewCartTop')?.addEventListener('click', openCart);
    document.getElementById('closeCartBtn')?.addEventListener('click', closeCart);
    document.getElementById('clearCartBtn')?.addEventListener('click', () => { clearCart(); });

    // Handle checkout form submission (sidebar)
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e)=>{
            e.preventDefault();
            const cart = getCart();
            if (Object.keys(cart).length === 0) { alert('Your cart is empty.'); return; }
            const name = document.getElementById('custName')?.value || '';
            const phone = document.getElementById('custPhone')?.value || '';
            const address = document.getElementById('custAddress')?.value || '';
            if (!name || !phone || !address) { alert('Please complete the checkout form.'); return; }
            // Demo confirmation
            alert(`Thanks ${name}! Your order has been placed. Total: ${document.getElementById('cartTotal')?.innerText || ''}`);
            clearCart();
            closeCart();
        });
    }

    // Show checkout form when user clicks Proceed to Checkout
    const showCheckoutBtn = document.getElementById('showCheckoutBtn');
    if (showCheckoutBtn) {
        showCheckoutBtn.addEventListener('click', ()=>{
            const wrapper = document.getElementById('checkoutWrapper');
            if (wrapper) wrapper.style.display = 'block';
            // focus first field
            setTimeout(()=>document.getElementById('custName')?.focus(), 120);
        });
    }

    // Place order button on main page
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', ()=>{
            const cart = getCart();
            if (Object.keys(cart).length === 0) { alert('Your cart is empty.'); return; }
            // Open sidebar to complete details
            openCart();
            // focus name field if present
            setTimeout(()=>document.getElementById('custName')?.focus(), 300);
        });
    }

    // render existing cart and main cart area
    renderCart();
    renderMainCart();
});

// Expose functions for potential other pages
window.addToCartById = addToCartById;
window.getCart = getCart;
window.clearCart = clearCart;


