
import Connection from "rabbitmq-client";
import dotenv from "dotenv";
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

    await ch.basicConsume({ queue: "my-queue" }, (msg) => {
        console.log(msg);
        ch.basicAck({ deliveryTag: msg.deliveryTag });
        console.log("msg", msg.body.isFinal)
        if (msg.body.isFinal) {
            setTimeout(() => {
                ch.close().then(() => {
                    rabbit.close();
                    console.log("rabbit connection closed");
                });
            }, 5000);
        }
    });
}

run();


