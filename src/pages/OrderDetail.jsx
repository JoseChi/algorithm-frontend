import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, CreditCard, Package } from 'lucide-react';
import api from '../services/api';
import { getProductGallery } from '../utils/imageLoader';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then(res => setOrder(res.data))
      .catch(err => console.error("Error cargando orden:", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-10 text-center">Cargando detalles...</div>;
  if (!order) return <div className="p-10 text-center">Orden no encontrada.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      
      {/* Encabezado y Botón Volver */}
      <Link to="/my-orders" className="flex items-center text-gray-500 hover:text-blue-600 mb-6 transition">
        <ArrowLeft size={18} className="mr-2" /> Volver a Mis Pedidos
      </Link>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        
        {/* Cabecera del Recibo */}
        <div className="bg-gray-50 p-6 border-b border-gray-200 flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 font-mono">Orden #{order.id}</h1>
            <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
              <Calendar size={14}/> {new Date(order.orderDate).toLocaleDateString()} 
              <span className="text-gray-300">|</span> 
              <span className="font-medium text-blue-600">{order.status}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Total Pagado</p>
            <p className="text-3xl font-bold text-gray-900 font-mono">${order.totalAmount?.toFixed(2)}</p>
          </div>
        </div>

        {/* Lista de Productos */}
        <div className="p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Package size={20} className="text-blue-600"/> Artículos Comprados
          </h2>
          
          <div className="space-y-6">
            {order.items.map((item) => {
              const product = item.product;
              const localImages = getProductGallery(product.name, product.color);
              const imageSrc = localImages.length > 0 ? localImages[0] : product.imageUrl;

              return (
                <div key={item.id} className="flex gap-4 border-b border-gray-100 pb-6 last:pb-0 last:border-0">
                  <div className="w-20 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                    <img src={imageSrc} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800">{product.name}</h3>
                    <div className="text-sm text-gray-600 mt-1 space-y-1">
                      <p>Color: <span className="font-medium text-black capitalize">{product.color}</span></p>
                      <p>Talla: <span className="font-medium text-black">{product.size}</span></p>
                      <p>Cantidad: <span className="font-medium text-black">{item.quantity}</span></p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-bold text-gray-900">${product.price.toFixed(2)}</p>
                    <p className="text-xs text-gray-400">c/u</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pie de Recibo (Info Extra) */}
        <div className="bg-gray-50 p-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <p className="font-bold text-gray-700 mb-2 flex items-center gap-2">
              <CreditCard size={16}/> Método de Pago
            </p>
            <p className="text-gray-600">Tarjeta terminada en **** 4242</p>
          </div>
          
          {/* --- CAMBIO: DIRECCIÓN DINÁMICA --- */}
          <div>
            <p className="font-bold text-gray-700 mb-2 flex items-center gap-2">
              <MapPin size={16}/> Dirección de Envío
            </p>
            {/* Si el usuario de la orden tiene dirección, la mostramos */}
            {order.user && order.user.address ? (
                <>
                    <p className="text-gray-900 font-medium">{order.user.address}</p>
                    <p className="text-gray-600">{order.user.city}, CP {order.user.zipCode}</p>
                    <p className="text-gray-500 mt-1">Tel: {order.user.phoneNumber}</p>
                </>
            ) : (
                <p className="text-red-500 italic">Dirección no registrada o usuario eliminado.</p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default OrderDetail;