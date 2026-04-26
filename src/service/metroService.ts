import {supabase} from "./supabaseClient";
import type {Stop} from "../types/supabaseTypes";
import {getCache, setCache} from "../utils/simpleCache";

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

    /**
     * metronun duraklarını sıralı olarak getirir.
     */
    async getOrderedStops(): Promise<Stop[]> {
        const cacheKey = `getOrderedStops:metro`;
        const cached = getCache<Stop[]>(cacheKey);
        if (cached) return cached;
        const { data, error } = await supabase.rpc('get_smart_ordered_metro_stops');
        if (error) throw error;
        setCache(cacheKey, data || []);
        return data || [];
    },
}