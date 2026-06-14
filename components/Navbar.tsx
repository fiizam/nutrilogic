// src/components/Navbar.tsx
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Activity } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Perencana AI', path: '/planner' },
    { name: 'Dataset TKPI', path: '/katalog' },
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 w-full z-50 transition-all duration-500 transform-gpu ${scrolled ? 'bg-[#050505]/70 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent py-6'}`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00FFB2] to-[#00A3FF] p-[1px]">
            <div className="w-full h-full bg-[#050505] rounded-xl flex items-center justify-center group-hover:bg-transparent transition-colors duration-300">
              <Activity className="w-5 h-5 text-white" />
            </div>
          </div>
          <span className="font-space font-bold text-xl text-white tracking-tight">Nutri<span className="text-[#00FFB2]">Logic</span></span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link key={link.name} href={link.path} className="relative px-5 py-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors group">
                {link.name}
                {isActive && <motion.div layoutId="nav-indicator" className="absolute bottom-0 left-0 w-full h-[2px] bg-[#00FFB2] rounded-full" />}
              </Link>
            );
          })}
          {/* <Link href="/planner" className="ml-4 px-6 py-2.5 rounded-full bg-white text-black text-sm font-bold hover:bg-[#00FFB2] hover:shadow-[0_0_20px_rgba(0,255,178,0.4)] transition-all duration-300">
            Launch App
          </Link> */}
        </div>

        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white">
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-[#0a0a0a] border-b border-white/10 overflow-hidden">
            <div className="flex flex-col px-6 py-6 gap-4">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.path} onClick={() => setIsOpen(false)} className={`text-lg font-medium ${pathname === link.path ? 'text-[#00FFB2]' : 'text-neutral-400'}`}>
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}