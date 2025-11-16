let cart = []; // keranjang utama
let selectedMix = null;

// Tambah item ke keranjang dengan tipe (biasa/campuran)
function addToCart(name, price, type) {
    // Cek apakah item sudah ada di keranjang
    let existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1, type });
    }
    updateCart();
}

// Hapus item dari keranjang
function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    updateCart();
}

// Hitung diskon
function calculateDiscount() {
    let discount = 0;
    let discountInfo = [];
    
    // Hitung item biasa (3 pcs diskon 1000)
    const biasaItems = cart.filter(item => item.type === 'biasa');
    let totalBiasaQuantity = biasaItems.reduce((sum, item) => sum + item.quantity, 0);
    
    if (totalBiasaQuantity >= 3) {
        const discountCount = Math.floor(totalBiasaQuantity / 3);
        discount += discountCount * 1000;
        discountInfo.push(`Diskon varian biasa: -Rp${(discountCount * 1000).toLocaleString()}`);
    }
    
    // Hitung item campuran (2 pcs diskon 1000)
    const campuranItems = cart.filter(item => item.type === 'campuran' || item.name.includes('Mix'));
    let totalCampuranQuantity = campuranItems.reduce((sum, item) => sum + item.quantity, 0);
    
    if (totalCampuranQuantity >= 2) {
        const discountCount = Math.floor(totalCampuranQuantity / 2);
        discount += discountCount * 1000;
        discountInfo.push(`Diskon varian campuran: -Rp${(discountCount * 1000).toLocaleString()}`);
    }
    
    return { discount, discountInfo };
}

// Update tampilan keranjang dan total
function updateCart() {
    const cartContainer = document.getElementById('cart-items');
    const discountContainer = document.getElementById('discount-info');
    cartContainer.innerHTML = '';

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Belum ada item di keranjang.</p>';
        discountContainer.innerHTML = '';
        document.getElementById('total-price').textContent = 'Total: Rp0';
        return;
    }

    // Tampilkan item di keranjang
    cart.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('cart-item');
        const safeName = item.name.replace(/'/g, "\\'");
        div.innerHTML = `
            <span>${item.name} x ${item.quantity}</span>
            <button onclick="removeFromCart('${safeName}')">Hapus</button>
        `;
        cartContainer.appendChild(div);
    });

    // Hitung total dan diskon
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const { discount, discountInfo } = calculateDiscount();
    const total = subtotal - discount;

    // Tampilkan info diskon
    discountContainer.innerHTML = '';
    if (discount > 0) {
        discountInfo.forEach(info => {
            const discountElement = document.createElement('div');
            discountElement.classList.add('discount-item');
            discountElement.textContent = info;
            discountContainer.appendChild(discountElement);
        });
        
        const subtotalElement = document.createElement('div');
        subtotalElement.classList.add('discount-item');
        subtotalElement.textContent = `Subtotal: Rp${subtotal.toLocaleString()}`;
        discountContainer.appendChild(subtotalElement);
        
        const discountTotalElement = document.createElement('div');
        discountTotalElement.classList.add('discount-item');
        discountTotalElement.textContent = `Total Diskon: -Rp${discount.toLocaleString()}`;
        discountContainer.appendChild(discountTotalElement);
    }

    document.getElementById('total-price').textContent = `Total: Rp${total.toLocaleString()}`;
}

// Fungsi untuk menampilkan modal pilihan varian mix
function showMixOptions() {
    document.getElementById('mixModal').style.display = 'flex';
    selectedMix = null;
    
    // Reset pilihan
    const options = document.querySelectorAll('.modal-option');
    options.forEach(option => {
        option.classList.remove('selected');
    });
}

// Fungsi untuk menutup modal
function closeMixModal() {
    document.getElementById('mixModal').style.display = 'none';
}

// Fungsi untuk memilih opsi mix
function selectMixOption(mixName) {
    selectedMix = mixName;
    
    // Update tampilan pilihan
    const options = document.querySelectorAll('.modal-option');
    options.forEach(option => {
        if (option.querySelector('span').textContent === mixName) {
            option.classList.add('selected');
        } else {
            option.classList.remove('selected');
        }
    });
}

// Fungsi untuk menambahkan mix yang dipilih ke keranjang
function addSelectedMixToCart() {
    if (selectedMix) {
        addToCart(`Varian Mix: ${selectedMix}`, 5000, 'campuran');
        closeMixModal();
    } else {
        alert('Silakan pilih varian mix terlebih dahulu');
    }
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

    // Hitung total dengan diskon
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const { discount } = calculateDiscount();
    const total = subtotal - discount;

    let teks = `📦 *PESANAN BARU LUMPIA CORNER*\n\n`;
    teks += `👤 Nama: ${nama}\n`;
    teks += `📞 Kelas / No HP: ${nohp}\n\n`;
    teks += `🍴 *Daftar Pesanan:*\n`;
    
    cart.forEach((item, i) => {
        teks += `${i + 1}. ${item.name} x ${item.quantity} - Rp${(item.price * item.quantity).toLocaleString()}\n`;
    });

    teks += `\n💰 *Subtotal: Rp${subtotal.toLocaleString()}*\n`;
    
    if (discount > 0) {
        teks += `🎁 *Diskon: -Rp${discount.toLocaleString()}*\n`;
    }
    
    teks += `💵 *Total: Rp${total.toLocaleString()}*\n\n`;
    teks += `Terima kasih telah memesan di Lumpia Corner 🙏\n`;
    teks += `\n⚠️ Barang ready di hari Selasa ya 🙏`;

    const url = `https://wa.me/${admin}?text=${encodeURIComponent(teks)}`;
    window.open(url, "_blank");

    // Reset keranjang setelah pesan dikirim
    cart = [];
    updateCart();
    document.getElementById("nama").value = "";
    document.getElementById("nohp").value = "";
}

// Tutup modal jika klik di luar konten modal
window.onclick = function(event) {
    const modal = document.getElementById('mixModal');
    if (event.target === modal) {
        closeMixModal();
    }
}
