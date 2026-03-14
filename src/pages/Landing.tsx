import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Radio, Shield, Zap, Lock, Mic, Upload, Brain, Users,
  Newspaper, Phone, ArrowRight, CheckCircle2,
} from "lucide-react";
import { useEffect } from "react";
import { DashboardPreview } from "@/components/DashboardPreview";
import { initScrollInteractions } from "@/lib/scrollInteractions";

const STEPS = [
  { icon: Upload,       num: "01", title: "Upload or Record",            desc: "Drop an audio file or record directly via microphone." },
  { icon: Brain,        num: "02", title: "AI Analyzes Waveform",        desc: "Our CNN-LSTM model extracts spectral and temporal features." },
  { icon: Shield,       num: "03", title: "Detect Deepfake Patterns",    desc: "The system identifies synthetic artifacts and voice cloning signatures." },
  { icon: CheckCircle2, num: "04", title: "Receive Authenticity Result", desc: "Get a confidence score and detailed breakdown instantly." },
];

const FEATURES = [
  { icon: Zap,    title: "Real-Time Detection",          desc: "Full analysis in under 100ms using optimized neural inference." },
  { icon: Brain,  title: "Deepfake Audio Analysis",      desc: "Detects AI-generated speech, voice cloning, and GAN artifacts." },
  { icon: Radio,  title: "AI Voice Signature Detection", desc: "Identifies unique synthetic patterns left by TTS and voice conversion models." },
  { icon: Mic,    title: "Upload or Record",             desc: "Supports file upload (.mp3, .wav, .webm) and live microphone recording." },
  { icon: Lock,   title: "Private Processing",           desc: "All analysis runs on-device. Your audio never leaves your machine." },
  { icon: Shield, title: "97.3% Accuracy",               desc: "Trained on diverse real and synthetic voice datasets." },
];

const USE_CASES = [
  { icon: Phone,     title: "Voice Scam Prevention",     desc: "Detect AI-cloned voices used in phone fraud and social engineering attacks." },
  { icon: Users,     title: "Business Call Verification", desc: "Verify the authenticity of recorded calls before acting on instructions." },
  { icon: Shield,    title: "Audio Evidence Integrity",   desc: "Confirm that recorded audio evidence has not been synthetically altered." },
  { icon: Radio,     title: "Social Media Monitoring",    desc: "Identify cloned voices spreading misinformation across platforms." },
  { icon: Newspaper, title: "Journalist Security",        desc: "Protect investigative reporters from fabricated audio sources." },
  { icon: Lock,      title: "Identity Verification",      desc: "Add a voice authenticity layer to your authentication pipeline." },
];

const WAVEFORM_BARS = Array.from({ length: 52 }, (_, i) => ({
  delay: i * 0.035,
  dur: 0.75 + (i % 5) * 0.18,
  min: 4 + (i % 3) * 4,
  max: 18 + (i % 7) * 9,
}));

export default function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => initScrollInteractions(), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* Scroll progress bar */}
      <div className="scroll-progress-track"><div className="scroll-progress-fill" /></div>
      {/* Grain overlay */}
      <div className="bg-noise" />

      {/* ── Nav ── */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-20 flex items-center justify-between px-6 md:px-10 py-5"
      >
        <div className="flex items-center gap-3">
          <motion.div
            className="relative w-8 h-8 flex items-center justify-center rounded-full"
            style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.3)" }}
          >
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ background: "rgba(59,130,246,0.2)" }}
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
            <Radio className="w-4 h-4 text-blue-400 relative z-10" />
          </motion.div>
          <span className="font-display text-sm font-semibold tracking-widest uppercase text-foreground">
            VoiceGuard AI
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          {["How It Works", "Features", "Use Cases"].map((label) => (
            <button
              key={label}
              onClick={() => document.getElementById(label.toLowerCase().replace(/ /g, "-"))?.scrollIntoView({ behavior: "smooth" })}
              className="nav-link"
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/login")} className="btn-nav">Sign In</button>
          <motion.button
            onClick={() => navigate("/signup")}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className="btn-outline"
          >
            Get Started
          </motion.button>
        </div>
      </motion.header>

      {/* ══ HERO ══════════════════════════════════════════════ */}
      <section id="hero-section" className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 pt-16 pb-24 text-center overflow-hidden cyber-grid">
        <div className="phase-grid" />
        <div className="phase-scanline" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="sys-tag mb-8 mx-auto"
          >
            <span className="status-dot" />
            AI-Powered Deepfake Voice Detection
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }}
            className="headline-xl mb-6"
            style={{ color: "#ffffff", opacity: 1, overflow: "visible" }}
          >
            Detect Deepfake Voices<br />with AI Precision
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="body-copy max-w-2xl mx-auto mb-10"
          >
            VoiceGuard AI analyzes audio recordings to detect AI-generated or cloned voices
            using advanced machine learning models — entirely on your device.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <motion.button
              onClick={() => navigate("/dashboard")}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="btn-primary glow-accent"
            >
              Try Voice Detection <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>

          {/* Waveform */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="flex items-end justify-center gap-[3px] h-16 mb-16" aria-hidden
          >
            {WAVEFORM_BARS.map((bar, i) => (
              <motion.div
                key={i} className="w-[3px] rounded-full"
                style={{ background: "linear-gradient(to top, rgba(59,130,246,0.8), rgba(147,197,253,0.5))" }}
                animate={{ height: [bar.min, bar.max, bar.min] }}
                transition={{ duration: bar.dur, delay: bar.delay, repeat: Infinity, ease: "easeInOut" }}
              />
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            className="grid grid-cols-3 gap-8 max-w-lg mx-auto"
          >
            {[
              { value: "97.3%", label: "Detection Accuracy" },
              { value: "<100ms", label: "Analysis Speed" },
              { value: "6+", label: "AI Indicators" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75 + i * 0.1 }}
                className="text-center"
              >
                <div className="headline-md text-glow-accent mb-1" style={{ color: "var(--accent)" }}>{stat.value}</div>
                <div className="sys-label">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══════════════════════════════════════ */}
      <section id="how-it-works" className="py-28 px-6 md:px-10">
        <div className="max-w-5xl mx-auto">
          <SectionLabel label="How It Works" />
          <SectionHeading>From audio to answer in seconds</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.5 }}
                className="module-card reveal-item relative rounded-xl p-6 group"
              >
                <div className="sys-label mb-4" style={{ color: "rgba(59,130,246,0.5)" }}>{step.num}</div>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-colors group-hover:bg-blue-500/20"
                  style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)" }}>
                  <step.icon className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="font-mono text-sm font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="body-copy--sm">{step.desc}</p>

              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ DASHBOARD PREVIEW ═════════════════════════════════ */}
      <section id="demo-section" className="py-20 px-6 md:px-10 section-slab">
        <div className="section-inner max-w-5xl mx-auto">
          <SectionLabel label="Product Demo" />
          <SectionHeading>See the platform in action</SectionHeading>
          <p className="body-copy text-center max-w-xl mx-auto mb-12">
            This is what the detection interface looks like. Upload audio, watch the AI scan, and receive your result.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}
            className="glow-accent rounded-xl overflow-hidden"
          >
            <DashboardPreview />
          </motion.div>
        </div>
      </section>

      {/* ══ FEATURES ══════════════════════════════════════════ */}
      <section id="features" className="py-28 px-6 md:px-10">
        <div className="max-w-5xl mx-auto">
          <SectionLabel label="Key Features" />
          <SectionHeading>Built for precision. Designed for trust.</SectionHeading>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-14">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }}
                className="feature-card reveal-item rounded-xl p-6 cursor-default group"
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors"
                  style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.15)" }}>
                  <f.icon className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="font-mono text-sm font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="body-copy--sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ USE CASES ═════════════════════════════════════════ */}
      <section id="use-cases" className="py-28 px-6 md:px-10 section-slab">
        <div className="section-inner max-w-5xl mx-auto">
          <SectionLabel label="Use Cases" />
          <SectionHeading>Real-world applications</SectionHeading>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-14">
            {USE_CASES.map((uc, i) => (
              <motion.div
                key={uc.title}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }}
                className="module-card reveal-item rounded-xl p-6 cursor-default"
              >
                <uc.icon className="w-5 h-5 text-blue-400 mb-3" />
                <h3 className="font-mono text-sm font-semibold text-foreground mb-2">{uc.title}</h3>
                <p className="body-copy--sm">{uc.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ═══════════════════════════════════════════════ */}
      <section id="cta-section" className="py-28 px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="pricing-card-featured max-w-3xl mx-auto text-center rounded-2xl p-12 relative overflow-hidden"
        >
          <div className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.15) 0%, transparent 60%)" }} />
          <div className="relative z-10">
            <div className="sys-label sys-label--accent mb-4">Get Protected</div>
            <h2 className="headline-lg mb-4">
              Protect Yourself from<br />AI Voice Fraud
            </h2>
            <p className="body-copy mb-8 max-w-md mx-auto">
              Start detecting deepfake voices today with VoiceGuard AI. Free to use, no data stored.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                onClick={() => navigate("/signup")}
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                className="btn-primary glow-accent"
              >
                Create Free Account <ArrowRight className="w-4 h-4" />
              </motion.button>
              <motion.button
                onClick={() => navigate("/dashboard")}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="btn-ghost"
              >
                Try Voice Detection <span className="btn-arrow">→</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="site-footer px-6 md:px-10 pb-8 mt-0">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-blue-400" />
          <span>VoiceGuard AI © {new Date().getFullYear()}</span>
        </div>
        <span>All audio processed locally — zero data exposure</span>
      </footer>
    </div>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex items-center justify-center gap-2 mb-4"
    >
      <div className="h-px w-8 bg-blue-500/40" />
      <span className="sys-label sys-label--accent">{label}</span>
      <div className="h-px w-8 bg-blue-500/40" />
    </motion.div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ delay: 0.05 }}
      className="headline-lg text-center"
    >
      {children}
    </motion.h2>
  );
}
