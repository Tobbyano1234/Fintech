import Connection from "rabbitmq-client";
import dotenv from "dotenv";
import { getCustomersWithin100km } from ".";
dotenv.config();

const rabbit = new Connection({
    url: process.env.rabbitURL, // add rabbitMq url to create an instance here
    retryLow: 1000,
    retryHigh: 30000,
});

rabbit.on("error", (err) => {
    console.error(err);
});
rabbit.on("connection", () => {
    console.log("The connection is successfully (re)established");
});

const run = async () => {
    const ch = await rabbit.acquire();
    ch.on("close", () => {
        console.log("channel was closed");
    });

    await ch.queueDeclare({ queue: "my-queue", exclusive: false });
    const invitees = await getCustomersWithin100km();
    let count = 0;
    invitees.forEach(async (invitee) => {
        const isFinal = ++count === invitees.length - 1;
        await ch.basicPublish(
            { routingKey: "my-queue" },
            { ...invitee, isFinal, count }
        );
    });

    await ch.close();
    await rabbit.close();
    console.log(`publisher closed`);
};

run();
