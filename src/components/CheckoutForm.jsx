import { useState } from 'react';
import { useStripe, useElements, PaymentElement, ExpressCheckoutElement } from '@stripe/react-stripe-js';
import { toast } from 'react-toastify';
import { Loader2, CreditCard, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'; 
import { clearCart } from '../redux/cartSlice';
import api from '../services/api'; 

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // --- LÓGICA COMÚN PARA GUARDAR LA ORDEN (Se usa en ambos botones) ---
  const handleOrderSuccess = async (paymentIntentId) => {
      try {
          const response = await api.post(`/orders/checkout/${user.id}`);
          toast.success(`¡Pago recibido! Orden #${response.data.id} creada 🚀`);
          dispatch(clearCart());
          navigate(`/order/${response.data.id}`); 
      } catch (backendError) {
          console.error("Error guardando orden:", backendError);
          toast.error("El pago pasó en Stripe, pero hubo error guardando la orden.");
      }
  };

  // 1. MANEJADOR PARA EL BOTÓN "LINK" / EXPRESS (El que te fallaba)
  const onExpressClick = async (event) => {
    if (!stripe || !elements) return;

    setLoading(true);

    const { error: submitError } = await elements.submit();
    if (submitError) {
        toast.error(submitError.message);
        setLoading(false);
        return;
    }

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      clientSecret: event.clientSecret, // Stripe lo inyecta automáticamente aquí
      confirmParams: {
        return_url: window.location.origin + "/orders",
      },
      redirect: "if_required",
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      await handleOrderSuccess(paymentIntent.id);
    } else {
      setLoading(false);
    }
  };

  // 2. MANEJADOR PARA EL FORMULARIO DE TARJETA NORMAL (El de abajo)
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/orders", 
      },
      redirect: "if_required", 
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      await handleOrderSuccess(paymentIntent.id);
    } else {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* --- SECCIÓN 1: EXPRESS CHECKOUT --- */}
      <div className="mb-4">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 text-center">
            Pago Rápido
        </h3>
        {/* AQUÍ ESTABA EL ERROR: Faltaba el onConfirm */}
        <ExpressCheckoutElement 
            onConfirm={onExpressClick} 
            options={{buttonType: {applePay: 'buy', googlePay: 'buy'}}} 
        />
      </div>

      {/* --- SEPARADOR "O" --- */}
      <div className="relative flex py-2 items-center">
        <div className="flex-grow border-t border-gray-200"></div>
        <span className="flex-shrink-0 mx-4 text-gray-400 text-xs uppercase font-bold">O paga con tarjeta</span>
        <div className="flex-grow border-t border-gray-200"></div>
      </div>

      {/* --- SECCIÓN 2: FORMULARIO NORMAL --- */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
          <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
             <CreditCard size={18}/> Datos de Tarjeta
          </h3>
          {/* Ocultamos wallets abajo para no repetir */}
          <PaymentElement options={{wallets: {default: 'never'}}} />
        </div>

        <button 
          disabled={!stripe || loading} 
          className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" /> : "Pagar Ahora Seguramente"}
        </button>
      </form>

      <div className="text-center mt-4">
          <p className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
            <Lock size={10}/> Pagos procesados seguramente por Stripe
          </p>
      </div>
    </div>
  );
};

export default CheckoutForm;