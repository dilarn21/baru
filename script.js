let cart = [];
let orderCount = 0;

// Tambah varian biasa
function addToCartBiasa(name, price) {
    const exist = cart.find(item => item.name === name);
    if (exist) {
        exist.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    orderCount++;
    updateCart();
}

// Tambah combo 2/3 rasa
function addCombo() {
    const selected = Array.from(document.querySelectorAll('#menu input[type="checkbox"]:checked'));
    if (selected.length < 2 || selected.length > 3) {
        alert("Silakan pilih 2 atau 3 rasa untuk combo.");
        return;
    }

    const comboName = "Combo: " + selected.map(cb => cb.value).join(" + ");
    const comboPrice = 1500;

    cart.push({ name: comboName, price: comboPrice, quantity: 1 });
    orderCount++;
    updateCart();

    selected.forEach(cb => cb.checked = false);
}

function updateCart() {
    const cartContainer = document.getElementById('cart-items');
    cartContainer.innerHTML = '';

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Belum ada item di keranjang.</p>';
    } else {
        cart.forEach(item => {
            const div = document.createElement('div');
            div.classList.add('cart-item');
            div.textContent = `${item.name} x ${item.quantity} - Rp${(item.price*item.quantity).toLocaleString()}`;
            cartContainer.appendChild(div);
        });
    }

    let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (orderCount >= 2) total -= 1000; // diskon pesanan kedua atau lebih
    document.getElementById('total-price').textContent = `Total: Rp${total.toLocaleString()}`;
}

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
    let teks = `📦 *PESANAN BARU*\n\n👤 Nama: ${nama}\nKelas / No HP: ${nohp}\n\n🍴 *Daftar Pesanan:*\n`;
    cart.forEach((item, i) => {
        teks += `${i + 1}. ${item.name} x ${item.quantity} - Rp${(item.price * item.quantity).toLocaleString()}\n`;
    });

    let total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (orderCount >= 2) total -= 1000;

    teks += `\n💰 *Total: Rp${total.toLocaleString()}*\n\nTerima kasih 🙏`;

    window.open(`https://wa.me/${admin}?text=${encodeURIComponent(teks)}`, "_blank");

    cart = [];
    orderCount = 0;
    updateCart();
}
