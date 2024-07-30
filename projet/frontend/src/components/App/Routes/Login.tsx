import { useAuth } from "../../../contexts/AuthContext";
import Button from "../../ui/Button";
import Error from "../../ui/Error";
import "./Login.scss";
import React from "react";
import { useNavigate } from "react-router-dom";
const Login: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [error, setError] = React.useState("");
    const ctx = useAuth();
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",

                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });
            if (response.status === 200) {
                const { wizard, token } = await response.json();
                ctx.login(wizard, token);

                navigate('/login-role')
                return;
            } else {
                setError("Identifiant ou mot de passe invalides");
                setPassword("");
                return;
            }
        } catch (error) {
            setError("Identifiant ou mot de passe invalides");
        }
    };
    return (
        <main className="login">
            <div>
                <img src="/poudlard.png" alt="Logo de Poudlard" />
                <h1>Connexion</h1>
            </div>
            <div>
                <form className="form" onSubmit={handleSubmit}>
                    <div className="email">
                        <input
                            type="email"
                            id="email"
                            aria-label="adresse email"
                            placeholder="Identifiant"
                            required
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        />
                    </div>
                    <div className="passWord">
                        <input
                            type="password"
                            id="password"
                            aria-label="mot de passe"
                            placeholder="Mot de passe"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <Button label="Soumettre" type="submit" />
                    </div>
                </form>

            </div>
            {error && <Error message={error} variant="error" />}
        </main>
    );
};

export default Login;
