import React from 'react';
import './Button.scss';

interface ButtonProps {
    label: string;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({ label, onClick, variant = 'primary', size = 'medium', disabled = false, type = 'button' }) => {
    return (
        <button
            className={`button ${variant} ${size}`}
            onClick={onClick}
            disabled={disabled}
            type={type}
        >
            {label}
        </button>
    );
};

export default Button;