// GANTI DENGAN URL WEB APP GOOGLE APPS SCRIPT ANDA SETELAH DEPLOYMENT
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz-qpPAbWhwNBa-4S5zncSQgMuq1GPaVL5auaSPBH8D20W0JvlMlu-XYEYJHIybPx4vNA/exec"; // <-- WAJIB GANTI INI

// Fungsi untuk menampilkan loading indicator
function showLoading() {
    const loadingDiv = document.getElementById('loading');
    if (loadingDiv) loadingDiv.classList.remove('hidden');
}

// Fungsi untuk menyembunyikan loading indicator
function hideLoading() {
    const loadingDiv = document.getElementById('loading');
    if (loadingDiv) loadingDiv.classList.add('hidden');
}

// Fungsi untuk deteksi mobile (sederhana berdasarkan lebar layar)
function isMobileView() {
    return window.innerWidth <= 768;
}

// Fungsi untuk setup tampilan berdasarkan device (desktop/mobile)
function setupDeviceUI() {
    const desktopNav = document.querySelector('.desktop-nav');
    const mobileNav = document.querySelector('.mobile-bottom-nav');
    const body = document.body;

    if (isMobileView()) {
        if (desktopNav) desktopNav.style.display = 'none';
        if (mobileNav) mobileNav.style.display = 'flex';
        // Tambah padding bawah ke body untuk mobile nav, kecuali di halaman login
        if (!document.body.classList.contains('login-page-body')) {
            body.style.paddingBottom = (mobileNav?.offsetHeight || 65) + 'px';
        }
    } else {
        if (desktopNav) desktopNav.style.display = 'block';
        if (mobileNav) mobileNav.style.display = 'none';
        body.style.paddingBottom = '0';
    }
}


// Fungsi untuk cek login dan setup halaman
function checkLoginAndSetup() {
    const guruId = localStorage.getItem('guruId');
    const namaGuru = localStorage.getItem('namaGuru');
    const currentPath = window.location.pathname.split("/").pop() || 'index.html';
    const isLoginPage = currentPath === 'login.html' || currentPath === 'index.html';

    // Tambahkan kelas khusus ke body jika ini halaman login
    if (isLoginPage) {
        document.body.classList.add('login-page-body');
        // Pastikan body tidak mengikuti layout grid untuk halaman login
        document.body.style.display = 'flex';
        document.body.style.flexDirection = 'column';
        document.body.style.padding = '0';
        document.body.style.margin = '0';
    } else {
        document.body.classList.remove('login-page-body');
        document.body.style.display = '';
        document.body.style.flexDirection = '';
        document.body.style.padding = '';
        document.body.style.margin = '';
        
        // Setup device UI hanya jika bukan halaman login
        setupDeviceUI(); 
    }

    // Redirect ke halaman login jika belum login dan bukan di halaman login
    if (!guruId && !isLoginPage) {
        window.location.href = 'index.html';
        return;
    }

    // Redirect ke dashboard jika sudah login tapi masih di halaman login
    if (guruId && isLoginPage) {
        window.location.href = 'dashboard.html';
        return;
    }

    // Setup welcome message jika element ada
    const welcomeMsg = document.getElementById('welcomeMessage');
    if (welcomeMsg && namaGuru) {
        welcomeMsg.textContent = `Halo, ${namaGuru}!`;
    }

    // Hanya setup logout & navigation jika ini bukan halaman login
    if (!isLoginPage) {
        // Setup logout handler
        const handleLogout = (e) => {
            e.preventDefault();
            localStorage.removeItem('guruId');
            localStorage.removeItem('namaGuru');
            window.location.href = 'index.html';
        };

        const logoutButtonDesktop = document.getElementById('logoutButtonDesktop');
        if (logoutButtonDesktop) logoutButtonDesktop.addEventListener('click', handleLogout);

        const logoutButtonMobile = document.getElementById('logoutButtonMobile');
        if (logoutButtonMobile) logoutButtonMobile.addEventListener('click', handleLogout);

        // Setup active navigation
        const currentFilename = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1);

        const desktopNavLinks = document.querySelectorAll('.desktop-nav a');
        desktopNavLinks.forEach(link => {
            if (link.getAttribute('href') === currentFilename) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        const mobileBottomNavLinks = document.querySelectorAll('.mobile-bottom-nav a.nav-item');
        mobileBottomNavLinks.forEach(link => {
            const pageName = currentFilename.replace('.html', '');
            if (link.dataset.page === pageName || link.getAttribute('href') === currentFilename) {
                if (link.id !== 'mobileMenuTrigger') { // Jangan set active pada menu trigger
                    link.classList.add('active');
                }
            } else {
                link.classList.remove('active');
            }
        });
    }
}

// Fungsi untuk setup menu mobile
function setupMobileMenu() {
    const menuTrigger = document.getElementById('mobileMenuTrigger');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const closeMenuButton = document.getElementById('closeMobileMenu');

    console.log('Setup mobile menu:', {menuTrigger, mobileMenuOverlay, closeMenuButton});

    if (menuTrigger && mobileMenuOverlay && closeMenuButton) {
        menuTrigger.addEventListener('click', (e) => {
            console.log('Menu trigger clicked');
            e.preventDefault();
            mobileMenuOverlay.classList.remove('hidden');
            mobileMenuOverlay.classList.add('active'); // Tambahkan kelas active untuk animasi
        });

        closeMenuButton.addEventListener('click', () => {
            mobileMenuOverlay.classList.remove('active'); // Hapus kelas active untuk animasi
            // Tunggu animasi selesai baru tambahkan hidden
            setTimeout(() => {
                mobileMenuOverlay.classList.add('hidden');
            }, 300); // 300ms sesuai dengan durasi transisi di CSS
        });

        mobileMenuOverlay.addEventListener('click', (e) => {
            if (e.target === mobileMenuOverlay) {
                mobileMenuOverlay.classList.remove('active'); // Hapus kelas active untuk animasi
                // Tunggu animasi selesai baru tambahkan hidden
                setTimeout(() => {
                    mobileMenuOverlay.classList.add('hidden');
                }, 300); // 300ms sesuai dengan durasi transisi di CSS
            }
        });
    }
}

// Fungsi untuk mengisi dropdown dari data master
async function populateDropdown(selectId, data, valueField, textField, defaultOptionText = "-- Pilih --") {
    const selectElement = document.getElementById(selectId);
    if (!selectElement) return;

    selectElement.innerHTML = `<option value="">${defaultOptionText}</option>`;
    if (data && data.length > 0) {
        data.forEach(item => {
            const option = document.createElement('option');
            option.value = item[valueField];
            option.textContent = item[textField];
            selectElement.appendChild(option);
        });
    }
}

// Fungsi untuk mengisi beberapa dropdown sekaligus
async function populateDropdowns(selectIdsArray) {
    if (SCRIPT_URL === "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL") {
        alert("Harap konfigurasi SCRIPT_URL di file script.js terlebih dahulu!");
        return;
    }
    showLoading();
    const paramsKelas = new URLSearchParams({ action: 'getKelas' });
    const paramsMapel = new URLSearchParams({ action: 'getMapel' });

    try {
        const [kelasRes, mapelRes] = await Promise.all([
            fetch(SCRIPT_URL, { method: 'POST', body: paramsKelas }),
            fetch(SCRIPT_URL, { method: 'POST', body: paramsMapel })
        ]);

        const kelasData = await kelasRes.json();
        const mapelData = await mapelRes.json();

        selectIdsArray.forEach(id => {
            const selectEl = document.getElementById(id);
            if (!selectEl) return;

            if (id.toLowerCase().includes('kelas')) {
                if (kelasData.success) {
                    populateDropdown(id, kelasData.data, 'ID', 'Nama Kelas', '-- Pilih Kelas --');
                } else {
                    console.warn(`Gagal memuat data kelas untuk dropdown ${id}:`, kelasData.message);
                }
            } else if (id.toLowerCase().includes('mapel')) {
                if (mapelData.success) {
                    populateDropdown(id, mapelData.data, 'ID', 'Nama Mata Pelajaran', '-- Pilih Mapel --');
                } else {
                    console.warn(`Gagal memuat data mapel untuk dropdown ${id}:`, mapelData.message);
                }
            }
        });

    } catch (error) {
        console.error("Error populating dropdowns:", error);
        const firstDropdownId = selectIdsArray[0];
        const messageArea = document.getElementById(firstDropdownId)?.closest('form')?.nextElementSibling; // Mencoba cari elemen pesan
        if (messageArea && messageArea.tagName === 'P' && messageArea.id.endsWith('Message')) {
            messageArea.textContent = "Gagal memuat data pilihan. Coba lagi nanti.";
            messageArea.style.color = 'red'; // Akan di-style oleh CSS
        } else {
            alert("Gagal memuat data untuk dropdown. Periksa konsol untuk detail.");
        }
    } finally {
        hideLoading();
    }
}

// Fungsi untuk mengisi tabel dari data
function populateTable(tableId, dataArray, columnKeys) {
    const tableBody = document.querySelector(`#${tableId} tbody`);
    if (!tableBody) return;
    tableBody.innerHTML = '';

    if (!dataArray || dataArray.length === 0) {
        const colCount = document.querySelector(`#${tableId} thead th`)?.parentElement.cells.length || 1;
        tableBody.innerHTML = `<tr><td colspan="${colCount}" style="text-align:center; padding: 2rem 0; color: #757575;">Tidak ada data untuk ditampilkan.</td></tr>`;
        return;
    }

    dataArray.forEach(rowData => {
        const row = tableBody.insertRow();
        columnKeys.forEach(key => {
            const cell = row.insertCell();
            // Cek jika key adalah objek (untuk header yang lebih deskriptif)
            const dataKey = typeof key === 'object' ? key.dataKey : key;
            cell.textContent = rowData[dataKey] !== undefined && rowData[dataKey] !== null ? rowData[dataKey] : '-';
        });
    });
}

// Event listener untuk resize window untuk menangani perubahan UI
window.addEventListener('resize', setupDeviceUI);

// Inisialisasi UI saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    // Panggil checkLoginAndSetup dari setiap halaman HTML, BUKAN DI SINI SECARA GLOBAL.
    // setupMobileMenu() juga akan dipanggil dari HTML masing-masing (kecuali login).
});


/**
 * Menampilkan pesan feedback kepada pengguna pada elemen tertentu.
 * @param {HTMLElement} messageElement Elemen HTML (misalnya <p>) untuk menampilkan pesan.
 * @param {string} message Teks pesan yang akan ditampilkan.
 * @param {boolean} isSuccess True jika pesan sukses, false jika error.
 * @param {number} [durationSuccess=4000] Durasi tampil pesan sukses dalam milidetik.
 * @param {number} [durationError=7000] Durasi tampil pesan error dalam milidetik.
 */
function displayFeedbackMessage(messageElement, message, isSuccess, durationSuccess = 4000, durationError = 7000) {
    if (!messageElement) {
        console.warn("Elemen pesan tidak disediakan untuk feedback:", message);
        alert((isSuccess ? "Info: " : "Peringatan: ") + message); // Fallback alert
        return;
    }

    // Hapus timeout sebelumnya jika ada untuk elemen ini
    if (messageElement.feedbackTimeout) {
        clearTimeout(messageElement.feedbackTimeout);
    }

    messageElement.textContent = message;
    messageElement.className = 'message-feedback'; // Reset kelas dasar
    messageElement.classList.add(isSuccess ? 'success' : 'error');
    messageElement.classList.add('show'); // Untuk memicu animasi tampil

    const duration = isSuccess ? durationSuccess : durationError;

    messageElement.feedbackTimeout = setTimeout(() => {
        messageElement.classList.remove('show');
        // Tambahkan timeout lagi untuk transisi opacity sebelum display none
        // Ini perlu jika transisi CSS Anda mengandalkan opacity untuk menghilang
        // dan display: none setelahnya.
        setTimeout(() => {
            // Cek lagi apakah pesan masih sama atau sudah diganti pesan baru
            // Jika masih pesan yang sama dan tidak ada kelas 'show', baru sembunyikan total
            if (!messageElement.classList.contains('show') && messageElement.textContent === message) {
                 messageElement.classList.add('hidden');
            }
        }, 300); // Durasi transisi opacity CSS (misalnya 0.3s)
    }, duration);
}