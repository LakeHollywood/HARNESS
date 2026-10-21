import { useState, useEffect, useRef } from 'react';

// ─── Icon Components ─────────────────────────────────────────────────────────
function ServerIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 17.25v-.228a4.5 4.5 0 00-.12-1.03l-2.268-9.64a3.375 3.375 0 00-3.285-2.602H7.923a3.375 3.375 0 00-3.285 2.602l-2.268 9.64a4.5 4.5 0 00-.12 1.03v.228m19.5 0a3 3 0 01-3 3H5.25a3 3 0 01-3-3m19.5 0a3 3 0 00-3-3H5.25a3 3 0 00-3 3m16.5 0h.008v.008h-.008v-.008zm-3 0h.008v.008h-.008v-.008z" />
    </svg>
  );
}

function PlayIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
    </svg>
  );
}

function CpuIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5M4.5 15.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
    </svg>
  );
}

function CloudIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
    </svg>
  );
}

function ShieldIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  );
}

function PackageIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
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

function ChevronRight({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  );
}

function CheckIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

function DownloadIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
  );
}

function HardDriveIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z" />
    </svg>
  );
}

function DockerIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185zm-2.955-5.58h2.118a.186.186 0 00.186-.186V3.425a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185zm0 2.799h2.118a.187.187 0 00.186-.186V6.224a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185zm2.955 0h2.119a.186.186 0 00.186-.186V6.224a.186.186 0 00-.186-.185h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185zm0 2.799h2.119a.186.186 0 00.186-.186V9.024a.186.186 0 00-.186-.185h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185zm-5.91-5.598h2.118a.186.186 0 00.186-.186V3.425a.186.186 0 00-.186-.185H8.073a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185zm0 2.799h2.118a.187.187 0 00.186-.186V6.224a.186.186 0 00-.186-.185H8.073a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185zm-2.954 0h2.118a.186.186 0 00.186-.186V6.224a.186.186 0 00-.186-.185H5.12a.185.185 0 00-.186.185v1.888c0 .102.083.185.186.185zm0-2.799h2.118a.186.186 0 00.186-.186V3.425a.186.186 0 00-.186-.185H5.12a.185.185 0 00-.186.185v1.888c0 .102.083.185.186.185zm0-2.799h2.118a.187.187 0 00.186-.186V.626a.186.186 0 00-.186-.185H5.12a.186.186 0 00-.186.185v1.888c0 .102.083.185.186.185zM21.768 6.61c-.256-.168-.941-.487-1.876-.474-.148-.736-.653-1.363-1.276-1.766a.428.428 0 00-.213-.06V4.3a.427.427 0 00-.427-.427h-2.024a.427.427 0 00-.427.427v.013c-.078.004-.156.02-.228.06-.624.403-1.128 1.03-1.277 1.766-.935-.013-1.62.306-1.876.474a.428.428 0 00-.19.354v.013c0 .154.083.296.216.372.256.147.606.37 1.07.49.024.007.048.013.073.018-.06.12-.108.247-.142.38-.106.416-.07.866.106 1.296.176.43.476.79.866 1.04a2.67 2.67 0 001.49.453h5.293a2.67 2.67 0 001.49-.453c.39-.25.69-.61.866-1.04.176-.43.212-.88.106-1.296a1.87 1.87 0 00-.142-.38c.025-.005.049-.011.073-.018.464-.12.814-.343 1.07-.49a.428.428 0 00.216-.372v-.013a.428.428 0 00-.19-.354z"/>
    </svg>
  );
}

function UbuntuIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="12" cy="6" r="2" fill="currentColor"/>
      <circle cx="6.5" cy="15" r="2" fill="currentColor"/>
      <circle cx="17.5" cy="15" r="2" fill="currentColor"/>
      <path d="M12 8v4M8.5 13.5L11 11M15.5 13.5L13 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function WindowsIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 12V6.5l8-1.1V12H3zm0 .5h8v6.6l-8-1.1V12.5zm8.5-7.1L21 4v8h-9.5V5.4zm0 7.1H21v8l-9.5-1.4V12.5z"/>
    </svg>
  );
}

function AppleIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.47-2.35 1.05-3.11z"/>
    </svg>
  );
}

function CopyIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
    </svg>
  );
}

function ArrowRightIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
  );
}

function WarningIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
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

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ─── Image Card Component ─────────────────────────────────────────────────────
type ImageStatus = 'ga' | 'latest' | 'beta' | 'preview' | 'deprecated';

interface RunnerImage {
  name: string;
  os: string;
  arch: string;
  yamlLabel: string;
  status: ImageStatus;
  icon: React.ReactNode;
  color: string;
}

function ImageCard({ image }: { image: RunnerImage }) {
  const statusColors: Record<ImageStatus, string> = {
    ga: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    latest: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    beta: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    preview: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    deprecated: 'bg-red-500/10 text-red-400 border-red-500/20',
  };

  const statusLabels: Record<ImageStatus, string> = {
    ga: 'GA',
    latest: 'Latest',
    beta: 'Beta',
    preview: 'Preview',
    deprecated: 'Deprecated',
  };

  return (
    <div className="group relative p-5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/20">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${image.color}`}>
          {image.icon}
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColors[image.status]}`}>
          {statusLabels[image.status]}
        </span>
      </div>
      <h3 className="font-semibold text-white mb-1 group-hover:text-emerald-300 transition-colors">{image.name}</h3>
      <p className="text-xs text-slate-500 mb-3">{image.os} • {image.arch}</p>
      <div className="flex items-center gap-2">
        <code className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-300 font-mono">{image.yamlLabel}</code>
      </div>
    </div>
  );
}

// ─── Terminal Component ───────────────────────────────────────────────────────
function Terminal({ children, title = "terminal" }: { children: React.ReactNode; title?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textContent = typeof children === 'string' ? children : '';
    if (textContent) {
      navigator.clipboard.writeText(textContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/80 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
          <span className="ml-2 text-xs text-slate-500">{title}</span>
        </div>
        <button
          onClick={handleCopy}
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1"
        >
          {copied ? <CheckIcon className="w-3.5 h-3.5 text-emerald-400" /> : <CopyIcon className="w-3.5 h-3.5" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="p-5 font-mono text-sm overflow-x-auto">
        {children}
      </div>
    </div>
  );
}

// ─── Step Component ───────────────────────────────────────────────────────────
function Step({ number, title, children, active = false }: { number: number; title: string; children: React.ReactNode; active?: boolean }) {
  return (
    <div className={`relative pl-12 pb-8 last:pb-0 ${active ? '' : ''}`}>
      {/* Vertical line */}
      <div className="absolute left-[18px] top-10 bottom-0 w-px bg-slate-800" />
      {/* Number circle */}
      <div className={`absolute left-0 top-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
        active
          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
          : 'bg-slate-800 border-slate-700 text-slate-400'
      }`}>
        {number}
      </div>
      <div>
        <h4 className="text-lg font-semibold text-white mb-2">{title}</h4>
        <div className="text-sm text-slate-400 space-y-3">
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'ubuntu' | 'macos' | 'windows'>('all');
  const [activeTab, setActiveTab] = useState<'azure' | 'docker' | 'local'>('azure');

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const runnerImages: RunnerImage[] = [
    { name: 'Ubuntu 26.04', os: 'Linux', arch: 'x64', yamlLabel: 'ubuntu-26.04', status: 'preview', icon: <UbuntuIcon className="w-5 h-5 text-orange-400" />, color: 'bg-orange-500/10 border border-orange-500/20' },
    { name: 'Ubuntu 26.04 Arm64', os: 'Linux', arch: 'arm64', yamlLabel: 'ubuntu-26.04-arm', status: 'preview', icon: <UbuntuIcon className="w-5 h-5 text-orange-400" />, color: 'bg-orange-500/10 border border-orange-500/20' },
    { name: 'Ubuntu 24.04', os: 'Linux', arch: 'x64', yamlLabel: 'ubuntu-latest', status: 'latest', icon: <UbuntuIcon className="w-5 h-5 text-orange-400" />, color: 'bg-orange-500/10 border border-orange-500/20' },
    { name: 'Ubuntu 24.04 Arm64', os: 'Linux', arch: 'arm64', yamlLabel: 'ubuntu-24.04-arm', status: 'ga', icon: <UbuntuIcon className="w-5 h-5 text-orange-400" />, color: 'bg-orange-500/10 border border-orange-500/20' },
    { name: 'Ubuntu 22.04', os: 'Linux', arch: 'x64', yamlLabel: 'ubuntu-22.04', status: 'ga', icon: <UbuntuIcon className="w-5 h-5 text-orange-400" />, color: 'bg-orange-500/10 border border-orange-500/20' },
    { name: 'Ubuntu 22.04 Arm64', os: 'Linux', arch: 'arm64', yamlLabel: 'ubuntu-22.04-arm', status: 'ga', icon: <UbuntuIcon className="w-5 h-5 text-orange-400" />, color: 'bg-orange-500/10 border border-orange-500/20' },
    { name: 'Ubuntu Slim', os: 'Linux', arch: 'x64', yamlLabel: 'ubuntu-slim', status: 'ga', icon: <UbuntuIcon className="w-5 h-5 text-orange-400" />, color: 'bg-orange-500/10 border border-orange-500/20' },
    { name: 'macOS 26', os: 'macOS', arch: 'x64', yamlLabel: 'macos-latest-large', status: 'ga', icon: <AppleIcon className="w-5 h-5 text-slate-300" />, color: 'bg-slate-500/10 border border-slate-500/20' },
    { name: 'macOS 26 Arm64', os: 'macOS', arch: 'arm64', yamlLabel: 'macos-latest', status: 'latest', icon: <AppleIcon className="w-5 h-5 text-slate-300" />, color: 'bg-slate-500/10 border border-slate-500/20' },
    { name: 'macOS 15', os: 'macOS', arch: 'x64', yamlLabel: 'macos-15-large', status: 'ga', icon: <AppleIcon className="w-5 h-5 text-slate-300" />, color: 'bg-slate-500/10 border border-slate-500/20' },
    { name: 'macOS 15 Arm64', os: 'macOS', arch: 'arm64', yamlLabel: 'macos-15', status: 'ga', icon: <AppleIcon className="w-5 h-5 text-slate-300" />, color: 'bg-slate-500/10 border border-slate-500/20' },
    { name: 'Xcode 27', os: 'macOS', arch: 'arm64', yamlLabel: 'xcode-27', status: 'preview', icon: <AppleIcon className="w-5 h-5 text-slate-300" />, color: 'bg-slate-500/10 border border-slate-500/20' },
    { name: 'Windows Server 2025', os: 'Windows', arch: 'x64', yamlLabel: 'windows-latest', status: 'latest', icon: <WindowsIcon className="w-5 h-5 text-blue-400" />, color: 'bg-blue-500/10 border border-blue-500/20' },
    { name: 'Windows Server 2022', os: 'Windows', arch: 'x64', yamlLabel: 'windows-2022', status: 'ga', icon: <WindowsIcon className="w-5 h-5 text-blue-400" />, color: 'bg-blue-500/10 border border-blue-500/20' },
    { name: 'Windows 11 Arm64', os: 'Windows', arch: 'arm64', yamlLabel: 'windows-11-arm', status: 'ga', icon: <WindowsIcon className="w-5 h-5 text-blue-400" />, color: 'bg-blue-500/10 border border-blue-500/20' },
    { name: 'Win 11 Arm64 + VS 2026', os: 'Windows', arch: 'arm64', yamlLabel: 'windows-11-vs2026-arm', status: 'ga', icon: <WindowsIcon className="w-5 h-5 text-blue-400" />, color: 'bg-blue-500/10 border border-blue-500/20' },
  ];

  const filteredImages = activeFilter === 'all' 
    ? runnerImages 
    : runnerImages.filter(img => {
        if (activeFilter === 'ubuntu') return img.os === 'Linux';
        if (activeFilter === 'macos') return img.os === 'macOS';
        if (activeFilter === 'windows') return img.os === 'Windows';
        return true;
      });

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* ─── Navigation ───────────────────────────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/50' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center">
                <ServerIcon className="w-5 h-5 text-slate-900" />
              </div>
              <span className="font-bold text-lg tracking-tight">Runner Images</span>
              <span className="hidden sm:inline text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Sovereign Fork</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#load-images" className="text-sm text-emerald-400 font-medium">Load Images</a>
              <a href="#images" className="text-sm text-slate-400 hover:text-white transition-colors">Available</a>
              <a href="#features" className="text-sm text-slate-400 hover:text-white transition-colors">Features</a>
              <a href="#software" className="text-sm text-slate-400 hover:text-white transition-colors">Software</a>
            </div>
            <div className="flex items-center gap-3">
              <a href="https://github.com/parkkris111-sovereign/runner-images" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700">
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
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900/95 backdrop-blur-xl border-b border-slate-800">
            <div className="px-4 py-4 space-y-3">
              <a href="#load-images" className="block text-sm text-emerald-400 font-medium">Load Images</a>
              <a href="#images" className="block text-sm text-slate-400 hover:text-white">Available</a>
              <a href="#features" className="block text-sm text-slate-400 hover:text-white">Features</a>
              <a href="#software" className="block text-sm text-slate-400 hover:text-white">Software</a>
            </div>
          </div>
        )}
      </nav>

      {/* ─── Hero Section ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center pt-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl" style={{ transform: `translateY(${scrollY * 0.1}px)` }} />
          <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-green-500/5 rounded-full blur-3xl" style={{ transform: `translateY(${scrollY * -0.1}px)` }} />
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-slate-400">GitHub Actions Runner Images • Forked & Enhanced</span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight mb-6">
            <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Runner
            </span>
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-green-400 to-teal-500 bg-clip-text text-transparent">
              Images
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            VM images for <span className="text-white font-medium">GitHub-hosted runners</span> and <span className="text-white font-medium">Microsoft-hosted agents</span>. 
            Pre-configured with the latest toolchains for Ubuntu, macOS, and Windows — ready for your CI/CD pipelines.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <a href="#load-images" className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-slate-900 font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all">
              <HardDriveIcon className="w-5 h-5" />
              Load Images to Drive
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
            <a href="https://github.com/parkkris111-sovereign/runner-images" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-colors">
              <GithubIcon className="w-5 h-5" />
              View Source
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              { value: 7327, suffix: '+', label: 'Commits' },
              { value: 2389, suffix: '', label: 'Releases' },
              { value: 459, suffix: '', label: 'Branches' },
              { value: 18, suffix: '', label: 'Images' },
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

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </section>

      {/* ─── LOAD IMAGES SECTION (PRIMARY) ────────────────────────────── */}
      <section id="load-images" className="py-24 relative bg-gradient-to-b from-slate-900/50 to-transparent">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-4">
              <HardDriveIcon className="w-3.5 h-3.5" />
              Step-by-Step Guide
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">How to Load Images to Your Drive</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Choose your method below. These runner images are built with <strong className="text-white">Packer</strong> and stored as Azure managed images, Docker containers, or local VMs.
            </p>
          </div>

          {/* Method Tabs */}
          <div className="flex items-center justify-center gap-2 mb-10 flex-wrap">
            {[
              { key: 'azure', label: 'Azure VM (Recommended)', icon: <CloudIcon className="w-4 h-4" /> },
              { key: 'docker', label: 'Docker Container', icon: <DockerIcon className="w-4 h-4" /> },
              { key: 'local', label: 'Local / Self-Hosted', icon: <HardDriveIcon className="w-4 h-4" /> },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/5'
                    : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:bg-slate-800'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* ─── Azure VM Method ──────────────────────────────────────── */}
          {activeTab === 'azure' && (
            <div>
              {/* ─── Progress Tracker ─────────────────────────────────── */}
              <div className="mb-10 p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-white">Build Pipeline Progress</h3>
                  <span className="text-xs text-slate-500">Estimated total: ~2-3 hours</span>
                </div>
                <div className="relative">
                  {/* Progress bar background */}
                  <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-800 rounded-full" />
                  {/* Step indicators */}
                  <div className="relative flex justify-between">
                    {[
                      { label: 'Clone', time: '1 min' },
                      { label: 'Install', time: '5 min' },
                      { label: 'Auth', time: '2 min' },
                      { label: 'Build', time: '60-90 min' },
                      { label: 'Deploy', time: '10 min' },
                      { label: 'Finalize', time: '5 min' },
                    ].map((step, i) => (
                      <div key={i} className="flex flex-col items-center gap-1.5 z-10">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                          i < 6
                            ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                            : 'bg-slate-800 border-slate-700 text-slate-500'
                        }`}>
                          {i + 1}
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">{step.label}</span>
                        <span className="text-[9px] text-slate-600">{step.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ─── Steps ────────────────────────────────────────────── */}
              <div className="space-y-0">
                {/* ─── STEP 1: Clone ──────────────────────────────────── */}
                <Step number={1} title="Clone the Repository" active>
                  <p>Start by cloning the fork to your local machine. You'll need <code className="text-emerald-400 bg-emerald-500/10 px-1 rounded text-xs">gh</code> (GitHub CLI) or plain <code className="text-emerald-400 bg-emerald-500/10 px-1 rounded text-xs">git</code>.</p>
                  <Terminal title="terminal">
                    <div className="space-y-1">
                      <div><span className="text-slate-500"># Using GitHub CLI (recommended)</span></div>
                      <div><span className="text-emerald-400">$</span> <span className="text-slate-300">gh repo clone parkkris111-sovereign/runner-images</span></div>
                      <div><span className="text-emerald-400">$</span> <span className="text-slate-300">cd runner-images</span></div>
                      <div className="mt-2"><span className="text-slate-500"># Or using plain git</span></div>
                      <div><span className="text-emerald-400">$</span> <span className="text-slate-300">git clone https://github.com/parkkris111-sovereign/runner-images.git</span></div>
                    </div>
                  </Terminal>
                  <div className="mt-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                    <div className="flex items-start gap-2">
                      <CheckIcon className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-emerald-300">Expected output:</p>
                        <p className="text-xs text-slate-400 mt-0.5 font-mono">✓ Cloned parkkris111-sovereign/runner-images</p>
                      </div>
                    </div>
                  </div>
                </Step>

                {/* ─── STEP 2: Install Prerequisites ──────────────────── */}
                <Step number={2} title="Install Packer, Git, PowerShell 5+, and Azure CLI">
                  <p>You need these four tools on your build agent machine. The build agent can be any physical or virtual machine running Windows or Linux.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                    {[
                      { name: 'Packer', version: '≥ 1.8.2', cmd: 'choco install packer', desc: 'Image builder by HashiCorp', icon: '🔨' },
                      { name: 'Git', version: 'Latest', cmd: 'choco install git -params \'"/GitAndUnixToolsOnPath"\'', desc: 'Version control', icon: '📦' },
                      { name: 'PowerShell', version: '≥ 5.0', cmd: 'pwsh --version', desc: 'Built-in on Windows; install on Linux', icon: '⚡' },
                      { name: 'Azure CLI', version: 'Latest', cmd: 'az --version', desc: 'Azure resource management', icon: '☁️' },
                    ].map((tool, i) => (
                      <div key={i} className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">{tool.icon}</span>
                          <span className="text-sm font-semibold text-white">{tool.name}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-400 ml-auto">{tool.version}</span>
                        </div>
                        <p className="text-xs text-slate-500 mb-2">{tool.desc}</p>
                        <code className="text-xs text-emerald-400 bg-slate-900/50 px-2 py-1 rounded block">{tool.cmd}</code>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                    <p className="text-xs text-blue-300/80"><strong className="text-blue-300">💡 Tip:</strong> On Linux, install PowerShell from <code className="text-blue-300">Microsoft's Linux Software Repository</code>. On macOS, use <code className="text-blue-300">brew install --cask powershell</code>.</p>
                  </div>
                </Step>

                {/* ─── STEP 3: Authenticate ───────────────────────────── */}
                <Step number={3} title="Authenticate with Azure">
                  <p>Log in to your Azure subscription. The <code className="text-emerald-400 bg-emerald-500/10 px-1 rounded text-xs">az login</code> command opens a browser for interactive auth.</p>
                  <Terminal title="powershell">
                    <div className="space-y-1">
                      <div><span className="text-slate-500"># Interactive login (opens browser)</span></div>
                      <div><span className="text-emerald-400">$</span> <span className="text-slate-300">az login</span></div>
                      <div className="mt-2"><span className="text-slate-500"># Verify you're connected</span></div>
                      <div><span className="text-emerald-400">$</span> <span className="text-slate-300">az account show --output table</span></div>
                      <div className="text-slate-500"># Expected output:</div>
                      <div className="text-slate-400">EnvironmentName    State    IsDefault</div>
                      <div className="text-slate-400">-----------------  -------   ---------</div>
                      <div className="text-emerald-300">AzureCloud         Enabled  True</div>
                      <div className="mt-3"><span className="text-slate-500"># For automation / CI — create a Service Principal:</span></div>
                      <div><span className="text-emerald-400">$</span> <span className="text-slate-300">az ad sp create-for-rbac --name "imagegen-app" --role Contributor</span></div>
                    </div>
                  </Terminal>
                  <div className="mt-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 flex items-start gap-2">
                    <WarningIcon className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-amber-300/80"><strong className="text-amber-300">Requirements:</strong> You need an Azure subscription, an existing resource group, and <strong>Contributor</strong> permissions. The build process creates temporary VMs, NICs, and resource groups.</p>
                    </div>
                  </div>
                </Step>

                {/* ─── STEP 4: Generate the Image ─────────────────────── */}
                <Step number={4} title="Run GenerateResourcesAndImage to Build a Managed Image">
                  <p>This is the main build step. The helper script orchestrates Packer to create a temporary Azure VM, install all software, then capture it as a managed image.</p>
                  <Terminal title="powershell">
                    <div className="space-y-1">
                      <div><span className="text-slate-500"># Import the helper module</span></div>
                      <div><span className="text-emerald-400">$</span> <span className="text-slate-300">Import-Module .\helpers\GenerateResourcesAndImage.ps1</span></div>
                      <div className="mt-2"><span className="text-slate-500"># Run the image generation</span></div>
                      <div><span className="text-emerald-400">$</span> <span className="text-slate-300">GenerateResourcesAndImage `</span></div>
                      <div className="pl-4"><span className="text-slate-300">-SubscriptionId </span><span className="text-cyan-300">"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"</span> <span className="text-slate-300">`</span></div>
                      <div className="pl-4"><span className="text-slate-300">-ResourceGroupName </span><span className="text-cyan-300">"imagegen-rg"</span> <span className="text-slate-300">`</span></div>
                      <div className="pl-4"><span className="text-slate-300">-AzureLocation </span><span className="text-cyan-300">"East US"</span> <span className="text-slate-300">`</span></div>
                      <div className="pl-4"><span className="text-slate-300">-ImageType </span><span className="text-cyan-300">"Ubuntu2404"</span></div>
                    </div>
                  </Terminal>

                  {/* What happens behind the scenes */}
                  <div className="mt-4 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
                    <h4 className="text-xs font-semibold text-slate-300 mb-3 flex items-center gap-2">
                      <span className="w-5 h-5 rounded bg-violet-500/20 flex items-center justify-center text-violet-400 text-[10px]">⚙</span>
                      What Happens Behind the Scenes
                    </h4>
                    <div className="space-y-2">
                      {[
                        'Packer connects to Azure via CLI and creates a temporary resource group',
                        'A clean base VM is provisioned from the official OS image',
                        'Packer connects via SSH (Linux) or WinRM (Windows) to the temp VM',
                        'Installation scripts run sequentially — installing all toolchains',
                        'If any step fails, the build aborts and temp VM is terminated',
                        'On success, Packer captures the VM disk as a managed image',
                        'Temporary resources are cleaned up automatically',
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-[10px] text-emerald-400 mt-1 font-mono">{String(i + 1).padStart(2, '0')}</span>
                          <span className="text-xs text-slate-400">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Image type options */}
                  <div className="mt-4">
                    <p className="text-xs text-slate-500 mb-2 font-medium">Valid <code className="text-slate-400">-ImageType</code> options:</p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { name: 'Ubuntu2204', arch: 'x64' },
                        { name: 'Ubuntu2404', arch: 'x64' },
                        { name: 'Ubuntu2604', arch: 'x64' },
                        { name: 'Windows2022', arch: 'x64' },
                        { name: 'Windows2025', arch: 'x64' },
                        { name: 'Windows2025_vs2026', arch: 'x64' },
                      ].map((img, i) => (
                        <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300">
                          {img.name} <span className="text-slate-500">({img.arch})</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Troubleshooting */}
                  <div className="mt-4 p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                    <p className="text-xs font-medium text-red-300 mb-1">🔧 Troubleshooting</p>
                    <ul className="text-xs text-slate-400 space-y-1">
                      <li>• <strong className="text-slate-300">Build timeout?</strong> Ubuntu images take 60-90 min. Windows can take 2+ hours.</li>
                      <li>• <strong className="text-slate-300">Permission error?</strong> Ensure your SP has Contributor role on the subscription.</li>
                      <li>• <strong className="text-slate-300">Network blocked?</strong> Ensure WinRM (5986) and SSH (22) are allowed outbound.</li>
                      <li>• <strong className="text-slate-300">Use <code className="text-slate-300">-RestrictToAgentIpAddress $true</code></strong> to limit temp VM access to your IP only.</li>
                    </ul>
                  </div>
                </Step>

                {/* ─── STEP 5: Deploy VM ──────────────────────────────── */}
                <Step number={5} title="Deploy a VM from the Image using CreateAzureVMFromPackerTemplate">
                  <p>Once the managed image is created, deploy a VM from it. This script creates the VM, networking, and makes it accessible.</p>
                  <Terminal title="powershell">
                    <div className="space-y-1">
                      <div><span className="text-slate-500"># Import the deployment helper</span></div>
                      <div><span className="text-emerald-400">$</span> <span className="text-slate-300">Import-Module .\helpers\CreateAzureVMFromPackerTemplate.ps1</span></div>
                      <div className="mt-2"><span className="text-slate-500"># Create the VM</span></div>
                      <div><span className="text-emerald-400">$</span> <span className="text-slate-300">CreateAzureVMFromPackerTemplate `</span></div>
                      <div className="pl-4"><span className="text-slate-300">-SubscriptionId </span><span className="text-cyan-300">"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"</span> <span className="text-slate-300">`</span></div>
                      <div className="pl-4"><span className="text-slate-300">-ResourceGroupName </span><span className="text-cyan-300">"imagegen-rg"</span> <span className="text-slate-300">`</span></div>
                      <div className="pl-4"><span className="text-slate-300">-ManagedImageName </span><span className="text-cyan-300">"Runner-Image-Ubuntu2404"</span> <span className="text-slate-300">`</span></div>
                      <div className="pl-4"><span className="text-slate-300">-VirtualMachineName </span><span className="text-cyan-300">"my-runner"</span> <span className="text-slate-300">`</span></div>
                      <div className="pl-4"><span className="text-slate-300">-AdminUsername </span><span className="text-cyan-300">"runner"</span> <span className="text-slate-300">`</span></div>
                      <div className="pl-4"><span className="text-slate-300">-AdminPassword </span><span className="text-cyan-300">"SecurePass123!"</span> <span className="text-slate-300">`</span></div>
                      <div className="pl-4"><span className="text-slate-300">-AzureLocation </span><span className="text-cyan-300">"eastus"</span></div>
                    </div>
                  </Terminal>
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                      <p className="text-xs font-medium text-emerald-300 mb-1">✅ What gets created:</p>
                      <ul className="text-xs text-slate-400 space-y-0.5">
                        <li>• Azure Virtual Machine</li>
                        <li>• Network Interface Card (NIC)</li>
                        <li>• Public IP Address</li>
                        <li>• Network Security Group</li>
                      </ul>
                    </div>
                    <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                      <p className="text-xs font-medium text-blue-300 mb-1">🔑 Parameters explained:</p>
                      <ul className="text-xs text-slate-400 space-y-0.5">
                        <li>• <code className="text-blue-300">ManagedImageName</code> — from Step 4 output</li>
                        <li>• <code className="text-blue-300">AdminUsername</code> — must have sudo on Linux</li>
                        <li>• <code className="text-blue-300">AdminPassword</code> — meets Azure complexity rules</li>
                      </ul>
                    </div>
                  </div>
                </Step>

                {/* ─── STEP 6: Post-Gen Scripts ───────────────────────── */}
                <Step number={6} title="Run Post-Generation Scripts to Finalize Setup">
                  <p>The user created during image generation doesn't exist in the final image. Post-gen scripts fix home directory paths, permissions, and initial configurations.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                    <div className="p-4 rounded-lg bg-slate-800/50 border border-orange-500/20">
                      <div className="flex items-center gap-2 mb-3">
                        <UbuntuIcon className="w-4 h-4 text-orange-400" />
                        <span className="text-sm font-semibold text-white">Ubuntu</span>
                      </div>
                      <Terminal title="bash">
                        <div className="space-y-1">
                          <div><span className="text-slate-500"># Run all post-gen scripts</span></div>
                          <div><span className="text-emerald-400">$</span> <span className="text-slate-300">sudo su -c \</span></div>
                          <div className="pl-2"><span className="text-slate-300">"find /opt/post-generation \</span></div>
                          <div className="pl-2"><span className="text-slate-300">-mindepth 1 -maxdepth 1 \</span></div>
                          <div className="pl-2"><span className="text-slate-300">-type f -name '*.sh' \</span></div>
                          <div className="pl-2"><span className="text-slate-300">-exec bash {'{}'} \;"</span></div>
                        </div>
                      </Terminal>
                      <div className="mt-3 space-y-1">
                        <p className="text-[10px] text-slate-500 font-medium">Scripts executed:</p>
                        {['cleanup-logs.sh', 'environment-variables.sh', 'homebrew-permissions.sh', 'rust-permissions.sh'].map(s => (
                          <div key={s} className="flex items-center gap-1.5">
                            <CheckIcon className="w-3 h-3 text-emerald-400" />
                            <code className="text-[10px] text-slate-400">{s}</code>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-slate-800/50 border border-blue-500/20">
                      <div className="flex items-center gap-2 mb-3">
                        <WindowsIcon className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-semibold text-white">Windows</span>
                      </div>
                      <Terminal title="powershell">
                        <div className="space-y-1">
                          <div><span className="text-slate-500"># Run all post-gen scripts</span></div>
                          <div><span className="text-emerald-400">$</span> <span className="text-slate-300">Get-ChildItem \</span></div>
                          <div className="pl-2"><span className="text-slate-300">C:\post-generation \</span></div>
                          <div className="pl-2"><span className="text-slate-300">-Filter *.ps1 | \</span></div>
                          <div className="pl-2"><span className="text-slate-300">ForEach-Object {'{'} \</span></div>
                          <div className="pl-2"><span className="text-slate-300">  & $_.FullName \</span></div>
                          <div className="pl-2"><span className="text-slate-300">{'}'}</span></div>
                        </div>
                      </Terminal>
                      <div className="mt-3 space-y-1">
                        <p className="text-[10px] text-slate-500 font-medium">Scripts executed:</p>
                        {['GenerateIISExpressCertificate.ps1', 'InternetExplorerConfiguration.ps1', 'Msys2FirstLaunch.ps1', 'VSConfiguration.ps1'].map(s => (
                          <div key={s} className="flex items-center gap-1.5">
                            <CheckIcon className="w-3 h-3 text-blue-400" />
                            <code className="text-[10px] text-slate-400">{s}</code>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Success banner */}
                  <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <CheckIcon className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-emerald-300">🎉 Your runner image is ready!</h4>
                        <p className="text-xs text-slate-400 mt-0.5">The VM is now deployed with all toolchains pre-installed. You can register it as a self-hosted runner or use it for Azure Pipelines.</p>
                      </div>
                    </div>
                  </div>
                </Step>
              </div>
            </div>
          )}

          {/* ─── Docker Method ────────────────────────────────────────── */}
          {activeTab === 'docker' && (
            <div className="space-y-0">
              <Step number={1} title="Clone the Repository" active>
                <Terminal title="terminal">
                  <div className="space-y-1">
                    <div><span className="text-emerald-400">$</span> <span className="text-slate-300">gh repo clone parkkris111-sovereign/runner-images</span></div>
                    <div><span className="text-emerald-400">$</span> <span className="text-slate-300">cd runner-images</span></div>
                  </div>
                </Terminal>
              </Step>

              <Step number={2} title="Build Docker Image Locally">
                <p>The repo includes a Docker publish workflow. You can build images locally:</p>
                <Terminal title="terminal">
                  <div className="space-y-1">
                    <div><span className="text-slate-500"># Build an Ubuntu 24.04 runner image</span></div>
                    <div><span className="text-emerald-400">$</span> <span className="text-slate-300">docker build -t runner-image:ubuntu-24.04 \</span></div>
                    <div className="pl-4"><span className="text-slate-300">-f images/ubuntu/templates/ubuntu-24.04.Dockerfile .</span></div>
                    <div className="mt-2"><span className="text-slate-500"># Or use the automated workflow</span></div>
                    <div><span className="text-emerald-400">$</span> <span className="text-slate-300">cat .github/workflows/docker-publish.yml</span></div>
                  </div>
                </Terminal>
              </Step>

              <Step number={3} title="Push to Container Registry">
                <p>Push your built image to Docker Hub, GHCR, or any registry:</p>
                <Terminal title="terminal">
                  <div className="space-y-1">
                    <div><span className="text-emerald-400">$</span> <span className="text-slate-300">docker tag runner-image:ubuntu-24.04 \</span></div>
                    <div className="pl-4"><span className="text-slate-300">ghcr.io/parkkris111-sovereign/runner-image:ubuntu-24.04</span></div>
                    <div className="mt-2"><span className="text-emerald-400">$</span> <span className="text-slate-300">docker push ghcr.io/parkkris111-sovereign/runner-image:ubuntu-24.04</span></div>
                  </div>
                </Terminal>
              </Step>

              <Step number={4} title="Use in GitHub Actions">
                <p>Reference the container image in your workflow:</p>
                <Terminal title=".github/workflows/ci.yml">
                  <div className="space-y-1">
                    <div><span className="text-violet-400">jobs</span><span className="text-slate-400">:</span></div>
                    <div><span className="text-slate-400">  </span><span className="text-violet-400">build</span><span className="text-slate-400">:</span></div>
                    <div><span className="text-slate-400">    </span><span className="text-violet-400">runs-on</span><span className="text-slate-400">: </span><span className="text-emerald-300">ubuntu-latest</span></div>
                    <div><span className="text-slate-400">    </span><span className="text-violet-400">container</span><span className="text-slate-400">:</span></div>
                    <div><span className="text-slate-400">      </span><span className="text-violet-400">image</span><span className="text-slate-400">: </span><span className="text-emerald-300">ghcr.io/parkkris111-sovereign/runner-image:ubuntu-24.04</span></div>
                  </div>
                </Terminal>
              </Step>

              <div className="mt-6 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                <div className="flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-emerald-300">Docker Publish Workflow</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      The fork includes a custom <code className="text-emerald-400">docker-publish.yml</code> workflow that automates building and pushing container images. 
                      Check <code className="text-slate-300">.github/workflows/docker-publish.yml</code> for configuration.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── Local / Self-Hosted Method ───────────────────────────── */}
          {activeTab === 'local' && (
            <div className="space-y-0">
              <Step number={1} title="Clone the Repository" active>
                <Terminal title="terminal">
                  <div className="space-y-1">
                    <div><span className="text-emerald-400">$</span> <span className="text-slate-300">gh repo clone parkkris111-sovereign/runner-images</span></div>
                    <div><span className="text-emerald-400">$</span> <span className="text-slate-300">cd runner-images</span></div>
                  </div>
                </Terminal>
              </Step>

              <Step number={2} title="Install Packer & Azure CLI">
                <p>Packer generates the disk images. Azure CLI authenticates with Azure to provision build VMs:</p>
                <Terminal title="terminal">
                  <div className="space-y-1">
                    <div><span className="text-slate-500"># macOS</span></div>
                    <div><span className="text-emerald-400">$</span> <span className="text-slate-300">brew install packer azure-cli</span></div>
                    <div className="mt-2"><span className="text-slate-500"># Linux (Ubuntu/Debian)</span></div>
                    <div><span className="text-emerald-400">$</span> <span className="text-slate-300">wget -O- packer.io/install.sh | bash</span></div>
                    <div><span className="text-emerald-400">$</span> <span className="text-slate-300">curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash</span></div>
                    <div className="mt-2"><span className="text-slate-500"># Windows</span></div>
                    <div><span className="text-emerald-400">$</span> <span className="text-slate-300">choco install packer azure-cli</span></div>
                  </div>
                </Terminal>
              </Step>

              <Step number={3} title="Build with Packer Directly">
                <p>For automated/CI builds, invoke Packer directly:</p>
                <Terminal title="terminal">
                  <div className="space-y-1">
                    <div><span className="text-emerald-400">$</span> <span className="text-slate-300">packer plugins install github.com/hashicorp/azure 2.2.1</span></div>
                    <div className="mt-2"><span className="text-emerald-400">$</span> <span className="text-slate-300">packer build \</span></div>
                    <div className="pl-4"><span className="text-slate-300">-only "ubuntu-24_04.*" \</span></div>
                    <div className="pl-4"><span className="text-slate-300">-var "subscription_id=$ARM_SUBSCRIPTION_ID" \</span></div>
                    <div className="pl-4"><span className="text-slate-300">-var "client_id=$ARM_CLIENT_ID" \</span></div>
                    <div className="pl-4"><span className="text-slate-300">-var "client_secret=$ARM_CLIENT_SECRET" \</span></div>
                    <div className="pl-4"><span className="text-slate-300">-var "location=East US" \</span></div>
                    <div className="pl-4"><span className="text-slate-300">-var "image_os=ubuntu24" \</span></div>
                    <div className="pl-4"><span className="text-slate-300">-var "managed_image_name=MyRunner" \</span></div>
                    <div className="pl-4"><span className="text-slate-300">-var "managed_image_resource_group_name=my-rg" \</span></div>
                    <div className="pl-4"><span className="text-slate-300">images/ubuntu/templates/</span></div>
                  </div>
                </Terminal>
              </Step>

              <Step number={4} title="Export to Local Disk (VHD/VHDX)">
                <p>To save the image to your local drive, export the Azure managed image as a VHD:</p>
                <Terminal title="terminal">
                  <div className="space-y-1">
                    <div><span className="text-slate-500"># Export managed image to storage account</span></div>
                    <div><span className="text-emerald-400">$</span> <span className="text-slate-300">az image export \</span></div>
                    <div className="pl-4"><span className="text-slate-300">--resource-group my-rg \</span></div>
                    <div className="pl-4"><span className="text-slate-300">--name MyRunner \</span></div>
                    <div className="pl-4"><span className="text-slate-300">--destination https://mystorage.blob.core.windows.net/vhds/runner.vhd</span></div>
                    <div className="mt-2"><span className="text-slate-500"># Download to local drive</span></div>
                    <div><span className="text-emerald-400">$</span> <span className="text-slate-300">az storage blob download \</span></div>
                    <div className="pl-4"><span className="text-slate-300">--account-name mystorage \</span></div>
                    <div className="pl-4"><span className="text-slate-300">--container-name vhds \</span></div>
                    <div className="pl-4"><span className="text-slate-300">--name runner.vhd \</span></div>
                    <div className="pl-4"><span className="text-slate-300">--file ~/runner-images/runner.vhd</span></div>
                  </div>
                </Terminal>
                <div className="mt-3 p-3 rounded-lg bg-blue-500/5 border border-blue-500/20 flex items-start gap-2">
                  <WarningIcon className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                  <p className="text-xs text-blue-300/80">VHD files are typically 30-100+ GB. Ensure you have sufficient disk space and bandwidth.</p>
                </div>
              </Step>

              <Step number={5} title="Register as Self-Hosted Runner">
                <p>Use the image as a self-hosted GitHub Actions runner:</p>
                <Terminal title="terminal">
                  <div className="space-y-1">
                    <div><span className="text-slate-500"># Download runner agent</span></div>
                    <div><span className="text-emerald-400">$</span> <span className="text-slate-300">mkdir actions-runner && cd actions-runner</span></div>
                    <div><span className="text-emerald-400">$</span> <span className="text-slate-300">curl -o actions-runner-linux-x64.tar.gz -L \</span></div>
                    <div className="pl-4"><span className="text-slate-300">https://github.com/actions/runner/releases/latest/download/...</span></div>
                    <div><span className="text-emerald-400">$</span> <span className="text-slate-300">tar xzf actions-runner-linux-x64.tar.gz</span></div>
                    <div className="mt-2"><span className="text-slate-500"># Configure with your repo token</span></div>
                    <div><span className="text-emerald-400">$</span> <span className="text-slate-300">./config.sh --url https://github.com/YOUR/REPO --token YOUR_TOKEN</span></div>
                    <div><span className="text-emerald-400">$</span> <span className="text-slate-300">./run.sh</span></div>
                  </div>
                </Terminal>
              </Step>
            </div>
          )}

          {/* Quick reference card */}
          <div className="mt-16 p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <DownloadIcon className="w-5 h-5 text-emerald-400" />
              Quick Reference — All Commands
            </h3>
            <Terminal title="all-in-one.sh">
              <div className="space-y-1">
                <div><span className="text-slate-500"># 1. Clone</span></div>
                <div><span className="text-emerald-400">$</span> <span className="text-slate-300">gh repo clone parkkris111-sovereign/runner-images</span></div>
                <div><span className="text-emerald-400">$</span> <span className="text-slate-300">cd runner-images</span></div>
                <div className="mt-2"><span className="text-slate-500"># 2. Install Packer</span></div>
                <div><span className="text-emerald-400">$</span> <span className="text-slate-300">choco install packer  <span className="text-slate-500"># Windows</span></span></div>
                <div><span className="text-emerald-400">$</span> <span className="text-slate-300">brew install packer   <span className="text-slate-500"># macOS</span></span></div>
                <div className="mt-2"><span className="text-slate-500"># 3. Login to Azure</span></div>
                <div><span className="text-emerald-400">$</span> <span className="text-slate-300">az login</span></div>
                <div className="mt-2"><span className="text-slate-500"># 4. Build image (PowerShell)</span></div>
                <div><span className="text-emerald-400">$</span> <span className="text-slate-300">Import-Module .\helpers\GenerateResourcesAndImage.ps1</span></div>
                <div><span className="text-emerald-400">$</span> <span className="text-slate-300">GenerateResourcesAndImage -SubscriptionId "..." -ResourceGroupName "..." -AzureLocation "East US" -ImageType "Ubuntu2404"</span></div>
                <div className="mt-2"><span className="text-slate-500"># 5. Deploy VM from image</span></div>
                <div><span className="text-emerald-400">$</span> <span className="text-slate-300">Import-Module .\helpers\CreateAzureVMFromPackerTemplate.ps1</span></div>
                <div><span className="text-emerald-400">$</span> <span className="text-slate-300">CreateAzureVMFromPackerTemplate -SubscriptionId "..." -ResourceGroupName "..." -ManagedImageName "Runner-Image-Ubuntu2404" -VirtualMachineName "my-runner" -AdminUsername "runner" -AdminPassword "..." -AzureLocation "eastus"</span></div>
              </div>
            </Terminal>
          </div>
        </div>
      </section>

      {/* ─── Available Images Section ─────────────────────────────────── */}
      <section id="images" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">Available Images</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Pre-built VM images with the latest toolchains, ready for GitHub Actions and Azure Pipelines.
            </p>
          </div>

          {/* Filter buttons */}
          <div className="flex items-center justify-center gap-2 mb-10 flex-wrap">
            {[
              { key: 'all', label: 'All', icon: <ServerIcon className="w-4 h-4" /> },
              { key: 'ubuntu', label: 'Ubuntu', icon: <UbuntuIcon className="w-4 h-4" /> },
              { key: 'macos', label: 'macOS', icon: <AppleIcon className="w-4 h-4" /> },
              { key: 'windows', label: 'Windows', icon: <WindowsIcon className="w-4 h-4" /> },
            ].map(filter => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key as typeof activeFilter)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeFilter === filter.key
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:bg-slate-800'
                }`}
              >
                {filter.icon}
                {filter.label}
              </button>
            ))}
          </div>

          {/* Image grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredImages.map((image, i) => (
              <ImageCard key={i} image={image} />
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              Showing {filteredImages.length} of {runnerImages.length} images • Updated weekly
            </p>
          </div>
        </div>
      </section>

      {/* ─── Features Section ─────────────────────────────────────────── */}
      <section id="features" className="py-24 relative bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">Why Runner Images</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Purpose-built VM images optimized for CI/CD workloads with comprehensive toolchain coverage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <PlayIcon className="w-6 h-6" />,
                title: 'Ready to Use',
                description: 'Pre-configured with popular tools and languages. Start building immediately without setup time.',
                color: 'emerald',
              },
              {
                icon: <CpuIcon className="w-6 h-6" />,
                title: 'Multi-Architecture',
                description: 'Support for both x64 and arm64 architectures across all platforms for maximum compatibility.',
                color: 'cyan',
              },
              {
                icon: <CloudIcon className="w-6 h-6" />,
                title: 'Cloud Native',
                description: 'Built for GitHub Actions and Azure Pipelines with seamless integration and fast provisioning.',
                color: 'blue',
              },
              {
                icon: <PackageIcon className="w-6 h-6" />,
                title: 'Rich Toolchains',
                description: 'Latest versions of Docker, Node.js, Python, Go, Java, .NET, and hundreds more pre-installed.',
                color: 'violet',
              },
              {
                icon: <ShieldIcon className="w-6 h-6" />,
                title: 'Secure & Updated',
                description: 'Weekly updates with latest security patches. Tools removed 6 months after EOL.',
                color: 'rose',
              },
              {
                icon: <DockerIcon className="w-6 h-6" />,
                title: 'Docker Publish',
                description: 'Custom Docker publish workflow for containerized deployments and image distribution.',
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

      {/* ─── Software Support Section ─────────────────────────────────── */}
      <section id="software" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">Software & Toolchains</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Comprehensive pre-installed software with intelligent version management strategies.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="rounded-2xl bg-slate-900/50 border border-slate-800 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800 bg-slate-800/30">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <PackageIcon className="w-5 h-5 text-emerald-400" />
                  Installation Strategy
                </h3>
              </div>
              <div className="p-6 space-y-3">
                {[
                  { tool: 'Docker images', strategy: '3 latest LTS OS/tool versions' },
                  { tool: 'Java', strategy: 'All LTS versions' },
                  { tool: 'Node.js', strategy: '3 latest LTS versions' },
                  { tool: 'Go', strategy: '3 latest minor versions' },
                  { tool: 'Python / Ruby', strategy: '5 most popular major.minor' },
                  { tool: '.NET Core', strategy: '2 latest LTS + 1 latest' },
                  { tool: 'GCC / Clang', strategy: '3 latest major versions' },
                  { tool: 'Android NDK', strategy: '1 latest non-LTS, 2 LTS' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-slate-800/50 last:border-0">
                    <span className="text-sm text-white font-medium">{item.tool}</span>
                    <span className="text-xs text-slate-400 text-right max-w-[55%]">{item.strategy}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-slate-900/50 border border-slate-800 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800 bg-slate-800/30">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <CloudIcon className="w-5 h-5 text-cyan-400" />
                  Package Managers by OS
                </h3>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <UbuntuIcon className="w-4 h-4 text-orange-400" />
                    <span className="text-sm font-semibold text-white">Ubuntu</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400">APT + pipx</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {['Docker', 'Git', 'Git-LFS', 'Google Cloud', 'PostgreSQL', 'MongoDB', 'Mono', 'R', 'Firefox', 'Edge'].map(pkg => (
                      <span key={pkg} className="text-xs px-2 py-1 rounded bg-slate-800/80 text-slate-300 border border-slate-700/50">{pkg}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <WindowsIcon className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-semibold text-white">Windows</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400">Chocolatey</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {['Visual Studio', 'MSBuild', 'PowerShell', 'NuGet', '.NET SDK', 'SQL Server', 'Azure CLI'].map(pkg => (
                      <span key={pkg} className="text-xs px-2 py-1 rounded bg-slate-800/80 text-slate-300 border border-slate-700/50">{pkg}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <AppleIcon className="w-4 h-4 text-slate-300" />
                    <span className="text-sm font-semibold text-white">macOS</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400">Homebrew + pipx</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {['Xcode', 'AWS CLI', 'Azure Bicep', 'MongoDB', 'CocoaPods', 'Swift', 'Xamarin'].map(pkg => (
                      <span key={pkg} className="text-xs px-2 py-1 rounded bg-slate-800/80 text-slate-300 border border-slate-700/50">{pkg}</span>
                    ))}
                  </div>
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
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center">
                  <ServerIcon className="w-5 h-5 text-slate-900" />
                </div>
                <span className="font-bold text-lg">Runner Images</span>
              </div>
              <p className="text-sm text-slate-400">
                GitHub Actions runner images — VM source code for GitHub-hosted runners and Microsoft-hosted Azure Pipelines agents.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="https://github.com/parkkris111-sovereign/runner-images" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">GitHub Repository</a></li>
                <li><a href="https://github.com/parkkris111-sovereign/runner-images/releases" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">Releases (2,389 tags)</a></li>
                <li><a href="https://docs.github.com/en/actions/using-github-hosted-runners" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">GitHub Actions Docs</a></li>
                <li><a href="https://github.com/parkkris111-sovereign/runner-images/blob/main/docs/create-image-and-azure-resources.md" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">Build Custom Image Guide</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Image Documentation</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="https://github.com/actions/runner-images/blob/main/images/ubuntu/Ubuntu2404-Readme.md" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">Ubuntu 24.04 Readme</a></li>
                <li><a href="https://github.com/actions/runner-images/blob/main/images/macos/macos-26-arm64-Readme.md" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">macOS 26 Arm64 Readme</a></li>
                <li><a href="https://github.com/actions/runner-images/blob/main/images/windows/Windows2025-VS2026-Readme.md" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">Windows 2025 Readme</a></li>
                <li><a href="https://github.com/parkkris111-sovereign/runner-images/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">Contributing Guide</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-slate-500">
              © 2026 MIT License • Forked from actions/runner-images
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700">PowerShell</span>
              <span className="text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700">Shell</span>
              <span className="text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700">HCL</span>
              <a href="https://github.com/parkkris111-sovereign/runner-images" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                <GithubIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
