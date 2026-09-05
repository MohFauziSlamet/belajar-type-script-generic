# AGENTS.md — Memori Proyek Belajar TypeScript Generic

## Tujuan
Repositori ini adalah **proyek belajar TypeScript Generic** pemilik akun dengan bantuan AI.
Materi lanjutan setelah TypeScript Dasar (34 materi, repo `../belajar-type-script-dasar/`)
dan TypeScript OOP (20 materi, repo `../belajar-type-script-oop/`).
Bahasa komunikasi utama: **Bahasa Indonesia**.

## Cara AI Membantu (Pedoman)
- **MEMORI VAULT (WAJIB dibaca di awal sesi)**: `/Users/user/flywheel-vault/projects/belajar-type-script-generic/memory.md`
  (profil user, kamus Dart → TypeScript, progres, log sesi). Update Progress & Log Sesi di akhir sesi.
- Prompt mentor lengkap: `docs/PROMPT_MENTOR_TS.md` (peran, aturan gaya materi, verifikasi).
- User = Flutter developer mahir Dart, SUDAH tamat TS Dasar (34 materi) & TS OOP (20 materi).
  Jelaskan konsep baru selalu dengan format:
  "Jika di Dart seperti ini → di TypeScript jadi seperti ini" (jangan pakai kata "padanan").
  Analogi Dart yang relevan untuk Generic: `List<T>`, `Map<K, V>`, `T Function<T>(T)`,
  method generic di Dart (`T first<T>(List<T> list)`), `extends` pada generic Dart.
- Bertindak sebagai **tutor**: jelaskan konsep singkat & jelas, lalu beri contoh kode.
- Materi baru: SATU file `src/NN_topik.tsx` gaya **define-then-print** (definisi → langsung
  `console.log` + komentar output). Unit test di `tests/` bersifat **OPSIONAL**.
- **Jangan hanya memberi jawaban** — bantu pengguna memahami dengan analogi/contoh sederhana.
- Saat ada error TypeScript, jelaskan *penyebab* dan *cara memperbaikinya*, bukan cuma patch.
- Verifikasi dengan: `npx tsx src/NN_topik.tsx` (jalankan + cocokkan output) dan `npx tsc --noEmit`
  (type-check — tsx TIDAK type-check, itu tertangkap berulang kali di repo dasar).
- Referensi resmi: https://www.typescriptlang.org/ (sudah di-allow di settings).

## Tech Stack & Konfigurasi
(Sama persis dengan repo dasar — disalin sesi 2026-09-05.)
- **Runtime**: Node.js, ESM (`"type": "module"`)
- **TypeScript** ^5.9.3, **tsconfig** mode ketat (`strict: true`), `rootDir: "./"`
- **tsx** (devDependency): jalankan file TS langsung tanpa kompilasi manual. CATATAN: `tsx`
  hanya transpile, TIDAK type-check.
- **Testing**: Jest ^30 + Babel (`babel-jest` + `@babel/preset-env` + `@babel/preset-typescript`) — opsional
- **Catatan Babel**: Babel menghapus type annotation saat test → beberapa error TS tidak tertangkap
  di Jest. Karena itu jalankan `npx tsc --noEmit` secara berkala untuk type-check asli.
- Ekstensi file sumber pakai `.tsx` (konvensi proyek), padahal isi bukan React JSX.

## Perintah Penting
| Tujuan | Perintah |
|---|---|
| Jalankan file materi langsung | `npx tsx src/NN_topik.tsx` |
| Jalankan semua unit test | `npm test` |
| Jalankan satu file test | `npx jest tests/nama.test.ts` |
| Type-check tanpa emit | `npx tsc --noEmit` |
| Kompilasi ke `dist/` | `npx tsc` |
| Watch compiler | `npx tsc --watch` |

## Konvensi File
- Implementasi: `src/<nomor>_<nama>.tsx` (mis. `1_pengenalan_generic.tsx`)
- Materi baru gaya mentor: define-then-print (definisi → `console.log` + komentar output),
  dengan struktur file WAJIB berurutan:
  1. Banner judul 3 baris (`// ====...` / `// JUDUL UPPERCASE` / `// ====...`) + referensi PDF
  2. Sub-section berulang: garis `------` + penomoran `(1) (2) ...` → penjelasan → kode → cetak
  3. Banner `RANGKUMAN` 3 baris (poin sebagai komentar)
  4. Banner `LATIHAN (+ JAWABAN)` 3 baris — tiap soal langsung disertai jawaban
     (kode + console.log + komentar output; gaya belajar user = fokus membaca)
- Blok error berkomentar (`// ERROR TSxxxx:`) wajib VERBATIM hasil tsc asli — verifikasi via
  probe file sementara sebelum menulis (ritual yang terbukti di repo dasar), lalu hapus probe.
- Test (opsional): `tests/<nama>.test.ts`, import via path relatif `../src/<file>.tsx`
- Pola test: `describe("<Topik>")` → `it("should ...", () => { expect(...).toBe(...) })`
- Semua export pakai `export function ...` (named export).
- Latihan review (menyusul setelah kurikulum tuntas): folder `src/latihan/<level>/`
  (beginner/middle/advance/expert) — pola lengkap ada di AGENTS.md repo dasar.

## Peta Kurikulum & Progres
Legenda: [x] selesai · [ ] belum

### Kurikulum Generic
> **CATATAN PENTING**: silabus di bawah adalah KERANGKA PROVISORIS —
> PDF resmi (kelas lanjutan Programmer Zaman Now, kemungkinan judul
> "TypeScript Lanjutan": bab Generic + Decorator; vault OOP sesi 67
> menyebut hlm. 95-96) **BELUM tersedia** di `docs/`. FINALISASI daftar
> ini setelah PDF ditempatkan — jangan mengarang nomor halaman/konten
> sebelum PDF diekstrak.

- [ ] Pengenalan Generic (masalah tanpa generic: any vs union, duplikasi fungsi)
- [ ] Generic Function (`function nama<T>(param: T): T`)
- [ ] Generic dengan Multiple Type Parameters (`<T, U>`)
- [ ] Generic Constraint (`<T extends Bentuk>`)
- [ ] Constraint `keyof` (`<T, K extends keyof T>`)
- [ ] Default Type Parameter (`<T = string>`)
- [ ] Generic Interface
- [ ] Generic Class
- [ ] Extending Generic Class / Interface
- [ ] Generic Method dalam Class
- (mengikuti daftar isi PDF saat tersedia)

### Prasyarat (sudah ditempuh di repo lain)
- TypeScript Dasar 34/34 — `../belajar-type-script-dasar/`
- TypeScript OOP 20/20 — `../belajar-type-script-oop/`
- TypeScript Decorator (menyusul setelah Generic)

## Catatan Tambahan
- `dist/` berisi hasil kompilasi (jangan edit manual).
- `src/placeholder.tsx` = file sementara agar `npx tsc` punya input (repo tanpa
  file TS apa pun = TS18003). HAPUS saat materi pertama dibuat.
- Untuk membaca PDF, model utama tidak support PDF langsung; ekstrak via `pypdf`
  (`pip3 install pypdf` lalu `PdfReader(...).extract_text()`).
- Ritual verifikasi materi baru: **WAJIB baca bagian "PLAYBOOK: Cara
  Membuat Materi" di memori vault** (urutan kerja, struktur file, rules
  kutipan error verbatim, verifikasi, review 2 subagent, jebakan
  berulang, gaya bahasa — distilasi ~50 sesi repo dasar & OOP).
  Ringkasannya: probe dulu → tulis file → `npx tsx` cocokkan output →
  `npx tsc --noEmit` → simulasi uncomment → review 2 subagent → terapkan
  fix → verifikasi ulang → update vault.
