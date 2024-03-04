import { model } from "mongoose";
import { Bike, Trip } from "./schema";
import fetchBikes from "./fetchBikes";
import fetchRoute from "./fetchRoute";
import sendMessage from "./sendMessage";
import fetchMap from "./fetchMap";

export default async () => {
    const DisabledBikes = model("disabledBikes", Bike);
    const PreviousBikes = model("previousBikes", Bike);
    const Trips = model("trips", Trip);

    const [previousBikes, disabledBikes, bikes] = await Promise.all([
        PreviousBikes.find({}).lean(),
        DisabledBikes.find({}).lean(),
        fetchBikes(),
    ]);

    await PreviousBikes.deleteMany({});
    await PreviousBikes.insertMany(bikes);

    const disabledBikesMap = new Map(disabledBikes.map((bike) => [bike.id, bike]));
    const previousBikesMap = new Map(previousBikes.map((bike) => [bike.id, bike]));
    const bikesMap = new Map(bikes.map((bike) => [bike.id, bike]));

    for (const [id, bike] of previousBikesMap) {
        if (bikesMap.has(id) || disabledBikesMap.has(id)) continue;

        await DisabledBikes.create({
            ...bike,
            timestamp: Date.now(),
        });
    }

    for (const [id, bike] of disabledBikesMap) {
        if (!bikesMap.has(id)) continue;

        const currentStation = bikesMap.get(id)!;
        const route = await fetchRoute(bike.location, currentStation.location);

        await DisabledBikes.deleteOne({ id });
        await Trips.create({
            bikeId: id,
            start: bike.station,
            startName: bike.stationName,
            startTimestamp: bike.timestamp,
            end: currentStation.station,
            endName: currentStation.stationName,
            endTimestamp: Date.now(),
            duration: route.duration,
            distance: route.distance,
        });
        await sendMessage({
            bikeId: id,
            start: bike.station!,
            startName: bike.stationName,
            startTimestamp: bike.timestamp,
            end: currentStation.station!,
            endName: currentStation.stationName,
            endTimestamp: Date.now(),
            duration: route.duration,
            distance: route.distance,
            image: fetchMap(route.geometry),
        });
    }
};
