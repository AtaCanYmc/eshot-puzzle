import { describe, it, expect } from 'vitest';
import { eshotService } from '../../src/service/eshotService';

// Gerçek Supabase fonksiyonları ile testler

describe('eshotService', () => {
  it('getOrderedStops gerçek veri ile çalışıyor', async () => {
    const result = await eshotService.getOrderedStops('515', 2);
    console.log('getOrderedStops result:', result);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty('durak_id');
  });

  it('getRoutePoints gerçek veri ile çalışıyor', async () => {
    const result = await eshotService.getRoutePoints('515', 2);
    console.log('getRoutePoints result:', result);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty('enlem');
    expect(result[0]).toHaveProperty('boylam');
  });

  it('getDepartureTimes gerçek veri ile çalışıyor', async () => {
    const result = await eshotService.getDepartureTimes('515', 2);
    console.log('getDepartureTimes result:', result);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty('saat');
  });

  it('getRandomDurakFarAway gerçek veri ile çalışıyor', async () => {
    const result = await eshotService.getRandomDurakFarAway(38.4192, 27.1287, 5000);
    console.log('getRandomDurakFarAway result:', result);
    expect(result).toHaveProperty('durak_id');
    expect(result).toHaveProperty('enlem');
    expect(result).toHaveProperty('boylam');
  });

  it('getHatlarByDurakId gerçek veri ile çalışıyor', async () => {
    const result = await eshotService.getHatlarByDurakId(30308);
    console.log('getHatlarByDurakId result:', result);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty('hat_no');
  });

  it('getTwoRandomStops en az 25km uzak iki durak döndürür', async () => {
    const [stop1, stop2] = await eshotService.getTwoRandomStops();
    // Haversine formülü ile mesafe hesapla
    function toRad(deg: number) { return deg * Math.PI / 180; }
    function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
      const R = 6371e3; // metre
      const φ1 = toRad(lat1);
      const φ2 = toRad(lat2);
      const Δφ = toRad(lat2-lat1);
      const Δλ = toRad(lon2-lon1);
      const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    }
    const mesafe = haversine(stop1.enlem, stop1.boylam, stop2.enlem, stop2.boylam);
    console.log('stop1:', stop1);
    console.log('stop2:', stop2);
    console.log('Mesafe (metre):', mesafe);
    expect(mesafe).toBeGreaterThanOrEqual(25000);
  });
});
