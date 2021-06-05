"use  strict";

const { diag, DiagConsoleLogger, DiagLogLevel } = require("@opentelemetry/api");
const { LogLevel } = require("@opentelemetry/core");
const { NodeTracerProvider } = require("@opentelemetry/node");
const {
  SimpleSpanProcessor,
  BatchSpanProcessor,
  ConsoleSpanExporter,
} = require("@opentelemetry/tracing");
const { registerInstrumentations } = require("@opentelemetry/instrumentation");
const { HttpInstrumentation } = require("@opentelemetry/instrumentation-http");
const { GrpcInstrumentation } = require("@opentelemetry/instrumentation-grpc");


const provider = new NodeTracerProvider();

//provider.register();
//provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
//console.log("Tracing initialize");

const { ZipkinExporter } = require("@opentelemetry/exporter-zipkin");

const options = {
  header: {
    Authorization: "Splunk xxxxxxxxx",
  },
  serviceName: "myHec",
  getExportRequestHeaders: () => {
    return {};
  },
};

const exporter = new ZipkinExporter(options);
provider.addSpanProcessor(new SimpleSpanProcessor(exporter));

provider.register();

registerInstrumentations({
  instrumentations: [
    new HttpInstrumentation(),
    new GrpcInstrumentation(),
  ],
});


console.log("tracing initialized");
