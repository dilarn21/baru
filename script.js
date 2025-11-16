// Update tampilan keranjang dan total
function updateCart() {
    const cartContainer = document.getElementById('cart-items');
    cartContainer.innerHTML = '';

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Belum ada item di keranjang.</p>';
    } else {
        cart.forEach(item => {
            const div = document.createElement('div');
            div.classList.add('cart-item');
            const safeName = item.name.replace(/'/g, "\\'");
            div.innerHTML = `
                <span>${item.name} x ${item.quantity}</span>
                <button onclick="removeFromCart('${safeName}')">Remove</button>
            `;
            cartContainer.appendChild(div);
        });
    }

    // Hitung total + diskon
    let total = 0;

    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        const diskon = Math.floor(item.quantity / 3) * 1000; // diskon per 3 item
        total += subtotal - diskon;
    });

    document.getElementById('total-price').textContent = `Total: Rp${total.toLocaleString()}`;
}

// Kirim pesanan ke WhatsApp
function kirimPesanan() {
    const nama = document.getElementById("nama").value.trim();
    const nohp = document.getElementById("nohp").value.trim();

    if (cart.length === 0) {
        alert("Anda belum memesan apa pun!");
        return;
    }
    if (!nama || !nohp) {
        alert("Mohon isi nama dan nomor HP / kelas Anda.");
        return;
    }

    const admin = "6285878832973"; // Nomor WhatsApp admin

    let teks = `📦 *PESANAN BARU KELOMPOK-1*\n\n👤 Nama: ${nama}\n📱 Kelas / No HP: ${nohp}\n\n🍴 *Daftar Pesanan:*\n`;

    let total = 0;

    cart.forEach((item, i) => {
        const subtotal = item.price * item.quantity;
        const diskon = Math.floor(item.quantity / 3) * 1000;
        const bayar = subtotal - diskon;

        teks += `${i + 1}. ${item.name} x ${item.quantity} - Rp${bayar.toLocaleString()}`;
        if (diskon > 0) teks += ` (Diskon: Rp${diskon.toLocaleString()})`;
        teks += `\n`;

        total += bayar;
    });

    teks += `\n💰 *Total: Rp${total.toLocaleString()}*`;
    teks += `\n\nTerima kasih telah memesan 🙏\nBarang Ready Hari Selasa Ya`;

    const url = `https://wa.me/${admin}?text=${encodeURIComponent(teks)}`;
    window.open(url, "_blank");

    cart = [];
    updateCart();
}
