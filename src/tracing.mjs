import process from "process";
import { NodeSDK, tracing } from "@opentelemetry/sdk-node";
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";

import { W3CTraceContextPropagator2 } from "./W3CTraceContextPropagator.js";

const sdk = new NodeSDK({
  // The service name is REQUIRED! It is a resource attribute, which means that it will be present on all observability data that your service generates.
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: "zack-test",
  }),

  // The SDK will automatically create a new trace processor for you, but you can also create your own.
  traceExporter: new tracing.ConsoleSpanExporter(),

  // Instrumentations allow you to add auto-instrumentation packages
  instrumentations: [new HttpInstrumentation()],

  // Propagators allow you to add custom propagation packages
  textMapPropagator: new W3CTraceContextPropagator2(),
});

sdk
  .start()
  .then(() => console.log("Tracing initialized"))
  .catch((error) => console.log("Error initializing tracing", error));

process.on("SIGTERM", () => {
  sdk
    .shutdown()
    .then(() => console.log("Tracing terminated"))
    .catch((error) => console.log("Error terminating tracing", error))
    .finally(() => process.exit(0));
});
