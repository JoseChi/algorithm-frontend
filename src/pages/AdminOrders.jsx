import { useEffect, useState } from 'react';
import api from '../services/api'; 
import { Package, Truck, CheckCircle, Clock, XCircle, ArrowLeft, MapPin, Box, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para el Modal (Ventana emergente)
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  // 1. Cargar todas las ventas
  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/admin/all');
      setOrders(response.data);
    } catch (error) {
      console.error("Error al cargar ordenes:", error);
      toast.error("No se pudieron cargar las ventas.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Función para actualizar el estado (Llama al Backend)
  const updateStatus = async (orderId, newStatus) => {
      try {
          await api.put(`/orders/${orderId}/status?status=${newStatus}`);
          toast.success(`Orden actualizada a: ${newStatus}`);
          
          // Refrescamos la lista y cerramos el modal
          fetchOrders();
          setIsModalOpen(false);
      } catch (error) {
          console.error("Error actualizando estado:", error);
          toast.error("Error al actualizar el estado");
      }
  };

  // Abrir el modal con los detalles de una orden
  const openModal = (order) => {
      setSelectedOrder(order);
      setIsModalOpen(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PAGADO': return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Clock size={14}/> PAGADO</span>;
      case 'ENVIADO': return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Truck size={14}/> ENVIADO</span>;
      case 'ENTREGADO': return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><CheckCircle size={14}/> ENTREGADO</span>;
      case 'CANCELADO': return <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><XCircle size={14}/> CANCELADO</span>;
      default: return <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-bold w-fit">{status}</span>;
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl font-bold text-gray-400 animate-pulse">Cargando ventas...</div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen relative">
      
      {/* Encabezado */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/admin" className="p-2 bg-white rounded-full hover:bg-gray-100 transition shadow-sm text-gray-600">
            <ArrowLeft size={20}/>
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <Package className="text-blue-600" /> Gestión de Ventas
        </h1>
      </div>

      {/* Tabla de Ventas */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs border-b">
                <tr>
                <th className="p-4 font-bold">ID</th>
                <th className="p-4 font-bold">Cliente</th>
                <th className="p-4 font-bold">Fecha</th>
                <th className="p-4 font-bold">Total</th>
                <th className="p-4 font-bold">Estado</th>
                <th className="p-4 font-bold text-center">Acciones</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                <tr key={order.id} className="hover:bg-blue-50/30 transition duration-150">
                    <td className="p-4 font-mono text-xs font-bold text-gray-500">#{order.id}</td>
                    <td className="p-4">
                        <div className="font-bold text-gray-900">{order.user?.username || 'Usuario'}</div>
                        <div className="text-xs text-gray-500">{order.user?.email}</div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                        {new Date(order.orderDate).toLocaleDateString()}
                        <div className="text-xs text-gray-400">{new Date(order.orderDate).toLocaleTimeString()}</div>
                    </td>
                    <td className="p-4 font-bold text-gray-900">
                        ${order.totalAmount?.toFixed(2)}
                    </td>
                    <td className="p-4">
                        {getStatusBadge(order.status)}
                    </td>
                    <td className="p-4 text-center">
                        <button 
                            onClick={() => openModal(order)}
                            className="text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-xs font-bold border border-blue-200 transition flex items-center gap-1 mx-auto"
                        >
                            Gestionar
                        </button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>

        {orders.length === 0 && (
            <div className="p-12 text-center text-gray-400 flex flex-col items-center">
                <Package size={48} className="mb-4 text-gray-300"/>
                <p>Aún no hay ventas registradas.</p>
            </div>
        )}
      </div>

      {/* --- MODAL DE DETALLES (Pop-up) --- */}
      {isModalOpen && selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                  
                  {/* Header del Modal */}
                  <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
                      <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                          <Box size={20} className="text-blue-600"/> 
                          Orden #{selectedOrder.id}
                      </h2>
                      <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 transition">
                          <X size={24} />
                      </button>
                  </div>

                  {/* Cuerpo del Modal (Con Scroll si es muy largo) */}
                  <div className="p-6 overflow-y-auto">
                      
                      {/* Estado Actual */}
                      <div className="mb-6 flex justify-between items-center bg-blue-50 p-4 rounded-xl border border-blue-100">
                          <span className="text-sm font-bold text-blue-800 uppercase tracking-wide">Estado Actual:</span>
                          {getStatusBadge(selectedOrder.status)}
                      </div>

                      {/* Dirección de Envío */}
                      <div className="mb-6">
                          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                              <MapPin size={16}/> Datos de Envío
                          </h3>
                          <div className="bg-gray-50 p-4 rounded-xl border text-sm text-gray-700 space-y-1">
                              <p className="font-bold text-gray-900 text-base">{selectedOrder.user?.firstName} {selectedOrder.user?.lastName}</p>
                              <p>{selectedOrder.user?.address}</p>
                              <p>{selectedOrder.user?.city}, {selectedOrder.user?.zipCode}</p>
                              <p className="text-gray-500 pt-2 flex items-center gap-2">
                                  📞 {selectedOrder.user?.phoneNumber || 'Sin teléfono'}
                              </p>
                              <p className="text-gray-500 flex items-center gap-2">
                                  📧 {selectedOrder.user?.email}
                              </p>
                          </div>
                      </div>

                      {/* Lista de Productos */}
                      <div>
                          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                              <Package size={16}/> Productos
                          </h3>
                          <div className="border rounded-xl overflow-hidden">
                              <table className="w-full text-sm text-left">
                                  <thead className="bg-gray-100 text-gray-600 font-bold">
                                      <tr>
                                          <th className="p-3">Producto</th>
                                          <th className="p-3 text-center">Cant.</th>
                                          <th className="p-3 text-right">Precio</th>
                                      </tr>
                                  </thead>
                                  <tbody className="divide-y">
                                      {selectedOrder.items?.map((item) => (
                                          <tr key={item.id}>
                                              <td className="p-3">{item.product?.name}</td>
                                              <td className="p-3 text-center font-bold">{item.quantity}</td>
                                              <td className="p-3 text-right">${item.price}</td>
                                          </tr>
                                      ))}
                                  </tbody>
                              </table>
                          </div>
                      </div>

                  </div>

                  {/* Footer con Botones de Acción */}
                  <div className="p-4 border-t bg-gray-50 flex justify-end gap-3 flex-wrap">
                      {selectedOrder.status === 'PAGADO' && (
                          <button 
                              onClick={() => updateStatus(selectedOrder.id, 'ENVIADO')}
                              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition flex items-center gap-2 shadow-lg shadow-blue-200"
                          >
                              <Truck size={18}/> Marcar ENVIADO
                          </button>
                      )}
                      
                      {selectedOrder.status === 'ENVIADO' && (
                          <button 
                              onClick={() => updateStatus(selectedOrder.id, 'ENTREGADO')}
                              className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 transition flex items-center gap-2 shadow-lg shadow-green-200"
                          >
                              <CheckCircle size={18}/> Marcar ENTREGADO
                          </button>
                      )}

                      <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-500 hover:bg-gray-200 rounded-lg font-medium transition">
                          Cerrar
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default AdminOrders;