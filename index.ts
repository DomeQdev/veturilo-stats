import fastifyApp from "fastify";
import fastifyCors from "@fastify/cors";
import mongoose from "mongoose";
import updateBikes from "./bikes/updateBikes";
import { schedule } from "node-cron";
import fetchStations from "./bikes/fetchStations";
import server from "./server";

const fastify = fastifyApp();

fastify.register(fastifyCors, {
    origin: ["http://localhost:5173", "https://veturilo.domeq.pro", "https://veturilo-stats.pages.dev"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
    cacheControl: 86400 * 30,
});

fastify.register(server);

schedule("*/30 * * * * *", updateBikes);

mongoose
    .set("strictQuery", true)
    .connect("mongodb://127.0.0.1:27017/veturilo?retryWrites=true&serverSelectionTimeoutMS=30000")
    .then(async () => {
        await fetchStations();
        updateBikes();

        fastify.listen({ port: 8100 }, (err, address) => {
            if (err) throw err;
            console.log(`server listening on ${address}`);
        });
    });
