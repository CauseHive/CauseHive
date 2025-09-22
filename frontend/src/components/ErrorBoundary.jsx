import React from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console in development
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // In production, you could send this to an error reporting service
    // Example: errorReportingService.captureException(error, { extra: errorInfo });

    this.setState({
      error,
      errorInfo
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      const { fallback: Fallback, showDetails = false } = this.props;

      // If a custom fallback component is provided, use it
      if (Fallback) {
        return <Fallback error={this.state.error} retry={this.handleRetry} />;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="max-w-lg w-full">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-red-100 rounded-full w-fit">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <CardTitle className="text-xl text-gray-900">
                Something went wrong
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 text-center">
                We encountered an unexpected error. This has been logged and we're working to fix it.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={this.handleRetry} variant="outline" className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </Button>
                <Button onClick={this.handleGoHome} className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Go Home
                </Button>
              </div>

              {showDetails && this.state.error && (
                <details className="mt-4 p-3 bg-gray-100 rounded-lg text-sm">
                  <summary className="cursor-pointer font-medium text-gray-700 mb-2">
                    Error Details (for developers)
                  </summary>
                  <pre className="whitespace-pre-wrap text-red-600 text-xs overflow-auto">
                    {this.state.error.toString()}
                    {this.state.errorInfo && `\n\n${this.state.errorInfo.componentStack}`}
                  </pre>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
