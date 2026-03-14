import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Radio, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function Signup() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
          <h1 className="font-mono text-xl font-bold text-foreground mb-1">Create your account</h1>
          <p className="text-xs text-muted-foreground mb-8">Start detecting deepfake voices for free</p>

          <div className="space-y-4">
            <Field label="Full Name" type="text" placeholder="Jane Smith" />
            <Field label="Email" type="email" placeholder="you@example.com" />
            <Field label="Password" type={showPass ? "text" : "password"} placeholder="••••••••"
              suffix={
                <button type="button" onClick={() => setShowPass(v => !v)} className="text-muted-foreground hover:text-foreground transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />
            <Field label="Confirm Password" type={showConfirm ? "text" : "password"} placeholder="••••••••"
              suffix={
                <button type="button" onClick={() => setShowConfirm(v => !v)} className="text-muted-foreground hover:text-foreground transition-colors">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/dashboard")}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-mono text-sm font-semibold text-white mt-2"
              style={{ background: "linear-gradient(135deg, #2563eb, #3b82f6)", boxShadow: "0 0 20px rgba(59,130,246,0.3)" }}
            >
              Create Account <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-6">
            Already have an account?{" "}
            <button onClick={() => navigate("/login")} className="text-blue-400 hover:text-blue-300 transition-colors">
              Sign in
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
