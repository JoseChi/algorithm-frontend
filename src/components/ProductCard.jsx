import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
// 1. IMPORTAMOS LAS ACCIONES DE WISHLIST
import { addToWishlist, removeFromWishlist } from '../redux/wishlistSlice';
import { ShoppingCart, Heart, Loader2 } from 'lucide-react'; // Quitamos Eye, agregamos Heart
import { toast } from 'react-toastify';
import api from '../services/api';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  // 2. VERIFICAR SI ESTÁ EN WISHLIST
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const isLiked = wishlistItems.some((item) => item.id === product.id);

  const [adding, setAdding] = useState(false);

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock < 5;

  const handleAddToCart = async (e) => {
    e.preventDefault(); // Evitar que el clic se propague al enlace de la imagen si estuviera cerca
    if (isOutOfStock || adding) return; 

    setAdding(true);

    try {
        if (isAuthenticated && user?.id) {
            await api.post(`/cart/add?userId=${user.id}&productId=${product.id}&quantity=1`);
        }
        dispatch(addToCart({ ...product, quantity: 1 }));
        toast.success(`🛒 ${product.name} agregado`);
    } catch (error) {
        console.error("Error:", error);
        toast.error("Error al guardar");
    } finally {
        setAdding(false);
    }
  };

  // 3. FUNCIÓN PARA EL CORAZÓN
  const toggleWishlist = (e) => {
    e.preventDefault(); // Para que no abra el producto al dar clic al corazón
    if (isLiked) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden hover:shadow-lg transition duration-300 group border border-gray-100 flex flex-col h-full relative">
      
      {/* 4. ENLACE EN LA IMAGEN (Toda el área clickeable) */}
      <Link to={`/product/${encodeURIComponent(product.name)}`} className="relative block h-72 overflow-hidden bg-gray-100 cursor-pointer">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className={`w-full h-full object-cover transition duration-700 group-hover:scale-105 ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}
        />
        
        {/* Etiqueta Categoría */}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-900 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
          {product.category}
        </span>

        {/* 5. BOTÓN WISHLIST (Estilo Gymshark: Flotando arriba a la derecha) */}
        <button 
          onClick={toggleWishlist}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/60 hover:bg-white backdrop-blur-sm transition-all shadow-sm z-10"
        >
          <Heart 
            size={20} 
            className={`transition-colors duration-300 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-700 hover:text-black'}`} 
          />
        </button>

        {/* Etiquetas de Stock */}
        <div className="absolute bottom-3 left-3 flex flex-col gap-1">
            {isOutOfStock && (
                <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                AGOTADO
                </span>
            )}
            {isLowStock && !isOutOfStock && (
                <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                POCAS UNIDADES
                </span>
            )}
        </div>
      </Link>

      {/* Información */}
      <div className="p-4 flex flex-col flex-1">
        {/* Título también es enlace */}
        <Link to={`/product/${encodeURIComponent(product.name)}`}>
            <h3 className="text-base font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition truncate" title={product.name}>
            {product.name}
            </h3>
        </Link>
        
        <p className="text-sm text-gray-500 mb-4 line-clamp-1">
          {product.description || "Colección Algorithm 2026"}
        </p>
        
        <div className="mt-auto flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900 font-mono">
            ${product.price.toFixed(2)}
          </span>
          
          {/* Botón de Agregar al Carrito (Reducido y limpio) */}
          <button 
            onClick={handleAddToCart}
            disabled={isOutOfStock || adding}
            className={`w-10 h-10 rounded-full transition shadow-sm flex items-center justify-center
              ${isOutOfStock 
                ? 'bg-gray-100 text-gray-300 cursor-not-allowed' 
                : 'bg-black text-white hover:bg-gray-800 active:scale-95'
              }`}
            title="Agregar al Carrito"
          >
            {adding ? <Loader2 size={18} className="animate-spin"/> : <ShoppingCart size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;