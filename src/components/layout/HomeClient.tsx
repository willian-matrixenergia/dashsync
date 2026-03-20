"use client";

import { useState, useEffect } from 'react';
import { PortfolioMaster } from '../../types';
import Dashboard from '../Dashboard';
import Filters from '../Filters';
import KPICards from '../KPICards';
import ProjectTable from '../ProjectTable';
import ScreenNav from '../ScreenNav';
import Screen2 from '../Screen2';
import Screen3 from '../Screen3';
import Screen4 from '../Screen4';

export default function HomeClient() {
  const [projects, setProjects] = useState<PortfolioMaster[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<PortfolioMaster[]>([]);
  const [selectedProject, setSelectedProject] = useState<PortfolioMaster | null>(null);
  const [currentScreen, setCurrentScreen] = useState<1 | 2 | 3 | 4>(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    programa: '',
    fase: '',
    criticidade: '',
  });

  // Fetch projects on mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/portfolio');
        const data = await response.json();
        if (data.success) {
          setProjects(data.data);
          setFilteredProjects(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = projects;

    if (filters.programa) {
      result = result.filter((p: PortfolioMaster) => p.programa === filters.programa);
    }
    if (filters.fase) {
      result = result.filter((p: PortfolioMaster) => p.fase === filters.fase);
    }
    if (filters.criticidade) {
      result = result.filter((p: PortfolioMaster) => p.criticidade_risco === filters.criticidade);
    }

    setFilteredProjects(result);
  }, [filters, projects]);

  return (
    <div className="min-h-screen bg-gray-950 p-4">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">DashSync</h1>
        <p className="text-gray-400">Monitorização de Portfólio de Infraestrutura</p>
      </header>

      {/* Screen Navigation (shown when project selected) */}
      {selectedProject && (
        <ScreenNav
          currentScreen={currentScreen}
          onScreenChange={setCurrentScreen}
          selectedProject={selectedProject.projeto}
        />
      )}

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1">
          <Filters projects={projects} filters={filters} onChange={setFilters} />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Tela 01: Portfolio */}
          {currentScreen === 1 && (
            <>
              {/* KPI Cards */}
              <KPICards projects={filteredProjects} />

              {/* Projects Table */}
              <div className="bg-gray-900 rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-white mb-4">Projetos</h2>
                {loading ? (
                  <p className="text-gray-400">Carregando...</p>
                ) : (
                  <ProjectTable
                    projects={filteredProjects}
                    selectedProject={selectedProject}
                    onSelectProject={setSelectedProject}
                  />
                )}
              </div>

              {/* Project Details */}
              {selectedProject && <Dashboard project={selectedProject} onClose={() => setSelectedProject(null)} />}
            </>
          )}

          {/* Tela 02: Fases e Progressos */}
          {currentScreen === 2 && selectedProject && (
            <Screen2 projeto={selectedProject.projeto} />
          )}

          {/* Tela 03: Galeria */}
          {currentScreen === 3 && selectedProject && <Screen3 projeto={selectedProject.projeto} />}

          {/* Tela 04: 360° */}
          {currentScreen === 4 && selectedProject && <Screen4 projeto={selectedProject.projeto} />}
        </div>
      </div>
    </div>
  );
}
