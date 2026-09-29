// Bank Soal Tryout Kilat Pareto (Sprint 10 Soal Berbobot Tinggi)
// Format Ujian Standar UTBK/SNBT V3.0 dengan Bobot Kesulitan IRT (Item Response Theory)

export const SPRINT_QUESTIONS = [
  {
    id: 1,
    code: "SPRINT-01 // PU",
    subject: "Penalaran Umum",
    subtopic: "Silogisme & Negasi Rantai",
    difficulty: "TIER 3 (SULIT)",
    irtWeight: 95,
    question: "Premis 1: Jika pasokan chip semikonduktor terganggu, maka produksi kendaraan listrik mengalami stagnasi.\nPremis 2: Jika produksi kendaraan listrik mengalami stagnasi, maka harga baterai litium melonjak atau subsidi pemerintah dicabut.\nPremis 3: Subsidi pemerintah tidak dicabut dan harga baterai litium tidak melonjak.\n\nManakah kesimpulan yang MUTLAK benar secara logika formal?",
    options: [
      "A. Pasokan chip semikonduktor terganggu namun subsidi dicabut.",
      "B. Produksi kendaraan listrik melonjak pesat.",
      "C. Pasokan chip semikonduktor TIDAK terganggu.",
      "D. Harga baterai litium stabil karena ada subsidi alternatif.",
      "E. Tidak ada hubungan antara pasokan chip dan baterai litium."
    ],
    correctIndex: 2, // C
    explanation: {
      keyConcept: "Modus Tollens Bertingkat & Hukum De Morgan",
      steps: [
        "1. Premis 3 menyatakan: (~Harga Melonjak) ∧ (~Subsidi Dicabut).",
        "2. Menurut De Morgan, ini setara dengan: ~ (Harga Melonjak V Subsidi Dicabut).",
        "3. Premis 2: (Produksi Stagnasi) → (Harga Melonjak V Subsidi Dicabut). Dengan Modus Tollens, diperoleh kesimpulan: ~ (Produksi Stagnasi).",
        "4. Premis 1: (Pasokan Chip Terganggu) → (Produksi Stagnasi).",
        "5. Karena ~ (Produksi Stagnasi), terapkan Modus Tollens sekali lagi: Pasokan chip semikonduktor TIDAK terganggu."
      ],
      trap: "Terkecoh memilih opsi spekulatif yang tidak memiliki dasar premis langsung (seperti opsi B atau D)."
    }
  },
  {
    id: 2,
    code: "SPRINT-02 // PK",
    subject: "Pengetahuan Kuantitatif",
    subtopic: "Aljabar Simetris Suku Tiga",
    difficulty: "TIER 3 (SULIT)",
    irtWeight: 90,
    question: "Akar-akar dari persamaan kuadrat x² - 4x + 2 = 0 adalah α dan β. Berapakah nilai pasti dari (α³ + β³)?",
    options: [
      "A. 32",
      "B. 40",
      "C. 48",
      "D. 56",
      "E. 64"
    ],
    correctIndex: 1, // B
    explanation: {
      keyConcept: "Identitas Aljabar Penjumlahan Pangkat Tiga (Vieta)",
      steps: [
        "1. Dari teorema Vieta: α + β = -(-4)/1 = 4, dan α · β = 2/1 = 2.",
        "2. Identitas aljabar: α³ + β³ = (α + β)³ - 3αβ(α + β).",
        "3. Masukkan nilai yang diketahui: (4)³ - 3(2)(4) = 64 - 24 = 40."
      ],
      trap: "Menghitung (α + β)³ saja (64) tanpa mengurangi suku silang 3αβ(α + β)."
    }
  },
  {
    id: 3,
    code: "SPRINT-03 // LITINDO",
    subject: "Literasi Bahasa Indonesia",
    subtopic: "Sintaksis & Kalimat Sumbang (Koherensi)",
    difficulty: "TIER 2 (SEDANG)",
    irtWeight: 80,
    question: "Perhatikan kutipan paragraf berikut:\n(1) Urbanisasi masif tanpa perencanaan tata ruang terpadu memicu fenomena pemukiman kumuh di bantaran sungai ibu kota.\n(2) Hal ini berdampak langsung pada degradasi kualitas air tanah dan penyempitan saluran drainase alami.\n(3) Sektor pariwisata bahari di daerah kepulauan terluar kini mencatatkan pertumbuhan devisa hingga 18% per kuartal.\n(4) Akibatnya, intensitas banjir bandang musiman meningkat hingga tiga kali lipat dibanding dekade lalu.\n(5) Pemerintah daerah perlu merestrukturisasi zonasi pemukiman dengan skema relokasi humanis.\n\nKalimat yang sumbang (merusak kepaduan paragraf) adalah...",
    options: [
      "A. Kalimat (1)",
      "B. Kalimat (2)",
      "C. Kalimat (3)",
      "D. Kalimat (4)",
      "E. Kalimat (5)"
    ],
    correctIndex: 2, // C
    explanation: {
      keyConcept: "Koherensi Paragraf & Kalimat Penjelas Tak Padu",
      steps: [
        "1. Topik utama paragraf adalah dampak urbanisasi tak terkontrol terhadap lingkungan fisik ibu kota (pemukiman kumuh, drainase, banjir).",
        "2. Kalimat (1), (2), (4), dan (5) membentuk rantai sebab-akibat dan solusi tentang tata ruang perkotaan.",
        "3. Kalimat (3) mendadak membahas sektor pariwisata bahari di daerah kepulauan terluar yang sama sekali tidak bertaut dengan gagasan pokok."
      ],
      trap: "Mengira kalimat (5) sumbang karena berisi solusi/rekomendasi, padahal penutup persuasif wajar dalam teks argumentatif."
    }
  },
  {
    id: 4,
    code: "SPRINT-04 // LITING",
    subject: "Literasi Bahasa Inggris",
    subtopic: "Critical Reading & Implication",
    difficulty: "TIER 3 (SULIT)",
    irtWeight: 85,
    question: "\"Recent computational linguistic models simulate conversational empathy with astonishing fidelity. However, reducing interpersonal empathy to probabilistic token prediction risks eroding the profound vulnerability upon which authentic human solidarity is established.\"\n\nWhich statement reflects the fundamental premise implicit in the excerpt?",
    options: [
      "A. Computational models will completely replace emotional human interactions by next decade.",
      "B. Linguistic token prediction is inherently incapable of syntax processing.",
      "C. True empathy requires psychological vulnerability, which mathematical algorithms cannot genuinely possess.",
      "D. Humans prefer synthetic conversational partners due to their predictability.",
      "E. Statistical models must be banned from all healthcare communication protocols."
    ],
    correctIndex: 2, // C
    explanation: {
      keyConcept: "Underlying Assumption & Conceptual Contrast",
      steps: [
        "1. The passage contrasts 'probabilistic token prediction' with 'profound vulnerability upon which authentic human solidarity is established'.",
        "2. The author's warning is grounded in the belief that real human solidarity is predicated on genuine vulnerability, something statistical computation cannot reproduce."
      ],
      trap: "Choosing extreme prognostications like A ('completely replace') or policy prescriptions like E ('must be banned') which are unsupported by the text."
    }
  },
  {
    id: 5,
    code: "SPRINT-05 // PK",
    subject: "Pengetahuan Kuantitatif",
    subtopic: "Matriks & Determinan Invers",
    difficulty: "TIER 2 (SEDANG)",
    irtWeight: 80,
    question: "Diketahui matriks A = [[3, 1], [4, 2]] dan matriks B = [[2, -1], [1, 3]]. Jika determinan matriks C didefinisikan sebagai det(C) = det(2 · A⁻¹ · B), berapakah nilai pasti dari det(C)?",
    options: [
      "A. 7",
      "B. 14",
      "C. 28",
      "D. 56",
      "E. 112"
    ],
    correctIndex: 1, // B
    explanation: {
      keyConcept: "Sifat Determinan: det(kA) = kⁿ · det(A) dan det(A⁻¹) = 1 / det(A)",
      steps: [
        "1. Hitung det(A) = (3)(2) - (1)(4) = 6 - 4 = 2.",
        "2. Hitung det(B) = (2)(3) - (-1)(1) = 6 - (-1) = 7.",
        "3. det(A⁻¹) = 1 / det(A) = 1/2.",
        "4. Karena matriks berordo 2 × 2 (n = 2), maka faktor pengali skalar k = 2 keluar sebagai 2² = 4.",
        "5. det(C) = det(2 · A⁻¹ · B) = 2² · det(A⁻¹) · det(B) = 4 · (1/2) · 7 = 2 · 7 = 14."
      ],
      trap: "Lupa memangkatkan skalar 2 dengan ordo matriks (n=2), sehingga menghitung 2 · (1/2) · 7 = 7."
    }
  },
  {
    id: 6,
    code: "SPRINT-06 // PU",
    subject: "Penalaran Umum",
    subtopic: "Pola Bilangan Interleaved (Melompat)",
    difficulty: "TIER 2 (SEDANG)",
    irtWeight: 75,
    question: "Perhatikan barisan bilangan berikut:\n3, 8, 6, 13, 12, 18, 24, 23, X, Y\n\nBerapakah nilai dari (X + Y)?",
    options: [
      "A. 68",
      "B. 74",
      "C. 76",
      "D. 82",
      "E. 86"
    ],
    correctIndex: 2, // C
    explanation: {
      keyConcept: "Barisan Dua Larik Selang-Seling (Interleaved Series)",
      steps: [
        "1. Pisahkan suku ganjil (posisi 1, 3, 5, 7, 9 -> X): 3, 6, 12, 24, X. Pola: dikali 2 setiap langkah. Maka X = 24 · 2 = 48.",
        "2. Pisahkan suku genap (posisi 2, 4, 6, 8, 10 -> Y): 8, 13, 18, 23, Y. Pola: ditambah 5 setiap langkah. Maka Y = 23 + 5 = 28.",
        "3. Nilai X + Y = 48 + 28 = 76."
      ],
      trap: "Mencoba mencari pola tunggal satu arah yang mengakibatkan kebingungan saat angka naik lalu sedikit melambat."
    }
  },
  {
    id: 7,
    code: "SPRINT-07 // PM",
    subject: "Penalaran Matematika",
    subtopic: "Aritmetika Sosial & Persentase Efektif",
    difficulty: "TIER 3 (SULIT)",
    irtWeight: 85,
    question: "Sebuah toko buku menerapkan diskon bertingkat '40% + 20%' untuk buku ensiklopedia, kemudian dikenakan PPN sebesar 11% dari harga setelah diskon. Jika seorang pembeli membayar tepat Rp319.680 di kasir, berapakah harga label asli buku tersebut sebelum dikenakan diskon dan pajak?",
    options: [
      "A. Rp580.000",
      "B. Rp600.000",
      "C. Rp620.000",
      "D. Rp640.000",
      "E. Rp650.000"
    ],
    correctIndex: 1, // B
    explanation: {
      keyConcept: "Pengali Multiplikatif Harga Diskon Bertingkat & Pajak",
      steps: [
        "1. Diskon pertama 40%: harga tersisa = 100% - 40% = 0,60.",
        "2. Diskon kedua 20% dari sisa: harga tersisa = 0,60 · (1 - 0,20) = 0,60 · 0,80 = 0,48 P (P = harga asli).",
        "3. Dikenakan PPN 11%: Total bayar = 0,48 P · 1,11 = 0,5328 P.",
        "4. Diketahui total bayar = Rp319.680.",
        "5. P = 319.680 / 0,5328 = Rp600.000."
      ],
      trap: "Menjumlahkan diskon menjadi 40% + 20% = 60%, yang merupakan kesalahan fatal konsep diskon berantai ritel."
    }
  },
  {
    id: 8,
    code: "SPRINT-08 // LITINDO",
    subject: "Literasi Bahasa Indonesia",
    subtopic: "PUEBI & Hubungan Logis Konjungsi",
    difficulty: "TIER 2 (SEDANG)",
    irtWeight: 75,
    question: "Perhatikan kalimat-kalimat berikut:\n(1) Meskipun defisit anggaran membengkak, namun pemerintah tetap memprioritaskan subsidi pupuk.\n(2) Para peneliti bekerja lembur sehingga laporan analisis dapat diserahkan tepat waktu.\n(3) Pertumbuhan ekonomi kuartal ini melambat. Sedangkan inflasi inti masih terkendali.\n(4) Dalam rapat paripurna memutuskan revisi undang-undang agraria secara aklamasi.\n\nKalimat yang BENAR dan memenuhi kaidah tata bahasa baku Bahasa Indonesia adalah...",
    options: [
      "A. Kalimat (1)",
      "B. Kalimat (2)",
      "C. Kalimat (3)",
      "D. Kalimat (4)",
      "E. Semua kalimat tidak baku"
    ],
    correctIndex: 1, // B
    explanation: {
      keyConcept: "Koreksi Kesalahan Konjungsi Ganda & Konjungsi Intrakalimat",
      steps: [
        "1. Kalimat (1) SALAH: redundant konjungsi subordinatif 'Meskipun ... namun' (cukup gunakan salah satu).",
        "2. Kalimat (2) BENAR: konjungsi akibat 'sehingga' menghubungkan klausa induk dan anak secara tepat di dalam satu kalimat.",
        "3. Kalimat (3) SALAH: 'Sedangkan' adalah konjungsi intrakalimat, tidak boleh diletakkan di awal kalimat setelah tanda titik.",
        "4. Kalimat (4) SALAH: kehilangan subjek karena diawali preposisi 'Dalam'."
      ],
      trap: "Menganggap 'Meskipun ... namun' adalah pasangan baku, padahal 'namun' adalah konjungsi antarkalimat dan 'meskipun' adalah intrakalimat."
    }
  },
  {
    id: 9,
    code: "SPRINT-09 // LITING",
    subject: "Literasi Bahasa Inggris",
    subtopic: "Advanced Vocabulary in Context",
    difficulty: "TIER 2 (SEDANG)",
    irtWeight: 80,
    question: "\"The archeological findings in the subterranean cavern were so ephemeral that atmospheric exposure degraded the organic pigments within hours.\"\n\nIn this context, the word 'EPHEMERAL' is closest in meaning to...",
    options: [
      "A. Monumental and enduring",
      "B. Transient and short-lived",
      "C. Invaluable and sacred",
      "D. Ambiguous and obscure",
      "E. Volatile and explosive"
    ],
    correctIndex: 1, // B
    explanation: {
      keyConcept: "Contextual Clue Inference",
      steps: [
        "1. The context clue 'degraded ... within hours' directly denotes an extremely brief duration.",
        "2. 'Ephemeral' means lasting for a very short time; transient, fleeting.",
        "3. Synonym match: 'Transient and short-lived'."
      ],
      trap: "Confusing 'ephemeral' with 'ethereal' (delicate/heavenly) or 'invaluable'."
    }
  },
  {
    id: 10,
    code: "SPRINT-10 // PK",
    subject: "Pengetahuan Kuantitatif",
    subtopic: "Geometri Analitik & Garis Tegak Lurus",
    difficulty: "TIER 3 (SULIT)",
    irtWeight: 90,
    question: "Garis g memiliki persamaan 3x - 4y + 12 = 0. Garis h tegak lurus terhadap garis g dan memotong sumbu-Y di titik (0, -2). Jika garis h juga memotong sumbu-X di titik (a, 0), berapakah nilai dari a?",
    options: [
      "A. -3/2",
      "B. -8/3",
      "C. 3/2",
      "D. -4/3",
      "E. 8/3"
    ],
    correctIndex: 0, // A
    explanation: {
      keyConcept: "Gradien Garis Tegak Lurus (m₁ · m₂ = -1) dan Titik Potong Sumbu",
      steps: [
        "1. Garis g: 4y = 3x + 12 ==> y = (3/4)x + 3. Maka gradien m₁ = 3/4.",
        "2. Karena garis h tegak lurus garis g: m₂ = -1 / (3/4) = -4/3.",
        "3. Persamaan garis h melalui (0, -2) dengan gradien m₂ = -4/3: y = (-4/3)x - 2.",
        "4. Garis h memotong sumbu-X di (a, 0): masukkan y = 0.",
        "5. 0 = (-4/3)a - 2 ==> (4/3)a = -2 ==> a = -2 · (3/4) = -6/4 = -3/2."
      ],
      trap: "Lupa tanda minus pada sifat gradien tegak lurus atau salah aljabar saat memindahkan konstanta -2."
    }
  }
];

// Helper kalkulasi Skor IRT (Item Response Theory Simulator)
// Rentang Skor Standar UTBK: 200 - 1000
export function calculateIrtScore({ answers, timeSpentSeconds }) {
  // answers: { [questionId]: selectedOptionIndex }
  let baseScore = 250;
  let earnedScore = 0;
  let correctCount = 0;
  let wrongCount = 0;
  let unansweredCount = 0;
  let subtestBreakdown = {
    PU: { correct: 0, total: 0 },
    PK: { correct: 0, total: 0 },
    LITINDO: { correct: 0, total: 0 },
    LITING: { correct: 0, total: 0 },
    PM: { correct: 0, total: 0 }
  };

  SPRINT_QUESTIONS.forEach(q => {
    const userAns = answers[q.id];
    const subtestKey = q.code.includes('PU') ? 'PU' 
      : q.code.includes('PK') ? 'PK' 
      : q.code.includes('LITINDO') ? 'LITINDO' 
      : q.code.includes('LITING') ? 'LITING' 
      : 'PM';

    if (subtestBreakdown[subtestKey]) {
      subtestBreakdown[subtestKey].total++;
    }

    if (userAns === undefined || userAns === null) {
      unansweredCount++;
      // No penalty, no points in IRT for blank
    } else if (userAns === q.correctIndex) {
      correctCount++;
      if (subtestBreakdown[subtestKey]) {
        subtestBreakdown[subtestKey].correct++;
      }
      // Weight per question based on difficulty
      earnedScore += (q.irtWeight * 7.5);
    } else {
      wrongCount++;
      // Minor penalty for guessing carelessly
      earnedScore -= 12;
    }
  });

  // Time efficiency bonus: max +40 points if completed under 7 minutes (420s) with high accuracy
  const accuracy = (correctCount / SPRINT_QUESTIONS.length) * 100;
  if (accuracy >= 70 && timeSpentSeconds <= 420) {
    const timeBonus = Math.round(((420 - timeSpentSeconds) / 420) * 35);
    earnedScore += timeBonus;
  }

  let finalScore = Math.round(baseScore + earnedScore);
  // Clamping within UTBK range 200 - 1000
  finalScore = Math.max(200, Math.min(1000, finalScore));

  let tier = 'ZONA BAHAYA';
  let tierDesc = 'Skor di bawah batas aman. Lakukan reset materi fundamental Pareto segera.';
  let badgeColor = 'text-red-600 border-red-600 bg-red-50';

  if (finalScore >= 750) {
    tier = 'TIER 1 // ELITE NASIONAL';
    tierDesc = 'Kompetitif untuk jurusan papan atas (FK UI, STEI ITB, Kedokteran UGM). Pertahankan konsistensi.';
    badgeColor = 'text-emerald-500 border-emerald-500 bg-emerald-950/20';
  } else if (finalScore >= 660) {
    tier = 'TIER 2 // KOMPETITIF TOP PTN';
    tierDesc = 'Aman untuk rumpun Sains & Soshum favorit (Teknik Sipil, Hukum, Akuntansi Top 5 PTN).';
    badgeColor = 'text-amber-500 border-amber-500 bg-amber-950/20';
  } else if (finalScore >= 560) {
    tier = 'TIER 3 // RATA-RATA AMAN';
    tierDesc = 'Cukup untuk prodi reguler, namun rentan tergeser di jurusan favorit. Tingkatkan kecepatan.';
    badgeColor = 'text-blue-500 border-blue-500 bg-blue-950/20';
  }

  return {
    score: finalScore,
    correctCount,
    wrongCount,
    unansweredCount,
    accuracy: Math.round(accuracy),
    tier,
    tierDesc,
    badgeColor,
    subtestBreakdown
  };
}
