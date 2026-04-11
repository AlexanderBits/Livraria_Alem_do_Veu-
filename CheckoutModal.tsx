import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, CreditCard, Check, AlertTriangle, ChevronRight, ShieldCheck, RefreshCw, Sparkles } from 'lucide-react';

// ─── TYPES ───────────────────────────────────────────────────────────────────
interface CartItem {
      id: number; title: string; price: number; qty: number; cover: string;
}

interface CheckoutModalProps {
      items: CartItem[];
      isSubscription?: boolean;
      onSuccess: () => void;
      onClose: () => void;
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const luhnCheck = (num: string): boolean => {
      const digits = num.replace(/\D/g, '');
      let sum = 0;
      let isEven = false;
      for (let i = digits.length - 1; i >= 0; i--) {
            let d = parseInt(digits[i], 10);
            if (isEven) { d *= 2; if (d > 9) d -= 9; }
            sum += d;
            isEven = !isEven;
      }
      return sum % 10 === 0 && digits.length >= 13;
};

const detectCardType = (num: string): { type: string; color: string } => {
      const n = num.replace(/\s/g, '');
      if (/^4/.test(n)) return { type: 'Visa', color: '#1a1f71' };
      if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return { type: 'Mastercard', color: '#eb001b' };
      if (/^3[47]/.test(n)) return { type: 'Amex', color: '#007bc1' };
      return { type: '', color: '' };
};

const formatCardNumber = (val: string): string => {
      const digits = val.replace(/\D/g, '').slice(0, 16);
      return digits.replace(/(.{4})/g, '$1 ').trim();
};

const formatExpiry = (val: string): string => {
      const digits = val.replace(/\D/g, '').slice(0, 4);
      if (digits.length >= 2) return digits.slice(0, 2) + '/' + digits.slice(2);
      return digits;
};

const TEST_CARDS = [
      { number: '4242 4242 4242 4242', label: 'Pagamento aprovado', color: 'text-green-400', icon: '✓' },
      { number: '4000 0000 0000 0002', label: 'Cartão recusado', color: 'text-red-400', icon: '✗' },
      { number: '4000 0025 2000 3155', label: 'Requer autenticação 3D', color: 'text-amber-400', icon: '⚠' },
];

// ─── CARD VISUAL ──────────────────────────────────────────────────────────────
const CardVisual: React.FC<{ number: string; name: string; expiry: string; flipped: boolean }> = ({ number, name, expiry, flipped }) => {
      const cardType = detectCardType(number);
      const displayNum = number.padEnd(19, '·').replace(/X/g, '·');

      return (
            <div className="relative w-full max-w-xs mx-auto" style={{ height: 160, perspective: 1000 }}>
                  <motion.div style={{ position: 'relative', width: '100%', height: '100%', transformStyle: 'preserve-3d' }}
                        animate={{ rotateY: flipped ? 180 : 0 }} transition={{ duration: 0.5, type: 'spring', stiffness: 120 }}>
                        {/* FRONT */}
                        <div style={{ backfaceVisibility: 'hidden', position: 'absolute', inset: 0 }}>
                              <div className="w-full h-full rounded-2xl p-5 flex flex-col justify-between shadow-2xl"
                                    style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)' }}>
                                    <div className="flex justify-between items-start">
                                          <div className="w-8 h-5 rounded bg-amber-400/80 flex items-center justify-center">
                                                <div className="w-5 h-5 rounded-full border border-amber-400/60 opacity-60 absolute" style={{ left: 20, width: 16, height: 16 }} />
                                                <svg viewBox="0 0 32 20" className="w-full h-full" fill="none">
                                                      <rect x="1" y="6" width="12" height="8" rx="1" fill="#fbbf24" />
                                                      <rect x="8" y="6" width="12" height="8" rx="1" fill="#f59e0b" opacity="0.8" />
                                                      <rect x="15" y="6" width="12" height="8" rx="1" fill="#d97706" />
                                                </svg>
                                          </div>
                                          <div className="text-right">
                                                {cardType.type && <span className="text-xs text-white/70 font-bold tracking-widest">{cardType.type.toUpperCase()}</span>}
                                          </div>
                                    </div>
                                    <div>
                                          <p className="font-mono text-white text-base tracking-[0.2em] mb-3">
                                                {displayNum || '•••• •••• •••• ••••'}
                                          </p>
                                          <div className="flex justify-between items-end">
                                                <div>
                                                      <p className="text-white/40 text-[9px] uppercase tracking-wider">Titular</p>
                                                      <p className="text-white text-xs font-medium tracking-wider uppercase">{name || 'NOME DO TITULAR'}</p>
                                                </div>
                                                <div className="text-right">
                                                      <p className="text-white/40 text-[9px] uppercase tracking-wider">Validade</p>
                                                      <p className="text-white text-xs font-mono">{expiry || 'MM/AA'}</p>
                                                </div>
                                          </div>
                                    </div>
                              </div>
                        </div>
                        {/* BACK */}
                        <div style={{ backfaceVisibility: 'hidden', position: 'absolute', inset: 0, transform: 'rotateY(180deg)' }}>
                              <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl"
                                    style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)' }}>
                                    <div className="bg-gray-800 w-full h-10 mt-8" />
                                    <div className="px-5 mt-4">
                                          <div className="flex items-center gap-3">
                                                <div className="flex-1 h-8 bg-white/10 rounded flex items-center justify-end px-3">
                                                      <span className="font-mono text-white/70 text-sm">•••</span>
                                                </div>
                                                <div className="text-white/40 text-xs">CVV</div>
                                          </div>
                                    </div>
                              </div>
                        </div>
                  </motion.div>
            </div>
      );
};

// ─── MAIN CHECKOUT ────────────────────────────────────────────────────────────
type Step = 'form' | 'processing' | 'success' | 'error' | 'auth3d';

const CheckoutModal: React.FC<CheckoutModalProps> = ({ items, isSubscription, onSuccess, onClose }) => {
      const [step, setStep] = useState<Step>('form');
      const [cardNumber, setCardNumber] = useState('');
      const [cardName, setCardName] = useState('');
      const [expiry, setExpiry] = useState('');
      const [cvv, setCvv] = useState('');
      const [email, setEmail] = useState('');
      const [errors, setErrors] = useState<Record<string, string>>({});
      const [cardFlipped, setCardFlipped] = useState(false);
      const [saveCard, setSaveCard] = useState(false);
      const [processingProgress, setProcessingProgress] = useState(0);

      const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
      const shipping = isSubscription || subtotal >= 150 ? 0 : 19.90;
      const total = isSubscription ? 59.90 : (subtotal + shipping);

      // Simulate processing progress
      useEffect(() => {
            if (step !== 'processing') return;
            setProcessingProgress(0);
            const interval = setInterval(() => {
                  setProcessingProgress(p => {
                        if (p >= 100) { clearInterval(interval); return 100; }
                        return p + Math.random() * 15;
                  });
            }, 200);
            return () => clearInterval(interval);
      }, [step]);

      const validate = () => {
            const e: Record<string, string> = {};
            const rawNum = cardNumber.replace(/\s/g, '');
            if (!email.includes('@')) e.email = 'Email inválido';
            if (rawNum.length < 16) e.cardNumber = 'Número incompleto';
            else if (!luhnCheck(rawNum)) e.cardNumber = 'Número de cartão inválido';
            if (!cardName.trim() || cardName.trim().split(' ').length < 2) e.cardName = 'Digite o nome completo';
            const [mm, yy] = expiry.split('/');
            if (!mm || !yy || +mm < 1 || +mm > 12) e.expiry = 'Data inválida';
            else {
                  const now = new Date();
                  const expDate = new Date(2000 + +yy, +mm - 1);
                  if (expDate < now) e.expiry = 'Cartão expirado';
            }
            if (!cvv || cvv.length < 3) e.cvv = 'CVV inválido';
            setErrors(e);
            return Object.keys(e).length === 0;
      };

      const handlePay = async () => {
            if (!validate()) return;
            setStep('processing');

            try {
                  const response = await fetch('http://localhost:5000/api/create-preference', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                              items: items,
                              isSubscription: isSubscription,
                              email: email
                        })
                  });
                  const data = await response.json();
                  
                  if (data.init_point) {
                        setProcessingProgress(100);
                        // Pequeno delay para o usuário ver o progresso finalizando
                        setTimeout(() => {
                            window.location.href = data.init_point;
                        }, 500);
                        return;
                  }
                  
                  throw new Error('Prefrence creation failed');
            } catch (err) {
                  console.error("Erro ao conectar com o Mercado Pago:", err);
                  setStep('error');
            }
      };


      const handleSuccessClose = () => {
            onSuccess();
            onClose();
      };

      const inputClass = (field: string) =>
            `w-full px-3 py-2.5 rounded-xl text-white text-sm placeholder-gray-600 border transition-all outline-none ${errors[field] ? 'border-red-500/50 bg-red-500/5' : 'border-white/10 focus:border-indigo-500/50'}`
      const inputStyle = { background: 'rgba(255,255,255,0.04)' };

      return (
            <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="absolute inset-0 bg-black/85 backdrop-blur-xl" onClick={step === 'form' ? onClose : undefined} />
                  <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg rounded-3xl overflow-hidden max-h-[95vh] flex flex-col"
                        style={{ background: '#0d0b26', border: '1px solid rgba(255,255,255,0.08)' }}>

                        {/* ── FORM ── */}
                        {step === 'form' && (
                              <>
                                    <div className="flex items-center justify-between p-5 border-b border-white/5">
                                          <div>
                                                <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
                                                      <Lock size={16} className="text-indigo-400" /> {isSubscription ? 'Ativar Assinatura' : 'Checkout Seguro'}
                                                </h2>
                                                <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                                                      <ShieldCheck size={10} className="text-green-400" /> Pagamento processado por Mercado Pago
                                                </p>
                                          </div>
                                          <button onClick={onClose} className="w-8 h-8 rounded-xl glass flex items-center justify-center hover:bg-white/10 transition-colors">
                                                <X size={15} className="text-gray-400" />
                                          </button>
                                    </div>

                                    <div className="overflow-y-auto flex-1">
                                          {/* CARD VISUAL */}
                                          <div className="p-5 pb-3">
                                                <CardVisual number={cardNumber} name={cardName} expiry={expiry} flipped={cardFlipped} />
                                          </div>

                                          {/* TEST CARDS */}
                                          <div className="px-5 pb-3">
                                                <p className="text-xs text-gray-500 mb-2 font-medium">Cartões de teste:</p>
                                                <div className="space-y-1">
                                                      {TEST_CARDS.map(tc => (
                                                            <button key={tc.number} onClick={() => setCardNumber(tc.number)}
                                                                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-left">
                                                                  <span className={`text-xs font-bold w-4 ${tc.color}`}>{tc.icon}</span>
                                                                  <span className="font-mono text-xs text-gray-400">{tc.number}</span>
                                                                  <span className={`text-xs ml-auto ${tc.color}`}>{tc.label}</span>
                                                            </button>
                                                      ))}
                                                </div>
                                          </div>

                                          <div className="px-5 space-y-4 pb-5">
                                                {/* EMAIL */}
                                                <div>
                                                      <label className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1.5 block">Email</label>
                                                      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com"
                                                            className={inputClass('email')} style={inputStyle} />
                                                      {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                                                </div>

                                                {/* CARD NUMBER */}
                                                <div>
                                                      <label className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1.5 block flex items-center gap-2">
                                                            Número do Cartão
                                                            {detectCardType(cardNumber).type && (
                                                                  <span className="px-1.5 py-0.5 rounded text-xs font-bold bg-indigo-500/20 text-indigo-400">{detectCardType(cardNumber).type}</span>
                                                            )}
                                                      </label>
                                                      <div className="relative">
                                                            <input type="text" value={cardNumber} inputMode="numeric"
                                                                  onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                                                                  placeholder="4242 4242 4242 4242" maxLength={19}
                                                                  className={`${inputClass('cardNumber')} pr-10 font-mono`} style={inputStyle} />
                                                            <CreditCard size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600" />
                                                      </div>
                                                      {errors.cardNumber && <p className="text-red-400 text-xs mt-1">{errors.cardNumber}</p>}
                                                </div>

                                                {/* NAME */}
                                                <div>
                                                      <label className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1.5 block">Nome no Cartão</label>
                                                      <input type="text" value={cardName} onChange={e => setCardName(e.target.value.toUpperCase())}
                                                            placeholder="NOME COMPLETO" className={inputClass('cardName')} style={inputStyle} />
                                                      {errors.cardName && <p className="text-red-400 text-xs mt-1">{errors.cardName}</p>}
                                                </div>

                                                {/* EXPIRY + CVV */}
                                                <div className="grid grid-cols-2 gap-3">
                                                      <div>
                                                            <label className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1.5 block">Validade</label>
                                                            <input type="text" value={expiry} inputMode="numeric"
                                                                  onChange={e => setExpiry(formatExpiry(e.target.value))}
                                                                  placeholder="MM/AA" maxLength={5}
                                                                  className={`${inputClass('expiry')} font-mono`} style={inputStyle} />
                                                            {errors.expiry && <p className="text-red-400 text-xs mt-1">{errors.expiry}</p>}
                                                      </div>
                                                      <div>
                                                            <label className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1.5 block">CVV</label>
                                                            <input type="text" value={cvv} inputMode="numeric"
                                                                  onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                                                  onFocus={() => setCardFlipped(true)} onBlur={() => setCardFlipped(false)}
                                                                  placeholder="•••" maxLength={4}
                                                                  className={`${inputClass('cvv')} font-mono`} style={inputStyle} />
                                                            {errors.cvv && <p className="text-red-400 text-xs mt-1">{errors.cvv}</p>}
                                                      </div>
                                                </div>

                                                {/* SAVE CARD */}
                                                <button onClick={() => setSaveCard(!saveCard)} className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300 transition-colors">
                                                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${saveCard ? 'bg-indigo-600 border-indigo-600' : 'border-white/20'}`}>
                                                            {saveCard && <Check size={10} className="text-white" />}
                                                      </div>
                                                      Salvar cartão para próximas compras
                                                </button>

                                                {/* ORDER SUMMARY */}
                                                <div className="glass rounded-2xl p-4 border border-white/5">
                                                      <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-3">
                                                            {isSubscription ? 'Resumo da Assinatura' : 'Resumo do Pedido'}
                                                      </p>
                                                      
                                                      {isSubscription ? (
                                                            <div className="flex items-center gap-3 mb-2">
                                                                  <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                                                                        <Sparkles size={20} />
                                                                  </div>
                                                                  <div className="flex-1">
                                                                        <p className="text-white text-xs font-bold font-display">Clube Além do Véu — Mensal</p>
                                                                        <p className="text-gray-500 text-[10px]">Lançamento do mês + Benefícios</p>
                                                                  </div>
                                                                  <p className="text-amber-400 text-sm font-semibold">R$ 59,90</p>
                                                            </div>
                                                      ) : (
                                                            items.map(item => (
                                                                  <div key={item.id} className="flex items-center gap-3 mb-2">
                                                                        <img src={item.cover} alt={item.title} className="w-8 h-11 object-cover rounded" />
                                                                        <div className="flex-1 min-w-0">
                                                                              <p className="text-white text-xs font-medium truncate">{item.title}</p>
                                                                              <p className="text-gray-500 text-xs">x{item.qty}</p>
                                                                        </div>
                                                                        <p className="text-amber-400 text-sm font-semibold flex-shrink-0">R$ {(item.price * item.qty).toFixed(2).replace('.', ',')}</p>
                                                                  </div>
                                                            ))
                                                      )}
                                                      <div className="border-t border-white/5 mt-3 pt-3 space-y-1">
                                                            {!isSubscription && (
                                                                  <>
                                                                        <div className="flex justify-between text-xs text-gray-500"><span>Subtotal</span><span>R$ {subtotal.toFixed(2).replace('.', ',')}</span></div>
                                                                        <div className="flex justify-between text-xs"><span className="text-gray-500">Frete</span><span className={shipping === 0 ? 'text-green-400' : 'text-gray-400'}>{shipping === 0 ? 'Grátis' : `R$ ${shipping.toFixed(2).replace('.', ',')}`}</span></div>
                                                                  </>
                                                            )}
                                                            <div className="flex justify-between font-bold text-sm pt-1 border-t border-white/5 mt-1">
                                                                  <span className="text-white">Total</span>
                                                                  <span className="text-amber-400">R$ {total.toFixed(2).replace('.', ',')} /mês</span>
                                                            </div>
                                                      </div>
                                                </div>
                                          </div>
                                    </div>

                                    <div className="p-5 border-t border-white/5">
                                          <button onClick={handlePay}
                                                className="w-full py-3.5 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all active:scale-95 hover:opacity-90"
                                                style={{ background: 'linear-gradient(135deg, #6366f1, #4338ca)' }}>
                                                <Lock size={15} />
                                                Pagar R$ {total.toFixed(2).replace('.', ',')} com segurança
                                                <ChevronRight size={15} />
                                          </button>
                                          <p className="text-center text-xs text-gray-600 mt-2 flex items-center justify-center gap-1">
                                                <ShieldCheck size={10} /> Ambiente seguro Mercado Pago
                                          </p>
                                    </div>
                              </>
                        )}

                        {/* ── PROCESSING ── */}
                        {step === 'processing' && (
                              <div className="p-10 flex flex-col items-center justify-center min-h-80 gap-6">
                                    <div className="relative w-20 h-20">
                                          <div className="absolute inset-0 rounded-full border-4 border-indigo-900" />
                                          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 80 80">
                                                <circle cx="40" cy="40" r="36" fill="none" stroke="#6366f1" strokeWidth="4"
                                                      strokeDasharray={`${Math.min(processingProgress, 100) * 2.26} 226`}
                                                      strokeLinecap="round" style={{ transition: 'stroke-dasharray 0.2s' }} />
                                          </svg>
                                          <div className="absolute inset-0 flex items-center justify-center">
                                                <RefreshCw size={24} className="text-indigo-400 animate-spin" />
                                          </div>
                                    </div>
                                    <div className="text-center">
                                          <p className="text-white font-display text-xl font-bold">A processar pagamento</p>
                                          <p className="text-gray-500 text-sm mt-2">
                                                {processingProgress < 40 ? 'Validando dados do cartão...' :
                                                      processingProgress < 70 ? 'Comunicando com gateway...' :
                                                            processingProgress < 90 ? 'Aguardando autorização...' : 'A finalizar...'}
                                          </p>
                                    </div>
                                    <div className="w-full max-w-xs bg-white/5 rounded-full h-1.5 overflow-hidden">
                                          <motion.div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                                                style={{ width: `${Math.min(processingProgress, 100)}%` }} />
                                    </div>
                              </div>
                        )}

                        {/* ── SUCCESS ── */}
                        {step === 'success' && (
                              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-10 flex flex-col items-center text-center gap-5 min-h-80 justify-center">
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5, delay: 0.1 }}
                                          className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-900/50">
                                          <Check size={36} className="text-white" strokeWidth={3} />
                                    </motion.div>
                                    <div>
                                          <h2 className="font-display text-2xl font-bold text-white">{isSubscription ? 'Assinatura Ativada!' : 'Pagamento Aprovado!'}</h2>
                                          <p className="text-gray-400 text-sm mt-2">
                                                {isSubscription 
                                                      ? 'Bem-vindo ao Clube Além do Véu. Você receberá seu primeiro box em breve!' 
                                                      : 'Obrigado pela sua compra. Você receberá um email de confirmação em breve.'}
                                          </p>
                                    </div>
                                    <div className="glass rounded-2xl p-4 border border-white/5 w-full text-left">
                                          <p className="text-xs text-gray-500 mb-2">Detalhes do pedido</p>
                                          <div className="flex justify-between text-sm">
                                                <span className="text-gray-400">Total pago</span>
                                                <span className="text-green-400 font-bold">R$ {total.toFixed(2).replace('.', ',')}</span>
                                          </div>
                                          <div className="flex justify-between text-sm mt-1">
                                                <span className="text-gray-400">Código de confirmação</span>
                                                <span className="text-white font-mono text-xs">#{Math.random().toString(36).slice(2, 10).toUpperCase()}</span>
                                          </div>
                                          <div className="mt-2 flex items-center gap-1.5 text-xs text-green-400">
                                                <ShieldCheck size={12} /> Pagamento verificado via Mercado Pago
                                          </div>
                                    </div>
                                    <button onClick={handleSuccessClose}
                                          className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all active:scale-95"
                                          style={{ background: 'linear-gradient(135deg, #059669, #047857)' }}>
                                          Concluir
                                    </button>
                              </motion.div>
                        )}

                        {/* ── ERROR ── */}
                        {step === 'error' && (
                              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-10 flex flex-col items-center text-center gap-5 min-h-80 justify-center">
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5, delay: 0.1 }}
                                          className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-900/50">
                                          <X size={36} className="text-white" strokeWidth={3} />
                                    </motion.div>
                                    <div>
                                          <h2 className="font-display text-2xl font-bold text-white">Pagamento Recusado</h2>
                                          <p className="text-gray-400 text-sm mt-2">O seu cartão foi recusado. Verifique os dados ou tente outro cartão.</p>
                                    </div>
                                    <div className="glass rounded-2xl p-4 border border-red-500/10 w-full text-left">
                                          <p className="text-xs text-red-400 font-mono">Erro: card_declined</p>
                                          <p className="text-xs text-gray-500 mt-1">Código: generic_decline — O banco recusou a transação.</p>
                                    </div>
                                    <div className="flex gap-3 w-full">
                                          <button onClick={onClose} className="flex-1 py-3 rounded-xl glass text-gray-300 hover:bg-white/10 text-sm font-medium transition-colors">Cancelar</button>
                                          <button onClick={() => setStep('form')}
                                                className="flex-1 py-3 rounded-xl text-white font-semibold text-sm transition-all active:scale-95"
                                                style={{ background: 'linear-gradient(135deg, #6366f1, #4338ca)' }}>
                                                Tentar Novamente
                                          </button>
                                    </div>
                              </motion.div>
                        )}

                        {/* ── 3D SECURE ── */}
                        {step === 'auth3d' && (
                              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 flex flex-col items-center text-center gap-5 min-h-80 justify-center">
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5, delay: 0.1 }}
                                          className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-900/50">
                                          <ShieldCheck size={36} className="text-white" />
                                    </motion.div>
                                    <div>
                                          <h2 className="font-display text-xl font-bold text-white">Autenticação 3D Secure</h2>
                                          <p className="text-gray-400 text-sm mt-2">O seu banco solicitou uma verificação adicional de segurança.</p>
                                    </div>
                                    <div className="glass rounded-2xl p-4 border border-amber-500/10 w-full text-left">
                                          <p className="text-xs text-amber-400 font-semibold mb-2">Simulação de autenticação bancária</p>
                                          <p className="text-xs text-gray-500">Em produção, o utilizador seria redirecionado para a página de autenticação do banco.</p>
                                    </div>
                                    <div className="flex gap-3 w-full">
                                          <button onClick={() => setStep('error')} className="flex-1 py-3 rounded-xl glass text-red-400 hover:bg-red-500/10 text-sm font-medium transition-colors">Rejeitar</button>
                                          <button onClick={() => setStep('success')}
                                                className="flex-1 py-3 rounded-xl text-white font-semibold text-sm transition-all active:scale-95"
                                                style={{ background: 'linear-gradient(135deg, #d97706, #b45309)' }}>
                                                ✓ Aprovar (simular)
                                          </button>
                                    </div>
                              </motion.div>
                        )}
                  </motion.div>
            </motion.div>
      );
};

export default CheckoutModal;
