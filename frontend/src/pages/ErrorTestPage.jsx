import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Bug, Zap, RefreshCw } from 'lucide-react';

/**
 * ErrorTestPage - A page to test error boundaries and error handling
 */

// Component that throws an error on demand
const ErrorThrower = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('This is a test error to verify error boundaries are working!');
  }
  return <p className="text-green-600">✅ No error thrown - error boundary is ready</p>;
};

// Component to test async errors
const AsyncErrorThrower = () => {
  const [asyncError, setAsyncError] = useState(null);

  const triggerAsyncError = () => {
    setTimeout(() => {
      setAsyncError(new Error('This is a test async error'));
    }, 1000);
  };

  if (asyncError) {
    throw asyncError;
  }

  return (
    <div>
      <Button onClick={triggerAsyncError} variant="destructive" size="sm">
        <Zap className="h-4 w-4 mr-2" />
        Trigger Async Error
      </Button>
    </div>
  );
};

export function ErrorTestPage() {
  const [throwError, setThrowError] = useState(false);
  const [testResults, setTestResults] = useState([]);

  const runTest = (testName, testFn) => {
    try {
      testFn();
      setTestResults(prev => [...prev, { name: testName, status: 'passed', message: 'Test completed successfully' }]);
    } catch (error) {
      setTestResults(prev => [...prev, { name: testName, status: 'failed', message: error.message }]);
    }
  };

  const resetTests = () => {
    setTestResults([]);
    setThrowError(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Error Handling Tests</h1>
        <p className="text-gray-600 mt-2">
          Test error boundaries, loading states, and error handling mechanisms
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Error Boundary Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bug className="h-5 w-5" />
              Error Boundary Test
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Test if error boundaries catch and display errors properly
            </p>
            
            <ErrorThrower shouldThrow={throwError} />
            
            <div className="flex gap-2">
              <Button 
                onClick={() => setThrowError(true)} 
                variant="destructive" 
                size="sm"
                disabled={throwError}
              >
                <Bug className="h-4 w-4 mr-2" />
                Trigger Error
              </Button>
              <Button 
                onClick={() => setThrowError(false)} 
                variant="outline" 
                size="sm"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Async Error Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Async Error Test
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Test async error handling and boundaries
            </p>
            
            <AsyncErrorThrower />
          </CardContent>
        </Card>
      </div>

      {/* Loading States Test */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Loading States Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Spinner Loading</h4>
              <div className="h-8 w-8 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Skeleton Loading</h4>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Pulse Loading</h4>
              <div className="h-16 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {testResults.map((result, index) => (
                <Alert 
                  key={index} 
                  variant={result.status === 'passed' ? 'default' : 'destructive'}
                >
                  <AlertDescription>
                    <span className="font-medium">{result.name}:</span> {result.message}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
            <Button onClick={resetTests} className="mt-4" variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset Tests
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="mt-8 flex flex-wrap gap-4">
        <Button onClick={() => window.location.href = '/system-status'} variant="outline">
          Back to System Status
        </Button>
        <Button onClick={() => window.location.href = '/'} variant="outline">
          Go to Home
        </Button>
      </div>
    </div>
  );
}

export default ErrorTestPage;