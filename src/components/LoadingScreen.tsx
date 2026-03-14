import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Terminal, Lock, Shield, Zap, CheckCircle2 } from "lucide-react";

interface LoadingScreenProps {
  onComplete: () => void;
}

const STEPS = [
  { text: "Initializing neural network...",    icon: Terminal,    duration: 800 },
  { text: "Loading AI detection models...",    icon: Shield,      duration: 1000 },
  { text: "Calibrating audio processors...",  icon: Zap,         duration: 900 },
  { text: "Establishing secure connection...", icon: Lock,        duration: 700 },
  { text: "System ready. Access granted.",     icon: CheckCircle2, duration: 600 },
];

const RAW_LOGS = [
  "> Connecting to secure server...",
  "> Authenticating credentials...",
  "> [OK] Connection established",
  "> Loading deepfake detection algorithms...",
  "> Initializing spectral analysis engine...",
  "> [OK] Audio processor online",
  "> Configuring neural network layers...",
  "> [OK] AI model loaded successfully",
  "> Running system diagnostics...",
  "> [OK] All systems operational",
  "> Preparing user interface...",
  "> [OK] Ready for deployment",
];

/** Sanitize log lines — strip newlines and control characters to prevent log injection */
const sanitizeLog = (s: string) => s.replace(/[\r\n\t\x00-\x1F\x7F]/g, " ").slice(0, 120);
const LOGS = RAW_LOGS.map(sanitizeLog);

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress]       = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [visibleLogs, setVisibleLogs] = useState<string[]>([]);
  const [isComplete, setIsComplete]   = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    /* Progress bar */
    const progressTimer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(progressTimer); return 100; }
        return p + 1;
      });
    }, 40);

    /* Log stream */
    let logIdx = 0;
    const logTimer = setInterval(() => {
      if (logIdx < LOGS.length) {
        setVisibleLogs(prev => [...prev, LOGS[logIdx++]]);
      }
    }, 350);

    /* Steps */
    let stepIdx = 0;
    let stepTimeout: ReturnType<typeof setTimeout>;
    const nextStep = () => {
      if (stepIdx < STEPS.length) {
        setCurrentStep(stepIdx);
        stepTimeout = setTimeout(() => { stepIdx++; nextStep(); }, STEPS[stepIdx].duration);
      } else {
        setIsComplete(true);
        setTimeout(onComplete, 800);
      }
    };
    nextStep();

    return () => {
      clearInterval(progressTimer);
      clearInterval(logTimer);
      clearTimeout(stepTimeout);
    };
  }, []);

  /* Auto-scroll log pane */
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [visibleLogs]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center cyber-grid"
        style={{ background: "var(--bg)" }}
      >
        {/* Scanline overlay */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(59,130,246,0.015) 3px, rgba(59,130,246,0.015) 4px)",
          }}
        />

        {/* Glitch flash */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{ background: "color-mix(in srgb, var(--accent) 4%, transparent)" }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.15, repeat: Infinity, repeatDelay: 4 }}
        />

        <div className="relative z-10 w-full max-w-2xl mx-4">
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="overflow-hidden"
            style={{
              background: "var(--panel)",
              border: "1px solid color-mix(in srgb, var(--accent) 25%, transparent)",
              backdropFilter: "blur(20px)",
            }}
          >
            {/* Terminal title bar */}
            <div
              className="flex items-center gap-3 px-4 py-3 border-b"
              style={{
                borderColor: "color-mix(in srgb, var(--accent) 20%, transparent)",
                background: "color-mix(in srgb, var(--accent) 6%, transparent)",
              }}
            >
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="sys-label mx-auto" style={{ color: "var(--accent)" }}>
                voice-sentinel — terminal v1.0
              </span>
            </div>

            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                  style={{ color: "var(--accent)" }}
                >
                  <Terminal className="w-10 h-10" />
                </motion.div>
                <div>
                  <h2 className="font-display text-base font-semibold uppercase tracking-widest mb-0.5" style={{ color: "var(--accent)" }}>
                    Initializing System
                  </h2>
                  <p className="body-copy--sm">Please wait while we prepare the environment…</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="sys-label">Loading</span>
                  <span className="sys-label" style={{ color: "var(--accent)" }}>{progress}%</span>
                </div>
                <div className="h-1 w-full overflow-hidden" style={{ background: "var(--border)" }}>
                  <motion.div
                    className="h-full"
                    style={{ background: "var(--accent)" }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-2.5">
                {STEPS.map((step, idx) => {
                  const Icon = step.icon;
                  const active    = idx === currentStep;
                  const completed = idx < currentStep;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: active || completed ? 1 : 0.3, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center gap-3"
                    >
                      <div
                        className="w-7 h-7 flex items-center justify-center shrink-0"
                        style={{
                          border: `1px solid ${completed ? "rgba(34,197,94,0.4)" : active ? "color-mix(in srgb, var(--accent) 40%, transparent)" : "var(--border)"}`,
                          background: completed ? "rgba(34,197,94,0.1)" : active ? "color-mix(in srgb, var(--accent) 10%, transparent)" : "transparent",
                          color: completed ? "rgb(34,197,94)" : active ? "var(--accent)" : "var(--muted)",
                        }}
                      >
                        {completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                      </div>
                      <span className="body-copy--sm" style={{ color: active || completed ? "var(--fg)" : "var(--muted)" }}>
                        {step.text}
                      </span>
                      {active && (
                        <motion.span
                          animate={{ opacity: [1, 0] }}
                          transition={{ duration: 0.7, repeat: Infinity }}
                          style={{ color: "var(--accent)" }}
                          className="text-sm"
                        >▊</motion.span>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Log pane */}
              <div
                ref={logRef}
                className="h-40 overflow-y-auto p-3 space-y-0.5"
                style={{
                  background: "rgba(0,0,0,0.5)",
                  border: "1px solid color-mix(in srgb, var(--accent) 15%, transparent)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  scrollbarWidth: "none",
                }}
              >
                {visibleLogs.map((log, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      color: log.includes("[OK]") ? "rgb(34,197,94)" : log.startsWith(">") ? "rgba(59,130,246,0.9)" : "var(--muted)",
                    }}
                  >
                    {log}
                    {idx === visibleLogs.length - 1 && (
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                        className="ml-1"
                      >_</motion.span>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Access granted */}
              <AnimatePresence>
                {isComplete && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center justify-center gap-2 py-3"
                    style={{
                      border: "1px solid rgba(34,197,94,0.3)",
                      background: "rgba(34,197,94,0.06)",
                    }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.4 }}
                    >
                      <CheckCircle2 className="w-5 h-5" style={{ color: "rgb(34,197,94)" }} />
                    </motion.div>
                    <span className="sys-label" style={{ color: "rgb(34,197,94)", letterSpacing: "0.25em" }}>
                      ACCESS GRANTED
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Footer note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="sys-label text-center mt-4"
          >
            Powered by Voice Sentinel AI · Secure Audio Analysis System
          </motion.p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
