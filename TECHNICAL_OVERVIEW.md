# ESHOT Puzzle Projesi Teknik Dokümantasyonu

## Genel Bakış
ESHOT Puzzle, React ve TypeScript kullanılarak geliştirilmiş, harita tabanlı bir bulmaca oyunudur. Kullanıcılar, harita üzerinde rastgele durakları bulmaya çalışır. Proje, modern frontend araçları (Vite, TailwindCSS) ve harita işlemleri için Leaflet kütüphanesini kullanır.

---

## Temel Teknolojiler
- **React**: UI oluşturmak için ana framework.
- **TypeScript**: Tip güvenliği ve geliştirme kolaylığı sağlar.
- **Vite**: Hızlı geliştirme sunucusu ve build aracı.
- **TailwindCSS**: Utility-first CSS framework.
- **Leaflet**: Harita işlemleri için JS kütüphanesi.
- **Supabase**: (Varsa) Backend servisleri ve veritabanı işlemleri için.

---

## Klasör Yapısı
```
eshot-puzzle/
├── public/                # Statik dosyalar (ikonlar, görseller)
├── src/
│   ├── assets/            # Proje görselleri
│   ├── components/        # UI bileşenleri (Button, Modal, Map vs.)
│   ├── pages/             # Sayfa bileşenleri (GamePage)
│   ├── service/           # API ve yardımcı servisler (eshotService, supabaseClient)
│   ├── types/             # Tip tanımları
│   ├── index.css          # Global stiller
│   ├── main.tsx           # Uygulama giriş noktası
│   └── App.tsx            # Ana uygulama bileşeni
├── test/                  # Test dosyaları
├── package.json           # Bağımlılıklar ve scriptler
├── tailwind.config.cjs    # Tailwind yapılandırması
├── vite.config.ts         # Vite yapılandırması
└── ...
```

---

## Ana Bileşenler
- **Button.tsx**: Farklı varyantlarda (primary/secondary) özelleştirilebilir buton.
- **GameStartModal.tsx**: Oyun başlangıç modalı.
- **RandomStopsMap.tsx**: Leaflet ile harita ve durakların gösterimi.
- **GamePage.tsx**: Oyun akışının yönetildiği ana sayfa.

---

## Harita Entegrasyonu
- **Leaflet** kullanılır.
- `leaflet/dist/leaflet.css` mutlaka import edilmelidir.
- Harita ve parent container'lara `h-full w-full min-h-[400px]` gibi class'lar verilmelidir.
- TileLayer URL'si: `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png`

---

## Stil Yönetimi
- **TailwindCSS** ile utility-first yaklaşım.
- Özel gradientler, cam efekti, responsive padding ve font stilleri.

---

## Servisler
- **eshotService.ts**: Durak verilerini çeker ve işler.
- **supabaseClient.ts**: Supabase ile bağlantı ve veri işlemleri.

---

## Testler
- `test/service/eshotService.test.ts`: Servis fonksiyonlarının birim testleri.

---

## Build ve Çalıştırma
1. Bağımlılıkları yükle: `npm install`
2. Geliştirme sunucusunu başlat: `npm run dev`
3. Testleri çalıştır: `npm test`

---

## Sık Karşılaşılan Sorunlar & Çözümler
- **Harita yüklenmiyor:** Leaflet CSS importunu ve container yüksekliklerini kontrol et.
- **Stil bozuklukları:** Tailwind/PostCSS hatalarını terminalden takip et.
- **Tile'lar gelmiyor:** Network sekmesinden tile isteklerini incele.

---

## Katkı ve Geliştirme
- Kod standartları için ESLint ve TypeScript kuralları uygulanır.
- Yeni bileşenler `src/components/` altında eklenmeli.
- Servisler ve tipler ilgili klasörlerde tutulmalı.

---

## Lisans
MIT

