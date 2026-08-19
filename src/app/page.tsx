import { getAppEnvironment } from '@/lib/environment';

const PIPELINE_CHECKS = [
  { label: 'Lint', status: 'PASSING', icon: '\u2713' },
  { label: 'Type Check', status: 'PASSING', icon: '\u2713' },
  { label: 'Unit Tests', status: 'PASSING', icon: '\u2713' },
  { label: 'E2E Tests', status: 'PASSING', icon: '\u2713' },
  { label: 'Security Scan', status: 'PASSING', icon: '\u2713' },
  { label: 'Build', status: 'PASSING', icon: '\u2713' },
] as const;

const ENV_COLORS: Record<string, string> = {
  development: '#3b82f6',
  staging: '#f59e0b',
  production: '#22c55e',
  test: '#a855f7',
};

export default function HomePage() {
  const env = getAppEnvironment();
  const envColor = ENV_COLORS[env.environment] ?? '#3b82f6';

  return (
    <main className="page" id="main-content">
      <div className="bg-glow bg-glow-top" aria-hidden="true" />
      <div className="bg-glow bg-glow-bottom" aria-hidden="true" />

      <div className="container">
        {/* Header */}
        <header className="header">
          <div className="logo-mark" aria-hidden="true">
            <span className="logo-icon">📺</span>
          </div>
          <div className="header-text">
            <h1 className="brand-name" id="main-heading">
              TV Sales <span className="brand-amp">&amp;</span> Home
            </h1>
            <p className="brand-tagline">DevOps Platform</p>
          </div>
          <div
            className="env-badge"
            style={{ borderColor: `${envColor}40`, color: envColor }}
            data-testid="environment-badge"
          >
            <span className="env-dot" style={{ backgroundColor: envColor }} />
            {env.environment.toUpperCase()}
          </div>
        </header>

        {/* System Status */}
        <section className="hero" aria-label="System Status">
          <div className="system-status" data-testid="system-status">
            <span className="status-dot-green" aria-hidden="true" />
            <span>All Systems Operational</span>
          </div>
          <p className="version-label">v{env.version}</p>
        </section>

        {/* Pipeline Dashboard */}
        <section className="dashboard" aria-label="CI/CD Pipeline Status" data-testid="pipeline-dashboard">
          <div className="section-header">
            <h2 className="section-title">CI/CD Pipeline</h2>
            <span className="section-badge">LIVE</span>
          </div>
          <div className="pipeline-grid">
            {PIPELINE_CHECKS.map((check) => (
              <div
                key={check.label}
                className="pipeline-item"
                data-testid={`pipeline-check-${check.label.toLowerCase().replace(/ /g, '-')}`}
              >
                <div className="pipeline-icon pass" aria-hidden="true">{check.icon}</div>
                <div className="pipeline-info">
                  <span className="pipeline-label">{check.label}</span>
                  <span className="pipeline-status pass">{check.status}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Info Grid */}
        <section className="info-grid" aria-label="Environment Details">
          <div className="info-card">
            <h2 className="info-card-title">Environment</h2>
            <div className="info-rows">
              <div className="info-row">
                <span className="info-key">Active</span>
                <span className="info-value" style={{ color: envColor }} data-testid="current-environment">
                  {env.environment}
                </span>
              </div>
              <div className="info-row">
                <span className="info-key">Version</span>
                <span className="info-value mono">{env.version}</span>
              </div>
              <div className="info-row">
                <span className="info-key">URL</span>
                <span className="info-value mono">{env.appUrl}</span>
              </div>
            </div>
          </div>

          <div className="info-card">
            <h2 className="info-card-title">Deployment</h2>
            <div className="info-rows">
              <div className="info-row">
                <span className="info-key">Target</span>
                <span className="info-value">Hostinger</span>
              </div>
              <div className="info-row">
                <span className="info-key">Method</span>
                <span className="info-value">SSH + rsync</span>
              </div>
              <div className="info-row">
                <span className="info-key">Health</span>
                <span className="info-value pass" data-testid="health-status">/api/health \u2713</span>
              </div>
            </div>
          </div>

          <div className="info-card">
            <h2 className="info-card-title">Git Workflow</h2>
            <div className="branch-flow">
              <span className="branch feature">feature/*</span>
              <span className="branch-arrow">\u2193</span>
              <span className="branch develop">develop</span>
              <span className="branch-arrow">\u2193</span>
              <span className="branch staging">staging</span>
              <span className="branch-arrow">\u2193</span>
              <span className="branch main">main</span>
            </div>
          </div>
        </section>

        {/* Workflows */}
        <section className="workflows" aria-label="GitHub Actions Workflows">
          <div className="section-header">
            <h2 className="section-title">GitHub Actions</h2>
          </div>
          <div className="workflow-list">
            {[
              { name: 'CI', trigger: 'push / pull_request', status: 'ACTIVE' },
              { name: 'Security', trigger: 'push / schedule', status: 'ACTIVE' },
              { name: 'CD Development', trigger: 'push to develop', status: 'READY' },
              { name: 'CD Staging', trigger: 'push to staging', status: 'READY' },
              { name: 'CD Production', trigger: 'push to main', status: 'READY' },
            ].map((wf) => (
              <div key={wf.name} className="workflow-item">
                <span className="workflow-name">{wf.name}</span>
                <span className="workflow-trigger">{wf.trigger}</span>
                <span className={`workflow-status ${wf.status === 'ACTIVE' ? 'active' : 'ready'}`}>
                  {wf.status}
                </span>
              </div>
            ))}
          </div>
        </section>

        <footer className="footer">
          <p className="footer-text">TV Sales &amp; Home &mdash; Engineering Platform v{env.version}</p>
          <p className="footer-sub">GitHub Free &bull; Hostinger &bull; Next.js 14</p>
        </footer>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.4} }
        .page{position:relative;min-height:100vh;padding:2rem 1rem;overflow:hidden}
        .bg-glow{position:fixed;border-radius:50%;filter:blur(120px);pointer-events:none;z-index:0}
        .bg-glow-top{top:-20%;left:50%;transform:translateX(-50%);width:800px;height:400px;background:radial-gradient(ellipse,rgba(249,115,22,0.08) 0%,transparent 70%)}
        .bg-glow-bottom{bottom:-20%;right:-20%;width:600px;height:400px;background:radial-gradient(ellipse,rgba(59,130,246,0.05) 0%,transparent 70%)}
        .container{position:relative;z-index:1;max-width:900px;margin:0 auto;display:flex;flex-direction:column;gap:1.5rem}
        .header{display:flex;align-items:center;gap:1.25rem;padding:1.5rem;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:1rem;backdrop-filter:blur(8px)}
        .logo-mark{display:flex;align-items:center;justify-content:center;width:52px;height:52px;background:rgba(249,115,22,0.12);border:1px solid rgba(249,115,22,0.3);border-radius:0.75rem;flex-shrink:0}
        .logo-icon{font-size:1.5rem}
        .header-text{flex:1}
        .brand-name{font-size:1.4rem;font-weight:700;color:#f5f5f5;letter-spacing:-0.02em;line-height:1.2}
        .brand-amp{color:#f97316}
        .brand-tagline{font-size:0.78rem;color:#737373;text-transform:uppercase;letter-spacing:0.08em;margin-top:2px}
        .env-badge{display:flex;align-items:center;gap:0.4rem;padding:0.375rem 0.75rem;border:1px solid;border-radius:2rem;font-size:0.68rem;font-weight:600;letter-spacing:0.1em;font-family:'JetBrains Mono',monospace;white-space:nowrap}
        .env-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0;animation:pulse 2s infinite}
        .hero{display:flex;align-items:center;justify-content:space-between;padding:1rem 1.5rem;background:rgba(34,197,94,0.05);border:1px solid rgba(34,197,94,0.15);border-radius:0.75rem}
        .system-status{display:flex;align-items:center;gap:0.5rem;font-size:0.9rem;font-weight:500;color:#22c55e}
        .status-dot-green{width:8px;height:8px;background:#22c55e;border-radius:50%;animation:pulse 2s infinite;flex-shrink:0}
        .version-label{font-size:0.75rem;color:#525252;font-family:'JetBrains Mono',monospace}
        .dashboard,.workflows{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.07);border-radius:1rem;padding:1.5rem}
        .section-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:1.25rem}
        .section-title{font-size:0.82rem;font-weight:600;color:#a3a3a3;text-transform:uppercase;letter-spacing:0.08em}
        .section-badge{font-size:0.62rem;font-weight:700;color:#f97316;background:rgba(249,115,22,0.12);border:1px solid rgba(249,115,22,0.25);padding:0.2rem 0.5rem;border-radius:0.25rem;letter-spacing:0.1em;font-family:'JetBrains Mono',monospace;animation:pulse 3s infinite}
        .pipeline-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:0.75rem}
        .pipeline-item{display:flex;align-items:center;gap:0.75rem;padding:0.75rem 1rem;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:0.625rem;transition:border-color 0.25s ease,transform 0.25s ease}
        .pipeline-item:hover{border-color:rgba(34,197,94,0.3);transform:translateY(-1px)}
        .pipeline-icon{width:28px;height:28px;border-radius:0.375rem;display:flex;align-items:center;justify-content:center;font-size:0.85rem;font-weight:700;flex-shrink:0}
        .pipeline-icon.pass{background:rgba(34,197,94,0.12);color:#22c55e;border:1px solid rgba(34,197,94,0.25)}
        .pipeline-info{display:flex;flex-direction:column;gap:1px}
        .pipeline-label{font-size:0.85rem;font-weight:500;color:#e5e5e5}
        .pipeline-status{font-size:0.68rem;font-weight:600;letter-spacing:0.06em;font-family:'JetBrains Mono',monospace}
        .pipeline-status.pass{color:#22c55e}
        .info-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1rem}
        .info-card{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.07);border-radius:1rem;padding:1.25rem}
        .info-card-title{font-size:0.78rem;font-weight:600;color:#737373;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:1rem}
        .info-rows{display:flex;flex-direction:column;gap:0.625rem}
        .info-row{display:flex;align-items:center;justify-content:space-between;gap:0.5rem}
        .info-key{font-size:0.78rem;color:#525252}
        .info-value{font-size:0.78rem;color:#e5e5e5;font-weight:500}
        .info-value.pass{color:#22c55e}
        .info-value.mono{font-family:'JetBrains Mono',monospace;font-size:0.7rem}
        .branch-flow{display:flex;flex-direction:column;align-items:flex-start;gap:0.3rem}
        .branch{font-size:0.73rem;font-family:'JetBrains Mono',monospace;font-weight:500;padding:0.2rem 0.5rem;border-radius:0.25rem}
        .branch.feature{background:rgba(168,85,247,0.1);color:#a855f7}
        .branch.develop{background:rgba(59,130,246,0.1);color:#3b82f6}
        .branch.staging{background:rgba(245,158,11,0.1);color:#f59e0b}
        .branch.main{background:rgba(34,197,94,0.1);color:#22c55e}
        .branch-arrow{font-size:0.73rem;color:#525252;margin-left:0.625rem}
        .workflow-list{display:flex;flex-direction:column;gap:0.5rem}
        .workflow-item{display:flex;align-items:center;gap:1rem;padding:0.625rem 0.875rem;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);border-radius:0.5rem;transition:border-color 0.2s ease}
        .workflow-item:hover{border-color:rgba(249,115,22,0.2)}
        .workflow-name{font-size:0.82rem;font-weight:600;color:#e5e5e5;min-width:120px}
        .workflow-trigger{font-size:0.73rem;color:#525252;font-family:'JetBrains Mono',monospace;flex:1}
        .workflow-status{font-size:0.62rem;font-weight:700;letter-spacing:0.08em;padding:0.2rem 0.5rem;border-radius:0.25rem;font-family:'JetBrains Mono',monospace}
        .workflow-status.active{background:rgba(34,197,94,0.1);color:#22c55e;border:1px solid rgba(34,197,94,0.2)}
        .workflow-status.ready{background:rgba(249,115,22,0.1);color:#f97316;border:1px solid rgba(249,115,22,0.2)}
        .footer{text-align:center;padding:1.5rem 0 0.5rem;border-top:1px solid rgba(255,255,255,0.05)}
        .footer-text{font-size:0.78rem;color:#404040}
        .footer-sub{font-size:0.7rem;color:#2a2a2a;margin-top:0.25rem}
        @media(max-width:640px){.header{flex-wrap:wrap}.pipeline-grid{grid-template-columns:1fr 1fr}.info-grid{grid-template-columns:1fr}.workflow-trigger{display:none}}
      `}</style>
    </main>
  );
}
