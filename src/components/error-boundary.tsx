'use client';

import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { appLogger } from '@/lib/logger';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

/**
 * Error Boundary Component
 * Catches React errors and displays a user-friendly error page
 */
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.setState({ errorInfo });
    appLogger.error('ErrorBoundary', 'Caught error in React component', {
      error: error.toString(),
      componentStack: errorInfo.componentStack,
    });
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleGoHome = (): void => {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
          <div className="w-full max-w-md space-y-6 rounded-lg border border-error/20 bg-error-container/10 p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-error/20">
              <AlertCircle className="h-6 w-6 text-error" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-on-surface">Oops! Something went wrong</h1>
              <p className="text-sm text-on-surface-variant">
                We encountered an unexpected error. Please try again or contact support if the problem persists.
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="rounded bg-surface-container-lowest p-3 text-left">
                <p className="font-mono text-xs font-bold text-error">{this.state.error.message}</p>
                {this.state.errorInfo && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-xs text-on-surface-variant hover:text-on-surface">
                      Stack trace
                    </summary>
                    <pre className="mt-2 overflow-auto text-xs text-on-surface-variant">{this.state.errorInfo.componentStack}</pre>
                  </details>
                )}
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button onClick={this.handleReset} className="flex-1">
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
              <Button onClick={this.handleGoHome} variant="outline" className="flex-1">
                <Home className="h-4 w-4" />
                Go Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
