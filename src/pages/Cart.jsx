import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowLeft, CreditCard, Loader2, Lock } from 'lucide-react';
import { toast } from 'react-toastify';
import { removeFromCart, clearCart } from '../redux/cartSlice';
import { loginSuccess } from '../redux/authSlice';
import api from '../services/api';

// --- IMPORTS DE STRIPE ---
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../components/CheckoutForm'; // El componente que creamos antes

// ⚠️ PEGA AQUÍ TU CLAVE PÚBLICA (pk_test_...)
const stripePromise = loadStripe("pk_test_51SpNTu3hZCxxFDKIday16q9wtRKWHqLC8CgF16Rr3wVL3ARMcsE9b6ejPWLN1xKotsLrb1qPX8SdwVYvXGJW3dDf00IMPgLDSG"); 

const Cart = () => {
  const cart = useSelector((state) => state.cart);
  const { items } = cart;
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState(""); // Aquí guardamos la llave de la transacción

  // Sincronizar perfil
  useEffect(() => {
    if (isAuthenticated && user?.id && (!user.address || !user.city)) {
        api.get(`/users/${user.id}`)
            .then(res => {
                if (res.data.address) {
                    dispatch(loginSuccess({
                        user: { ...user, ...res.data },
                        token: localStorage.getItem('token')
                    }));
                }
            })
            .catch(err => console.error("Error sincronizando perfil:", err));
    }
  }, [isAuthenticated, user, dispatch]);

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleRemove = (id) => {
    if (window.confirm("¿Eliminar producto?")) {
      dispatch(removeFromCart(id));
      toast.info("🗑️ Producto eliminado");
    }
  };

  // --- NUEVA LÓGICA DE CHECKOUT ---
  const handleInitiateCheckout = async () => {
    // 1. Validaciones
    if (!isAuthenticated) {
      toast.warn("🔒 Inicia sesión para comprar");
      navigate('/login');
      return;
    }

    if (!user?.address || !user?.city) {
        toast.warn("📍 Necesitamos tu dirección de envío");
        navigate('/profile');
        return;
    }

    setLoading(true);

    try {
        // 2. Calcular monto en CENTAVOS (Stripe lo requiere así)
        // Ejemplo: $500.00 MXN -> 50000 centavos
        const amountInCents = Math.round(total * 100);

        // 3. Pedir al Backend la intención de pago
        const response = await api.post('/payments/create-payment-intent', {
            amount: amountInCents
        });

        // 4. Guardar el secreto y mostrar el formulario
        setClientSecret(response.data.clientSecret);
        
    } catch (error) {
      console.error("Error iniciando pago:", error);
      toast.error("Error al conectar con el banco");
    } finally {
      setLoading(false);
    }
  };

  // Opciones visuales para el formulario de Stripe
  const appearance = {
    theme: 'stripe',
    labels: 'floating',
  };
  const options = {
    clientSecret,
    appearance,
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="bg-gray-100 p-6 rounded-full mb-4">
          <Trash2 size={48} className="text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Tu carrito está vacío</h2>
        <Link to="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg mt-4 font-bold hover:bg-blue-700 transition flex items-center gap-2">
          <ArrowLeft size={20} /> Volver a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 font-mono border-l-4 border-blue-600 pl-4">
        Tu Carrito de Compras
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LISTA DE ITEMS (Izquierda) --- */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 items-center">
              <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800">{item.name}</h3>
                <div className="mt-1 flex items-center gap-4">
                  <span className="font-mono text-blue-600 font-bold">${item.price.toFixed(2)}</span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">Cant: {item.quantity}</span>
                </div>
              </div>
              <button onClick={() => handleRemove(item.id)} className="p-2 text-gray-400 hover:text-red-500 transition">
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        {/* --- RESUMEN Y PAGO (Derecha) --- */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 sticky top-24">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Resumen del Pedido</h2>
            <div className="border-t border-gray-200 pt-4 flex justify-between items-center mb-6">
              <span className="text-lg font-bold text-gray-900">Total a Pagar</span>
              <span className="text-2xl font-bold text-blue-600 font-mono">${total.toFixed(2)}</span>
            </div>

            {/* AQUÍ OCURRE LA MAGIA: Intercambio de Botón por Formulario */}
            
            {clientSecret ? (
                // SI YA TENEMOS EL SECRETO -> MOSTRAR FORMULARIO DE TARJETA
                <Elements options={options} stripe={stripePromise}>
                    <CheckoutForm />
                </Elements>
            ) : (
                // SI NO -> MOSTRAR BOTÓN PARA INICIAR PAGO
                <button 
                  onClick={handleInitiateCheckout}
                  disabled={loading}
                  className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition shadow-lg active:scale-95 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <><Lock size={18} /> Pago Seguro con Tarjeta</>}
                </button>
            )}

            <div className="mt-4 text-center">
                <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
                    <Lock size={12}/> Transacción encriptada de extremo a extremo
                </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Cart;