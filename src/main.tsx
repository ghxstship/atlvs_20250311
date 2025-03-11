import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import React from 'react';

// Ensure proper polyfills for Vercel's serverless environment
if (typeof window !== 'undefined') {
  // Add any necessary polyfills
}

// Create typesafe root element
const container = document.getElementById('root')!;
const root = createRoot(container);

// Error boundary for initialization errors
class ErrorBoundary extends React.Component<React.PropsWithChildren> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h1>Application Failed to Load</h1>
          <p>Please refresh the page or contact support</p>
        </div>
      );
    }
    return this.props.children;
  }
}

root.render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);