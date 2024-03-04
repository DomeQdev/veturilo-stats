import { featureCollection, lineString, point, simplify } from "@turf/turf";

export interface Route {
    distance: number;
    duration: number;
    geometry: string;
}

export default (start: number[], end: number[]) =>
    fetch(`https://citymapper.com/api/6/cycle?start=${start.join(",")}&end=${end.join(",")}&region_id=pl-warsaw`)
        .then((res) => res.json())
        .then((data) => {
            const journey = data.journeys.find(
                (x: any) => x.journey_kind === "cycle_personal" && x.journey_profile === "balanced"
            ).legs[0]!;

            const startPoint = point([start[1], start[0]], {
                "marker-symbol": "bicycle",
            });
            const endPoint = point([end[1], end[0]], {
                "marker-symbol": "bicycle",
            });
            const shape = lineString(
                journey.shape.map((x: any) => [x[1], x[0]] as [number, number]),
                {
                    "stroke-width": 4,
                }
            );

            const collection = featureCollection([
                startPoint,
                endPoint, //@ts-ignore
                shape.geometry.coordinates.length > 15 ? simplify(shape, { tolerance: 0.0001 }) : shape,
            ]);

            return {
                distance: journey.distance_meters,
                duration: journey.duration_seconds,
                geometry: encodeURIComponent(JSON.stringify(collection)),
            };
        }) as Promise<Route>;
