import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { User, MapPin, Phone, Save, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify'; // <--- 1. IMPORTAR TOAST
import api from '../services/api';
import { loginSuccess } from '../redux/authSlice';

const UserProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    zipCode: '',
    phoneNumber: ''
  });

  useEffect(() => {
    if (user?.id) {
      api.get(`/users/${user.id}`)
        .then(res => {
            setFormData({
                address: res.data.address || '',
                city: res.data.city || '',
                zipCode: res.data.zipCode || '',
                phoneNumber: res.data.phoneNumber || ''
            });
        })
        .catch(err => console.error(err));
    }
  }, [user?.id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        const response = await api.put(`/users/${user.id}`, formData);
        
        const updatedUser = { ...user, ...response.data };
        
        dispatch(loginSuccess({
            user: updatedUser,
            token: localStorage.getItem('token')
        }));

        // --- 2. USAR TOAST EN VEZ DE ALERT ---
        toast.success("✅ ¡Información actualizada correctamente!");

    } catch (error) {
        console.error(error);
        toast.error("❌ Error al guardar perfil");
    } finally {
        setLoading(false);
    }
  };

  // ... (El return sigue exactamente igual, no cambia nada visual en el HTML) ...
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 min-h-[60vh]">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-blue-100 p-3 rounded-full">
            <User size={32} className="text-blue-600" />
        </div>
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Mi Perfil</h1>
            <p className="text-gray-500">Gestiona tus datos de envío</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
                <h3 className="font-bold text-gray-700 flex items-center gap-2 mb-4">
                    <MapPin size={18}/> Dirección de Envío
                </h3>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Calle y Número</label>
                        <input 
                            type="text" name="address" value={formData.address} onChange={handleChange}
                            placeholder="Ej. Av. Reforma 222, Depto 4B"
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad / Estado</label>
                            <input 
                                type="text" name="city" value={formData.city} onChange={handleChange}
                                placeholder="Ej. CDMX"
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Código Postal</label>
                            <input 
                                type="text" name="zipCode" value={formData.zipCode} onChange={handleChange}
                                placeholder="Ej. 06600"
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="font-bold text-gray-700 flex items-center gap-2 mb-4">
                    <Phone size={18}/> Contacto
                </h3>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono Móvil</label>
                    <input 
                        type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange}
                        placeholder="Ej. 55 1234 5678"
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2">
                {loading ? <Loader2 className="animate-spin"/> : <><Save size={20}/> Guardar Cambios</>}
            </button>

        </form>
      </div>
    </div>
  );
};

export default UserProfile;