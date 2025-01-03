import React from 'react';


interface ErrorProps {
  errorMessage: string | null; 
}

const ErrorComponent: React.FC<ErrorProps> = ({ errorMessage }) => {
  if (!errorMessage) return null;

  return (
    <div style={{
      padding: '16px',
      backgroundColor: '#f8d7da',
      color: '#721c24',
      border: '1px solid #f5c6cb',
      borderRadius: '4px',
      maxWidth: '400px',
      margin: '16px auto',
      fontFamily: 'Arial, sans-serif',
    }}>
      <strong>Error:</strong> {errorMessage}
    </div>
  );
};

export default ErrorComponent;
