import { MouseEvent } from "react";
import './Modal.scss';
import Button from "../Button";
import React from "react";

type Endpoint = `/${string}`;
interface Entity {
    id: number;
    name?: string;
    image?: string;

}


interface ModalProps<T extends Entity> {
    data: T;
    onClose: (e: MouseEvent<HTMLButtonElement>) => void;
    onActionComplete: () => void;
    renderFields: (formData: T, handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void) => React.ReactNode;
    entrypoint: Endpoint;
} //permet a la modal de s'afficher

const ModalClasse = <T extends Entity>({ data, onClose, onActionComplete, renderFields, entrypoint }: ModalProps<T>) => {
    const [formData, setFormData] = React.useState<T>(data);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.name);
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }


    const putClasse = async () => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}${entrypoint}/${data.id}`, {
            method: "PUT",
            body: JSON.stringify(formData),
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('token')}` //headers permet d'envoyer les information a l'api
            }

        })
        if (response.status === 200) {
            console.log("mis à jour")

        } else {
            console.log("Erreur lors de la mise")
        }
    }


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => { //methode qui permet de modifier
        e.preventDefault();
        console.log(formData)
        await putClasse();
        onActionComplete();
        onClose(e);
    }




    return (
        <div className="modal">
            <div className="modal-content">

                <form className="modal-form" onSubmit={handleSubmit}>
                    {renderFields(formData, handleChange)}

                    <div className="modal-footer">

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

export default ModalClasse;