import { LineString } from "@turf/turf";

export interface Bike {
    bikeId: string;
    station: number;
    timestamp: number;
}

export interface Trip {
    id: string;
    bikeId: string;
    route: string;
    start: number;
    end: number;
}

export interface Route {
    id: string;
    start: number;
    end: number;
    path: LineString;
    distance: number;
    duration: number;
}

export interface Station {
    id: number;
    name: string;
    location: [number, number];
}

declare global {
    var stations: Map<number, Station>;
}