import "./tracing.mjs";

import opentelemetry from "@opentelemetry/api";
import Fastify from "fastify";

const waitFor = (durMs) => new Promise((resolve) => setTimeout(resolve, durMs));

const tracer = opentelemetry.trace.getTracer("context-override-demo", "1.0.0");

const server = Fastify({});

server.get("/", async (req, reply) => {
  // Example custom spans
  let span = tracer.startSpan("db-query");
  await waitFor(200);
  span.end();

  let span2 = tracer.startSpan("db-query2");
  await waitFor(300);
  span2.end();

  return { hello: "world" };
});

const start = async () => {
  try {
    await server.listen(3000);
    console.log(
      `server listening on ${JSON.stringify(server.server.address())}`
    );
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
start();
