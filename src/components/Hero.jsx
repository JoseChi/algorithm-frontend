import { Link } from 'react-router-dom';
import { ArrowRight, Code } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative bg-gray-900 text-white overflow-hidden">
      
      {/* 1. Fondo con Imagen y Superposición */}
      <div className="absolute inset-0">
        {/* Usamos una imagen de Unsplash de programación como fondo */}
        <img 
          src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop" 
          alt="Coding Background" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent"></div>
      </div>

      {/* 2. Contenido Principal */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 flex flex-col justify-center min-h-[500px]">
        
        <div className="inline-flex items-center gap-2 text-blue-400 font-bold tracking-wider uppercase text-sm mb-4 animate-fade-in">
          <Code size={20} /> Nueva Colección 2026
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
          Viste el <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Código</span>. <br/>
          Vive el Estilo.
        </h1>
        
        <p className="text-xl text-gray-300 max-w-2xl mb-10 leading-relaxed">
          Ropa diseñada por desarrolladores, para desarrolladores. 
          Comodidad para tus largas sesiones de debugging y estilo para tus deploys a producción.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            to="/category/hombre" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold text-lg transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
          >
            Ver Colección Hombre <ArrowRight size={20}/>
          </Link>
          <Link 
            to="/category/mujer" 
            className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-full font-bold text-lg transition flex items-center justify-center border border-gray-700"
          >
            Ver Colección Mujer
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Hero;