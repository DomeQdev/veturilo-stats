import fastifyApp, { FastifyRequest } from "fastify";
import fastifyCors from "@fastify/cors";
import mongoose from "mongoose";
import fetchBikes from "./util/fetchBikes";
import fetchRoute from "./util/fetchRoute";
import fetchMap from "./util/fetchMap";
import sendMessage from "./util/sendMessage";

const fastify = fastifyApp();

fastify.register(fastifyCors, {
    origin: [
        "http://localhost:3000",
        "https://zbiorkom.live",
        "https://v4.zbiorkom.live",
        "https://beta.zbiorkom.live",
        "https://v4live.pro",
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
    cacheControl: 86400 * 30,
});

fetchRoute([52.25727585416777, 20.993466356230204], [52.227804794615395, 21.023483982762546]).then((x) =>
    sendMessage({
        bikeId: "613574",
        start: "6971",
        startName: "Dworzec Gdański",
        startTimestamp: Date.now() - x.duration * 1000,
        end: "6412",
        endName: "Plac Trzech Krzyży",
        endTimestamp: Date.now(),
        distance: x.distance,
        duration: x.duration,
        image: fetchMap(x.geometry),
    })
);
