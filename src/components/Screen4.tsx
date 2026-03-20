import { useState } from 'react';

interface Screen4Props {
  projeto: string;
}

interface Camera {
  id: string;
  nome: string;
  locacao: string;
  status: 'online' | 'offline' | 'standby';
  url?: string;
  latitude?: number;
  longitude?: number;
}

interface Tour360 {
  id: string;
  nome: string;
  provedor: string;
  url: string;
  descricao: string;
}

export default function Screen4({ projeto }: Screen4Props) {
  const [activeTab, setActiveTab] = useState<'tour' | 'cameras' | 'info'>('tour');
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [selectedTour, setSelectedTour] = useState<Tour360 | null>(null);

  // Mock data - Em produção, viriam da API
  const tours360: Tour360[] = [
    {
      id: '1',
      nome: 'Tour Completo do Projeto',
      provedor: 'Acompanha360',
      url: 'https://acompanha360.com/embed/projeto-123',
      descricao: 'Visualização 360° de toda a área do projeto com pontos de interesse',
    },
    {
      id: '2',
      nome: 'BOS e Equipamentos',
      provedor: 'Acompanha360',
      url: 'https://acompanha360.com/embed/projeto-123/bos',
      descricao: 'Tour detalhado do Battery Energy Storage System',
    },
    {
      id: '3',
      nome: 'Vista Aérea',
      provedor: 'Acompanha360',
      url: 'https://acompanha360.com/embed/projeto-123/drone',
      descricao: 'Imagens aéreas por drone com visão 360°',
    },
  ];

  const cameras: Camera[] = [
    {
      id: 'cam1',
      nome: 'Câmera Principal',
      locacao: 'Portão de Entrada',
      status: 'online',
      url: 'rtsp://streaming.example.com/cam1',
      latitude: -25.4284,
      longitude: -49.2733,
    },
    {
      id: 'cam2',
      nome: 'Câmera BOS',
      locacao: 'Área de Armazenamento',
      status: 'online',
      url: 'rtsp://streaming.example.com/cam2',
      latitude: -25.4286,
      longitude: -49.2735,
    },
    {
      id: 'cam3',
      nome: 'Câmera Construção',
      locacao: 'Zona de Obras',
      status: 'standby',
      url: 'rtsp://streaming.example.com/cam3',
      latitude: -25.4288,
      longitude: -49.2737,
    },
    {
      id: 'cam4',
      nome: 'Câmera Segurança',
      locacao: 'Perímetro',
      status: 'offline',
      latitude: -25.4282,
      longitude: -49.2731,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return { bg: 'bg-matrix-orange/20', text: 'text-matrix-orange', label: 'Online' };
      case 'standby':
        return { bg: 'bg-white/10', text: 'text-matrix-offwhite/60', label: 'Standby' };
      case 'offline':
        return { bg: 'bg-red-900/40', text: 'text-red-400', label: 'Offline' };
      default:
        return { bg: 'bg-white/5', text: 'text-matrix-offwhite/20', label: 'Desconhecido' };
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="bg-matrix-graphite border border-white/10 rounded-2xl shadow-2xl p-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-matrix-orange/10 blur-[100px] rounded-full -mr-32 -mt-32 group-hover:bg-matrix-orange/20 transition-all duration-1000" />
        <h1 className="text-4xl font-black text-white mb-2 italic tracking-tighter">Tela 04: Tour & Monitoramento</h1>
        <p className="text-matrix-offwhite/60 font-medium uppercase tracking-widest text-xs flex items-center gap-2">
          <span className="w-2 h-2 bg-matrix-orange rounded-full animate-pulse" />
          Operação em tempo real e visualização imersiva {projeto}
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white/5 border border-white/5 rounded-2xl p-4 backdrop-blur-md">
        <div className="flex gap-4 flex-wrap pb-4 border-b border-white/5 mb-4">
          <button
            onClick={() => setActiveTab('tour')}
            className={`px-8 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all duration-300 flex items-center gap-3 ${
              activeTab === 'tour'
                ? 'bg-matrix-orange text-white shadow-xl shadow-matrix-orange/20 scale-105'
                : 'bg-white/5 text-matrix-offwhite/40 hover:bg-white/10 border border-white/5'
            }`}
          >
            🎥 Tour 360°
          </button>
          <button
            onClick={() => setActiveTab('cameras')}
            className={`px-8 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all duration-300 flex items-center gap-3 ${
              activeTab === 'cameras'
                ? 'bg-matrix-orange text-white shadow-xl shadow-matrix-orange/20 scale-105'
                : 'bg-white/5 text-matrix-offwhite/40 hover:bg-white/10 border border-white/5'
            }`}
          >
            📹 Live Feed
            <span className={`px-2 py-0.5 rounded-full text-[8px] ${activeTab === 'cameras' ? 'bg-white/20' : 'bg-white/5'}`}>
              {cameras.filter((c) => c.status === 'online').length}/{cameras.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('info')}
            className={`px-8 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all duration-300 flex items-center gap-3 ${
              activeTab === 'info'
                ? 'bg-matrix-orange text-white shadow-xl shadow-matrix-orange/20 scale-105'
                : 'bg-white/5 text-matrix-offwhite/40 hover:bg-white/10 border border-white/5'
            }`}
          >
            ℹ️ Info & VR
          </button>
        </div>
      </div>

      {/* Tab Content */}

      {/* Tour 360° */}
      {activeTab === 'tour' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          {/* Tour Selection */}
          <div className="bg-matrix-graphite border border-white/10 rounded-2xl shadow-2xl p-8">
            <h2 className="text-xl font-black text-white italic uppercase tracking-tighter mb-8 flex items-center gap-3">
              <span className="w-1 h-6 bg-matrix-orange rounded-full" />
              Tours Disponíveis
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tours360.map((tour) => (
                <div
                  key={tour.id}
                  onClick={() => setSelectedTour(tour)}
                  className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 border group relative overflow-hidden ${
                    selectedTour?.id === tour.id
                      ? 'bg-matrix-orange/10 border-matrix-orange shadow-lg shadow-matrix-orange/10'
                      : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-500">🎥</div>
                  <h3 className="text-white font-black italic tracking-tight mb-1">{tour.nome}</h3>
                  <p className="text-matrix-orange font-bold text-[10px] uppercase tracking-widest mb-3">{tour.provedor}</p>
                  <p className="text-matrix-offwhite/50 text-xs leading-relaxed line-clamp-2">{tour.descricao}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tour Viewer */}
          {selectedTour ? (
            <div className="bg-matrix-graphite border border-white/10 rounded-2xl shadow-2xl p-8 space-y-8">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-3xl font-black text-white italic tracking-tighter mb-2">{selectedTour.nome}</h3>
                  <p className="text-matrix-offwhite/60 font-medium text-sm">{selectedTour.descricao}</p>
                </div>
                <button
                  onClick={() => setSelectedTour(null)}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-matrix-offwhite/40 hover:bg-white/10 hover:text-white transition-all group"
                >
                  <span className="text-xl group-hover:rotate-90 transition-transform">✕</span>
                </button>
              </div>

              {/* Viewer */}
              <div className="w-full h-[500px] bg-black rounded-2xl flex items-center justify-center relative overflow-hidden border border-white/5 shadow-inner">
                {/* Mock 360 Viewer */}
                <div className="absolute inset-0 flex items-center justify-center opacity-40">
                  <div className="text-center">
                    <div className="text-8xl mb-6 animate-pulse text-matrix-orange">🎥</div>
                    <p className="text-matrix-offwhite/60 font-black uppercase tracking-[0.3em] text-sm">Visualizador 360° Ativo</p>
                    <p className="text-matrix-orange/40 font-bold text-[10px] uppercase tracking-widest mt-2">{selectedTour.provedor} Engine</p>
                  </div>
                </div>

                {/* Hotspot Floating */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-matrix-orange/10 rounded-full border border-matrix-orange/20 animate-ping opacity-20" />

                {/* Placeholder Info Overlay */}
                <div className="absolute bottom-6 left-6 right-6 bg-matrix-graphite/80 backdrop-blur-xl border border-white/10 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-matrix-orange rounded-lg flex items-center justify-center font-black text-white text-xs">i</div>
                    <p className="text-matrix-offwhite/80 text-[10px] font-bold uppercase tracking-widest">
                      Carregando stream imersiva de alta densidade...
                    </p>
                  </div>
                  <button className="bg-matrix-orange text-white px-4 py-2 rounded-lg font-black uppercase tracking-widest text-[9px] hover:scale-105 transition-transform">
                    Expandir Tour
                  </button>
                </div>
              </div>

              {/* Controls */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Procurar', icon: '🔍' },
                  { label: 'Girar', icon: '↻' },
                  { label: 'Habilitar VR', icon: '🥽' },
                  { label: 'Tela Cheia', icon: '⛶' }
                ].map((ctrl) => (
                  <button key={ctrl.label} className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black uppercase tracking-widest text-[10px] py-4 rounded-xl transition-all flex items-center justify-center gap-3">
                    <span className="text-lg opacity-60">{ctrl.icon}</span>
                    {ctrl.label}
                  </button>
                ))}
              </div>

              {/* Hotspots Panel */}
              <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
                <h4 className="text-white font-black italic uppercase tracking-tight mb-6 flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-matrix-orange rounded-full" />
                  Pontos de Interesse Identificados 📍
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: 'BOS Central', desc: 'Sistemas de Armazenamento de Energia em Bateria' },
                    { name: 'Transformador 01-04', desc: 'Unidades Críticas de Conversão de Potência' },
                    { name: 'SCADA Panel', desc: 'Central de Monitoramento e Proteção' },
                    { name: 'Grip de Conexão', desc: 'Interface de Rede 13,8 kV' },
                  ].map((spot, idx) => (
                    <div key={idx} className="bg-white/5 p-4 rounded-xl border border-white/5 hover:border-white/20 transition-all flex items-start gap-3 group">
                      <div className="w-8 h-8 bg-matrix-orange/10 rounded-lg flex items-center justify-center group-hover:bg-matrix-orange transition-colors">
                        <span className="text-matrix-orange text-xs group-hover:text-white">📍</span>
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm tracking-tight">{spot.name}</p>
                        <p className="text-matrix-offwhite/40 text-[10px] font-medium uppercase tracking-widest">{spot.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-matrix-graphite border border-white/10 rounded-2xl shadow-lg p-24 text-center group">
              <div className="text-7xl mb-6 opacity-30 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700">📽️</div>
              <p className="text-matrix-offwhite/40 font-black uppercase tracking-[0.2em] text-xs">
                Selecione um tour dinâmico para carregar a visualização
              </p>
            </div>
          )}
        </div>
      )}

      {/* Live Stream */}
      {activeTab === 'cameras' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          {/* Camera Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {cameras.map((camera) => {
              const statusColor = getStatusColor(camera.status);
              const isSelected = selectedCamera?.id === camera.id;

              return (
                <div
                  key={camera.id}
                  onClick={() => setSelectedCamera(camera)}
                  className={`rounded-2xl overflow-hidden shadow-2xl cursor-pointer transition-all duration-500 border ${
                    isSelected ? 'ring-2 ring-matrix-orange border-matrix-orange' : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  {/* Video Feed Placeholder */}
                  <div className="relative w-full h-64 bg-black group overflow-hidden">
                    <div className="absolute inset-0 bg-matrix-graphite flex items-center justify-center group-hover:scale-110 transition-transform duration-1000">
                      <div className="text-center opacity-40 group-hover:opacity-100 transition-opacity">
                        <div className="text-6xl mb-2 text-matrix-orange">📹</div>
                        <p className="text-matrix-offwhite font-black uppercase tracking-widest text-[10px]">{camera.nome}</p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div
                      className={`absolute top-4 right-4 ${statusColor.bg} ${statusColor.text} px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 backdrop-blur-md border border-white/10`}
                    >
                      <span className={`w-2 h-2 rounded-full ${camera.status === 'online' ? 'animate-pulse' : ''} bg-current`} />
                      {statusColor.label}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="bg-matrix-graphite p-6 border-t border-white/5">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-white font-black italic tracking-tight text-lg mb-1">{camera.nome}</h3>
                        <p className="text-matrix-offwhite/40 font-bold text-[10px] uppercase tracking-[0.2em]">📍 {camera.locacao}</p>
                      </div>
                    </div>

                    {camera.latitude && camera.longitude && (
                      <div className="flex items-center gap-2 mb-6">
                        <span className="w-1 h-1 bg-matrix-orange rounded-full" />
                        <p className="text-matrix-offwhite/20 font-black text-[9px] uppercase tracking-widest">
                          GEOREF: {camera.latitude.toFixed(4)}N / {camera.longitude.toFixed(4)}W
                        </p>
                      </div>
                    )}

                    <div className="flex gap-4">
                      <button
                        disabled={camera.status === 'offline'}
                        className="flex-1 bg-white/5 border border-white/10 hover:bg-matrix-orange hover:border-matrix-orange hover:text-white disabled:opacity-20 disabled:cursor-not-allowed text-matrix-offwhite/60 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                      >
                        Ativar Stream
                      </button>
                      <button
                        disabled={!camera.latitude}
                        className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed text-matrix-offwhite/60 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                      >
                        Deep Map
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Camera Details / Full View */}
          {selectedCamera && (
            <div className="bg-matrix-graphite border border-white/20 rounded-2xl shadow-2xl p-8 space-y-8 animate-in zoom-in-95 duration-500">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase">{selectedCamera.nome}</h3>
                    <span className="px-3 py-1 bg-matrix-orange/20 text-matrix-orange rounded-lg font-black text-[10px] uppercase">Master View</span>
                  </div>
                  <p className="text-matrix-offwhite/60 font-bold text-xs uppercase tracking-widest leading-relaxed">Localização Estratégica: {selectedCamera.locacao}</p>
                </div>
                <button
                  onClick={() => setSelectedCamera(null)}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-matrix-offwhite/40 hover:bg-white/10 hover:text-white transition-all"
                >
                  <span className="text-xl">✕</span>
                </button>
              </div>

              {/* Live Viewer */}
              <div className="w-full h-[600px] bg-black rounded-2xl flex items-center justify-center relative border border-white/10 overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-matrix-orange/5 via-transparent to-transparent opacity-50" />
                
                <div className="text-center group-hover:scale-110 transition-transform duration-1000 z-10">
                  <div className="text-9xl mb-6 text-matrix-orange opacity-20">📹</div>
                  <p className="text-matrix-offwhite/60 font-black uppercase tracking-[0.5em] text-sm">Transmissão Direta</p>
                  <p className="text-matrix-offwhite/20 font-bold text-[10px] uppercase tracking-widest mt-4">
                    {selectedCamera.status === 'online' ? 'Status: Fluxo de Dados Sincronizado' : 'Status: Conexão Interrompida'}
                  </p>
                </div>

                {selectedCamera.status === 'online' && (
                  <div className="absolute top-8 right-8 flex items-center gap-4 bg-black/40 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10">
                    <span className="w-2.5 h-2.5 rounded-full animate-pulse bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
                    <span className="text-white text-xs font-black uppercase tracking-[0.2em]">Live Operating</span>
                  </div>
                )}
                
                <div className="absolute bottom-8 left-8 flex items-center gap-8">
                   <div className="text-[10px] font-black text-white/40 uppercase bg-black/40 px-4 py-2 rounded-lg border border-white/5">BITRATE: 4.8MBPS</div>
                   <div className="text-[10px] font-black text-white/40 uppercase bg-black/40 px-4 py-2 rounded-lg border border-white/5">ENC: H.265</div>
                   <div className="text-[10px] font-black text-matrix-orange uppercase bg-black/40 px-4 py-2 rounded-lg border border-white/10 animate-pulse">REC ●</div>
                </div>
              </div>

              {/* Camera Metadata */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: 'Status Operacional', val: getStatusColor(selectedCamera.status).label, highlight: true },
                  { label: 'Macro Região', val: selectedCamera.locacao, highlight: false },
                  { label: 'Latitude Coord', val: selectedCamera.latitude?.toFixed(4) || 'N/A', highlight: false },
                  { label: 'Longitude Coord', val: selectedCamera.longitude?.toFixed(4) || 'N/A', highlight: false }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/5 rounded-2xl p-6">
                    <p className="text-matrix-offwhite/30 text-[9px] font-black uppercase tracking-widest mb-2">{item.label}</p>
                    <p className={`text-white font-black italic tracking-tight ${item.highlight ? 'text-matrix-orange' : ''}`}>{item.val}</p>
                  </div>
                ))}
              </div>

              {/* PTZ Controls */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'PAN UP', action: '↑' },
                  { label: 'PAN DOWN', action: '↓' },
                  { label: 'ZOOM IN', action: '🔍+' },
                  { label: 'ZOOM OUT', action: '🔍-' }
                ].map((ctrl) => (
                  <button
                    key={ctrl.label}
                    disabled={selectedCamera.status === 'offline'}
                    className="bg-white/5 border border-white/10 hover:bg-matrix-orange hover:text-white text-matrix-offwhite/60 font-black uppercase tracking-widest text-[10px] py-4 rounded-xl transition-all disabled:opacity-10"
                  >
                    {ctrl.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Info & VR */}
      {activeTab === 'info' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          {/* VR Support Header */}
          <div className="bg-matrix-orange border border-matrix-orange/20 rounded-2xl p-10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.2),_transparent)] opacity-50" />
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
              <div className="text-8xl group-hover:rotate-12 transition-transform duration-700">🥽</div>
              <div>
                <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-4">Imersão VR Nativa</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                  {[
                    'Compatibilidade Meta/Oculus',
                    'Aceleração WebXR Sincronizada',
                    'Audio Espacial 3D Ativo',
                    'Hand Tracking Habilitado'
                  ].map((feat) => (
                    <div key={feat} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                      <p className="text-white font-bold uppercase tracking-widest text-[10px]">{feat}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Project Specs */}
            <div className="bg-matrix-graphite border border-white/10 rounded-2xl shadow-2xl p-8">
              <h3 className="text-xl font-black text-white italic uppercase tracking-tighter mb-8 shadow-sm">Especificações Técnicas</h3>
              <div className="space-y-6">
                {[
                  { label: 'Código Projeto', val: projeto },
                  { label: 'Sistema GEO', val: 'WGS84 / EPSG:4326' },
                  { label: 'Altímetria Média', val: '842m ASL' },
                  { label: 'Footprint Área', val: '2.500 m² Operacional' }
                ].map((spec) => (
                  <div key={spec.label} className="flex justify-between items-end border-b border-white/5 pb-2">
                    <p className="text-matrix-offwhite/30 font-black uppercase tracking-widest text-[9px]">{spec.label}</p>
                    <p className="text-white font-black italic tracking-tight">{spec.val}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Integrations */}
            <div className="bg-matrix-graphite border border-white/10 rounded-2xl shadow-2xl p-8">
              <h3 className="text-xl font-black text-white italic uppercase tracking-tighter mb-8">Conectividade & API</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: 'Acompanha360', status: 'Sincronizado' },
                  { name: 'RTSP Hyper', status: 'Ativo' },
                  { name: 'MAPS Engine', status: 'Conectado' },
                  { name: 'DeepXR', status: 'Habilitado' }
                ].map((conn) => (
                  <div key={conn.name} className="bg-white/5 border border-white/5 p-4 rounded-xl hover:border-matrix-orange/30 transition-all cursor-pointer">
                    <p className="text-white font-black text-xs italic mb-1">{conn.name}</p>
                    <p className="text-matrix-orange font-bold text-[8px] uppercase tracking-widest">{conn.status}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Keyboard Protocol */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-wrap items-center justify-center gap-8 backdrop-blur-md">
            <p className="text-matrix-offwhite/40 font-black uppercase tracking-[0.2em] text-[10px]">Protocolo de Comando:</p>
            <div className="flex gap-4">
               {['F: Fullscreen', 'V: VR Mode', 'SPACE: Pause'].map(key => (
                 <div key={key} className="flex items-center gap-2">
                   <div className="w-1 h-1 bg-matrix-orange rounded-full" />
                   <span className="text-white font-bold text-[9px] uppercase tracking-widest">{key}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
