import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingCart, Check, Loader2 } from 'lucide-react';
import { addToCart } from '../redux/cartSlice';
import api from '../services/api';
import { getProductGallery } from '../utils/imageLoader';
import { toast } from 'react-toastify';

const ProductDetails = () => {
  const { name } = useParams();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [allVariants, setAllVariants] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  
  // Estados de selección
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [galleryImages, setGalleryImages] = useState([]);

  // Cargar productos
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await api.get('/products?page=0&size=100');
        const products = response.data.content || response.data;

        const variants = products.filter(
          (p) => p.name.trim().toLowerCase() === name.trim().toLowerCase()
        );

        if (variants.length > 0) {
          setAllVariants(variants);
          setSelectedColor(variants[0].color || 'Negro'); 
        }
      } catch (error) {
        console.error("Error cargando detalles:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [name]);

  // Actualizar Galería
  useEffect(() => {
    if (selectedColor && allVariants.length > 0) {
      const imagesFound = getProductGallery(name, selectedColor);
      
      if (imagesFound.length > 0) {
        setGalleryImages(imagesFound);
      } else {
        const variant = allVariants.find(v => v.color === selectedColor);
        setGalleryImages([variant?.imageUrl || '']);
      }
      setCurrentImageIndex(0);
      setSelectedSize(null); 
    }
  }, [selectedColor, name, allVariants]);

  const availableSizes = allVariants
    .filter((v) => v.color === selectedColor)
    .map((v) => ({ size: v.size, stock: v.stock, id: v.id }));

  const availableColors = [...new Set(allVariants.map(v => v.color))];

  const colorMap = {
    'Negro': 'bg-gray-900',
    'Black': 'bg-gray-900',
    'Azul': 'bg-blue-600',
    'Blue': 'bg-blue-600',
    'Rojo': 'bg-red-600',
    'Verde': 'bg-green-700',
    'Blanco': 'bg-white border-gray-300',
    'Rosado': 'bg-pink-400',
  };

  const handleAddToCart = async () => {
    if (!selectedSize) return toast.warn("Por favor selecciona una talla.");
    if (adding) return;
    
    // Encontrar el producto EXACTO (ID) basado en Color y Talla
    const productToBuy = allVariants.find(
      v => v.color === selectedColor && v.size === selectedSize
    );

    if (productToBuy) {
      setAdding(true);
      try {
          // 1. Backend Sync
          if (isAuthenticated && user?.id) {
              // ✅ CORRECCIÓN AQUÍ: Enviamos los datos en la URL
              await api.post(`/cart/add?userId=${user.id}&productId=${productToBuy.id}&quantity=1`);
          }

          // 2. Redux Update
          dispatch(addToCart({ ...productToBuy, quantity: 1 }));
          toast.success(`Agregado: ${productToBuy.name} (${selectedColor}, ${selectedSize})`);
          
      } catch (error) {
          console.error("Error backend:", error);
          toast.error("Error al guardar en el servidor");
      } finally {
          setAdding(false);
      }
    }
  };

  if (loading) return <div className="p-20 text-center">Cargando estilo...</div>;
  if (allVariants.length === 0) return <div className="p-20 text-center">Producto no encontrado.</div>;

  const productInfo = allVariants[0];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
      
      {/* --- COLUMNA IZQUIERDA: GALERÍA --- */}
      <div className="space-y-4">
        <div className="aspect-[4/5] bg-gray-100 rounded-xl overflow-hidden relative group">
          <img 
            src={galleryImages[currentImageIndex]} 
            alt={name} 
            className="w-full h-full object-cover"
          />
          {galleryImages.length > 1 && (
            <>
              <button onClick={() => setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1))} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition">←</button>
              <button onClick={() => setCurrentImageIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0))} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition">→</button>
            </>
          )}
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2">
          {galleryImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentImageIndex(idx)}
              className={`w-20 h-24 flex-shrink-0 rounded-lg overflow-hidden border-2 ${
                currentImageIndex === idx ? 'border-blue-600' : 'border-transparent'
              }`}
            >
              <img src={img} className="w-full h-full object-cover" alt="" />
            </button>
          ))}
        </div>
      </div>

      {/* --- COLUMNA DERECHA: INFORMACIÓN --- */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2 uppercase font-mono">{name}</h1>
        <p className="text-2xl font-medium text-gray-700 mb-6">${productInfo.price.toFixed(2)}</p>

        {/* SELECTOR DE COLOR */}
        <div className="mb-8">
          <p className="font-bold text-sm mb-3 text-gray-500">SELECCIONAR COLOR: <span className="text-black">{selectedColor}</span></p>
          <div className="flex gap-3">
            {availableColors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-10 h-10 rounded-full border-2 transition flex items-center justify-center ${
                  selectedColor === color ? 'border-blue-600 scale-110' : 'border-gray-200'
                } ${colorMap[color] || 'bg-gray-200'}`}
                title={color}
              >
                {selectedColor === color && <Check size={16} className={color === 'Blanco' ? 'text-black' : 'text-white'} />}
              </button>
            ))}
          </div>
        </div>

        {/* SELECTOR DE TALLA */}
        <div className="mb-8">
          <p className="font-bold text-sm mb-3 text-gray-500">SELECCIONAR TALLA</p>
          <div className="grid grid-cols-4 gap-3">
            {['XS', 'S', 'M', 'L', 'XL'].map((size) => {
              const variant = availableSizes.find(s => s.size === size);
              const isAvailable = variant && variant.stock > 0;

              return (
                <button
                  key={size}
                  onClick={() => isAvailable && setSelectedSize(size)}
                  disabled={!isAvailable}
                  className={`
                    py-3 rounded-lg font-bold border text-sm transition
                    ${selectedSize === size ? 'bg-black text-white border-black' : 'bg-white text-gray-900 border-gray-200'}
                    ${!isAvailable ? 'opacity-40 cursor-not-allowed bg-gray-50' : 'hover:border-black'}
                  `}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        {/* BOTÓN DE COMPRA */}
        <button
          onClick={handleAddToCart}
          disabled={adding}
          className="w-full bg-blue-600 text-white py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition shadow-lg flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {adding ? <Loader2 className="animate-spin" /> : <ShoppingCart />}
          {adding ? "AGREGANDO..." : "AÑADIR A LA CESTA"}
        </button>

        <div className="mt-8 border-t border-gray-100 pt-6 space-y-3 text-gray-600 text-sm">
          <p className="flex items-center gap-2"><Check size={16} className="text-green-500"/> Envío Estándar Gratis</p>
          <p className="flex items-center gap-2"><Check size={16} className="text-green-500"/> Devoluciones gratuitas (30 días)</p>
          <p className="mt-4 leading-relaxed">{productInfo.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;