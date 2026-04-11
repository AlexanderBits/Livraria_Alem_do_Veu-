import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, ShoppingCart, X, Plus, Minus, Star, Search,
  Menu, ChevronRight, Heart, ArrowLeft, Sparkles, Mail, Phone, MapPin, Instagram, Facebook, LayoutDashboard, Check
} from 'lucide-react';
import { AdminPanel, AdminLogin } from './AdminPanel';
import CheckoutModal from './CheckoutModal';

// ─── TYPES ───────────────────────────────────────────────────────────────────
interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  originalPrice?: number;
  category: string;
  cover: string;
  rating: number;
  reviews: number;
  description: string;
  badge?: string;
}

interface CartItem extends Book { qty: number; }

// ─── DATA ────────────────────────────────────────────────────────────────────
const BOOKS: Book[] = [
  {
    id: 1,
    title: "O Poder do Agora",
    author: "Eckhart Tolle",
    price: 49.90,
    originalPrice: 69.90,
    category: "Espiritualidade",
    cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop",
    rating: 4.9,
    reviews: 2847,
    description: "Um guia para a iluminação espiritual. Eckhart Tolle mostra como viver plenamente no momento presente, libertando-se da mente que cria sofrimento.",
    badge: "Bestseller"
  },
  {
    id: 2,
    title: "A Cabana",
    author: "William P. Young",
    price: 39.90,
    category: "Ficção Cristã",
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
    rating: 4.8,
    reviews: 1923,
    description: "Uma história profundamente tocante sobre cura, amor e redenção. Um homem devastado pela tragédia recebe um convite misterioso que mudará sua vida.",
    badge: "Destaque"
  },
  {
    id: 3,
    title: "Além do Horizonte",
    author: "Gabriel Morais",
    price: 54.90,
    category: "Desenvolvimento Espiritual",
    cover: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=600&fit=crop",
    rating: 4.7,
    reviews: 834,
    description: "Uma jornada pelos mistérios da alma humana e sua conexão com o universo. Reflexões profundas sobre o propósito da vida e o além.",
  },
  {
    id: 4,
    title: "Véus da Eternidade",
    author: "Ana Beatriz Silva",
    price: 44.90,
    originalPrice: 59.90,
    category: "Espiritualidade",
    cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
    rating: 4.6,
    reviews: 612,
    description: "Uma exploração poética dos estados do ser e da consciência, tecendo filosofia oriental com sabedoria ocidental de forma única.",
    badge: "50% OFF"
  },

  {
    id: 5,
    title: "Luz nas Trevas",
    author: "Carlos Eduardo Paz",
    price: 35.90,
    category: "Fé e Esperança",
    cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=420&fit=crop",
    rating: 4.8,
    reviews: 1456,
    description: "Histórias reais de superação e fé que iluminam o caminho de quem busca força nos momentos mais difíceis da vida.",
  },
  {
    id: 6,
    title: "O Jardim do Silêncio",
    author: "Marta Cavalcante",
    price: 47.90,
    category: "Meditação",
    cover: "https://images.unsplash.com/photo-1463552765662-6aac7f0a0b93?w=300&h=420&fit=crop",
    rating: 4.5,
    reviews: 389,
    description: "Um manual prático de meditação e contemplação para quem busca paz interior. Técnicas ancestrais adaptadas ao cotidiano moderno.",
  },
  {
    id: 7,
    title: "Almas Gêmeas",
    author: "Roberto Alfredo",
    price: 42.90,
    category: "Amor e Espiritualidade",
    cover: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=300&h=420&fit=crop",
    rating: 4.7,
    reviews: 2103,
    description: "Uma bela narrativa sobre conexões espirituais profundas entre as almas, explorando os laços que transcendem o tempo e o espaço.",
    badge: "Destaque"
  },
  {
    id: 8,
    title: "Missão de Vida",
    author: "Fernanda Torres",
    price: 52.90,
    originalPrice: 65.90,
    category: "Propósito",
    cover: "https://images.unsplash.com/photo-1491841651911-c44c30c34548?w=300&h=420&fit=crop",
    rating: 4.9,
    reviews: 3211,
    description: "Descubra seu propósito de vida e aprenda a alinhar suas ações com seus valores mais profundos para uma existência plena e significativa.",
    badge: "Bestseller"
  },
];

const CATEGORIES = ["Todos", "Espiritualidade", "Ficção Cristã", "Desenvolvimento Espiritual", "Fé e Esperança", "Meditação", "Amor e Espiritualidade", "Propósito"];

// ─── LOGO COMPONENT ──────────────────────────────────────────────────────────
const Logo: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const heights = { sm: 40, md: 60, lg: 80 };
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-amber-500 p-[1px]">
        <div className="w-full h-full bg-[#080720] rounded-xl flex items-center justify-center">
            <BookOpen size={24} className="text-white" />
        </div>
      </div>
      <div className="flex flex-col">
        <span className="font-display text-lg font-bold text-white tracking-tight leading-none">ALÉM DO VÉU</span>
        <span className="text-[10px] text-amber-500 font-bold tracking-[0.2em] uppercase">Cler Editora</span>
      </div>
    </div>
  );
};


// ─── STAR RATING ─────────────────────────────────────────────────────────────
const Stars: React.FC<{ rating: number; count?: number }> = ({ rating, count }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map(i => (
      <Star key={i} size={12} className={i <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-600'} />
    ))}
    {count && <span className="text-xs text-gray-500 ml-1">({count.toLocaleString()})</span>}
  </div>
);

// ─── BOOK CARD ────────────────────────────────────────────────────────────────
const BookCard: React.FC<{ book: Book; onAdd: (b: Book) => void; onView: (b: Book) => void }> = ({ book, onAdd, onView }) => {
  const [wished, setWished] = useState(false);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="book-card group relative glass rounded-[2rem] overflow-hidden cursor-pointer border border-white/5 hover:border-indigo-500/30 transition-all duration-500"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      
      {book.badge && (
        <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-400 text-amber-950 shadow-lg shadow-amber-900/20">
          {book.badge}
        </div>
      )}
      
      <button 
        onClick={(e) => { e.stopPropagation(); setWished(!wished); }} 
        className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
      >
        <Heart size={16} className={wished ? 'fill-red-500 text-red-500' : 'text-white/40'} />
      </button>

      <div className="relative h-64 overflow-hidden pt-4 px-4" onClick={() => onView(book)}>
        <motion.img 
            src={book.cover} 
            alt={book.title} 
            className="w-full h-full object-cover rounded-2xl shadow-xl transition-transform duration-700 group-hover:scale-105" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080720] via-transparent to-transparent opacity-60" />
      </div>

      <div className="p-6 space-y-4">
        <div onClick={() => onView(book)}>
          <p className="text-[10px] text-amber-500 font-bold uppercase tracking-[0.2em] mb-1">{book.category}</p>
          <h3 className="text-white font-display font-bold text-lg leading-tight group-hover:text-indigo-400 transition-colors line-clamp-1">{book.title}</h3>
          <p className="text-sm text-gray-500 font-medium">{book.author}</p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <div>
            {book.originalPrice && <p className="text-xs text-gray-600 line-through mb-0.5">R$ {book.originalPrice.toFixed(2).replace('.', ',')}</p>}
            <p className="text-xl font-black text-white">
                <span className="text-sm font-normal text-gray-400 mr-1">R$</span>
                {book.price.toFixed(2).replace('.', ',')}
            </p>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onAdd(book); }}
            className="relative z-30 w-12 h-12 bg-white text-navy-950 hover:bg-indigo-500 hover:text-white rounded-2xl flex items-center justify-center transition-all duration-300 shadow-xl active:scale-90"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};


// ─── CART DRAWER ──────────────────────────────────────────────────────────────
const CartDrawer: React.FC<{ items: CartItem[]; isPremium: boolean; onClose: () => void; onUpdate: (id: number, d: number) => void; onRemove: (id: number) => void; onCheckout: () => void }> = ({ items, isPremium, onClose, onUpdate, onRemove, onCheckout }) => {
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = isPremium ? subtotal * 0.1 : 0;
  const total = subtotal - discount;
  return (
    <motion.div className="fixed inset-0 z-50 flex justify-end" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative w-full max-w-md h-full flex flex-col"
        style={{ background: '#0f0d2e', borderLeft: '1px solid rgba(255,255,255,0.08)' }}
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <ShoppingCart size={20} className="text-indigo-400" />
            <h2 className="font-display text-xl text-white font-semibold">Seu Carrinho</h2>
            <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white text-xs font-bold">{items.reduce((s, i) => s + i.qty, 0)}</span>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors">
            <X size={16} className="text-gray-400" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 gap-4 text-center p-6">
            <div className="w-20 h-20 rounded-full bg-indigo-900/30 flex items-center justify-center">
              <BookOpen size={32} className="text-indigo-400" />
            </div>
            <p className="text-gray-400">Seu carrinho está vazio</p>
            <button onClick={onClose} className="px-4 py-2 bg-indigo-600 rounded-xl text-white text-sm font-medium hover:bg-indigo-500 transition-colors">Explorar Livros</button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <AnimatePresence>
                {items.map(item => (
                  <motion.div key={item.id} layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="glass rounded-xl p-3 flex gap-3">
                    <img src={item.cover} alt={item.title} className="w-14 h-20 object-cover rounded-lg flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white text-sm font-semibold line-clamp-1 font-display">{item.title}</h4>
                      <p className="text-gray-500 text-xs">{item.author}</p>
                      <p className="text-amber-400 font-bold text-sm mt-1">R$ {item.price.toFixed(2).replace('.', ',')}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => onUpdate(item.id, -1)} className="w-6 h-6 rounded-full bg-indigo-900/50 flex items-center justify-center hover:bg-indigo-700 transition-colors">
                          <Minus size={10} className="text-white" />
                        </button>
                        <span className="text-white text-sm w-4 text-center">{item.qty}</span>
                        <button onClick={() => onUpdate(item.id, 1)} className="w-6 h-6 rounded-full bg-indigo-900/50 flex items-center justify-center hover:bg-indigo-700 transition-colors">
                          <Plus size={10} className="text-white" />
                        </button>
                        <button onClick={() => onRemove(item.id)} className="ml-auto">
                          <X size={14} className="text-gray-500 hover:text-red-400 transition-colors" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <div className="p-6 border-t border-white/10 space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Subtotal</span>
                <span className="text-white font-bold">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
              </div>
              {isPremium && (
                <div className="flex justify-between text-green-400 text-sm">
                  <span>Desconto Premium (10%)</span>
                  <span>- R$ {discount.toFixed(2).replace('.', ',')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-400">Frete</span>
                <span className={isPremium ? "text-green-400 text-sm font-bold" : "text-green-400 text-sm font-medium"}>
                  {isPremium ? "Grátis (Membro)" : "Grátis acima de R$ 150"}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-white/5 pt-4">
                <span className="text-white">Total</span>
                <span className="text-amber-400">R$ {total.toFixed(2).replace('.', ',')}</span>
              </div>
              <button
                onClick={onCheckout}
                className="w-full py-3.5 rounded-xl font-semibold text-white transition-all active:scale-95"
                style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}
              >
                Finalizar Compra
              </button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

// ─── BOOK DETAIL MODAL ───────────────────────────────────────────────────────
const BookDetail: React.FC<{ book: Book; onClose: () => void; onAdd: (b: Book) => void }> = ({ book, onClose, onAdd }) => (
  <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
    <motion.div
      className="relative w-full max-w-2xl glass rounded-2xl overflow-hidden"
      initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
    >
      <button onClick={onClose} className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors">
        <X size={16} className="text-gray-300" />
      </button>
      <div className="flex flex-col sm:flex-row">
        <div className="sm:w-64 h-64 sm:h-auto flex-shrink-0">
          <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 p-6 space-y-4">
          <div>
            <p className="text-xs text-indigo-400 font-medium uppercase tracking-widest">{book.category}</p>
            <h2 className="font-display text-2xl font-bold text-white mt-1">{book.title}</h2>
            <p className="text-gray-400">{book.author}</p>
          </div>
          <Stars rating={book.rating} count={book.reviews} />
          <p className="text-gray-300 text-sm leading-relaxed">{book.description}</p>
          <div>
            {book.originalPrice && <p className="text-sm text-gray-500 line-through">R$ {book.originalPrice.toFixed(2).replace('.', ',')}</p>}
            <p className="text-3xl font-bold text-white">R$ <span className="text-amber-400">{book.price.toFixed(2).replace('.', ',')}</span></p>
          </div>
          <button
            onClick={() => { onAdd(book); onClose(); }}
            className="w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all active:scale-95"
            style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}
          >
            <ShoppingCart size={18} />
            Adicionar ao Carrinho
          </button>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
const App: React.FC = () => {
  // ── Routing ──
  const [view, setView] = useState<'store' | 'admin-login' | 'admin'>('store');
  // ── Store ──
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todos');
  const [navFilter, setNavFilter] = useState('Catálogo');
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookList, setBookList] = useState<Book[]>(BOOKS as Book[]);
  const [isPremium, setIsPremium] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [subscriptionMode, setSubscriptionMode] = useState(false);

  const scrollToCatalog = () => {
    const el = document.getElementById('catalogo');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNavClick = (item: string) => {
    setNavFilter(item);
    if (item === 'Catálogo') {
      setCategory('Todos');
      setSearch('');
      scrollToCatalog();
    } else {
      scrollToCatalog();
    }
    setMenuOpen(false);
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const addToCart = useCallback((book: Book) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === book.id);
      if (ex) return prev.map(i => i.id === book.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...book, qty: 1 }];
    });
    setCartOpen(true);
  }, []);

  const updateQty = useCallback((id: number, delta: number) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  }, []);

  const removeItem = useCallback((id: number) => {
    setCart(prev => prev.filter(i => i.id !== id));
  }, []);

  const filtered = bookList.filter(b => {
    const matchSearch = b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'Todos' || b.category === category;
    
    let matchNav = true;
    if (navFilter === 'Novidades') matchNav = b.badge === 'Destaque' || b.badge === 'Bestseller' || b.badge === 'Destaque';
    if (navFilter === 'Promoções') matchNav = b.originalPrice !== undefined || (b.badge && b.badge.includes('OFF'));

    return matchSearch && matchCat && matchNav;
  });

  // ── Admin routing ──
  if (view === 'admin-login') return <AdminLogin onLogin={() => setView('admin')} onBack={() => setView('store')} />;
  if (view === 'admin') return <AdminPanel books={bookList} onBooksChange={setBookList} onExit={() => setView('store')} />;

  return (
    <div className="min-h-screen" style={{ background: '#080720' }}>
      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 backdrop-blur-md bg-[#080720]/80 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Logo size="sm" />
          <div className="hidden md:flex items-center gap-10">
            {['Catálogo', 'Novidades', 'Promoções'].map(item => (
              <button 
                key={item} 
                onClick={() => handleNavClick(item)}
                className={`text-[11px] uppercase tracking-[0.2em] font-bold transition-all ${navFilter === item ? 'text-amber-400' : 'text-gray-400 hover:text-white'}`}
              >
                {item}
              </button>
            ))}
            <button 
              onClick={() => setIsPremium(!isPremium)}
              className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${isPremium ? 'bg-amber-400 text-amber-950 shadow-lg shadow-amber-400/20' : 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/30'}`}
            >
              {isPremium ? 'Membro Premium' : 'Seja Premium'}
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCartOpen(true)}
              className="relative w-12 h-12 rounded-2xl glass border border-white/10 flex items-center justify-center transition-all hover:bg-white/5"
            >
              <ShoppingCart size={18} className="text-white" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-500 rounded-full text-[10px] text-white font-black flex items-center justify-center shadow-lg">
                  {cartCount}
                </span>
              )}
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden w-12 h-12 glass rounded-2xl flex items-center justify-center">
              <Menu size={18} className="text-white" />
            </button>
          </div>
        </div>
      </nav>


      {/* MOBILE MENU */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="fixed top-16 left-0 right-0 z-30 glass border-b border-white/10 p-4 flex flex-col gap-3 md:hidden">
            {['Catálogo', 'Novidades', 'Promoções', 'Sobre'].map(item => (
              <button 
                key={item} 
                onClick={() => handleNavClick(item)} 
                className={`text-sm py-2 text-left font-medium transition-colors ${navFilter === item ? 'text-amber-400' : 'text-gray-300 hover:text-white'}`}
              >
                {item}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO */}
      <section className="relative overflow-hidden py-32 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl aspect-square bg-indigo-600/10 blur-[120px] rounded-full -translate-y-1/2 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
          <motion.div 
            initial={{ opacity: 0, x: -50 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 1, ease: "easeOut" }} 
            className="flex-1 text-center lg:text-left z-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] text-indigo-400 font-black uppercase tracking-[0.3em] mb-8">
              <Sparkles size={12} className="text-amber-400" />
              Cler Editora apresenta
            </div>
            <h1 className="font-display text-6xl lg:text-8xl font-black text-white leading-none mb-8">
              Mundos<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">Além do Véu</span>
            </h1>
            <p className="text-gray-400 text-lg lg:text-xl mb-12 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              A curadoria definitiva de literatura espiritual e desenvolvimento da consciência. Viva a transformação em cada página.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button 
                onClick={() => handleNavClick('Catálogo')}
                className="px-10 py-5 rounded-[2rem] font-black text-white flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-indigo-600/20 bg-gradient-to-br from-indigo-500 to-indigo-700"
              >
                <BookOpen size={20} />
                EXPLORAR CATÁLOGO
              </button>
              <button className="px-10 py-5 rounded-[2rem] font-black text-white glass border border-white/10 hover:bg-white/5 transition-all">
                SOBRE NÓS
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }} 
            animate={{ opacity: 1, scale: 1, rotate: 0 }} 
            transition={{ duration: 1.2, ease: "easeOut" }} 
            className="flex-1 relative"
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Floating elements backdrop */}
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-2 border-dashed border-indigo-500/20 rounded-full" 
              />
              
              <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 left-1/4 w-48 h-64 z-20"
              >
                <img src={BOOKS[0].cover} alt="" className="w-full h-full object-cover rounded-2xl shadow-2xl rotate-[-12deg] border border-white/10" />
              </motion.div>
              
              <motion.div 
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-10 right-1/4 w-48 h-64 z-10"
              >
                <img src={BOOKS[7].cover} alt="" className="w-full h-full object-cover rounded-2xl shadow-2xl rotate-[12deg] border border-white/10" />
              </motion.div>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px]" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>


      {/* SUBSCRIPTION PLAN */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto glass rounded-[3rem] p-12 lg:p-20 border border-white/5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-transparent to-amber-500/10 opacity-50" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 blur-[100px] rounded-full group-hover:bg-indigo-500/30 transition-all duration-700" />
          
          <div className="flex flex-col lg:flex-row items-center gap-16 relative z-10">
            <div className="flex-1 space-y-8">
              <div className="inline-flex px-4 py-1.5 bg-amber-400 rounded-full text-[10px] font-black uppercase tracking-widest text-amber-950 shadow-xl shadow-amber-400/20">
                Lançamento Exclusivo
              </div>
              <h2 className="font-display text-5xl font-black text-white leading-tight">Clube do Livro<br /><span className="text-amber-400">Além do Véu</span></h2>
              <p className="text-gray-400 text-lg leading-relaxed font-medium">
                Participe da jornada. Receba mensalmente uma obra selecionada por nossa curadoria, edições exclusivas e acesso total aos benefícios premium.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  'Livro Físico Exclusivo',
                  'Frete Grátis Ilimitado',
                  '10% OFF Vitalício',
                  'Conteúdo Digital Extra'
                ].map(benefit => (
                  <div key={benefit} className="flex items-center gap-3 text-gray-300 font-semibold text-sm">
                    <div className="w-6 h-6 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                      <Check size={14} className="text-indigo-400" />
                    </div>
                    {benefit}
                  </div>
                ))}
              </div>
              <div className="pt-6">
                <button 
                  onClick={() => { setSubscriptionMode(true); setCheckoutOpen(true); }}
                  className="px-10 py-5 rounded-2xl font-black text-white shadow-2xl shadow-amber-500/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-4 bg-gradient-to-br from-amber-400 to-amber-600"
                >
                  QUERO FAZER PARTE
                  <Sparkles size={20} />
                </button>
                <p className="text-[10px] text-gray-500 mt-6 uppercase tracking-[0.2em] font-bold">Apenas R$ 59,90/mês · Cancele quando quiser</p>
              </div>
            </div>
            <div className="flex-1 relative order-first lg:order-last">
                <motion.div 
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="relative z-10 w-full max-w-[320px] mx-auto aspect-[3/4] glass rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden p-2"
                >
                    <div className="w-full h-full bg-[#0d0b26] rounded-[2.2rem] flex flex-col items-center justify-center p-8 text-center border border-white/5">
                        <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-amber-400/20">
                            <BookOpen size={32} className="text-amber-950" />
                        </div>
                        <p className="text-white font-display font-black text-2xl mb-2">BOX MARÇO</p>
                        <p className="text-amber-500 text-xs font-bold tracking-widest uppercase mb-8">"O Despertar da Alma"</p>
                        <div className="flex gap-2">
                             {[1,2,3].map(i => <div key={i} className="w-10 h-10 rounded-full border border-white/10 glass flex items-center justify-center text-[10px] font-bold text-white">M{i}</div>)}
                        </div>
                    </div>
                </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CATALOG */}
      <section id="catalogo" className="py-32 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <span className="text-[10px] text-indigo-500 font-bold uppercase tracking-[0.4em]">Curadoria Especial</span>
            <h2 className="font-display text-5xl font-black text-white">Nosso Catálogo</h2>
            <p className="text-gray-500 font-medium max-w-md">Obras selecionadas para elevar sua consciência e transformar sua visão de mundo.</p>
          </div>
          <div className="relative w-full md:w-96">
            <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar por título ou autor..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-5 glass rounded-[2rem] text-sm text-white placeholder-gray-600 border border-white/10 focus:border-indigo-500/30 transition-all outline-none"
            />
          </div>
        </div>


        {/* CATEGORIES */}
        <div className="flex gap-2 flex-wrap mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${category === cat ? 'bg-indigo-600 text-white' : 'glass text-gray-400 hover:text-white hover:bg-white/10'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* GRID */}
        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            <motion.div key="grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map(book => (
                <BookCard key={book.id} book={book as any} onAdd={addToCart} onView={setSelectedBook} />
              ))}
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <BookOpen size={48} className="text-gray-700 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum livro encontrado para "{search}"</p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-12 px-4 mt-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <Logo size="md" />
              <p className="text-gray-500 text-sm mt-4 max-w-xs leading-relaxed">
                Uma livraria dedicada ao crescimento espiritual e pessoal. Parceira oficial da Cler Editora para levar transformação através dos livros.
              </p>
              <div className="flex gap-3 mt-4">
                {[Instagram, Facebook].map((Icon, i) => (
                  <div key={i} className="w-9 h-9 glass rounded-full flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
                    <Icon size={16} className="text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Links Rápidos</h4>
              <ul className="space-y-2">
                {['Catálogo', 'Novidades', 'Promoções', 'Sobre Nós'].map(link => (
                  <li key={link}><button className="text-sm text-gray-500 hover:text-indigo-400 transition-colors">{link}</button></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contato</h4>
              <ul className="space-y-3">
                {[
                  { Icon: Mail, text: 'contato@alemdoveu.com.br' },
                  { Icon: Phone, text: '(11) 99999-9999' },
                  { Icon: MapPin, text: 'São Paulo, SP' },
                ].map(({ Icon, text }) => (
                  <li key={text} className="flex items-center gap-2 text-sm text-gray-500">
                    <Icon size={14} className="text-indigo-400 flex-shrink-0" />
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
            <p className="text-xs text-gray-600">© 2025 Além do Véu. Parceria com Cler Editora. Todos os direitos reservados.</p>
            <p className="text-xs text-gray-700">CNPJ 00.000.000/0001-00</p>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      <AnimatePresence>
        {cartOpen && (
          <CartDrawer items={cart} isPremium={isPremium} onClose={() => setCartOpen(false)} onUpdate={updateQty} onRemove={removeItem} onCheckout={() => { setSubscriptionMode(false); setCheckoutOpen(true); setCartOpen(false); }} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {selectedBook && (
          <BookDetail book={selectedBook} onClose={() => setSelectedBook(null)} onAdd={addToCart} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {checkoutOpen && (
          <CheckoutModal 
            items={cart} 
            isSubscription={subscriptionMode} 
            onSuccess={() => { if (subscriptionMode) setIsPremium(true); }}
            onClose={() => { setCheckoutOpen(false); setSubscriptionMode(false); }} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;