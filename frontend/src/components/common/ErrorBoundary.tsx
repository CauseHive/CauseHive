import React from 'react'

type State = { hasError: boolean; error?: Error }

export class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(_error: Error, _info: React.ErrorInfo) {
    // Optional: send to monitoring here
    // console.error('ErrorBoundary caught:', error, info)
  }

  handleReload = () => {
    this.setState({ hasError: false, error: undefined })
    location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6">
          <h1 className="text-lg font-semibold">Unexpected error</h1>
          {this.state.error?.message && (
            <p className="mt-2 text-sm text-muted-foreground">{this.state.error.message}</p>
          )}
          <button
            className="mt-4 inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground"
            onClick={this.handleReload}
          >
            Reload
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
