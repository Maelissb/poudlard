import React from 'react';
import './RoleButton.scss';

interface RoleButtonProps {
    label: string;
    onClick: () => void;
    selected?: boolean;
}

const RoleButton: React.FC<RoleButtonProps> = ({ label, onClick, selected = false }) => {
    return (
        <button
            className={`role-button ${selected ? 'selected' : ''}`}
            onClick={onClick}
        >
            {label}
        </button>
    );
};

export default RoleButton;