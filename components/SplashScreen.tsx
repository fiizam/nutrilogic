"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity } from "lucide-react";

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let hasSeenSplash = false;
    try {
      hasSeenSplash = !!sessionStorage.getItem("hasSeenSplash");
    } catch (e) {
      // Abaikan jika browser memblokir sessionStorage (contoh: Incognito Mode)
    }
    
    if (hasSeenSplash) {
      setIsVisible(false);
      return;
    }

    // Set waktu animasi (misal 1.5 detik)
    const timer = setTimeout(() => {
      setIsVisible(false);
      try {
        sessionStorage.setItem("hasSeenSplash", "true");
      } catch (e) {}
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-[#050505] flex flex-col items-center justify-center pointer-events-none"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center gap-4"
          >
            <div className="relative">
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-[#00FFB2] rounded-xl blur-xl"
              />
              <div className="relative w-16 h-16 rounded-xl bg-gradient-to-tr from-[#00FFB2] to-[#00A3FF] p-[2px]">
                <div className="w-full h-full bg-[#050505] rounded-xl flex items-center justify-center">
                  <Activity className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
            
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-center"
            >
              <h1 className="text-3xl font-black tracking-tight text-white font-space">
                Nutri<span className="text-[#00FFB2]">Logic</span>
              </h1>
              <p className="text-sm text-neutral-400 mt-2 font-medium">Optimasi Nutrisi & Latihan</p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
