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

