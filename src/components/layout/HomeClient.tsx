'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useGSAP } from '@/src/hooks/useGSAP';
import gsap from 'gsap';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/src/components/ui/theme-toggle';
import {
  Zap, TrendingUp, BarChart3, Cpu, LogOut, Sun,
  Play, Pause, Tv2, ChevronLeft, ChevronRight, X,
} from 'lucide-react';

import { GDModule } from '@/src/components/modules/gd/GDModule';
import { CommercialModule } from '@/src/components/modules/commercial/CommercialModule';
import { TradingModule } from '@/src/components/modules/trading/TradingModule';
import { BitcoinOperacoesModule } from '@/src/components/modules/bitcoin/BitcoinOperacoesModule';
import { GrandeSertaoModule } from '@/src/components/modules/grandesertao/GrandeSertaoModule';
import { handleSignOut } from '@/src/lib/actions';

type TabId = 'gd' | 'comercial' | 'trading' | 'bitcoin' | 'grandesertao';

const NAV_ITEMS = [
  { id: 'gd' as TabId, label: 'Geração Distribuída', icon: Zap },
  { id: 'grandesertao' as TabId, label: 'Grande Sertão II', icon: Sun },
  { id: 'comercial' as TabId, label: 'Comercial', icon: TrendingUp },
  { id: 'trading' as TabId, label: 'Trading & Risco', icon: BarChart3 },
  { id: 'bitcoin' as TabId, label: 'Bitcoin & Operações', icon: Cpu },
] as const;

/**
 * Registro de slides do modo TV.
 * Cada entrada representa 1 slide exibido em tela cheia.
 * moduleId: qual aba host; tvSlide: sub-slide dentro do módulo.
 */
const TV_SLIDES = [
  { moduleId: 'gd' as TabId,       label: 'Geração Distribuída',      tvSlide: 0 },
  { moduleId: 'grandesertao' as TabId, label: 'Grande Sertão II',     tvSlide: 0 },
  { moduleId: 'comercial' as TabId, label: 'Comercial — PPA',          tvSlide: 0 },
  { moduleId: 'comercial' as TabId, label: 'Comercial — Energia Fácil', tvSlide: 1 },
  { moduleId: 'comercial' as TabId, label: 'Comercial — BESS',          tvSlide: 2 },
  { moduleId: 'trading' as TabId,  label: 'Trading — Visão Contábil',  tvSlide: 0 },
  { moduleId: 'trading' as TabId,  label: 'Trading — Energia',         tvSlide: 1 },
  { moduleId: 'trading' as TabId,  label: 'Trading — Gás',             tvSlide: 2 },
  { moduleId: 'bitcoin' as TabId,  label: 'Bitcoin',                   tvSlide: 0 },
  { moduleId: 'bitcoin' as TabId,  label: 'Operações Estruturadas',    tvSlide: 1 },
] as const;

const TV_INTERVAL_SECONDS = 15;

export default function HomeClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTabIndex, setActiveTabIndex] = useState(1);
  const [tvMode, setTvMode] = useState(false);
  const [isTvPaused, setIsTvPaused] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const [tvSlideIndex, setTvSlideIndex] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  const activeTab = NAV_ITEMS[activeTabIndex].id;
  const currentTvSlide = TV_SLIDES[tvSlideIndex];

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const goToNextTvSlide = useCallback(() => {
    setTvSlideIndex((prev) => (prev + 1) % TV_SLIDES.length);
    setTimerKey((k) => k + 1);
  }, []);

  const enterTvMode = useCallback(() => {
    setTvMode(true);
    setIsTvPaused(false);
    setTvSlideIndex(0);
    setTimerKey(0);
    try {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } catch (e) {}
  }, []);

  const exitTvMode = useCallback(() => {
    setTvMode(false);
    setIsTvPaused(false);
    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    } catch (e) {}
  }, []);

  // Handle ESC key to exit TV mode
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && tvMode) {
        exitTvMode();
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [tvMode, exitTvMode]);

  // GSAP animations for the initial load and the TV progress bar
  useGSAP(() => {
    if (status === 'authenticated' && headerRef.current) {
      const tl = gsap.timeline();
      tl.fromTo(
        headerRef.current,
        { y: -100, opacity: 0, filter: 'blur(20px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1, ease: 'expo.out' }
      ).fromTo(
        '.nav-item',
        { y: 20, opacity: 0, scale: 0.8 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.1, ease: 'power4.out' },
        '-=0.8'
      );
    }
  }, [status]);

  useGSAP(() => {
    if (tvMode && progressBarRef.current) {
      if (tweenRef.current) {
        tweenRef.current.kill();
      }
      gsap.set(progressBarRef.current, { scaleX: 0, transformOrigin: 'left center' });
      
      tweenRef.current = gsap.to(progressBarRef.current, {
        scaleX: 1,
        duration: TV_INTERVAL_SECONDS,
        ease: 'none',
        onComplete: goToNextTvSlide,
      });

      if (isTvPaused) {
        tweenRef.current.pause();
      }
    }
  }, [tvMode, tvSlideIndex, timerKey]);

  useEffect(() => {
    if (tweenRef.current) {
      if (isTvPaused) tweenRef.current.pause();
      else tweenRef.current.play();
    }
  }, [isTvPaused]);

  // Reseta o timer quando muda de slide manualmente
  const handleManualPrev = useCallback(() => {
    setTvSlideIndex((prev) => (prev - 1 + TV_SLIDES.length) % TV_SLIDES.length);
    setTimerKey((prev) => prev + 1);
  }, []);

  const handleManualNext = useCallback(() => {
    setTvSlideIndex((prev) => (prev + 1) % TV_SLIDES.length);
    setTimerKey((prev) => prev + 1);
  }, []);

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin size-10 border-2 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            Inicializando...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-background text-foreground">

      {/* ─── Barra de progresso do modo TV ─── */}
      {tvMode && (
        <div className="fixed top-0 left-0 right-0 z-[100] h-1 bg-background">
          <div
            ref={progressBarRef}
            className="h-full bg-primary origin-left scale-x-0"
          />
        </div>
      )}

      {/* ─── Header ─── */}
      <div
        ref={headerRef}
        className={cn(
          'glass-header z-50 border-b border-border shadow-sm transition-all duration-500 bg-background/80 backdrop-blur-md',
          tvMode && 'py-0'
        )}
      >
        <header
          className={cn(
            'flex items-center justify-between px-8 transition-all duration-500',
            tvMode ? 'py-2' : 'py-4'
          )}
        >
          <Image
            src="/logo-matrix.svg"
            alt="Matrix Energia"
            width={128}
            height={32}
            className={cn('w-auto transition-all duration-500', tvMode ? 'h-6' : 'h-8')}
            priority
          />

          {/* Modo normal: nav de abas */}
          {!tvMode && (
            <nav ref={navRef} className="hidden lg:flex items-center gap-2 glass-card p-1.5 rounded-2xl mx-auto bg-card border border-border">
              {NAV_ITEMS.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    onClick={() => setActiveTabIndex(idx)}
                    className={cn(
                      'nav-item flex items-center gap-3 px-6 py-2.5 rounded-xl h-auto transition-all',
                      activeTab === item.id
                        ? 'bg-primary text-primary-foreground shadow-lg hover:bg-primary/90'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    )}
                  >
                    <Icon className="size-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
                  </Button>
                );
              })}
            </nav>
          )}

          {/* Modo TV: label do slide atual + controles prev/next + dots */}
          {tvMode && (
            <div className="flex items-center gap-3 ml-auto mr-auto">
              <div className="w-[200px] flex justify-end">
                <span className="text-xs font-bold text-primary uppercase tracking-widest text-right">
                  {currentTvSlide.label}
                </span>
              </div>

              <div className="flex items-center gap-2 ml-2">
                <button
                  onClick={handleManualPrev}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  aria-label="Slide anterior"
                >
                  <ChevronLeft className="size-4" />
                </button>

                {/* Dots por aba (agrupados) */}
                <div className="flex items-center gap-2 h-4">
                  {TV_SLIDES.map((slide, idx) => (
                    <button
                      key={idx}
                      onClick={() => { setTvSlideIndex(idx); setTimerKey((prev) => prev + 1); }}
                      title={slide.label}
                      className={cn(
                        'rounded-full transition-all duration-300 flex-shrink-0',
                        tvSlideIndex === idx
                          ? 'w-[24px] h-[8px] bg-[#ED1C24]'
                          : 'w-[8px] h-[8px] bg-[#E0E0E0] hover:bg-[#D1D1D1] hover:opacity-80'
                      )}
                      aria-label={slide.label}
                    />
                  ))}
                </div>

                <button
                  onClick={handleManualNext}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  aria-label="Próximo slide"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            {/* Toggle TV Mode */}
            {tvMode ? (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsTvPaused((prev) => !prev)}
                  className="rounded-full p-2 bg-white/10 hover:bg-[#FF4A00]/20 text-muted-foreground hover:text-foreground transition-all"
                  title={isTvPaused ? 'Retomar reprodução' : 'Pausar reprodução'}
                >
                  {isTvPaused ? <Play className="size-4" /> : <Pause className="size-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={exitTvMode}
                  className="rounded-full p-2 hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-all"
                  title="Sair do Modo TV"
                >
                  <X className="size-4" />
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={enterTvMode}
                className="text-muted-foreground hover:text-[#FF4A00] transition-colors"
                title="Ativar Modo TV (Fullscreen)"
              >
                <Tv2 className="size-4" />
              </Button>
            )}

            <ThemeToggle />

            {/* Infos do usuário + logout — ocultos em TV Mode */}
            {!tvMode && (
              <>
                <div className="text-right text-xs">
                  <p className="font-semibold text-foreground">{session?.user?.name || "Gerência Operacional"}</p>
                  <p className="text-muted-foreground">{session?.user?.email || "board@matrixenergia.com"}</p>
                </div>
                {session?.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt="Avatar"
                    width={36}
                    height={36}
                    className="size-9 rounded-full border border-border"
                  />
                ) : (
                   <div className="size-9 rounded-full bg-secondary text-secondary-foreground border border-border flex items-center justify-center font-bold">
                     M
                   </div>
                )}
                <form action={handleSignOut}>
                  <Button
                    type="submit"
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 ml-2"
                  >
                    <LogOut className="size-4" />
                  </Button>
                </form>
              </>
            )}
          </div>
        </header>
      </div>

      {/* ─── Conteúdo ─── */}
      <div className={cn('flex-1 transition-all duration-300', !tvMode ? 'p-6 overflow-auto flex flex-col items-center' : 'hidden')}>
        {!tvMode && (
          // MODO NORMAL: navegação por abas
          <div className="w-full max-w-[1600px] h-full flex flex-col">
            <div key={activeTab} className="flex-1 min-h-0 relative animate-in fade-in slide-in-from-bottom-4 duration-700">
              {activeTab === 'gd' && <GDModule />}
              {activeTab === 'grandesertao' && <GrandeSertaoModule />}
              {activeTab === 'comercial' && <CommercialModule />}
              {activeTab === 'trading' && <TradingModule />}
              {activeTab === 'bitcoin' && <BitcoinOperacoesModule />}
            </div>
          </div>
        )}
      </div>

      {tvMode && (
        <div className="flex-1 overflow-hidden transition-all duration-300">
          {/* TV MODE: renderiza o módulo do slide atual em tela cheia */}
          {/* key força remount para re-triggar a animação a cada troca de slide */}
          <div key={`${currentTvSlide.moduleId}-${tvSlideIndex}`} className="h-full w-full">
            {currentTvSlide.moduleId === 'gd' && (
              <div className="h-full flex flex-col p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <GDModule />
              </div>
            )}
            {currentTvSlide.moduleId === 'grandesertao' && (
              <div className="h-full flex flex-col p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <GrandeSertaoModule />
              </div>
            )}
            {currentTvSlide.moduleId === 'comercial' && (
              <div className="h-full flex flex-col p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <CommercialModule tvSlide={currentTvSlide.tvSlide} />
              </div>
            )}
            {currentTvSlide.moduleId === 'trading' && (
               <div className="h-full flex flex-col p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <TradingModule tvSlide={currentTvSlide.tvSlide} />
               </div>
            )}
            {currentTvSlide.moduleId === 'bitcoin' && (
               <div className="h-full flex flex-col p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <BitcoinOperacoesModule tvSlide={currentTvSlide.tvSlide} />
               </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
