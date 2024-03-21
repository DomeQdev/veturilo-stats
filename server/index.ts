import { FastifyInstance, FastifyRequest } from "fastify";
import { model } from "mongoose";
import { BikeSchema, TripSchema } from "../schema";

const DisabledBikes = model("disabledBikes", BikeSchema);
const PreviousBikes = model("previousBikes", BikeSchema);
const Trips = model("trips", TripSchema);

export default (fastify: FastifyInstance, opts: any, done: () => void) => {
    fastify.get(
        "/",
        async (
            req: FastifyRequest<{
                Querystring: {
                    time: "30min" | "1h" | "1d" | "7d" | "30d" | "y";
                };
            }>
        ) => {
            const time = timeToMiliseconds(req.query.time);

            const activeRentals = await DisabledBikes.countDocuments({
                timestamp: {
                    $gte: Date.now() - 6 * 60 * 60 * 1000,
                },
            }).lean();

            const trips = await Trips.aggregate([
                {
                    $match: {
                        end: {
                            $gte: Date.now() - time,
                        },
                    },
                },
                {
                    $lookup: {
                        from: "routes",
                        localField: "route",
                        foreignField: "id",
                        as: "route",
                    },
                },
                {
                    $unwind: "$route",
                },
                {
                    $project: {
                        _id: 0,
                        id: 1,
                        start: 1,
                        end: 1,
                        route: {
                            id: 1,
                            start: 1,
                            end: 1,
                            distance: 1,
                        },
                    },
                },
            ]);

            return {
                activeRentals,
                distance: Math.floor(trips.reduce((acc, trip) => acc + trip.route.distance, 0) / 1000),
                rentals: trips.length,
                trips,
            };
        }
    );

    done();
};

function timeToMiliseconds(time: string) {
    switch (time) {
        case "30min":
            return 30 * 60 * 1000;
        case "1h":
            return 60 * 60 * 1000;
        case "1d":
            return 24 * 60 * 60 * 1000;
        case "7d":
            return 7 * 24 * 60 * 60 * 1000;
        case "30d":
            return 30 * 24 * 60 * 60 * 1000;
        default:
            return 365 * 24 * 60 * 60 * 1000;
    }
}
