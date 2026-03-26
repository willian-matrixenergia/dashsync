"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex-1 flex flex-col items-center justify-center p-12 bg-red-50 text-accent-red rounded-lg border border-red-200 m-6">
          <span className="material-symbols-outlined text-4xl mb-4">error</span>
          <h2 className="text-xl font-bold mb-2">Component Failure</h2>
          <p className="text-sm opacity-80 text-center max-w-md">
            This part of the dashboard failed to load. Please check the console or try refreshing.
          </p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="mt-6 px-4 py-2 bg-accent-red text-white rounded hover:bg-accent-red/90 transition-colors font-bold text-sm"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
