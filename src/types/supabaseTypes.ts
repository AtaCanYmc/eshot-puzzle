export interface Stop {
    durak_id: number;
    durak_adi: string;
    enlem: number;
    boylam: number;
    sira?: number;
}

export interface RoutePoint {
    sira: number;
    enlem: number;
    boylam: number;
}

export interface DepartureTime {
    tarife_tipi: string;
    saat: string;
    sira: number;
    engelli_destegi: boolean;
    bisiklet_destegi: boolean;
    elektrikli_otobus: boolean;
}