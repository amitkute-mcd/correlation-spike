// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  otelTraceEndpoint: "http://localhost:4318/v1/traces",
  otelMetricEndpoint: "http://localhost:4318/v1/metrics",
  otelLogsEndpoint: "http://localhost:4318/v1/logs",
  URL_Service_Base: "http://localhost:5000/",
  URL_Service_A: "http://localhost:5001/",
  URL_Service_B: "http://localhost:5002/",
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
