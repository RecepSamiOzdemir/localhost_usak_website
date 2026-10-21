import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in React component tree:', error, errorInfo);
  }

  public handleReload = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem 1rem',
          }}
        >
          <div
            className="card circuit-border"
            style={{
              maxWidth: '560px',
              width: '100%',
              textAlign: 'center',
              padding: '3rem 2rem',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <AlertTriangle size={48} style={{ color: '#FF6600' }} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              Beklenmeyen Bir Hata Oluştu
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Uygulama çalışırken beklenmedik bir durumla karşılaşıldı. Sayfayı yenileyerek veya anasayfaya dönerek devam edebilirsin.
            </p>

            {this.state.error && (
              <pre
                style={{
                  background: 'var(--bg-primary)',
                  padding: '0.85rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  color: '#FF6600',
                  textAlign: 'left',
                  overflowX: 'auto',
                  marginBottom: '1.5rem',
                  border: '1px solid rgba(255, 102, 0, 0.2)',
                }}
              >
                {this.state.error.message}
              </pre>
            )}

            <button
              onClick={this.handleReload}
              className="btn btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <RotateCcw size={16} />
              <span>Anasayfaya Dön</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
