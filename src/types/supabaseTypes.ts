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

export interface SmartDirection {
    smart_yon: number;           // 1: Gidiş, 2: Dönüş
    yon_adi: string;       // "Gidiş" veya "Dönüş"
    is_last_stop: boolean; // Son durak mı?
    mesaj: string;         // Kullanıcıya gösterilecek yönlendirme mesajı
}