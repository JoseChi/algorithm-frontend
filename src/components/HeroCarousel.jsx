import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { ArrowRight } from 'lucide-react';

// Importamos la imagen local
import bannerImg from '../assets/algorithm-principal.png'; 

// Estilos de Swiper obligatorios
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const HeroCarousel = () => {
  const slides = [
    {
      id: 1,
      image: bannerImg, 
      title: "Nueva Colección 2026",
      subtitle: "Ropa diseñada para programadores. Estilo que compila.",
      buttonText: "Ver Novedades"
    },
    {
      id: 2,
      // Imagen de ejemplo (teclado/setup)
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1920&auto=format&fit=crop", 
      title: "Accesorios Algorithm",
      subtitle: "Complementa tu setup con nuestra línea exclusiva.",
      buttonText: "Explorar Accesorios"
    },
    {
      id: 3,
      // Imagen de ejemplo (coding/oscuro)
image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1920&auto=format&fit=crop",
      title: "Modo Oscuro Activado",
      subtitle: "Playeras negras con sintaxis perfecta.",
      buttonText: "Comprar Ahora"
    }
  ];

  return (
    // --- CAMBIO CLAVE AQUÍ ABAJO ---
    // Aumentamos la altura a h-[600px] en móvil y h-[85vh] (85% de la pantalla) en escritorio.
    // Esto permite que la imagen se vea mucho más completa sin recortarse tanto.
    <div className="w-full h-[600px] md:h-[85vh] mb-10 group relative">
      
      <Swiper
        spaceBetween={0}
        centeredSlides={true}
        loop={true} // Agregamos loop infinito
        autoplay={{
          delay: 5000, // Un poco más lento para apreciar la imagen
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper w-full h-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-full">
              
              {/* Filtro oscuro: Lo bajé un poco (bg-black/30) para que la imagen se vea más clara */}
              <div className="absolute inset-0 bg-black/30 z-10" />
              
              <img 
                src={slide.image} 
                alt={slide.title} 
                // object-center asegura que el centro de la imagen siempre se vea
                className="w-full h-full object-cover object-center"
              />
              
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center text-white px-4">
                <h2 className="text-4xl md:text-7xl font-bold font-mono mb-6 drop-shadow-lg animate-fade-in-up">
                  {slide.title}
                </h2>
                <p className="text-lg md:text-2xl mb-8 max-w-3xl text-gray-100 drop-shadow-md">
                  {slide.subtitle}
                </p>
                <button className="bg-algo-blue hover:bg-blue-700 text-white px-10 py-4 rounded-full font-bold text-lg transition transform hover:scale-105 flex items-center gap-3 shadow-lg hover:shadow-xl">
                  {slide.buttonText} <ArrowRight size={24} />
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroCarousel;