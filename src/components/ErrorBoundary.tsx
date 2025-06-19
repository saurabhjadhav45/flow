import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    console.error('Render error', error, info);
  }

  render() {
    if (this.state.hasError) {
      return <div className="text-red-600 text-xs">Error rendering node</div>;
    }
    return this.props.children;
  }
}
