import React from 'react';
import './Error.scss';

interface ErrorProps {
    message: string;
    variant?: 'warning' | 'error' | 'info';
}

const Error: React.FC<ErrorProps> = ({ message, variant = 'error' }) => {
    return (
        <div className={`error ${variant}`}>
            <strong>{variant === 'error' ? 'Oups!' : variant === 'warning' ? 'Attention' : 'Info'}</strong>
            <p>{message}</p>
        </div>
    );
};

export default Error;