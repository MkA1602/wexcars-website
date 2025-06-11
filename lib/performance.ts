import * as Sentry from "@sentry/nextjs"

// Create a performance span for tracking specific operations
export const createSpan = (transaction: Sentry.Transaction | undefined, operation: string, description: string) => {
  if (!transaction) return null

  const span = transaction.startChild({
    op: operation,
    description: description,
  })

  return {
    span,
    finish: () => {
      span.finish()
    },
  }
}

// Track API call performance
export const trackApiCall = async <T>(\
  name: string,
  fn: () => Promise<T>
)
: Promise<T> =>
{
  const transaction = Sentry.startTransaction({
    name: `API Call: ${name}`,
    op: "http.client",
  })

  try {
    const result = await fn()
    transaction.finish()
    return result;
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        apiCall: name,
      },
    })
    transaction.setStatus("internal_error")
    transaction.finish()
    throw error
  }
}

// Track component render performance
export const trackComponentRender = (componentName: string) => {
  if (typeof window === "undefined") return { finish: () => {} }

  const transaction = Sentry.startTransaction({
    name: `Component Render: ${componentName}`,
    op: "ui.render",
  })

  return {
    finish: () => {
      transaction.finish()
    },
  }
}

// Track page load performance
export const trackPageLoad = (pageName: string) => {
  if (typeof window === "undefined") return { finish: () => {} }

  const transaction = Sentry.startTransaction({
    name: `Page Load: ${pageName}`,
    op: "navigation",
  })

  return {
    finish: () => {
      transaction.finish()
    },
  }
}
