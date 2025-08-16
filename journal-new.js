// Fungsi untuk memformat teks dengan line break
function formatTextContent(text) {
    return text ? text.replace(/\n/g, '<br>') : '';
}

// Fungsi untuk mendapatkan nama berdasarkan ID
function getNamaById(id, dataArray, idField = 'ID', nameField = 'Nama Kelas') {
    if (!id || !dataArray || dataArray.length === 0) return id || 'N/A';
    const item = dataArray.find(d => String(d[idField]).trim() === String(id).trim());
    return item ? String(item[nameField]).trim() : id;
}

// Fungsi untuk membuat kartu jurnal
function createJurnalCard(jurnal, masterKelasData, masterMapelData) {
    const itemCard = document.createElement('div');
    itemCard.classList.add('jurnal-item-card');
    
    itemCard.innerHTML = `
        <div class="jurnal-header">
            <div class="jurnal-header-info">
                <h4>
                    <i class="fas fa-calendar-day"></i>
                    ${jurnal.tanggal}
                </h4>
                <span class="jurnal-meta">
                    <i class="fas fa-users"></i>
                    ${getNamaById(jurnal.idKelas, masterKelasData, 'ID', 'Nama Kelas')} - 
                    ${getNamaById(jurnal.idMapel, masterMapelData, 'ID', 'Nama Mata Pelajaran')}
                </span>
            </div>
            <i class="fas fa-chevron-down toggle-icon"></i>
        </div>
        <div class="jurnal-content">
            <div class="jurnal-content-block">
                <strong><i class="fas fa-bullseye"></i> Tujuan Pembelajaran:</strong>
                <p>${formatTextContent(jurnal.tujuan)}</p>
            </div>
            <div class="jurnal-content-block">
                <strong><i class="fas fa-book"></i> Materi Pokok:</strong>
                <p>${formatTextContent(jurnal.materi)}</p>
            </div>
            <div class="jurnal-content-block">
                <strong><i class="fas fa-lightbulb"></i> Refleksi:</strong>
                <p>${formatTextContent(jurnal.refleksi)}</p>
            </div>
            <div class="jurnal-content-block">
                <strong><i class="fas fa-forward"></i> Tindak Lanjut:</strong>
                <p>${formatTextContent(jurnal.tindakLanjut)}</p>
            </div>
            <div class="jurnal-item-actions">
                <button type="button" class="btn-edit-jurnal btn" data-id="${jurnal.id}">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button type="button" class="btn-hapus-jurnal secondary btn" data-id="${jurnal.id}">
                    <i class="fas fa-trash-alt"></i> Hapus
                </button>
            </div>
        </div>
    `;

    // Tambahkan event listener untuk expand/collapse
    const header = itemCard.querySelector('.jurnal-header');
    header.addEventListener('click', (e) => {
        if (!e.target.closest('button')) {
            itemCard.classList.toggle('expanded');
        }
    });

    return itemCard;
}

// Fungsi untuk memuat semua jurnal
async function loadAllJurnalGuru(masterKelasData, masterMapelData) {
    const daftarSemuaJurnalContainer = document.getElementById('daftarSemuaJurnal');
    const idGuru = localStorage.getItem('guruId');
    
    if (!idGuru || SCRIPT_URL === "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL") {
        daftarSemuaJurnalContainer.innerHTML = '<p>Login diperlukan untuk melihat jurnal.</p>';
        return;
    }
    
    showLoading();
    daftarSemuaJurnalContainer.innerHTML = '<p>Memuat riwayat jurnal...</p>';

    const params = new URLSearchParams({ action: 'getAllJurnalGuru', idGuru });
    try {
        const response = await fetch(SCRIPT_URL, { method: 'POST', body: params });
        const result = await response.json();
        daftarSemuaJurnalContainer.innerHTML = '';

        if (result.success && result.data) {
            if (result.data.length > 0) {
                result.data.forEach(jurnal => {
                    const jurnalCard = createJurnalCard(jurnal, masterKelasData, masterMapelData);
                    daftarSemuaJurnalContainer.appendChild(jurnalCard);
                });
            } else {
                daftarSemuaJurnalContainer.innerHTML = '<p>Anda belum membuat jurnal apapun. Klik "Buat Jurnal Baru" untuk memulai.</p>';
            }
        } else {
            daftarSemuaJurnalContainer.innerHTML = '<p style="color:red;">Gagal memuat riwayat jurnal: ' + (result.message || 'Kesalahan tidak diketahui') + '</p>';
        }
    } catch (error) {
        console.error("Error loadAllJurnalGuru:", error);
        daftarSemuaJurnalContainer.innerHTML = '<p style="color:red;">Terjadi kesalahan: ' + error.message + '</p>';
    } finally {
        hideLoading();
    }
}

// Export fungsi-fungsi yang dibutuhkan
window.loadAllJurnalGuru = loadAllJurnalGuru;
