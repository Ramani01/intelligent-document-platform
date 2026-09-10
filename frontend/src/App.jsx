import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Cpu, 
  Database, 
  Search, 
  RefreshCw, 
  ShieldCheck, 
  Layers, 
  Code, 
  TrendingUp,
  FileCheck,
  Zap,
  Activity,
  Sparkles
} from 'lucide-react';

const API_BASE_URL = "http://localhost:8000/api/v1";

export default function App() {
  const [activeTab, setActiveTab] = useState('upload');
  const [resultSubTab, setResultSubTab] = useState('json');
  
  // Upload State
  const [file, setFile] = useState(null);
  const [docType, setDocType] = useState('AUTO_DETECT');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState('');
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // History State
  const [history, setHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  // Health State
  const [healthStatus, setHealthStatus] = useState(null);

  useEffect(() => {
    fetchHealth();
    fetchHistory();
  }, []);

  const fetchHealth = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      if (res.ok) {
        const data = await res.json();
        setHealthStatus(data);
      }
    } catch (e) {
      console.warn("Backend API offline or unreachable:", e);
    }
  };

  const fetchHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const res = await fetch(`${API_BASE_URL}/documents?limit=50`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data.documents || []);
      }
    } catch (e) {
      console.warn("Failed to fetch history:", e);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setErrorMsg(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setErrorMsg(null);
    }
  };

  const handleProcessSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setIsProcessing(true);
    setErrorMsg(null);
    setResult(null);

    setCurrentStep('Validating file format & page boundaries...');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('document_type', docType);

    try {
      setTimeout(() => setCurrentStep('Rasterizing & running OCR extraction engine...'), 600);
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
      fetchHistory();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsProcessing(false);
      setCurrentStep('');
    }
  };

  const loadSingleRecord = async (docName) => {
    try {
      const res = await fetch(`${API_BASE_URL}/documents/${encodeURIComponent(docName)}`);
      if (res.ok) {
        const data = await res.json();
        setResult(data);
        setActiveTab('upload');
      }
    } catch (e) {
      console.error(e);
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

  const filteredHistory = history.filter(h => 
    h.document_name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    h.document_type.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 3D Elevated Header Bar */}
      <header className="glass-panel-3d" style={{ margin: '20px 32px', padding: '18px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }} className="depth-layer">
            <div style={{ 
              width: '46px', height: '46px', borderRadius: '14px', 
              background: 'linear-gradient(135deg, #6366f1, #06b6d4)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(99, 102, 241, 0.5), inset 0 1px 0 rgba(255,255,255,0.4)',
              transform: 'rotateY(10deg)'
            }}>
              <ShieldCheck size={26} color="#fff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1 style={{ 
                  fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.02em', 
                  background: 'linear-gradient(90deg, #ffffff, #94a3b8)', 
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' 
                }}>
                  Neostats Intelligence
                </h1>
                <span style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.25)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.4)', fontWeight: 700 }}>
                  3D v1.0
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                AI Document Extraction, Deterministic Financial Validation & API Gateway
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div className="metric-card-3d">
              <Activity size={18} color="#06b6d4" />
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Status</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: healthStatus ? '#10b981' : '#ef4444' }}>
                  {healthStatus ? 'API Online' : 'Standby'}
                </div>
              </div>
            </div>

            <nav style={{ display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.4)', padding: '6px', borderRadius: '14px', border: '1px solid var(--border-light)' }}>
              <button 
                className={`nav-tab ${activeTab === 'upload' ? 'active' : ''}`}
                onClick={() => setActiveTab('upload')}
              >
                <Zap size={16} /> Process Document
              </button>
              <button 
                className={`nav-tab ${activeTab === 'explorer' ? 'active' : ''}`}
                onClick={() => { setActiveTab('explorer'); fetchHistory(); }}
              >
                <Database size={16} /> Explorer ({history.length})
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '0 32px 40px 32px', maxWidth: '1500px', margin: '0 auto', width: '100%' }}>
        {activeTab === 'upload' && (
          <div style={{ display: 'grid', gridTemplateColumns: result ? '1fr 1fr' : '1fr', gap: '28px' }}>
            {/* Form Section Card */}
            <div className="glass-panel-3d" style={{ padding: '30px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }} className="depth-layer">
                <Sparkles size={22} color="#6366f1" /> Financial Document Processing
              </h2>

              <form onSubmit={handleProcessSubmit}>
                {/* 3D Drag and Drop Zone */}
                <div 
                  className={`dropzone-3d ${file ? 'active' : ''}`}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('file-input').click()}
                  style={{ marginBottom: '24px' }}
                >
                  <input 
                    id="file-input" 
                    type="file" 
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange} 
                    style={{ display: 'none' }} 
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }} className="depth-layer">
                    <div style={{ 
                      width: '56px', height: '56px', borderRadius: '18px', 
                      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(6, 182, 212, 0.25))', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)'
                    }}>
                      <Upload size={28} color="#38bdf8" />
                    </div>
                    {file ? (
                      <div>
                        <p style={{ fontWeight: 700, color: '#fff', fontSize: '1rem' }}>{file.name}</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {(file.size / 1024).toFixed(1)} KB • Click or drag to replace
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p style={{ fontWeight: 700, color: '#fff', fontSize: '1rem' }}>Drop document here or click to browse</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                          Supports PDF, JPG, PNG (Max 10 MB, ≤ 3 pages)
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Document Type Selector */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Document Type Target
                  </label>
                  <select 
                    value={docType} 
                    onChange={(e) => setDocType(e.target.value)}
                    style={{
                      width: '100%', padding: '14px', borderRadius: '12px', 
                      background: '#040711', border: '1px solid var(--border-light)', 
                      color: '#fff', fontSize: '0.95rem', outline: 'none',
                      boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.5)'
                    }}
                  >
                    <option value="AUTO_DETECT">⚡ Auto-Detect Document Type</option>
                    <option value="INVOICE">📄 Invoice</option>
                    <option value="BALANCE_SHEET">📊 Balance Sheet</option>
                    <option value="PROFIT_AND_LOSS">📈 Profit & Loss Statement</option>
                    <option value="CASH_FLOW">💵 Cash Flow Statement</option>
                  </select>
                </div>

                {errorMsg && (
                  <div style={{ padding: '14px 18px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#ef4444', fontSize: '0.85rem', marginBottom: '24px' }}>
                    <strong>Error:</strong> {typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg)}
                  </div>
                )}

                <button 
                  type="submit" 
                  className="btn-primary-3d" 
                  disabled={!file || isProcessing}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw size={20} className="spin" style={{ animation: 'spin 1s linear infinite' }} /> Processing Pipeline...
                    </>
                  ) : (
                    <>
                      <Cpu size={20} /> Execute Intelligence Pipeline
                    </>
                  )}
                </button>

                {isProcessing && (
                  <div style={{ marginTop: '18px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                    {currentStep}
                  </div>
                )}
              </form>
            </div>

            {/* Results Panel */}
            {result && (
              <div className="glass-panel-3d" style={{ padding: '30px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--border-light)' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-cyan)', fontWeight: 800 }}>
                      {result.document_type}
                    </span>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: '2px' }}>{result.document_name}</h3>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {renderStatusPill(result.validation?.status)}
                    <div style={{ padding: '6px 14px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.25)', color: '#a5b4fc', fontSize: '0.85rem', fontWeight: 800, border: '1px solid rgba(99, 102, 241, 0.4)', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                      Score: {(result.processing_metadata?.overall_confidence_score * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>

                {/* Sub-tabs */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px' }}>
                  <button 
                    className={`nav-tab ${resultSubTab === 'json' ? 'active' : ''}`}
                    onClick={() => setResultSubTab('json')}
                    style={{ fontSize: '0.85rem', padding: '8px 14px' }}
                  >
                    <Code size={16} /> Extracted Data JSON
                  </button>
                  <button 
                    className={`nav-tab ${resultSubTab === 'validation' ? 'active' : ''}`}
                    onClick={() => setResultSubTab('validation')}
                    style={{ fontSize: '0.85rem', padding: '8px 14px' }}
                  >
                    <ShieldCheck size={16} /> Math Rule Audit ({result.validation?.rules_executed?.length || 0})
                  </button>
                </div>

                {/* Sub-tab Content */}
                <div style={{ flex: 1 }}>
                  {resultSubTab === 'json' && (
                    <div className="json-viewer">
                      <pre>{JSON.stringify(result.extracted_data, null, 2)}</pre>
                    </div>
                  )}

                  {resultSubTab === 'validation' && (
                    <div>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                        {result.validation?.summary}
                      </p>
                      <table className="custom-table">
                        <thead>
                          <tr>
                            <th>Rule ID</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Calculated</th>
                            <th>Expected</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(result.validation?.rules_executed || []).map((rule, idx) => (
                            <tr key={idx}>
                              <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                                {rule.rule_id}
                              </td>
                              <td style={{ fontSize: '0.85rem' }}>{rule.description}</td>
                              <td>{renderStatusPill(rule.status)}</td>
                              <td style={{ fontFamily: 'var(--font-mono)' }}>{rule.calculated_value ?? '-'}</td>
                              <td style={{ fontFamily: 'var(--font-mono)' }}>{rule.expected_value ?? '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Explorer Tab */}
        {activeTab === 'explorer' && (
          <div className="glass-panel-3d" style={{ padding: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Document Repository</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  View latest records, financial validation statuses, and confidence scores
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="text" 
                    placeholder="Search documents..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    style={{
                      padding: '10px 14px 10px 38px', borderRadius: '12px',
                      background: '#040711', border: '1px solid var(--border-light)',
                      color: '#fff', fontSize: '0.85rem', outline: 'none',
                      boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.5)'
                    }}
                  />
                </div>
                <button className="nav-tab" onClick={fetchHistory}>
                  <RefreshCw size={16} /> Refresh
                </button>
              </div>
            </div>

            {isLoadingHistory ? (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '50px' }}>Loading repository records...</p>
            ) : filteredHistory.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '50px' }}>No document records found.</p>
            ) : (
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Document Name</th>
                    <th>Document Type</th>
                    <th>Validation Status</th>
                    <th>Confidence</th>
                    <th>Processed At</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map((item) => (
                    <tr key={item.id}>
                      <td style={{ color: 'var(--text-dim)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>#{item.id}</td>
                      <td style={{ fontWeight: 700, color: '#fff' }}>{item.document_name}</td>
                      <td>
                        <span style={{ fontSize: '0.75rem', padding: '3px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                          {item.document_type}
                        </span>
                      </td>
                      <td>{renderStatusPill(item.validation_status)}</td>
                      <td>
                        <span style={{ fontWeight: 800, color: item.overall_confidence_score > 0.8 ? '#10b981' : '#f59e0b' }}>
                          {(item.overall_confidence_score * 100).toFixed(0)}%
                        </span>
                      </td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.created_at}</td>
                      <td>
                        <button 
                          className="nav-tab" 
                          style={{ padding: '6px 12px', fontSize: '0.8rem', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)' }}
                          onClick={() => loadSingleRecord(item.document_name)}
                        >
                          View Record
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </main>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
