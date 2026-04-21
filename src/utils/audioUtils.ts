import { Howl, Howler } from 'howler';

/**
 * Belirtilen ses dosyasını çalar.
 * @param src Ses dosyasının yolu
 * @param volume Ses seviyesi (0.0 - 1.0 arası)
 * @returns Howl örneği (durdurmak için kullanılabilir)
 */
export function playSound(src: string, volume: number = 1.0): Howl {
  const sound = new Howl({
    src: [src],
    volume,
  });
  sound.play();
  return sound;
}

/**
 * Tüm sesleri durdurur.
 */
export function stopAllSounds() {
  Howler.stop();
}

/**
 * Bir veya birden fazla ses dosyasını önceden yükler.
 * @param srcList Tek bir string veya string dizisi olarak ses dosyası yolu/isimleri
 * @returns Howl örneği veya örnekleri
 */
export function preloadSounds(srcList: string | string[]): Howl | Howl[] {
  if (Array.isArray(srcList)) {
    return srcList.map(src => new Howl({ src: [src], preload: true }));
  }
  return new Howl({ src: [srcList], preload: true });
}
