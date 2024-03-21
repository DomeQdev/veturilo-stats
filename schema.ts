import { Bike, Route, Trip } from "./typings";
import { Schema } from "mongoose";
import "mongoose-geojson-schema";

export const BikeSchema = new Schema<Bike>({
    bikeId: { type: String, required: true, unique: true },
    station: { type: Number, required: true },
    timestamp: { type: Number, required: true },
});

export const TripSchema = new Schema<Trip>({
    id: { type: String, required: true, unique: true },
    bikeId: { type: String, required: true, index: true },
    route: { type: String, required: true, index: true },
    start: { type: Number, required: true },
    end: { type: Number, required: true },
});

export const RouteSchema = new Schema<Route>({
    id: { type: String, required: true, unique: true },
    start: { type: Number, required: true },
    end: { type: Number, required: true },
    path: {
        type: Schema.Types.LineString,
        required: true,
    },
    distance: { type: Number, required: true },
    duration: { type: Number, required: true },
});

RouteSchema.index({ path: "2dsphere" });
RouteSchema.index({ start: 1, end: 1 }, { unique: true });
