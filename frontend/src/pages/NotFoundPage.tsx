import React from 'react'
import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-xl text-center">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">The page you’re looking for doesn’t exist or has been moved.</p>
      <Link to="/" className="mt-5 inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground">
        Go home
      </Link>
    </div>
  )
}

export default NotFoundPage
