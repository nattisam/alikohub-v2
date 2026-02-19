import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { Logger } from '@nestjs/common';

const logger = new Logger('Tracing');

export const otelSDK = new NodeSDK({
  traceExporter: new OTLPTraceExporter({
    // Use an environment variable for the OTLP collector endpoint
    url: process.env.OTLP_COLLECTOR_URL || 'http://localhost:4318/v1/traces',
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

// Graceful shutdown
process.on('SIGTERM', () => {
  otelSDK
    .shutdown()
    .then(
      () => logger.log('SDK shut down successfully'),
      (err) => logger.error('Error shutting down SDK', err),
    )
    .finally(() => process.exit(0));
});
