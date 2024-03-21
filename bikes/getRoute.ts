import { model } from "mongoose";
import { RouteSchema } from "../schema";
import fetchRoute from "./fetchRoute";

const Routes = model("routes", RouteSchema);

export default async (start: number, end: number) => {
    const route = await Routes.findOne({ start, end }).lean();

    if (!route) {
        const startStation = globalThis.stations.get(start)!;
        const endStation = globalThis.stations.get(end)!;
        const { path, distance, duration } = await fetchRoute(startStation.location, endStation.location);

        await Routes.create({
            id: `${start}-${end}`,
            start,
            end,
            path,
            distance,
            duration,
        });

        return `${start}-${end}`;
    }

    return route.id;
};
