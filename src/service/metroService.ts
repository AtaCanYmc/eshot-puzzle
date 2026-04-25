import {supabase} from "./supabaseClient";

export const metroService = {

    /**
     * Verilen koordinatın X metre yakınındaki metro istasyonlarını mesafesiyle birlikte getirir.
     */
    async getNearbyStations(lat: number, lon: number, radius = 150): Promise<any[]> {
        const { data, error } = await supabase.rpc('get_nearby_metro_istasyon', {
            target_lat: lat,
            target_lon: lon,
            radius_meters: radius
        });

        if (error) throw error;
        return data || [];
    },
}