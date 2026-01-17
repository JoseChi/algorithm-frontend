import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingBag, Heart, Search, User, Menu, X, LogOut, Package, Settings, ClipboardList } from 'lucide-react';
import { logout } from '../redux/authSlice';
// Actualizacion menu admin

import logoAlgorithm from '../assets/algorithm4N-svg.png'; 

const Navbar = () => {
  const { items } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setShowUserMenu(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      console.log("Buscando:", searchTerm);
      // navigate(`/search?q=${searchTerm}`);
    }
  };

  return (
    <>
      <div className="bg-gray-100 text-center py-2 text-[11px] font-extrabold tracking-widest uppercase text-gray-900 hidden md:block">
        Envíos gratis en órdenes superiores a $999 MXN 🚀
      </div>

      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            <Link to="/" className="flex-shrink-0 flex items-center gap-3 group">
              <img 
                src={logoAlgorithm} 
                alt="Algorithm Store Logo" 
                className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
              />
              <span className="font-bold text-xl tracking-tighter text-gray-900 font-mono hidden xl:block">
                Algorithm<span className="text-blue-600">Store</span>
              </span>
            </Link>

            <div className="hidden md:flex space-x-8">
              {['Hombres', 'Mujeres', 'Nuevos', 'Ofertas'].map((item) => (
                <Link 
                  key={item} 
                  to={`/category/${item.toLowerCase()}`}
                  className="text-gray-900 hover:text-blue-600 font-bold text-sm uppercase tracking-wide transition relative group py-2"
                >
                  {item}
                  <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2 lg:gap-4">
              
              <form onSubmit={handleSearch} className="hidden lg:flex items-center bg-gray-100 rounded-full px-4 py-2 w-48 focus-within:w-64 focus-within:bg-white focus-within:ring-1 focus-within:ring-gray-300 transition-all duration-300 group">
                <Search size={18} className="text-gray-500 group-focus-within:text-black" />
                <input 
                  type="text"
                  placeholder="Buscar..." 
                  className="bg-transparent border-none focus:outline-none text-sm ml-2 w-full placeholder-gray-500 font-medium"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </form>
              
              <button className="lg:hidden p-2 hover:bg-gray-100 rounded-full text-gray-900">
                <Search size={24} strokeWidth={1.5} />
              </button>

              <Link to="/wishlist" className="p-2 hover:bg-gray-100 rounded-full transition relative group text-gray-900" title="Lista de Deseos">
                <Heart size={24} strokeWidth={1.5} className="group-hover:text-red-600 transition-colors"/>
              </Link>

              <Link to="/cart" className="p-2 hover:bg-gray-100 rounded-full transition relative text-gray-900">
                <ShoppingBag size={24} strokeWidth={1.5} />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white transform translate-x-1 -translate-y-1">
                    {totalItems}
                  </span>
                )}
              </Link>

              {isAuthenticated ? (
                <div className="relative z-50">
                  <button 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="p-2 hover:bg-gray-100 rounded-full transition focus:outline-none text-gray-900"
                  >
                    <User size={24} strokeWidth={1.5} />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100 py-2 transform origin-top-right animate-in fade-in slide-in-from-top-2">
                      <div className="px-5 py-4 border-b border-gray-50 bg-gray-50/50">
                        <p className="text-sm font-bold text-gray-900">Hola, {user?.firstName || 'Usuario'}</p>
                        <p className="text-xs text-gray-500 font-medium truncate">{user?.email}</p>
                        
                        {user?.role === 'ROLE_ADMIN' && (
                           <span className="mt-1 inline-block bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                             Administrador
                           </span>
                        )}
                      </div>
                      
                      <div className="py-2">
                        {/* --- SECCIÓN DE ADMIN --- */}
                        {user?.role === 'ROLE_ADMIN' && (
                          <div className="border-b border-gray-100 mb-2 pb-2">
                              <Link to="/admin" className="flex items-center gap-3 px-5 py-2 text-sm font-bold text-purple-700 hover:bg-purple-50 transition" onClick={() => setShowUserMenu(false)}>
                                <Settings size={18} strokeWidth={2} /> Productos
                              </Link>
                              <Link to="/admin/orders" className="flex items-center gap-3 px-5 py-2 text-sm font-bold text-blue-700 hover:bg-blue-50 transition" onClick={() => setShowUserMenu(false)}>
                                <ClipboardList size={18} strokeWidth={2} /> Ventas / Pedidos
                              </Link>
                          </div>
                        )}
                        {/* ----------------------- */}

                        <Link to="/profile" className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-black transition" onClick={() => setShowUserMenu(false)}>
                          <User size={18} strokeWidth={1.5} /> Mi Cuenta
                        </Link>
                        <Link to="/orders" className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-black transition" onClick={() => setShowUserMenu(false)}>
                          <Package size={18} strokeWidth={1.5} /> Mis Pedidos
                        </Link>
                         <Link to="/wishlist" className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-black transition" onClick={() => setShowUserMenu(false)}>
                          <Heart size={18} strokeWidth={1.5} /> Lista de Deseos
                        </Link>
                      </div>
                      
                      <div className="border-t border-gray-100 mt-1 pt-2 px-2">
                        <button 
                          onClick={handleLogout}
                          className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition font-bold"
                        >
                          <LogOut size={18} strokeWidth={1.5} /> Cerrar Sesión
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="hidden md:block bg-gray-900 text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-black transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ml-2">
                  Entrar
                </Link>
              )}

              <button 
                className="md:hidden p-2 text-gray-900"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-6 space-y-2 shadow-2xl absolute w-full left-0 z-40">
              {['Hombres', 'Mujeres', 'Nuevos', 'Ofertas'].map((item) => (
                <Link 
                  key={item} 
                  to={`/category/${item.toLowerCase()}`}
                  className="block text-2xl font-bold text-gray-900 py-3 border-b border-gray-50 hover:text-blue-600 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
              <div className="pt-6 grid grid-cols-2 gap-4">
                 <Link to="/wishlist" className="flex items-center justify-center gap-2 border border-gray-200 py-3 rounded-lg font-bold text-sm" onClick={() => setIsMenuOpen(false)}>
                   <Heart size={18} /> Wishlist
                 </Link>
                 {!isAuthenticated && (
                  <Link to="/login" className="flex items-center justify-center gap-2 bg-black text-white py-3 rounded-lg font-bold text-sm" onClick={() => setIsMenuOpen(false)}>
                    Iniciar Sesión
                  </Link>
                )}
              </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;