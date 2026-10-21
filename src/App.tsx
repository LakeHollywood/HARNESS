import { useState, useEffect, useRef } from 'react';

// ─── Icon Components ─────────────────────────────────────────────────────────
function ShieldIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  );
}

function LockIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  );
}

function BoltIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  );
}

function CubeIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
    </svg>
  );
}

function LinkIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.54a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L4.34 8.374" />
    </svg>
  );
}

function EyeIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function ChevronRight({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  );
}

function GithubIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  );
}

// ─── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = "", duration = 2000 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// ─── Pipeline Stage Component ─────────────────────────────────────────────────
function PipelineStage({ name, label, active, index }: { name: string; label: string; active: boolean; index: number }) {
  return (
    <div className={`relative flex flex-col items-center transition-all duration-500 ${active ? 'scale-105' : 'scale-100 opacity-60'}`}>
      <div
        className={`w-14 h-14 rounded-xl flex items-center justify-center text-xs font-bold border-2 transition-all duration-500 ${
          active
            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-lg shadow-emerald-500/20'
            : 'bg-slate-800/50 border-slate-600 text-slate-400'
        }`}
      >
        {index + 1}
      </div>
      <span className={`mt-2 text-xs font-medium ${active ? 'text-emerald-300' : 'text-slate-500'}`}>
        {name}
      </span>
      <span className={`text-[10px] mt-0.5 ${active ? 'text-slate-300' : 'text-slate-600'}`}>
        {label}
      </span>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [activeStage, setActiveStage] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const stages = [
    { name: 'Idle', label: 'Awaiting' },
    { name: 'PreExec', label: 'Guard' },
    { name: 'Evaluate', label: 'Pure State' },
    { name: 'Execute', label: 'Atomic' },
    { name: 'Sealed', label: 'Verified' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % stages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [stages.length]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* ─── Navigation ───────────────────────────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/50' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
                <ShieldIcon className="w-5 h-5 text-slate-900" />
              </div>
              <span className="font-bold text-lg tracking-tight">RUSTOLIA</span>
              <span className="hidden sm:inline text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">v1.0</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-slate-400 hover:text-white transition-colors">Features</a>
              <a href="#pipeline" className="text-sm text-slate-400 hover:text-white transition-colors">Pipeline</a>
              <a href="#architecture" className="text-sm text-slate-400 hover:text-white transition-colors">Architecture</a>
              <a href="#security" className="text-sm text-slate-400 hover:text-white transition-colors">Security</a>
              <a href="#getting-started" className="text-sm text-slate-400 hover:text-white transition-colors">Get Started</a>
            </div>
            <div className="flex items-center gap-3">
              <a href="https://github.com/LakeHollywood/RUSTOLIA" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700">
                <GithubIcon className="w-4 h-4" />
                <span className="hidden sm:inline">GitHub</span>
              </a>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-lg hover:bg-slate-800">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900/95 backdrop-blur-xl border-b border-slate-800">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block text-sm text-slate-400 hover:text-white">Features</a>
              <a href="#pipeline" className="block text-sm text-slate-400 hover:text-white">Pipeline</a>
              <a href="#architecture" className="block text-sm text-slate-400 hover:text-white">Architecture</a>
              <a href="#security" className="block text-sm text-slate-400 hover:text-white">Security</a>
              <a href="#getting-started" className="block text-sm text-slate-400 hover:text-white">Get Started</a>
            </div>
          </div>
        )}
      </nav>

      {/* ─── Hero Section ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center pt-16">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" style={{ transform: `translateY(${scrollY * 0.1}px)` }} />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" style={{ transform: `translateY(${scrollY * -0.1}px)` }} />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-slate-400">Sovereign Engine Security & Verification Pipeline</span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight mb-6">
            <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Sovereign
            </span>
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Engine
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Verifiable authority-boundary verification for autonomous systems.
            A <code className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded text-sm">no_std</code>-compatible Rust security core that enforces
            authority boundaries with cryptographic seals and tamper-evident lineage.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#getting-started" className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-900 font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all">
              Get Started
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
            <a href="https://github.com/LakeHollywood/RUSTOLIA" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-colors">
              <GithubIcon className="w-5 h-5" />
              View on GitHub
            </a>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { value: 364, suffix: '+', label: 'Commits' },
              { value: 71, suffix: '/71', label: 'Tests Pass' },
              { value: 12, suffix: '/12', label: 'Harness Suites' },
              { value: 0, suffix: '', label: 'no_std TCB' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </section>

      {/* ─── Features Section ─────────────────────────────────────────── */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Core Features</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              A comprehensive security pipeline designed for autonomous systems that demand provable authority boundaries and cryptographic integrity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <ShieldIcon className="w-6 h-6" />,
                title: 'Authority-Boundary Enforcement',
                description: 'Every action passes through capability checks, delegation-chain validation, and subject/agent authorization before execution.',
                color: 'emerald',
              },
              {
                icon: <BoltIcon className="w-6 h-6" />,
                title: 'Deterministic State Machine',
                description: 'Atomic execution transitions with pure state evaluation — no side effects before the guard passes.',
                color: 'cyan',
              },
              {
                icon: <LockIcon className="w-6 h-6" />,
                title: 'Cryptographic Seals & Receipts',
                description: 'Ed25519-signed seals over execution results, with hash-chained lineage for tamper evidence.',
                color: 'blue',
              },
              {
                icon: <EyeIcon className="w-6 h-6" />,
                title: 'Protocol & Time Verification',
                description: 'Replay-resistant protocol handling and temporal-bounds checks with skew tolerance.',
                color: 'violet',
              },
              {
                icon: <CubeIcon className="w-6 h-6" />,
                title: 'Zeroizable Secrets',
                description: 'Sensitive material wiped via zeroize; constant-time verification paths covered by dedicated tests.',
                color: 'rose',
              },
              {
                icon: <LinkIcon className="w-6 h-6" />,
                title: 'Formal Verification',
                description: 'TLA+ spec, Kani proofs, MIRI-checked tests, fuzz targets, and AAA falsification harness.',
                color: 'amber',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group relative p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-${feature.color}-500/10 text-${feature.color}-400 border border-${feature.color}-500/20`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white group-hover:text-emerald-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pipeline Section ─────────────────────────────────────────── */}
      <section id="pipeline" className="py-24 relative bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Execution Pipeline</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              A deterministic state-machine-driven execution pipeline ensures every transition is verified and sealed.
            </p>
          </div>

          {/* Pipeline visualization */}
          <div className="relative max-w-4xl mx-auto">
            {/* Connection line */}
            <div className="absolute top-7 left-[10%] right-[10%] h-0.5 bg-slate-800">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-700"
                style={{ width: `${(activeStage / (stages.length - 1)) * 100}%` }}
              />
            </div>

            <div className="flex justify-between items-start px-4 sm:px-8">
              {stages.map((stage, i) => (
                <PipelineStage
                  key={i}
                  name={stage.name}
                  label={stage.label}
                  active={i <= activeStage}
                  index={i}
                />
              ))}
            </div>

            {/* Pipeline description */}
            <div className="mt-12 p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <BoltIcon className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">
                    {stages[activeStage].name} — {stages[activeStage].label}
                  </h4>
                  <p className="text-sm text-slate-400">
                    {activeStage === 0 && 'System awaits incoming execution request. No state mutations occur until authority is established.'}
                    {activeStage === 1 && 'Pre-execution guard validates capabilities, delegation chains, and subject authorization. Fail-closed by default.'}
                    {activeStage === 2 && 'Pure state evaluator computes expected outcomes without side effects. Deterministic and replayable.'}
                    {activeStage === 3 && 'Atomic execution phase — state transitions are committed as a single unit. No partial updates.'}
                    {activeStage === 4 && 'Execution sealed with Ed25519 signature and SHA-256 hash chain. Tamper-evident receipt generated.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Architecture Section ─────────────────────────────────────── */}
      <section id="architecture" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Repository Architecture</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              A modular workspace with a no_std core library, HTTP service layer, and adversarial testing harness.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Directory tree */}
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 font-mono text-sm">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-2 text-xs text-slate-500">RUSTOLIA/</span>
              </div>
              <div className="space-y-1 text-slate-300">
                <div className="text-emerald-400">├── sovereign-engine/ <span className="text-slate-500"># no_std core library</span></div>
                <div className="pl-6 text-slate-400">└── src/ <span className="text-slate-500"># engine, agent, capability, seal...</span></div>
                <div className="text-cyan-400">├── src/ <span className="text-slate-500"># Host service (Axum + SQLx)</span></div>
                <div className="text-rose-400">├── aaa-falsification-harness/ <span className="text-slate-500"># Adversarial harness</span></div>
                <div className="text-violet-400">├── tests/ <span className="text-slate-500"># Integration: Kani, MIRI, TLA+</span></div>
                <div className="text-amber-400">├── fuzz/fuzz_targets/ <span className="text-slate-500"># cargo-fuzz targets</span></div>
                <div className="text-blue-400">├── migrations/ <span className="text-slate-500"># SQL performance migrations</span></div>
                <div className="text-slate-400">├── docs/specs/ <span className="text-slate-500"># Design specifications</span></div>
                <div className="text-slate-400">├── monitoring/ <span className="text-slate-500"># Prometheus, Grafana</span></div>
                <div className="text-slate-400">├── scripts/ <span className="text-slate-500"># Dev tooling</span></div>
                <div className="text-slate-400">└── .github/workflows/ <span className="text-slate-500"># CI pipelines</span></div>
              </div>
            </div>

            {/* Architecture cards */}
            <div className="space-y-4">
              <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-emerald-500/30 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <CubeIcon className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h4 className="font-semibold text-white">sovereign-engine</h4>
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">no_std</span>
                </div>
                <p className="text-sm text-slate-400">Core library crate suitable for embedded and bare-metal targets. Zero-allocation hot paths.</p>
              </div>

              <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/30 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                    <BoltIcon className="w-4 h-4 text-cyan-400" />
                  </div>
                  <h4 className="font-semibold text-white">sovereign_engine_service</h4>
                  <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400">std</span>
                </div>
                <p className="text-sm text-slate-400">HTTP service binary with Axum, SQLx persistence, and municipal audit worker.</p>
              </div>

              <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-rose-500/30 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
                    <ShieldIcon className="w-4 h-4 text-rose-400" />
                  </div>
                  <h4 className="font-semibold text-white">aaa-falsification-harness</h4>
                  <span className="text-xs px-2 py-0.5 rounded bg-rose-500/10 text-rose-400">adversarial</span>
                </div>
                <p className="text-sm text-slate-400">Actively attacks engine invariants before release. Fuzz targets and formal proofs.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Code Example Section ─────────────────────────────────────── */}
      <section className="py-24 relative bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Quick Start</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Build and run the Sovereign Engine in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Build commands */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-800/50 border-b border-slate-800">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-2 text-xs text-slate-500">terminal</span>
              </div>
              <div className="p-5 font-mono text-sm space-y-3">
                <div>
                  <span className="text-slate-500"># Build the entire workspace</span>
                  <div className="text-emerald-400">$ cargo build --workspace</div>
                </div>
                <div>
                  <span className="text-slate-500"># Build core library only (no_std)</span>
                  <div className="text-cyan-400">$ cargo build -p sovereign-engine --no-default-features</div>
                </div>
                <div>
                  <span className="text-slate-500"># Run the service</span>
                  <div className="text-violet-400">$ cargo run --bin sovereign_engine --features std</div>
                </div>
                <div>
                  <span className="text-slate-500"># Run tests</span>
                  <div className="text-amber-400">$ cargo test --workspace</div>
                </div>
              </div>
            </div>

            {/* API endpoints */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-800/50 border-b border-slate-800">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-2 text-xs text-slate-500">API Endpoints</span>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50">
                  <span className="px-2 py-1 rounded text-xs font-bold bg-emerald-500/20 text-emerald-400">GET</span>
                  <code className="text-sm text-slate-300">/health</code>
                  <span className="text-xs text-slate-500 ml-auto">Liveness check</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50">
                  <span className="px-2 py-1 rounded text-xs font-bold bg-blue-500/20 text-blue-400">POST</span>
                  <code className="text-sm text-slate-300">/lineage</code>
                  <span className="text-xs text-slate-500 ml-auto">Process lineage</span>
                </div>
                <div className="mt-4 p-3 rounded-lg bg-slate-800/30 border border-slate-700/50">
                  <div className="text-xs text-slate-500 mb-2">Configuration</div>
                  <div className="font-mono text-xs space-y-1">
                    <div><span className="text-emerald-400">DATABASE_URL</span> <span className="text-slate-500">= sqlite:sovereign.db?mode=rwc</span></div>
                    <div><span className="text-emerald-400">DB_MAX_CONNECTIONS</span> <span className="text-slate-500">= 50</span></div>
                    <div><span className="text-emerald-400">RUST_LOG</span> <span className="text-slate-500">= warn</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Security Section ─────────────────────────────────────────── */}
      <section id="security" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Security & Verification</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Multi-layered verification with formal methods, adversarial testing, and cryptographic guarantees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/50 border border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <LockIcon className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold">Cryptographic Integrity</h3>
              </div>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>Ed25519 signatures with ZIP215 strict verification</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>SHA-256 hash-chained lineage for tamper evidence</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>Post-quantum ready (Dilithium/ML-DSA feature-gated)</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>Constant-time verification paths</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/50 border border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                  <EyeIcon className="w-5 h-5 text-cyan-400" />
                </div>
                <h3 className="text-lg font-semibold">Formal Methods</h3>
              </div>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                  <span>TLA+ formal specification for state machine</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                  <span>Kani proofs for memory safety verification</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                  <span>MIRI-checked tests for undefined behavior</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                  <span>cargo-fuzz targets for temporal bounds</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/50 border border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20">
                  <ShieldIcon className="w-5 h-5 text-violet-400" />
                </div>
                <h3 className="text-lg font-semibold">Adversarial Testing</h3>
              </div>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-violet-400 mt-0.5 shrink-0" />
                  <span>AAA falsification harness actively attacks invariants</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-violet-400 mt-0.5 shrink-0" />
                  <span>Authority boundary assessment with exit-code gating</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-violet-400 mt-0.5 shrink-0" />
                  <span>STS-RBA replay verification traces</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-violet-400 mt-0.5 shrink-0" />
                  <span>Domain-separated evidence binding</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/50 border border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                  <BoltIcon className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="text-lg font-semibold">Performance</h3>
              </div>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                  <span>Fat LTO with codegen-units = 1</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                  <span>Zero-copy wire format with compile-time layout assertions</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                  <span>WAL-mode pooled SQLite with N+1 elimination</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                  <span>Criterion benchmarks for hot-path comparison</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Getting Started Section ──────────────────────────────────── */}
      <section id="getting-started" className="py-24 relative bg-slate-900/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Get Started</span>
            </h2>
            <p className="text-slate-400">
              Prerequisites and setup for running Sovereign Engine.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4 p-5 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400 font-bold text-sm">1</div>
              <div>
                <h4 className="font-semibold text-white mb-1">Install Rust Toolchain</h4>
                <p className="text-sm text-slate-400">Rust edition 2021 required. Install via <code className="text-emerald-400 bg-emerald-500/10 px-1 rounded">rustup</code></p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400 font-bold text-sm">2</div>
              <div>
                <h4 className="font-semibold text-white mb-1">Clone the Repository</h4>
                <code className="text-sm text-cyan-400 bg-slate-800 px-3 py-1.5 rounded-lg block mt-2">git clone https://github.com/LakeHollywood/RUSTOLIA.git</code>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400 font-bold text-sm">3</div>
              <div>
                <h4 className="font-semibold text-white mb-1">Configure Environment</h4>
                <code className="text-sm text-cyan-400 bg-slate-800 px-3 py-1.5 rounded-lg block mt-2">cp .env.example .env</code>
                <p className="text-xs text-slate-500 mt-2">Adjust DATABASE_URL, DB_MAX_CONNECTIONS, RUST_LOG as needed</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400 font-bold text-sm">4</div>
              <div>
                <h4 className="font-semibold text-white mb-1">Build & Run</h4>
                <code className="text-sm text-cyan-400 bg-slate-800 px-3 py-1.5 rounded-lg block mt-2">cargo run --bin sovereign_engine --features std</code>
                <p className="text-xs text-slate-500 mt-2">Service listens on 127.0.0.1:3000 by default</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Cargo Features Table ─────────────────────────────────────── */}
      <section className="py-24 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Cargo Features</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                Core Crate <span className="text-xs text-slate-500">(sovereign-engine)</span>
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-slate-800">
                  <code className="text-sm text-emerald-400">std</code>
                  <span className="text-xs text-slate-500">Standard library mode (default)</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-slate-800">
                  <code className="text-sm text-emerald-400">sqlite</code>
                  <span className="text-xs text-slate-500">rusqlite persistence (implies std)</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400" />
                Service Crate <span className="text-xs text-slate-500">(sovereign_engine_service)</span>
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-slate-800">
                  <code className="text-sm text-cyan-400">std</code>
                  <span className="text-xs text-slate-500">Standard library dependencies</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-slate-800">
                  <code className="text-sm text-cyan-400">serde-support</code>
                  <span className="text-xs text-slate-500">Serde serialization</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────────────────────────── */}
      <footer className="py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
                  <ShieldIcon className="w-5 h-5 text-slate-900" />
                </div>
                <span className="font-bold text-lg">RUSTOLIA</span>
              </div>
              <p className="text-sm text-slate-400">
                Sovereign Engine Security & Verification Pipeline.
                Verifiable authority-boundary verification for autonomous systems.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="https://github.com/LakeHollywood/RUSTOLIA" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">GitHub Repository</a></li>
                <li><a href="https://github.com/LakeHollywood/RUSTOLIA/tree/main/docs/specs" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">Design Specifications</a></li>
                <li><a href="https://github.com/LakeHollywood/RUSTOLIA/blob/main/SECURITY.md" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">Security Policy</a></li>
                <li><a href="https://github.com/LakeHollywood/RUSTOLIA/releases" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">Releases</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Documentation</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="https://github.com/LakeHollywood/RUSTOLIA/blob/main/docs/specs/agent-evidence-ring.md" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">Agent Evidence Ring</a></li>
                <li><a href="https://github.com/LakeHollywood/RUSTOLIA/blob/main/docs/specs/phase4_portable_attestation.md" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">Portable Attestation</a></li>
                <li><a href="https://github.com/LakeHollywood/RUSTOLIA/blob/main/PERFORMANCE_OPTIMIZATION.md" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">Performance Guide</a></li>
                <li><a href="https://github.com/LakeHollywood/RUSTOLIA/blob/main/tests/SovereignEngine.tla" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">TLA+ Specification</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-slate-500">
              © 2026 Kris Park / Master Combine. Dual licensed under MIT OR Apache-2.0.
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700">MIT</span>
              <span className="text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700">Apache-2.0</span>
              <a href="https://github.com/LakeHollywood/RUSTOLIA" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                <GithubIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
