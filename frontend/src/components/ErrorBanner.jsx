function ErrorBanner({ message, onDismiss }) {
  if (!message) return null;
  return (
    <div className="error-banner" role="alert">
      <span className="error-banner__icon">!</span>
      <span className="error-banner__msg">{message}</span>
      <button className="error-banner__close" onClick={onDismiss} aria-label="Dismiss error">×</button>
    </div>
  );
}

export default ErrorBanner;
