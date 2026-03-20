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
import { 
  BarChart3, 
  LayoutDashboard, 
  Image as ImageIcon, 
  Activity,
  Bell,
  Search,
  Menu
} from 'lucide-react';

export default function HomeClient() {
  const [projects, setProjects] = useState<PortfolioMaster[]>([]);
  const [selectedProject, setSelectedProject] = useState<PortfolioMaster | null>(null);
  const [currentScreen, setCurrentScreen] = useState<1 | 2 | 3 | 4>(1);
  const [loading, setLoading] = useState(true);

  const headerRef = useRef(null);
  const navRef = useRef(null);
  const contentRef = useRef(null);

  // Staggered Entrance Animation - Antigravity Orchestration
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

  // Fetch projects on mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/portfolio');
        const data = await response.json();
        if (data.success) {
          setProjects(data.data);
          // Auto-select first project for demo fidelity if none selected
          if (data.data.length > 0 && !selectedProject) {
            setSelectedProject(data.data[0]);
          }
        }
      } catch (err) {
        console.error('Failed to fetch projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-bgLight dark:bg-bgDark bg-noise">
        <div className="relative size-24">
           <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin opacity-50"></div>
           <div className="absolute inset-4 rounded-full border-b-2 border-primary animate-spin-slow opacity-30"></div>
           <div className="absolute inset-0 flex items-center justify-center">
              <div className="size-2 bg-primary rounded-full animate-pulse shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]"></div>
           </div>
        </div>
        <p className="mt-8 text-[10px] font-black text-primary uppercase tracking-[0.5em] animate-pulse">Initializing Streams</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col font-display bg-bgLight dark:bg-bgDark text-textMain relative selection:bg-primary/20 selection:text-primary">
      {/* Texture Layer - Antigravity Grain */}
      <div className="absolute inset-0 bg-noise pointer-events-none z-[100] opacity-[0.03]"></div>

      {/* Top Navigation Bar - Glassmorphism Refined */}
      <div ref={headerRef} className="glass-header z-50 border-b border-white/5 shadow-2xl">
        <header className="flex items-center justify-between whitespace-nowrap px-8 py-4">
          <div className="flex items-center gap-6 group cursor-pointer">
            <div className="size-10 text-primary bg-primary/5 p-2 rounded-2xl border border-primary/10 group-hover:scale-110 transition-transform duration-700 shadow-inner">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]">
                <path d="M13.8261 17.4264C16.7203 18.1174 20.2244 18.5217 24 18.5217C27.7756 18.5217 31.2797 18.5217 34.1739 17.4264C36.9144 16.7722 39.9967 15.2331 41.3563 14.1648L24.8486 40.6391C24.4571 41.267 23.5429 41.267 23.1514 40.6391L6.64374 14.1648C8.00331 15.2331 11.0856 16.7722 13.8261 17.4264Z" fill="currentColor"></path>
                <circle cx="24" cy="12" r="4" fill="currentColor" className="opacity-40 animate-pulse" />
              </svg>
            </div>
            <div className="flex flex-col">
              <h2 className="text-textMain text-xl font-black leading-tight tracking-tighter group-hover:text-primary transition-colors">SyncDash</h2>
              <p className="text-[9px] font-black text-muted uppercase tracking-[0.3em] opacity-40">Operational Intel • v2.5</p>
            </div>
          </div>

          {/* Main Navigation - Weightless Items */}
          <nav ref={navRef} className="hidden lg:flex items-center gap-2 glass-card p-1.5 rounded-2xl border-white/5 bg-white/[0.02]">
            {[
              { id: 1, label: 'Portfolio', icon: <LayoutDashboard className="size-4" /> },
              { id: 2, label: 'Analytics', icon: <BarChart3 className="size-4" /> },
              { id: 3, label: 'Gallery', icon: <ImageIcon className="size-4" /> },
              { id: 4, label: 'Live Ops', icon: <Activity className="size-4" /> }
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => setCurrentScreen(item.id as any)}
                className={`nav-item flex items-center gap-3 px-6 py-2.5 rounded-xl transition-all duration-500 group relative ${currentScreen === item.id ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' : 'text-muted hover:text-textMain hover:bg-white/5'}`}
              >
                <span className={`${currentScreen === item.id ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'} transition-opacity`}>
                   {item.icon}
                </span>
                <span className={`text-[11px] font-black uppercase tracking-widest ${currentScreen === item.id ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'}`}>
                   {item.label}
                </span>
                {currentScreen === item.id && (
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 size-1 bg-white rounded-full shadow-[0_0_8px_#fff]"></span>
                )}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2 glass-card px-4 py-2 rounded-xl border-white/5 bg-white/[0.01] hover:bg-white/5 transition-all group cursor-text">
               <Search className="size-4 text-muted group-hover:text-primary transition-colors" />
               <span className="text-[10px] font-black text-muted uppercase tracking-widest opacity-30">Search Node</span>
            </div>
            <button className="nav-item relative p-2 rounded-xl hover:bg-white/5 transition-all text-muted hover:text-primary">
              <Bell className="size-5" />
              <span className="absolute top-2 right-2 size-2 bg-error rounded-full border-2 border-bgLight dark:border-bgDark shadow-[0_0_8px_rgba(239,68,68,0.5)]"></span>
            </button>
            <div className="nav-item group cursor-pointer relative p-1 rounded-full border border-white/5 hover:border-primary/40 transition-all duration-700">
               <div className="bg-borderColor bg-center bg-no-repeat aspect-square bg-cover rounded-full size-9 grayscale group-hover:grayscale-0 transition-all duration-700 shadow-2xl" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAQ5KgIPS-u96q5iV_htI9It2o_EEe8cWbROUM_yrP3Gwr2VKxuo7fyOB206e2bUFVw5043YitS2wWQoGnPKJJvvOT6v6RvhSpv3sZMo40ON94MrRieU7g3-js-tWPeU9APDuOCL09ScrtiUQSWpRgHp72JLZo3xh-Et9osr69jEIXZ_dlvZn8QuOmXThsrTCyVHSvVDf4V3J4DkbF2AFURye67Y1lwf33mTg1RrXtVK8aKesfh5QwibJETmmez9N2FWUqJco1Txbaw")' }}></div>
               <div className="absolute -bottom-1 -right-1 size-3 bg-success rounded-full border-2 border-bgLight dark:border-bgDark shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
            </div>
            <button className="lg:hidden p-2 text-muted hover:text-textMain"><Menu className="size-6" /></button>
          </div>
        </header>
      </div>

      {/* Main Layout Area - Spatial Perspective */}
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
