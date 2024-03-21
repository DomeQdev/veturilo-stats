import { LineString, lineString, simplify } from "@turf/turf";

export interface APIRoute {
    path: LineString;
    distance: number;
    duration: number;
}

export default (start: number[], end: number[]): Promise<APIRoute> =>
    fetch(
        `https://graphhopper.com/api/1/route?vehicle=bike&locale=pl&key=LijBPDQGfu7Iiq80w3HzwB4RUDJbMbhs6BU0dEnn&elevation=false&instructions=false&turn_costs=false&point=${start.join(
            ","
        )}&point=${end.join(",")}`
    )
        .then((res) => res.json())
        .then((data) => {
            const route = lineString(decode(data.paths[0].points));

            return {
                path: simplify(route, { tolerance: 0.0001 }).geometry,
                distance: Math.floor(data.paths[0].distance),
                duration: data.paths[0].time,
            } as APIRoute;
        });

function decode(encoded: string) {
    var inv = 1.0 / 1e5;
    var decoded = [];
    var previous = [0, 0];
    var i = 0;
    while (i < encoded.length) {
        var ll = [0, 0];
        for (var j = 0; j < 2; j++) {
            var shift = 0;
            var byte = 0x20;
            while (byte >= 0x20) {
                byte = encoded.charCodeAt(i++) - 63;
                ll[j] |= (byte & 0x1f) << shift;
                shift += 5;
            }
            ll[j] = previous[j] + (ll[j] & 1 ? ~(ll[j] >> 1) : ll[j] >> 1);
            previous[j] = ll[j];
        }
        decoded.push([ll[1] * inv, ll[0] * inv]);
    }
    return decoded;
}
