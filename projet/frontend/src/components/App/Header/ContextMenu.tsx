import React, { useEffect, useState } from 'react';
import './ContextMenu.scss';
import { createPortal } from 'react-dom';
import ModalCreateWizard from '../../ui/Modal/ModalCreateWizard';
import Button from '../../ui/Button';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { fetchMe } from '../../../api/fetchMe';
interface RootObject {
    role: Role;
    wizard: Wizard;
    iat: number;
    exp: number;
}
interface Wizard {
    id: number;
    lastname: string;
    firstname: string;
    birthdate: string;
    email: string;
    image: string;
    house_id: number;
    class_id: number;
    created_at: string;
    updated_at: string;
}
interface Role {
    id: number;
    name: string;
    is_staff: boolean;
    created_at: string;
    updated_at: string;
}
const ContextMenu = () => {
    const [showMenu, setShowMenu] = useState(false);
    const [user, setUser] = useState<RootObject>();
    const [showModal, setShowModal] = useState(false);
    const ctx = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        try {
            fetchMe().then((data) => {
                setUser(data.wizard);
            });
        } catch (e) {
            localStorage.removeItem('token');
            navigate('/');
            console.log(e);
        }

    }, []);
    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };
    const openModal = () => {
        setShowModal(true);
    }
    const closeModal = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();

        setShowModal(false);
    }
    const logout = () => {
        ctx.logout();
        navigate('/');

    }
    return (
        <div className="context-menu-container">
            <img onClick={toggleMenu} src="/wizard.png" alt="Logo de Poudlard" />

            {showMenu && (
                <div className="context-menu">
                    <div>
                        <h1>Bienvenue {user?.wizard.firstname} {user?.wizard.lastname}</h1>
                        <h2>Vous êtes conecté en tant que : {user?.role.name}</h2>
                        <Button label="Se déconnecter" onClick={logout} />
                    </div>

                    {user?.role.is_staff && (
                        <>
                            <hr />
                            <ul className='context-menu-options'>
                                <li onClick={openModal}>Ajouter un nouveau compte</li>
                            </ul>
                        </>
                    )}



                </div>
            )}
            {
                showModal && createPortal(<ModalCreateWizard onClose={closeModal} />, document.body)
            }
        </div>
    );
};

export default ContextMenu;