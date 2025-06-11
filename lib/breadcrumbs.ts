import * as Sentry from "@sentry/nextjs"

// Add a breadcrumb for user navigation
export const addNavigationBreadcrumb = (from: string, to: string) => {
  Sentry.addBreadcrumb({
    category: "navigation",
    message: `Navigated from ${from} to ${to}`,
    level: "info",
  })
}

// Add a breadcrumb for user actions
export const addUserActionBreadcrumb = (action: string, data?: Record<string, any>) => {
  Sentry.addBreadcrumb({
    category: "ui.action",
    message: action,
    data,
    level: "info",
  })
}

// Add a breadcrumb for API calls
export const addApiCallBreadcrumb = (endpoint: string, method: string, status?: number, error?: string) => {
  Sentry.addBreadcrumb({
    category: "xhr",
    message: `${method} ${endpoint}`,
    data: {
      method,
      url: endpoint,
      status,
      error,
    },
    level: status && status >= 400 ? "error" : "info",
  })
}

// Add a breadcrumb for state changes
export const addStateChangeBreadcrumb = (component: string, action: string, data?: Record<string, any>) => {
  Sentry.addBreadcrumb({
    category: "state",
    message: `${component}: ${action}`,
    data,
    level: "info",
  })
}
