import {Stop} from "../types/supabaseTypes";

export const filterPastStops = (lineStops: Stop[], currentStop: Stop) => {
    const orderedLineStops = lineStops.sort((a, b) => (a.sira || 0) - (b.sira || 0));
    const currentIndex = orderedLineStops.findIndex(s => s.durak_id === currentStop.durak_id);
    return orderedLineStops.filter((_, idx) => idx > currentIndex);
}