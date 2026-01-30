let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

window.addToCart = function(product) {
    const item = cartItems.find(i => i.name === product.name); // Using name as unique key
    if (item) { item.quantity += 1; } 
    else { cartItems.push({ ...product, quantity: 1 }); }
    
    localStorage.setItem('cart', JSON.stringify(cartItems));
    updateCartUI();
    showToast(`${product.name} added to cart!`);
};

window.updateCartUI = function() {
    const list = document.getElementById('cart-items-list');
    const count = document.getElementById('cart-count');
    const totalDisp = document.getElementById('cart-total-display');
    
    if(!count) return;

    let totalItems = 0;
    let totalPrice = 0;
    if(list) list.innerHTML = "";

    cartItems.forEach(item => {
        totalItems += item.quantity;
        totalPrice += (parseFloat(item.price) || 0) * item.quantity;
        if(list) {
            const li = document.createElement('li');
            li.style.padding = "5px 0";
            li.innerHTML = `${item.name} (x${item.quantity}) - GH₵${item.price}`;
            list.appendChild(li);
        }
    });

    count.textContent = totalItems;
    if(totalDisp) totalDisp.textContent = `Total: GH₵${totalPrice.toFixed(2)}`;
};

function showToast(msg) {
    const toast = document.getElementById('toast');
    if(!toast) return;
    toast.textContent = msg;
    toast.style.display = "block";
    toast.style.opacity = '1';
    setTimeout(() => { toast.style.opacity = '0'; }, 3000);
}

document.addEventListener('DOMContentLoaded', updateCartUI);