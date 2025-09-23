import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });

    // Optional: Report error to monitoring service
    if (process.env.NODE_ENV === 'production') {
      // You can integrate with error reporting services like Sentry here
      console.error('Production error caught by ErrorBoundary:', {
        error: error.toString(),
        componentStack: errorInfo.componentStack,
        errorBoundary: this.props.name || 'Unknown',
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      });
    }
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }));
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleRefresh = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const { fallback: Fallback, level = 'page' } = this.props;

      // Use custom fallback component if provided
      if (Fallback) {
        return (
          <Fallback
            error={this.state.error}
            errorInfo={this.state.errorInfo}
            onRetry={this.handleRetry}
            retryCount={this.state.retryCount}
          />
        );
      }

      // Different error UIs based on error boundary level
      if (level === 'app') {
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Application Error
                </CardTitle>
                <CardDescription>
                  Something went wrong. We're sorry for the inconvenience.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Button
                    onClick={this.handleRefresh}
                    className="w-full"
                    variant="default"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Page
                  </Button>
                  <Button
                    onClick={this.handleGoHome}
                    className="w-full"
                    variant="outline"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Go to Homepage
                  </Button>
                </div>
                {process.env.NODE_ENV === 'development' && (
                  <details className="mt-4">
                    <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                      Error Details (Development)
                    </summary>
                    <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded text-xs text-red-800 overflow-auto max-h-40">
                      <div className="font-semibold mb-1">Error:</div>
                      <div className="mb-2">{this.state.error && this.state.error.toString()}</div>
                      <div className="font-semibold mb-1">Component Stack:</div>
                      <pre className="whitespace-pre-wrap">{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
                    </div>
                  </details>
                )}
              </CardContent>
            </Card>
          </div>
        );
      }

      if (level === 'page') {
        return (
          <div className="flex items-center justify-center min-h-[400px] p-4">
            <Card className="w-full max-w-sm">
              <CardHeader className="text-center">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                </div>
                <CardTitle className="text-lg font-semibold">Page Error</CardTitle>
                <CardDescription>
                  This page encountered an error and couldn't be displayed.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={this.handleRetry}
                  className="w-full"
                  variant="default"
                  disabled={this.state.retryCount >= 3}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {this.state.retryCount >= 3 ? 'Max Retries Reached' : 'Try Again'}
                </Button>
                <Button
                  onClick={this.handleGoHome}
                  className="w-full"
                  variant="outline"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
              </CardContent>
            </Card>
          </div>
        );
      }

      // Component level error boundary
      return (
        <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
          <div className="flex items-center space-x-2 text-red-800 mb-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="font-medium text-sm">Component Error</span>
          </div>
          <p className="text-red-700 text-sm mb-3">
            This component failed to render properly.
          </p>
          <div className="space-x-2">
            <Button
              size="sm"
              onClick={this.handleRetry}
              variant="outline"
              disabled={this.state.retryCount >= 2}
            >
              {this.state.retryCount >= 2 ? 'Failed' : 'Retry'}
            </Button>
            {process.env.NODE_ENV === 'development' && (
              <details className="inline">
                <summary className="text-xs text-red-600 cursor-pointer hover:underline">
                  Debug
                </summary>
                <pre className="text-xs mt-1 p-2 bg-red-100 rounded overflow-auto max-h-20">
                  {this.state.error && this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;