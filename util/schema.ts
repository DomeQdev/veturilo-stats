import { Document, Schema } from "mongoose";

export interface bike extends Document {
    id: string;
    station?: string;
    stationName?: string;
    location: [number, number];
    timestamp: number;
}

export const Bike = new Schema<bike>({
    id: { type: String, required: true, unique: true },
    station: String,
    stationName: String,
    location: [Number],
    timestamp: Number,
});

export interface trip extends Document {
    bikeId: string;
    start: string;
    startName?: string;
    startTimestamp: number;
    end: string;
    endName?: string;
    endTimestamp: number;
    duration: number;
    distance: number;
}

export const Trip = new Schema<trip>({
    bikeId: { type: String, required: true },
    start: { type: String, required: true },
    startName: String,
    startTimestamp: { type: Number, required: true },
    end: { type: String, required: true },
    endName: String,
    endTimestamp: { type: Number, required: true },
    duration: { type: Number, required: true },
    distance: { type: Number, required: true },
});
