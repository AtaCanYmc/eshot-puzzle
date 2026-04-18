// Rastgele iki durak döndüren dummy fonksiyon
export async function fetchRandomStops(): Promise<[Stop, Stop]> {
  return [
    {
      durak_id: 1,
      durak_adi: 'Evka 3 Aktarma Merkezi',
      enlem: 38.465658,
      boylam: 27.22856
    },
    {
      durak_id: 2,
      durak_adi: 'Buca Belediye Sarayı',
      enlem: 38.3904,
      boylam: 27.163
    }
  ];
}
import { supabase } from './supabaseClient'; // Kendi supabase client dosyan
import type {Stop, RoutePoint, DepartureTime} from '../types/supabaseTypes.ts';

export const eshotService = {
    /**
     * Belirli bir hattın ve yönün duraklarını sıralı olarak getirir.
     */
    async getOrderedStops(hatNo: string, yon: number): Promise<Stop[]> {
        const { data, error } = await supabase.rpc('get_ordered_stops', {
            p_hat_no: hatNo,
            p_yon: yon
        });

        if (error) throw error;
        return data || [];
    },

    /**
     * Hattın harita üzerindeki çizgisini (polyline) oluşturacak noktaları getirir.
     */
    async getRoutePoints(hatNo: string, yon: number): Promise<RoutePoint[]> {
        const { data, error } = await supabase.rpc('get_route_points', {
            p_hat_no: hatNo,
            p_yon: yon
        });

        if (error) throw error;
        return data || [];
    },

    /**
     * Hattın hareket saatlerini, engelli ve bisiklet desteği bilgileriyle getirir.
     */
    async getDepartureTimes(hatNo: string, yon: number): Promise<DepartureTime[]> {
        const { data, error } = await supabase.rpc('get_hareket_saatleri_by_yon', {
            p_hat_no: hatNo,
            p_yon: yon
        });

        if (error) throw error;
        return data || [];
    },

    /**
     * Verilen koordinattan uzak (veya yakın) rastgele bir durak seçer.
     */
    async getRandomDurakFarAway(lat: number | null, lon: number | null, radius = 5000): Promise<Stop> {
        const { data, error } = await supabase.rpc('get_random_durak_far_away', {
            target_lat: lat,
            target_lon: lon,
            radius_meters: radius
        });

        if (error) throw error;
        return data[0];
    },

    /**
     * Bir duraktan geçen hatları split mantığıyla (dizi olarak) döndürür.
     */
    async getHatlarByDurakId(durakId: number): Promise<{ hat_no: string }[]> {
        const { data, error } = await supabase.rpc('get_hatlar_by_durak_id_split', {
            target_durak_id: durakId
        });

        if (error) throw error;
        return data || [];
    },

    /**
     * İki rastgele durak döndürür, aralarındaki mesafe en az belirtilen kadar (default 25km) olur.
     * @param distance
     */
    async getTwoRandomStops(distance: number = 25000): Promise<[Stop, Stop]> {
        // 1. rastgele durak
        const stop1 = await this.getRandomDurakFarAway(null, null, 0);
        // 2. durak: 25km (25000m) uzağında rastgele bir durak
        const stop2 = await this.getRandomDurakFarAway(stop1.enlem, stop1.boylam, distance);
        return [stop1, stop2];
    },
};