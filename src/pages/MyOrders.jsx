import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ShoppingBag, Calendar, Package, ChevronRight } from 'lucide-react'; // Importé ChevronRight
import api from '../services/api';
import { Link } from 'react-router-dom';

const MyOrders = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      api.get(`/orders/user/${user.id}`)
        .then(res => setOrders(res.data))
        .catch(err => console.error("Error al cargar pedidos:", err))
        .finally(() => setLoading(false));
    } else {
        setLoading(false);
    }
  }, [user, isAuthenticated]);

  if (!isAuthenticated) return <div className="p-10 text-center">Inicia sesión para ver tus pedidos.</div>;
  if (loading) return <div className="p-10 text-center">Cargando historial...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 min-h-[60vh]">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2 text-gray-800">
        <ShoppingBag className="text-blue-600" /> Mis Pedidos
      </h1>
      
      <div className="space-y-4">
        {orders.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
                <p className="text-gray-500">Aún no has realizado compras.</p>
                <Link to="/" className="text-blue-600 font-bold mt-2 inline-block">Ir a comprar</Link>
            </div>
        ) : (
            orders.map(order => (
            <div key={order.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Package size={18} className="text-gray-400"/>
                        <span className="font-mono font-bold text-gray-700">Orden #{order.id}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar size={14} />
                        {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'Fecha desconocida'}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                        order.status === 'PAGADO' || order.status === 'COMPLETED' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                    {order.status}
                    </div>
                    
                    <p className="text-xl font-bold text-blue-600 font-mono">
                        ${order.totalAmount?.toFixed(2)}
                    </p>

                    {/* --- BOTÓN NUEVO --- */}
                    <Link 
                      to={`/order/${order.id}`} 
                      className="ml-4 bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-blue-600 p-2 rounded-full transition"
                      title="Ver Detalles"
                    >
                       <ChevronRight size={20} />
                    </Link>

                </div>
                </div>
            </div>
            ))
        )}
      </div>
    </div>
  );
};

export default MyOrders;