import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Páginas
import Home from './pages/Home';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist'; // <--- 1. NUEVO IMPORT
import Login from './pages/Login';
import MyOrders from './pages/MyOrders'; 
import ProductDetails from './pages/ProductDetails';
import OrderDetail from './pages/OrderDetail';
import AdminDashboard from './pages/AdminDashboard';
import SearchPage from './pages/SearchPage';
import UserProfile from './pages/UserProfile'; 

function App() {
  // Aseguramos que user no sea null para evitar errores
  const { user } = useSelector((state) => state.auth || {});

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-gray-50"> 
        
        <Navbar />
        
        <div className="flex-1">
          <Routes>
            {/* --- RUTAS PRINCIPALES --- */}
            
            {/* Home maneja tanto la portada como las categorías (Hombres, Mujeres...) */}
            <Route path="/" element={<Home />} />
            <Route path="/category/:category" element={<Home />} /> {/* <--- 2. APUNTA A HOME */}
            
            <Route path="/products" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} /> {/* <--- 3. RUTA WISHLIST */}
            <Route path="/login" element={<Login />} />
            
            {/* --- RUTAS DE USUARIO --- */}
            {/* Ajustamos a /orders para coincidir con el Navbar */}
            <Route path="/orders" element={<MyOrders />} /> 
            <Route path="/order/:id" element={<OrderDetail />} />
            <Route path="/profile" element={<UserProfile />} />

            {/* --- RUTAS DE PRODUCTO --- */}
            <Route path="/product/:name" element={<ProductDetails />} />
            <Route path="/search" element={<SearchPage />} />

            {/* --- RUTA DE ADMIN --- */}
            <Route 
              path="/admin" 
              element={
                user && user.role === 'ROLE_ADMIN' ? <AdminDashboard /> : <Navigate to="/" />
              } 
            />
          </Routes>
        </div>

        <Footer />

        {/* Notificaciones */}
        <ToastContainer 
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored" // "colored", "light" o "dark"
        />

      </div>
    </BrowserRouter>
  );
}

export default App;