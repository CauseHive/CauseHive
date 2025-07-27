// signup/api.js
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api'; // Replace with your actual backend URL

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE}/users/register/`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Signup failed' };
  }
};
