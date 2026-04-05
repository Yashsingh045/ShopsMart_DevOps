import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { Heart, Folder, Plus, Loader2, FolderPlus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const WishlistPage = () => {
  const { user } = useSelector(state => state.auth);
  const [wishlistData, setWishlistData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFolder, setActiveFolder] = useState('All');
  const [newFolderName, setNewFolderName] = useState('');
  const [showFolderInput, setShowFolderInput] = useState(false);

  const fetchWishlist = async () => {
    try {
      const response = await api.get('/wishlist');
      setWishlistData(response.data);
    } catch (error) {
      console.error('Failed to fetch wishlist');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchWishlist();
  }, [user]);

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!newFolderName) return;
    try {
      // Backend just expects folder name on item, but let's assume we can "initialize" by creating a dummy or just state
      setActiveFolder(newFolderName);
      setNewFolderName('');
      setShowFolderInput(false);
    } catch (err) {
      console.error(err);
    }
  };

  const folderNames = ['All', ...wishlistData.map(folder => folder.name)];
  
  const filteredItems = activeFolder === 'All'
    ? wishlistData.flatMap(folder => folder.items.map(item => ({ ...item, folderId: folder.id, folderName: folder.name })))
    : wishlistData
        .filter(folder => folder.name === activeFolder)
        .flatMap(folder => folder.items.map(item => ({ ...item, folderId: folder.id, folderName: folder.name })));

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-grow">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <Heart className="w-8 h-8 text-rose-500 fill-current" />
              My Wishlist
            </h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">Organize your favorite premium finds</p>
          </div>
          
          <div className="flex items-center gap-3">
            <AnimatePresence>
              {showFolderInput ? (
                <motion.form 
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 'auto', opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  onSubmit={handleCreateFolder}
                  className="flex items-center gap-2"
                >
                  <input 
                    type="text" 
                    placeholder="Folder name..."
                    className="input-field text-xs py-2 w-40"
                    autoFocus
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                  />
                  <button type="submit" className="p-2 bg-primary-600 text-white rounded-lg"><Plus className="w-4 h-4" /></button>
                </motion.form>
              ) : (
                <button 
                  onClick={() => setShowFolderInput(true)}
                  className="btn-secondary py-2 px-4 shadow-none border-dashed border-2 text-xs flex items-center gap-2"
                >
                  <FolderPlus className="w-4 h-4" /> New Folder
                </button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Folders Bar */}
        <div className="flex gap-3 mb-10 overflow-x-auto pb-4 no-scrollbar">
          {folderNames.map(folder => (
            <button
              key={folder}
              onClick={() => setActiveFolder(folder)}
              className={`px-6 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-2 ${
                activeFolder === folder 
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-200' 
                  : 'bg-white text-slate-500 border-slate-100 hover:border-primary-200'
              }`}
            >
              <Folder className={`w-3.5 h-3.5 ${activeFolder === folder ? 'text-primary-400' : 'text-slate-300'}`} />
              {folder}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-96 bg-white rounded-3xl border border-slate-100">
            <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-20 text-center shadow-sm border border-slate-100">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-slate-300" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Folder is empty</h2>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">This collection hasn&apos;t seen any love yet. Explore the shop to add items.</p>
            <a href="/shop" className="btn-primary inline-flex items-center gap-2 px-10">
              Browse Collection
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <AnimatePresence>
              {filteredItems.map(item => (
                <motion.div 
                  layout
                  key={item.productId}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <ProductCard product={item.product} />
                  <div className="mt-3 flex gap-2">
                    <button 
                      onClick={async () => {
                        await api.delete(`/wishlist/items/${item.folderId}/${item.productId}`);
                        fetchWishlist();
                      }}
                      className="flex-grow flex items-center justify-center gap-2 py-2 text-[10px] font-bold text-slate-400 hover:text-red-500 transition-colors bg-white rounded-xl border border-slate-100"
                    >
                      <Trash2 className="w-3 h-3" /> Remove
                    </button>
                    <button className="px-3 py-2 bg-white rounded-xl border border-slate-100 text-slate-400 hover:text-primary-600 transition-colors">
                      <Folder className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default WishlistPage;
