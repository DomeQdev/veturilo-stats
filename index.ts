import fastifyApp, { FastifyRequest } from "fastify";
import fastifyCors from "@fastify/cors";
import mongoose from "mongoose";
import updateBikes from "./util/updateBikes";
import { schedule } from "node-cron";

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

schedule("* * * * *", updateBikes);

updateBikes();

mongoose
    .set("strictQuery", true)
    .connect("mongodb://127.0.0.1:27017/veturilo?retryWrites=true&serverSelectionTimeoutMS=30000")
    .then(async () => {
        fastify.listen({ port: 8100 }, (err, address) => {
            if (err) throw err;
            console.log(`server listening on ${address}`);
        });
    });
