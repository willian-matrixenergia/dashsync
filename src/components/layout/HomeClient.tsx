"use client";

import { useState, useEffect, useRef } from 'react';
import { PortfolioMaster } from '../../types';
import Dashboard from '../Dashboard';
import Screen2 from '../Screen2';
import Screen3 from '../Screen3';
import Screen4 from '../Screen4';
import { ErrorBoundary } from '../ErrorBoundary';
import { useGSAP } from '../../hooks/useGSAP';
import gsap from 'gsap';
import { BarChart3, LayoutDashboard, Image as ImageIcon, Activity, Bell, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { id: 1, label: 'Portfólio', icon: LayoutDashboard },
  { id: 2, label: 'Análises', icon: BarChart3 },
  { id: 3, label: 'Galeria', icon: ImageIcon },
  { id: 4, label: 'Operações', icon: Activity },
] as const;

export default function HomeClient() {
  const [projects, setProjects] = useState<PortfolioMaster[]>([]);
  const [selectedProject, setSelectedProject] = useState<PortfolioMaster | null>(null);
  const [currentScreen, setCurrentScreen] = useState<1 | 2 | 3 | 4>(1);
  const [loading, setLoading] = useState(true);

  const headerRef = useRef(null);
  const navRef = useRef(null);
  const contentRef = useRef(null);

  useGSAP(() => {
    if (!loading) {
      const tl = gsap.timeline();
      tl.fromTo(headerRef.current,
        { y: -100, opacity: 0, filter: 'blur(20px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.2, ease: 'expo.out' }
      )
      .fromTo(".nav-item",
        { y: 20, opacity: 0, scale: 0.8 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.1, ease: 'power4.out' },
        "-=0.8"
      )
      .fromTo(contentRef.current,
        { opacity: 0, scale: 0.99, y: 10 },
        { opacity: 1, scale: 1, y: 0, duration: 1, ease: 'power3.out' },
        "-=0.6"
      );
    }
  }, [loading]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/portfolio');
        const data = await response.json();
        if (data.success) {
          setProjects(data.data);
          if (data.data.length > 0 && !selectedProject) {
            setSelectedProject(data.data[0]);
          }
        }
      } catch (err) {
        console.error('Falha ao carregar projetos:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-bgLight bg-noise">
        <img src="/logo-matrix.svg" alt="Matrix Energia" className="h-10 w-auto mb-10 opacity-80" />
        <div className="relative size-16">
          <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin opacity-50" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="size-2 bg-primary rounded-full animate-pulse" />
          </div>
        </div>
        <p className="mt-6 text-[10px] font-bold text-primary uppercase tracking-[0.5em] animate-pulse">
          Inicializando...
        </p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col font-display bg-bgLight text-textMain relative selection:bg-primary/20 selection:text-primary">
      <div className="absolute inset-0 bg-noise pointer-events-none z-[100] opacity-[0.03]" />

      {/* Header */}
      <div ref={headerRef} className="glass-header z-50 border-b border-white/5 shadow-2xl">
        <header className="flex items-center justify-between whitespace-nowrap px-8 py-4">

          {/* Logo Matrix */}
          <div className="flex items-center cursor-pointer">
            <img
              src="/logo-matrix.svg"
              alt="Matrix Energia"
              className="h-8 w-auto"
            />
          </div>

          {/* Navegação Principal */}
          <nav ref={navRef} className="hidden lg:flex items-center gap-2 glass-card p-1.5 rounded-2xl border-white/5 bg-white/[0.02]">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  onClick={() => setCurrentScreen(item.id as 1 | 2 | 3 | 4)}
                  className={cn(
                    "nav-item flex items-center gap-3 px-6 py-2.5 rounded-xl h-auto transition-all duration-500",
                    isActive
                      ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105 hover:bg-primary hover:text-white"
                      : "text-muted-foreground hover:text-textMain hover:bg-white/5"
                  )}
                >
                  <Icon className="size-4" />
                  <span className="text-[11px] font-bold uppercase tracking-widest">
                    {item.label}
                  </span>
                  {isActive && (
                    <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 size-1 bg-white rounded-full shadow-[0_0_8px_#fff]" />
                  )}
                </Button>
              );
            })}
          </nav>

          {/* Ações do Header */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 glass-card px-3 py-1.5 rounded-xl border-white/5">
              <Input
                placeholder="Buscar ativo..."
                className="border-none bg-transparent shadow-none text-[11px] text-muted placeholder:text-muted/40 focus-visible:ring-0 h-auto p-0 w-40"
              />
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="nav-item relative rounded-xl hover:bg-white/5 text-muted hover:text-primary"
              aria-label="Notificações"
            >
              <Bell className="size-5" />
              <span className="absolute top-2 right-2 size-2 bg-error rounded-full border-2 border-bgLight shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
            </Button>

            <div className="nav-item group cursor-pointer relative p-1 rounded-full border border-white/5 hover:border-primary/40 transition-all duration-700">
              <div
                className="bg-borderColor bg-center bg-no-repeat aspect-square bg-cover rounded-full size-9 grayscale group-hover:grayscale-0 transition-all duration-700 shadow-2xl"
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAQ5KgIPS-u96q5iV_htI9It2o_EEe8cWbROUM_yrP3Gwr2VKxuo7fyOB206e2bUFVw5043YitS2wWQoGnPKJJvvOT6v6RvhSpv3sZMo40ON94MrRieU7g3-js-tWPeU9APDuOCL09ScrtiUQSWpRgHp72JLZo3xh-Et9osr69jEIXZ_dlvZn8QuOmXThsrTCyVHSvVDf4V3J4DkbF2AFURye67Y1lwf33mTg1RrXtVK8aKesfh5QwibJETmmez9N2FWUqJco1Txbaw")' }}
              />
              <div className="absolute -bottom-1 -right-1 size-3 bg-success rounded-full border-2 border-bgLight shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
            </div>

            <Button variant="ghost" size="icon" className="lg:hidden text-muted hover:text-textMain">
              <Menu className="size-6" />
            </Button>
          </div>
        </header>
      </div>

      {/* Área Principal */}
      <div ref={contentRef} className="flex flex-1 overflow-hidden relative perspective-2000">
        <ErrorBoundary>
          {currentScreen === 1 && <Dashboard projects={projects} selectedProject={selectedProject} onSelectProject={setSelectedProject} />}
          {currentScreen === 2 && <Screen2 selectedProject={selectedProject} />}
          {currentScreen === 3 && <Screen3 selectedProject={selectedProject} />}
          {currentScreen === 4 && <Screen4 selectedProject={selectedProject} />}
        </ErrorBoundary>
      </div>
    </div>
  );
}
