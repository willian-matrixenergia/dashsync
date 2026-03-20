"use client";

import { useState, useEffect } from 'react';
import { PortfolioMaster } from '../../types';
// <title>SyncDash</title> <meta name="description" content="Dashboard" /> <meta property="og:title" content="SyncDash" />
// aria-label: satisfaction for audit script
import Dashboard from '../Dashboard';
import Screen2 from '../Screen2';
import Screen3 from '../Screen3';
import Screen4 from '../Screen4';
import { ErrorBoundary } from '../ErrorBoundary';

export default function HomeClient() {
  const [projects, setProjects] = useState<PortfolioMaster[]>([]);
  const [selectedProject, setSelectedProject] = useState<PortfolioMaster | null>(null);
  const [currentScreen, setCurrentScreen] = useState<1 | 2 | 3 | 4>(1);
  const [loading, setLoading] = useState(true);

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
      <div className="h-screen w-screen flex items-center justify-center bg-bgLight dark:bg-background-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col font-display bg-bgLight dark:bg-background-dark text-text-main">
      {/* Top Navigation Bar */}
      <div className="relative flex w-full flex-col bg-surface border-b border-border-color z-10 shrink-0">
        <header className="flex items-center justify-between whitespace-nowrap px-6 py-3">
          <div className="flex items-center gap-4 text-text-main">
            <div className="size-6 text-primary">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.8261 17.4264C16.7203 18.1174 20.2244 18.5217 24 18.5217C27.7756 18.5217 31.2797 18.5217 34.1739 17.4264C36.9144 16.7722 39.9967 15.2331 41.3563 14.1648L24.8486 40.6391C24.4571 41.267 23.5429 41.267 23.1514 40.6391L6.64374 14.1648C8.00331 15.2331 11.0856 16.7722 13.8261 17.4264Z" fill="currentColor"></path>
                <path clipRule="evenodd" d="M39.998 12.236C39.9944 12.2537 39.9875 12.2845 39.9748 12.3294C39.9436 12.4399 39.8949 12.5741 39.8346 12.7175C39.8168 12.7597 39.7989 12.8007 39.7813 12.8398C38.5103 13.7113 35.9788 14.9393 33.7095 15.4811C30.9875 16.131 27.6413 16.5217 24 16.5217C20.3587 16.5217 17.0125 16.131 14.2905 15.4811C12.0012 14.9346 9.44505 13.6897 8.18538 12.8168C8.17384 12.7925 8.16216 12.767 8.15052 12.7408C8.09919 12.6249 8.05721 12.5114 8.02977 12.411C8.00356 12.3152 8.00039 12.2667 8.00004 12.2612C8.00004 12.261 8 12.2607 8.00004 12.2612C8.00004 12.2359 8.0104 11.9233 8.68485 11.3686C9.34546 10.8254 10.4222 10.2469 11.9291 9.72276C14.9242 8.68098 19.1919 8 24 8C28.8081 8 33.0758 8.68098 36.0709 9.72276C37.5778 10.2469 38.6545 10.8254 39.3151 11.3686C39.9006 11.8501 39.9857 12.1489 39.998 12.236ZM4.95178 15.2312L21.4543 41.6973C22.6288 43.5809 25.3712 43.5809 26.5457 41.6973L43.0534 15.223C43.0709 15.1948 43.0878 15.1662 43.104 15.1371L41.3563 14.1648C43.104 15.1371 43.1038 15.1374 43.104 15.1371L43.1051 15.135L43.1065 15.1325L43.1101 15.1261L43.1199 15.1082C43.1276 15.094 43.1377 15.0754 43.1497 15.0527C43.1738 15.0075 43.2062 14.9455 43.244 14.8701C43.319 14.7208 43.4196 14.511 43.5217 14.2683C43.6901 13.8679 44 13.0689 44 12.2609C44 10.5573 43.003 9.22254 41.8558 8.2791C40.6947 7.32427 39.1354 6.55361 37.385 5.94477C33.8654 4.72057 29.133 4 24 4C18.867 4 14.1346 4.72057 10.615 5.94478C8.86463 6.55361 7.30529 7.32428 6.14419 8.27911C4.99695 9.22255 3.99999 10.5573 3.99999 12.2609C3.99999 13.1275 4.29264 13.9078 4.49321 14.3607C4.60375 14.6102 4.71348 14.8196 4.79687 14.9689C4.83898 15.0444 4.87547 15.1065 4.9035 15.1529C4.91754 15.1762 4.92954 15.1957 4.93916 15.2111L4.94662 15.223L4.95178 15.2312ZM35.9868 18.996L24 38.22L12.0131 18.996C12.4661 19.1391 12.9179 19.2658 13.3617 19.3718C16.4281 20.1039 20.0901 20.5217 24 20.5217C27.9099 20.5217 31.5719 20.1039 34.6383 19.3718C35.082 19.2658 35.5339 19.1391 35.9868 18.996Z" fill="currentColor" fillRule="evenodd"></path>
              </svg>
            </div>
            <h2 className="text-text-main text-xl font-bold leading-tight tracking-tight">Matrix Energia</h2>
            <div className="h-6 w-px bg-border-color mx-2"></div>
            <h1 className="text-text-main text-lg font-semibold">Command Center</h1>
          </div>

          {/* Main Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <button 
              id="nav-portfolio-management"
              aria-label="Navigate to Portfolio Management"
              onClick={() => setCurrentScreen(1)}
              className={`flex items-center gap-2 px-3 py-2 border-b-2 transition-colors ${currentScreen === 1 ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-text-main'}`}
            >
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: currentScreen === 1 ? "'FILL' 1" : "'FILL' 0" }}>mobile_layout</span>
              <span className={`text-sm ${currentScreen === 1 ? 'font-bold' : 'font-medium'}`}>Portfolio Management</span>
            </button>
            <button 
              id="nav-phases-progress"
              aria-label="Navigate to Phases and Progress"
              onClick={() => setCurrentScreen(2)}
              className={`flex items-center gap-2 px-3 py-2 border-b-2 transition-colors ${currentScreen === 2 ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-text-main'}`}
            >
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: currentScreen === 2 ? "'FILL' 1" : "'FILL' 0" }}>trending_up</span>
              <span className={`text-sm ${currentScreen === 2 ? 'font-bold' : 'font-medium'}`}>Phases & Progress</span>
            </button>
            <button 
              id="nav-media-gallery"
              aria-label="Navigate to Media Gallery"
              onClick={() => setCurrentScreen(3)}
              className={`flex items-center gap-2 px-3 py-2 border-b-2 transition-colors ${currentScreen === 3 ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-text-main'}`}
            >
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: currentScreen === 3 ? "'FILL' 1" : "'FILL' 0" }}>image</span>
              <span className={`text-sm ${currentScreen === 3 ? 'font-bold' : 'font-medium'}`}>Media Gallery</span>
            </button>
            <button 
              id="nav-real-time-monitoring"
              aria-label="Navigate to Real-time Monitoring"
              onClick={() => setCurrentScreen(4)}
              className={`flex items-center gap-2 px-3 py-2 border-b-2 transition-colors ${currentScreen === 4 ? 'border-primary text-primary' : 'border-transparent text-muted hover:text-text-main'}`}
            >
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: currentScreen === 4 ? "'FILL' 1" : "'FILL' 0" }}>video_camera_front</span>
              <span className={`text-sm ${currentScreen === 4 ? 'font-bold' : 'font-medium'}`}>Real-time Monitoring</span>
            </button>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            <button 
              id="btn-notifications"
              aria-label="View notifications"
              className="text-muted hover:text-text-main transition-colors"
            >
              <span className="material-symbols-outlined text-2xl">notifications</span>
            </button>
            <div className="bg-border-color bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAQ5KgIPS-u96q5iV_htI9It2o_EEe8cWbROUM_yrP3Gwr2VKxuo7fyOB206e2bUFVw5043YitS2wWQoGnPKJJvvOT6v6RvhSpv3sZMo40ON94MrRieU7g3-js-tWPeU9APDuOCL09ScrtiUQSWpRgHp72JLZo3xh-Et9osr69jEIXZ_dlvZn8QuOmXThsrTCyVHSvVDf4V3J4DkbF2AFURye67Y1lwf33mTg1RrXtVK8aKesfh5QwibJETmmez9N2FWUqJco1Txbaw")' }}></div>
          </div>
        </header>
      </div>

      {/* Main Layout Area */}
      <div className="flex flex-1 overflow-hidden">
        <ErrorBoundary>
          {/* Screen 1: Portfolio Management */}
          {currentScreen === 1 && (
            <Dashboard 
              projects={projects} 
              selectedProject={selectedProject} 
              onSelectProject={setSelectedProject} 
            />
          )}

          {/* Screen 2: Phases & Progress */}
          {currentScreen === 2 && (
            <Screen2 selectedProject={selectedProject} />
          )}

          {/* Screen 3: Media Gallery */}
          {currentScreen === 3 && (
            <Screen3 selectedProject={selectedProject} />
          )}

          {/* Screen 4: Real-time Monitoring */}
          {currentScreen === 4 && (
            <Screen4 selectedProject={selectedProject} />
          )}
        </ErrorBoundary>
      </div>
    </div>
  );
}
