const headerHTML = `
<nav class="navbar">
    <div class="logo">Rockson <span>Enterprise</span></div>
    <ul class="nav-links">
        <li><a href="index.html">Home</a></li>
        <li><a href="shop.html">Shop</a></li>
        <li><a href="repairs.html">Repairs</a></li>
        <li><a href="about.html">About</a></li>
        <li><a href="contact.html">Contact</a></li>
    </ul>
    <div class="cart-icon" style="position:relative; cursor:pointer;" onclick="document.querySelector('.cart-dropdown').classList.toggle('show')">
        🛒 <span id="cart-count">0</span>
        <div class="cart-dropdown">
            <h4>Your Cart</h4>
            <ul id="cart-items-list" style="list-style:none; padding:0; max-height:200px; overflow-y:auto;"></ul>
            <p id="cart-total-display" style="font-weight:bold; border-top:1px solid #eee; padding-top:10px; margin-bottom:10px;">Total: GH₵0.00</p>
            
            <div style="display:flex; gap:10px;">
                <button class="btn-primary" style="flex:2;" onclick="checkoutWhatsApp()">Checkout</button>
                <button onclick="clearCart()" style="flex:1; background:#ff4444; color:white; border:none; border-radius:5px; cursor:pointer; font-size:0.7rem;">Clear</button>
            </div>
        </div>
    </div>
</nav>`;

// RESTORED: The missing footerHTML variable
const footerHTML = `
<div class="footer-content" style="text-align: center; padding: 40px 20px; width: 100%; background: #f9f9f9; border-top: 1px solid #eee; margin-top: 50px;">
    <p style="margin-bottom: 10px;">&copy; 2026 <strong>Rockson Enterprise</strong>. All rights reserved.</p>
    <p style="color: #666; font-size: 0.9rem;">Brewaniase, Oti Region | <a href="tel:+233540891165" style="color: inherit; text-decoration: none;">+233 540 891 165</a></p>
</div>`;

const modalHTML = `
<div id="quick-view-modal" class="modal" style="display:none; position:fixed; z-index:9999; left:0; top:0; width:100%; height:100%; background:rgba(0,0,0,0.9); align-items:center; justify-content:center;">
    <div class="modal-content" style="background:white; padding:20px; border-radius:10px; width:90%; max-width:400px; position:relative;">
        <span id="modal-close" style="position:absolute; top:10px; right:20px; font-size:30px; cursor:pointer;">&times;</span>
        <img id="modal-img" src="" style="width:100%; border-radius:10px;">
        <h2 id="modal-name"></h2>
        <p id="modal-price" style="color:green; font-weight:bold;"></p>
        <div id="modal-actions"></div>
    </div>
</div>`;

// --- CLEAR CART ---
window.clearCart = function() {
    if(confirm("Are you sure you want to empty your cart?")) {
        localStorage.removeItem('cart');
        updateCartUI();
        document.querySelector('.cart-dropdown').classList.remove('show');
    }
};

// --- ADD TO CART ---
window.addToCart = function(name, price, img) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, img, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
    document.querySelector('.cart-dropdown').classList.add('show');
};

// --- UPDATE UI ---
function updateCartUI() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const countEl = document.getElementById('cart-count');
    const listEl = document.getElementById('cart-items-list');
    const totalEl = document.getElementById('cart-total-display');
    
    if (countEl) countEl.innerText = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (listEl) {
        if(cart.length === 0) {
            listEl.innerHTML = '<li style="color:#888; text-align:center; padding:10px;">Your cart is empty</li>';
        } else {
            listEl.innerHTML = cart.map(item => `
                <li style="display:flex; justify-content:space-between; margin-bottom:10px; font-size:0.8rem; border-bottom:1px solid #f9f9f9; padding-bottom:5px;">
                    <span>${item.name} (x${item.quantity})</span>
                    <span>${item.price}</span>
                </li>
            `).join('');
        }
    }

    const total = cart.reduce((sum, item) => {
        const numPrice = parseFloat(item.price.replace(/[^\d.]/g, ''));
        return sum + (numPrice * (item.quantity || 1));
    }, 0);
    
    if (totalEl) totalEl.innerText = `Total: GH₵ ${total.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
}

// --- SERVICE BOOKING ---
window.bookService = function(serviceName) {
    const phone = "233540891165";
    const text = `*New Service Booking*%0A*Service:* ${serviceName}`;
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
};

// --- WHATSAPP CHECKOUT ---
window.checkoutWhatsApp = function() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if(cart.length === 0) return alert("Your cart is empty!");
    
    let text = "*New Order from Rockson Website*%0A%0A";
    cart.forEach(item => { text += `- ${item.name} (x${item.quantity})%0A`; });
    
    const totalText = document.getElementById('cart-total-display').innerText;
    text += `%0A*${totalText}*`;
    
    window.open(`https://wa.me/233540891165?text=${text}`, '_blank');
};

// --- DOM INJECTION ---
document.addEventListener("DOMContentLoaded", () => {
    // Header
    const header = document.querySelector('header');
    if(header) header.innerHTML = headerHTML;
    
    // Footer - This will now work because footerHTML is defined!
    const footer = document.querySelector('footer');
    if(footer) footer.innerHTML = footerHTML;
    
    // Modal
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = document.getElementById('quick-view-modal');
    if(modal) {
        document.getElementById('modal-close').onclick = () => modal.style.display = 'none';
    }
    
    updateCartUI();
});