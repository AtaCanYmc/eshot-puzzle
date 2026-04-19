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

## Ortam Değişkenleri ve Güvenlik

- Ortam değişkenlerinizi (örn. API anahtarları) GitHub Secrets olarak tanımlayabilirsiniz.
- CI/CD pipeline'ında, bu secret'lar otomatik olarak `.env` dosyasına yazılır ve sadece build sırasında kullanılır.
- `.env` dosyası `.gitignore` içinde olmalı ve repoya asla eklenmemelidir.
- **Dikkat:** Vite gibi frontend projelerinde, `VITE_` ile başlayan değişkenler build sırasında herkese açık hale gelir. Gerçekten gizli kalması gereken anahtarları frontend'e koymayın!

### Örnek: GitHub Actions ile .env dosyası oluşturma

Workflow dosyanıza aşağıdaki adımı ekleyin:

```yaml
- name: Create .env file from secrets
  run: |
    echo "VITE_API_URL=${{ secrets.VITE_API_URL }}" >> .env
    # Diğer değişkenler için de aynı şekilde ekleyin
```

Bu adım, sadece CI ortamında geçici bir `.env` dosyası oluşturur. Dosya repoya eklenmez ve build sırasında kullanılır.

## GitHub Actions ve GITHUB_TOKEN Hakkında

- Deploy işlemi için ek bir token eklemenize gerek yoktur.
- `github_token: ${{ secrets.GITHUB_TOKEN }}` satırı, GitHub Actions tarafından otomatik olarak sağlanır.
- Sadece repo ayarlarından **Settings → Actions → General → Workflow permissions** kısmında "Read and write permissions" seçili olmalıdır.
- Bu ayar sayesinde workflow dosyanız otomatik olarak gh-pages branch'ine deploy işlemini yapabilir.

Özetle: GITHUB_TOKEN'ı manuel eklemenize gerek yok, GitHub Actions otomatik olarak sağlar.
