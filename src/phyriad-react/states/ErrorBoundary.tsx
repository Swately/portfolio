import { Component, type ErrorInfo, type ReactNode } from 'react';
import Button from '../controls/Button';
import styles from './ErrorBoundary.module.css';

type ErrorBoundaryProps = {
  /** Copy as props, like NotFoundView: the substrate cannot know the language. */
  title?: ReactNode;
  message?: ReactNode;
  retryLabel?: ReactNode;
  /** Observe the error (report it, log it). The boundary still renders the fallback. */
  onError?: (error: unknown, info: ErrorInfo) => void;
  children: ReactNode;
};

type ErrorBoundaryState = { failed: boolean };

/**
 * What renders when a subtree throws — the state client-rendered apps most
 * often leave to a blank page.
 *
 * This is the one legitimate `role="alert"` in the system: a crash announces
 * itself by APPEARING, and no focus was moving anywhere for the announcement
 * doctrine to lean on. (Compare `ErrorSummary`, where focus moves and an
 * alert would double-announce.)
 *
 * A class component because that is still the only way to catch a render
 * error. Retry clears the flag and re-renders the children — the right move
 * for transient failures, and for persistent ones it honestly crashes again.
 */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { failed: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    this.props.onError?.(error, info);
    if (import.meta.env.DEV) console.error('[ErrorBoundary]', error);
  }

  render() {
    const {
      title = 'Something went wrong',
      message = 'This section failed to render. The rest of the page is unaffected.',
      retryLabel = 'Try again',
      children,
    } = this.props;

    if (!this.state.failed) return children;

    return (
      <div role="alert" className={styles.boundary}>
        <p className={styles.title}>{title}</p>
        <p className={styles.message}>{message}</p>
        <div>
          <Button onClick={() => this.setState({ failed: false })}>{retryLabel}</Button>
        </div>
      </div>
    );
  }
}

// Made with my soul - Swately <3
