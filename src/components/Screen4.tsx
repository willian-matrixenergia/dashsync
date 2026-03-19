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
        return { bg: 'bg-green-900', text: 'text-green-400', label: 'Online' };
      case 'standby':
        return { bg: 'bg-yellow-900', text: 'text-yellow-400', label: 'Standby' };
      case 'offline':
        return { bg: 'bg-red-900', text: 'text-red-400', label: 'Offline' };
      default:
        return { bg: 'bg-gray-900', text: 'text-gray-400', label: 'Desconhecido' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-900 rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-white mb-2">Tela 04: Tour 360° e Monitoramento</h1>
        <p className="text-gray-400">Visualização imersiva e monitoramento ao vivo do projeto {projeto}</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-gray-900 rounded-lg shadow-lg p-4">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab('tour')}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              activeTab === 'tour'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            🎥 Tour 360°
          </button>
          <button
            onClick={() => setActiveTab('cameras')}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              activeTab === 'cameras'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            📹 Live Stream ({cameras.filter((c) => c.status === 'online').length}/{cameras.length})
          </button>
          <button
            onClick={() => setActiveTab('info')}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              activeTab === 'info'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            ℹ️ Informações
          </button>
        </div>
      </div>

      {/* Tab Content */}

      {/* Tour 360° */}
      {activeTab === 'tour' && (
        <div className="space-y-6">
          {/* Tour Selection */}
          <div className="bg-gray-900 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Tours 360°</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {tours360.map((tour) => (
                <div
                  key={tour.id}
                  onClick={() => setSelectedTour(tour)}
                  className={`p-4 rounded-lg cursor-pointer transition transform hover:scale-105 ${
                    selectedTour?.id === tour.id
                      ? 'bg-blue-900 ring-2 ring-blue-500 border-blue-500'
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  <div className="text-3xl mb-2">🎥</div>
                  <h3 className="text-white font-semibold mb-1">{tour.nome}</h3>
                  <p className="text-gray-400 text-xs mb-2">{tour.provedor}</p>
                  <p className="text-gray-400 text-sm line-clamp-2">{tour.descricao}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tour Viewer */}
          {selectedTour ? (
            <div className="bg-gray-900 rounded-lg shadow-lg p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{selectedTour.nome}</h3>
                  <p className="text-gray-400">{selectedTour.descricao}</p>
                </div>
                <button
                  onClick={() => setSelectedTour(null)}
                  className="text-gray-400 hover:text-white text-2xl font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Viewer */}
              <div className="w-full h-96 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
                {/* Mock 360 Viewer */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎥</div>
                    <p className="text-gray-400 mb-2">Visualizador 360°</p>
                    <p className="text-gray-500 text-sm">Integração com {selectedTour.provedor}</p>
                  </div>
                </div>

                {/* Placeholder Info */}
                <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-75 rounded-lg p-3">
                  <p className="text-gray-300 text-xs">
                    💡 <strong>Produção:</strong> Implemente iframe com
                    <code className="bg-gray-800 px-2 py-1 rounded mx-1 text-blue-400">
                      &lt;iframe src=&quot;{selectedTour.url}&quot; /&gt;
                    </code>
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition">
                  🔍 Zoom
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition">
                  ↻ Rotacionar
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition">
                  🎮 VR
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition">
                  ⛶ Fullscreen
                </button>
              </div>

              {/* Hotspots */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-3">Pontos de Interesse 📍</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {[
                    { name: 'BOS Central', desc: 'Battery Energy Storage System' },
                    { name: 'Transformador', desc: '4 unidades de 630 kVA' },
                    { name: 'Painel de Controle', desc: 'SCADA e Proteção' },
                    { name: 'Infraestrutura Elétrica', desc: 'Conexão 13,8 kV' },
                  ].map((spot, idx) => (
                    <div key={idx} className="text-sm">
                      <span className="text-blue-400 font-medium">{spot.name}:</span>
                      <span className="text-gray-400"> {spot.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-900 rounded-lg shadow-lg p-12 text-center">
              <p className="text-gray-400">Selecione um tour para visualizar</p>
            </div>
          )}
        </div>
      )}

      {/* Live Stream */}
      {activeTab === 'cameras' && (
        <div className="space-y-6">
          {/* Camera Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cameras.map((camera) => {
              const statusColor = getStatusColor(camera.status);
              const isSelected = selectedCamera?.id === camera.id;

              return (
                <div
                  key={camera.id}
                  onClick={() => setSelectedCamera(camera)}
                  className={`rounded-lg overflow-hidden shadow-lg cursor-pointer transition transform hover:scale-105 ${
                    isSelected ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  {/* Video Feed */}
                  <div className="relative w-full h-48 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📹</div>
                      <p className="text-gray-400 text-sm">{camera.nome}</p>
                    </div>

                    {/* Status Badge */}
                    <div
                      className={`absolute top-3 right-3 ${statusColor.bg} ${statusColor.text} px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1`}
                    >
                      <span className="w-2 h-2 rounded-full animate-pulse bg-current" />
                      {statusColor.label}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="bg-gray-800 p-4">
                    <h3 className="text-white font-semibold mb-2">{camera.nome}</h3>
                    <p className="text-gray-400 text-sm mb-3">📍 {camera.locacao}</p>

                    {camera.latitude && camera.longitude && (
                      <p className="text-gray-500 text-xs mb-3">
                        📌 {camera.latitude.toFixed(4)}, {camera.longitude.toFixed(4)}
                      </p>
                    )}

                    <div className="flex gap-2">
                      <button
                        disabled={camera.status === 'offline'}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-2 rounded text-xs font-medium transition"
                      >
                        Visualizar
                      </button>
                      <button
                        disabled={!camera.latitude}
                        className="flex-1 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-2 rounded text-xs font-medium transition"
                      >
                        Mapa
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Camera Details */}
          {selectedCamera && (
            <div className="bg-gray-900 rounded-lg shadow-lg p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{selectedCamera.nome}</h3>
                  <p className="text-gray-400">📍 {selectedCamera.locacao}</p>
                </div>
                <button
                  onClick={() => setSelectedCamera(null)}
                  className="text-gray-400 hover:text-white text-2xl font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Live Viewer */}
              <div className="w-full h-96 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center relative">
                <div className="text-center">
                  <div className="text-6xl mb-4">📹</div>
                  <p className="text-gray-400 mb-2">Live Stream</p>
                  <p className="text-gray-500 text-sm">{selectedCamera.status === 'online' ? '● Transmitindo ao vivo' : '⚫ Câmera desconectada'}</p>
                </div>

                {selectedCamera.status === 'online' && (
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full animate-pulse bg-red-500" />
                    <span className="text-red-400 text-sm font-semibold">LIVE</span>
                  </div>
                )}
              </div>

              {/* Camera Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  <p className="text-gray-400 text-xs uppercase">Status</p>
                  <p className="text-white font-semibold mt-1">{getStatusColor(selectedCamera.status).label}</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <p className="text-gray-400 text-xs uppercase">Localização</p>
                  <p className="text-white font-semibold mt-1 text-sm">{selectedCamera.locacao}</p>
                </div>
                {selectedCamera.latitude && (
                  <>
                    <div className="bg-gray-800 rounded-lg p-4">
                      <p className="text-gray-400 text-xs uppercase">Latitude</p>
                      <p className="text-white font-semibold mt-1 text-sm">{selectedCamera.latitude?.toFixed(4)}</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4">
                      <p className="text-gray-400 text-xs uppercase">Longitude</p>
                      <p className="text-white font-semibold mt-1 text-sm">{selectedCamera.longitude?.toFixed(4)}</p>
                    </div>
                  </>
                )}
              </div>

              {/* Controls */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50" disabled={selectedCamera.status === 'offline'}>
                  ↑ Pan Up
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50" disabled={selectedCamera.status === 'offline'}>
                  ↓ Pan Down
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50" disabled={selectedCamera.status === 'offline'}>
                  🔍 Zoom +
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50" disabled={selectedCamera.status === 'offline'}>
                  🔍 Zoom -
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Info & VR */}
      {activeTab === 'info' && (
        <div className="space-y-6">
          {/* VR Support */}
          <div className="bg-purple-900 bg-opacity-30 border-l-4 border-purple-500 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-purple-400 mb-4">🥽 Suporte para Realidade Virtual</h3>
            <div className="space-y-3 text-gray-300">
              <p>✅ <strong>Compatibilidade:</strong> Tours 360° funcionam com Meta Quest, HTC Vive e Google Cardboard</p>
              <p>✅ <strong>Navegação:</strong> Controle intuitivo via joystick ou hand tracking</p>
              <p>✅ <strong>Imersão:</strong> Visualização em 360° com áudio espacial</p>
              <p>✅ <strong>Hotspots:</strong> Clique em pontos de interesse para mais informações</p>
            </div>
          </div>

          {/* Project Info */}
          <div className="bg-gray-900 rounded-lg shadow-lg p-6">
            <h3 className="text-2xl font-bold text-white mb-4">📊 Informações do Projeto</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <p className="text-gray-400 text-xs uppercase">Projeto</p>
                  <p className="text-white font-semibold">{projeto}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase">Coordenadas</p>
                  <p className="text-white font-semibold">-25.4285, -49.2734</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase">Altitude</p>
                  <p className="text-white font-semibold">820m</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase">Área Total</p>
                  <p className="text-white font-semibold">2.500 m²</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-gray-400 text-xs uppercase">Câmeras Ativas</p>
                  <p className="text-green-400 font-semibold text-lg">
                    {cameras.filter((c) => c.status === 'online').length}/{cameras.length}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase">Tours Disponíveis</p>
                  <p className="text-blue-400 font-semibold text-lg">{tours360.length}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase">Última Atualização</p>
                  <p className="text-white font-semibold">19/03/2026 16:30</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase">Próxima Atualização</p>
                  <p className="text-white font-semibold">Em tempo real</p>
                </div>
              </div>
            </div>
          </div>

          {/* Integrations */}
          <div className="bg-gray-900 rounded-lg shadow-lg p-6">
            <h3 className="text-2xl font-bold text-white mb-4">🔗 Integrações Disponíveis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-white font-semibold mb-2">🎥 Acompanha360</p>
                <p className="text-gray-400 text-sm mb-3">Tours 360° imersivos com pontos de interesse</p>
                <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                  Conectar →
                </button>
              </div>

              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-white font-semibold mb-2">📹 RTSP/HLS Streaming</p>
                <p className="text-gray-400 text-sm mb-3">Câmeras ao vivo via protocolo RTSP ou HLS</p>
                <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                  Conectar →
                </button>
              </div>

              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-white font-semibold mb-2">🗺️ Google Maps</p>
                <p className="text-gray-400 text-sm mb-3">Mapa interativo com localização de câmeras</p>
                <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                  Conectar →
                </button>
              </div>

              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-white font-semibold mb-2">🥽 WebXR</p>
                <p className="text-gray-400 text-sm mb-3">Suporte nativo para VR/AR via navegador</p>
                <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                  Conectar →
                </button>
              </div>
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="bg-blue-900 bg-opacity-30 border-l-4 border-blue-500 rounded-lg p-4">
            <p className="text-blue-300 text-sm">
              💡 <strong>Dica:</strong> Use <kbd className="bg-blue-800 px-2 py-1 rounded text-xs">F</kbd> para fullscreen,
              <kbd className="bg-blue-800 px-2 py-1 rounded text-xs ml-1">V</kbd> para VR, ou
              <kbd className="bg-blue-800 px-2 py-1 rounded text-xs ml-1">Espaço</kbd> para pausar
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
