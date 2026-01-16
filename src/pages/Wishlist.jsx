import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingCart, HeartOff, ArrowRight } from 'lucide-react';
import { removeFromWishlist } from '../redux/wishlistSlice';
import { addToCart } from '../redux/cartSlice';
import { toast } from 'react-toastify';

const Wishlist = () => {
  const { items } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();

  const handleMoveToCart = (product) => {
    dispatch(addToCart({ ...product, quantity: 1 }));
    dispatch(removeFromWishlist(product.id));
    toast.success("🛒 Movido al carrito correctamente");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="bg-red-50 p-6 rounded-full mb-6">
          <HeartOff size={64} className="text-red-300" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Tu lista de deseos está vacía</h2>
        <p className="text-gray-500 mb-8 max-w-md">
          Guarda los items que más te gusten aquí para no perderlos de vista.
        </p>
        <Link to="/" className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition flex items-center gap-2 group">
          Explorar Colección <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-end justify-between mb-8 border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-mono">Mi Wishlist</h1>
          <p className="text-gray-500 mt-1">{items.length} artículos guardados</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {items.map((product) => (
          <div key={product.id} className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
            {/* Imagen */}
            <div className="aspect-[4/5] bg-gray-100 overflow-hidden relative">
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* Botón Eliminar */}
              <button 
                onClick={() => dispatch(removeFromWishlist(product.id))}
                className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 hover:bg-white transition shadow-sm z-10"
                title="Eliminar"
              >
                <Trash2 size={18} />
              </button>
            </div>

            {/* Info */}
            <div className="p-4">
              <p className="text-xs text-gray-500 mb-1">{product.category}</p>
              <h3 className="font-bold text-gray-900 truncate mb-2">{product.name}</h3>
              <div className="flex items-center justify-between">
                <span className="font-mono text-lg font-bold text-blue-600">${product.price}</span>
                
                <button 
                  onClick={() => handleMoveToCart(product)}
                  className="flex items-center gap-2 bg-black text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-gray-800 transition active:scale-95"
                >
                  <ShoppingCart size={14} /> Mover
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;