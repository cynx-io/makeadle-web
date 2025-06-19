// lib/error.ts
import { ConnectError } from "@connectrpc/connect";
import { ServiceError } from "./serverTransport";

/**
 * Handlers for each error category.
 */
type ErrorHandlers = Partial<{
  service: (err: ServiceError) => void;
  transport: (err: ConnectError) => void;
  unknown: (err: unknown) => void;
}>;

export class JanusServerError {
  private readonly handlers: ErrorHandlers;

  defaultHandlers: ErrorHandlers = {
    service: (err: ServiceError) => {
      console.error("Service error:", err);
    },
    transport: (err: ConnectError) => {
      console.error("Transport error:", err);
    },
    unknown: (err: unknown) => {
      console.error("Unknown error:", err);
    },
  };

  /**
   * @param err The thrown error to analyze
   * @param handlers
   */
  constructor(
    private err: unknown,
    handlers: ErrorHandlers = {},
  ) {
    // Initialize handlers with provided defaults
    this.handlers = { ...this.defaultHandlers, ...handlers };
  }

  /**
   * Override or add a service-level handler
   */
  onServiceError(fn: (err: ServiceError) => void): this {
    this.handlers.service = fn;
    return this;
  }

  /**
   * Override or add a transport-level handler
   */
  onTransportError(fn: (err: ConnectError) => void): this {
    this.handlers.transport = fn;
    return this;
  }

  /**
   * Override or add an unknown error handler
   */
  onUnknown(fn: (err: unknown) => void): this {
    this.handlers.unknown = fn;
    return this;
  }

  /**
   * Execute the appropriate handler (service, transport, or unknown).
   * Only one handler will run.
   */
  handle(): void {
    const { service, transport, unknown } = this.handlers;
    if (
      this.err instanceof ConnectError &&
      this.err.cause instanceof ServiceError
    ) {
      service?.(this.err.cause);
    } else if (this.err instanceof ConnectError) {
      transport?.(this.err);
    } else {
      unknown?.(this.err);
    }
  }
}

/**
 * Factory to wrap an error with optional default handlers.
 */
export function newJanusServerError(
  err: unknown,
  defaults: ErrorHandlers = {},
): JanusServerError {
  return new JanusServerError(err, defaults);
}
