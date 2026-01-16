import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom'; // Para leer la URL
import { Loader2, Search, ArrowLeft } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query'); // Obtenemos la palabra buscada (ej: "hoodie")
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) return;
      
      setLoading(true);
      try {
        // Llamamos a tu endpoint del Backend
        const response = await api.get(`/products/search?name=${query}&page=0&size=100`);
        const data = response.data.content || response.data;
        setProducts(data);
      } catch (error) {
        console.error("Error buscando:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]); // Se ejecuta cada vez que cambia la búsqueda

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 min-h-[60vh]">
      {/* Título de Resultados */}
      <div className="mb-8 border-b border-gray-100 pb-4">
        <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Resultados de búsqueda</p>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Search className="text-blue-600" /> "{query}"
        </h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={40} className="animate-spin text-blue-600" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl">
          <p className="text-gray-500 text-lg mb-4">No encontramos productos que coincidan con tu búsqueda.</p>
          <Link to="/" className="text-blue-600 font-bold hover:underline flex items-center justify-center gap-2">
            <ArrowLeft size={16}/> Ver todo el catálogo
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

export default SearchPage;