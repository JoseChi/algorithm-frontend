import axios from 'axios';

const api = axios.create({
  // Asegúrate de que esta URL sea la correcta de tu Railway
  baseURL: 'https://ecommerce-production-1fe1.up.railway.app/api',
  // 🚫 AQUÍ ESTABA EL ERROR: Quitamos los headers por defecto.
  // No definimos 'Content-Type' aquí para que no sea obligatorio.
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // --- LÓGICA BLINDADA ---
  // Solo agregamos 'application/json' si NO estamos enviando un archivo.
  // Si es FormData (imagen), NO hacemos nada y dejamos que el navegador ponga el 'multipart/form-data' correcto automáticamente.
  if (!(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;