import "./tracing.mjs";

import Fastify from "fastify";

import { tracer } from "./tracing-2.mjs";

const waitFor = (durMs) => new Promise((resolve) => setTimeout(resolve, durMs));

const server = Fastify({});

server.get("/", async (req, reply) => {
  // PROBLEM: How to change the trace context propagated from downstream?
  if (req.headers["my-tp"]) {
    const [version, traceID, traceParentSpan] = req.headers["my-tp"].split("-");
  }

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
