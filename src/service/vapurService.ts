import {supabase} from "./supabaseClient";
import {Stop, VapurStop} from "../types/supabaseTypes";

export const vapurService = {

    /**
     * Verilen koordinatın X metre yakınındaki vapur iskelelerini mesafesiyle birlikte getirir.
     */
    async getNearbyStations(lat: number, lon: number, radius = 150): Promise<Stop[]> {
        const { data, error } = await supabase.rpc('get_nearby_vapur_iskele', {
            target_lat: lat,
            target_lon: lon,
            radius_meters: radius
        });

        if (error) throw error;
        return data || [];
    },

    async getVarisYerleri(iskeleId: number, gunId: number): Promise<VapurStop[]> {
        const { data, error } = await supabase.rpc('iskele_varis_yerleri', {
            p_iskele_id: iskeleId,
            p_gun_id: gunId
        });

        if (error) throw error;
        return data || [];
    }
}