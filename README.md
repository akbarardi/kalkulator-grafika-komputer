# Kalkulator & Visualisator Algoritma Grafika Komputer

Aplikasi web modern (*Single Page Application*) berbasis **Vite + React** untuk menghitung dan memvisualisasikan algoritma pembentukan primitif grafis (Garis, Lingkaran, dan Ellips).

Dirancang khusus sebagai alat bantu pengerjaan dan verifikasi tugas mata kuliah **Grafika Komputer & Pengolahan Citra**. Format tabel output dan label iterasi mengikuti **100% konvensi modul dosen** sehingga dapat disalin langsung ke lembar jawaban tulis tangan.

---

## 🚀 Fitur Utama

1. **4 Algoritma Primitif Grafis Lengkap**:
   - **DDA (Digital Differential Analyzer)**: Menangani semua arah garis dengan perhitungan kontinu real dan pembulatan bilangan bulat.
   - **Bresenham (Garis)**: Generalisasi semua oktan arah (termasuk *steep line* $|\Delta Y| > |\Delta X|$ dan kasus garis horizontal/vertikal), dengan tabel sesuai format modul dosen.
   - **Midpoint Circle**: Perhitungan oktan pertama dengan konvensi label baris awal `k = "-"` dan dilanjutkan dengan tabel simetri 8 oktan lengkap.
   - **Midpoint Ellipse**: Dua tabel terpisah (**Region 1** dan **Region 2**), baris `k = 0` titik awal di Region 1, baris carry-over `k = "-"` di Region 2 dengan rumus $P2_0$, serta pencerminan 4 kuadran.
2. **Preset 1-Klik Contoh Modul**:
   - Dilengkapi contoh-contoh soal persis dari slide modul Pertemuan II & III (misal Garis `(1,3) → (8,5)`, Bresenham `(20,10) → (30,18)`, Lingkaran $r=10$ dan $r=7$ pusat `(2,3)`, Ellips $R_x=8, R_y=5$ dan $R_x=13, R_y=11$ pusat `(3,4)`).
3. **Canvas Grid Interaktif**:
   - Visualisasi koordinat piksel diskret dengan sumbu X/Y dan angka skala otomatis (*auto-fit*).
   - Warna khusus untuk **titik hasil kalkulasi utama** vs **titik hasil pencerminan simetri**.
   - Zoom in/out, pan drag, toggle kurva kontinu matematis, dan toggle koordinat piksel.
   - **Interaksi Timbal Balik (*Cross-Highlighting*)**: Menyorot baris tabel akan membuat piksel pada grid bersinar, begitu pula sebaliknya.
4. **Fitur Salin & Ekspor Tabel**:
   - 1-Klik Salin format **Markdown** (untuk catatan/tugas digital).
   - 1-Klik Salin format **Excel / Word (TSV)** untuk ditempel rapi ke dokumen tugas.
   - Tombol **Cetak Tabel** dengan styling printer-friendly.
5. **100% Client-Side**:
   - Tidak memerlukan backend atau database, cepat, ringan, dan aman.

---

## 📋 Konvensi Format Tabel Sesuai Modul Dosen

### 1. DDA Line
| k | x (real) | y (real) | x (dibulatkan) | y (dibulatkan) |
|---|---|---|---|---|
- Baris `k = 0` untuk titik awal $(x_0, y_0)$.
- Kolom real menampilkan angka desimal kontinu, kolom dibulatkan menggunakan $\text{round}(x), \text{round}(y)$.

### 2. Bresenham Line
| K | Pk | (Xk+1, Yk+1) |
|---|---|---|
- Titik awal $(x_0, y_0)$ di-plot terlebih dahulu sebelum tabel.
- Iterasi dimulai dari baris $K = 0$ sampai $\Delta X - 1$.
- Kolom $(X_{k+1}, Y_{k+1})$ menampilkan koordinat titik piksel berikutnya yang dihasilkan dari keputusan $P_k$.

### 3. Midpoint Circle
| k | (X,Y) | 2X | 2Y | Pk |
|---|---|---|---|---|
- Baris pertama titik awal $(0, r)$ berlabel `k = "-"` dengan $P_k = 1 - r$.
- Baris berikutnya dimulai dari `k = 0` sampai kondisi berhenti $X \ge Y$.
- Tersedia tab terpisah **Tabel Simetri 8 Oktan** untuk melihat seluruh titik lingkaran yang dicerminkan dan ditranslasikan.

### 4. Midpoint Ellipse (Dua Tabel Terpisah)
- **Tabel Region 1**:
  | k | x | y | Px | Py | Pk |
  - Baris `k = 0` adalah titik awal $(0, R_y)$ dengan $P1_0 = R_y^2 - R_x^2 R_y + \frac{1}{4} R_x^2$.
  - Berhenti saat $P_x \ge P_y$.
- **Tabel Region 2**:
  | k | x | y | Px | Py | Pk |
  - Baris pertama adalah baris *carry-over* berlabel `k = "-"` dari titik akhir Region 1 dengan $P_k$ dihitung ulang menggunakan rumus $P2_0 = R_y^2(x + \frac{1}{2})^2 + R_x^2(y - 1)^2 - R_x^2 R_y^2$.
  - Dilanjutkan dengan `k = 0, 1, 2, ...` sampai $y = 0$.
  - Semua nilai desimal (seperti `-129.75`, `206.25`, dll.) ditampilkan apa adanya tanpa dibulatkan.

---

## 🛠️ Instalasi & Menjalankan Lokal

Pastikan [Node.js](https://nodejs.org/) (versi 18+) sudah terpasang.

```bash
# 1. Masuk ke direktori proyek
cd kalkulator-grafika-komputer

# 2. Pasang dependensi
npm install

# 3. Jalankan server pengembangan
npm run dev

# 4. Jalankan pengujian algoritma (39 unit tests)
npm test
```

Buka peramban di `http://localhost:5173/`.

---

## 🧪 Validasi Pengujian

Proyek ini dilengkapi dengan *automated test suite* yang memvalidasi hasil perhitungan algoritma terhadap seluruh contoh soal modul kuliah:

```bash
npm test
```

Output:
```text
=== TEST SUITE: ALGORITMA PRIMITIF GRAFIS ===
✓ DDA: Modul Contoh 1, vertikal, horizontal, mundur
✓ Bresenham: Modul Contoh 1, steep line, swap endpoints, vertikal, horizontal
✓ Midpoint Circle: Modul Contoh 1 (r=10), Contoh 2 (r=12), Contoh 3 (pusat (2,3)), simetri 8 oktan
✓ Midpoint Ellipse: Modul Contoh 1 (Rx=8, Ry=5), Contoh 2 (y=0 di Region 1), Contoh 3 (pusat (3,4)), pecahan Pk
========================================
TOTAL TESTS: 39 | PASSED: 39 | FAILED: 0
ALL TESTS PASSED WITH 100% ACCURACY! 🎉
```
