# Aplikasi Administrasi Guru Sederhana

Aplikasi web sederhana untuk membantu guru dalam melakukan administrasi kegiatan belajar mengajar. Dibangun menggunakan Google Apps Script untuk backend (terintegrasi dengan Google Spreadsheet) dan HTML, CSS, serta JavaScript vanilla untuk frontend yang di-host di GitHub Pages.

## Fitur Utama

*   **Login Guru:** Autentikasi guru menggunakan email dan kata sandi.
*   **Dashboard:** Tampilan ringkasan setelah login.
*   **Manajemen Data Master:**
    *   Kelola data Kelas.
    *   Kelola data Mata Pelajaran.
    *   Kelola data Siswa.
*   **Presensi Siswa:** Catat kehadiran siswa (Hadir, Sakit, Izin, Alfa) per kelas, mata pelajaran, dan tanggal.
*   **Jurnal Pembelajaran:** Isi jurnal mengajar harian meliputi Tujuan Pembelajaran, Materi, Refleksi, dan Tindak Lanjut. Riwayat jurnal dapat dilihat, diedit, dan dihapus.
*   **Penilaian:** Input nilai siswa untuk berbagai jenis penilaian. Riwayat sesi penilaian dapat dilihat, diedit (nilai siswa), dan dihapus.
*   **Rekap Data:**
    *   Rekapitulasi Presensi Siswa per periode.
    *   Rekapitulasi Jurnal Mengajar per periode.
    *   Rekapitulasi Nilai Siswa (dengan judul penilaian sebagai kolom).
    *   Opsi cetak untuk setiap jenis rekap.
*   **Mobile-Friendly:** Antarmuka dirancang agar responsif dan nyaman digunakan di perangkat desktop maupun mobile.

## Teknologi yang Digunakan

*   **Frontend:**
    *   HTML5
    *   CSS3 (Vanilla CSS)
    *   JavaScript (Vanilla JS, Fetch API)
    *   Hosting: GitHub Pages
*   **Backend:**
    *   Google Apps Script (JavaScript)
    *   Penyimpanan Data: Google Spreadsheet

## Struktur Spreadsheet

Aplikasi ini menggunakan Google Spreadsheet sebagai database dengan sheet berikut:

1.  **Data Guru:** `ID`, `Nama`, `Email`, `Kata Sandi` (terenkripsi)
2.  **Kelas:** `ID`, `Nama Kelas`
3.  **Mata Pelajaran:** `ID`, `Nama Mata Pelajaran`
4.  **Siswa:** `ID`, `Nama`, `ID Kelas`
5.  **Presensi:** `ID`, `ID Guru`, `ID Kelas`, `ID Mata Pelajaran`, `ID Siswa`, `Tanggal`, `Keterangan`
6.  **Jurnal:** `ID`, `ID Guru`, `ID Kelas`, `ID Mata Pelajaran`, `Tanggal`, `Tujuan Pembelajaran`, `Materi`, `Refleksi`, `Tindak Lanjut`
7.  **Penilaian:** `ID Sesi Penilaian`, `ID` (baris), `ID Guru`, `ID Kelas`, `ID Mata Pelajaran`, `Judul Penilaian`, `ID Siswa`, `Nilai`, `Tanggal`

## Pengaturan dan Instalasi

### 1. Google Spreadsheet & Apps Script (Backend)

1.  **Buat Google Spreadsheet Baru:**
    *   Beri nama (misalnya, "Database Aplikasi Guru").
    *   Buat semua sheet yang disebutkan di atas dengan kolom yang sesuai.
    *   **PENTING:** Untuk kolom tanggal di sheet "Presensi", "Jurnal", dan "Penilaian", formatlah sebagai **Teks Biasa** (`Format > Angka > Teks biasa`) dan masukkan tanggal dalam format `YYYY-MM-DD`.
    *   Salin **ID Spreadsheet** Anda dari URL (bagian antara `/d/` dan `/edit`).
2.  **Buat Proyek Google Apps Script:**
    *   Buka Spreadsheet Anda, lalu klik "Ekstensi" > "Apps Script".
    *   Salin seluruh kode dari file `Code.gs` (yang telah disediakan) ke dalam editor Apps Script, ganti kode default yang ada.
    *   **PENTING:** Di dalam `Code.gs`, temukan baris `const SPREADSHEET_ID = "YOUR_SPREADSHEET_ID";` dan ganti `"YOUR_SPREADSHEET_ID"` dengan ID Spreadsheet Anda yang sebenarnya.
    *   Simpan proyek Apps Script.
3.  **Setup Guru Pertama (Opsional, jika sheet "Data Guru" kosong):**
    *   Jika Anda belum memiliki data guru, Anda bisa menjalankan fungsi `setupFirstGuruAction` sekali saja (misalnya, melalui fungsi tes di editor Apps Script atau dengan mengirim request POST khusus jika sudah deploy).
    *   Contoh fungsi tes di `Code.gs`:
        ```javascript
        function testSetupGuru() {
          var params = {
            parameter: {
              action: "setupFirstGuru",
              email: "guru@example.com", // Ganti dengan email Anda
              password: "password123",   // Ganti dengan password Anda
              nama: "Nama Guru Anda"     // Ganti dengan nama Anda
            }
          };
          Logger.log(JSON.stringify(doPost(params)));
        }
        ```
        Pilih `testSetupGuru` dan klik "Run". Periksa sheet "Data Guru".
4.  **Deploy sebagai Web App:**
    *   Di editor Apps Script, klik "Deploy" > "New deployment".
    *   Klik ikon roda gigi (Select type), pilih "Web app".
    *   Isi "Description" (misalnya, "Aplikasi Guru v1.0").
    *   Pada "Execute as", pilih "**Me**" (akun Anda).
    *   Pada "Who has access", pilih "**Anyone (even anonymous)**".
    *   Klik "Deploy".
    *   Jika diminta, klik "Authorize access" dan izinkan semua permission yang diminta oleh skrip.
    *   Salin **Web app URL** yang diberikan. Ini akan sangat penting untuk frontend.

### 2. Frontend (GitHub Pages)

1.  **Siapkan File Frontend:**
    *   Anda akan memiliki file-file berikut: `index.html` (atau `login.html` yang di-rename menjadi `index.html`), `dashboard.html`, `master-data.html`, `attendance.html`, `journal.html`, `assessment.html`, `reports.html`, `style.css`, `script.js`, dan file-file HTML untuk cetak (`cetak-presensi.html`, `cetak-jurnal.html`, `cetak-nilai.html`).
2.  **Konfigurasi URL Backend:**
    *   Buka file `script.js`.
    *   Temukan baris `const SCRIPT_URL = "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL";`.
    *   Ganti `"YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL"` dengan **Web app URL** yang Anda dapatkan dari deployment Google Apps Script.
3.  **Unggah ke Repositori GitHub:**
    *   Buat repositori baru di GitHub (jadikan publik).
    *   Unggah semua file frontend ke repositori tersebut. Pastikan `login.html` dinamai `index.html` agar menjadi halaman utama.
4.  **Aktifkan GitHub Pages:**
    *   Di repositori GitHub Anda, pergi ke "Settings".
    *   Di sidebar kiri, klik "Pages".
    *   Pada bagian "Build and deployment" > "Source", pilih "Deploy from a branch".
    *   Pada bagian "Branch", pilih branch utama Anda (`main` atau `master`) dan folder `/ (root)`.
    *   Klik "Save".
    *   Tunggu beberapa saat hingga situs Anda di-deploy. URL situs GitHub Pages Anda akan muncul di bagian atas halaman Pages (misalnya, `https://USERNAME.github.io/NAMA-REPOSITORI/`).

## Cara Menggunakan

1.  Buka URL GitHub Pages aplikasi Anda di browser.
2.  Login menggunakan akun guru yang sudah terdaftar di sheet "Data Guru".
3.  Gunakan navigasi untuk mengakses berbagai fitur administrasi.

## Kontribusi

Jika Anda ingin berkontribusi, silakan fork repositori ini dan buat pull request.



