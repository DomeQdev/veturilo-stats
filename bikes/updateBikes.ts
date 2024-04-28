import { model } from "mongoose";
import fetchBikes from "./fetchBikes";
import fetchRoute from "./fetchRoute";
import { BikeSchema, TripSchema } from "../schema";
import { Bike } from "../typings";
import getRoute from "./getRoute";

const DisabledBikes = model("disabledBikes", BikeSchema);
const PreviousBikes = model("previousBikes", BikeSchema);
const Trips = model("trips", TripSchema);

export default async () => {
    const [previousBikes, disabledBikes, bikes] = await Promise.all([
        PreviousBikes.find({}).lean(),
        DisabledBikes.find({}).lean(),
        fetchBikes(),
    ]);

    await PreviousBikes.deleteMany({});
    await PreviousBikes.insertMany(bikes);

    const disabledBikesMap = new Map(disabledBikes.map((bike) => [bike.bikeId, bike]));
    const previousBikesMap = new Map(previousBikes.map((bike) => [bike.bikeId, bike]));
    const bikesMap = new Map(bikes.map((bike: Bike) => [bike.bikeId, bike]));
    const now = Date.now();

    // When a bike disappears from the API, it's disabled, so we need to add it to the disabled bikes collection
    for (const [id, bike] of previousBikesMap) {
        if (bikesMap.has(id) || disabledBikesMap.has(id)) continue;

        await DisabledBikes.create(bike);

        console.log(`Bike ${id} has been disabled`);
    }

    for (const [id, bike] of disabledBikesMap) {
        console.log(`Bike ${id} has been re-enabled`);
        if (!bikesMap.has(id)) continue;

        await DisabledBikes.deleteOne({ bikeId: id });

        const currentBike = bikesMap.get(id)!;
        if (currentBike.station === bike.station) continue;

        const route = await getRoute(bike.station, currentBike.station);

        await Trips.create({
            id: `${bike.bikeId}-${now}`,
            bikeId: id,
            route,
            start: bike.timestamp,
            end: now,
        });
    }
};
