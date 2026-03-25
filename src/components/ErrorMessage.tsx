import './ErrorMessage.css';

interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="error-msg">
      <strong>¡Ocurrió un error!</strong>
      <br />
      <br />
      {message}
    </div>
  );
}
