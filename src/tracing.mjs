import process from "process";
import { NodeSDK, tracing } from "@opentelemetry/sdk-node";
import { Resource } from "@opentelemetry/resources";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";

const traceExporterConsole = new tracing.ConsoleSpanExporter();

// The service name is REQUIRED! It is a resource attribute, which means that it will be present on all observability data that your service generates.
const sdk = new NodeSDK({
  resource: new Resource({
    "service.name": "testing",
  }),
  traceExporter: traceExporterConsole,

  // Instrumentations allow you to add auto-instrumentation packages
  instrumentations: [new HttpInstrumentation()],
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
