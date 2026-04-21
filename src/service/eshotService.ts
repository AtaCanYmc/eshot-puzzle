import { supabase } from './supabaseClient'; // Kendi supabase client dosyan
import type {Stop, RoutePoint, DepartureTime, SmartDirection} from '../types/supabaseTypes.ts';
import { getCache, setCache } from '../utils/simpleCache';

export const eshotService = {
    /**
     * Belirli bir hattın ve yönün duraklarını sıralı olarak getirir.
     */
    async getOrderedStops(hatNo: string, yon: number, current_durak_id?: number): Promise<Stop[]> {
        const cacheKey = `getOrderedStops:${hatNo}:${yon}:${current_durak_id ?? 'null'}`;
        const cached = getCache<Stop[]>(cacheKey);
        if (cached) return cached;
        const { data, error } = await supabase.rpc('get_smart_ordered_stops', {
            p_hat_no: hatNo,
            p_yon: yon,
            p_current_durak_id: current_durak_id || null
        });
        if (error) throw error;
        setCache(cacheKey, data || []);
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
        const cacheKey = `getHatlarByDurakId:${durakId}`;
        const cached = getCache<{ hat_no: string }[]>(cacheKey);
        if (cached) return cached;
        const { data, error } = await supabase.rpc('get_hatlar_by_durak_id_split', {
            target_durak_id: durakId
        });
        if (error) throw error;
        setCache(cacheKey, data || []);
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

    /**
     * Verilen koordinatın X metre yakınındaki durakları mesafesiyle birlikte getirir.
     */
    async getNearbyStops(lat: number, lon: number, radius = 100): Promise<any[]> {
        const { data, error } = await supabase.rpc('get_nearby_stops', {
            target_lat: lat,
            target_lon: lon,
            radius_meters: radius
        });

        if (error) throw error;
        return data || [];
    },

    /**
     * Durak ve hat numarasına göre en mantıklı yönü/yönleri döner.
     * Son durak olan yönleri eler veya kullanıcıyı diğer yöne yönlendirir.
     */
     async getAvailableDirections(
        durakId: number,
        hatNo: string
    ): Promise<SmartDirection[]> {

        const { data, error } = await supabase.rpc('get_smart_direction', {
            p_durak_id: durakId,
            p_hat_no: hatNo
        });

        if (error) {
            console.error(`Smart Direction Hatası (${hatNo}):`, error.message);
            throw new Error("Yön bilgisi alınırken bir sorun oluştu.");
        }

        return data || [];
    }
};