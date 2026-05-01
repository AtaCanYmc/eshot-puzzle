import { Howl, Howler } from 'howler';
import eshotSound from '../assets/sound/eshot-travel-sound.mp3';
import metroSound from '../assets/sound/metro.mp3';
import izbanSound from '../assets/sound/izban.mp3';
import vapurSound from '../assets/sound/ferry.mp3';
import walkSound from '../assets/sound/walk.mp3';

export const sounds = [
    eshotSound,
    vapurSound,
    metroSound,
    izbanSound,
    walkSound
];

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
export function preloadSounds(srcList: string | string[] = sounds): Howl | Howl[] {
  if (Array.isArray(srcList)) {
    return srcList.map(src => new Howl({ src: [src], preload: true }));
  }
  return new Howl({ src: [srcList], preload: true });
}
