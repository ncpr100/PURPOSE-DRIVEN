'use client'

import React from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class SessionErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🚨 Session error boundary caught an error:', error)
    console.error('🚨 Error details:', error.message)
    console.error('🚨 Error stack:', error.stack)
    console.error('🚨 Component stack:', errorInfo.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-2 text-red-600">🚨 Application Error</h2>
          <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
            <p className="text-sm font-mono text-red-800">
              {this.state.error?.message || 'Unknown error occurred'}
            </p>
            <details className="mt-2">
              <summary className="cursor-pointer text-red-600">Error Details</summary>
              <pre className="mt-2 text-xs text-red-700 overflow-auto">
                {this.state.error?.stack}
              </pre>
            </details>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            This error information will help diagnose the issue.
          </p>
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
            onClick={() => window.location.reload()}
          >
            Recargar página
          </button>
        </div>
      )
    }

    return this.props.children
  }
}