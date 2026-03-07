import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
      LayoutDashboard, BookOpen, ShoppingBag, LogOut, Plus, Pencil, Trash2,
      TrendingUp, Package, DollarSign, AlertTriangle, X, Check, Eye, EyeOff,
      ChevronUp, ChevronDown, Search, ArrowLeft, BarChart2, Settings, KeyRound,
      CreditCard, Store, Shield, Save
} from 'lucide-react';

// ─── TYPES ───────────────────────────────────────────────────────────────────
interface Book {
      id: number; title: string; author: string; price: number;
      originalPrice?: number; category: string; cover: string;
      rating: number; reviews: number; description: string; badge?: string; stock: number;
}

interface Order {
      id: string; customer: string; book: string; amount: number;
      status: 'PAGO' | 'PENDENTE' | 'CANCELADO'; date: string; email: string;
}

interface AdminPanelProps {
      books: Book[];
      onBooksChange: (books: Book[]) => void;
      onExit: () => void;
}

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const MOCK_ORDERS: Order[] = [
      { id: '#4521', customer: 'Maria Silva', book: 'O Poder do Agora', amount: 49.90, status: 'PAGO', date: '07/03/2025', email: 'maria@email.com' },
      { id: '#4520', customer: 'João Santos', book: 'Missão de Vida', amount: 52.90, status: 'PAGO', date: '07/03/2025', email: 'joao@email.com' },
      { id: '#4519', customer: 'Ana Costa', book: 'Almas Gêmeas', amount: 42.90, status: 'PENDENTE', date: '06/03/2025', email: 'ana@email.com' },
      { id: '#4518', customer: 'Carlos Melo', book: 'A Cabana', amount: 39.90, status: 'PAGO', date: '06/03/2025', email: 'carlos@email.com' },
      { id: '#4517', customer: 'Fernanda Lima', book: 'Véus da Eternidade', amount: 44.90, status: 'CANCELADO', date: '05/03/2025', email: 'fernanda@email.com' },
      { id: '#4516', customer: 'Pedro Rocha', book: 'Luz nas Trevas', amount: 35.90, status: 'PAGO', date: '05/03/2025', email: 'pedro@email.com' },
      { id: '#4515', customer: 'Juliana Freitas', book: 'O Jardim do Silêncio', amount: 47.90, status: 'PAGO', date: '04/03/2025', email: 'juliana@email.com' },
      { id: '#4514', customer: 'Bruno Martins', book: 'Além do Horizonte', amount: 54.90, status: 'PENDENTE', date: '04/03/2025', email: 'bruno@email.com' },
];

const MONTHLY_SALES = [
      { month: 'Set', value: 3200 }, { month: 'Out', value: 4100 }, { month: 'Nov', value: 3800 },
      { month: 'Dez', value: 5600 }, { month: 'Jan', value: 4200 }, { month: 'Fev', value: 4900 }, { month: 'Mar', value: 2800 },
];

const CATEGORIES = ['Espiritualidade', 'Ficção Cristã', 'Desenvolvimento Espiritual', 'Fé e Esperança', 'Meditação', 'Amor e Espiritualidade', 'Propósito'];

// Shared mutable password store (persists in module scope during session)
let ADMIN_PASSWORD = localStorage.getItem('admin_password') || 'admin123';

// ─── LOGIN SCREEN ─────────────────────────────────────────────────────────────
const AdminLogin: React.FC<{ onLogin: () => void; onBack: () => void }> = ({ onLogin, onBack }) => {
      const [user, setUser] = useState('');
      const [pass, setPass] = useState('');
      const [showPass, setShowPass] = useState(false);
      const [error, setError] = useState('');
      const [loading, setLoading] = useState(false);

      const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            setLoading(true);
            setTimeout(() => {
                  if (user === 'admin' && pass === ADMIN_PASSWORD) { onLogin(); }
                  else { setError('Credenciais inválidas. Utilizador: admin'); setLoading(false); }
            }, 800);
      };

      return (
            <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#080720' }}>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
                        <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-gray-300 text-sm mb-8 transition-colors">
                              <ArrowLeft size={16} /> Voltar à loja
                        </button>
                        <div className="glass rounded-2xl p-8" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                              <div className="text-center mb-8">
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-900/50">
                                          <LayoutDashboard size={24} className="text-white" />
                                    </div>
                                    <h1 className="font-display text-2xl font-bold text-white">Painel Admin</h1>
                                    <p className="text-gray-500 text-sm mt-1">Além do Véu — Cler Editora</p>
                              </div>
                              <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                          <label className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1.5 block">Utilizador</label>
                                          <input type="text" value={user} onChange={e => setUser(e.target.value)} placeholder="admin"
                                                className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-gray-600 border border-white/10 transition-all"
                                                style={{ background: 'rgba(255,255,255,0.04)' }} />
                                    </div>
                                    <div>
                                          <label className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1.5 block">Senha</label>
                                          <div className="relative">
                                                <input type={showPass ? 'text' : 'password'} value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••"
                                                      className="w-full px-4 py-3 pr-10 rounded-xl text-white text-sm placeholder-gray-600 border border-white/10 transition-all"
                                                      style={{ background: 'rgba(255,255,255,0.04)' }} />
                                                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                                                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                          </div>
                                    </div>
                                    {error && (
                                          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                                                <AlertTriangle size={14} className="text-red-400 flex-shrink-0" />
                                                <p className="text-red-400 text-xs">{error}</p>
                                          </motion.div>
                                    )}
                                    <button type="submit" disabled={loading}
                                          className="w-full py-3.5 rounded-xl font-semibold text-white transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
                                          style={{ background: 'linear-gradient(135deg, #6366f1, #4338ca)' }}>
                                          {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Entrar no Painel'}
                                    </button>
                              </form>
                              <p className="text-center text-xs text-gray-600 mt-6">Utilizador: <span className="text-indigo-400 font-mono">admin</span> — Senha padrão: <span className="text-indigo-400 font-mono">admin123</span></p>
                        </div>
                  </motion.div>
            </div>
      );
};

// ─── SALES CHART ─────────────────────────────────────────────────────────────
const SalesChart: React.FC = () => {
      const max = Math.max(...MONTHLY_SALES.map(d => d.value));
      const w = 520, h = 180, pad = { t: 20, r: 20, b: 40, l: 50 };
      const barW = (w - pad.l - pad.r) / MONTHLY_SALES.length;

      return (
            <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: 180 }}>
                  {[0, 0.25, 0.5, 0.75, 1].map((t) => {
                        const y = pad.t + (h - pad.t - pad.b) * (1 - t);
                        return (
                              <g key={t}>
                                    <line x1={pad.l} x2={w - pad.r} y1={y} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
                                    <text x={pad.l - 6} y={y + 4} textAnchor="end" fontSize={9} fill="rgba(255,255,255,0.25)">
                                          {`R$${((max * t) / 1000).toFixed(1)}k`}
                                    </text>
                              </g>
                        );
                  })}
                  {MONTHLY_SALES.map((d, i) => {
                        const x = pad.l + i * barW + barW * 0.15;
                        const bw = barW * 0.7;
                        const bh = ((h - pad.t - pad.b) * d.value) / max;
                        const by = pad.t + (h - pad.t - pad.b) - bh;
                        const isLast = i === MONTHLY_SALES.length - 1;
                        return (
                              <g key={d.month}>
                                    <defs>
                                          <linearGradient id={`bar-${i}`} x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor={isLast ? '#fbbf24' : '#6366f1'} stopOpacity="0.9" />
                                                <stop offset="100%" stopColor={isLast ? '#d97706' : '#312e81'} stopOpacity="0.6" />
                                          </linearGradient>
                                    </defs>
                                    <rect x={x} y={by} width={bw} height={bh} rx={4} fill={`url(#bar-${i})`} />
                                    {isLast && <rect x={x} y={by} width={bw} height={bh} rx={4} fill="rgba(251,191,36,0.15)" />}
                                    <text x={x + bw / 2} y={h - pad.b + 14} textAnchor="middle" fontSize={9} fill="rgba(255,255,255,0.4)">{d.month}</text>
                                    <text x={x + bw / 2} y={by - 5} textAnchor="middle" fontSize={8} fill={isLast ? '#fbbf24' : 'rgba(255,255,255,0.4)'}>
                                          {`R$${(d.value / 1000).toFixed(1)}k`}
                                    </text>
                              </g>
                        );
                  })}
            </svg>
      );
};

// ─── BOOK FORM MODAL ──────────────────────────────────────────────────────────
const BookFormModal: React.FC<{ book?: Book; onSave: (b: Partial<Book>) => void; onClose: () => void }> = ({ book, onSave, onClose }) => {
      const [form, setForm] = useState({
            title: book?.title || '', author: book?.author || '', price: book?.price?.toString() || '',
            originalPrice: book?.originalPrice?.toString() || '', stock: book?.stock?.toString() || '10',
            category: book?.category || CATEGORIES[0], cover: book?.cover || '',
            description: book?.description || '', badge: book?.badge || '',
      });
      const [errors, setErrors] = useState<Record<string, string>>({});

      const validate = () => {
            const e: Record<string, string> = {};
            if (!form.title.trim()) e.title = 'Título obrigatório';
            if (!form.author.trim()) e.author = 'Autor obrigatório';
            if (!form.price || isNaN(+form.price) || +form.price <= 0) e.price = 'Preço inválido';
            if (!form.cover.trim()) e.cover = 'URL da imagem obrigatória';
            if (!form.description.trim()) e.description = 'Descrição obrigatória';
            setErrors(e);
            return Object.keys(e).length === 0;
      };

      const handleSubmit = () => {
            if (!validate()) return;
            onSave({ ...form, price: +form.price, originalPrice: form.originalPrice ? +form.originalPrice : undefined, stock: +form.stock });
      };

      const Field = ({ label, name, type = 'text', placeholder = '', as = 'input' }: any) => (
            <div>
                  <label className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1.5 block">{label}</label>
                  {as === 'textarea' ? (
                        <textarea value={(form as any)[name]} onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))} placeholder={placeholder} rows={3}
                              className="w-full px-3 py-2.5 rounded-xl text-white text-sm placeholder-gray-600 border border-white/10 resize-none transition-all"
                              style={{ background: 'rgba(255,255,255,0.04)' }} />
                  ) : as === 'select' ? (
                        <select value={(form as any)[name]} onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
                              className="w-full px-3 py-2.5 rounded-xl text-white text-sm border border-white/10 transition-all"
                              style={{ background: '#1a1740' }}>
                              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                  ) : (
                        <input type={type} value={(form as any)[name]} onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))} placeholder={placeholder}
                              className="w-full px-3 py-2.5 rounded-xl text-white text-sm placeholder-gray-600 border border-white/10 transition-all"
                              style={{ background: 'rgba(255,255,255,0.04)' }} />
                  )}
                  {errors[name] && <p className="text-red-400 text-xs mt-1">{errors[name]}</p>}
            </div>
      );

      return (
            <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
                  <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }}
                        className="relative w-full max-w-2xl rounded-2xl overflow-hidden max-h-[90vh] flex flex-col"
                        style={{ background: '#0f0d2e', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <div className="flex items-center justify-between p-5 border-b border-white/10">
                              <h2 className="font-display text-lg font-semibold text-white">{book ? 'Editar Livro' : 'Novo Livro'}</h2>
                              <button onClick={onClose} className="w-7 h-7 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors">
                                    <X size={14} className="text-gray-400" />
                              </button>
                        </div>
                        <div className="overflow-y-auto p-5 space-y-4 flex-1">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Field label="Título" name="title" placeholder="Nome do livro" />
                                    <Field label="Autor" name="author" placeholder="Nome do autor" />
                                    <Field label="Preço (R$)" name="price" type="number" placeholder="49.90" />
                                    <Field label="Preço Original (opcional)" name="originalPrice" type="number" placeholder="69.90" />
                                    <Field label="Estoque" name="stock" type="number" placeholder="10" />
                                    <Field label="Badge (opcional)" name="badge" placeholder="Mais Vendido, Novo..." />
                              </div>
                              <Field label="Categoria" name="category" as="select" />
                              <Field label="URL da Imagem de Capa" name="cover" placeholder="https://..." />
                              <Field label="Descrição" name="description" as="textarea" placeholder="Descrição do livro..." />
                        </div>
                        <div className="flex gap-3 p-5 border-t border-white/10">
                              <button onClick={onClose} className="flex-1 py-2.5 rounded-xl glass text-gray-300 hover:bg-white/10 text-sm font-medium transition-colors">Cancelar</button>
                              <button onClick={handleSubmit} className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold transition-all active:scale-95 flex items-center justify-center gap-2"
                                    style={{ background: 'linear-gradient(135deg, #6366f1, #4338ca)' }}>
                                    <Check size={16} /> {book ? 'Salvar Alterações' : 'Cadastrar Livro'}
                              </button>
                        </div>
                  </motion.div>
            </motion.div>
      );
};

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
const StatusBadge: React.FC<{ status: Order['status'] }> = ({ status }) => {
      const styles = {
            PAGO: 'bg-green-500/15 text-green-400 border-green-500/20',
            PENDENTE: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
            CANCELADO: 'bg-red-500/15 text-red-400 border-red-500/20',
      };
      return (
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>{status}</span>
      );
};

// ─── SETTINGS PAGE ────────────────────────────────────────────────────────────
interface SettingsPageProps {
      currentPassword: string; setCurrentPassword: (v: string) => void;
      newPassword: string; setNewPassword: (v: string) => void;
      confirmNewPassword: string; setConfirmNewPassword: (v: string) => void;
      passwordMessage: { type: 'success' | 'error'; text: string } | null;
      onChangePassword: () => void;
      stripePublicKey: string; setStripePublicKey: (v: string) => void;
      stripeSecretKey: string; setStripeSecretKey: (v: string) => void;
      stripeMessage: { type: 'success' | 'error'; text: string } | null;
      onSaveStripe: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({
      currentPassword, setCurrentPassword, newPassword, setNewPassword,
      confirmNewPassword, setConfirmNewPassword, passwordMessage, onChangePassword,
      stripePublicKey, setStripePublicKey, stripeSecretKey, setStripeSecretKey,
      stripeMessage, onSaveStripe,
}) => {
      const [showCurrent, setShowCurrent] = useState(false);
      const [showNew, setShowNew] = useState(false);
      const [showConfirm, setShowConfirm] = useState(false);
      const [showPub, setShowPub] = useState(false);
      const [showSec, setShowSec] = useState(false);

      const PwInput = ({ label, value, onChange, show, onToggle }: any) => (
            <div>
                  <label className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1.5 block">{label}</label>
                  <div className="relative">
                        <input type={show ? 'text' : 'password'} value={value} onChange={(e: any) => onChange(e.target.value)}
                              className="w-full px-4 py-3 pr-10 rounded-xl text-white text-sm placeholder-gray-600 border border-white/10 transition-all"
                              style={{ background: 'rgba(255,255,255,0.04)' }} />
                        <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                              {show ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                  </div>
            </div>
      );

      return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-2xl">
                  <div>
                        <h1 className="font-display text-2xl font-bold text-white">Configurações</h1>
                        <p className="text-gray-500 text-sm mt-0.5">Segurança e integrações</p>
                  </div>

                  {/* PASSWORD SECTION */}
                  <div className="glass rounded-2xl border border-white/5 overflow-hidden">
                        <div className="flex items-center gap-3 p-5 border-b border-white/5">
                              <div className="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center">
                                    <KeyRound size={15} className="text-indigo-400" />
                              </div>
                              <div>
                                    <h2 className="text-sm font-semibold text-white">Alterar Senha</h2>
                                    <p className="text-xs text-gray-500">Utilizador: <span className="font-mono text-indigo-400">admin</span> — Senha padrão: <span className="font-mono text-indigo-400">admin123</span></p>
                              </div>
                        </div>
                        <div className="p-5 space-y-4">
                              <PwInput label="Senha Atual" value={currentPassword} onChange={setCurrentPassword} show={showCurrent} onToggle={() => setShowCurrent(!showCurrent)} />
                              <PwInput label="Nova Senha (mín. 6 caracteres)" value={newPassword} onChange={setNewPassword} show={showNew} onToggle={() => setShowNew(!showNew)} />
                              <PwInput label="Confirmar Nova Senha" value={confirmNewPassword} onChange={setConfirmNewPassword} show={showConfirm} onToggle={() => setShowConfirm(!showConfirm)} />
                              {passwordMessage && (
                                    <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                                          className={`flex items-center gap-2 p-3 rounded-xl border text-xs ${passwordMessage.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                                          {passwordMessage.type === 'success' ? <Check size={13} /> : <AlertTriangle size={13} />}
                                          {passwordMessage.text}
                                    </motion.div>
                              )}
                              <button onClick={onChangePassword}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all active:scale-95"
                                    style={{ background: 'linear-gradient(135deg, #6366f1, #4338ca)' }}>
                                    <Save size={15} /> Salvar Nova Senha
                              </button>
                        </div>
                  </div>

                  {/* STRIPE SECTION */}
                  <div className="glass rounded-2xl border border-white/5 overflow-hidden">
                        <div className="flex items-center gap-3 p-5 border-b border-white/5">
                              <div className="w-8 h-8 rounded-lg bg-purple-500/15 flex items-center justify-center">
                                    <CreditCard size={15} className="text-purple-400" />
                              </div>
                              <div>
                                    <h2 className="text-sm font-semibold text-white">Configurações Stripe</h2>
                                    <p className="text-xs text-gray-500">Chaves de integração para pagamentos</p>
                              </div>
                        </div>
                        {/* Status banner */}
                        <div className="mx-5 mt-5 flex items-start gap-3 p-4 rounded-xl border border-amber-500/20 bg-amber-500/8">
                              <AlertTriangle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
                              <div>
                                    <p className="text-amber-400 text-xs font-semibold">Stripe requer um backend (Node.js/Next.js)</p>
                                    <p className="text-gray-500 text-xs mt-1">
                                          Este projeto é frontend puro (Vite/React). Para processar pagamentos reais com Stripe precisará de:
                                          <br />1. Um servidor backend para criar <span className="text-amber-400 font-mono">PaymentIntent</span>
                                          <br />2. Um endpoint de Webhook <span className="text-amber-400 font-mono">/api/webhooks/stripe</span>
                                          <br />3. Variáveis de ambiente protegidas (nunca exponha a <span className="text-amber-400 font-mono">sk_</span> no frontend)
                                    </p>
                              </div>
                        </div>
                        <div className="p-5 space-y-4">
                              <div>
                                    <label className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1.5 block">Chave Pública (Publishable Key)</label>
                                    <div className="relative">
                                          <input type={showPub ? 'text' : 'password'} value={stripePublicKey} onChange={e => setStripePublicKey(e.target.value)}
                                                placeholder="pk_test_..." className="w-full px-4 py-3 pr-10 rounded-xl text-white text-sm placeholder-gray-600 border border-white/10 font-mono"
                                                style={{ background: 'rgba(255,255,255,0.04)' }} />
                                          <button type="button" onClick={() => setShowPub(!showPub)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                                                {showPub ? <EyeOff size={15} /> : <Eye size={15} />}
                                          </button>
                                    </div>
                                    <p className="text-xs text-gray-600 mt-1">Começa com <span className="font-mono text-indigo-400">pk_test_</span> (teste) ou <span className="font-mono text-indigo-400">pk_live_</span> (produção)</p>
                              </div>
                              <div>
                                    <label className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1.5 block">Chave Secreta (Secret Key) — Apenas no Backend!</label>
                                    <div className="relative">
                                          <input type={showSec ? 'text' : 'password'} value={stripeSecretKey} onChange={e => setStripeSecretKey(e.target.value)}
                                                placeholder="sk_test_..." className="w-full px-4 py-3 pr-10 rounded-xl text-white text-sm placeholder-gray-600 border border-white/10 font-mono"
                                                style={{ background: 'rgba(255,255,255,0.04)' }} />
                                          <button type="button" onClick={() => setShowSec(!showSec)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                                                {showSec ? <EyeOff size={15} /> : <Eye size={15} />}
                                          </button>
                                    </div>
                                    <p className="text-xs text-gray-600 mt-1">Começa com <span className="font-mono text-indigo-400">sk_test_</span> — <span className="text-red-400">NUNCA exponha no frontend!</span></p>
                              </div>
                              {stripeMessage && (
                                    <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                                          className={`flex items-center gap-2 p-3 rounded-xl border text-xs ${stripeMessage.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                                          {stripeMessage.type === 'success' ? <Check size={13} /> : <AlertTriangle size={13} />}
                                          {stripeMessage.text}
                                    </motion.div>
                              )}
                              <button onClick={onSaveStripe}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all active:scale-95"
                                    style={{ background: 'linear-gradient(135deg, #7c3aed, #4338ca)' }}>
                                    <Save size={15} /> Salvar Configurações Stripe
                              </button>
                        </div>
                  </div>

                  {/* STRIPE GUIDE */}
                  <div className="glass rounded-2xl border border-white/5 p-5">
                        <div className="flex items-center gap-3 mb-4">
                              <div className="w-8 h-8 rounded-lg bg-green-500/15 flex items-center justify-center">
                                    <Shield size={15} className="text-green-400" />
                              </div>
                              <h2 className="text-sm font-semibold text-white">Como Obter as Chaves Stripe</h2>
                        </div>
                        <ol className="space-y-2 text-xs text-gray-400">
                              <li className="flex gap-2"><span className="text-indigo-400 font-bold">1.</span> Acesse <span className="text-indigo-400 font-mono">dashboard.stripe.com</span> e crie uma conta</li>
                              <li className="flex gap-2"><span className="text-indigo-400 font-bold">2.</span> Vá em <span className="font-mono text-amber-400">Developers → API Keys</span></li>
                              <li className="flex gap-2"><span className="text-indigo-400 font-bold">3.</span> Copie a <span className="font-mono text-green-400">Publishable Key</span> (pk_test_...) para o frontend</li>
                              <li className="flex gap-2"><span className="text-indigo-400 font-bold">4.</span> Copie a <span className="font-mono text-red-400">Secret Key</span> (sk_test_...) apenas para variáveis de ambiente do servidor</li>
                              <li className="flex gap-2"><span className="text-indigo-400 font-bold">5.</span> Para ativar os Webhooks, vá em <span className="font-mono text-amber-400">Developers → Webhooks → Add endpoint</span></li>
                        </ol>
                  </div>
            </motion.div>
      );
};

// ─── MAIN ADMIN PANEL ─────────────────────────────────────────────────────────
const AdminPanel: React.FC<AdminPanelProps> = ({ books, onBooksChange, onExit }) => {
      const [page, setPage] = useState<'dashboard' | 'books' | 'orders' | 'settings'>('dashboard');
      const [showForm, setShowForm] = useState(false);
      const [editBook, setEditBook] = useState<Book | undefined>();
      const [search, setSearch] = useState('');
      const [orderSearch, setOrderSearch] = useState('');
      const [sortField, setSortField] = useState<keyof Book>('title');
      const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
      const [deleteId, setDeleteId] = useState<number | null>(null);

      // Settings states
      const [currentPassword, setCurrentPassword] = useState('');
      const [newPassword, setNewPassword] = useState('');
      const [confirmNewPassword, setConfirmNewPassword] = useState('');
      const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

      const [stripePublicKey, setStripePublicKey] = useState(localStorage.getItem('stripe_pub_key') || 'pk_test_COLOQUE_SUA_CHAVE_AQUI');
      const [stripeSecretKey, setStripeSecretKey] = useState(localStorage.getItem('stripe_sec_key') || 'sk_test_COLOQUE_SUA_CHAVE_AQUI');
      const [stripeMessage, setStripeMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);


      const totalRevenue = MOCK_ORDERS.filter(o => o.status === 'PAGO').reduce((s, o) => s + o.amount, 0);
      const todaySales = MOCK_ORDERS.filter(o => o.status === 'PAGO' && o.date === '07/03/2025').reduce((s, o) => s + o.amount, 0);
      const outOfStock = books.filter(b => b.stock <= 0).length;
      const pendingOrders = MOCK_ORDERS.filter(o => o.status === 'PENDENTE').length;

      const handleSort = (field: keyof Book) => {
            if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
            else { setSortField(field); setSortDir('asc'); }
      };

      const filteredBooks = books
            .filter(b => b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase()))
            .sort((a, b) => {
                  const av = a[sortField], bv = b[sortField];
                  const cmp = typeof av === 'string' ? av.localeCompare(bv as string) : (av as number) - (bv as number);
                  return sortDir === 'asc' ? cmp : -cmp;
            });

      const filteredOrders = MOCK_ORDERS.filter(o =>
            o.customer.toLowerCase().includes(orderSearch.toLowerCase()) ||
            o.book.toLowerCase().includes(orderSearch.toLowerCase()) ||
            o.id.includes(orderSearch)
      );

      const handleSave = (data: Partial<Book>) => {
            if (editBook) {
                  onBooksChange(books.map(b => b.id === editBook.id ? { ...b, ...data } : b));
            } else {
                  const newBook: Book = { id: Date.now(), rating: 4.5, reviews: 0, ...data } as Book;
                  onBooksChange([...books, newBook]);
            }
            setShowForm(false); setEditBook(undefined);
      };

      const handleDelete = (id: number) => { onBooksChange(books.filter(b => b.id !== id)); setDeleteId(null); };

      const handleChangePassword = () => {
            setPasswordMessage(null);
            if (currentPassword !== ADMIN_PASSWORD) {
                  setPasswordMessage({ type: 'error', text: 'Senha atual incorreta.' });
                  return;
            }
            if (newPassword.length < 6) {
                  setPasswordMessage({ type: 'error', text: 'Nova senha deve ter pelo menos 6 caracteres.' });
                  return;
            }
            if (newPassword !== confirmNewPassword) {
                  setPasswordMessage({ type: 'error', text: 'Nova senha e confirmação não coincidem.' });
                  return;
            }
            ADMIN_PASSWORD = newPassword;
            localStorage.setItem('admin_password', newPassword);
            setPasswordMessage({ type: 'success', text: 'Senha alterada com sucesso!' });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
      };

      const handleSaveStripeSettings = () => {
            setStripeMessage(null);
            if (!stripePublicKey.startsWith('pk_test_') && !stripePublicKey.startsWith('pk_live_')) {
                  setStripeMessage({ type: 'error', text: 'Chave Pública inválida.' });
                  return;
            }
            if (!stripeSecretKey.startsWith('sk_test_') && !stripeSecretKey.startsWith('sk_live_')) {
                  setStripeMessage({ type: 'error', text: 'Chave Secreta inválida.' });
                  return;
            }

            localStorage.setItem('stripe_pub_key', stripePublicKey);
            localStorage.setItem('stripe_sec_key', stripeSecretKey);

            console.log('Stripe Keys saved to localStorage');
            setStripeMessage({ type: 'success', text: 'Configurações Stripe salvas com sucesso!' });
      };

      const SortIcon = ({ field }: { field: keyof Book }) => (
            <span className="ml-1 opacity-50">{sortField === field ? (sortDir === 'asc' ? <ChevronUp size={12} className="inline" /> : <ChevronDown size={12} className="inline" />) : <ChevronDown size={12} className="inline opacity-30" />}</span>
      );

      const navItems = [
            { key: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { key: 'books', icon: BookOpen, label: 'Livros' },
            { key: 'orders', icon: ShoppingBag, label: 'Pedidos' },
            { key: 'settings', icon: Settings, label: 'Configurações' },
      ];

      return (
            <div className="min-h-screen flex" style={{ background: '#080720' }}>
                  {/* SIDEBAR */}
                  <aside className="w-56 flex-shrink-0 flex flex-col border-r border-white/5" style={{ background: '#0a0820' }}>
                        <div className="p-5 border-b border-white/5">
                              <img src="/logo.png" alt="Logo" style={{ height: 80, width: 'auto' }} />
                              <div className="mt-3 px-2 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 inline-flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                                    <span className="text-xs text-indigo-300 font-medium">Admin</span>
                              </div>
                        </div>
                        <nav className="flex-1 p-3 space-y-1">
                              {navItems.map(({ key, icon: Icon, label }) => (
                                    <button key={key} onClick={() => setPage(key as any)}
                                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${page === key ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                                          <Icon size={16} /> {label}
                                          {key === 'orders' && pendingOrders > 0 && (
                                                <span className="ml-auto w-5 h-5 bg-amber-500 rounded-full text-xs text-white font-bold flex items-center justify-center">{pendingOrders}</span>
                                          )}
                                    </button>
                              ))}
                        </nav>
                        <div className="p-3 border-t border-white/5">
                              <button onClick={onExit} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all font-medium">
                                    <LogOut size={16} /> Sair do Painel
                              </button>
                        </div>
                  </aside>

                  {/* CONTENT */}
                  <main className="flex-1 overflow-auto">
                        <div className="p-6">

                              {/* ── DASHBOARD ── */}
                              {page === 'dashboard' && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                          <div>
                                                <h1 className="font-display text-2xl font-bold text-white">Dashboard</h1>
                                                <p className="text-gray-500 text-sm mt-0.5">Resumo de vendas e catálogo</p>
                                          </div>

                                          {/* STAT CARDS */}
                                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                                {[
                                                      { label: 'Receita Total', value: `R$ ${totalRevenue.toFixed(2).replace('.', ',')}`, icon: DollarSign, color: 'from-green-600 to-emerald-700', change: '+12%' },
                                                      { label: 'Vendas Hoje', value: `R$ ${todaySales.toFixed(2).replace('.', ',')}`, icon: TrendingUp, color: 'from-indigo-600 to-purple-700', change: '+8%' },
                                                      { label: 'Total de Livros', value: books.length.toString(), icon: BookOpen, color: 'from-blue-600 to-cyan-700', change: `${books.length} títulos` },
                                                      { label: 'Esgotados', value: outOfStock.toString(), icon: AlertTriangle, color: 'from-red-600 to-orange-700', change: outOfStock > 0 ? 'Atenção' : 'OK' },
                                                ].map(card => (
                                                      <div key={card.label} className="glass rounded-2xl p-4 border border-white/5">
                                                            <div className="flex items-start justify-between mb-3">
                                                                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                                                                        <card.icon size={16} className="text-white" />
                                                                  </div>
                                                                  <span className="text-xs text-green-400 font-medium">{card.change}</span>
                                                            </div>
                                                            <p className="text-xl font-display font-bold text-white">{card.value}</p>
                                                            <p className="text-xs text-gray-500 mt-0.5">{card.label}</p>
                                                      </div>
                                                ))}
                                          </div>

                                          {/* CHART */}
                                          <div className="glass rounded-2xl p-5 border border-white/5">
                                                <div className="flex items-center justify-between mb-4">
                                                      <div>
                                                            <h3 className="font-semibold text-white flex items-center gap-2"><BarChart2 size={16} className="text-indigo-400" /> Vendas Mensais</h3>
                                                            <p className="text-xs text-gray-500 mt-0.5">Últimos 7 meses</p>
                                                      </div>
                                                      <div className="text-right">
                                                            <p className="text-lg font-bold text-amber-400">R$ 2,8k</p>
                                                            <p className="text-xs text-gray-500">Março (em curso)</p>
                                                      </div>
                                                </div>
                                                <SalesChart />
                                          </div>

                                          {/* RECENT ORDERS */}
                                          <div className="glass rounded-2xl border border-white/5 overflow-hidden">
                                                <div className="flex items-center justify-between p-4 border-b border-white/5">
                                                      <h3 className="font-semibold text-white text-sm">Pedidos Recentes</h3>
                                                      <button onClick={() => setPage('orders')} className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">Ver todos →</button>
                                                </div>
                                                <div className="divide-y divide-white/5">
                                                      {MOCK_ORDERS.slice(0, 5).map(order => (
                                                            <div key={order.id} className="px-4 py-3 flex items-center gap-4 hover:bg-white/2 transition-colors">
                                                                  <div className="flex-1 min-w-0">
                                                                        <div className="flex items-center gap-2">
                                                                              <span className="text-xs font-mono text-gray-500">{order.id}</span>
                                                                              <StatusBadge status={order.status} />
                                                                        </div>
                                                                        <p className="text-sm text-white font-medium mt-0.5 truncate">{order.customer}</p>
                                                                        <p className="text-xs text-gray-500 truncate">{order.book}</p>
                                                                  </div>
                                                                  <div className="text-right flex-shrink-0">
                                                                        <p className="text-sm font-bold text-amber-400">R$ {order.amount.toFixed(2).replace('.', ',')}</p>
                                                                        <p className="text-xs text-gray-600">{order.date}</p>
                                                                  </div>
                                                            </div>
                                                      ))}
                                                </div>
                                          </div>
                                    </motion.div>
                              )}

                              {/* ── SETTINGS ── */}
                              {page === 'settings' && (
                                    <SettingsPage
                                          currentPassword={currentPassword} setCurrentPassword={setCurrentPassword}
                                          newPassword={newPassword} setNewPassword={setNewPassword}
                                          confirmNewPassword={confirmNewPassword} setConfirmNewPassword={setConfirmNewPassword}
                                          passwordMessage={passwordMessage} onChangePassword={handleChangePassword}
                                          stripePublicKey={stripePublicKey} setStripePublicKey={setStripePublicKey}
                                          stripeSecretKey={stripeSecretKey} setStripeSecretKey={setStripeSecretKey}
                                          stripeMessage={stripeMessage} onSaveStripe={handleSaveStripeSettings}
                                    />
                              )}
                              {/* ── BOOKS ── */}
                              {page === 'books' && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                                          <div className="flex items-center justify-between">
                                                <div>
                                                      <h1 className="font-display text-2xl font-bold text-white">Gestão de Livros</h1>
                                                      <p className="text-gray-500 text-sm mt-0.5">{books.length} títulos no catálogo</p>
                                                </div>
                                                <button onClick={() => { setEditBook(undefined); setShowForm(true); }}
                                                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all active:scale-95"
                                                      style={{ background: 'linear-gradient(135deg, #6366f1, #4338ca)' }}>
                                                      <Plus size={16} /> Novo Livro
                                                </button>
                                          </div>
                                          <div className="relative">
                                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                                <input type="text" placeholder="Buscar por título ou autor..." value={search} onChange={e => setSearch(e.target.value)}
                                                      className="w-full pl-9 pr-4 py-2.5 glass rounded-xl text-white text-sm placeholder-gray-600 border border-white/10 max-w-xs"
                                                      style={{ background: 'rgba(255,255,255,0.03)' }} />
                                          </div>
                                          <div className="glass rounded-2xl border border-white/5 overflow-hidden">
                                                <div className="overflow-x-auto">
                                                      <table className="w-full">
                                                            <thead>
                                                                  <tr className="border-b border-white/5">
                                                                        <th className="text-left p-4 text-xs text-gray-500 font-medium uppercase tracking-wider">Capa</th>
                                                                        <th className="text-left p-4 text-xs text-gray-500 font-medium uppercase tracking-wider cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('title')}>Título <SortIcon field="title" /></th>
                                                                        <th className="text-left p-4 text-xs text-gray-500 font-medium uppercase tracking-wider cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('category')}>Categoria <SortIcon field="category" /></th>
                                                                        <th className="text-left p-4 text-xs text-gray-500 font-medium uppercase tracking-wider cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('price')}>Preço <SortIcon field="price" /></th>
                                                                        <th className="text-left p-4 text-xs text-gray-500 font-medium uppercase tracking-wider cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('stock')}>Estoque <SortIcon field="stock" /></th>
                                                                        <th className="text-left p-4 text-xs text-gray-500 font-medium uppercase tracking-wider">Ações</th>
                                                                  </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-white/5">
                                                                  {filteredBooks.map(book => (
                                                                        <tr key={book.id} className="hover:bg-white/2 transition-colors">
                                                                              <td className="p-4">
                                                                                    <img src={book.cover} alt={book.title} className="w-10 h-14 object-cover rounded-lg" />
                                                                              </td>
                                                                              <td className="p-4">
                                                                                    <p className="text-white text-sm font-medium font-display">{book.title}</p>
                                                                                    <p className="text-gray-500 text-xs mt-0.5">{book.author}</p>
                                                                              </td>
                                                                              <td className="p-4">
                                                                                    <span className="text-xs text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">{book.category}</span>
                                                                              </td>
                                                                              <td className="p-4">
                                                                                    <p className="text-amber-400 font-semibold text-sm">R$ {book.price.toFixed(2).replace('.', ',')}</p>
                                                                                    {book.originalPrice && <p className="text-gray-600 text-xs line-through">R$ {book.originalPrice.toFixed(2).replace('.', ',')}</p>}
                                                                              </td>
                                                                              <td className="p-4">
                                                                                    <span className={`text-sm font-semibold ${book.stock <= 0 ? 'text-red-400' : book.stock <= 3 ? 'text-amber-400' : 'text-green-400'}`}>
                                                                                          {book.stock <= 0 ? 'Esgotado' : book.stock}
                                                                                    </span>
                                                                              </td>
                                                                              <td className="p-4">
                                                                                    <div className="flex items-center gap-2">
                                                                                          <button onClick={() => { setEditBook(book); setShowForm(true); }}
                                                                                                className="w-8 h-8 rounded-lg glass flex items-center justify-center hover:bg-indigo-500/20 hover:text-indigo-400 text-gray-500 transition-colors">
                                                                                                <Pencil size={13} />
                                                                                          </button>
                                                                                          <button onClick={() => setDeleteId(book.id)}
                                                                                                className="w-8 h-8 rounded-lg glass flex items-center justify-center hover:bg-red-500/20 hover:text-red-400 text-gray-500 transition-colors">
                                                                                                <Trash2 size={13} />
                                                                                          </button>
                                                                                    </div>
                                                                              </td>
                                                                        </tr>
                                                                  ))}
                                                            </tbody>
                                                      </table>
                                                      {filteredBooks.length === 0 && (
                                                            <div className="text-center py-12"><p className="text-gray-500 text-sm">Nenhum livro encontrado.</p></div>
                                                      )}
                                                </div>
                                          </div>
                                    </motion.div>
                              )}

                              {/* ── ORDERS ── */}
                              {page === 'orders' && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                                          <div>
                                                <h1 className="font-display text-2xl font-bold text-white">Pedidos</h1>
                                                <p className="text-gray-500 text-sm mt-0.5">{MOCK_ORDERS.length} pedidos no total</p>
                                          </div>
                                          <div className="grid grid-cols-3 gap-4">
                                                {[
                                                      { label: 'Pagos', count: MOCK_ORDERS.filter(o => o.status === 'PAGO').length, color: 'text-green-400' },
                                                      { label: 'Pendentes', count: MOCK_ORDERS.filter(o => o.status === 'PENDENTE').length, color: 'text-amber-400' },
                                                      { label: 'Cancelados', count: MOCK_ORDERS.filter(o => o.status === 'CANCELADO').length, color: 'text-red-400' },
                                                ].map(s => (
                                                      <div key={s.label} className="glass rounded-xl p-4 text-center border border-white/5">
                                                            <p className={`text-2xl font-bold font-display ${s.color}`}>{s.count}</p>
                                                            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                                                      </div>
                                                ))}
                                          </div>
                                          <div className="relative">
                                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                                <input type="text" placeholder="Buscar por cliente, livro ou ID..." value={orderSearch} onChange={e => setOrderSearch(e.target.value)}
                                                      className="w-full pl-9 pr-4 py-2.5 glass rounded-xl text-white text-sm placeholder-gray-600 border border-white/10 max-w-xs"
                                                      style={{ background: 'rgba(255,255,255,0.03)' }} />
                                          </div>
                                          <div className="glass rounded-2xl border border-white/5 overflow-hidden">
                                                <table className="w-full">
                                                      <thead>
                                                            <tr className="border-b border-white/5">
                                                                  {['ID', 'Cliente', 'Livro', 'Valor', 'Status', 'Data'].map(h => (
                                                                        <th key={h} className="text-left p-4 text-xs text-gray-500 font-medium uppercase tracking-wider">{h}</th>
                                                                  ))}
                                                            </tr>
                                                      </thead>
                                                      <tbody className="divide-y divide-white/5">
                                                            {filteredOrders.map(order => (
                                                                  <tr key={order.id} className="hover:bg-white/2 transition-colors">
                                                                        <td className="p-4 font-mono text-xs text-gray-400">{order.id}</td>
                                                                        <td className="p-4">
                                                                              <p className="text-white text-sm font-medium">{order.customer}</p>
                                                                              <p className="text-gray-500 text-xs">{order.email}</p>
                                                                        </td>
                                                                        <td className="p-4 text-sm text-gray-300 max-w-[160px] truncate">{order.book}</td>
                                                                        <td className="p-4 text-amber-400 font-semibold text-sm">R$ {order.amount.toFixed(2).replace('.', ',')}</td>
                                                                        <td className="p-4"><StatusBadge status={order.status} /></td>
                                                                        <td className="p-4 text-xs text-gray-500">{order.date}</td>
                                                                  </tr>
                                                            ))}
                                                      </tbody>
                                                </table>
                                          </div>
                                    </motion.div>
                              )}
                        </div>
                  </main>

                  {/* BOOK FORM */}
                  <AnimatePresence>
                        {showForm && <BookFormModal book={editBook} onSave={handleSave} onClose={() => { setShowForm(false); setEditBook(undefined); }} />}
                  </AnimatePresence>

                  {/* DELETE CONFIRM */}
                  <AnimatePresence>
                        {deleteId !== null && (
                              <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setDeleteId(null)} />
                                    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                                          className="relative glass rounded-2xl p-6 w-full max-w-sm text-center border border-white/10">
                                          <div className="w-12 h-12 rounded-full bg-red-500/15 flex items-center justify-center mx-auto mb-4">
                                                <Trash2 size={20} className="text-red-400" />
                                          </div>
                                          <h3 className="font-display text-lg font-bold text-white">Confirmar remoção</h3>
                                          <p className="text-gray-400 text-sm mt-2 mb-5">Este livro será removido do catálogo permanentemente.</p>
                                          <div className="flex gap-3">
                                                <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl glass text-gray-300 hover:bg-white/10 text-sm font-medium transition-colors">Cancelar</button>
                                                <button onClick={() => handleDelete(deleteId!)} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition-colors">Remover</button>
                                          </div>
                                    </motion.div>
                              </motion.div>
                        )}
                  </AnimatePresence>
            </div>
      );
};

export { AdminPanel, AdminLogin };
