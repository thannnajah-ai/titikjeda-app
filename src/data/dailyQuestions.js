// Bank Soal Harian UTBK/SNBT V3.0 (Prinsip Pareto 80/20)
// Rotasi otomatis deterministik berdasarkan hari dalam setahun

export const DAILY_QUESTIONS = [
  {
    id: 1,
    subject: "Pengetahuan Kuantitatif",
    subtopic: "Kalkulus & Kinematika Partikel",
    code: "SOAL-01 // PK",
    question: "Dalam sistem koordinat Kartesius, sebuah partikel bergerak sepanjang kurva y = x³ - 3x² + 2x. Jika laju perubahan posisi searah sumbu-x konstan dx/dt = 2 m/s, berapa besar percepatan vertikal (d²y/dt²) partikel tersebut pada saat melintasi absis x = 2?",
    options: [
      "A. 12 m/s²",
      "B. 24 m/s²",
      "C. 6 m/s²",
      "D. 18 m/s²",
      "E. 0 m/s²"
    ],
    correctIndex: 1, // B
    hint: "Gunakan aturan rantai turunan dua kali: dy/dt = (dy/dx)(dx/dt), lalu turunkan kembali terhadap t dengan mengingat dx/dt adalah konstanta.",
    explanation: {
      keyConcept: "Aturan Rantai Turunan Terkait Waktu (Related Rates)",
      steps: [
        "1. Tentukan kecepatan vertikal: dy/dt = (dy/dx) · (dx/dt).",
        "2. dy/dx = 3x² - 6x + 2. Karena dx/dt = 2, maka dy/dt = 2(3x² - 6x + 2) = 6x² - 12x + 4.",
        "3. Tentukan percepatan vertikal: d²y/dt² = d/dt [dy/dt] = [d/dx(6x² - 12x + 4)] · (dx/dt).",
        "4. Turunan terhadap x: (12x - 12). Kalikan lagi dengan dx/dt (yaitu 2): d²y/dt² = (12x - 12) · 2 = 24x - 24.",
        "5. Masukkan nilai x = 2: 24(2) - 24 = 48 - 24 = 24 m/s²."
      ],
      trap: "Jebakan paling fatal: Hanya menurunkan y terhadap x dua kali (d²y/dx² = 6x - 6 = 6 pada x=2) tanpa mengalikan dengan faktor kuadrat kecepatan horizontal (dx/dt)²."
    }
  },
  {
    id: 2,
    subject: "Penalaran Umum",
    subtopic: "Silogisme Kompleks & Disjungsi",
    code: "SOAL-02 // PU",
    question: "Premis 1: Jika sebuah algoritma efisien dan aman, maka sistem tidak akan mengalami kebocoran memori.\nPremis 2: Sistem mengalami kebocoran memori atau server kelebihan beban.\nPremis 3: Server tidak kelebihan beban dan algoritma terbukti aman.\n\nManakah kesimpulan yang MUTLAK benar?",
    options: [
      "A. Algoritma tersebut efisien namun tidak aman.",
      "B. Algoritma tersebut tidak efisien.",
      "C. Sistem mengalami kegagalan pada perangkat keras.",
      "D. Server harus dimatikan segera.",
      "E. Algoritma tidak aman dan server kelebihan beban."
    ],
    correctIndex: 1, // B
    hint: "Sederhanakan premis 2 dan 3 terlebih dahulu (Silogisme Disjungtif) untuk memastikan apakah sistem bocor memori atau tidak, lalu gunakan Modus Tollens pada Premis 1.",
    explanation: {
      keyConcept: "Kombinasi Silogisme Disjungtif & Modus Tollens (De Morgan)",
      steps: [
        "1. Dari Premis 2: (Kebocoran) V (Server Overload).",
        "2. Dari Premis 3: Server TIDAK overload. Berdasarkan silogisme disjungtif, sistem PASTI mengalami kebocoran memori.",
        "3. Dari Premis 1: (Efisien ∧ Aman) → (~Kebocoran).",
        "4. Berdasarkan Modus Tollens: Karena terjadi kebocoran memori, maka ~(Efisien ∧ Aman) bernilai BENAR.",
        "5. Menurut Hukum De Morgan: ~(Efisien ∧ Aman) ≡ (~Efisien V ~Aman).",
        "6. Dari Premis 3 diketahui algoritma TERBUKTI AMAN. Maka satu-satunya kepastian logis adalah: Algoritma TIDAK EFISIEN."
      ],
      trap: "Mengabaikan fakta bahwa Premis 3 sudah mengonfirmasi bahwa algoritma itu aman. Jika aman, maka yang menggagalkan kondisi efisien & aman pastilah faktor ketidakefisienannya."
    }
  },
  {
    id: 3,
    subject: "Pengetahuan Kuantitatif",
    subtopic: "Kombinatorika & Peluang Bersyarat",
    code: "SOAL-03 // PK",
    question: "Dari 6 siswa laki-laki dan 4 siswa perempuan, akan dibentuk delegasi olimpiade sains beranggotakan 4 orang yang memuat paling sedikit 2 siswa perempuan. Berapa banyak susunan delegasi berbeda yang dapat dibentuk?",
    options: [
      "A. 105 susunan",
      "B. 115 susunan",
      "C. 120 susunan",
      "D. 90 susunan",
      "E. 210 susunan"
    ],
    correctIndex: 1, // B
    hint: "Pecah syarat 'paling sedikit 2 perempuan' menjadi 3 kasus mutually exclusive: (2P & 2L), (3P & 1L), dan (4P & 0L), lalu jumlahkan.",
    explanation: {
      keyConcept: "Aturan Penjumlahan Kasus Kombinasi Bebas C(n, r)",
      steps: [
        "1. Kasus 1 (2 Perempuan dan 2 Laki-laki): C(4, 2) · C(6, 2) = 6 · 15 = 90 cara.",
        "2. Kasus 2 (3 Perempuan dan 1 Laki-laki): C(4, 3) · C(6, 1) = 4 · 6 = 24 cara.",
        "3. Kasus 3 (4 Perempuan dan 0 Laki-laki): C(4, 4) · C(6, 0) = 1 · 1 = 1 cara.",
        "4. Total kemungkinan = 90 + 24 + 1 = 115 cara."
      ],
      trap: "Cara komplemen yang salah hitung: Menghitung total C(10, 4) = 210 lalu salah mengurangi kasus 0 perempuan dan 1 perempuan."
    }
  },
  {
    id: 4,
    subject: "Literasi Bahasa Indonesia",
    subtopic: "Sintaksis & Kalimat Efektif",
    code: "SOAL-04 // LITINDO",
    question: "Perhatikan kalimat berikut:\n'Berdasarkan hasil analisis laboratorium geologi menunjukkan adanya pergeseran lempeng tektonik yang mengakibatkan potensi gempa meningkat.'\n\nKalimat di atas TIDAK EFEKTIF karena...",
    options: [
      "A. Menggunakan kata serapan asing 'analisis' dan 'laboratorium'.",
      "B. Kehilangan subjek akibat didahului preposisi keterangan 'Berdasarkan'.",
      "C. Memuat konjungsi subordinatif 'yang' secara berlebihan.",
      "D. Predikat kalimat berupa kata kerja intransitif.",
      "E. Mengandung pleonasme antara kata 'potensi' dan 'meningkat'."
    ],
    correctIndex: 1, // B
    hint: "Periksa pola Subjek (S) dan Predikat (P). Jika kalimat diawali 'Berdasarkan...', bagian awal menjadi Keterangan (K). Di manakah subjeknya jika langsung bertemu kata kerja 'menunjukkan'?",
    explanation: {
      keyConcept: "Ketegasan Subjek dalam Struktur Kalimat Bahasa Indonesia",
      steps: [
        "1. Suatu klausa wajib memiliki minimal Subjek (S) dan Predikat (P) yang jelas.",
        "2. Kata 'Berdasarkan' menjadikan frasa 'Berdasarkan hasil analisis laboratorium geologi' berstatus sebagai Keterangan (K).",
        "3. Kata 'menunjukkan' berstatus sebagai Predikat (P).",
        "4. Struktur menjadi: K - P - O (tanpa ada Subjek). Ini adalah kalimat rancu / buntung.",
        "5. Perbaikan: Cukup hapus kata 'Berdasarkan' sehingga frasa awal menjadi Subjek utuh."
      ],
      trap: "Terkecoh menyalahkan kata serapan baku atau menganggap kalimat tersebut sudah wajar karena sering didengar dalam percakapan informal."
    }
  },
  {
    id: 5,
    subject: "Literasi Bahasa Inggris",
    subtopic: "Tone & Author Stance",
    code: "SOAL-05 // LITING",
    question: "'While synthetic biology promises unprecedented breakthroughs in bespoke enzyme synthesis, reckless deregulation risks uncontainable biocontamination across fragile ecosystems.'\n\nThe author's primary tone and argument in this statement can best be described as...",
    options: [
      "A. Vehemently hostile toward biochemical innovation.",
      "B. Unconditionally optimistic about industrial biotechnology.",
      "C. Cautious and nuanced, acknowledging breakthrough benefits while warning against regulatory laxity.",
      "D. Cynical regarding the capability of modern researchers.",
      "E. Indifferent to the ecological consequences of synthetic genes."
    ],
    correctIndex: 2, // C
    hint: "Identify contrasting transitions: 'While ... promises breakthroughs' sets up the advantage, followed by 'reckless deregulation risks...' delivering the caveat.",
    explanation: {
      keyConcept: "Critical Reading: Identifying Nuanced / Balanced Stance",
      steps: [
        "1. The concessive clause 'While synthetic biology promises unprecedented breakthroughs' shows respect for scientific merit.",
        "2. The main clause highlights the perils of 'reckless deregulation' on ecosystems.",
        "3. The author is neither anti-science nor blindly techno-optimistic; the tone is disciplined, cautionary, and balanced (cautious and nuanced)."
      ],
      trap: "Picking extreme answers like 'Vehemently hostile' or 'Unconditionally optimistic'. UTBK reading passages rarely adopt radical, one-sided emotional tones."
    }
  },
  {
    id: 6,
    subject: "Pengetahuan Kuantitatif",
    subtopic: "Fungsi Kuadrat & Definit Positif",
    code: "SOAL-06 // PK",
    question: "Grafik fungsi kuadrat f(x) = (m - 1)x² - 2mx + (m + 2) selalu berada seluruhnya di atas sumbu-X (definit positif) untuk semua nilai real x. Berapakah batas-batas nilai parameter m yang memenuhi?",
    options: [
      "A. m > 1",
      "B. m < 2",
      "C. 1 < m < 2",
      "D. m > 2",
      "E. m < 1 atau m > 2"
    ],
    correctIndex: 3, // D
    hint: "Definit positif mensyaratkan dua hal mutlak: kurva membuka ke atas (a > 0) dan tidak pernah menyentuh sumbu-X (D < 0). Cari irisan keduanya.",
    explanation: {
      keyConcept: "Kondisi Geometris Definit Positif (a > 0 dan Diskriminan D < 0)",
      steps: [
        "1. Syarat 1 (Kurva membuka ke atas): a > 0 ==> m - 1 > 0 ==> m > 1.",
        "2. Syarat 2 (Tidak memotong sumbu-X): D = b² - 4ac < 0.",
        "3. b = -2m, a = (m - 1), c = (m + 2).",
        "4. D = (-2m)² - 4(m - 1)(m + 2) = 4m² - 4(m² + m - 2) = 4m² - 4m² - 4m + 8 = -4m + 8.",
        "5. -4m + 8 < 0 ==> 4m > 8 ==> m > 2.",
        "6. Irisan dari m > 1 dan m > 2 adalah: m > 2."
      ],
      trap: "Lupa bahwa m harus lebih besar dari 1 (syarat koefisien kuadrat positif), atau salah tanda saat membagi pertidaksamaan negatif."
    }
  },
  {
    id: 7,
    subject: "Penalaran Umum",
    subtopic: "Penalaran Analitik & Pengurutan Posisi",
    code: "SOAL-07 // PU",
    question: "Lima orang atlet (A, B, C, D, E) menempati urutan peringkat lari:\n- A finis sebelum B tetapi sesudah C.\n- D finis sebelum C.\n- E finis di antara A dan B.\n\nSiapakah atlet yang finis tepat di urutan ke-3?",
    options: [
      "A. C",
      "B. A",
      "C. D",
      "D. E",
      "E. B"
    ],
    correctIndex: 1, // B
    hint: "Susun rantai ketidaksamaan dari fakta yang paling awal: Hubungkan D dengan C, lalu C dengan A, lalu sisipkan E sebelum B.",
    explanation: {
      keyConcept: "Pemetaan Rantai Transitif Relasional",
      steps: [
        "1. 'A finis sesudah C tetapi sebelum B' ==> C < A < B (angka lebih kecil = finis lebih dulu).",
        "2. 'D finis sebelum C' ==> D < C.",
        "3. Gabungkan: D < C < A < B.",
        "4. 'E finis di antara A dan B' ==> D < C < A < E < B.",
        "5. Urutan 1 sampai 5: Urutan 1 = D, Urutan 2 = C, Urutan 3 = A, Urutan 4 = E, Urutan 5 = B.",
        "6. Posisi ke-3 ditempati oleh atlet A."
      ],
      trap: "Tertukar antara istilah 'sebelum' (peringkat lebih baik/depan) dan 'sesudah'."
    }
  },
  {
    id: 8,
    subject: "Pengetahuan Kuantitatif",
    subtopic: "Eksponensial & Aljabar Substitusi",
    code: "SOAL-08 // PK",
    question: "Jika diketahui 2^(x+1) + 2^(x-1) = 20, maka berapakah nilai pasti dari 4^x - 4^(x-1)?",
    options: [
      "A. 48",
      "B. 12",
      "C. 36",
      "D. 64",
      "E. 192"
    ],
    correctIndex: 0, // A
    hint: "Faktorkan persamaan pertama menjadi 2^x (2 + 1/2) = 20 untuk mencari nilai 2^x, kemudian kuadratkan untuk menghitung 4^x.",
    explanation: {
      keyConcept: "Sifat Eksponen a^(m+n) = a^m · a^n",
      steps: [
        "1. 2^(x+1) + 2^(x-1) = 2 · 2^x + (1/2) · 2^x = (5/2) · 2^x = 20.",
        "2. 2^x = 20 · (2/5) = 8 ==> x = 3.",
        "3. Hitung ekspresi target: 4^x - 4^(x-1) = 4³ - 4².",
        "4. 4³ = 64, dan 4² = 16.",
        "5. 64 - 16 = 48."
      ],
      trap: "Menghitung 4^(x-1) sebagai (4^x) - 1, bukan (4^x) / 4."
    }
  }
];

export function getDailyQuestion(dateStr) {
  // Deterministic daily rotation using day-of-year
  const d = dateStr ? new Date(dateStr) : new Date();
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  
  const index = Math.abs(dayOfYear) % DAILY_QUESTIONS.length;
  return DAILY_QUESTIONS[index];
}
