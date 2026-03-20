interface ScreenNavProps {
  currentScreen: 1 | 2 | 3 | 4;
  onScreenChange: (screen: 1 | 2 | 3 | 4) => void;
  selectedProject: string | null;
}

export default function ScreenNav({ currentScreen, onScreenChange, selectedProject }: ScreenNavProps) {
  if (!selectedProject) return null;

  const screens = [
    { num: 1, label: 'Portfólio', icon: '📊' },
    { num: 2, label: 'Fases', icon: '📈' },
    { num: 3, label: 'Galeria', icon: '📸' },
    { num: 4, label: '360°', icon: '🎥' },
  ] as const;

  return (
    <div className="bg-gray-900 rounded-lg shadow-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-white">Projeto: {selectedProject}</h2>
          <p className="text-sm text-gray-400">Navegue entre as telas com os botões abaixo</p>
        </div>

        <div className="flex gap-3">
          {screens.map((screen) => (
            <button
              key={screen.num}
              onClick={() => onScreenChange(screen.num)}
              aria-label={`Navegar para ${screen.label}`}
              className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                currentScreen === screen.num
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <span>{screen.icon}</span>
              <span className="hidden sm:inline">Tela {screen.num}</span>
              <span className="sm:hidden">T{screen.num}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
