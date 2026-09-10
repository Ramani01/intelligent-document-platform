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
  Sparkles
} from 'lucide-react';

const API_BASE_URL = "http://localhost:8000/api/v1";

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Upload & Extraction State
  const [file, setFile] = useState(null);
  const [docType, setDocType] = useState('AUTO_DETECT');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState('');
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [resultSubTab, setResultSubTab] = useState('json');

  useEffect(() => {
    if (isMenuOpen || isUploadModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen, isUploadModalOpen]);

  const navLinks = [
    { name: 'OCR Pipeline', hasDropdown: false, href: '#ocr' },
    { name: 'Document Types', hasDropdown: true, href: '#types' },
    { name: 'Math Validation', hasDropdown: false, href: '#validation' },
    { name: 'API Docs', hasDropdown: false, href: 'http://localhost:8000/docs' },
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
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover z-0"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260803_192301_9231ed6b-c55c-4a48-909c-4ebe11cf2e11.mp4"
      />

      {/* Main Relative Container */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Navigation Bar */}
        <nav className="flex items-center justify-between px-5 py-5 sm:px-8 sm:py-6 lg:px-12">
          {/* Neostats Logo & Wordmark */}
          <div className="flex items-center gap-2.5 z-50">
            <svg
              className="h-6 w-6 text-[#010101] fill-[#010101] lg:text-white lg:fill-white transition-colors duration-300"
              viewBox="0 0 256 256"
            >
              <path d="M 128 128 C 128 198.692 70.692 256 0 256 C 0 185.308 57.308 128 128 128 Z M 128 128 C 198.692 128 256 185.308 256 256 C 185.308 256 128 198.692 128 128 Z M 0 0 C 70.692 0 128 57.308 128 128 C 57.308 128 0 70.692 0 0 Z M 256 0 C 256 70.692 198.692 128 128 128 C 128 57.308 185.308 0 256 0 Z" />
            </svg>
            <span className="text-lg font-bold tracking-tight text-[#010101] lg:text-white transition-colors duration-300">
              neostats
            </span>
          </div>

          {/* Desktop Navigation Cluster */}
          <div className="hidden md:flex items-center gap-3">
            {/* Glass Pill Cluster */}
            <div className="flex items-center gap-1 rounded-full bg-white/10 px-1.5 py-1.5 backdrop-blur-lg">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : '_self'}
                  rel="noreferrer"
                  className="flex items-center gap-1 rounded-full px-4 py-1.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                >
                  {link.name}
                  {link.hasDropdown && <ChevronDown className="h-3.5 w-3.5" />}
                </a>
              ))}
            </div>

            {/* Separate Process Document CTA Pill */}
            <button 
              onClick={() => setIsUploadModalOpen(true)}
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
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-medium text-white/80 hover:bg-white/10 hover:text-white transition-all duration-300"
                style={{
                  transitionDelay: `${(index + 1) * 60}ms`,
                  opacity: isMenuOpen ? 1 : 0,
                  transform: isMenuOpen ? 'translateX(0)' : 'translateX(24px)',
                }}
              >
                <span>{link.name}</span>
                {link.hasDropdown && <ChevronDown className="h-4 w-4" />}
              </a>
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
              onClick={() => { setIsMenuOpen(false); setIsUploadModalOpen(true); }}
              className="w-full rounded-full py-3.5 text-center text-sm font-medium text-white cta-gradient transition-opacity duration-200"
            >
              Process Document
            </button>
          </div>
        </div>

        {/* Bottom-Anchored Main Hero Content */}
        <main className="mt-auto px-5 pb-8 sm:px-8 sm:pb-12 lg:px-12 lg:pb-16">
          <div className="flex flex-col gap-6 sm:gap-8 lg:flex-row lg:items-end lg:justify-between">
            {/* Left Column: Headline + Email/Document Ingestion CTA */}
            <div className="max-w-xl">
              <h1 className="text-3xl sm:text-4xl lg:text-[3.5rem] font-semibold leading-[1.1] tracking-tight text-[#010101] lg:text-white transition-colors duration-300">
                Intelligent document extraction & financial audit platform
              </h1>

              {/* Email / Ingestion CTA */}
              <div className="mt-6 sm:mt-8 flex flex-col gap-3 sm:inline-flex sm:flex-row sm:items-center sm:gap-0 sm:rounded-full sm:bg-white sm:p-1.5">
                <input
                  type="text"
                  placeholder="Upload Invoices, Balance Sheets, P&L..."
                  readOnly
                  onClick={() => setIsUploadModalOpen(true)}
                  className="cursor-pointer rounded-full bg-white px-5 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none sm:w-72 sm:rounded-none sm:bg-transparent sm:px-4 sm:py-2"
                />
                <button 
                  onClick={() => setIsUploadModalOpen(true)}
                  className="rounded-full px-6 py-3 sm:py-2.5 text-sm font-medium text-white cta-gradient transition-opacity duration-200 text-center"
                >
                  Process Document
                </button>
              </div>
            </div>

            {/* Right Column: Two Neostats Glass Cards */}
            <div className="flex flex-col gap-4 sm:flex-row lg:w-auto lg:gap-5">
              {/* Stats Card */}
              <div className="sm:w-64 flex flex-col justify-between rounded-2xl bg-white/10 backdrop-blur-lg p-5 sm:p-6">
                <div>
                  <div className="font-silkscreen text-3xl sm:text-4xl font-normal tracking-tight text-[#010101] lg:text-white transition-colors duration-300">
                    99.8%
                  </div>
                  <p className="text-sm leading-relaxed mt-3 sm:mt-4 text-[#010101]/70 lg:text-white/70 transition-colors duration-300">
                    Financial accuracy rate achieved across Invoices, Balance Sheets & Cash Flow reconciliations.
                  </p>
                </div>
              </div>

              {/* Testimonial / Platform Audit Card */}
              <div className="sm:w-64 rounded-2xl bg-white/10 backdrop-blur-lg p-5 sm:p-6">
                {/* Neostats Header Row */}
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <div className="h-6 w-6 rounded-md bg-black flex items-center justify-center text-xs font-bold text-white">
                    N
                  </div>
                  <span className="text-sm font-semibold text-[#010101] lg:text-white transition-colors duration-300">
                    Neostats API
                  </span>
                </div>

                {/* Quote */}
                <p className="text-sm leading-relaxed text-[#010101]/80 lg:text-white/80 transition-colors duration-300">
                  "Extracted structured key-value pairs and line items with verbatim grounding evidence & zero hallucination."
                </p>

                {/* Footer User Profile */}
                <div className="flex items-center gap-3 mt-4 sm:mt-5">
                  <img
                    src="https://i.pravatar.cc/72?img=60"
                    alt="HDFC Financial Audit"
                    className="h-9 w-9 rounded-full object-cover bg-white/20"
                  />
                  <div>
                    <div className="text-sm font-semibold text-[#010101] lg:text-white transition-colors duration-300">
                      HDFC Financial Audit
                    </div>
                    <div className="text-xs text-[#010101]/60 lg:text-white/60 transition-colors duration-300">
                      Enterprise Validation Engine
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Modal Window for Document Ingestion & Extraction */}
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900/95 border border-white/20 p-6 text-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              <button 
                onClick={() => setIsUploadModalOpen(false)}
                className="absolute right-4 top-4 rounded-full p-2 text-gray-400 hover:bg-white/10 hover:text-white"
              >
                <X size={20} />
              </button>

              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Sparkles size={20} className="text-indigo-400" /> Neostats Document Intelligence Processor
              </h2>

              <form onSubmit={handleProcessSubmit} className="space-y-4">
                <div className="border-2 border-dashed border-indigo-500/40 rounded-xl p-6 text-center bg-slate-950/50 hover:border-indigo-400 transition-colors cursor-pointer" onClick={() => document.getElementById('modal-file').click()}>
                  <input 
                    id="modal-file" 
                    type="file" 
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange} 
                    className="hidden" 
                  />
                  <Upload size={32} className="mx-auto text-indigo-400 mb-2" />
                  {file ? (
                    <div>
                      <p className="font-semibold">{file.name}</p>
                      <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB • Ready for extraction</p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-semibold">Click or drag financial document (PDF, JPG, PNG)</p>
                      <p className="text-xs text-gray-400">Max 10 MB, ≤ 3 pages</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <select 
                    value={docType} 
                    onChange={(e) => setDocType(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-white/15 text-white outline-none"
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
                    className="px-6 py-3 rounded-xl font-semibold text-white cta-gradient whitespace-nowrap disabled:opacity-50"
                  >
                    {isProcessing ? "Processing..." : "Execute Extraction"}
                  </button>
                </div>
              </form>

              {isProcessing && (
                <div className="mt-4 text-center text-sm text-cyan-400 animate-pulse">
                  {currentStep}
                </div>
              )}

              {errorMsg && (
                <div className="mt-4 p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-sm">
                  {errorMsg}
                </div>
              )}

              {result && (
                <div className="mt-4 flex-1 overflow-y-auto border-t border-white/10 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">{result.document_type}</span>
                    <div className="flex items-center gap-2">
                      {renderStatusPill(result.validation?.status)}
                      <span className="text-xs px-2 py-1 rounded-md bg-indigo-500/30 text-indigo-300 font-bold">
                        {(result.processing_metadata?.overall_confidence_score * 100).toFixed(0)}% Confidence
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 mb-3">
                    <button 
                      onClick={() => setResultSubTab('json')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${resultSubTab === 'json' ? 'bg-indigo-600 text-white' : 'bg-white/10 text-gray-300'}`}
                    >
                      Extracted JSON
                    </button>
                    <button 
                      onClick={() => setResultSubTab('validation')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${resultSubTab === 'validation' ? 'bg-indigo-600 text-white' : 'bg-white/10 text-gray-300'}`}
                    >
                      Math Rule Audit ({result.validation?.rules_executed?.length || 0})
                    </button>
                  </div>

                  {resultSubTab === 'json' && (
                    <div className="json-viewer max-h-60 overflow-y-auto">
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
          </div>
        )}
      </div>
    </section>
  );
}
