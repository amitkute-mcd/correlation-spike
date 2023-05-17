//Trace Imports
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import {
  WebTracerProvider,
  BatchSpanProcessor,
} from "@opentelemetry/sdk-trace-web";
import {
  CompositePropagator,
  W3CBaggagePropagator,
  W3CTraceContextPropagator,
} from "@opentelemetry/core";
import { getWebAutoInstrumentations } from "@opentelemetry/auto-instrumentations-web";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { ZoneContextManager } from "@opentelemetry/context-zone";
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { environment } from "src/environments/environment";

//Trace Configuration
const resource = Resource.default().merge(
  new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: "Otel-Angular",
    [SemanticResourceAttributes.SERVICE_VERSION]: "0.1.0",
  })
);

const provider = new WebTracerProvider({
  resource: resource,
});

// Batch traces before sending them to Otel Collector
provider.addSpanProcessor(
  new BatchSpanProcessor(
    new OTLPTraceExporter({
      url: environment.otelTraceEndpoint,
    })
  )
);

provider.register({
  contextManager: new ZoneContextManager(),
  propagator: new CompositePropagator({
    propagators: [new W3CBaggagePropagator(), new W3CTraceContextPropagator()],
  }),
});

registerInstrumentations({
  instrumentations: [
    getWebAutoInstrumentations({
      "@opentelemetry/instrumentation-document-load": {
        enabled: false
      },
      "@opentelemetry/instrumentation-user-interaction": {},
      "@opentelemetry/instrumentation-fetch": {
        propagateTraceHeaderCorsUrls: /.*/,
        clearTimingResources: true,
        applyCustomAttributesOnSpan(span) {
          span.setAttribute("app.synthetic_request", "false");
        },
      },
      "@opentelemetry/instrumentation-xml-http-request": {
        propagateTraceHeaderCorsUrls: /.*/,
        clearTimingResources: true,
        applyCustomAttributesOnSpan(span) {
          span.setAttribute("app.synthetic_request", "false");
        },
      },
    }),
  ],
});
