# Auto Instrumenting Nodejs App

The repository is used as a quick start for instrumenting Nodejs app using Open Telemetry. 

The repository can be configured to run in 2 configurations
1. Instrument with traces sent to Zipkin
2. Instrument with traces sent to Otel Collector

---

## Instrument with traces sent to Zipkin

The example is linked to the official [open-telemetry/opentelemetry-js].(https://github.com/open-telemetry/opentelemetry-js/tree/main/packages/opentelemetry-exporter-zipkin)

- In this use case, ensure that the Zipkin instance is running via docker 

`docker run --rm -d -p 9411:9411 --name zipkin openzipkin/zipkin`

- Ensure all the following packages are installed

`npm install @opentelemetry/instrumentation @opentelemetry/instrumentation-http  @opentelemetry/instrumentation-grpc  @opentelemetry/core  @opentelemetry/api @opentelemetry/node @opentelemetry/tracing @opentelemetry/exporter-zipkin express axios`

- To run the application

`node -r ./tracing.js app.js`

- Generate some traffic to create the traces. You should get a `Hello from the backend` response.

`curl http://{host}:8080`

![image](https://user-images.githubusercontent.com/84762890/120888666-2534a580-c62c-11eb-8d86-53dc971cda17.png)

---

## Instrument with traces sent to Otel Collector

In this use case, we are sending our traces to Splunk Enterprise. Of course we can send to the Observability Cloud easily by manipulating the exporter config.

- Ensure that the Open Telemetry Contrib is installed. Instructions [here](https://github.com/open-telemetry/opentelemetry-collector-contrib/releases)

- Ensure the following package is installed

`npm install @opentelemetry/instrumentation @opentelemetry/instrumentation-http  @opentelemetry/instrumentation-grpc  @opentelemetry/core  @opentelemetry/api @opentelemetry/node @opentelemetry/tracing @opentelemetry/exporter-zipkin express axios signalfx-tracing`

- Ensure that the Zipkin docker instance is stopped (if required). 

- Configure and exporter destination and pipeline inside the **`collector.yaml`** file. In this example i am sending the traces to Splunk. 

Exporter
```yaml
  splunk_hec:
    token: "${SPLUNK_HEC_TOKEN}"
    endpoint: "${SPLUNK_HEC_URL}"
    source: "otel"
    sourcetype: "signalfx-otel"
    insecure_skip_verify: true
```

Pipeline
```yaml
  pipelines:
    traces:
      receivers: [jaeger, otlp, sapm, smartagent/signalfx-forwarder, zipkin]
      processors:
      - memory_limiter
      - batch
      - resourcedetection
      exporters: [splunk_hec]
```

- Start the Otel Collector instance.

`systemctl start splunk-otel-collector`

- To run the application

`node -r ./tracing.js app.js`

- Generate some traffic to create the traces. You should get a `Hello from the backend` response.

`curl http://{host}:8080`

- Examine the traces from Splunk.
![image](https://user-images.githubusercontent.com/84762890/120889359-3c28c700-c62f-11eb-9fc9-d6424e4b758a.png)

--- 

## Caveat

At this moment i have not idea why the serviceName are not displaying correctly. 
