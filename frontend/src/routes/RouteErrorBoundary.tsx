import React from 'react'
import { isRouteErrorResponse, useRouteError } from 'react-router-dom'

export function RouteErrorBoundary() {
  const error = useRouteError()
  let title = 'Something went wrong'
  let details: string | undefined

  if (isRouteErrorResponse(error)) {
    title = `Error ${error.status}`
    details = error.statusText
  } else if (error instanceof Error) {
    details = error.message
  }

  return (
    <div className="p-6">
      <h1 className="text-lg font-semibold">{title}</h1>
      {details && <p className="mt-2 text-sm text-muted-foreground">{details}</p>}
      <button className="mt-4 inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground" onClick={() => location.reload()}>
        Reload
      </button>
    </div>
  )
}

export default RouteErrorBoundary
