import React, { MouseEvent, useEffect } from "react";
import Button from "../Button";
import './Modal.scss'
interface ModalProps {
    onClose: (e: MouseEvent<HTMLButtonElement>) => void
}

const ModalCreateWizard = ({ onClose }: ModalProps) => {
    const [lastname, setLastname] = React.useState("");
    const [firstname, setFirstname] = React.useState("");
    const [birthdate, setBirthdate] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [image, setImage] = React.useState("");
    const [houses, setHouses] = React.useState([])
    const [classes, setClasses] = React.useState([])
    const [houseSelected, setHouseSelected] = React.useState("")
    const [classSelected, setClassSelected] = React.useState("")
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    if (localStorage.getItem('token')) {
        headers.append('Authorization', `Bearer ${localStorage.getItem('token')}`);
    }
    useEffect(() => {
        const fetchHouses = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/houses`, {
                    method: 'GET',
                    headers: headers
                });
                const data = await response.json();
                setHouses(data);
            } catch (error) {
                console.error(error);
            }
        };
        const fetchClasses = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/classes`, {
                    method: 'GET',
                    headers: headers
                });
                const data = await response.json();
                setClasses(data);
            } catch (error) {
                console.error(error);
            }
        }

        fetchHouses();
        fetchClasses();
    }, []);

    const postWizard = async () => {
        console.log(houseSelected, classSelected)
        const response = await fetch(`${import.meta.env.VITE_API_URL}/wizards`, {
            method: "POST",
            body: JSON.stringify({
                "lastname": lastname,
                "firstname": firstname,
                "birthdate": birthdate,
                "email": email,
                "image": image,
                "house_id": houseSelected,
                "class_id": classSelected,
                "password": "poudlard"

            }),
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }


        })



    }
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await postWizard();
        onClose(e);


    }

    return (
        <div className="modal">
            <div className="modal-content">

                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Nom du soricer :</label>
                        <input type="text" value={lastname} onChange={(e) => setLastname(e.target.value)} />

                    </div>
                    <div className="input-group">

                        <label>Prénom du soricer :</label>
                        <input type="text" value={firstname} onChange={(e) => setFirstname(e.target.value)} />
                    </div>
                    <div className="input-group">
                        <label>Anniversaire :</label>
                        <input type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} />
                    </div>
                    <div className="input-group">
                        <label>Email :</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="input-group">
                        <label>Image :</label>
                        <input type="url" value={image} onChange={(e) => setImage(e.target.value)} />
                    </div>
                    <div className="input-group">
                        <label>Maison :</label>
                        <select onChange={(e) => setHouseSelected(e.target.value)}>
                            <option>Choisir une maison</option>
                            {houses.map((house) => <option key={house.id} value={house.id}>{house.name}</option>)}
                        </select>
                    </div>
                    <div className="input-group">
                        <label>Classes :</label>
                        <select onChange={(e) => setClassSelected(e.target.value)}>
                            <option>Choisir une classe</option>
                            {classes.map((classe) => <option key={classe.id} value={classe.id} >{classe.name}</option>)}
                        </select>
                    </div>




                    <div className="modal-footer">

                        <Button type="submit" label="Ajouter" />

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


export default ModalCreateWizard;
