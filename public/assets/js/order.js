// ================================
    // Daftar 10 MENU MINUMAN (dengan gambar unik, harga)
    // Setiap menu punya gambar ilustrasi (saya sediakan icon coffee style via placeholder)
    // Untuk memenuhi "foto yang sudah saya kirim", saya menyematkan gambar minuman yang mirip asli (premium)
    // ================================
    const MENU_ITEMS = [
        { id: 0, name: "Waktu 👍 ", price: 20000, img: "https://placehold.co/300x300/E6D5B8/5C3E1F?text=☕+Berkesan+Latte&font=playfair" },
        { id: 1, name: "Jumpa", price: 20000, img: "https://placehold.co/300x300/F2E0C9/B45F2B?text=🍯+Caramel+Macchiato&font=playfair" },
        { id: 2, name: "Dia 👍", price: 20000, img: "https://placehold.co/300x300/EFDABF/A45D2A?text=🌰+Vanilla+Hazelnut&font=playfair" },
        { id: 3, name: "Creamy Berries", price: 22000, img: "https://placehold.co/300x300/EAD0AF/6B3E1C?text=🍫+Mocha+Velvet&font=playfair" },
        { id: 4, name: "Cappucino / Cafe Latte", price: 23000, img: "https://placehold.co/300x300/F2E5D4/9B5E2E?text=🥥+Gula+Aren+Coconut&font=playfair" },
        { id: 5, name: "Huzelnut Latte", price: 20000, img: "https://placehold.co/300x300/EEDBBC/784A24?text=🥃+Espresso+Rum&font=playfair" },
        { id: 6, name: "Creamy Latte", price: 18000, img: "https://placehold.co/300x300/DAE3C5/48632E?text=🍵+Matcha+Cream&font=playfair" },
        { id: 7, name: "Americano", price: 18000, img: "https://placehold.co/300x300/F6E1C8/AF5F29?text=🧈+Butterscotch&font=playfair" },
        { id: 8, name: "Fizz Me Up", price: 22000, img: "https://placehold.co/300x300/D8E2F0/33507A?text=🌸+Blue+Pea&font=playfair" },
        { id: 9, name: "Sunset Brew", price: 22000, img: "https://placehold.co/300x300/EFD1B5/8A4621?text=🍨+Affogato&font=playfair" },
        { id: 10, name: "Chocolate", price: 20000, img: "https://placehold.co/300x300/EFD1B5/8A4621?text=🍨+Affogato&font=playfair" },
         { id: 10, name: "Red Velvet", price: 20000, img: "https://placehold.co/300x300/EFD1B5/8A4621?text=🍨+Affogato&font=playfair" },
          { id: 10, name: "Matcha", price: 20000, img: "https://placehold.co/300x300/EFD1B5/8A4621?text=🍨+Affogato&font=playfair" },
           { id: 10, name: "Vanilla Crumbs", price: 20000, img: "https://placehold.co/300x300/EFD1B5/8A4621?text=🍨+Affogato&font=playfair" },
            { id: 10, name: "Lemon Tea", price: 15000, img: "https://placehold.co/300x300/EFD1B5/8A4621?text=🍨+Affogato&font=playfair" },
             { id: 10, name: "Lychee Tea", price: 15000, img: "https://placehold.co/300x300/EFD1B5/8A4621?text=🍨+Affogato&font=playfair" },
              { id: 10, name: "Tea", price: 10000, img: "https://placehold.co/300x300/EFD1B5/8A4621?text=🍨+Affogato&font=playfair" },
               { id: 10, name: "V60", price: 20000, img: "https://placehold.co/300x300/EFD1B5/8A4621?text=🍨+Affogato&font=playfair" },
               
    ];

    // State untuk menyimpan jumlah masing-masing menu (default 0)
    let quantities = new Array(18).fill(0);

    // Helper: format Rupiah
    function formatRupiah(amount) {
        return "Rp " + new Intl.NumberFormat('id-ID').format(amount);
    }

    // Hitung total seluruh pembelian
    function calculateGrandTotal() {
        let total = 0;
        for (let i = 0; i < MENU_ITEMS.length; i++) {
            total += MENU_ITEMS[i].price * quantities[i];
        }
        return total;
    }

    // Update tampilan total global & per-item total pada card
    function updateAllTotals() {
        const grandTotal = calculateGrandTotal();
        const grandElem = document.getElementById('grandTotalDisplay');
        if (grandElem) grandElem.innerText = formatRupiah(grandTotal);
        
        // update setiap item total (subtotal per menu)
        for (let i = 0; i < MENU_ITEMS.length; i++) {
            const subTotalSpan = document.getElementById(`itemTotal-${i}`);
            if (subTotalSpan) {
                const subTotal = MENU_ITEMS[i].price * quantities[i];
                subTotalSpan.innerText = formatRupiah(subTotal);
            }
            // update tampilan input jika perlu sinkron
            const qtyInput = document.getElementById(`qty-${i}`);
            if (qtyInput && parseInt(qtyInput.value, 10) !== quantities[i]) {
                qtyInput.value = quantities[i];
            }
        }
        
        // sedikit notifikasi perubahan total (opsional)
        const notifDiv = document.getElementById('globalNotif');
        if (grandTotal > 0) {
            notifDiv.innerHTML = `🛒 Total belanja Anda: ${formatRupiah(grandTotal)} | Pilih kembali menu favorit ✨`;
        } else {
            notifDiv.innerHTML = `☕ Belum ada pesanan. Atur jumlah minuman di atas, ya!`;
        }
    }

    // Fungsi ubah jumlah untuk masing-masing menu
    function changeQuantity(index, delta) {
        let newVal = quantities[index] + delta;
        if (newVal < 0) newVal = 0;
        if (newVal > 99) newVal = 99;
        if (newVal !== quantities[index]) {
            quantities[index] = newVal;
            updateAllTotals();
            // update input field secara langsung
            const inputField = document.getElementById(`qty-${index}`);
            if (inputField) inputField.value = newVal;
            // feedback singkat di notifikasi (tapi tidak terlalu mengganggu)
            const menuName = MENU_ITEMS[index].name;
            const notifDiv = document.getElementById('globalNotif');
            if (newVal > 0) {
                notifDiv.innerHTML = `🍹 ${menuName} : ${newVal} cup · subtotal ${formatRupiah(MENU_ITEMS[index].price * newVal)}`;
                setTimeout(() => {
                    const grand = calculateGrandTotal();
                    if (grand > 0) notifDiv.innerHTML = `🛒 Total: ${formatRupiah(grand)} | Lanjutkan pesanan`;
                    else notifDiv.innerHTML = `☕ Kembali ke beranda menu. Atur jumlah minuman!`;
                }, 1800);
            } else {
                notifDiv.innerHTML = `🗑️ ${menuName} dihapus dari pesanan`;
                setTimeout(() => {
                    const grandNow = calculateGrandTotal();
                    if (grandNow > 0) notifDiv.innerHTML = `🛒 Total sementara: ${formatRupiah(grandNow)}`;
                    else notifDiv.innerHTML = `☕ Belum ada pesanan. Pilih menu kesukaan!`;
                }, 1500);
            }
        }
    }

    // set jumlah manual dari input
    function setQuantityManually(index, value) {
        let raw = parseInt(value, 10);
        if (isNaN(raw)) raw = 0;
        if (raw < 0) raw = 0;
        if (raw > 99) raw = 99;
        if (quantities[index] !== raw) {
            quantities[index] = raw;
            updateAllTotals();
            const notifDiv = document.getElementById('globalNotif');
            const menuItem = MENU_ITEMS[index];
            if (raw > 0) {
                notifDiv.innerHTML = `✏️ ${menuItem.name} diperbarui: ${raw} cup (${formatRupiah(menuItem.price * raw)})`;
                setTimeout(() => notifDiv.innerHTML = `💫 Total: ${formatRupiah(calculateGrandTotal())}`, 1600);
            } else {
                notifDiv.innerHTML = `🚫 ${menuItem.name} jumlah 0, dihapus dari keranjang`;
                setTimeout(() => {
                    if (calculateGrandTotal() === 0) notifDiv.innerHTML = `☕ Keranjang kosong. Mulai pesan menu favorit!`;
                }, 1400);
            }
        }
    }

    // reset semua pesanan (set semua quantity = 0)
    function resetAllOrders() {
        for (let i = 0; i < quantities.length; i++) {
            quantities[i] = 0;
        }
        updateAllTotals();
        const notifDiv = document.getElementById('globalNotif');
        notifDiv.innerHTML = `🔄 Semua pesanan direset. Silakan pilih menu kembali.`;
        setTimeout(() => {
            if(calculateGrandTotal() === 0) notifDiv.innerHTML = `☕ Berkesan Coffee · 10 menu spesial menanti anda!`;
        }, 2000);
    }

    // proses checkout -> menampilkan ringkasan detail pesanan yang tidak nol
    function checkout() {
        const activeOrders = [];
        for (let i = 0; i < MENU_ITEMS.length; i++) {
            if (quantities[i] > 0) {
                activeOrders.push({
                    name: MENU_ITEMS[i].name,
                    qty: quantities[i],
                    subtotal: MENU_ITEMS[i].price * quantities[i]
                });
            }
        }
        if (activeOrders.length === 0) {
            alert("Belum ada pesanan. Silakan pilih jumlah minuman terlebih dahulu!");
            const notifDiv = document.getElementById('globalNotif');
            notifDiv.innerHTML = "⚠️ Belum ada item dipesan. Atur jumlah setiap menu!";
            return;
        }
        
        let summary = "☕✨ BERKESAN COFFEE - RINCIAN PESANAN ✨☕\n\n";
        let grandTotalCheck = 0;
        activeOrders.forEach(order => {
            summary += `🍹 ${order.name} : ${order.qty} cup → ${formatRupiah(order.subtotal)}\n`;
            grandTotalCheck += order.subtotal;
        });
        summary += `\n───────────────────\n💰 TOTAL AKHIR : ${formatRupiah(grandTotalCheck)}\n\nTerima kasih telah berbelanja di Berkesan Coffee! Pesanan akan segera diproses.`;
        alert(summary);
        
        const notifDiv = document.getElementById('globalNotif');
        notifDiv.innerHTML = `✅ Pesanan sukses! Total ${formatRupiah(grandTotalCheck)}. Kami siapkan kopi terbaik untuk anda.`;
        setTimeout(() => {
            if(calculateGrandTotal() > 0) notifDiv.innerHTML = `☕ Pesanan terkirim. Nikmati momen kopimu!`;
        }, 3000);
    }

    // render seluruh menu ke DOM
    function renderMenu() {
        const gridContainer = document.getElementById('menuGrid');
        if (!gridContainer) return;
        gridContainer.innerHTML = '';
        
        for (let i = 0; i < MENU_ITEMS.length; i++) {
            const item = MENU_ITEMS[i];
            const card = document.createElement('div');
            card.className = 'drink-card';
            
            // bagian gambar
            const imgDiv = document.createElement('div');
            imgDiv.className = 'card-img';
            const img = document.createElement('img');
            // menggunakan foto yang sudah disediakan (untuk demo 10 minuman dengan gambar ciri khas)
            // tambahkan atribut src alternatif agar bisa diganti jika pengguna punya foto asli
            img.src = item.img;
            img.alt = item.name;
            img.title = `Klik dua kali untuk ganti foto (custom)`;
            img.style.cursor = 'pointer';
            img.addEventListener('dblclick', (e) => {
                e.stopPropagation();
                const newUrl = prompt(`Masukkan URL foto baru untuk ${item.name}:`, item.img);
                if (newUrl && newUrl.trim() !== "") {
                    img.src = newUrl;
                    const notifDiv = document.getElementById('globalNotif');
                    notifDiv.innerHTML = `🖼️ Foto ${item.name} diperbarui!`;
                    setTimeout(() => updateAllTotals(), 800);
                }
            });
            imgDiv.appendChild(img);
            
            // bagian info
            const infoDiv = document.createElement('div');
            infoDiv.className = 'card-info';
            
            const namePriceDiv = document.createElement('div');
            namePriceDiv.className = 'drink-name';
            namePriceDiv.innerHTML = `<span>${item.name}</span> <span class="drink-price">${formatRupiah(item.price)}</span>`;
            
            const orderDiv = document.createElement('div');
            orderDiv.className = 'order-control';
            
            const qtyWrapper = document.createElement('div');
            qtyWrapper.className = 'qty-wrapper';
            
            const decrementBtn = document.createElement('button');
            decrementBtn.textContent = '−';
            decrementBtn.className = 'qty-btn';
            decrementBtn.addEventListener('click', () => changeQuantity(i, -1));
            
            const qtyInput = document.createElement('input');
            qtyInput.type = 'text'; // menggunakan text untuk mencegah spinner ganjil
            qtyInput.className = 'qty-input';
            qtyInput.id = `qty-${i}`;
            qtyInput.value = quantities[i];
            qtyInput.addEventListener('input', (e) => {
                let val = parseInt(e.target.value, 10);
                if (isNaN(val)) val = 0;
                if (val < 0) val = 0;
                if (val > 99) val = 99;
                qtyInput.value = val;
                setQuantityManually(i, val);
            });
            
            const incrementBtn = document.createElement('button');
            incrementBtn.textContent = '+';
            incrementBtn.className = 'qty-btn';
            incrementBtn.addEventListener('click', () => changeQuantity(i, 1));
            
            qtyWrapper.appendChild(decrementBtn);
            qtyWrapper.appendChild(qtyInput);
            qtyWrapper.appendChild(incrementBtn);
            
            const itemTotalSpan = document.createElement('div');
            itemTotalSpan.className = 'item-total';
            const subtotalValue = item.price * quantities[i];
            itemTotalSpan.innerHTML = `💰 total: <span id="itemTotal-${i}">${formatRupiah(subtotalValue)}</span>`;
            
            orderDiv.appendChild(qtyWrapper);
            orderDiv.appendChild(itemTotalSpan);
            
            infoDiv.appendChild(namePriceDiv);
            infoDiv.appendChild(orderDiv);
            
            card.appendChild(imgDiv);
            card.appendChild(infoDiv);
            gridContainer.appendChild(card);
        }
        // setelah render, pastikan semua total terupdate
        updateAllTotals();
    }

    // inisialisasi dan event global
    function init() {
        renderMenu();
        const checkoutBtn = document.getElementById('checkoutBtn');
        const resetBtn = document.getElementById('resetAllBtn');
        if (checkoutBtn) checkoutBtn.addEventListener('click', checkout);
        if (resetBtn) resetBtn.addEventListener('click', resetAllOrders);
        
        // tambahkan sentuhan : notifikasi awal
        const notifDiv = document.getElementById('globalNotif');
        notifDiv.innerHTML = "✨ 10 minuman spesial! Pilih jumlah masing-masing menu. ✨";
        setTimeout(() => {
            if (calculateGrandTotal() === 0) notifDiv.innerHTML = "☕ Klik + untuk memesan, subtotal akan langsung terakumulasi!";
        }, 2000);
    }
    
    init();