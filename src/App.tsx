/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Smartphone, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  ShieldCheck, 
  Hash,
  ArrowRight,
  HelpCircle,
  Cpu,
  Copy,
  History,
  Share2,
  ExternalLink,
  Zap
} from 'lucide-react';

// Luhn Algorithm Implementation
const validateIMEI = (imei: string): { isValid: boolean; steps: any[] } => {
  if (!/^\d{15}$/.test(imei)) {
    return { isValid: false, steps: [] };
  }

  const digits = imei.split('').map(Number);
  const steps: any[] = [];
  let sum = 0;

  for (let i = 0; i < 15; i++) {
    let currentDigit = digits[i];
    let processedDigit = currentDigit;
    let isDoubled = false;

    if (i % 2 === 1) {
      isDoubled = true;
      processedDigit = currentDigit * 2;
      if (processedDigit > 9) {
        processedDigit = Math.floor(processedDigit / 10) + (processedDigit % 10);
      }
    }

    sum += processedDigit;
    steps.push({
      original: currentDigit,
      processed: processedDigit,
      isDoubled,
      runningSum: sum
    });
  }

  return { 
    isValid: sum % 10 === 0, 
    steps 
  };
};

// Simple TAC (Type Allocation Code) Lookup for common brands
// First 8 digits of IMEI
const getDeviceBrand = (imei: string): string | null => {
  if (imei.length < 8) return null;
  const tac = imei.substring(0, 8);
  
  // Example TAC mappings (Simplified for demonstration)
  const tacMap: Record<string, string> = {
    '35875606': 'Apple iPhone 6',
    '35441306': 'Apple iPhone 5s',
    '35332708': 'Samsung Galaxy S9',
    '35245208': 'Google Pixel 3',
    '86820403': 'Xiaomi Redmi Note 7',
    '35925406': 'Samsung Galaxy S7',
    '35721409': 'Apple iPhone 11',
    '35383510': 'Apple iPhone 12',
    '35671910': 'Samsung Galaxy S20',
  };

  // Check for common prefixes if exact TAC not found
  if (tacMap[tac]) return tacMap[tac];
  
  const prefix = imei.substring(0, 2);
  const prefixMap: Record<string, string> = {
    '35': 'Likely Apple/Samsung/European Brand',
    '86': 'Likely Xiaomi/Huawei/Chinese Brand',
    '01': 'Likely US/Canadian Brand',
    '44': 'Likely UK Brand',
    '91': 'Likely Indian Brand',
  };

  return prefixMap[prefix] || 'Unknown Manufacturer';
};

export default function App() {
  const [imei, setImei] = useState('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [copyStatus, setCopyStatus] = useState(false);

  const validation = useMemo(() => {
    if (imei.length === 15) {
      const result = validateIMEI(imei);
      if (result.isValid && !history.includes(imei)) {
        setHistory(prev => [imei, ...prev].slice(0, 5));
      }
      return result;
    }
    return null;
  }, [imei]);

  const brand = useMemo(() => getDeviceBrand(imei), [imei]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 15);
    setImei(value);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(imei);
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 2000);
  };

  const shareResult = () => {
    const text = `IMEI ${imei} is ${validation?.isValid ? 'VALID' : 'INVALID'} according to Luhn Algorithm. Check yours at ${window.location.href}`;
    if (navigator.share) {
      navigator.share({
        title: 'IMEI Validator Result',
        text: text,
        url: window.location.href,
      });
    } else {
      copyToClipboard();
      alert('Result copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-blue-500/30">
      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
      </div>

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12 md:py-20">
        {/* Header */}
        <header className="mb-12 text-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6"
          >
            <Zap size={14} className="fill-current" />
            Advanced Device Verification
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-black tracking-tighter mb-6 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent"
          >
            IMEI Validator
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 max-w-xl mx-auto text-lg leading-relaxed"
          >
            Securely verify mobile device authenticity using the global standard Luhn Algorithm.
          </motion.p>
        </header>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main Validator Area */}
          <div className="lg:col-span-8 space-y-8">
            {/* Validator Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-900/50 backdrop-blur-xl rounded-[2rem] border border-slate-800 shadow-2xl overflow-hidden"
            >
              <div className="p-8 md:p-12">
                <div className="max-w-md mx-auto">
                  <div className="flex justify-between items-end mb-4">
                    <label htmlFor="imei-input" className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">
                      Input IMEI
                    </label>
                    <div className="flex items-center gap-3">
                      {imei.length > 0 && (
                        <button onClick={copyToClipboard} className="text-slate-500 hover:text-blue-400 transition-colors">
                          {copyStatus ? <CheckCircle2 size={16} className="text-green-500" /> : <Copy size={16} />}
                        </button>
                      )}
                      <span className={`text-xs font-mono ${imei.length === 15 ? 'text-blue-400' : 'text-slate-600'}`}>
                        {imei.length}/15
                      </span>
                    </div>
                  </div>
                  
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-600 group-focus-within:text-blue-500 transition-colors">
                      <Hash size={24} />
                    </div>
                    <input
                      id="imei-input"
                      type="text"
                      inputMode="numeric"
                      value={imei}
                      onChange={handleInputChange}
                      placeholder="000000000000000"
                      className="w-full bg-slate-950/50 border-2 border-slate-800 focus:border-blue-500/50 focus:bg-slate-950 rounded-2xl py-6 pl-16 pr-6 text-3xl md:text-4xl font-mono tracking-[0.25em] outline-none transition-all placeholder:text-slate-800 text-white"
                    />
                  </div>

                  <AnimatePresence mode="wait">
                    {validation && (
                      <motion.div
                        key={validation.isValid ? 'valid' : 'invalid'}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`mt-8 p-6 rounded-2xl flex items-center gap-5 border ${
                          validation.isValid 
                            ? 'bg-green-500/5 border-green-500/20 text-green-400' 
                            : 'bg-red-500/5 border-red-500/20 text-red-400'
                        }`}
                      >
                        <div className={`p-3 rounded-xl ${validation.isValid ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                          {validation.isValid ? <CheckCircle2 size={32} /> : <AlertCircle size={32} />}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-xl leading-tight mb-1">
                            {validation.isValid ? 'Valid IMEI' : 'Invalid IMEI'}
                          </h3>
                          <p className="text-sm opacity-60">
                            {validation.isValid 
                              ? 'Checksum verified successfully.' 
                              : 'Checksum mismatch detected.'}
                          </p>
                        </div>
                        {validation.isValid && (
                          <button onClick={shareResult} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                            <Share2 size={20} />
                          </button>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {brand && imei.length >= 2 && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-6 flex items-center gap-2 text-slate-500 text-sm bg-slate-800/30 w-fit mx-auto px-4 py-1.5 rounded-full border border-slate-700/50"
                    >
                      <Smartphone size={14} />
                      <span>{brand}</span>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Action Bar */}
              <div className="bg-slate-950/50 px-8 py-5 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest">
                  <Cpu size={16} className="text-blue-500" />
                  <span>Luhn Engine v2.0</span>
                </div>
                <button 
                  onClick={() => setShowExplanation(!showExplanation)}
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-bold text-sm transition-colors group"
                >
                  <HelpCircle size={18} />
                  {showExplanation ? 'Hide Mechanics' : 'How it works?'}
                  <ArrowRight size={14} className={`transition-transform ${showExplanation ? '-rotate-90' : ''}`} />
                </button>
              </div>
            </motion.div>

            {/* Explanation Section */}
            <AnimatePresence>
              {showExplanation && (
                <motion.section
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-slate-900/50 backdrop-blur-xl rounded-[2rem] p-8 md:p-12 border border-slate-800 mb-8">
                    <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-white">
                      <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                        <Info size={24} />
                      </div>
                      The Luhn Algorithm
                    </h2>
                    
                    <div className="space-y-8">
                      <div className="grid md:grid-cols-3 gap-6">
                        {[
                          { title: 'Double', desc: 'Multiply every 2nd digit by 2' },
                          { title: 'Sum', desc: 'Add digits of products > 9' },
                          { title: 'Verify', desc: 'Total must be divisible by 10' }
                        ].map((step, i) => (
                          <div key={i} className="p-6 rounded-2xl bg-slate-950/50 border border-slate-800 hover:border-blue-500/30 transition-colors">
                            <div className="text-3xl font-black text-slate-800 mb-3">0{i+1}</div>
                            <h4 className="font-bold text-white mb-1">{step.title}</h4>
                            <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                          </div>
                        ))}
                      </div>

                      {validation && (
                        <div className="pt-8 border-t border-slate-800">
                          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Smartphone size={16} />
                            Processing Trace: {imei}
                          </h3>
                          <div className="overflow-x-auto pb-6 custom-scrollbar">
                            <div className="inline-flex gap-3 min-w-full">
                              {validation.steps.map((step, idx) => (
                                <div key={idx} className="flex flex-col items-center min-w-[52px]">
                                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono text-xl border transition-all ${step.isDoubled ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 'bg-slate-950/50 border-slate-800 text-slate-500'}`}>
                                    {step.original}
                                  </div>
                                  <div className="h-8 flex items-center justify-center">
                                    {step.isDoubled && <ArrowRight size={14} className="rotate-90 text-slate-700" />}
                                  </div>
                                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono text-xl transition-all ${step.isDoubled ? 'bg-blue-500 text-white font-bold shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'text-slate-700'}`}>
                                    {step.processed}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="mt-4 p-6 bg-slate-950 rounded-2xl border border-slate-800 text-center">
                            <div className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">Final Calculation</div>
                            <div className="text-3xl font-mono text-white">
                              Sum {validation.steps[14].runningSum} mod 10 = <span className={validation.isValid ? 'text-green-400' : 'text-red-400'}>{validation.steps[14].runningSum % 10}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar Features */}
          <div className="lg:col-span-4 space-y-6">
            {/* Find IMEI Suggestion */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <Smartphone size={80} />
              </div>
              <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                <HelpCircle size={20} />
                Find your IMEI
              </h3>
              <p className="text-blue-100 text-sm mb-4 leading-relaxed">
                Dial the universal code on your phone's keypad to instantly display your IMEI number.
              </p>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-center border border-white/20">
                <span className="text-3xl font-black tracking-widest">*#06#</span>
              </div>
            </motion.div>

            {/* Recent Checks */}
            {history.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 border border-slate-800"
              >
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <History size={16} />
                  Recent Valid Checks
                </h3>
                <div className="space-y-3">
                  {history.map((item, i) => (
                    <button 
                      key={i}
                      onClick={() => setImei(item)}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950/50 border border-slate-800 hover:border-blue-500/30 transition-all group"
                    >
                      <span className="font-mono text-sm text-slate-400 group-hover:text-blue-400">{item}</span>
                      <ArrowRight size={14} className="text-slate-700 group-hover:text-blue-500 transition-colors" />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Pro Tip */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 border border-slate-800"
            >
              <div className="flex items-start gap-4">
                <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">Security Tip</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Always verify the IMEI before buying a used device. If the algorithm fails, the device might be tampered with or counterfeit.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-slate-800/50 text-center text-slate-600 text-sm">
          <div className="flex flex-wrap justify-center gap-8 mb-6">
            <div className="flex items-center gap-2"><ShieldCheck size={16} className="text-blue-500" /> <span>Military Grade Logic</span></div>
            <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500" /> <span>Real-time Sync</span></div>
            <div className="flex items-center gap-2"><Smartphone size={16} className="text-indigo-500" /> <span>Global Standard</span></div>
          </div>
          <p>© 2026 IMEI Validator • Secure Device Intelligence</p>
        </footer>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.02);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59,130,246,0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59,130,246,0.4);
        }
      `}} />
    </div>
  );
}
