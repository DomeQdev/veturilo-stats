import { mapboxAccessToken } from "../config.json";

export default (geometry: string) =>
    `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/geojson(${geometry})/auto/960x540?access_token=${mapboxAccessToken}&attribution=false&logo=false&padding=20`;
