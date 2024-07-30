import { MouseEvent } from "react";
import './Modal.scss';
import { Wizard } from "../../../@types/wizard";
import Button from "../Button";
import React from "react";

interface ModalProps {
    wizard: Wizard;
    onClose: (e: MouseEvent<HTMLButtonElement>) => void;
    onToast: () => void;
}

const ModalWizard = ({ wizard, onClose, onToast }: ModalProps) => {
    const [lastname, setLastname] = React.useState(wizard.lastname);
    const [firstname, setFirstname] = React.useState(wizard.firstname);
    const [birthdate, setBirthdate] = React.useState(wizard.birthdate);
    const [email, setEmail] = React.useState(wizard.email);

    const putWizard = async () => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/wizards/${wizard.id}`, {
            method: "PUT",
            body: JSON.stringify({
                "lastname": lastname,
                "firstname": firstname,
                "birthdate": birthdate,
                "email": email,
                "image": wizard.image,
                "house_id": wizard.house_id,
                "class_id": wizard.class_id,
            }),
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        if (response.status === 200) {
            onToast()
            console.log("Wizard mis à jour")
        } else {
            console.log("Erreur lors de la mise à jour du sorcier")
        }
    }
    const deleteWizard = async () => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/wizards/${wizard.id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        if (response.status === 200) {
            console.log("Wizard supprimé")

        } else {
            console.log("Erreur lors de la suppression du sorcier")
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await putWizard();
        onClose(e);

    }
    const handleDelete = async (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        await deleteWizard();
        onClose(e);
    }

    return (
        <div className="modal">
            <div className="modal-content">

                <form className="modal-form" onSubmit={handleSubmit}>
                    <label>Nom du soricer :</label>
                    <input type="text" value={lastname} onChange={(e) => setLastname(e.target.value)} />
                    <label>Prénom du soricer :</label>
                    <input type="text" value={firstname} onChange={(e) => setFirstname(e.target.value)} />
                    <label>Anniversaire :</label>
                    <input type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} />
                    <label>Email :</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

                    <div className="modal-footer">
                        <Button type="button" variant="danger" label="Supprimer" onClick={handleDelete} />
                        <Button type="submit" label="Valider" />

                    </div>

                </form>


                <button
                    type="button"
                    className="modal-close"
                    onClick={onClose}
                >
                    X
                </button>
            </div>

        </div>
    )
}

export default ModalWizard;