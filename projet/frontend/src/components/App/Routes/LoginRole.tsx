import { useAuth } from "../../../contexts/AuthContext";
import RoleButton from "../../ui/RoleButton";
import "./LoginRole.scss";
import React, { useEffect } from "react";
import { RoleType } from "../../../@types/role";
import { useNavigate } from "react-router-dom";
const LoginRole: React.FC = () => {
    const navigate = useNavigate();
    const ctx = useAuth();
    const token = localStorage.getItem('token');
    const [roles, setRoles] = React.useState<RoleType[] | null>(null);
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/wizard-roles`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${token}`

                    }
                });
                if (response.status === 200) {
                    response.json().then((data) => {
                        setRoles(data);
                    });

                    return;
                } else {

                    return;
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchRoles();

    }, []);
    const handleClick = async (id: number) => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/login-role`, {
            method: "POST",
            body: JSON.stringify({
                "id": id
            }),
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${ctx.token}`
            }
        })
        if (response.status === 200) {
            response.json().then((data) => {
                console.log(data);
                localStorage.removeItem('token');
                ctx.loginRole(data.wizard, data.token, data.role);
                navigate("/");
            });

        }

    };

    return (
        <main className="role">
            <img src="/poudlard.png" alt="Logo de Poudlard" />
            <h1>Bienvenue {ctx.user?.firstname} {ctx.user?.lastname}</h1>
            <p>Continuer en tant que</p>
            <div className="role-buttons">
                {roles && roles.map((role) => {
                    return <RoleButton label={role.name} onClick={() => handleClick(role.id)} />;
                })}

            </div>

        </main>
    );
};

export default LoginRole;
