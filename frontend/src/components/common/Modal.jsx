function Modal({ children, open }) {
  if (!open) return null;
  return <div>{children}</div>;
}

export default Modal;
