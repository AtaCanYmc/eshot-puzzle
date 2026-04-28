import {supabase} from "./supabaseClient";

export const vapurService = {

    /**
     * Verilen koordinatın X metre yakınındaki vapur iskelelerini mesafesiyle birlikte getirir.
     */
    async getNearbyStations(lat: number, lon: number, radius = 150): Promise<any[]> {
        const { data, error } = await supabase.rpc('get_nearby_vapur_iskele', {
            target_lat: lat,
            target_lon: lon,
            radius_meters: radius
        });

        if (error) throw error;
        return data || [];
    },
}