'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, SkipForward } from 'lucide-react';
import Image from 'next/image';

// ==========================================
// 1. ESTILOS DE ALTA PERFORMANCE (CSS PURO)
// ==========================================
const PerformanceStyles = () => (
  <style>{`
    @keyframes floatUp {
      0% { transform: translateY(0); opacity: 0; }
      20% { opacity: var(--max-opacity); }
      80% { opacity: var(--max-opacity); }
      100% { transform: translateY(-60px); opacity: 0; }
    }
    .animate-float {
      animation: floatUp var(--duration) infinite ease-in-out;
      animation-delay: var(--delay);
      will-change: transform, opacity;
    }
    @keyframes sparkRise {
      0% { transform: translateY(0) scale(1); opacity: 0; }
      50% { opacity: 1; }
      100% { transform: translateY(-100vh) scale(0.5); opacity: 0; }
    }
    .animate-spark {
      animation: sparkRise var(--duration) infinite linear;
      animation-delay: var(--delay);
      will-change: transform, opacity;
    }
  `}</style>
);

// ==========================================
// 2. HOOK DE CONTAGEM REGRESSIVA
// ==========================================
function useCountdown(targetDate: string) {
  const [timeLeft, setTimeLeft] = useState({ days: '00', hours: '00', minutes: '00', seconds: '00' });

  useEffect(() => {
    const calculate = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)).toString().padStart(2, '0'),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24).toString().padStart(2, '0'),
          minutes: Math.floor((difference / 1000 / 60) % 60).toString().padStart(2, '0'),
          seconds: Math.floor((difference / 1000) % 60).toString().padStart(2, '0'),
        });
      } else {
        // Trava no zero se o evento já passou
        setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' });
      }
    };
    calculate();
    const timer = setInterval(calculate, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);
  return timeLeft;
}

// ==========================================
// 3. ÍCONES E COMPONENTES VISUAIS
// ==========================================
const InstagramIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);
const YoutubeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.13 1 12 1 12s0 3.87.46 5.58a2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.87 23 12 23 12s0-3.87-.46-5.58z"></path><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"></polygon></svg>
);
const SpotifyIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 11.5c2.5-1.5 6-1.5 8-.5"></path><path d="M9 14.5c2-1 4.5-1 6.5-.5"></path><path d="M10 17c1.5-.5 3.5-.5 5 0"></path></svg>
);
const WhatsappIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
);

const Sparks = () => {
  const sparks = useMemo(() => [...Array(25)].map((_, i) => ({
    id: i,
    left: Math.random() * 100 + "%",
    duration: Math.random() * 3 + 4 + "s",
    delay: Math.random() * 5 + "s"
  })), []);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {sparks.map(s => (
        <div key={s.id} className="absolute bottom-0 w-1 h-1 bg-orange-500 rounded-full animate-spark" 
             style={{ left: s.left, '--duration': s.duration, '--delay': s.delay } as React.CSSProperties} />
      ))}
    </div>
  );
};

// ==========================================
// 4. TELAS DA EXPERIÊNCIA
// ==========================================

function SplashScreen({ onStart }: { onStart: () => void }) {
  const [isZooming, setIsZooming] = useState(false);
  const [deviceConfig, setDeviceConfig] = useState({ originX: 76.5, originY: 50, maskSize: 350, isMobile: false });
  
  // Refs para manipular o DOM direto (Alta Performance, evita re-renders)
  const spotlightRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const isMob = window.innerWidth < 768;
    setDeviceConfig({ 
      originX: isMob ? 69 : 69, 
      originY: 49, 
      maskSize: isMob ? 220 : 350, 
      isMobile: isMob 
    });

    let animationFrameId: number;

    const updateLight = (x: number, y: number) => {
      if (isZooming) return;
      
      // Atualiza o background da lanterna direto no DOM
      if (spotlightRef.current) {
        spotlightRef.current.style.background = `radial-gradient(circle ${isMob ? 220 : 350}px at ${x}px ${y}px, rgba(249, 115, 22, 0.15), transparent 80%)`;
      }
      
      // Atualiza a máscara da logo direto no DOM
      if (maskRef.current) {
        const offsetX = isMob ? 0 : 400;
        const offsetY = isMob ? 0 : 100;
        const maskX = x - (window.innerWidth / 2 - offsetX);
        const maskY = y - (window.innerHeight / 2 - offsetY);
        const maskStyle = `radial-gradient(circle ${isMob ? 170 : 300}px at ${maskX}px ${maskY}px, black 0%, transparent 80%)`;
        
        maskRef.current.style.maskImage = maskStyle;
        maskRef.current.style.webkitMaskImage = maskStyle;
      }
    };

    if (isMob) {
      const animateLightAuto = () => {
        if (!isZooming) {
          const time = Date.now() / 1500;
          const x = window.innerWidth / 2 + Math.sin(time) * (window.innerWidth * 0.35);
          const y = window.innerHeight / 2 + Math.cos(time * 0.8) * 30;
          updateLight(x, y);
          animationFrameId = requestAnimationFrame(animateLightAuto);
        }
      };
      animateLightAuto();
    } else {
      const handleMove = (e: MouseEvent) => updateLight(e.clientX, e.clientY);
      window.addEventListener('mousemove', handleMove);
      // Força a primeira atualização no centro da tela
      updateLight(window.innerWidth / 2, window.innerHeight / 2);
      return () => window.removeEventListener('mousemove', handleMove);
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isZooming]);

  const handleTrigger = () => {
    setIsZooming(true);
    // Remove os efeitos inline para não conflitar com a animação do Framer Motion
    if (spotlightRef.current) spotlightRef.current.style.opacity = '0';
    if (maskRef.current) {
      maskRef.current.style.maskImage = 'none';
      maskRef.current.style.webkitMaskImage = 'none';
      maskRef.current.style.filter = 'none';
    }
    setTimeout(onStart, 1300);
  };

  return (
    <motion.div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black overflow-hidden" exit={{ opacity: 0 }}>
      <Sparks />

      <div ref={spotlightRef} className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300" />
      
      <motion.div
        animate={isZooming ? { scale: 60, opacity: 0 } : { scale: 1, opacity: 1 }}
        transition={{ duration: 1.3, ease: "easeIn" }}
        style={{ transformOrigin: `${deviceConfig.originX}% ${deviceConfig.originY}%`, willChange: "transform, opacity" }} 
        className="relative w-[85vw] max-w-[850px] h-[300px]"
      >
        <Image src="/logochama.png" alt="Logo" fill priority className="object-contain opacity-40 brightness-50" />
        
        <img 
          ref={maskRef}
          src="/logochama.png" 
          alt="Logo Reveal"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          style={{ filter: 'drop-shadow(0px 0px 20px rgba(249,115,22,0.6))' }} 
        />
      </motion.div>

      {!isZooming && (
        <button onClick={handleTrigger} className="absolute bottom-16 md:bottom-20 px-10 py-4 rounded-full border border-orange-500/30 bg-black/40 backdrop-blur-md text-orange-400 tracking-[0.4em] text-xs font-bold hover:bg-orange-600 hover:text-white transition-all z-20">
          INICIAR CELEBRAÇÃO
        </button>
      )}
    </motion.div>
  );
}

function VideoScreen({ onEnded }: { onEnded: () => void }) {
  return (
    <motion.div className="absolute inset-0 z-[60] bg-black flex flex-col items-center justify-center overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      
      <div className="absolute inset-0 -z-20">
        <Image src="/chama.png" alt="Fundo Blur" fill priority className="object-cover opacity-20 blur-xl scale-110" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/40 to-black/90" />
      </div>

      <Sparks />

      <motion.div
        animate={{ filter: ['drop-shadow(0px 0px 10px rgba(249,115,22,0.2))', 'drop-shadow(0px 0px 20px rgba(249,115,22,0.5))', 'drop-shadow(0px 0px 10px rgba(249,115,22,0.2))'] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 md:top-12 z-50 opacity-80 h-12 md:h-16 w-32 md:w-48"
      >
        <Image src="/20anos.png" alt="20 Anos" fill className="object-contain" />
      </motion.div>

      <div className="relative w-full max-w-5xl aspect-video z-10 flex items-center justify-center shadow-2xl">
        {/* muted adicionado para garantir autoplay no iOS/Android Safari. onError fallback garantido. */}
        <video src="/intro.mp4" autoPlay muted playsInline onEnded={onEnded} onError={onEnded} className="w-full h-full object-contain md:object-cover" />
      </div>

      <button onClick={onEnded} className="absolute bottom-10 right-6 md:right-10 flex items-center gap-2 text-white/70 hover:text-white bg-black/60 backdrop-blur-md px-6 py-3 rounded-full text-xs tracking-widest border border-white/10 z-50 transition-all">
        PULAR <SkipForward size={14} />
      </button>
    </motion.div>
  );
}

function MainCountdown({ days, hours, minutes, seconds }: any) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }} className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
      
      <div className="absolute inset-0 -z-30">
        <Image src="/chama.png" alt="Fundo Coral" fill priority className="object-cover opacity-40 scale-105" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/40 to-black" />
      </div>

      <Sparks />

      <div className="text-center flex flex-col items-center z-20 w-full max-w-4xl mx-auto mt-6 md:mt-0">
        
        <motion.div
          animate={{ filter: ['drop-shadow(0px 0px 15px rgba(249,115,22,0.4))', 'drop-shadow(0px 0px 40px rgba(249,115,22,0.8))', 'drop-shadow(0px 0px 15px rgba(249,115,22,0.4))'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="relative mb-6 md:mb-10 mt-8 md:mt-0 h-20 md:h-36 w-48 md:w-80"
        >
          <Image src="/20anos.png" alt="20 Anos" fill priority className="object-contain" />
        </motion.div>

        <h2 className="text-orange-500 font-bold tracking-[0.5em] text-xs mb-3 uppercase">Save The Date</h2>
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white mb-8 md:mb-10 drop-shadow-2xl">31.OUT</h1>

        <div className="flex gap-2 md:gap-6 mb-10 md:mb-12">
          <TimeBlock value={days} label="DIAS" />
          <TimeBlock value={hours} label="HORAS" />
          <TimeBlock value={minutes} label="MIN" />
          <TimeBlock value={seconds} label="SEG" />
        </div>

        <a href="https://chat.whatsapp.com/GPnQr4BCTGzEQPNyZLumgu?s=cl&p=a&mlu=4" target="_blank" rel="noopener noreferrer" className="relative group mb-6 w-full max-w-sm">
          <div className="absolute inset-0 bg-[#25D366] rounded-full blur-md opacity-40 group-hover:opacity-80 transition-opacity duration-500 animate-pulse"></div>
          <div className="relative flex items-center justify-center gap-4 bg-gradient-to-r from-[#1EBE57] to-[#25D366] border border-[#25D366]/50 px-8 py-5 rounded-full shadow-2xl hover:scale-105 transition-transform duration-300">
            <span className="text-white"><WhatsappIcon /></span>
            <span className="font-black text-white tracking-widest text-sm md:text-base">GARANTIR MEU INGRESSO</span>
          </div>
        </a>

        <a href="https://www.google.com/calendar/render?action=TEMPLATE&text=20+Anos+Chama+Coral&dates=20261031T200000Z/20261031T230000Z" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-white text-xs tracking-widest transition-colors border-b border-transparent hover:border-white pb-1 mb-8">
          <Calendar size={14} /> ADICIONAR AO CALENDÁRIO
        </a>

        <div className="flex gap-10 mt-2 opacity-70">
          <a href="https://www.instagram.com/chamacoral" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 hover:scale-110 hover:opacity-100 transition-all duration-300"><InstagramIcon /></a>
          <a href="https://www.youtube.com/@chamacoral" target="_blank" rel="noopener noreferrer" className="hover:text-red-600 hover:scale-110 hover:opacity-100 transition-all duration-300"><YoutubeIcon /></a>
          <a href="https://open.spotify.com/intl-pt/artist/0TDC1ivOZb4LiNYWYirJ2B" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 hover:scale-110 hover:opacity-100 transition-all duration-300"><SpotifyIcon /></a>
        </div>
      </div>
    </motion.div>
  );
}

function TimeBlock({ value, label }: { value: string, label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-[4.5rem] h-20 md:w-32 md:h-40 bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center">
        <span className="text-3xl md:text-7xl font-black text-white">{value}</span>
      </div>
      <span className="mt-3 md:mt-4 text-[9px] md:text-xs tracking-[0.3em] text-orange-500 font-bold">{label}</span>
    </div>
  );
}

// ==========================================
// 5. ORQUESTRADOR FINAL
// ==========================================
export default function Home() {
  const targetDate = '2026-10-31T20:00:00';
  const { days, hours, minutes, seconds } = useCountdown(targetDate);
  const [appState, setAppState] = useState<'splash' | 'video' | 'main'>('splash');
  const [mounted, setMounted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => setMounted(true), []);

  const handleVideoEnded = () => {
    setAppState('main');
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(() => {});
    }
  };

  if (!mounted) return <div className="bg-black min-h-screen" />;

  return (
    <main className="relative min-h-screen w-full bg-black">
      <PerformanceStyles />
      <audio ref={audioRef} src="/Aleluia.mp3" loop />
      
      <AnimatePresence mode="wait">
        {appState === 'splash' && <SplashScreen key="splash" onStart={() => setAppState('video')} />}
        {appState === 'video' && <VideoScreen key="video" onEnded={handleVideoEnded} />}
      </AnimatePresence>
      
      {appState === 'main' && <MainCountdown days={days} hours={hours} minutes={minutes} seconds={seconds} />}
    </main>
  );
}