import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { trace, context, SpanStatusCode } from "@opentelemetry/api";
import { tap } from "rxjs/operators";

@Injectable()
export class OpenTelemetryInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const span = trace.getTracer("http").startSpan("HTTP " + req.method, {
      attributes: {
        "http.method": req.method,
        "http.url": req.url,
      },
    });

    return context.with(trace.setSpan(context.active(), span), () => {
      // return next handle
      return next.handle(req).pipe(
        tap({
          next: (event) => {
            span.setAttribute("event", event.type);
            span.setStatus({ code: SpanStatusCode.OK });
          },
          error: (error: HttpErrorResponse) => {
            span.setStatus({ code: SpanStatusCode.ERROR });
            this.handleError(error);
          },
          complete: () => span.end(),
        })
      );
    });
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    console.error("Http Handler Service => ", err);

    const { status } = err;

    let message: string = err.message;

    if (err.error?.detail) {
      message = err.error.detail;
    }

    const errorResponse = {
      status,
      message,
    };

    return throwError(errorResponse);
  }
}
