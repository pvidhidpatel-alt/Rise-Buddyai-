import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Check, Copy, Zap, ShieldCheck } from 'lucide-react';

interface GooglePayQRCardProps {
  payeeName?: string;
  upiId?: string;
  amount?: number;
  onPaymentComplete?: () => void;
}

export const GooglePayQRCard: React.FC<GooglePayQRCardProps> = ({
  payeeName = 'Vidhi Patel',
  upiId = 'unicorndreams.com@okicici',
  amount = 149,
  onPaymentComplete,
}) => {
  const [copied, setCopied] = useState(false);

  // Standard UPI URI format
  const upiPaymentString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=RiseBuddy%20Prime%20Subscription`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full bg-[#18181b] text-white rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-2xl flex flex-col items-center justify-center space-y-5 relative overflow-hidden">
      {/* Background glow accent */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Payee Header matching user's screenshot */}
      <div className="flex items-center justify-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-[#2e7d32] text-white font-extrabold text-base flex items-center justify-center shadow-inner">
          v
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-100">{payeeName}</span>
      </div>

      {/* QR Code Container with Central Google Pay Emblem */}
      <div className="relative p-4 bg-white rounded-2xl shadow-xl flex items-center justify-center">
        <QRCodeCanvas
          value={upiPaymentString}
          size={180}
          level="H"
          marginSize={2}
        />
        {/* Central Google Pay Badge Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-11 h-11 rounded-full bg-white p-1 border border-slate-200 shadow-md flex items-center justify-center">
            {/* Google Pay 4-color SVG Logo */}
            <svg viewBox="0 0 24 24" className="w-7 h-7">
              <path
                fill="#4285F4"
                d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"
                className="hidden"
              />
              {/* Official Google Pay Multi-Color Path */}
              <g>
                <path fill="#4285F4" d="M12 5c-3.87 0-7 3.13-7 7s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
                <path fill="#EA4335" d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z" />
                <path fill="#FBBC05" d="M12 9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                <path fill="#34A853" d="M12 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z" />
              </g>
              {/* Accurate Google Pay Icon overlay */}
              <image
                href="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg"
                x="2"
                y="2"
                width="20"
                height="20"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Amount & Instruction */}
      <div className="text-center space-y-1">
        <div className="flex items-center justify-center gap-1.5">
          <span className="text-2xl font-black text-white">₹{amount}</span>
          <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
            Monthly Prime Plan
          </span>
        </div>
        <p className="text-xs text-slate-400 font-medium">
          Scan with <span className="text-white font-bold">Google Pay</span>, PhonePe, Paytm or any UPI App
        </p>
      </div>

      {/* UPI ID Copy Bar */}
      <div className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">UPI ID / VPA</p>
          <p className="text-xs font-mono font-bold text-amber-300 truncate">{upiId}</p>
        </div>
        <button
          onClick={handleCopyUpi}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors flex items-center gap-1 shrink-0"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      {/* Verification footer */}
      <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold">
        <ShieldCheck className="w-4 h-4" />
        <span>Instant Activation upon payment verification</span>
      </div>
    </div>
  );
};
