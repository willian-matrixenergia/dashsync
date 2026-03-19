import { MediaItem } from '../../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MediaGridProps {
  items: MediaItem[];
  onSelect: (item: MediaItem) => void;
  onDelete: (id: string) => void;
  selectedId?: string;
}

export default function MediaGrid({ items, onSelect, onDelete, selectedId }: MediaGridProps) {
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Suprimentos':
        return { bg: 'bg-blue-600', icon: '📦' };
      case 'Obras':
        return { bg: 'bg-orange-600', icon: '🏗️' };
      case 'Aéreas':
        return { bg: 'bg-purple-600', icon: '🚁' };
      default:
        return { bg: 'bg-gray-600', icon: '📸' };
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-4">Galeria</h2>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">Nenhuma imagem nesta categoria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => {
            const catColor = getCategoryColor(item.categoria);
            const isSelected = selectedId === item.id;

            return (
              <div
                key={item.id}
                className={`rounded-lg overflow-hidden shadow-lg cursor-pointer group transition transform hover:scale-105 ${
                  isSelected ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                {/* Image */}
                <div
                  className="relative w-full h-48 bg-gray-800 overflow-hidden"
                  onClick={() => onSelect(item)}
                >
                  <img
                    src={item.url}
                    alt={item.titulo}
                    className="w-full h-full object-cover group-hover:opacity-75 transition"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition flex items-center justify-center">
                    <div className="text-white text-3xl opacity-0 group-hover:opacity-100 transition">
                      🔍
                    </div>
                  </div>

                  {/* Category Badge */}
                  <div className={`absolute top-2 right-2 ${catColor.bg} text-white px-3 py-1 rounded-full text-xs font-semibold`}>
                    {catColor.icon} {item.categoria}
                  </div>
                </div>

                {/* Info */}
                <div className="bg-gray-800 p-4">
                  <h3 className="text-white font-semibold truncate mb-1">{item.titulo}</h3>
                  <p className="text-gray-400 text-xs mb-3">
                    {format(new Date(item.data_upload), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                  </p>

                  {item.descricao && (
                    <p className="text-gray-400 text-xs mb-3 line-clamp-2">{item.descricao}</p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => onSelect(item)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-xs font-medium transition"
                    >
                      Ver
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-xs font-medium transition"
                    >
                      Deletar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
