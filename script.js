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

// Hitung total + diskon
function calculateTotal() {
    let subtotal = 0;
    let totalDiskon = 0;

    cart.forEach(item => {
        const itemSubtotal = item.price * item.quantity;
        subtotal += itemSubtotal;

        // Diskon 1000 per 3 item (kelipatan)
        const diskonItem = Math.floor(item.quantity / 3) * 1000;
        totalDiskon += diskonItem;
    });

    return { subtotal, totalDiskon, total: subtotal - totalDiskon };
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

            div.innerHTML = `
                <span>${item.name} x ${item.quantity}</span>
                <button onclick="removeFromCart('${safeName}')">Remove</button>
            `;
            cartContainer.appendChild(div);
        });
    }

    const { subtotal, totalDiskon, total } = calculateTotal();

    document.getElementById('total-price').innerHTML = `
        Subtotal: Rp${subtotal.toLocaleString()}<br>
        Diskon: -Rp${totalDiskon.toLocaleString()}<br>
        <strong>Total: Rp${total.toLocaleString()}</strong>
    `;
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

    const admin = "6285878832973";

    const { subtotal, totalDiskon, total } = calculateTotal();

    let teks = `📦 *PESANAN BARU*\n
👤 Nama: ${nama}
📱 Kelas / No HP: ${nohp}

🍴 *Daftar Pesanan:*\n`;

    cart.forEach((item, i) => {
        teks += `${i + 1}. ${item.name} x ${item.quantity} - Rp${(item.price * item.quantity).toLocaleString()}\n`;
    });

    teks += `
🧮 Subtotal: Rp${subtotal.toLocaleString()}
🎁 Diskon: -Rp${totalDiskon.toLocaleString()}
💰 *Total Akhir: Rp${total.toLocaleString()}*`;

    const url = `https://wa.me/${admin}?text=${encodeURIComponent(teks)}`;
    window.open(url, "_blank");

    cart = [];
    updateCart();
}
