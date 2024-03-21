export default async () => {
    const stations = await fetch("https://nextbike.net/maps/nextbike-official.json?city=812")
        .then((r) => r.json())
        .then((d) =>
            d.countries[0].cities[0].places.map((p: any) => [
                p.number,
                { id: p.number, name: p.name, location: [p.lat, p.lng] },
            ])
        );

    globalThis.stations = new Map(stations);
};
