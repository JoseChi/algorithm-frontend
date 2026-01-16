import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Heart, Package, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// IMPORTAR TU LOGO (Ajusta la extensión si es .svg o .png)
import logoAlgorithm from '../assets/algorithm4N-svg.png'; 

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 border-t border-gray-800 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Grid de 4 Columnas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Columna 1: Marca y Logo */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
               {/* TRUCO CSS: 'invert' vuelve blanco el logo negro para el fondo oscuro */}
               <img 
                 src={logoAlgorithm} 
                 alt="Algorithm Store" 
                 className="h-8 w-auto invert opacity-90 group-hover:opacity-100 transition" 
               />
               <span className="text-xl font-bold text-white font-mono tracking-tighter">
                  Algorithm<span className="text-blue-500">Store</span>
               </span>
            </Link>
            
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Tu destino premium para ropa de estilo programador. 
              Diseños que compilan con tu estilo de vida.
            </p>
            
            <div className="flex gap-4 pt-2">
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-blue-600 hover:text-white transition duration-300"><Facebook size={18}/></a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-pink-600 hover:text-white transition duration-300"><Instagram size={18}/></a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-blue-400 hover:text-white transition duration-300"><Twitter size={18}/></a>
            </div>
          </div>

          {/* Columna 2: Explorar (RUTAS CORREGIDAS) */}
          <div>
            <h3 className="text-white font-bold mb-6 text-lg relative inline-block">
                Explorar
                <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-blue-500 rounded-full"></span>
            </h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="hover:text-blue-400 transition flex items-center gap-2"><ArrowRight size={12}/> Inicio</Link></li>
              {/* Ojo: Usamos plural para coincidir con el Navbar */}
              <li><Link to="/category/hombres" className="hover:text-blue-400 transition flex items-center gap-2"><ArrowRight size={12}/> Hombres</Link></li>
              <li><Link to="/category/mujeres" className="hover:text-blue-400 transition flex items-center gap-2"><ArrowRight size={12}/> Mujeres</Link></li>
              <li><Link to="/category/nuevos" className="hover:text-blue-400 transition flex items-center gap-2"><ArrowRight size={12}/> Nuevos Lanzamientos</Link></li>
            </ul>
          </div>

          {/* Columna 3: Ayuda (RUTAS CORREGIDAS) */}
          <div>
            <h3 className="text-white font-bold mb-6 text-lg relative inline-block">
                Ayuda
                <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-blue-500 rounded-full"></span>
            </h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/profile" className="hover:text-blue-400 transition">Mi Cuenta</Link></li>
              {/* Corregido a /orders */}
              <li>
                <Link to="/orders" className="hover:text-blue-400 transition flex items-center gap-2">
                    <Package size={16} /> Rastrear Pedido
                </Link>
              </li>
              <li><span className="cursor-pointer hover:text-blue-400 transition">Envíos y Devoluciones</span></li>
              <li><span className="cursor-pointer hover:text-blue-400 transition">Preguntas Frecuentes</span></li>
            </ul>
          </div>

          {/* Columna 4: Contacto */}
          <div>
            <h3 className="text-white font-bold mb-6 text-lg relative inline-block">
                Contacto
                <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-blue-500 rounded-full"></span>
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-blue-500 mt-1 flex-shrink-0"/>
                <span className="text-gray-400">Av. Tecnológica 500,<br/>Ciudad de México, CP 92000</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="text-blue-500 flex-shrink-0"/>
                <span className="text-gray-400">+52 55 1234 5678</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="text-blue-500 flex-shrink-0"/>
                <span className="text-gray-400">soporte@algorithmstore.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Barra Inferior */}
        <div className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>© 2026 AlgorithmStore. Todos los derechos reservados.</p>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <span className="hover:text-white cursor-pointer">Privacidad</span>
            <span className="hover:text-white cursor-pointer">Términos</span>
            <p className="flex items-center gap-1 text-gray-400">
              Hecho con <Heart size={12} className="text-red-500 fill-red-500 animate-pulse"/> por Anthony
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;