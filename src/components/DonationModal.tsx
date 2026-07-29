import React, { useState } from 'react';
import { X, Heart, Check, Copy, Smartphone, QrCode, Building2, Wallet } from 'lucide-react';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  authorName?: string;
  onDonationSuccess: (amount: number) => void;
}

export const DonationModal: React.FC<DonationModalProps> = ({
  isOpen,
  onClose,
  authorName = 'कथा चौतारी टोली',
  onDonationSuccess,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'esewa' | 'fonepay' | 'bank'>('esewa');
  const [amount, setAmount] = useState<number>(100);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [transactionRef, setTransactionRef] = useState('');
  const [isDone, setIsDone] = useState(false);

  const ESEWA_NUMBER = '9818700478';
  const BANK_ACCOUNT = '01201009818700';

  if (!isOpen) return null;

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const finalAmount = customAmount ? parseInt(customAmount) || amount : amount;

  const handleDonate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDone(true);
    setTimeout(() => {
      onDonationSuccess(finalAmount);
      setIsDone(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg bg-gradient-to-b from-slate-900 via-slate-950 to-rose-950/80 border border-rose-500/30 rounded-3xl shadow-2xl p-6 relative space-y-5 max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full glass hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!isDone ? (
          <form onSubmit={handleDonate} className="space-y-5">
            
            {/* HEADER */}
            <div className="text-center space-y-2 pt-1">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-rose-600/30 text-rose-300 border border-rose-500/40 flex items-center justify-center text-3xl shadow-xl shadow-rose-500/20">
                💖
              </div>
              <h3 className="text-xl font-black text-white">
                सहयोग / डोनेसन (Donation)
              </h3>
              <p className="text-xs text-gray-300 max-w-sm mx-auto">
                <span className="text-amber-300 font-bold">{authorName}</span> तथा कथा चौतारीको श्रीवृद्धिका लागि मनपर्ने माध्यमबाट सहयोग गर्नुहोस्।
              </p>
            </div>

            {/* PAYMENT METHOD SELECTOR */}
            <div className="space-y-2">
              <label className="block text-xs font-extrabold text-gray-300">
                भुक्तानी माध्यम (Select Payment Method):
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('esewa')}
                  className={`p-3 rounded-2xl text-xs font-black border transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    paymentMethod === 'esewa'
                      ? 'bg-emerald-600 text-white border-amber-300 shadow-lg ring-2 ring-emerald-400/50 scale-[1.02]'
                      : 'bg-black/40 text-gray-300 border-white/10 hover:border-emerald-400/40'
                  }`}
                >
                  <Wallet className="w-5 h-5 text-emerald-300" />
                  <span className="text-xs font-extrabold">eSewa</span>
                  <span className="text-[10px] opacity-80">इसेवा डिजिटल</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('fonepay')}
                  className={`p-3 rounded-2xl text-xs font-black border transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    paymentMethod === 'fonepay'
                      ? 'bg-rose-600 text-white border-amber-300 shadow-lg ring-2 ring-rose-400/50 scale-[1.02]'
                      : 'bg-black/40 text-gray-300 border-white/10 hover:border-rose-400/40'
                  }`}
                >
                  <QrCode className="w-5 h-5 text-rose-300" />
                  <span className="text-xs font-extrabold">FonePay / QR</span>
                  <span className="text-[10px] opacity-80">मोबाईल बैंकिङ</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank')}
                  className={`p-3 rounded-2xl text-xs font-black border transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                    paymentMethod === 'bank'
                      ? 'bg-blue-600 text-white border-amber-300 shadow-lg ring-2 ring-blue-400/50 scale-[1.02]'
                      : 'bg-black/40 text-gray-300 border-white/10 hover:border-blue-400/40'
                  }`}
                >
                  <Building2 className="w-5 h-5 text-blue-300" />
                  <span className="text-xs font-extrabold">बैंक ट्रान्सफर</span>
                  <span className="text-[10px] opacity-80">Direct Deposit</span>
                </button>
              </div>
            </div>

            {/* DETAILS BOX BASED ON PAYMENT METHOD */}
            {paymentMethod === 'esewa' && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/70 to-black border border-emerald-500/50 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-300 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4" />
                    आधिकारिक eSewa ID:
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-400 text-black px-2 py-0.5 rounded-full">
                    Direct Send Money
                  </span>
                </div>

                <div className="flex items-center justify-between bg-black/80 p-3 rounded-xl border border-emerald-500/30">
                  <div>
                    <div className="text-xl font-black font-mono text-amber-300 tracking-wider">
                      {ESEWA_NUMBER}
                    </div>
                    <div className="text-[11px] text-gray-300">
                      खाताको नाम: <span className="text-white font-bold">कथा चौतारी (Katha Chautari)</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopyText(ESEWA_NUMBER)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-300" />
                        <span>कपी भयो!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>ID कपी गर्नुहोस्</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {paymentMethod === 'fonepay' && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-950/70 to-black border border-rose-500/50 shadow-xl space-y-3 text-center">
                <QrCode className="w-10 h-10 text-rose-400 mx-auto" />
                <div className="space-y-1">
                  <p className="text-xs font-black text-rose-300">FonePay / मोबाईल बैंकिङ QR</p>
                  <p className="text-[11px] text-gray-300">
                    कुनै पनि मोबाईल बैंकिङ एप (Global IME, Nabil, NIC Asia, etc.) बाट <span className="text-amber-300 font-bold">९८१८७००४७८</span> मा QR वा सोझै पठाउनुहोस्।
                  </p>
                </div>
              </div>
            )}

            {paymentMethod === 'bank' && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-950/70 to-black border border-blue-500/50 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-blue-300 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4" />
                    बैंक खाता विवरण (Bank Details):
                  </span>
                </div>

                <div className="space-y-1 text-xs text-gray-200 bg-black/80 p-3 rounded-xl border border-blue-500/30">
                  <p>बैंक: <span className="font-bold text-white">राष्ट्रिय वाणिज्य बैंक</span></p>
                  <p>खाता नाम: <span className="font-bold text-white">कथा चौतारी (Katha Chautari)</span></p>
                  <p className="flex items-center justify-between pt-1">
                    <span>खाता नं: <span className="font-mono font-bold text-amber-300">{BANK_ACCOUNT}</span></span>
                    <button
                      type="button"
                      onClick={() => handleCopyText(BANK_ACCOUNT)}
                      className="px-2 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] cursor-pointer"
                    >
                      {copied ? 'कपी भयो!' : 'कपी'}
                    </button>
                  </p>
                </div>
              </div>
            )}

            {/* AMOUNT SELECTOR */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-300">
                सहयोग रकम छान्नुहोस् (NPR):
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[50, 100, 250, 500].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setAmount(amt);
                      setCustomAmount('');
                    }}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      amount === amt && !customAmount
                        ? 'bg-amber-500 text-black border-amber-400 shadow-md font-black scale-105'
                        : 'bg-black/40 text-gray-300 border-white/10 hover:border-amber-400/50'
                    }`}
                  >
                    रु. {amt}
                  </button>
                ))}
              </div>

              <div className="pt-1">
                <input
                  type="number"
                  placeholder="अथवा अन्य रकम राख्नुहोस् (उदा. 1000)"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                />
              </div>
            </div>

            {/* OPTIONAL TRANSACTION NOTE */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-300">
                ट्रान्ज्याक्सन रिफरेन्स वा शुभकामना सन्देश (वैकल्पिक):
              </label>
              <input
                type="text"
                placeholder="उदा. eSewa / FonePay Txn ID वा शुभकामना..."
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/15 text-white text-xs outline-none focus:border-amber-400"
              />
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-black font-black text-xs shadow-xl cursor-pointer transition-transform hover:scale-[1.01] flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4 fill-current text-rose-950" />
              <span>रु. {finalAmount} डोनेसन पुष्टि गर्नुहोस्</span>
            </button>
          </form>
        ) : (
          <div className="text-center py-8 space-y-4 animate-fadeIn">
            <div className="w-20 h-20 mx-auto rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center justify-center text-4xl shadow-xl animate-bounce">
              💖
            </div>
            <h3 className="text-xl font-black text-white">हार्दिक धन्यवाद!</h3>
            <p className="text-xs text-gray-300 leading-relaxed max-w-sm mx-auto">
              तपाईंको रु. <span className="text-amber-300 font-bold">{finalAmount}</span> को अमूल्य सहयोग <span className="text-amber-300 font-bold">{authorName}</span> तथा कथा चौतारी टोलीलाई सफलतापूर्वक प्राप्त भयो।
            </p>
            <p className="text-[11px] text-rose-200 font-semibold bg-rose-950/50 p-3 rounded-2xl border border-rose-500/30">
              नेपाली भाषा र मौलिक साहित्यको श्रीवृद्धिमा तपाईंको योगदान अतुलनीय छ!
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
