function addMixToCart() {
    const selected = Array.from(document.querySelectorAll('.mix-item:checked'));

    if (selected.length !== 2) {
        alert("Silakan pilih tepat 2 varian!");
        return;
    }

    // Buat nama campuran
    const names = selected.map(item => item.value).join(" + ");
    const price = selected.reduce((sum, item) => sum + parseInt(item.dataset.price), 0);

    // Cek jika campuran sudah ada di keranjang
    let existingItem = cart.find(item => item.name === names);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name: names, price: price, quantity: 1 });
    }

    // Reset checkbox
    selected.forEach(item => item.checked = false);

    updateCart();
}
