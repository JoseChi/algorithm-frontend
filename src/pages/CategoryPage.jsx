import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { Loader2, ArrowLeft } from 'lucide-react';

const CategoryPage = () => {
  const { categoryName } = useParams(); // Captura "hombre", "mujer", etc.
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // 1. Traemos todo el catálogo
        const response = await api.get('/products?page=0&size=100');
        
        let allProducts = [];
        if (response.data.content) {
          allProducts = response.data.content;
        } else if (Array.isArray(response.data)) {
          allProducts = response.data;
        }

        // 2. FILTRADO POR CATEGORÍA
        // Comparamos lo que viene en la URL con lo que hay en la BD (ignorando mayúsculas)
        const categoryFiltered = allProducts.filter(p => 
            p.category && p.category.toLowerCase() === categoryName.toLowerCase()
        );

        // 3. ELIMINAR DUPLICADOS (Estilo Gymshark)
        // Para que no salga la misma playera 5 veces por las tallas
        const uniqueProducts = categoryFiltered.filter((product, index, self) =>
          index === self.findIndex((p) => p.name.trim() === product.name.trim())
        );

        setProducts(uniqueProducts);

      } catch (err) {
        console.error("Error cargando categoría:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName]);

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Loader2 size={50} className="animate-spin text-blue-600" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 min-h-screen">
      {/* Encabezado */}
      <div className="mb-8 border-l-4 border-blue-600 pl-4">
        <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Colección</p>
        <h1 className="text-4xl font-bold text-gray-900 capitalize font-mono">
          {categoryName}
        </h1>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-100">
          <p className="text-gray-500 text-lg mb-4">No encontramos productos en esta categoría.</p>
          <Link to="/" className="text-blue-600 font-bold hover:underline flex items-center justify-center gap-2">
            <ArrowLeft size={16}/> Volver al inicio
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;