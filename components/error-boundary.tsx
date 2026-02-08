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
    console.error('Session error boundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-center">
          <h2 className="text-lg font-semibold mb-2">Cargando aplicación...</h2>
          <p className="text-sm text-muted-foreground">
            Inicializando sesión. Por favor espera un momento.
          </p>
          <button 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
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