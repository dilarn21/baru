let cart = []; // keranjang utama

// Tambah item ke keranjang
function addToCart(name, price) {
    let existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    updateCart();
}

// Hapus item dari keranjang
function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    updateCart();
}

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
            div.innerHTML = `<span>${item.name} x ${item.quantity}</span>
                             <button onclick="removeFromCart('${safeName}')">Remove</button>`;
            cartContainer.appendChild(div);
        });
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
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
    let teks = `📦 *PESANAN BARU*\n\n👤 Nama: ${nama}\nKelas / No HP: ${nohp}\n\n🍴 *Daftar Pesanan:*\n`;

    cart.forEach((item, i) => {
        teks += `${i + 1}. ${item.name} x ${item.quantity} - Rp${(item.price * item.quantity).toLocaleString()}\n`;
    });

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    teks += `\n💰 *Total: Rp${total.toLocaleString()}*\n\nTerima kasih telah memesan 🙏`;

    const url = `https://wa.me/${admin}?text=${encodeURIComponent(teks)}`;
    window.open(url, "_blank");

    cart = []; // Reset keranjang
    updateCart();
}
