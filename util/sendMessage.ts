import { webhookUrl } from "../config.json";

export default async ({
    bikeId,
    start,
    startName,
    startTimestamp,
    end,
    endName,
    endTimestamp,
    duration,
    distance,
    image,
}: {
    bikeId: string;
    start: string;
    startName?: string;
    startTimestamp: number;
    end: string;
    endName?: string;
    endTimestamp: number;
    duration: number;
    distance: number;
    image: string;
}) =>
    fetch(
        webhookUrl,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                embeds: [
                    {
                        title: `🚴 ${bikeId}`,
                        description: `🚵 **Dystans**: ${metersToString(distance)}\n⌚ **Czas jazdy**: ${timeToString(
                            duration
                        )}`,
                        fields: [
                            {
                                name: `<:leave:880898599054102538> ${startName ? `${start} ${startName}` : "Rower wolnostojący"}`,
                                value: `<t:${Math.floor(startTimestamp / 1000)}:f>`,
                                inline: true,
                            },
                            {
                                name: `<:join:880898594452938823> ${endName ? `${end} ${endName}` : "Rower wolnostojący"}`,
                                value: `<t:${Math.floor(endTimestamp / 1000)}:f>`,
                                inline: true,
                            },
                        ],
                        color: 0xe91c26,
                        image: {
                            url: image,
                        },
                    },
                ],
            }),
        }
    );

function metersToString(meters: number) {
    if (meters < 1000) {
        return `${meters} m`;
    } else {
        return `${(meters / 1000).toFixed(1)} km`;
    }
}

function timeToString(seconds: number) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
    } else {
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    }
}
