import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginSuccess } from '../redux/authSlice';
import api from '../services/api';
import { User, Lock, Loader2 } from 'lucide-react';

// --- NUEVA FUNCIÓN MÁGICA ---
// Esta función toma el token encriptado y lee la información oculta (ID, rol, exp, etc.)
function parseJwt(token) {
    try {
        if (!token) return null;
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Error al decodificar token:", e);
        return null;
    }
}

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      console.log("Enviando credenciales...", formData); 
      const response = await api.post('/auth/login', formData);

      console.log("Respuesta cruda del Backend:", response.data);

      // 1. Obtenemos el token
      const token = response.data.token || response.data.accessToken;

      if (!token) {
          throw new Error("El servidor no devolvió un token de acceso.");
      }

      // 2. INTENTO DE RECUPERACIÓN DE ID
      // Estrategia A: ¿Viene directo en el JSON?
      let userId = response.data.id || response.data.userId || response.data.user?.id;

      // Estrategia B: Si no viene directo, lo buscamos DENTRO del token
      if (!userId) {
          console.log("ID no encontrado en respuesta directa. Buscando dentro del token...");
          const decodedToken = parseJwt(token);
          console.log("Token Decodificado:", decodedToken); // <--- MIRA ESTE LOG EN CONSOLA

          // Busca propiedades comunes donde Spring Boot guarda el ID
          userId = decodedToken?.id || decodedToken?.userId || decodedToken?.sub; 
          
          // NOTA: A veces 'sub' es el username, no el ID. 
          // Si decodedToken.id es undefined, tu Backend Java necesita ajustes.
      }

      if (!userId) {
         console.error("❌ ERROR CRÍTICO: Imposible encontrar el ID del usuario.");
         setError("Error técnico: El sistema no pudo identificar tu usuario. Contacta soporte.");
         return; 
      }

      console.log(`✅ ID Encontrado: ${userId}`);

      const userData = {
        token: token,
        user: { 
            id: userId, 
            username: response.data.username || formData.username,
            role: response.data.role
        } 
      };

      dispatch(loginSuccess(userData));
      navigate('/'); 
      
    } catch (err) {
      console.error("Error en login:", err);
      setError("Credenciales incorrectas o error en el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border-t-4 border-blue-600">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2 font-mono">
          Bienvenido
        </h2>
        <p className="text-center text-gray-500 mb-8">Ingresa a tu cuenta Algorithm</p>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm text-center border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={20} className="text-gray-400" />
              </div>
              <input
                type="text"
                name="username" 
                required
                className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                placeholder="Ej. usuario_prueba_2"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={20} className="text-gray-400" />
              </div>
              <input
                type="password"
                name="password"
                required
                className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-sky-700 transition flex justify-center items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          ¿No tienes cuenta?{' '}
          <a href="#" className="text-blue-600 font-bold hover:underline">Regístrate aquí</a>
        </div>
      </div>
    </div>
  );
};

export default Login;