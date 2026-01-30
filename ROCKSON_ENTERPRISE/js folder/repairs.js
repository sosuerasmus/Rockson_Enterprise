function bookService(service) {
    const phone = "233540891165";
    const text = `Hello Rockson Enterprise,%0AI want to book: ${service}`;
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
}

// Filter Logic
const filterBtns = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.product-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.category;
        cards.forEach(card => {
            card.style.display = (cat === 'all' || card.dataset.category === cat) ? 'block' : 'none';
        });
    });
});