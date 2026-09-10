import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, 
  Menu, 
  X, 
  Upload, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  RefreshCw, 
  ShieldCheck, 
  Code, 
  Database,
  Cpu,
  Sparkles,
  Layers,
  Calculator,
  ExternalLink,
  ArrowLeft,
  Activity
} from 'lucide-react';

const API_BASE_URL = "http://localhost:8000/api/v1";

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState('home'); // 'home', 'ocr', 'types', 'validation', 'docs'

  // Upload & Extraction State
  const [file, setFile] = useState(null);
  const [docType, setDocType] = useState('AUTO_DETECT');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState('');
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [resultSubTab, setResultSubTab] = useState('json');

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const handleNavClick = (name) => {
    setIsMenuOpen(false);
    if (name === 'OCR Pipeline') {
      setCurrentView('ocr');
    } else if (name === 'Document Types') {
      setCurrentView('types');
    } else if (name === 'Math Validation') {
      setCurrentView('validation');
    } else if (name === 'API Docs') {
      setCurrentView('docs');
    } else {
      setCurrentView('home');
    }
  };

  const navLinks = [
    { name: 'OCR Pipeline', key: 'ocr', hasDropdown: false },
    { name: 'Document Types', key: 'types', hasDropdown: true },
    { name: 'Math Validation', key: 'validation', hasDropdown: false },
    { name: 'API Docs', key: 'docs', hasDropdown: false },
  ];

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setErrorMsg(null);
    }
  };

  const handleProcessSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setIsProcessing(true);
    setErrorMsg(null);
    setResult(null);

    setCurrentStep('Validating file format & size limits...');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('document_type', docType);

    try {
      setTimeout(() => setCurrentStep('Rasterizing & running OCR engine...'), 600);
      setTimeout(() => setCurrentStep('Executing AI structured schema extraction...'), 1200);
      setTimeout(() => setCurrentStep('Verifying pure Python financial validation rules...'), 1800);

      const res = await fetch(`${API_BASE_URL}/documents/process`, {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.detail?.message || errJson.detail || "Processing failed");
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsProcessing(false);
      setCurrentStep('');
    }
  };

  const renderStatusPill = (status) => {
    if (status === 'PASS') {
      return <span className="pill pill-pass"><CheckCircle2 size={12} /> PASS</span>;
    } else if (status === 'FAILED') {
      return <span className="pill pill-fail"><XCircle size={12} /> FAILED</span>;
    } else {
      return <span className="pill pill-na"><AlertTriangle size={12} /> N/A</span>;
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black text-white font-sans">
      {/* Cinematic Background Video - Preserved Across All Views */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover z-0"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260803_192301_9231ed6b-c55c-4a48-909c-4ebe11cf2e11.mp4"
      />

      {/* Subtle Dark Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60 z-0 pointer-events-none" />

      {/* Main Relative Container */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Navigation Bar */}
        <nav className="flex items-center justify-between px-5 py-5 sm:px-8 sm:py-6 lg:px-12">
          {/* Neostats Logo & Wordmark */}
          <button onClick={() => setCurrentView('home')} className="flex items-center gap-2.5 z-50 focus:outline-none">
            <svg
              className="h-6 w-6 text-[#010101] fill-[#010101] lg:text-white lg:fill-white transition-colors duration-300 drop-shadow-md"
              viewBox="0 0 256 256"
            >
              <path d="M 128 128 C 128 198.692 70.692 256 0 256 C 0 185.308 57.308 128 128 128 Z M 128 128 C 198.692 128 256 185.308 256 256 C 185.308 256 128 198.692 128 128 Z M 0 0 C 70.692 0 128 57.308 128 128 C 57.308 128 0 70.692 0 0 Z M 256 0 C 256 70.692 198.692 128 128 128 C 128 57.308 185.308 0 256 0 Z" />
            </svg>
            <span className="text-lg font-bold tracking-tight text-[#010101] lg:text-white transition-colors duration-300 drop-shadow-md">
              neostats
            </span>
          </button>

          {/* Desktop Navigation Cluster */}
          <div className="hidden md:flex items-center gap-3">
            {/* Glass Pill Cluster */}
            <div className="flex items-center gap-1 rounded-full bg-white/10 px-1.5 py-1.5 backdrop-blur-lg">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.name)}
                  className={`flex items-center gap-1 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                    currentView === link.key ? 'bg-white/20 text-white font-semibold shadow' : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {link.name}
                  {link.hasDropdown && <ChevronDown className="h-3.5 w-3.5" />}
                </button>
              ))}
            </div>

            {/* Separate Process Document CTA Pill */}
            <button 
              onClick={() => setCurrentView('ocr')}
              className="flex items-center justify-center rounded-full px-5 text-sm font-medium text-white self-stretch cta-gradient transition-opacity duration-200"
            >
              Process Document
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
            className="md:hidden relative z-50 h-10 w-10 rounded-full bg-white/10 backdrop-blur-lg flex items-center justify-center"
          >
            <Menu
              className={`absolute h-5 w-5 text-[#010101] lg:text-white transition-all duration-300 ${
                isMenuOpen ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
              }`}
            />
            <X
              className={`absolute h-5 w-5 text-[#010101] lg:text-white transition-all duration-300 ${
                isMenuOpen ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
              }`}
            />
          </button>
        </nav>

        {/* Mobile Menu Glass Overlay + Drawer */}
        <div
          onClick={() => setIsMenuOpen(false)}
          className={`fixed inset-0 z-40 bg-black/80 backdrop-blur-md transition-opacity duration-300 ${
            isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        />

        <div
          className={`fixed right-0 top-0 z-40 h-full w-72 bg-black/90 backdrop-blur-xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Mobile Nav Links */}
          <div className="px-6 pt-24 flex flex-col gap-2">
            {navLinks.map((link, index) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.name)}
                className="flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-medium text-white/80 hover:bg-white/10 hover:text-white transition-all duration-300 text-left"
                style={{
                  transitionDelay: `${(index + 1) * 60}ms`,
                  opacity: isMenuOpen ? 1 : 0,
                  transform: isMenuOpen ? 'translateX(0)' : 'translateX(24px)',
                }}
              >
                <span>{link.name}</span>
                {link.hasDropdown && <ChevronDown className="h-4 w-4" />}
              </button>
            ))}
          </div>

          {/* Mobile Drawer Bottom CTA */}
          <div
            className="mt-auto px-6 pb-10 transition-all duration-400"
            style={{
              transitionDelay: '300ms',
              opacity: isMenuOpen ? 1 : 0,
              transform: isMenuOpen ? 'translateY(0)' : 'translateY(16px)',
            }}
          >
            <button 
              onClick={() => { setIsMenuOpen(false); setCurrentView('ocr'); }}
              className="w-full rounded-full py-3.5 text-center text-sm font-medium text-white cta-gradient transition-opacity duration-200"
            >
              Process Document
            </button>
          </div>
        </div>

        {/* PAGE VIEW 1: HOME LANDING HERO */}
        {currentView === 'home' && (
          <main className="mt-auto px-5 pb-8 sm:px-8 sm:pb-12 lg:px-12 lg:pb-16 text-center">
            <div className="flex flex-col items-center gap-8 sm:gap-12">
              {/* Centered Headline & Email CTA */}
              <div className="max-w-4xl mx-auto text-center px-4">
                <h1 className="text-3xl sm:text-5xl lg:text-[3.75rem] font-bold leading-[1.3] tracking-tight text-[#010101] lg:text-white transition-colors duration-300 text-center drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)]">
                  Intelligent document extraction <br className="hidden sm:inline" />
                  & financial audit platform
                </h1>

                {/* Centered Email / Ingestion CTA */}
                <div className="mt-8 sm:mt-10 inline-flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-0 sm:rounded-full sm:bg-white sm:p-2 justify-center mx-auto shadow-2xl">
                  <input
                    type="text"
                    placeholder="Upload Invoices, Balance Sheets, P&L..."
                    readOnly
                    onClick={() => setCurrentView('ocr')}
                    className="cursor-pointer rounded-full bg-white px-6 py-3.5 text-sm text-gray-900 placeholder-gray-500 outline-none sm:w-88 sm:rounded-none sm:bg-transparent sm:px-5 sm:py-2.5 text-center sm:text-left"
                  />
                  <button 
                    onClick={() => setCurrentView('ocr')}
                    className="rounded-full px-8 py-3.5 sm:py-3 text-sm font-semibold text-white cta-gradient transition-opacity duration-200 text-center shadow-lg"
                  >
                    Process Document
                  </button>
                </div>
              </div>

              {/* Bottom Glass Cards */}
              <div className="flex flex-col gap-4 sm:flex-row lg:gap-6 justify-center w-full max-w-3xl mx-auto">
                {/* Stats Card */}
                <div className="sm:w-64 flex flex-col justify-between rounded-2xl bg-slate-900/65 backdrop-blur-xl border border-white/15 p-5 sm:p-6 text-left shadow-2xl">
                  <div>
                    <div className="font-silkscreen text-3xl sm:text-4xl font-normal tracking-tight text-white transition-colors duration-300">
                      99.8%
                    </div>
                    <p className="text-sm leading-relaxed mt-3 sm:mt-4 text-white/80 transition-colors duration-300">
                      Financial accuracy rate achieved across Invoices, Balance Sheets & Cash Flow reconciliations.
                    </p>
                  </div>
                </div>

                {/* Testimonial / Platform Audit Card */}
                <div className="sm:w-64 rounded-2xl bg-slate-900/65 backdrop-blur-xl border border-white/15 p-5 sm:p-6 text-left shadow-2xl">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <div className="h-6 w-6 rounded-md bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-md">
                      N
                    </div>
                    <span className="text-sm font-bold text-white transition-colors duration-300">
                      Neostats API
                    </span>
                  </div>

                  <p className="text-sm leading-relaxed text-white/85 transition-colors duration-300">
                    "Extracted structured key-value pairs and line items with verbatim grounding evidence & zero hallucination."
                  </p>

                  <div className="flex items-center gap-3 mt-4 sm:mt-5">
                    <img
                      src="https://i.pravatar.cc/72?img=60"
                      alt="AI Engineer"
                      className="h-9 w-9 rounded-full object-cover bg-indigo-500/30 border border-indigo-400/40"
                    />
                    <div>
                      <div className="text-sm font-semibold text-white transition-colors duration-300">
                        AI Engineer
                      </div>
                      <div className="text-xs text-white/70 transition-colors duration-300">
                        AI Engineer
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        )}

        {/* PAGE VIEW 2: OCR PIPELINE (IN THE SAME THEME) */}
        {currentView === 'ocr' && (
          <main className="mt-auto px-5 pb-8 sm:px-8 sm:pb-12 lg:px-12 lg:pb-16 flex-1 flex flex-col justify-end max-w-5xl mx-auto w-full">
            <div className="rounded-2xl bg-slate-900/75 backdrop-blur-xl border border-white/20 p-6 sm:p-8 text-white shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">LIVE PROCESSOR</span>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Sparkles className="text-indigo-400" /> Neostats OCR Extraction Pipeline
                  </h2>
                </div>
                <button onClick={() => setCurrentView('home')} className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-white bg-white/10 px-3 py-1.5 rounded-full">
                  <ArrowLeft size={14} /> Back to Home
                </button>
              </div>

              <form onSubmit={handleProcessSubmit} className="space-y-4">
                <div 
                  className="border-2 border-dashed border-indigo-500/50 rounded-xl p-8 text-center bg-slate-950/60 hover:border-indigo-400 transition-all cursor-pointer"
                  onClick={() => document.getElementById('view-file-input').click()}
                >
                  <input 
                    id="view-file-input" 
                    type="file" 
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange} 
                    className="hidden" 
                  />
                  <Upload size={40} className="mx-auto text-indigo-400 mb-3" />
                  {file ? (
                    <div>
                      <p className="font-semibold text-lg">{file.name}</p>
                      <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB • Ready for extraction</p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-semibold text-lg">Click or drag financial document (PDF, JPG, PNG)</p>
                      <p className="text-xs text-gray-400 mt-1">Supports Invoices, Balance Sheets, P&L & Cash Flow (Max 10 MB, ≤ 3 pages)</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <select 
                    value={docType} 
                    onChange={(e) => setDocType(e.target.value)}
                    className="flex-1 p-3.5 rounded-xl bg-slate-950 border border-white/20 text-white outline-none"
                  >
                    <option value="AUTO_DETECT">⚡ Auto-Detect Document Type</option>
                    <option value="INVOICE">📄 Invoice</option>
                    <option value="BALANCE_SHEET">📊 Balance Sheet</option>
                    <option value="PROFIT_AND_LOSS">📈 Profit & Loss Statement</option>
                    <option value="CASH_FLOW">💵 Cash Flow Statement</option>
                  </select>

                  <button 
                    type="submit" 
                    disabled={!file || isProcessing}
                    className="px-8 py-3.5 rounded-xl font-bold text-white cta-gradient whitespace-nowrap disabled:opacity-50 shadow-lg"
                  >
                    {isProcessing ? "Processing..." : "Execute Pipeline Extraction"}
                  </button>
                </div>
              </form>

              {isProcessing && (
                <div className="mt-4 text-center text-sm text-cyan-400 font-semibold animate-pulse">
                  {currentStep}
                </div>
              )}

              {errorMsg && (
                <div className="mt-4 p-4 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-sm">
                  {errorMsg}
                </div>
              )}

              {result && (
                <div className="mt-6 border-t border-white/15 pt-6 max-h-72 overflow-y-auto">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">{result.document_type}</span>
                    <div className="flex items-center gap-2">
                      {renderStatusPill(result.validation?.status)}
                      <span className="text-xs px-3 py-1 rounded-md bg-indigo-500/30 text-indigo-300 font-bold">
                        {(result.processing_metadata?.overall_confidence_score * 100).toFixed(0)}% Confidence
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 mb-4">
                    <button 
                      onClick={() => setResultSubTab('json')}
                      className={`px-4 py-2 rounded-lg text-xs font-bold ${resultSubTab === 'json' ? 'bg-indigo-600 text-white' : 'bg-white/10 text-gray-300'}`}
                    >
                      Extracted JSON Schema
                    </button>
                    <button 
                      onClick={() => setResultSubTab('validation')}
                      className={`px-4 py-2 rounded-lg text-xs font-bold ${resultSubTab === 'validation' ? 'bg-indigo-600 text-white' : 'bg-white/10 text-gray-300'}`}
                    >
                      Math Rule Audit ({result.validation?.rules_executed?.length || 0})
                    </button>
                  </div>

                  {resultSubTab === 'json' && (
                    <div className="json-viewer max-h-48 overflow-y-auto">
                      <pre>{JSON.stringify(result.extracted_data, null, 2)}</pre>
                    </div>
                  )}

                  {resultSubTab === 'validation' && (
                    <div className="text-sm space-y-2">
                      <p className="text-gray-400">{result.validation?.summary}</p>
                      <table className="custom-table text-xs">
                        <thead>
                          <tr>
                            <th>Rule ID</th>
                            <th>Description</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(result.validation?.rules_executed || []).map((rule, idx) => (
                            <tr key={idx}>
                              <td className="text-cyan-400 font-mono">{rule.rule_id}</td>
                              <td>{rule.description}</td>
                              <td>{renderStatusPill(rule.status)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </main>
        )}

        {/* PAGE VIEW 3: DOCUMENT TYPES (IN THE SAME THEME) */}
        {currentView === 'types' && (
          <main className="mt-auto px-5 pb-8 sm:px-8 sm:pb-12 lg:px-12 lg:pb-16 flex-1 flex flex-col justify-end max-w-5xl mx-auto w-full">
            <div className="rounded-2xl bg-slate-900/75 backdrop-blur-xl border border-white/20 p-6 sm:p-8 text-white shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">CATALOG</span>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Layers className="text-cyan-400" /> Supported Document Schemas
                  </h2>
                </div>
                <button onClick={() => setCurrentView('home')} className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-white bg-white/10 px-3 py-1.5 rounded-full">
                  <ArrowLeft size={14} /> Back to Home
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-slate-950/80 border border-white/15">
                  <h3 className="font-bold text-indigo-400 text-base mb-2">📄 1. Invoices</h3>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Extracts Invoice Number, Issue/Due Date, Payment Terms, Vendor & Buyer Party Details, Line Items Table (Qty, Unit Price, Line Amount), Tax Splits (CGST, SGST, IGST, VAT), and Grand Total.
                  </p>
                </div>
                <div className="p-5 rounded-xl bg-slate-950/80 border border-white/15">
                  <h3 className="font-bold text-cyan-400 text-base mb-2">📊 2. Balance Sheet</h3>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Multi-year comparative Asset & Liability line items, Schedules, Currency Scale Units (crore/thousands), and Total Accounting Equation equality verification.
                  </p>
                </div>
                <div className="p-5 rounded-xl bg-slate-950/80 border border-white/15">
                  <h3 className="font-bold text-purple-400 text-base mb-2">📈 3. Profit & Loss</h3>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Revenues, Interest Earned, Operating Expenses, Provisions & Contingencies, Net Group Profit, Appropriations, and Basic/Diluted EPS.
                  </p>
                </div>
                <div className="p-5 rounded-xl bg-slate-950/80 border border-white/15">
                  <h3 className="font-bold text-emerald-400 text-base mb-2">💵 4. Cash Flow Statement</h3>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Net Operating, Investing, and Financing Cash Flows, Exchange Fluctuation effects, Net Cash Increase, Opening & Ending Cash Balances.
                  </p>
                </div>
              </div>
            </div>
          </main>
        )}

        {/* PAGE VIEW 4: MATH VALIDATION (IN THE SAME THEME) */}
        {currentView === 'validation' && (
          <main className="mt-auto px-5 pb-8 sm:px-8 sm:pb-12 lg:px-12 lg:pb-16 flex-1 flex flex-col justify-end max-w-5xl mx-auto w-full">
            <div className="rounded-2xl bg-slate-900/75 backdrop-blur-xl border border-white/20 p-6 sm:p-8 text-white shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">DETERMINISTIC VERIFICATION</span>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Calculator className="text-emerald-400" /> Pure Python Financial Validation Engine
                  </h2>
                </div>
                <button onClick={() => setCurrentView('home')} className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-white bg-white/10 px-3 py-1.5 rounded-full">
                  <ArrowLeft size={14} /> Back to Home
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/80 border border-white/15">
                  <span className="font-mono text-indigo-400 text-xs font-bold">RULE_INV_LINE_MATH</span>
                  <p className="text-xs text-gray-300 mt-1">Quantity * Unit Price == Line Total (within $0.05 tolerance)</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/80 border border-white/15">
                  <span className="font-mono text-cyan-400 text-xs font-bold">RULE_INV_GRAND_MATH</span>
                  <p className="text-xs text-gray-300 mt-1">Subtotal + Total Tax + Shipping + Rounding == Grand Total</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/80 border border-white/15">
                  <span className="font-mono text-emerald-400 text-xs font-bold">RULE_BS_EQUALITY_YEAR</span>
                  <p className="text-xs text-gray-300 mt-1">Total Assets (Year T) == Total Capital & Liabilities (Year T)</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/80 border border-white/15">
                  <span className="font-mono text-purple-400 text-xs font-bold">RULE_CF_ENDING_CASH</span>
                  <p className="text-xs text-gray-300 mt-1">Ending Cash == Opening Cash + Net Increase in Cash</p>
                </div>
              </div>
            </div>
          </main>
        )}

        {/* PAGE VIEW 5: API DOCS (IN THE SAME THEME) */}
        {currentView === 'docs' && (
          <main className="mt-auto px-5 pb-8 sm:px-8 sm:pb-12 lg:px-12 lg:pb-16 flex-1 flex flex-col justify-end max-w-5xl mx-auto w-full">
            <div className="rounded-2xl bg-slate-900/75 backdrop-blur-xl border border-white/20 p-6 sm:p-8 text-white shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">REST GATEWAY</span>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <BookOpen className="text-indigo-400" /> API Specification & Endpoints
                  </h2>
                </div>
                <button onClick={() => setCurrentView('home')} className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-white bg-white/10 px-3 py-1.5 rounded-full">
                  <ArrowLeft size={14} /> Back to Home
                </button>
              </div>

              <div className="space-y-3 text-xs font-mono">
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/15 flex items-center justify-between">
                  <div>
                    <span className="px-2 py-1 rounded bg-green-500/20 text-green-400 font-bold mr-3">POST</span>
                    <span className="text-white">/api/v1/documents/process</span>
                  </div>
                  <span className="text-gray-400">Ingest & process document payload</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/15 flex items-center justify-between">
                  <div>
                    <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-400 font-bold mr-3">GET</span>
                    <span className="text-white">/api/v1/documents/{'{document_name}'}</span>
                  </div>
                  <span className="text-gray-400">Get latest stored extraction record</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/15 flex items-center justify-between">
                  <div>
                    <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-400 font-bold mr-3">GET</span>
                    <span className="text-white">/api/v1/documents</span>
                  </div>
                  <span className="text-gray-400">List paginated document summaries</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/15 flex items-center justify-between">
                  <div>
                    <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-400 font-bold mr-3">GET</span>
                    <span className="text-white">/api/v1/health</span>
                  </div>
                  <span className="text-gray-400">Health check status endpoint</span>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <a
                  href="http://localhost:8000/docs"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-white cta-gradient text-xs shadow-lg"
                >
                  Open Live Swagger OpenAPI Interactive Docs <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </main>
        )}
      </div>
    </section>
  );
}
