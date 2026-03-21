import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Package, Clock, Box, CheckCircle2, ChevronRight, Loader2, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const OrdersPage = () => {
  const { user } = useSelector(state => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchOrders();
  }, [user]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'DELIVERED': return 'text-green-600 bg-green-50 border-green-100';
      case 'PENDING': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'SHIPPED': return 'text-primary-600 bg-primary-50 border-primary-100';
      case 'CANCELLED': return 'text-red-600 bg-red-50 border-red-100';
      default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Order History</h1>
            <p className="text-slate-500 text-sm mt-1">Manage and track your recent purchases</p>
          </div>
          <div className="relative w-full sm:w-64">
            <input 
              type="text" 
              placeholder="Filter by Order ID..." 
              className="input-field pl-10 text-xs"
            />
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-96 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-20 text-center shadow-sm border border-slate-100">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Box className="w-10 h-10 text-slate-300" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">No orders yet</h2>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">Looks like you haven't placed any orders. Start exploring our premium collection.</p>
            <a href="/shop" className="btn-primary inline-flex items-center gap-2 px-10">
              Go Shopping
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={order.id} 
                className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all group"
              >
                <div className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-50">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-50 rounded-xl">
                      <Package className="w-6 h-6 text-slate-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-slate-900">Order #{order.id.slice(-8).toUpperCase()}</span>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded border uppercase tracking-wider ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(order.createdAt).toLocaleDateString()}</span>
                        <span>{order.orderItems?.length || 0} Items</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between md:justify-end gap-8">
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Amount</p>
                      <p className="text-xl font-black text-slate-900">${order.totalAmount.toFixed(2)}</p>
                    </div>
                    <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors group-hover:translate-x-1 decoration-clone">
                      <ChevronRight className="w-5 h-5 text-slate-300" />
                    </button>
                  </div>
                </div>

                {/* Preview Items */}
                <div className="px-8 py-4 bg-slate-50/50 flex gap-4 overflow-x-auto no-scrollbar">
                  {order.orderItems?.map((item) => (
                    <div key={item.id} className="flex-shrink-0 flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-lg border border-slate-200 overflow-hidden">
                        <img src={`https://picsum.photos/seed/${item.productId}/100/100`} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-xs font-bold text-slate-600 truncate max-w-[100px]">{item.product?.name}</span>
                      <span className="text-[10px] font-black text-slate-300">x{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default OrdersPage;
