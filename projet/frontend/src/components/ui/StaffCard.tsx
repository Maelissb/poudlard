import { createPortal } from "react-dom";
import { StaffMember } from "../../@types/wizard";
import "./StaffCard.scss";
import Modal from "./Modal/ModalWizard";
import { useState } from "react";
import Toast from "./Toast";

interface StaffCardProps {
    wizard: StaffMember["wizard"];
    room: StaffMember["room"];
    subject: StaffMember["subject"];
    onActionComplete: () => void;
}

const StaffCard = ({ wizard, room, subject, onActionComplete }: StaffCardProps) => {
    const [showModal, setShowModal] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const handleShowToast = () => {
        setShowToast(true);
    }
    const getRoomLabel = (room: StaffMember["room"]) => {
        if (!room) {
            return "Pas de salle attribuée";
        }

        let value = `${room.name}`;
        if (room.building) {
            value += ` - ${room.building}`;
            if (room.floor) {
                value += `.${room.floor}`;
            }
            if (room.number) {
                value += `.${room.number}`;
            }
        }
        return value;
    };

    const openModal = () => {
        setShowModal(true);
    }

    const closeModal = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        onActionComplete();

        setShowModal(false);
    }

    return (
        <article className="staff_card" onClick={openModal}>
            <img src={wizard.image} alt="" />
            <h2>
                {wizard.firstname} {wizard.lastname}
            </h2>
            <label>Matière enseignée</label>
            <p>{subject.name}</p>
            <label>Salle de classe</label>
            <p>{getRoomLabel(room)}</p>
            {showModal && createPortal(
                <Modal wizard={wizard} onClose={closeModal} onToast={handleShowToast} />,
                document.body
            )}
            {showToast && createPortal(
                <Toast variant="success" message="Wizard mis à jour avec succès !" onClose={() => setShowToast(false)} />, document.body
            )}
        </article>
    );
};

export default StaffCard;