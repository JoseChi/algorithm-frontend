import { useEffect, useState } from 'react';
import api from '../services/api'; // Usamos tu api.js configurado
import { Package, Truck, CheckCircle, Clock, XCircle, Search } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // Llamamos al endpoint nuevo que acabamos de crear en Java
      const response = await api.get('/orders/admin/all');
      setOrders(response.data);
    } catch (error) {
      console.error("Error al cargar ordenes:", error);
      toast.error("No se pudieron cargar las ventas.");
    } finally {
      setLoading(false);
    }
  };

  // Función para poner colores bonitos según el estado
  const getStatusBadge = (status) => {
    switch (status) {
      case 'PAGADO': return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Clock size={14}/> PAGADO</span>;
      case 'ENVIADO': return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Truck size={14}/> ENVIADO</span>;
      case 'ENTREGADO': return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle size={14}/> ENTREGADO</span>;
      case 'CANCELADO': return <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><XCircle size={14}/> CANCELADO</span>;
      default: return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  // Función (FUTURA) para cambiar estado
  const handleUpdateStatus = (orderId) => {
      toast.info("Próximamente: Cambiar estado a ENVIADO");
      // Aquí conectaremos la lógica para actualizar el estado más adelante
  };

  if (loading) return <div className="p-10 text-center">Cargando ventas...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <Package className="text-blue-600" /> Gestión de Ventas
      </h1>

      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="p-4">ID Orden</th>
              <th className="p-4">Cliente / Email</th>
              <th className="p-4">Fecha</th>
              <th className="p-4">Total</th>
              <th className="p-4">Estado</th>
              <th className="p-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition">
                <td className="p-4 font-mono font-bold text-gray-500">#{order.id}</td>
                <td className="p-4">
                    <p className="font-bold text-gray-900">{order.user?.username || 'Usuario'}</p>
                    <p className="text-xs text-gray-500">{order.user?.email}</p>
                </td>
                <td className="p-4 text-sm text-gray-500">
                    {new Date(order.orderDate).toLocaleDateString()} <br/>
                    <span className="text-xs">{new Date(order.orderDate).toLocaleTimeString()}</span>
                </td>
                <td className="p-4 font-bold text-green-600">
                    ${order.totalAmount?.toFixed(2)}
                </td>
                <td className="p-4">
                    {getStatusBadge(order.status)}
                </td>
                <td className="p-4 text-center">
                    <button 
                        onClick={() => handleUpdateStatus(order.id)}
                        className="text-blue-600 hover:bg-blue-50 px-3 py-1 rounded text-sm font-bold border border-blue-200 transition"
                    >
                        Gestionar
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
            <div className="p-10 text-center text-gray-500">
                Aún no hay ventas registradas. 📉
            </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;