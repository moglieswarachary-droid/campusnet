import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('CampusNet Workspace ErrorBoundary caught an error:', error, errorInfo);
  }

  public handleReload = () => {
    // Clear potentially corrupted chunk states and reload
    window.location.reload();
  };

  public handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mb-6 shadow-sm">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-campus-deep-blue tracking-tight">
            Workspace Recovery System
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-campus-muted-text max-w-md">
            {this.props.fallbackMessage || 
              'The workspace encountered an unexpected loading interruption. Your session and saved data are protected.'}
          </p>

          {this.state.error && (
            <div className="mt-4 p-3 rounded-xl bg-slate-100 text-slate-700 text-[11px] font-mono max-w-lg overflow-x-auto border border-slate-200">
              {this.state.error.message || String(this.state.error)}
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={this.handleReload}
              className="campus-btn-primary text-xs py-2.5 px-4 rounded-xl flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reload Workspace</span>
            </button>

            <button
              onClick={this.handleGoHome}
              className="campus-btn-secondary text-xs py-2.5 px-4 rounded-xl flex items-center gap-2 cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Return to RBAC Gateway</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
