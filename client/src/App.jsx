import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from './store/slices/authSlice';
import api from './utils/api';

// Placeholder Components (to be replaced in F17-F20)
const Home = () => <div className="p-8"><h1 className="text-4xl font-bold">Welcome to ShopsMart</h1><p className="mt-4 text-slate-600">Premium E-commerce Experience</p></div>;
const Shop = () => <div className="p-8 md:ml-64 transition-all">Product Catalog Page</div>;
const ProductDetail = () => <div className="p-8">Product Details Page</div>;
const Login = () => <div className="p-8">Login Page</div>;
const Signup = () => <div className="p-8">Signup Page</div>;
const Cart = () => <div className="p-8">Shopping Cart Page</div>;
const Profile = () => <div className="p-8">User Profile & Stats</div>;
const Orders = () => <div className="p-8">Order History</div>;

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('shopsmart_token');
      if (token) {
        try {
          const response = await api.get('/auth/me');
          dispatch(setUser(response.data));
        } catch (error) {
          console.error('Failed to restore session');
          localStorage.removeItem('shopsmart_token');
        }
      }
    };
    fetchUser();
  }, [dispatch]);

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {/* Navigation Placeholder */}
        <nav className="h-16 border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 flex items-center px-8 justify-between">
          <div className="font-bold text-xl text-primary-600 tracking-tight">ShopsMart</div>
          <div className="flex gap-6 text-sm font-medium text-slate-600">
            <a href="/">Home</a>
            <a href="/shop">Shop</a>
            <a href="/cart">Cart</a>
            <a href="/profile">Profile</a>
          </div>
        </nav>

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/orders" element={<Orders />} />
          </Routes>
        </main>

        <footer className="py-8 border-t bg-white text-center text-slate-400 text-xs">
          &copy; 2026 ShopsMart E-commerce. Designed for excellence.
        </footer>
      </div>
    </Router>
  );
}

export default App;
