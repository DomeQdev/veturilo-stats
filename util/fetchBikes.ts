export interface Bike {
    id: string;
    station?: string;
    stationName?: string;
    location: [number, number];
}

export default async (): Promise<Bike[]> => {
    const bikes: Bike[] = [];

    await fetch("https://nextbike.net/maps/nextbike-official.json?city=812")
        .then((res) => res.json())
        .then((data) => {
            for (const station of data.countries[0].cities[0].places) {
                for (const bike of station.bike_list) {
                    bikes.push({
                        id: bike.number,
                        station: station.number,
                        stationName: station.name,
                        location: [station.lat, station.lng],
                    });
                }
            }
        });

    await fetch("https://gbfs.nextbike.net/maps/gbfs/v1/nextbike_vw/pl/free_bike_status.json")
        .then((res) => res.json())
        .then((data) => {
            for (const bike of data.data.bikes) {
                bikes.push({
                    id: bike.bike_id,
                    location: [bike.lat, bike.lon],
                });
            }
        });

    return bikes;
};
