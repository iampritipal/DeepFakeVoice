import { motion } from "framer-motion";
import { Upload, Mic, ShieldCheck, AlertTriangle } from "lucide-react";

const BARS = Array.from({ length: 40 }, (_, i) => ({
  h: 8 + (i % 7) * 10,
  delay: i * 0.03,
  dur: 0.7 + (i % 4) * 0.2,
}));

const RECENT = [
  { name: "voice_sample_01.mp3", result: "Real Voice",       score: 94, safe: true },
  { name: "call_recording.wav",  result: "Deepfake Detected", score: 12, safe: false },
  { name: "interview_clip.mp3",  result: "Real Voice",       score: 88, safe: true },
];

export function DashboardPreview() {
  return (
    <div
      className="rounded-xl overflow-hidden border border-white/10 shadow-2xl"
      style={{ background: "rgba(8,10,18,0.95)", backdropFilter: "blur(20px)" }}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <div className="w-3 h-3 rounded-full bg-green-500/70" />
        </div>
        <span className="text-xs font-mono text-white/40 mx-auto">VoiceGuard AI — Detection Dashboard</span>
      </div>

      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Upload + Waveform */}
        <div className="space-y-4">
          {/* Upload panel */}
          <div className="rounded-lg border border-white/10 p-4 bg-white/5">
            <p className="text-xs font-mono text-white/40 uppercase tracking-widest mb-3">Audio Input</p>
            <div className="border border-dashed border-blue-500/30 rounded-lg p-4 flex flex-col items-center gap-2 bg-blue-500/5">
              <Upload className="w-6 h-6 text-blue-400" />
              <span className="text-xs text-white/50">Drop audio file or record</span>
              <div className="flex gap-2 mt-1">
                <button className="text-xs px-3 py-1 rounded border border-blue-500/40 text-blue-400 hover:bg-blue-500/10 transition-colors">
                  Upload File
                </button>
                <button className="text-xs px-3 py-1 rounded border border-white/20 text-white/50 flex items-center gap-1 hover:bg-white/5 transition-colors">
                  <Mic className="w-3 h-3" /> Record
                </button>
              </div>
            </div>
          </div>

          {/* Waveform */}
          <div className="rounded-lg border border-white/10 p-4 bg-white/5">
            <p className="text-xs font-mono text-white/40 uppercase tracking-widest mb-3">Waveform Analysis</p>
            <div className="flex items-end gap-[2px] h-14">
              {BARS.map((bar, i) => (
                <motion.div
                  key={i}
                  className="flex-1 rounded-sm"
                  style={{ background: "linear-gradient(to top, #3b82f6, #60a5fa)", minWidth: 2 }}
                  animate={{ height: [bar.h * 0.4, bar.h, bar.h * 0.4] }}
                  transition={{ duration: bar.dur, delay: bar.delay, repeat: Infinity, ease: "easeInOut" }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right: Score + Results */}
        <div className="space-y-4">
          {/* Authenticity score */}
          <div className="rounded-lg border border-white/10 p-4 bg-white/5">
            <p className="text-xs font-mono text-white/40 uppercase tracking-widest mb-3">Authenticity Score</p>
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
                  <motion.circle
                    cx="18" cy="18" r="15.9" fill="none"
                    stroke="#3b82f6" strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="100"
                    initial={{ strokeDashoffset: 100 }}
                    animate={{ strokeDashoffset: 6 }}
                    transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-400">94%</span>
                </div>
              </div>
              <div>
                <motion.div
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mb-1"
                  style={{ background: "rgba(34,197,94,0.15)", color: "rgb(74,222,128)", border: "1px solid rgba(34,197,94,0.3)" }}
                  animate={{ boxShadow: ["0 0 0px rgba(34,197,94,0)", "0 0 12px rgba(34,197,94,0.4)", "0 0 0px rgba(34,197,94,0)"] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <ShieldCheck className="w-3 h-3" /> Real Voice
                </motion.div>
                <p className="text-xs text-white/40">Confidence: 94.2%</p>
              </div>
            </div>
          </div>

          {/* AI Scan indicator */}
          <div className="rounded-lg border border-white/10 p-4 bg-white/5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-mono text-white/40 uppercase tracking-widest">AI Scan</p>
              <motion.div
                className="flex items-center gap-1.5 text-xs text-blue-400"
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                Analyzing
              </motion.div>
            </div>
            <div className="space-y-1.5">
              {["Spectral Analysis", "Pattern Matching", "Neural Inference"].map((label, i) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="text-xs text-white/40 w-32 shrink-0">{label}</span>
                  <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-blue-500"
                      initial={{ width: "0%" }}
                      animate={{ width: ["0%", "100%", "0%"] }}
                      transition={{ duration: 2.5, delay: i * 0.4, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent results */}
          <div className="rounded-lg border border-white/10 p-4 bg-white/5">
            <p className="text-xs font-mono text-white/40 uppercase tracking-widest mb-3">Recent Analyses</p>
            <div className="space-y-2">
              {RECENT.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.15 }}
                  className="flex items-center justify-between"
                >
                  <span className="text-xs text-white/50 truncate max-w-[120px]">{item.name}</span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{
                      background: item.safe ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
                      color: item.safe ? "rgb(74,222,128)" : "rgb(248,113,113)",
                      border: `1px solid ${item.safe ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"}`,
                    }}
                  >
                    {item.safe ? <ShieldCheck className="w-3 h-3 inline mr-1" /> : <AlertTriangle className="w-3 h-3 inline mr-1" />}
                    {item.score}%
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
