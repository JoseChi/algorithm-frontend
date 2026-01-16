import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Páginas
import Home from './pages/Home';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Login from './pages/Login';
import MyOrders from './pages/MyOrders'; 
import ProductDetails from './pages/ProductDetails';
import OrderDetail from './pages/OrderDetail';
import AdminDashboard from './pages/AdminDashboard';
import AdminOrders from './pages/AdminOrders'; // <--- 1. IMPORTAR NUEVA PÁGINA
import SearchPage from './pages/SearchPage';
import UserProfile from './pages/UserProfile'; 

function App() {
  const { user } = useSelector((state) => state.auth || {});

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-gray-50"> 
        
        <Navbar />
        
        <div className="flex-1">
          <Routes>
            {/* --- RUTAS PRINCIPALES --- */}
            <Route path="/" element={<Home />} />
            <Route path="/category/:category" element={<Home />} />
            
            <Route path="/products" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/login" element={<Login />} />
            
            {/* --- RUTAS DE USUARIO --- */}
            <Route path="/orders" element={<MyOrders />} /> 
            <Route path="/order/:id" element={<OrderDetail />} />
            <Route path="/profile" element={<UserProfile />} />

            {/* --- RUTAS DE PRODUCTO --- */}
            <Route path="/product/:name" element={<ProductDetails />} />
            <Route path="/search" element={<SearchPage />} />

            {/* --- RUTAS DE ADMIN --- */}
            
            {/* Panel de Productos */}
            <Route 
              path="/admin" 
              element={
                user && user.role === 'ROLE_ADMIN' ? <AdminDashboard /> : <Navigate to="/" />
              } 
            />

            {/* Panel de Ventas (NUEVA RUTA) */}
            <Route 
              path="/admin/orders" 
              element={
                user && user.role === 'ROLE_ADMIN' ? <AdminOrders /> : <Navigate to="/" />
              } 
            />

          </Routes>
        </div>

        <Footer />

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
            theme="colored"
        />

      </div>
    </BrowserRouter>
  );
}

export default App;