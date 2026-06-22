import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';

interface Props  { children: ReactNode; }
interface State  { error: Error | null; }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          minHeight: '60vh', padding: 32, textAlign: 'center',
        }}>
          <div style={{
            background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12,
            padding: '28px 32px', maxWidth: 480,
          }}>
            <p style={{ fontSize: 22, fontWeight: 700, color: '#B91C1C', marginBottom: 8 }}>
              Une erreur est survenue
            </p>
            <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 16 }}>
              Cette page a rencontré un problème. Essayez de naviguer vers une autre section.
            </p>
            <details style={{ textAlign: 'left', fontSize: 11, color: '#9CA3AF', marginBottom: 16 }}>
              <summary style={{ cursor: 'pointer', fontWeight: 600 }}>Détails de l'erreur</summary>
              <pre style={{ marginTop: 8, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                {this.state.error.message}
              </pre>
            </details>
            <button
              type="button"
              onClick={() => this.setState({ error: null })}
              style={{
                padding: '8px 20px', borderRadius: 8,
                background: '#B91C1C', color: '#fff',
                border: 'none', fontWeight: 600, fontSize: 13, cursor: 'pointer',
              }}
            >
              Réessayer
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
