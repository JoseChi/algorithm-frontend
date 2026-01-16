import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; // <--- 1. Importamos useParams y Link
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import HeroCarousel from '../components/HeroCarousel'; 
import { Loader2, ArrowLeft } from 'lucide-react';

const Home = () => {
  const { category } = useParams(); // <--- 2. Capturamos la categoría de la URL
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true); // Reiniciar el loader al cambiar de categoría
      try {
        const response = await api.get('/products?page=0&size=100');
        
        let allProducts = [];
        if (response.data.content) {
          allProducts = response.data.content;
        } else if (Array.isArray(response.data)) {
          allProducts = response.data;
        }

        // Limpieza de duplicados
        const uniqueProducts = allProducts.filter((product, index, self) =>
          index === self.findIndex((p) => p.name.trim() === product.name.trim())
        );

        // --- 3. LÓGICA DE FILTRADO POR CATEGORÍA ---
        let finalProducts = uniqueProducts;

        if (category) {
            // Mapa de traducción: URL (lo que viene del Navbar) -> BD (lo que espera Java)
            const categoryMap = {
                'hombres': 'HOMBRE',
                'mujeres': 'MUJER',
                'nuevos': 'NUEVO', // Asegúrate de tener esta categoría en BD o usa lógica especial
                'ofertas': 'OFERTA'
            };

            const dbCategory = categoryMap[category.toLowerCase()];

            if (dbCategory) {
                // Filtramos solo los que coinciden con la categoría traducida
                finalProducts = uniqueProducts.filter(p => p.category === dbCategory);
            } else {
                // Si la categoría no está en el mapa, quizás quieras mostrar vacío o todo
                // Por ahora, dejémoslo vacío si no coincide
                finalProducts = [];
            }
        }

        setProducts(finalProducts);

      } catch (err) {
        console.error("Error cargando productos:", err);
        setError("No se pudieron cargar los productos.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]); // <--- 4. IMPORTANTE: Ejecutar esto cada vez que 'category' cambie

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 size={50} className="animate-spin text-blue-600" /></div>;
  if (error) return <div className="text-center mt-20 text-red-500 font-bold">❌ {error}</div>;

  // Título Dinámico
  const pageTitle = category 
    ? `Colección ${category.charAt(0).toUpperCase() + category.slice(1)}`
    : "Catálogo Algorithm";

  return (
    <div>
      {/* Ocultamos el carrusel si estamos dentro de una categoría específica para limpiar la vista */}
      {!category && <HeroCarousel />} 
      
      <div className="max-w-7xl mx-auto px-4 py-10">
        
        {/* Encabezado con navegación */}
        <div className="mb-8 border-l-4 border-blue-600 pl-4">
            {category && (
                <Link to="/" className="text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1 mb-1 transition-colors">
                    <ArrowLeft size={14}/> Volver al inicio
                </Link>
            )}
            <h1 className="text-3xl font-bold text-gray-800 font-mono capitalize">
             {category ? pageTitle : <><span className="text-gray-800">Catálogo</span> <span className="text-blue-600">Algorithm</span></>}
            </h1>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-xl">
            <p className="text-xl text-gray-500 mb-4">No encontramos productos en esta categoría todavía.</p>
            <Link to="/" className="text-blue-600 font-bold hover:underline">Ver todos los productos</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;