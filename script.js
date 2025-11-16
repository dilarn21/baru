<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Keranjang Belanja</title>
<style>
  .cart-item {
    margin-bottom: 5px;
  }
  button {
    margin-left: 10px;
  }
</style>
</head>
<body>

<h2>Menu</h2>
<button onclick="addToCart('Nasi Goreng', 20000)">Tambah Nasi Goreng - Rp20.000</button>
<button onclick="addToCart('Mie Ayam', 15000)">Tambah Mie Ayam - Rp15.000</button>

<h2>Keranjang</h2>
<div id="cart-items">
  <p>Belum ada item di keranjang.</p>
</div>
<p id="total-price">Total: Rp0</p>

<h2>Data Pemesan</h2>
<label>Nama: <input type="text" id="nama"></label><br>
<label>No HP / Kelas: <input type="text" id="nohp"></label><br>
<button onclick="kirimPesanan()">Kirim Pesanan via WhatsApp</button>

<script>
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
  let teks = `📦 *PESANAN BARU KELOMPOK-1*\n\n👤 Nama: ${nama}\nKelas / No HP: ${nohp}\n\n🍴 *Daftar Pesanan:*\n`;

  cart.forEach((item, i) => {
   const subtotal = item.price * item.quantity;
const diskon = Math.floor(item.quantity / 3) * 1000;
const bayar = subtotal - diskon;

teks += `${i + 1}. ${item.name} x ${item.quantity} - Rp${bayar.toLocaleString()}`;
if (diskon > 0) teks += ` (Diskon: Rp${diskon.toLocaleString()})`;
teks += `\n`;

  // Hitung total + diskon beli 3 potong 1000
const total = cart.reduce((sum, item) => {
    const subtotal = item.price * item.quantity;
    const diskon = Math.floor(item.quantity / 3) * 1000; 
    return sum + (subtotal - diskon);
}, 0);

  const total = cart.reduce((sum, item) => {
    const subtotal = item.price * item.quantity;
    const diskon = Math.floor(item.quantity / 3) * 1000/n \n\nTerima kasih telah memesan di Kelompok kami 🙏\nBarang Ready Di Hari Selasa Ya;
    return sum + (subtotal - diskon);
}, 0);
\n\nTerima kasih telah memesan di Kelompok kami 🙏\nBarang Ready Di Hari Selasa Ya`;

  const url = `https://wa.me/${admin}?text=${encodeURIComponent(teks)}`;
  window.open(url, "_blank");

  cart = []; // Reset keranjang
  updateCart();
}
</script>

</body>
</html>
