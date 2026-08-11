**PROPOSAL PENGEMBANGAN PERANGKAT LUNAK**  
**NARASI: Asisten Dokumentasi Klinis Berbasis**   
**AI untuk Membantu Dokter Menyusun Rekam Medis**

![][image1]  
Disusun Oleh: 

| Gusti Fadhilah Ahmad | 25531008 |
| :---- | ----: |
| Muhammad Dzaky Abdurrahman | 25311205 |
| Gusti Surya Aditama | 25523053 |

**UNIVERSITAS ISLAM INDONESIA**   
**YOGYAKARTA**

**2026**   
**A. JUDUL/NAMA PERANGKAT LUNAK**

### NARASI: Asisten Dokumentasi Klinis Berbasis AI untuk Membantu Dokter Menyusun Rekam Medis

Nama perangkat lunak: NARASI

Kategori: Pengembangan Perangkat Lunak

Platform: Web App

**B. LATAR BELAKANG IDE PERANGKAT LUNAK**

***Masalah dan Pihak yang Terdampak***

Dokumentasi rekam medis merupakan bagian penting dalam pelayanan kesehatan karena berfungsi sebagai catatan mengenai proses pemeriksaan, kondisi pasien, serta tindakan yang diberikan oleh tenaga medis. Dalam praktiknya, dokter tidak hanya perlu berinteraksi dan melakukan pemeriksaan terhadap pasien, tetapi juga harus mendokumentasikan informasi klinis yang diperoleh selama konsultasi. Kondisi tersebut membuat proses konsultasi dan pencatatan menjadi dua aktivitas yang harus dilakukan dalam satu alur kerja.

Beban dokumentasi klinis telah menjadi perhatian dalam berbagai penelitian internasional. Studi yang menganalisis sekitar 100 juta kunjungan pasien dan melibatkan sekitar 155.000 dokter dari 417 sistem kesehatan di Amerika Serikat menunjukkan bahwa dokter menghabiskan rata-rata **16 menit 14 detik per kunjungan** untuk menggunakan sistem rekam medis elektronik (Electronic Health Record/EHR). Dari waktu tersebut, aktivitas dokumentasi menyumbang sekitar **24%**. **\[1\]**

Permasalahan tersebut juga terlihat dari persepsi dokter terhadap aktivitas dokumentasi. Penelitian Gaffney dkk. menggunakan data *2019 National Electronic Health Records Survey* terhadap **1.524 dokter** menemukan bahwa **58,1% responden tidak setuju bahwa waktu yang digunakan untuk dokumentasi sudah sesuai**, dan **58,1% juga tidak setuju bahwa waktu dokumentasi tidak mengurangi waktu bersama pasien**. **\[2\]** 

Kedua penelitian tersebut berasal dari konteks Amerika Serikat sehingga tidak dapat digunakan untuk menyimpulkan bahwa tingkat beban dokumentasi dokter di Indonesia memiliki besaran yang sama. Dalam proposal ini, kedua studi digunakan sebagai **evidence awal bahwa beban dokumentasi klinis merupakan permasalahan yang telah terukur dalam workflow pelayanan kesehatan**, sedangkan kondisi dan kebutuhan dokter di Indonesia akan divalidasi secara langsung melalui wawancara dan observasi kepada calon pengguna pada tahap awal pengembangan. 

***Konteks Permasalahan di Indonesia***

Permasalahan dokumentasi menjadi semakin relevan seiring dengan penerapan rekam medis elektronik di Indonesia. Peraturan Menteri Kesehatan Republik Indonesia Nomor 24 Tahun 2022 tentang Rekam Medis mengatur penyelenggaraan rekam medis elektronik pada fasilitas pelayanan kesehatan. Kementerian Kesehatan juga menjelaskan bahwa regulasi tersebut mewajibkan fasilitas pelayanan kesehatan menggunakan rekam medis elektronik sebagai bagian dari pelayanan kesehatan. \[3\]

Kementerian Kesehatan turut mengonfirmasi bahwa rasio dan distribusi dokter masih menjadi tantangan sumber daya manusia kesehatan di Indonesia. Direktur Jenderal Kesehatan Primer dan Komunitas Kementerian Kesehatan, dr. Maria Endang Sumiwi, menyatakan bahwa rasio dokter nasional saat ini masih berada di bawah standar Organisasi Kesehatan Dunia (WHO) sebesar satu dokter per 1.000 penduduk, tertinggal dibandingkan negara lain seperti Singapura (2 dokter per 1.000 penduduk) dan Jerman (4 dokter per 1.000 penduduk). Kementerian Kesehatan turut mencatat bahwa dari sekitar 10.300 puskesmas di seluruh Indonesia, sekitar 400 di antaranya hingga akhir Juli 2026 belum memiliki dokter tetap. \[13\]

***Solusi Sejenis yang Sudah Ada dan Keterbatasannya***

Di tingkat global, kategori produk “AI medical scribe” atau *ambient clinical documentation* sudah berkembang pesat dan mulai menjadi standar di banyak sistem kesehatan Amerika Serikat. Nuance DAX Copilot, Abridge, Suki AI, DeepScribe, dan Ambience Healthcare adalah beberapa pemain utama yang telah terintegrasi dengan EHR besar seperti Epic, dan sejumlah diantaranya meraih penghargaan Best in KLAS pada 2025–2026 \[9\]. Bukti dampaknya pun cukup kuat: studi multisitus berskala besar yang dipublikasikan di JAMA pada April 2026, yang melibatkan 8.581 klinisi rawat jalan di lima sistem kesehatan akademik Amerika Serikat (Mass General Brigham, Emory Healthcare, UC San Francisco, Yale New Haven Health, dan UC Davis) menemukan bahwa adopsi AI scribe berasosiasi dengan pengurangan waktu total di EHR sebesar 13,4 menit dan waktu dokumentasi sebesar 16 menit per delapan jam kerja klinis \[5\]\[6\]. Studi lain berskala lebih kecil bahkan mencatat penurunan prevalensi burnout dari 51,9 persen menjadi 38,8 persen hanya dalam 30 hari pemakaian \[7\], serta penurunan absolut prevalensi burnout sebesar 21,2 persen pada 84 hari di Mass General Brigham \[8\].

Di tingkat lokal, kategori serupa juga sudah mulai berkembang. Setidaknya empat penyedia RME Indonesia telah mengintegrasikan fitur AI scribe berbahasa Indonesia: MedMinutes Scribe (fokus rumah sakit, 60+ RS di 10+ provinsi) \[14\], Assist.id dengan AI VERA (fokus klinik pratama–utama) \[15\], RME Dokterkita (fokus dokter praktik mandiri, model harga pay-per-use) \[16\], dan Periksa.id dengan modul Medical AI (fokus puskesmas, klinik, dan praktik mandiri) \[17\]. Kehadiran pemain lokal ini berarti klaim kebaruan NARASI tidak bisa lagi bertumpu pada "dukungan Bahasa Indonesia" semata, kebaruan perlu ditunjukkan pada kombinasi fitur spesifik yang belum tersedia di pasar lokal maupun global.

Namun, tabel perbandingan berikut menunjukkan mengapa solusi-solusi tersebut belum otomatis relevan untuk konteks layanan primer Indonesia.

| Solusi | Fokus Bahasa & Pasar | Model Bisnis | Keterbatasan bagi Konteks Indonesia |
| :---- | :---- | :---- | :---- |
|  Nuance DAX  Copilot | Bahasa Inggris, sistem kesehatan besar AS | Enterprise, terikat kontrak Microsoft/Epic | Butuh adopsi tingkat sistem kesehatan, bukan dokter individu; tidak dioptimalkan untuk Bahasa Indonesia |
|  Abridge / Suki AI | Bahasa Inggris, klinik & RS AS | Langganan sekitar USD 200–600/klinisi/bulan \[9\]\[12\] | Biaya langganan tidak realistis untuk puskesmas/klinik pratama; integrasi EHR dirancang untuk Epic/Oracle Health, bukan sistem RME lokal |
| Nabla | Multibahasa (\>35 bahasa) | SaaS internasional | Klaim reduksi waktu dokumentasi hingga 70% diukur di praktik klinis Eropa \[10\]; belum ada bukti publik pengujian pada pola percakapan medis Bahasa Indonesia sehari-hari |
| **NARASI (diusulkan)** | Bahasa Indonesia, termasuk ekspresi informal seperti “tiga harian” dan “kambuh-kambuhan”, serta dilengkapi visualisasi organ pasien menggunakan Three.js. | *Berdiri sebagai Non-profit organization*  | *Perlu dibangun dan divalidasi dari nol; belum memiliki rekam jejak klinis* |

| Solusi | Target Pasar | Diarisasi Pembicara | Evidence-Linking  | Auto-Diagnosis/Plan | Model Harga |
| :---- | :---- | :---- | :---- | :---- | :---- |
| MedMinutes Scribe \[14\] | Rumah sakit (skala enterprise) | Ada | Tidak ditemukan (yang ada: edit history/audit log, bukan tautan per-elemen | Ada,  contoh output menyertakan Assessment otomatis | Enterprise, custom quote |
| Assist.id / AI VERA \[15\] | Klinik pratama & utama | Tidak dikonfirmasi publik | Tidak ditemukan | Ada, ICD-10 otomatis \+ rencana tindakan/e-resep otomatis | Mulai \~Rp250rb/bulan \+ add-on |
| RME Dokterkita AI Scribe \[16\] | Dokter praktik mandiri | Tidak ditemukan | Tidak ditemukan | Tidak (untuk modul Scribe inti) | Rp50–200rb/bulan \+ Rp150–300/proses |
| Periksa.id Medical AI \[17\] | Puskesmas, klinik, praktik mandiri | Ada | Tidak ditemukan | Tidak disebutkan eksplisit | Mulai Rp299rb/bulan |
| **NARASI (diusulkan)** | Puskesmas, klinik, praktik mandir | Ada | Ada, inti desain | Sengaja tidak (prinsip doctor-in-the-loop) | Non-profit, harga berjenjang |

Riset akademik yang mendasari pendekatan ini pun belum banyak tersedia untuk konteks Bahasa Indonesia. Kajian tinjauan perkembangan NLP Bahasa Indonesia menunjukkan bahwa penelitian yang ada masih terkonsentrasi pada tugas dasar seperti *stemming*, *part-of-speech tagging*, pencarian informasi lintas bahasa, dan analisis sentimen, sementara ekstraksi informasi klinis terstruktur dari percakapan medis Bahasa Indonesia masih menjadi celah penelitian yang relatif terbuka \[11\]. Keterbatasan NARASI bukan hanya soal produk yang belum ada di pasar Indonesia, tapi juga fondasi risetnya sendiri yang masih tipis

***Posisi Kebaruan dan Pembeda Utama***

Mengacu pada kerangka kebaruan yang lazim dipakai (solusi baru untuk masalah baru, solusi baru untuk masalah lama, atau solusi lama untuk masalah baru), NARASI diposisikan sebagai solusi baru untuk masalah yang sudah dikenal secara global, pada konteks pengguna yang belum tergarap. Documentation burden bukan masalah baru, dan pendekatan speech-to-structured-note pun sudah ada pemainnya di luar negeri. Kebaruan NARASI terletak pada kombinasi berikut, yang secara eksplisit tidak diklaim sebagai “aplikasi pertama di dunia”, melainkan sebagai kombinasi yang belum tersedia dan tervalidasi untuk konteks layanan primer Indonesia: 

1. Fokus pada pola percakapan medis Bahasa Indonesia sehari-hari, termasuk ekspresi non-formal ("sudah tiga harian", "pusingnya kambuh-kambuhan"). Pendekatan serupa (pemetaan bahasa awam ke istilah medis) juga mulai muncul di pemain lokal seperti Periksa.id \[17\], sehingga NARASI tidak mengklaim ini sebagai satu-satunya pembeda, melainkan sebagai kapabilitas dasar yang harus dikuasai dengan baik.  
2. Speaker diarization untuk memisahkan ucapan dokter dan pasien. Fitur ini sudah jadi standar, baik di pemain global maupun lokal (MedMinutes \[14\], Periksa.id \[17\]). NARASI memposisikannya sebagai kebutuhan fungsional dasar (lihat Bagian F), bukan pembeda utama.  
3. Evidence-linked verification: setiap elemen informasi hasil ekstraksi AI dapat ditelusuri kembali ke potongan ucapan sumbernya. Berdasarkan penelusuran terhadap empat penyedia AI scribe berbahasa Indonesia yang teridentifikasi \[14\]\[15\]\[16\]\[17\], tidak satupun yang secara publik mengklaim kapabilitas telusur elemen-ke-ucapan-sumber sedetail ini, sebagian besar hanya menyediakan audit log perubahan (siapa mengubah apa, kapan), yang berbeda konsep dari verifikasi kandungan informasi terhadap ucapan asli.  
4. Doctor-in-the-loop secara tegas: AI tidak pernah membuat kesimpulan diagnosis atau rencana tindakan. Ini kontras langsung dengan dua pemain lokal yang justru menjadikan auto-diagnosis dan auto-plan sebagai fitur jual: MedMinutes Scribe menghasilkan Assessment otomatis \[14\], dan AI VERA menghasilkan rekomendasi ICD-10 sekaligus rencana tindakan dan e-resep otomatis \[15\]. NARASI secara sadar membatasi diri hanya pada dokumentasi Subjective dan Objective, dengan pertimbangan tanggung jawab klinis (Assessment dan Plan tetap sepenuhnya kewenangan dokter).  
5. Model bisnis yang diarahkan untuk terjangkau oleh klinik, puskesmas, dan praktik dokter mandiri berskala kecil. Segmen ini sudah mulai dilayani pemain lokal seperti Periksa.id (mulai Rp299.000/bulan) \[17\] dan Dokterkita (Rp50.000–200.000/bulan) \[16\], sehingga keterjangkauan harga saja tidak lagi menjadi pembeda yang cukup. Nilai jual NARASI pada segmen ini digabungkan dengan poin (c) dan (d): verifikasi tertaut-bukti dan batasan tegas terhadap diagnosis otomatis, pada harga yang tetap kompetitif untuk fasilitas kesehatan primer.

Pembeda utama dibandingkan produk sejenis, baik global maupun lokal, bukan pada "adanya AI" atau "dukungan Bahasa Indonesia", karena kedua hal ini sudah menjadi kategori produk yang mapan bahkan di pasar Indonesia. Pembeda NARASI terletak pada kombinasi evidence-linked verification dan batasan tegas non-diagnostic, sesuatu yang belum ditemukan secara eksplisit pada empat pemain lokal yang paling relevan secara pasar \[14\]\[15\]\[16\]\[17\], maupun pada pemain global yang dibahas sebelumnya.

***Celah Permasalahan dan Solusi yang Ditawarkan***

Berdasarkan permasalahan tersebut, terdapat beberapa kebutuhan yang menjadi dasar pengembangan perangkat lunak:

1. Sistem mampu menangkap percakapan dokter dan pasien dalam Bahasa Indonesia.  
2. Sistem mampu mengubah percakapan menjadi transkrip.  
3. Sistem mampu membedakan pembicara dalam percakapan.  
4. Sistem mampu mengekstraksi informasi klinis penting dari percakapan.  
5. Sistem mampu menyusun informasi tersebut menjadi draf rekam medis terstruktur.  
6. Dokter tetap memiliki kendali untuk memeriksa dan mengubah hasil AI.  
7. Informasi klinis yang dihasilkan AI dapat ditelusuri kembali ke sumber percakapannya.

Berdasarkan kebutuhan tersebut, tim mengembangkan **NARASI: Asisten Dokumentasi Klinis Berbasis AI untuk Membantu Dokter Menyusun Rekam Medis**. NARASI dirancang sebagai aplikasi yang membantu mengubah percakapan konsultasi menjadi draf rekam medis secara terstruktur melalui kombinasi teknologi *speech-to-text*, *speaker diarization*, ekstraksi informasi klinis, dan generasi dokumentasi.

Alur utama NARASI dirancang sebagai berikut:

**Percakapan Dokter–Pasien → Speech-to-Text → Speaker Diarization → Ekstraksi Informasi Klinis → Evidence Linking → Draf Rekam Medis → Review Dokter → Persetujuan Dokter**

Dalam rancangan tersebut, AI tidak digunakan untuk menggantikan keputusan klinis dokter. NARASI berfungsi sebagai **asisten dokumentasi**, sedangkan dokter tetap menjadi pihak yang memeriksa, mengedit, dan menyetujui hasil dokumentasi sebelum digunakan.

***Validasi Awal***

Karena kebutuhan dokumentasi dokter di Indonesia tidak dapat sepenuhnya disimpulkan dari penelitian internasional, tim akan melakukan validasi langsung kepada calon pengguna. Validasi awal direncanakan melalui wawancara semi-terstruktur dengan dokter untuk memahami workflow dokumentasi yang digunakan, bagian yang paling menyita waktu, format dokumentasi yang digunakan, kebutuhan terhadap bantuan AI, serta faktor yang memengaruhi kepercayaan dokter terhadap hasil AI.

Hasil wawancara tersebut akan digunakan untuk memvalidasi dan menyempurnakan kebutuhan fungsional, desain antarmuka, serta fitur NARASI sebelum dilakukan pengujian prototype.

Dengan pendekatan tersebut, pengembangan NARASI tidak hanya didasarkan pada asumsi teknologi, tetapi juga pada **kebutuhan dan workflow pengguna yang divalidasi secara langsung**.

**C. TUJUAN DAN MANFAAT DIKEMBANGKANNYA PERANGKAT LUNAK**

***Tujuan Pengembangan***

1. Membangun purwarupa aplikasi mobile/tablet yang dapat mengubah percakapan dokter dengan pasien menjadi draf rekam medis terstruktur berformat SOAP (Subjective, Objective, Assessment, Plan) melalui pipeline speech-to-text, speaker diarization, dan ekstraksi informasi klinis berbasis NLP.  
2. Mengurangi waktu yang dibutuhkan dokter untuk menyusun catatan dokumentasi per pasien, diukur dan dibandingkan terhadap baseline pencatatan manual pada tahap pengujian (lihat indikator pada tabel di bawah).  
3. Menyediakan mekanisme evidence-linking agar seluruh elemen informasi hasil ekstraksi AI dapat ditelusuri ke ucapan sumbernya, sehingga proses verifikasi oleh dokter berlangsung cepat dan dapat dipertanggungjawabkan.  
4. Memvalidasi kebutuhan dan tingkat penerimaan (acceptance) dokter Indonesia terhadap dokumentasi klinis berbantuan AI melalui wawancara dan pengujian purwarupa langsung. 

***Manfaat***

Manfaat langsung dirasakan oleh dokter sebagai pengguna utama: waktu dan perhatian yang sebelumnya terpakai untuk mengetik dan mengingat detail keluhan pasien dapat dialihkan kembali untuk interaksi tatap muka. Manfaat tidak langsung dirasakan oleh pasien dan fasilitas kesehatan: dokumentasi yang lebih terstruktur dan konsisten berpotensi mengurangi risiko informasi klinis yang terlewat, sekaligus mendukung fasilitas kesehatan primer khususnya di wilayah dengan rasio dokter rendah \[3\] dalam memenuhi kewajiban rekam medis elektronik sesuai Permenkes 24/2022 \[4\] tanpa harus menambah beban administratif pada dokter yang sudah terbatas jumlahnya.

Klaim dampak ini sengaja tidak dinyatakan dalam angka pasti (“menghemat X% waktu dokter”) sebelum tim benar-benar mengujinya pada purwarupa. Studi-studi internasional yang dikutip pada Bagian B menunjukkan rentang dampak yang cukup lebar dari penghematan waktu dokumentasi sekitar 16 menit per delapan jam kerja pada studi multisitus JAMA 2026 \[5\]\[6\], hingga klaim reduksi hingga 70% pada praktik klinis Eropa yang memakai Nabla \[10\]  sehingga angka yang paling jujur untuk dicantumkan di proposal ini adalah target awal yang akan divalidasi tim sendiri, bukan angka yang dipinjam mentah-mentah dari studi luar negeri.

***Indikator Keberhasilan***

| Indikator | Baseline (Dokumentasi Manual) | Target NARASI |
| :---- | :---- | :---- |
| Waktu penyusunan draf dokumentasi per pasien | *\[ISI: hasil pengukuran baseline tim\]* | *\[ISI: target penurunan %, diisi setelah baseline terukur\]* |
| Word Error Rate (WER) transkripsi Bahasa Indonesia | – | *\[ISI: target WER, mis. berdasarkan uji internal tim\]* |
| Precision / Recall / F1-score ekstraksi informasi klinis | – | *\[ISI: target F1-score, diisi setelah anotasi data uji\]* |
| Jumlah edit manual dokter per draf SOAP | *\[ISI: hasil pengukuran baseline tim\]* | *\[ISI: target jumlah edit maksimum\]* |
| System Usability Scale (SUS) | – | ≥ 68 (ambang rata-rata industri untuk usability yang dapat diterima) |

***Rencana Keberlanjutan***

Pada tahap kompetisi, pengembangan dibiayai dari sumber daya tim dan dukungan program kemahasiswaan Universitas Islam Indonesia. Setelah Gemastik, keberlanjutan direncanakan melalui roadmap bertahap: Fase 1 menyelesaikan alur inti percakapan→transkrip→draf SOAP; Fase 2 menambahkan speaker diarization dan modul NLP klinis yang lebih matang; Fase 3 membangun evidence-linking dan skor keyakinan (confidence) per elemen ekstraksi; Fase 4 integrasi ke alur kerja klinis fasilitas kesehatan mitra; dan Fase 5 uji coba terbatas (pilot) di fasilitas kesehatan dengan prosedur etik dan izin yang sesuai. Potensi keberlanjutan pembiayaan jangka panjang mencakup skema kerja sama dengan klinik/puskesmas mitra, potensi inkubasi melalui unit inovasi kampus, serta model harga berjenjang yang menyasar fasilitas kesehatan skala kecil sebagai target utama, bukan sekadar mengikuti model enterprise pemain global.

**D. BATASAN PERANGKAT LUNAK YANG DIKEMBANGKAN**

***Ruang Lingkup Fitur (MVP)***

Untuk menjaga agar klaim proposal ini sepadan dengan yang benar-benar dibangun, cakupan minimum viable product (MVP) NARASI dibatasi pada tujuh alur inti berikut:

1. Merekam percakapan dokter–pasien selama sesi konsultasi.  
2. Mengubah rekaman menjadi transkrip teks (speech-to-text) Bahasa Indonesia.  
3. Mengidentifikasi pembicara (dokter vs. pasien) dari satu rekaman percakapan.  
4. Mengekstraksi informasi klinis dasar (keluhan, durasi, gejala penyerta) dari transkrip.  
5. Menyusun draf rekam medis dalam format SOAP.  
6. Menyediakan antarmuka review bagi dokter untuk memeriksa dan mengedit draf.  
7. Menyimpan status persetujuan (approve) dokter atas draf menjadi rekam medis final.

Yang secara sadar **tidak** dikerjakan pada tahap ini:

1. Diagnosis otomatis atau kesimpulan medis apa pun yang dihasilkan AI tanpa keterlibatan dokter.  
2. Rekomendasi atau peresepan obat.  
3. Integrasi dengan BPJS Kesehatan maupun sistem klaim asuransi.  
4. Integrasi penuh dengan sistem rekam medis elektronik rumah sakit atau EHR pihak ketiga.  
5. Asisten suara (voice assistant) dengan kemampuan perintah kompleks di luar alur dokumentasi.  
6. Dukungan bahasa daerah; versi awal dibatasi pada Bahasa Indonesia.

***Platform dan Lingkungan Target***

Produk yang dihadapi pengguna (dokter) berupa aplikasi *mobile/tablet*, dengan pertimbangan agar dapat dipakai langsung di titik pelayanan tanpa mengganggu alur konsultasi. Arsitektur backend dapat berbasis web/API meski antarmuka yang dilihat pengguna tetap aplikasi mobile/tablet. Spesifikasi perangkat minimum: Menggunakan browser Chrome/Safari/Google .

***Batasan Data, Pengguna, dan Cakupan Uji***

1. Tahap pengembangan awal menggunakan skenario konsultasi simulasi/role-play, bukan data rekam medis pasien sungguhan, untuk menghindari isu etik dan privasi sebelum ada persetujuan formal.  
2. *\[ISI: konfirmasi wilayah/fasilitas kesehatan mitra uji coba (mis. DIY, jejaring dosen/RS pendidikan)\]*  
3. Target populasi uji tahap wawancara pada periode kompetisi ini: **3–5 dokter**, dijaring melalui jaringan personal tim (*purposive/convenience sampling*) karena keterbatasan waktu dan akses formal ke fasilitas kesehatan pada tahap awal pengembangan. Sampel ini digunakan sebagai validasi awal kebutuhan fungsional, bukan representasi statistik populasi dokter Indonesia perluasan sampel melalui kerja sama formal dengan fasilitas kesehatan direncanakan pada tahap pascakompetisi (lihat Rencana Keberlanjutan, Bagian C).  
4. Cakupan awal difokuskan pada konsultasi rawat jalan dengan keluhan umum (bukan kasus gawat darurat atau spesialistik kompleks).

***Asumsi dan Ketergantungan Pihak Ketiga***

1. Ketersediaan dan akurasi layanan speech-to-text Bahasa Indonesia (API pihak ketiga atau model yang disesuaikan tim).  
2. *\[ISI: nama layanan/API STT dan NLP yang benar-benar dipakai tim, beserta batasan kuota/biayanya\]*  
3. Ketersediaan infrastruktur komputasi awan untuk memproses audio dan menjalankan model NLP.  
4. Ketersediaan dokter mitra yang bersedia diwawancarai dan menguji purwarupa, termasuk persetujuan etik yang relevan bila pengujian melibatkan data yang lebih sensitif.

**E. METODOLOGI PENGEMBANGAN PERANGKAT LUNAK**

***Metodologi dan Alasan Pemilihan***

Tim mengusulkan pendekatan **Scrum/Agile** dengan iterasi mingguan atau dua mingguan. Alasannya, pipeline NARASI terdiri atas beberapa modul yang saling bergantung (transkripsi, diarization, ekstraksi NLP, penyusunan SOAP, antarmuka review) dan tingkat akurasinya baru bisa diketahui setelah diuji dengan data nyata secara bertahap karakteristik yang lebih cocok dikembangkan secara iteratif dan diuji ulang tiap sprint, dibandingkan pendekatan Waterfall yang menunda pengujian sampai akhir. Tim menerapkan Scrum yang disederhanakan untuk kelompok kecil: sprint mingguan, sinkronisasi progres via grup WhatsApp, papan tugas di Notion, tanpa peran Scrum Master formal.

***Tahapan dan Linimasa Pengembangan***

| Sprint / Periode | Fokus | Capaian |
| :---- | :---- | :---- |
| Sprint 1 (21–28 Juli 2026\) | Setup repo, riset & tes API speech-to-text Bahasa Indonesia, wireframe alur UI | Setup repo dan interface sudah selesai, masih dalam proses pengerjaan untuk speech-to-text dan API nya, 50% capaian untuk di sprint 1 |
| Sprint 2  (29 Jul–4 Agustus 2026\) | *\[ISI: fokus sprint 2 yang sesungguhnya dikerjakan\]* | *\[ISI: capaian nyata, bukan rencana\]* |
| Sprint 3 (5–11 Agustus 2026\) | Ekstraksi informasi klinis (versi awal), mockup draft SOAP di UI | Mockup draft awal SOAP di UI sudah berjalan  |
| Sprint 4 (12–14 Agustus 2026\) | Integrasi review/approve UI, perbaikan bug, siapkan demo dan pengumpulan | Sedang dalam proses pengerjaan |

***Pembagian Peran Tim***

1. Product/Research: Gusti Surya Aditama (25523053): memimpin definisi masalah, wawancara pengguna, dan metodologi riset.  
2. AI/ML: Muhammad Dzaky Abdurrahman (25311205): bertanggung jawab atas speech-to-text, diarization, NLP, dan ekstraksi informasi.  
3. Application/Backend: Gusti Fadhilah Ahmad(25531008): bertanggung jawab atas arsitektur, backend, basis data, dan API.  
4. UI/UX: Gusti Surya Aditama (25523053): bertanggung jawab atas alur pengguna, purwarupa antarmuka, dan desain interaksi.

***Perkakas yang Digunakan***

1. Version control: GitHub, [https://github.com/dzakyabdurhmn/med](https://github.com/dzakyabdurhmn/med)  
2. Manajemen tugas/issue tracker: Google Keep, Linear  
3. Alat desain: Figma, Eraser  
4. CI/CD dan alat pengujian: belum diterapkan, direncanakan Fase berikutnya

***Strategi Pengujian dan Penjaminan Mutu***

1. Unit test pada tiap modul pipeline (transkripsi, diarization, ekstraksi NLP) secara terpisah sebelum diintegrasikan.  
2. Integration test pada alur end-to-end: rekaman → transkrip → ekstraksi → draf SOAP → review dokter.  
3. User acceptance test bersama dokter mitra, mengukur indikator pada Bagian C (waktu dokumentasi, jumlah edit, SUS).

***Bukti Proses***

1. GitHub : [https://github.com/dzakyabdurhmn/med](https://github.com/dzakyabdurhmn/med)  
2. *\[ISI: tangkapan layar papan tugas (Kanban/Scrum board) yang menunjukkan riwayat sprint\]*  
3. *\[ISI: ringkasan riwayat commit yang relevan, mis. jumlah commit dan kontributor per modul\]*

**F. ANALISIS KEBUTUHAN DAN DESAIN SOLUSI PERANGKAT LUNAK**

***Metode Penggalian Kebutuhan***

Kebutuhan digali melalui dua jalur. Pertama, kajian literatur dokumentasi klinis internasional (Bagian B) dipakai untuk merumuskan hipotesis awal kebutuhan sebelum bertemu pengguna. Kedua, wawancara semi-terstruktur direncanakan terhadap 3-5 dokter (lihat Bagian D) dengan pertanyaan seputar alur pencatatan rekam medis saat ini, bagian dokumentasi yang paling menyita waktu, apakah format SOAP dipakai, kesalahan dokumentasi yang paling sering terjadi, bagian mana yang dirasa aman dibantu AI, dan apa yang dibutuhkan dokter agar bersedia mempercayai hasil AI.

Ringkasan temuan wawancara: Wawancara dilakukan terhadap empat narasumber dengan latar praktik berbeda: dokter spesialis anak, dokter umum di puskesmas, dokter spesialis bedah toraks, dan dokter dalam pendidikan spesialis patologi. Variasi ini dipilih untuk menangkap kebutuhan dokumentasi di luar rawat jalan reguler, meski cakupan MVP NARASI tetap difokuskan pada rawat jalan dengan keluhan umum (lihat Bagian D). Metode menyesuaikan ketersediaan narasumber: panggilan video untuk dua narasumber, voice note asinkron untuk satu narasumber, dan satu narasumber lagi masih dijadwalkan.

| Kode  | Gelar/Spesialisasi | Tempat Praktik | Lama Praktik | Tanggal dan Metode Wawancara |
| :---- | :---- | :---- | :---- | :---- |
| Narasumber 1 (dr. M) | Dokter spesialis anak | Klinik AMS, Jakarta | ±2 tahun (sebagai dokter umum) | 9 Agustus 2026, video call ±33 menit |
| Narasumber 2 (dr. G) | Dokter spesialis Bedah Toraks |  |  |  |
| Narasumber 3 (dr.ODP) | Dokter Umum  | RSU Suyudi Paciran | 10 Bulan | 10 Agustus 2026 voice note |
| Narasumber 4 (dr. S) | Dokter Umum  |  |  | 11 Agustus 2026 Video call ± |

**1\. Profil praktik & beban waktu**  
Beban kerja bervariasi menurut jenis layanan. Narasumber M menangani sekitar 10 pasien rawat jalan per hari dengan durasi 15 sampai 30 menit untuk pasien baru dan 10 sampai 15 menit untuk kontrol, rasio waktu interaksi terhadap waktu menulis sekitar 3:1. Narasumber ODP, di puskesmas, melaporkan volume jauh lebih tinggi: 30 sampai 40 pasien per hari di poli umum, bisa sampai 100 pasien setelah libur panjang, dengan durasi konsultasi lebih singkat (7 sampai 10 menit) karena volume tersebut. Poli ibu hamil membutuhkan waktu lebih lama karena ada USG dan pengukuran tinggi fundus uteri..

**2\. Bagian paling menyita waktu**  
Kedua narasumber menulis dokumentasi secara real-time selama konsultasi untuk menghindari lupa detail. Namun ada pola berbeda: M menulis Subjective dan Objective langsung ke ERM, sementara resep ditulis di kertas dulu untuk pasien tukar ke farmasi, baru dipindah ke ERM setelah pasien keluar. Bagian paling menyita waktu juga berbeda: M menyebut anamnesis di awal dan edukasi/plan di akhir, sedangkan ODP secara spesifik menyebut pengisian tanda-tanda vital sebagai paling melelahkan, karena format formulir memecah tiap parameter (tensi, nadi, RR, SpO2) ke kotak terpisah, bukan karena datanya sulit didapat. ODP juga menyebut resep racikan pasien anak sebagai beban tambahan karena jumlah komponen obatnya banyak.

**3\. Informasi yang berpotensi terlewat**  
Kedua narasumber sepakat bahwa informasi yang terlewat umumnya bukan karena lupa, melainkan karena kondisi ramai memaksa dokter memprioritaskan hal esensial. M menyebut ini bisa berupa pertanyaan yang belum sempat diajukan atau pemeriksaan yang belum dilakukan. ODP lebih spesifik: detail tanda vital sekunder seperti GCS atau akral hangat sering dilewati, hanya tensi dan nadi yang konsisten dicatat.

**4\. Tanggapan terhadap konsep NARASI**  
M merespons positif terhadap ide draf otomatis dari rekaman, dibanding pengalaman sebelumnya dengan sistem formulir web yang tetap harus diisi manual. Ia menekankan pentingnya AI menangkap negasi pemeriksaan secara akurat (misalnya "mata tidak kuning") dan idealnya bisa memetakan istilah awam pasien ke istilah medis (misalnya "kentut" menjadi "flatus"), meski hasil berbahasa awam pun masih bisa diterima selama dokter bisa membaca dan mengedit. ODP menambahkan sudut pandang yang belum muncul dari M: risiko akurasi pada percakapan bercampur bahasa daerah. Kalau transkripsi gagal menangkap percakapan campuran Indonesia, Jawa, atau Madura dengan baik, proses verifikasi manual justru menambah beban, bukan menguranginya, sampai titik ia lebih memilih mengetik ulang dari awal. Temuan ini menjadi risiko yang perlu diakui secara eksplisit di Bagian D (lihat catatan di bawah).

**5\. Preferensi mekanisme verifikasi (evidence-linking)**  
Kedua narasumber, secara terpisah, memilih membaca transkrip teks dibanding memutar ulang audio, karena audio dianggap terlalu lambat untuk penggunaan rutin. Audio tetap dianggap berguna sebagai opsi sekunder untuk kasus yang terasa janggal. Konsistensi temuan ini pada dua dari dua narasumber yang ditanya memperkuat justifikasi desain evidence-linking berbasis teks pada NARASI.

**6\. Batasan yang disarankan**  
M tegas menyatakan AI sebaiknya tidak diberi kewenangan menyusun diagnosis atau assessment/plan, karena tiap pasien membutuhkan penalaran klinis yang berbeda. ODP belum setegas itu, ia masih mempertimbangkan apakah AI sebaiknya membantu menulis saja atau juga membantu memikirkan diagnosis. Perbedaan ini menunjukkan pemahaman batasan AI belum seragam antar dokter, sehingga antarmuka NARASI perlu mengomunikasikan batasan doctor-in-the-loop secara eksplisit dan visual (lihat status "Doctor input required" pada rencana mockup Gambar 4), bukan diasumsikan sudah dipahami pengguna.

**7\. Kebutuhan tambahan di luar cakupan MVP**  
M berulang kali menyebut ekstraksi otomatis hasil laboratorium dari foto atau tabel sebagai kebutuhan paling nyata, karena penyalinan manual dianggap membuang waktu. ODP awalnya menyebut kebutuhan serupa untuk formulir rawat inap dan persetujuan tindakan, namun setelah klarifikasi ulang mengonfirmasi bahwa untuk pasien rawat jalan kesulitannya sama seperti M, yaitu pengisian tanda vital dan resep, tanpa formulir tambahan yang kompleks. Kedua kebutuhan ini dicatat sebagai potensi pengembangan lanjutan, di luar cakupan MVP kompetisi ini (lihat Bagian D).

**8\. Syarat minimal adopsi**  
M mengutamakan agar dokter tidak perlu memikirkan proses mengetik saat konsultasi berlangsung, dengan kemudahan koreksi cepat untuk typo. ODP menambahkan syarat akurasi: transkripsi perlu mendekati akurasi penuh untuk audio dokter-pasien, khususnya pada kondisi wicara campur bahasa daerah, karena di bawah itu proses verifikasi jadi kontraproduktif.

***Kebutuhan Fungsional***

1. Sistem dapat merekam percakapan dokter dengan pasien selama sesi konsultasi berlangsung.  
2. Sistem dapat menghasilkan transkrip teks dari rekaman audio Bahasa Indonesia.  
3. Sistem dapat memisahkan ucapan dokter dan pasien (speaker diarization) dari satu rekaman.  
4. Sistem dapat mengekstraksi informasi klinis dasar (keluhan, durasi, gejala penyerta, onset) dari transkrip.  
5. Sistem dapat menyusun draf rekam medis dalam format SOAP berdasarkan hasil ekstraksi.  
6. Sistem dapat menampilkan sumber ucapan (evidence) untuk tiap elemen informasi yang diekstraksi, agar dokter dapat menelusuri asal informasi tersebut.  
7. Sistem menyediakan antarmuka bagi dokter untuk mengedit draf sebelum menyetujuinya.  
8. Sistem mencatat status dokumentasi (AI Generated, Review Required, Final) dan riwayat persetujuan.

***Kebutuhan Non-Fungsional***

1. Kinerja: proses transkripsi dan ekstraksi berlangsung dalam rentang waktu yang wajar bagi alur konsultasi (idealnya mendekati waktu nyata untuk transkrip).  
2. Keamanan: enkripsi data audio dan transkrip, kontrol akses berbasis peran (dokter vs. admin), dan pembatasan akses ke rekam medis yang belum disetujui.  
3. Privasi (privacy-by-design): data uji tahap awal berupa skenario simulasi, bukan data pasien sungguhan (lihat Bagian D); untuk pemrosesan data nyata pada tahap lanjut, sistem dirancang mengikuti prinsip minimisasi data dan masa retensi sesuai Permenkes 24/2022, yang mewajibkan penyimpanan rekam medis elektronik paling singkat 25 tahun sejak kunjungan terakhir pasien dengan jaminan keamanan data \[4\].  
4. Ketersediaan: sistem dapat diakses selama jam operasional fasilitas kesehatan tanpa gangguan berarti.  
5. Aksesibilitas dan usability: antarmuka dirancang untuk interaksi minimal di titik pelayanan, dengan kontras warna dan ukuran elemen yang sesuai untuk perangkat tablet.

***Profil Pengguna (Persona)***

Persona utama: **Dokter Umum**, pengguna aktif yang memulai sesi, meninjau, mengedit, dan menyetujui rekam medis. Persona sekunder: **Pasien**, pihak yang terlibat dalam percakapan namun tidak berinteraksi langsung dengan aplikasi.

***Skenario Penggunaan (Use Case)***

1. Dokter memulai sesi konsultasi dan mengaktifkan perekaman.  
2. Sistem menghasilkan transkrip dan memisahkan ucapan dokter/pasien secara berjalan.  
3. Sistem menampilkan ringkasan ekstraksi klinis (keluhan, durasi, gejala) setelah sesi selesai.  
4. Dokter meninjau draf SOAP, membuka evidence view untuk memeriksa sumber ucapan bila diperlukan.  
5. Dokter mengedit bagian yang kurang tepat, khususnya Assessment dan Plan yang tetap sepenuhnya menjadi keputusan dokter.  
6. Dokter menyetujui (approve) draf sehingga berstatus rekam medis final.

Diagram use case formal (aktor–kasus penggunaan) disarankan digambar tim menggunakan draw.io atau sejenisnya berdasarkan daftar skenario di atas, lalu disisipkan sebagai gambar bernomor pada versi akhir proposal.

***Desain Arsitektur Sistem***

Arsitektur tingkat tinggi yang diusulkan terdiri atas lapisan berikut:

1. Klien mobile/tablet: antarmuka dokter untuk merekam, meninjau, mengedit, dan menyetujui dokumentasi.  
2. Backend API: mengatur autentikasi, otorisasi, dan orkestrasi alur pemrosesan antar-modul.  
3. Layanan Speech-to-Text: mengubah audio percakapan menjadi transkrip Bahasa Indonesia.  
4. Modul Speaker Diarization: memisahkan segmen ucapan dokter dan pasien.  
5. Modul Medical NLP / Ekstraksi Informasi: mengidentifikasi entitas klinis (keluhan, durasi, gejala) dari transkrip.  
6. Modul SOAP Structuring: menyusun entitas klinis ke dalam format Subjective–Objective–Assessment–Plan.  
7. Basis data: menyimpan sesi konsultasi, transkrip, entitas klinis, draf, dan status persetujuan.

Diagram arsitektur bergaya kotak-panah sebaiknya digambar tim untuk melengkapi deskripsi tekstual ini pada versi akhir proposal, mengikuti alur: Klien Mobile → Backend API → (STT → Diarization → NLP → SOAP Structuring) → Basis Data → kembali ke Klien Mobile untuk tahap review.

***Rancangan Basis Data (Entitas Utama)*** 

| Entitas | Atribut Kunci & Relasi |
| :---- | :---- |
| Dokter | id\_dokter, nama, spesialisasi, kredensial. Relasi: satu Dokter memiliki banyak SesiKonsultasi. |
| Pasien | id\_pasien (tersamarkan/pseudonim pada data uji), data minimum yang diperlukan. Relasi: satu Pasien dapat memiliki banyak SesiKonsultasi. |
| SesiKonsultasi | id\_sesi, id\_dokter, id\_pasien, waktu\_mulai, waktu\_selesai, status. Relasi: satu SesiKonsultasi memiliki satu Transkrip dan satu DraftRekamMedis. |
| Transkrip | id\_transkrip, id\_sesi, teks, label\_pembicara, timestamp\_segmen. Relasi: satu Transkrip memiliki banyak EntitasKlinis. |
| EntitasKlinis | id\_entitas, id\_transkrip, jenis (keluhan/durasi/gejala), nilai, referensi\_ucapan\_sumber (untuk evidence-linking). |
| DraftRekamMedis | id\_draft, id\_sesi, subjective, objective, assessment, plan, status (AI Generated/Review Required/Final). |
| LogPersetujuan | id\_log, id\_draft, id\_dokter, waktu\_persetujuan, catatan\_edit. |

Rancangan di atas dapat divisualisasikan tim sebagai diagram ERD menggunakan dbdiagram.io atau draw.io sebelum dilampirkan pada versi akhir proposal sebagai gambar bernomor.

Secara keseluruhan, setiap kebutuhan fungsional pada bagian ini dijawab langsung oleh salah satu modul arsitektur: kebutuhan perekaman dan transkripsi dijawab oleh layanan Speech-to-Text; kebutuhan pemisahan pembicara dijawab oleh modul Diarization; kebutuhan ekstraksi klinis dan evidence-linking dijawab oleh modul Medical NLP beserta atribut referensi\_ucapan\_sumber pada entitas EntitasKlinis; dan kebutuhan review-edit-approve dijawab oleh antarmuka klien mobile yang berinteraksi dengan entitas DraftRekamMedis dan LogPersetujuan.

**G. IMPLEMENTASI PERANGKAT LUNAK**

***Teknologi yang Digunakan***

1. Aplikasi mobile/tablet: React   
2. Backend: Typescript   
3. Basis data: PostgreSQL  
4. Layanan Speech-to-Text: (dalam proses pengerjaan)  
5. Modul NLP/ekstraksi informasi: *\[ISI: pendekatan/model yang dipakai, mis. fine-tuning model bahasa untuk Bahasa Indonesia\]*  
6. Layanan pihak ketiga lain: *\[ISI: mis. layanan cloud, autentikasi\]*

***Daftar Fitur dan Kemajuan***

| Fitur | Status | Catatan |
| :---- | :---- | :---- |
| Perekaman percakapan | Sedang Dikerjakan |  |
| Transkripsi (speech-to-text) | Sedang Dikerjakan |  |
| Speaker diarization | Sedang Dikerjakan |  |
| Ekstraksi informasi klinis | Sedang Dikerjakan |  |
| Penyusunan draf SOAP | Sudah Dikerjakan |  |
| Evidence-linked verification | Sudah Dikerjakan |  |
| Antarmuka review, edit, dan approve dokter | Sudah Dikerjakan | Antarmuka sudah berjalan dengan baik dan mampu digunakan |
| **Persentase kemajuan keseluruhan** | 50% |  |

***Bagian Teknis yang Menjadi Keunggulan***

Sebagaimana diuraikan pada Bagian B dan F, keunggulan teknis yang ingin ditonjolkan tim adalah kombinasi speaker diarization dan evidence-linking yang disesuaikan dengan pola percakapan medis Bahasa Indonesia, bukan sekadar pemanggilan API speech-to-text generik. *\[ISI: jelaskan pendekatan teknis konkret yang benar-benar diimplementasikan, mis. teknik fine-tuning, aturan linguistik tambahan untuk ekspresi durasi/onset informal, atau prompt engineering yang dipakai\]*

***Hasil Pengujian dan Kendala Teknis***

1. *\[ISI: hasil pengujian aktual, mis. akurasi transkripsi pada data uji tim\]*  
2. *\[ISI: kendala teknis yang ditemukan dan cara penanganannya\]*

***Tautan Repositori dan Demo***

1. *\[ISI: tautan repositori (dengan akses untuk juri bila privat)\]*  
2. *\[ISI: tautan aplikasi uji coba atau video demonstrasi\]*

**H. SCREENSHOT MOCKUP INTERFACE PERANGKAT LUNAK**

1. Gambar 1  Layar mulai sesi konsultasi/perekaman.  
2. Gambar 2 Tampilan saat transkripsi/analisis sedang berjalan (mis. indikator “Merekam”, “Mentranskripsi…”, “Menganalisis…”).  
3. Gambar 3  Ringkasan hasil ekstraksi klinis (keluhan, durasi, gejala penyerta).  
4. Gambar 4  Draf SOAP beserta status tiap bagian (mis. “Doctor input required” untuk Assessment dan Plan).  
5. Gambar 5  Evidence view yang menunjukkan sumber ucapan untuk elemen informasi tertentu.  
6. Gambar 6  Tombol edit dan approve, serta tampilan setelah rekam medis berstatus final.  
   *\[ISI: sisipkan tangkapan layar aktual pada tiap poin di atas beserta keterangan gambar bernomor\]*

***Prinsip Desain yang Digunakan***

1. Konsistensi komponen antarmuka di seluruh layar (tombol, kartu informasi, indikator status).  
2. Hierarki visual yang menempatkan informasi klinis penting (keluhan, durasi) lebih menonjol dibanding elemen sekunder.  
3. Palet warna yang menimbulkan kesan tenang dan profesional untuk konteks klinis (mis. dominasi biru/putih dengan aksen hijau untuk status “selesai/disetujui”).  
4. Tipografi yang mudah dibaca cepat di sela konsultasi, dengan ukuran huruf yang memadai untuk perangkat tablet.  
5. Aksesibilitas: kontras warna memadai dan target sentuh (tap target) yang cukup besar agar dapat dioperasikan dengan interaksi minimal.

Hasil pengujian usability (jumlah responden, temuan, dan perbaikan yang dilakukan): 

*\[ISI: isi dengan hasil pengujian nyata bila tim sudah melakukan uji usability terhadap purwarupa\]*

**I. DOKUMENTASI CARA PENGGUNAAN PERANGKAT LUNAK**

***Instalasi/Akses***

1. *\[ISI: cara mengunduh/mengakses aplikasi, mis. tautan TestFlight/APK/tautan web, beserta kebutuhan perangkat\]*

***Panduan Penggunaan***

1. Langkah 1 Masuk (login) sebagai dokter.  
2. Langkah 2 Memulai sesi konsultasi dan mengaktifkan perekaman.  
3. Langkah 3 Menunggu proses transkripsi dan ekstraksi selesai.  
4. Langkah 4  Meninjau ringkasan ekstraksi dan draf SOAP.  
5. Langkah 5  Mengedit bagian yang diperlukan, memeriksa evidence view bila perlu.  
6. Langkah 6 Menyetujui (approve) draf hingga berstatus rekam medis final.

*\[ISI: foto menyusul tiap langkah, tampilan masih on progres pengembangan dari figma\]*

***Akun Demo***

1. *\[ISI: username dan kata sandi akun demo untuk keperluan penjurian\]*

***Video Demonstrasi***

1. *\[ISI: tautan video demonstrasi singkat, bila tersedia\]*

***FAQ Singkat***

1. Apakah NARASI membuat diagnosis? Tidak. NARASI hanya membantu menyusun draf dokumentasi; Assessment dan Plan tetap sepenuhnya keputusan dokter.  
2. Apakah data pasien pada purwarupa ini nyata? Tidak. simulasi/role-play, bukan data pasien sungguhan

**DAFTAR PUSTAKA**

\[1\] Overhage, J.M., & McCallie, D. (2020). Physician Time Spent Using the Electronic Health Record During Outpatient Encounters: A Descriptive Study. Annals of Internal Medicine, 172(3), 169–174. https://doi.org/10.7326/M18-3684

\[2\] Gaffney, A., Woolhandler, S., Cai, C., Bor, D., Himmelstein, J., McCormick, D., & Himmelstein, D.U. (2022). Medical Documentation Burden Among US Office-Based Physicians in 2019: A National Study. JAMA Internal Medicine, 182(5), 564–566. https://doi.org/10.1001/jamainternmed.2022.0372

\[3\] GoodStats, diolah dari data Kementerian Kesehatan RI. (2025). 10 Provinsi dengan Dokter Terbanyak 2025\. Diakses Agustus 2026, dari https://goodstats.id/article/10-provinsi-dengan-dokter-terbanyak-2025-G7RAE

\[4\] Peraturan Menteri Kesehatan Republik Indonesia Nomor 24 Tahun 2022 tentang Rekam Medis.

\[5\] Ivanova, J. (2026, 22 Juni). Large JAMA Study Finds AI Scribes Cut Documentation Time for Ambulatory Clinicians. Telehealth.org. https://telehealth.org/news/large-jama-study-finds-ai-scribes-cut-documentation-time-for-ambulatory-clinicians/ (melaporkan studi multisitus JAMA, April 2026, Ambient Clinical Documentation Collaborative, UCSF & Mass General Brigham).

\[6\] HIT Consultant. (2026, 1 April). JAMA Study: AI Scribes Deliver Modest EHR Time Savings Across 5 Major Health Systems. https://hitconsultant.net/2026/04/01/jama-ai-scribe-study-ehr-time-savings-burnout-reality-check/

\[7\] Olson, K.D., Meeker, D., Troup, M., Barker, T.D., Nguyen, V.H., Manders, J.B., Stults, C.D., Jones, V.G., Shah, S.D., Shah, T., & Schwamm, L.H. (2025). Use of Ambient AI Scribes to Reduce Administrative Burden and Professional Burnout. JAMA Network Open, 8(10), e2534976. https://doi.org/10.1001/jamanetworkopen.2025.34976

\[8\] You, J.G., Dbouk, R.H., Landman, A., Ting, D.Y., Dutta, S., et al. (2025). Ambient Documentation Technology in Clinician Experience of Documentation Burden and Burnout. JAMA Network Open, 8(8), e2528056. https://doi.org/10.1001/jamanetworkopen.2025.28056

\[9\] OmniMD. (2026). Best AI Medical Scribes in 2026: 15 Tools Reviewed by Expert. https://omnimd.com/blog/best-medical-ai-scribes/

\[10\] Netray. (2025). NLP dalam Catatan Medis Dokter: Cara Kerjanya dan Manfaat untuk Praktik Klinis [https://analysis.netray.id/nlp-dalam-catatan-medis-untuk-praktik-klinis/](https://analysis.netray.id/nlp-dalam-catatan-medis-untuk-praktik-klinis/)

\[11\] ELANG: Journal of Interdisciplinary Research. (2023). Sejarah dan Perkembangan Teknik Natural Language Processing (NLP) Bahasa Indonesia. [https://jurnal.ubhinus.ac.id/elang/article/view/990](https://jurnal.ubhinus.ac.id/elang/article/view/990)

\[12\] The Leveraged Years. (2026, 28 Juni). Ambient AI Scribe ROI: What Health Systems Are Learning in 2026\. [https://www.theleveragedyears.com/ai-workflows/ambient-ai-scribe-roi-health-systems-2026](https://www.theleveragedyears.com/ai-workflows/ambient-ai-scribe-roi-health-systems-2026)

\[13\] Desideria, B. (2026, 30 Juli). *Kemenkes: 400 Puskesmas Tidak Ada Dokter*.   Liputan6.com. Diakses Agustus 2026, dari [https://kesehatan.liputan6.com/info-sehat/read/8258026/kemenkes-400-puskesmas-tidak-ada-dokter](https://kesehatan.liputan6.com/info-sehat/read/8258026/kemenkes-400-puskesmas-tidak-ada-dokter)

\[14\] MedMinutes. (2026). AI Medical Scribe untuk Rumah Sakit Indonesia. 

     	Diakses Agustus 2026, dari [https://medminutes.io/scribe.html](https://medminutes.io/scribe.html)

\[15\] Assist.id. (2026). AI Vera \- AI Rekam Medis Otomatis untuk Klinik. 

     	Diakses Agustus 2026, dari [https://assist.id/produk/ai-vera](https://assist.id/produk/ai-vera)

\[16\] Dokterkita. (2026). Perbandingan Fitur AI di RME Praktik Dokter di 

     	Indonesia. Diakses Agustus 2026, dari 

   	https://dokterkita.id/perbandingan-fitur-ai-di-rme-praktik-dokter-di-indonesia/

\[17\] Periksa.id. (2026). Solusi Praktik Dokter \- Medical AI Voice-to-Text. 

     	Diakses Agustus 2026, dari https://www.periksa.id/solusi/praktik-dokter

[image1]: <data:image/png;base64,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>