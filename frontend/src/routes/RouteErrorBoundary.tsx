import React from 'react'
import { isRouteErrorResponse, useRouteError } from 'react-router-dom'

export function RouteErrorBoundary() {
  const error = useRouteError()
  const { title, details } = (() => {
    if (isRouteErrorResponse(error)) {
      return { title: `Error ${error.status}`, details: error.statusText }
    }
    if (error instanceof Error) return { title: 'Something went wrong', details: error.message }
    return { title: 'Something went wrong', details: undefined }
  })()

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
