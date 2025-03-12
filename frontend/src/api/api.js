import axios from "axios";


const API_URL = "https://child-development-backend.fly.dev/api";



const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const loginUser = async (email, password) => {
  try {
    const response = await api.post("/users/login", { email, password });
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

export const addChildData = async (childData) => {
  try {
    const response = await api.post("/children", childData);
    return response.data;
  } catch (error) {
    console.error("Error adding child data:", error);
    throw error;
  }
};

export const getChildren = async () => {
  try {
    const response = await api.get("/children");
    return response.data;
  } catch (error) {
    console.error("Error fetching children data:", error);
    throw error;
  }
};

export default api;
