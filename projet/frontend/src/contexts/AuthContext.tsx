import React, { createContext, useContext } from "react";
import { RoleType } from "../@types/role";
import { Wizard } from "../@types/wizard";


interface AuthContextType {
    user: Wizard | null;
    token: string | null;
    role: RoleType | null;
    login: (user: Wizard, token: string) => void;
    logout: () => void;
    loginRole: (user: Wizard, token: string, role: RoleType) => void;

}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = React.useState<Wizard | null>(null);
    const [token, setToken] = React.useState<string | null>(null);
    const [role, setRole] = React.useState<RoleType | null>(null);
    const login = (user: Wizard, token: string) => {
        setUser(user);
        setToken(token);
        localStorage.setItem('token', token);
    };
    const loginRole = (user: Wizard, token: string, role: RoleType) => {
        setUser(user);
        setToken(token);
        setRole(role);
        localStorage.removeItem('token');
        localStorage.setItem('token', token);

    };
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, token, role, login, logout, loginRole }}>
            {children}
        </AuthContext.Provider>

    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}