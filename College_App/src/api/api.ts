import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api'; // Update for production or Android Emulator (10.0.2.2)

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const authApi = {
    login: (email: string, password: string) => api.post('/auth/login', { email, password }),
};

export const roomApi = {
    getAll: () => api.get('/rooms'),
    bookRoom: (bookingData: any) => api.post('/bookings', bookingData),
};

export default api;
