import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Radio, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);

  return (
    <div className="min-h-screen bg-background cyber-grid flex items-center justify-center px-4">

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.3)" }}>
            <Radio className="w-4 h-4 text-blue-400" />
          </div>
          <span className="font-mono text-sm font-semibold tracking-widest uppercase text-foreground">VoiceGuard AI</span>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 p-8"
          style={{ background: "rgba(8,10,18,0.85)", backdropFilter: "blur(20px)" }}>
          <h1 className="font-mono text-xl font-bold text-foreground mb-1">Welcome back</h1>
          <p className="text-xs text-muted-foreground mb-8">Sign in to your VoiceGuard AI account</p>

          <div className="space-y-4">
            <Field label="Email" type="email" placeholder="you@example.com" />
            <Field label="Password" type={showPass ? "text" : "password"} placeholder="••••••••"
              suffix={
                <button type="button" onClick={() => setShowPass(v => !v)} className="text-muted-foreground hover:text-foreground transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
                  className="w-3.5 h-3.5 accent-blue-500" />
                <span className="text-xs text-muted-foreground">Remember me</span>
              </label>
              <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors">Forgot password?</button>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/dashboard")}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-mono text-sm font-semibold text-white mt-2"
              style={{ background: "linear-gradient(135deg, #2563eb, #3b82f6)", boxShadow: "0 0 20px rgba(59,130,246,0.3)" }}
            >
              Sign In <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-6">
            Don't have an account?{" "}
            <button onClick={() => navigate("/signup")} className="text-blue-400 hover:text-blue-300 transition-colors">
              Create one
            </button>
          </p>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-6 font-mono">
          All audio processed locally — zero data exposure
        </p>
      </motion.div>
    </div>
  );
}

function Field({ label, type, placeholder, suffix }: {
  label: string; type: string; placeholder: string; suffix?: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-mono text-muted-foreground mb-1.5">{label}</label>
      <div className="relative flex items-center">
        <input
          type={type}
          placeholder={placeholder}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 font-mono focus:outline-none focus:border-blue-500/50 focus:bg-blue-500/5 transition-all"
        />
        {suffix && <div className="absolute right-3">{suffix}</div>}
      </div>
    </div>
  );
}
