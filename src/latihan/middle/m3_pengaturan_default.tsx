// ========================================
// LATIHAN MIDDLE 3 — PENGATURAN APLIKASI (DEFAULT TYPE)
// ========================================
// Level: Middle
// Konsep: default type parameter <T = string> (materi 6)
// Program: menyimpan pengaturan aplikasi dengan tipe nilai bervariasi.

// ========================================
// SOAL
// ========================================
// Aplikasi menyimpan pengaturan (setting) — sebagian besar nilainya string,
// sebagian kecil number.
// 1. Buat type alias Setting<T = string> dengan properti key: string dan value: T.
// 2. Buat function generic makeSetting<T = string>(key: string, value: T): Setting<T>.
// 3. Buat setting bahasa TANPA type argument eksplisit (T default string),
//    lalu setting volume dengan eksplisit <number> — dan buktikan typeof nilainya.

// ========================================
// JAWABAN
// ========================================

// ------------------------------------------------------------------
// (1) TYPE SETTING — T = string berarti Setting polos = Setting<string>.
//     Kasus umum (string) tidak perlu menulis argumen tipe.
//     (Jika di Dart: typedef Setting<T> — dipakai tanpa <T> jatuh ke
//      dynamic implisit dan tak terkontrol; TS default bisa ditentukan bebas)
// ------------------------------------------------------------------
type Setting<T = string> = { key: string; value: T };

// ------------------------------------------------------------------
// (2) FACTORY MAKESETTING — default yang sama untuk fungsi pembuatnya.
// ------------------------------------------------------------------
function makeSetting<T = string>(key: string, value: T): Setting<T> {
  return { key, value };
}

// ------------------------------------------------------------------
// (3) DUA KEADAAN — string (default) vs number (eksplisit).
//     value muncul di parameter, jadi T biasanya di-infer dari argumen —
//     default berperan saat Setting dipakai polos (tanpa argumen tipe).
// ------------------------------------------------------------------
const lang: Setting = makeSetting("lang", "id"); // Setting polos → T default string
console.log(lang); // { key: 'lang', value: 'id' }

const volume: Setting<number> = makeSetting<number>("volume", 50); // eksplisit menimpa default
console.log(volume); // { key: 'volume', value: 50 }
console.log(typeof volume.value); // number  (bukti T benar-benar number)

// ========================================
// RANGKUMAN
// ========================================
// - Setting<T = string>: satu type alias, dua wajah — polos (string) atau eksplisit.
// - Default mengurangi boilerplate untuk kasus paling umum.
//   (Jika di Dart: Setting tanpa <T> = dynamic implisit — tidak bisa dikontrol;
//    di TS default-nya PASTI string, diperiksa compiler)
// - volume: Setting<number> membuktikan eksplisit menimpa default (materi 6).
// - typeof adalah cara cepat membuktikan tipe runtime-nya sesuai.
