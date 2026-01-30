const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTHCOEdU1r7N25GB3oVe-H6IqcowP9jyQQ10KvbgjD9P79fKLOTOTnL7FFoyM4YQXD3BWWNZOlcvjVQ/pub?output=csv';

async function loadProductsFromSheet() {
    try {
        const response = await fetch(SHEET_CSV_URL);
        const data = await response.text();
        const rows = data.split('\n').map(row => row.trim()).filter(row => row.length > 0);
        
        // Skip header row
        const products = rows.slice(1).map(row => {
            const v = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
            return {
                id: v[0]?.replace(/"/g, '').trim(),
                name: v[1]?.replace(/"/g, '').trim(),
                price: v[2]?.replace(/"/g, '').trim(),
                category: v[3]?.replace(/"/g, '').toLowerCase().trim(),
                img: v[4]?.replace(/"/g, '').trim()
            };
        });

        renderProducts(products);
        setupFilters();
    } catch (e) { 
        console.error("Sheet Load Error:", e); 
    }
}

function renderProducts(products) {
    const lists = {
        'phones': document.getElementById('product-list'),
        'accessories': document.getElementById('accessories-list'),
        'watches': document.getElementById('watches-list'),
        'featured': document.getElementById('featured-list')
    };

    // Clear lists first
    Object.values(lists).forEach(list => { if(list) list.innerHTML = ''; });

    // Track which categories actually have items
    const counts = { phones: 0, accessories: 0, watches: 0 };

    products.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${p.img}" alt="${p.name}" onerror="this.src='images/placeholder.jpg'">
            <h3>${p.name}</h3>
            <p>GH₵${p.price}</p>
            <div class="card-actions">
                <button class="btn-primary" onclick='openQuickView(${JSON.stringify(p)})'>Quick View</button>
                <button class="btn-primary" onclick='addToCart(${JSON.stringify(p)})'>Add to Cart</button>
            </div>
        `;
        
        if(lists[p.category]) {
            lists[p.category].appendChild(card);
            counts[p.category]++; // Increment count for this category
        }
        if(lists.featured) lists.featured.appendChild(card);
    });

    // AUTO-HIDE EMPTY SECTIONS
    // If a section has 0 items, hide the whole section (including the H2 header)
    if (document.getElementById('sec-phones')) {
        document.getElementById('sec-phones').style.display = counts.phones > 0 ? 'block' : 'none';
    }
    if (document.getElementById('sec-accessories')) {
        document.getElementById('sec-accessories').style.display = counts.accessories > 0 ? 'block' : 'none';
    }
    if (document.getElementById('sec-watches')) {
        document.getElementById('sec-watches').style.display = counts.watches > 0 ? 'block' : 'none';
    }
}
    ;

    // Clear lists first
    Object.values(lists).forEach(list => { if(list) list.innerHTML = ''; });

    products.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        // Note: Using your existing image sources from the sheet
        card.innerHTML = `
            <img src="${p.img}" alt="${p.name}" onerror="this.src='images/placeholder.jpg'">
            <h3>${p.name}</h3>
            <p>GH₵${p.price}</p>
            <div class="card-actions">
                <button class="btn-primary" onclick='openQuickView(${JSON.stringify(p)})'>Quick View</button>
                <button class="btn-primary" onclick='addToCart(${JSON.stringify(p)})'>Add to Cart</button>
            </div>
        `;
        
        // Put in category list
        if(lists[p.category]) lists[p.category].appendChild(card);
        // Put in featured list if on index.html
        if(lists.featured) lists.featured.appendChild(card);
    });


function setupFilters() {
    const btns = document.querySelectorAll('.filter-btn');
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update Active Class
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const selectedCat = btn.dataset.category;
            
            // Filter logic: Show/Hide whole sections based on category
            const sections = {
                'phones': document.getElementById('sec-phones'),
                'accessories': document.getElementById('sec-accessories'),
                'watches': document.getElementById('sec-watches')
            };

            Object.keys(sections).forEach(cat => {
                const section = sections[cat];
                if (!section) return; // Skip if section doesn't exist on page

                if (selectedCat === 'all' || selectedCat === cat) {
                    section.style.display = 'block';
                } else {
                    section.style.display = 'none';
                }
            });
        });
    });
}

// Ensure QuickView uses the modal from layout.js
window.openQuickView = function(p) {
    const modal = document.getElementById('quick-view-modal');
    if(!modal) return;
    
    document.getElementById('modal-img').src = p.img;
    document.getElementById('modal-name').textContent = p.name;
    document.getElementById('modal-price').textContent = `GH₵${p.price}`;
    
    const actionContainer = document.getElementById('modal-actions');
    if(actionContainer) {
        actionContainer.innerHTML = `<button class="btn-primary" style="width:100%" onclick='addToCart(${JSON.stringify(p)})'>Add to Cart</button>`;
    }
    
    modal.style.display = 'flex';
};

// Start the app
loadProductsFromSheet();