//Log Imports
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import {SeverityNumber } from '@opentelemetry/api-logs';
import {
  LoggerProvider,
  BatchLogRecordProcessor,
} from '@opentelemetry/sdk-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { environment } from "src/environments/environment";

// waiting for package @opentelemetry/exporter-logs-otlp-http to be available
const resource =
  Resource.default().merge(
    new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: "Otel-Angular",
      [SemanticResourceAttributes.SERVICE_VERSION]: "0.1.0",
         })
  );
 
  // The OTLPLogExporter in Web expects the endpoint to end in `/v1/logs`.
  const collectorOptions = {
    url: environment.otelLogsEndpoint, 
    headers: {}, // an optional object containing custom headers to be sent with each request
    concurrencyLimit: 1, // an optional limit on pending requests
    };

  const logExporter = new OTLPLogExporter(collectorOptions);
  
  //to start a logger, first initialize the logger provider
    const loggerProvider = new LoggerProvider({
      resource:resource,
    });

  //Add a processor to export log record
    loggerProvider.addLogRecordProcessor(
      new BatchLogRecordProcessor(logExporter));
  
  //  To create a log record, you first need to get a Logger instance
    const logger = loggerProvider.getLogger('default', '1.0.0');

  // Emit a log
    logger.emit({
      severityNumber: SeverityNumber.INFO,
      severityText: 'info',
      body: 'this is a log body',
      attributes: { 'log.type': 'custom' },
    });
