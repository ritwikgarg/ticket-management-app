import React, { createContext, useContext, useEffect, useState } from "react";
//import axios from "axios";
import type { User } from "@/models/User";
import { Role } from "@/enums/user/Role";

type AuthContextType = {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
};

// Create Context with default value
export const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        if (user) {
            console.log("User updated:", user);
            console.log("AuthContext value would be:", {
                user,
                isAuthenticated: !!user,
                login,
                logout,
            });
        }
    }, [user]);

    // Login function
    const login = async (/*email: string, password: string*/) => {
        try {
            //TODO: set token in cookies and also validate if a token already exists in the cookies and if it is valid
            // const response = await axios.post("/api/login", {
            //     email,
            //     password,
            // });
            const response = {
                data: {
                    user: {
                        employee_id: "57264",
                        first_name: "Ritwik",
                        last_name: "Garg",
                        role: Role.SERVICE,
                        email: "ritwik.garg@merai.co",
                        contact_no: "8291620011",
                    },
                },
            };
            setUser(response.data.user);
            // console.log(useContext(AuthContext))
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    };
    // Logout function
    const logout = () => {
        setUser(null);
        // TODO: clear tokens
    };
    return (
        <AuthContext.Provider
            value={{ user, login, logout, isAuthenticated: !!user }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for easier usage
export const useAuth = () => {
    const context: AuthContextType | undefined  = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};
