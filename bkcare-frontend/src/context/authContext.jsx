import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Lấy dữ liệu từ localStorage khi ứng dụng khởi chạy
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = async (role, phone, password) => {
        try {
            const data = await authService.login(role, phone, password);
            setUser(data.user);
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            // Redirect based on the role
            if (data.user.role === "admin") {
                navigate("/admin");
            } else if (data.user.role === "doctor") {
                navigate("/doctor");
            } else if (data.user.role === "patient") {
                navigate("/");
            } else {
                navigate("/");
            }
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    };

    const register = async (
        name,
        phone,
        password,
        address,
        gender,
        birthDate
    ) => {
        try {
            console.log("AuthContext register params:", {
                name,
                phone,
                password,
                address,
                gender,
                birthDate,
            });
            await authService.register(
                name,
                phone,
                password,
                address,
                gender,
                birthDate
            );
            navigate("/login");
        } catch (error) {
            console.error("Registration failed:", error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.clear();
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AuthContext;
