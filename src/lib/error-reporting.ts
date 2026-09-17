// Lightweight error-reporting hook. Logs to the console by default; if a
// host page wants to forward errors elsewhere, it can set
// window.__appErrorReporter before the app boots.
type ErrorOptions = {
  mechanism?: "manual" | "onerror" | "unhandledrejection" | "react_error_boundary";
  handled?: boolean;
  severity?: "error" | "warning" | "info";
};

type ErrorReporter = {
  captureException?: (
    error: unknown,
    context?: Record<string, unknown>,
    options?: ErrorOptions,
  ) => void;
};

declare global {
  interface Window {
    __appErrorReporter?: ErrorReporter;
  }
}

export function reportRootError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const reporter = window.__appErrorReporter;
  if (reporter?.captureException) {
    reporter.captureException(
      error,
      { source: "react_error_boundary", route: window.location.pathname, ...context },
      { mechanism: "react_error_boundary", handled: false, severity: "error" },
    );
    return;
  }
  // Fallback: just log it so it shows up in the deployer's own console.
  console.error("[app error]", error, context);
}
