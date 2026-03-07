import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, ShoppingCart, X, Plus, Minus, Star, Search,
  Menu, ChevronRight, Heart, ArrowLeft, Sparkles, Mail, Phone, MapPin, Instagram, Facebook, LayoutDashboard
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
    cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=420&fit=crop",
    rating: 4.9,
    reviews: 2847,
    description: "Um guia para a iluminação espiritual. Eckhart Tolle mostra como viver plenamente no momento presente, libertando-se da mente que cria sofrimento.",
    badge: "Mais Vendido"
  },
  {
    id: 2,
    title: "A Cabana",
    author: "William P. Young",
    price: 39.90,
    category: "Ficção Cristã",
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=420&fit=crop",
    rating: 4.8,
    reviews: 1923,
    description: "Uma história profundamente tocante sobre cura, amor e redenção. Um homem devastado pela tragédia recebe um convite misterioso que mudará sua vida.",
    badge: "Novo"
  },
  {
    id: 3,
    title: "Além do Horizonte",
    author: "Gabriel Morais",
    price: 54.90,
    category: "Desenvolvimento Espiritual",
    cover: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=300&h=420&fit=crop",
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
    cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=420&fit=crop",
    rating: 4.6,
    reviews: 612,
    description: "Uma exploração poética dos estados do ser e da consciência, tecendo filosofia oriental com sabedoria ocidental de forma única.",
    badge: "Promoção"
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
  const heights = { sm: 180, md: 180, lg: 180 };
  return (
    <img
      src="/logo.png"
      alt="Além do Véu — Cler Editora"
      style={{ height: heights[size], width: 'auto', objectFit: 'contain' }}
    />
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="book-card group relative glass rounded-2xl overflow-hidden cursor-pointer"
    >
      {book.badge && (
        <div className="absolute top-3 left-3 z-10 px-2 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-500 to-amber-600 text-amber-950">
          {book.badge}
        </div>
      )}
      <button onClick={() => setWished(!wished)} className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full glass flex items-center justify-center transition-colors hover:bg-white/10">
        <Heart size={14} className={wished ? 'fill-red-400 text-red-400' : 'text-gray-400'} />
      </button>

      <div className="relative h-52 overflow-hidden" onClick={() => onView(book)}>
        <img src={book.cover} alt={book.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="book-overlay absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/60 to-transparent flex items-end justify-center pb-4">
          <button onClick={(e) => { e.stopPropagation(); onView(book); }} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-full text-sm text-white font-medium transition-colors flex items-center gap-1">
            Ver Detalhes <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-2">
        <div>
          <p className="text-xs text-indigo-400 font-medium uppercase tracking-wider">{book.category}</p>
          <h3 className="text-white font-display font-semibold text-base leading-tight mt-0.5 line-clamp-1">{book.title}</h3>
          <p className="text-sm text-gray-400">{book.author}</p>
        </div>
        <Stars rating={book.rating} count={book.reviews} />
        <div className="flex items-center justify-between pt-1">
          <div>
            {book.originalPrice && <p className="text-xs text-gray-500 line-through">R$ {book.originalPrice.toFixed(2).replace('.', ',')}</p>}
            <p className="text-lg font-bold text-white">R$ <span className="text-amber-400">{book.price.toFixed(2).replace('.', ',')}</span></p>
          </div>
          <button
            onClick={() => onAdd(book)}
            className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 rounded-xl text-white text-sm font-medium transition-all"
          >
            <ShoppingCart size={14} />
            Comprar
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// ─── CART DRAWER ──────────────────────────────────────────────────────────────
const CartDrawer: React.FC<{ items: CartItem[]; onClose: () => void; onUpdate: (id: number, d: number) => void; onRemove: (id: number) => void; onCheckout: () => void }> = ({ items, onClose, onUpdate, onRemove, onCheckout }) => {
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
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
                <span className="text-white font-bold">R$ {total.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Frete</span>
                <span className="text-green-400 text-sm font-medium">Grátis acima de R$ 150</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
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
  const [menuOpen, setMenuOpen] = useState(false);
  // ── Shared book state (admin can edit) ──
  const [bookList, setBookList] = useState<Book[]>(BOOKS as Book[]);

  const [checkoutOpen, setCheckoutOpen] = useState(false);

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
    return matchSearch && matchCat;
  });

  // ── Admin routing ──
  if (view === 'admin-login') return <AdminLogin onLogin={() => setView('admin')} onBack={() => setView('store')} />;
  if (view === 'admin') return <AdminPanel books={bookList} onBooksChange={setBookList} onExit={() => setView('store')} />;

  return (
    <div className="min-h-screen" style={{ background: '#080720' }}>
      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[180px] flex items-center justify-between">
          <Logo size="sm" />
          <div className="hidden md:flex items-center gap-8">
            {['Catálogo', 'Novidades', 'Promoções', 'Sobre'].map(item => (
              <button key={item} className="nav-link text-sm text-gray-300 hover:text-white transition-colors font-medium">{item}</button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setView('admin-login')}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 glass hover:bg-white/10 rounded-xl transition-colors text-xs text-gray-500 hover:text-gray-300">
              <LayoutDashboard size={14} />
              Admin
            </button>
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-1.5 px-3 py-2 glass hover:bg-white/10 rounded-xl transition-colors"
            >
              <ShoppingCart size={18} className="text-gray-300" />
              {cartCount > 0 && (
                <span className="cart-badge absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 rounded-full text-xs text-white font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden w-8 h-8 glass rounded-lg flex items-center justify-center">
              <Menu size={16} className="text-gray-300" />
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
              <button key={item} onClick={() => setMenuOpen(false)} className="text-gray-300 hover:text-white text-sm py-2 text-left font-medium">{item}</button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="hero-glow absolute inset-0 pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 50% 60% at 80% 50%, rgba(79, 70, 229, 0.15), transparent)' }} />
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 glass rounded-full text-xs text-indigo-300 font-medium mb-6 border border-indigo-500/20">
              <Sparkles size={12} className="text-amber-400" />
              Parceira oficial Cler Editora
            </div>
            <h1 className="font-display text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
              Descubra mundos<br />
              <span className="gold-gradient">Além do Véu</span>
            </h1>
            <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto lg:mx-0">
              Uma curadoria especial de livros espirituais, de fé e desenvolvimento pessoal. Cada página, uma nova revelação.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <button className="px-6 py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95"
                style={{ background: 'linear-gradient(135deg, #6366f1, #4338ca)' }}>
                <BookOpen size={18} />
                Ver Catálogo
              </button>
              <button className="px-6 py-3.5 rounded-xl font-semibold text-gray-300 glass hover:bg-white/10 transition-all">
                Sobre a Editora
              </button>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="flex-1 flex justify-center">
            <div className="relative w-72 h-72">
              <div className="absolute inset-0 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />
              <div className="absolute top-4 left-4 w-36 h-48 rounded-xl overflow-hidden shadow-2xl shadow-indigo-900/50 rotate-[-8deg]">
                <img src={BOOKS[0].cover} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="absolute top-8 right-4 w-36 h-48 rounded-xl overflow-hidden shadow-2xl shadow-indigo-900/50 rotate-[5deg]">
                <img src={BOOKS[7].cover} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-36 h-48 rounded-xl overflow-hidden shadow-2xl shadow-indigo-900/50">
                <img src={BOOKS[4].cover} alt="" className="w-full h-full object-cover" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS BAR */}
      <div className="py-8 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { label: 'Livros disponíveis', value: '500+' },
            { label: 'Clientes satisfeitos', value: '12.000+' },
            { label: 'Avaliação média', value: '4.8 ★' },
            { label: 'Entregas realizadas', value: '35.000+' },
          ].map(stat => (
            <div key={stat.label}>
              <p className="text-2xl font-display font-bold text-amber-400">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CATALOG */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="font-display text-3xl font-bold text-white">Nosso Catálogo</h2>
            <p className="text-gray-500 mt-1">Escolha sua próxima leitura transformadora</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar por título ou autor..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 glass rounded-xl text-sm text-gray-300 placeholder-gray-600 border border-white/10 transition-all"
              style={{ background: 'rgba(255,255,255,0.03)' }}
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
          <CartDrawer items={cart} onClose={() => setCartOpen(false)} onUpdate={updateQty} onRemove={removeItem} onCheckout={() => { setCheckoutOpen(true); setCartOpen(false); }} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {selectedBook && (
          <BookDetail book={selectedBook} onClose={() => setSelectedBook(null)} onAdd={addToCart} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {checkoutOpen && (
          <CheckoutModal items={cart} onClose={() => setCheckoutOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;