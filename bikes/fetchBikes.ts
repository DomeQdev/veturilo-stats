import { Bike } from "../typings";

export default async (): Promise<Bike[]> => {
    const bikes: Bike[] = [];
    const now = Date.now();

    await fetch("https://nextbike.net/maps/nextbike-official.json?city=812")
        .then((res) => res.json())
        .then((data) => {
            for (const station of data.countries[0].cities[0].places) {
                for (const bike of station.bike_list) {
                    bikes.push({
                        bikeId: bike.number,
                        station: station.number,
                        timestamp: now,
                    });
                }
            }
        });

    return bikes;
};
