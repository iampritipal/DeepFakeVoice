import { Radio, Wifi, History } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="border-b bg-card/80 backdrop-blur-xl px-6 py-3 flex items-center justify-between sticky top-0 z-50"
         style={{ borderColor: "var(--border)" }}>
      <div className="flex items-center gap-3">
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Radio className="w-8 h-8" style={{ color: "var(--accent)" }} />
        </motion.div>
        <div>
          <h1 className="font-display text-lg font-bold tracking-tight" style={{ color: "var(--fg)" }}>
            Audio Deepfake Detector
          </h1>
          <p className="sys-label">AI Voice Authentication System</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/history")}
          className="nav-link flex items-center gap-2"
        >
          <History className="w-4 h-4" />
          History
        </button>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
             style={{ background: "color-mix(in srgb, var(--accent) 10%, transparent)", border: "1px solid color-mix(in srgb, var(--accent) 20%, transparent)" }}>
          <span className="status-dot"></span>
          <span className="sys-label" style={{ color: "var(--accent)" }}>SYSTEM ACTIVE</span>
        </div>
        <div className="flex items-center gap-1.5" style={{ color: "var(--muted)" }}>
          <Wifi className="w-4 h-4" />
          <span className="nav-text">CONNECTED</span>
        </div>
      </div>
    </nav>
  );
}
