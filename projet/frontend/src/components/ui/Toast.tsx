import React, { useEffect, useState } from 'react';
import './Toast.scss';

interface ToastProps {
    message: string;
    variant: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
    onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, variant, duration = 3000, onClose }) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        setShow(true);
        const timer = setTimeout(() => {
            setShow(false);
            setTimeout(onClose, 500);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div className={`toast ${variant} ${show ? 'show' : ''}`}>
            {message}
        </div>
    );
};

export default Toast;