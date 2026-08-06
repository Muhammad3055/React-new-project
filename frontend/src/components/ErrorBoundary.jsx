import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center', background: '#fdfbf7', color: '#1c1917', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <i className="fas fa-exclamation-triangle" style={{ fontSize: '3rem', color: '#b45309', marginBottom: '1rem' }}></i>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Something went wrong / کوئی غلطی پیش آئی</h2>
          <p style={{ color: '#78716c', maxWidth: '400px', margin: '0.5rem 0 1.5rem 0' }}>
            {this.state.error?.toString() || "Please reload the page."}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{ padding: '0.65rem 1.5rem', borderRadius: '20px', border: '2px solid #b45309', background: '#ffffff', color: '#b45309', fontWeight: 800, cursor: 'pointer' }}
          >
            Reload Page / صفحہ دوبارہ لوڈ کریں
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
