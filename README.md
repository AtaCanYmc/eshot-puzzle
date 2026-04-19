# ESHOT Puzzle

ESHOT Puzzle, İzmir toplu taşıma durakları ve hatlarıyla oynanan bir bulmaca/oyun uygulamasıdır. Kullanıcılar, başlangıç ve hedef duraklar arasında en kısa veya en ilginç rotayı bulmaya çalışır.

## Özellikler
- React + TypeScript + Vite altyapısı
- Leaflet ile interaktif harita
- Gerçek ESHOT durak ve hat verileri
- Mobil ve masaüstü uyumlu arayüz
- Tema (açık/koyu) desteği
- Otomatik GitHub Pages deploy (CI)

## Kurulum

Projeyi klonladıktan sonra bağımlılıkları yükleyin:

```bash
npm install
```

Geliştirme sunucusunu başlatmak için:

```bash
npm run dev
```

## Build

Prodüksiyon için derleme almak için:

```bash
npm run build
```

Çıktılar `dist/` klasöründe oluşur.

## Otomatik Deploy (GitHub Pages)

Ana branch'e (main/master) pushladığınızda, proje otomatik olarak GitHub Pages'a deploy edilir. Yeni branch açılmaz, mevcut branch üzerinden çalışır.

- CI/CD pipeline: `.github/workflows/deploy-pages.yml`
- Build edilen dosyalar otomatik olarak `gh-pages` branch'ine aktarılır.

## Proje Yapısı

```
src/
  components/   # React bileşenleri
  hooks/        # Özel React hook'ları
  pages/        # Sayfa bileşenleri
  service/      # API ve servis katmanı
  types/        # Tip tanımları
  utils/        # Yardımcı fonksiyonlar
  assets/       # Görseller
public/         # Statik dosyalar
```

## Katkı Sağlama

Pull request'ler ve issue'lar açıktır. Katkıda bulunmak için lütfen fork'layıp PR gönderin.

## Lisans

MIT

---

### Teknik Notlar
- Proje Vite ile başlatıldı.
- Harita için [react-leaflet](https://react-leaflet.js.org/) ve [leaflet](https://leafletjs.com/) kullanılır.
- Otomatik deploy için [peaceiris/actions-gh-pages](https://github.com/peaceiris/actions-gh-pages) kullanılır.
