import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, CreditCard, Package, Truck, CheckCircle, AlertCircle } from 'lucide-react';
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

  // --- LÓGICA DE LA BARRA DE PROGRESO ---
  const getStepIndex = (status) => {
      switch (status) {
          case 'PAGADO': return 1;
          case 'ENVIADO': return 2;
          case 'ENTREGADO': return 3;
          default: return 0;
      }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Cargando detalles...</div>;
  if (!order) return <div className="p-10 text-center">Orden no encontrada.</div>;

  const currentStep = getStepIndex(order.status);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 min-h-screen">
      
      {/* Encabezado y Botón Volver */}
      <Link to="/orders" className="flex items-center text-gray-500 hover:text-blue-600 mb-6 transition w-fit">
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
              <span className="font-medium text-gray-900">{new Date(order.orderDate).toLocaleTimeString()}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Total Pagado</p>
            <p className="text-3xl font-bold text-gray-900 font-mono">${order.totalAmount?.toFixed(2)}</p>
          </div>
        </div>

        {/* --- NUEVO: BARRA DE SEGUIMIENTO --- */}
        <div className="p-8 border-b border-gray-100">
            {order.status === 'CANCELADO' ? (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3 justify-center font-bold">
                    <AlertCircle size={24} /> ESTA ORDEN HA SIDO CANCELADA
                </div>
            ) : (
                <div className="relative">
                    {/* Línea de Fondo (Gris) */}
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
                    
                    {/* Línea de Progreso (Azul) */}
                    <div 
                        className="absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-1000"
                        style={{ width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%' }}
                    ></div>

                    {/* Pasos (Círculos) */}
                    <div className="relative z-10 flex justify-between">
                        
                        {/* PASO 1: PAGADO */}
                        <div className="flex flex-col items-center gap-2">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-colors ${currentStep >= 1 ? 'bg-blue-600 border-blue-100 text-white' : 'bg-gray-200 border-white text-gray-400'}`}>
                                <CreditCard size={18} />
                            </div>
                            <p className={`text-xs font-bold ${currentStep >= 1 ? 'text-blue-700' : 'text-gray-400'}`}>Pagado</p>
                        </div>

                        {/* PASO 2: ENVIADO */}
                        <div className="flex flex-col items-center gap-2">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-colors ${currentStep >= 2 ? 'bg-blue-600 border-blue-100 text-white' : 'bg-gray-200 border-white text-gray-400'}`}>
                                <Truck size={18} />
                            </div>
                            <p className={`text-xs font-bold ${currentStep >= 2 ? 'text-blue-700' : 'text-gray-400'}`}>Enviado</p>
                        </div>

                        {/* PASO 3: ENTREGADO */}
                        <div className="flex flex-col items-center gap-2">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-colors ${currentStep >= 3 ? 'bg-green-600 border-green-100 text-white' : 'bg-gray-200 border-white text-gray-400'}`}>
                                <CheckCircle size={18} />
                            </div>
                            <p className={`text-xs font-bold ${currentStep >= 3 ? 'text-green-700' : 'text-gray-400'}`}>Entregado</p>
                        </div>

                    </div>
                </div>
            )}
        </div>

        {/* Lista de Productos */}
        <div className="p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800">
            <Package size={20} className="text-blue-600"/> Contenido del Paquete
          </h2>
          
          <div className="space-y-6">
            {order.items.map((item) => {
              const product = item.product;
              const localImages = getProductGallery(product.name, product.color);
              const imageSrc = localImages.length > 0 ? localImages[0] : product.imageUrl;

              return (
                <div key={item.id} className="flex gap-4 border-b border-gray-100 pb-6 last:pb-0 last:border-0">
                  <div className="w-20 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 group relative">
                    <img src={imageSrc} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
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
          
          <div>
            <p className="font-bold text-gray-700 mb-2 flex items-center gap-2">
              <MapPin size={16}/> Dirección de Entrega
            </p>
            {order.user && order.user.address ? (
                <div className="bg-white p-3 rounded border border-gray-200">
                    <p className="text-gray-900 font-bold">{order.user.firstName} {order.user.lastName}</p>
                    <p className="text-gray-600">{order.user.address}</p>
                    <p className="text-gray-600">{order.user.city}, CP {order.user.zipCode}</p>
                    <p className="text-gray-500 mt-1 text-xs">📞 {order.user.phoneNumber}</p>
                </div>
            ) : (
                <p className="text-red-500 italic">Dirección no disponible.</p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default OrderDetail;