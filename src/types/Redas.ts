export interface TrainingEntry {
    date: string;
    link: string;
}

export interface PlaceData {
    date: string;
    article_link: string;
    fb_link: string;
    gdrive_link: string;
    remarks: string;
}

export interface PlaceCount {
    place: string;
    count: number;
}

export interface PlaceCenter {
    lat: number;
    lng: number;
}

export type PlaceCircleArea = PlaceCount & PlaceCenter;

export interface SectionData {
    [location: string]: TrainingEntry[];
}

export interface SheetResponse {
    data: {
        PROVINCES: SectionData;
        CITIES: SectionData;
        'REDAS Trained National Government Agencies': SectionData;
        'REDAS Big Batches': SectionData;
        'REDAS Trained State Universities and Colleges (SUCs)': SectionData;
        'REDAS Trained Private Companies': SectionData;
        'REDAS Trained NGOs and Federation': SectionData;
        'REDAS Trained Philippine Disaster Resilience': SectionData;
    };
    status: string;
}

export interface SheetData {
    data: {
        PROVINCES: SectionData;
        CITIES: SectionData;
        'REDAS Trained National Government Agencies': SectionData;
        'REDAS Big Batches': SectionData;
        'REDAS Trained State Universities and Colleges (SUCs)': SectionData;
        'REDAS Trained Private Companies': SectionData;
        'REDAS Trained NGOs and Federation': SectionData;
        'REDAS Trained Philippine Disaster Resilience': SectionData;
    };
}

export interface FAQ {
    question: string;
    answer: {
        description: string;
        img?: string | null;
    };
}

export interface AggregatedData {
    totalParticipants: number;
    totalMale: number;
    totalFemale: number;
    totalYouth: number;
    totalSC: number;
    totalPWD: number;
}

export type Training = {
    event: string;
    location: string;
    date: string;
};

export type Collaboration = {
    school: string;
    department: string;
    degreeCourse: string;
};

export interface Testimonial {
    quote: string;
    author: string;
    type: 'software' | 'training';
}
