function ErrorState({ message }) {
  return <div role="alert">{message || 'Something went wrong.'}</div>;
}

export default ErrorState;
