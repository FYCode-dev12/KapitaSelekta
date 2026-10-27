# Keputusan Teknis — Website Sekolah

Terakhir diperbarui: 27 Oktober 2026

## 1. Ruang Lingkup

Website sekolah dengan tiga fitur utama:

- **Berita** — pengelolaan artikel/pengumuman oleh admin
- **Galeri** — album foto kegiatan sekolah
- **Struktur organisasi** — dari kepala sekolah sampai staff

## 2. Stack yang Diputuskan

| Layer | Pilihan | Catatan |
|---|---|---|
| Framework | Next.js (App Router) + Tailwind | |
| CMS | Payload 3 (headless, terpasang di dalam Next.js) | Satu codebase, satu deploy |
| Database | Supabase Postgres | Akses lewat pooler |
| Media | Supabase Storage | Lewat adapter S3 (`@payloadcms/storage-s3`) |
| Hosting | Vercel | Hobby (gratis) dulu |
| Rendering | ISR + revalidate lewat hook `afterChange` Payload | |
| Domain | `.sch.id` atau domain biasa | `.sch.id` butuh dokumen sekolah |

## 3. Risiko dan Mitigasi

| Risiko | Mitigasi |
|---|---|
| **Vercel Hobby hanya untuk non-komersial.** Donasi dan pembayaran dianggap komersial. Status situs sekolah (terutama swasta) abu-abu. | Pakai Hobby untuk development/staging. Tanyakan ke support Vercel sebelum produksi. Siapkan opsi Pro atau hosting lain. |
| **Galeri menghabiskan kuota image optimization** (Hobby: 5K transformasi/bulan; setiap gambar per ukuran dihitung terpisah). | Atur `imageSizes` di collection Media, tampilkan gambar dengan `unoptimized` atau loader sendiri, batasi ukuran upload 2–3 MB. |
| **Supabase free bisa auto-pause** saat tidak aktif. | Pasang cron keep-alive (GitHub Actions atau Vercel Cron). Pertimbangkan upgrade saat produksi. |
| **Koneksi DB habis di serverless.** | Pakai connection string pooler dan batasi `pool max` di config Payload. |
| **Skema DB berubah tanpa kontrol.** | Pakai `payload migrate` saat build, jangan `push` di production. |
| **Akun terikat ke satu orang.** | Daftarkan Vercel dan Supabase dengan email institusi sekolah. |

## 4. Struktur Data (Collection Payload)

| Collection | Isi utama |
|---|---|
| **Users** | Role: admin, editor |
| **Media** | Foto dengan `imageSizes`, alt text |
| **Posts** (berita) | Judul, slug, isi (Lexical), cover, kategori, tanggal terbit, status draft/published |
| **Categories** | Berita, pengumuman, prestasi, kegiatan |
| **Albums** (galeri) | Judul, tanggal, cover, daftar foto |
| **Staff** | Nama, jabatan, foto, kelompok (pimpinan/guru/tenaga kependidikan), atasan (relasi ke Staff), urutan |
| **Globals** | Pengaturan situs (nama, kontak, sosmed), profil/visi-misi, banner beranda |

Catatan struktur organisasi: relasi `atasan` ke collection Staff membentuk hierarki yang bisa dirender sebagai bagan. Kalau bagan sederhana, `kelompok` + `urutan` sudah cukup.

## 5. Hal yang Perlu Dikonfirmasi

- [ ] Status sekolah (negeri/swasta) dan apakah akan ada pembayaran atau donasi di situs
- [ ] Kuota storage dan batas ukuran file Supabase free (cek dokumentasi terbaru)
- [ ] Siapa yang memegang akun Vercel dan Supabase (email institusi)
- [ ] Siapa admin/editor konten setelah situs live
- [ ] Domain yang dipakai

## 6. Langkah Berikutnya

1. Inisialisasi proyek dengan `create-payload-app` (template Postgres)
2. Konfigurasi database Supabase (pooler) dan adapter S3 untuk media
3. Tulis collection dan globals sesuai bagian 4
4. Bangun halaman publik: beranda, berita, galeri, struktur organisasi
5. Deploy staging ke Vercel, uji kuota gambar dan keep-alive DB
