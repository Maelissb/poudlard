import React, { useState } from 'react';
import './EntityCard.scss';
import { createPortal } from 'react-dom';
import ModalClasse from './Modal/ModalClasse';
type Endpoint = `/${string}`;
interface Entity {
    id: number;
    name?: string;
    image?: string;
    firstname?: string;
    lastname?: string;
}

interface EntityCardProps<T extends Entity> {
    entity: T;
    renderDetails: (entity: T) => React.ReactNode;
    onUpdate: () => void;
    renderForm: (entity: T, handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void) => React.ReactNode;
    entrypoint: Endpoint;
}

function EntityCard<T extends Entity>({ entity, renderDetails, onUpdate, renderForm, entrypoint }: EntityCardProps<T>) {
    const [showModal, setShowModal] = useState(false);
    const openModal = () => {
        setShowModal(true);
    }

    const closeModal = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();


        setShowModal(false);
    }
    const handleUpdate = () => {
        onUpdate();
    }

    return (
        <article className="entity_card" onClick={openModal}>
            {entity.image && <img src={entity.image} alt={entity.name} />}
            {entity.name ? <h2>{entity.name}</h2> : <h2>{entity.firstname} {entity.lastname}</h2>}
            {renderDetails(entity)}
            {showModal && createPortal(
                <ModalClasse data={entity} onClose={closeModal} onActionComplete={handleUpdate} entrypoint={entrypoint} renderFields={renderForm} />,
                document.body
            )}
        </article>
    );
}

export default EntityCard;