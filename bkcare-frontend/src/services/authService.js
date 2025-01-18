import apiClient from "./axiosConfig";

// Update login to use phone number
const login = async (role, phone, password) => {
    try {
        const response = await apiClient.post("/auth/login", {
            role,
            phone,
            password,
        });
        return response.data;
    } catch (error) {
        console.error("Login request failed:", error);
        throw error;
    }
};

// Update register to include gender and birthDate
const register = async (name, phone, password, address, gender, birthDate) => {
    try {
        const response = await apiClient.post("/auth/register", {
            name,
            phone,
            password,
            address,
            gender,
            birthDate,
        });
        return response.data;
    } catch (error) {
        console.error("Registration request failed:", error);
        throw error;
    }
};

const authService = { login, register };

export default authService;
