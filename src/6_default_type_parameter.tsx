// ==== DEFAULT TYPE PARAMETER ====
// JUDUL: 6. DEFAULT TYPE PARAMETER (<T = string>)
// REFERENSI: docs/TypeScript Generic.pdf hlm. 34-37 (Programmer Zaman Now)
// ====

// (1) Dasar Default Type Parameter
// ==============================================
// Di materi 2 kita sempat lihat withDefault<T = string> singkat. Sekarang kita
// dalami KAPAN default benar-benar berguna: saat T TIDAK MUNCUL di parameter —
// TypeScript tidak punya sumber untuk menebaknya, jadi tanpa default kita
// WAJIB menulis type argument eksplisit setiap kali memanggil.
//
// Jika di Dart seperti ini → di TypeScript jadi seperti ini
// Dart: TIDAK punya default type parameter — tanpa argumen tipe, Dart mentah
//       (raw type) jatuh ke dynamic implisit dan tidak bisa dikontrol
//       (yang ada hanya default VALUE parameter biasa, beda konsep).
// TypeScript: T = string menjadi nilai otomatis saat T tidak ditentukan.
function parseData<T = string>(raw: string): T {
  return JSON.parse(raw) as T;
}

// Cetak hasil
console.log("// (1) Hasil parseData<T = string>:");
console.log(parseData('"hello"')); // hello - T default string (raw tidak membantu infer T)
console.log(parseData<number>("42")); // 42 - eksplisit menimpa default

// Analogi Dart: jsonDecode(raw) di Dart menghasilkan dynamic — lalu cast manual per kasus.
// TypeScript: T = string membuat kasus umum cukup parseData(raw) tanpa eksplisit.

// (2) Default di Type Alias & Interface
// ==============================================
// Pemakaian default yang PALING UMUM: type alias dan interface — biar tidak
// selalu menulis argumen tipe untuk kasus yang sering dipakai.
//
// Jika di Dart seperti ini → di TypeScript jadi seperti ini
// Dart: typedef ApiResponse<T> = ...; — dipakai tanpa <T> berarti dynamic
//       implisit; tidak ada cara menentukan tipe pengganti default.
// TypeScript: T = unknown menjadikan argumen tipe opsional.
type ApiResponse<T = unknown> = { success: boolean; data: T };

interface Box<T = string> {
  value: T;
}

// Cetak hasil
console.log("\n// (2) Hasil default di type & interface:");
const box: Box = { value: "hi" }; // tanpa argumen → T default string
console.log(box.value); // hi
const boxNum: Box<number> = { value: 42 }; // eksplisit menimpa default
console.log(boxNum.value); // 42
const res: ApiResponse = { success: true, data: "bebas" }; // data: unknown, terima apa saja
console.log(res); // { success: true, data: 'bebas' }

// Tanpa default, argumen tipe WAJIB — tidak bisa dipakai "polos":
// interface PlainBox<T> { value: T; }
// const pb: PlainBox = { value: "hi" };
// ERROR TS2314: Generic type 'PlainBox<T>' requires 1 type argument(s).

// Analogi Dart: Box dipakai polos di Dart → dynamic implisit, tak terkontrol.
// TypeScript: Default bisa ditentukan bebas (Box = Box<string>) — seperti
// "parameter opsional" versi tipe.

// (3) Default + Constraint
// ==============================================
// Type parameter boleh punya constraint DAN default sekaligus — dengan syarat
// default-nya MEMENUHI constraint.
//
// Jika di Dart seperti ini → di TypeScript jadi seperti ini
// Dart: T extends num (materi 4) — Dart tidak punya default type untuk digabung.
// TypeScript: <T extends string | number = string> — keduanya digabung.
type StrOrNum = string | number;

function firstItem<T extends StrOrNum = string>(items: T[]): T | undefined {
  return items[0];
}

// Cetak hasil
console.log("\n// (3) Hasil firstItem<T extends StrOrNum = string>:");
console.log(firstItem(["a", "b"])); // a
console.log(firstItem<number>([1, 2])); // 1 - eksplisit
console.log(firstItem([1, "x"])); // 1 - inference T = string | number (default tidak membatasi)

// Default yang melanggar constraint langsung ditolak:
// function badConstraint<T extends string = number>(value: T) {}
// ERROR TS2344: Type 'number' does not satisfy the constraint 'string'.

// Analogi Dart: seperti value default yang harus cocok dengan tipe parameternya.
// TypeScript: default = number untuk T extends string tidak sah — number bukan string.

// (4) Sebagian Default + Aturan Urutan
// ==============================================
// Type parameter boleh ber-default SEBAGIAN, dan default boleh MENGACU type
// parameter sebelumnya: <T, U = T>. Aturan urutannya sama seperti parameter
// fungsi: yang wajib tidak boleh setelah yang ber-default.
//
// Jika di Dart seperti ini → di TypeScript jadi seperti ini
// Dart: parameter opsional [B b] harus setelah yang wajib — aturan posisi sama.
// TypeScript: type parameter wajib tidak boleh mengikuti yang ber-default.
type Pair<T, U = T> = [T, U];

// Cetak hasil
console.log("\n// (4) Hasil <T, U = T> dan urutan parameter:");
const sama: Pair<string> = ["a", "b"]; // U default = T → [string, string]
console.log(sama); // [ 'a', 'b' ]
const beda: Pair<string, number> = ["id", 7]; // eksplisit
console.log(beda); // [ 'id', 7 ]

function pairSame<T, U = T>(first: T, second: U): [T, U] {
  return [first, second];
}

const p = pairSame("id", 7); // U di-infer number dari 7 — inference MENANG atas default!
console.log(p); // [ 'id', 7 ]
console.log(typeof p[1]); // number - bukti U = number, default tidak dipakai

// Urutan yang salah ditolak compiler:
// function badOrder<A = string, B>(a: A, b: B) {}
// ERROR TS2706: Required type parameters may not follow optional type parameters.

// Analogi Dart: f(String a, [int b]) sah; f([int b], String a) tidak sah.
// TypeScript: <A = string, B> tidak sah — B wajib harus di depan.

// (5) Studi Kasus: parseResponse dengan ApiResponse
// ==============================================
// Gabungan semua: fungsi generic ber-default + type alias ber-default —
// pola umum untuk helper parsing data.
//
// Jika di Dart seperti ini → di TypeScript jadi seperti ini
// Dart: ApiResponse parse(String raw) => ApiResponse(data: jsonDecode(raw));
//       tapi data bertipe dynamic — konsumen harus cast manual.
// TypeScript: parseResponse(raw) → ApiResponse<string> (default), atau
//             parseResponse<number>(raw) saat butuh number — tanpa cast manual.
function parseResponse<T = string>(raw: string): ApiResponse<T> {
  return { success: true, data: JSON.parse(raw) as T };
}

// Cetak hasil
console.log("\n// (5) Hasil parseResponse<T = string>:");
console.log(parseResponse('"hello"')); // { success: true, data: 'hello' }
console.log(parseResponse<number>("42")); // { success: true, data: 42 }

// Analogi Dart: jsonDecode + cast per konsumen di Dart.
// TypeScript: Default menentukan tipe data sekali di definisi — konsumen tinggal pakai.

// ==== RANGKUMAN ====
// 1. Default = fallback: dipakai saat T tidak bisa di-infer (fungsi) atau tidak diberi (type)
// 2. Default di type alias & interface mengurangi boilerplate: ApiResponse<T = unknown>
// 3. Default harus memenuhi constraint — <T extends string = number> ditolak (TS2344)
// 4. Type parameter wajib tidak boleh mengikuti yang ber-default (TS2706)
// 5. Default boleh mengacu parameter sebelumnya: <T, U = T> — tapi inference argumen menang
// ====

// ==== LATIHAN (+ JAWABAN) ====
// ==============================================

// 1. Buat fungsi generic 'wrap' yang memasukkan nilai ke array — default T = number.
function wrap<T = number>(value: T): T[] {
  return [value];
}

console.log("\n// Latihan 1: wrap");
console.log(wrap(5)); // [ 5 ] - T di-infer number dari 5 (T muncul di parameter)
console.log(wrap<string>("a")); // [ 'a' ] - eksplisit

// 2. Buat type alias 'PairDefault' ber-default [T, T] dan fungsi 'makePair'
//    yang mengembalikannya — default T = string.
//    (Dinamai PairDefault agar tidak bentrok dengan type Pair di section (4).)
type PairDefault<T = string> = [T, T];

function makePair<T = string>(a: T, b: T): PairDefault<T> {
  return [a, b];
}

console.log("\n// Latihan 2: makePair");
console.log(makePair("x", "y")); // [ 'x', 'y' ]
console.log(makePair<number>(1, 2)); // [ 1, 2 ]

// 3. Buat fungsi generic 'createRange' yang membuat array sepanjang length,
//    diisi oleh callback fill — default T = number.
function createRange<T = number>(length: number, fill: (i: number) => T): T[] {
  return Array.from({ length }, (_, i) => fill(i));
}

console.log("\n// Latihan 3: createRange");
console.log(createRange(3, (i) => i * 2)); // [ 0, 2, 4 ]
console.log(createRange<string>(2, (i) => "x".repeat(i + 1))); // [ 'x', 'xx' ]

// 4. Buat fungsi generic 'parseList' yang parsing JSON array — default T = string.
function parseList<T = string>(raw: string): T[] {
  return JSON.parse(raw) as T[];
}

console.log("\n// Latihan 4: parseList");
console.log(parseList('["a","b"]')); // [ 'a', 'b' ]
console.log(parseList<number>("[1,2]")); // [ 1, 2 ]

// 5. Buat type alias 'Message' ber-default string + fungsi 'createMessage'
//    yang memberi id berurutan otomatis.
type Message<T = string> = { id: number; body: T };

let nextId = 1;

function createMessage<T = string>(body: T): Message<T> {
  return { id: nextId++, body };
}

console.log("\n// Latihan 5: createMessage");
console.log(createMessage("halo")); // { id: 1, body: 'halo' }
console.log(createMessage<number>(42)); // { id: 2, body: 42 }
console.log(createMessage([1, 2])); // { id: 3, body: [ 1, 2 ] } - inference T = number[]
// ====
