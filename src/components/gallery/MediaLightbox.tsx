/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from 'react';
import { MediaItem } from '../../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MediaLightboxProps {
  items: MediaItem[];
  initialIndex: number;
  onClose: () => void;
  onNext: (index: number) => void;
}

export default function MediaLightbox({ items, initialIndex, onClose, onNext }: MediaLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);

  const current = items[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, items.length]);

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % items.length;
    setCurrentIndex(nextIndex);
    onNext(nextIndex);
    setZoom(1);
  };

  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + items.length) % items.length;
    setCurrentIndex(prevIndex);
    onNext(prevIndex);
    setZoom(1);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex flex-col items-center justify-center p-4">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300 transition z-10"
      >
        ✕
      </button>

      {/* Main Image */}
      <div className="flex-1 flex items-center justify-center max-w-4xl w-full mb-4 relative overflow-hidden">
        <div
          className="overflow-auto cursor-move"
          style={{
            transform: `scale(${zoom})`,
            transition: 'transform 0.2s',
          }}
        >
          <img
            src={current?.url}
            alt={current?.titulo}
            className="max-h-96 object-contain select-none"
            onClick={(e) => {
              // Zoom on click
              const newZoom = zoom === 1 ? 1.5 : 1;
              setZoom(newZoom);
            }}
          />
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl hover:text-gray-300 transition bg-black bg-opacity-50 w-12 h-12 rounded-full flex items-center justify-center"
        >
          ‹
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl hover:text-gray-300 transition bg-black bg-opacity-50 w-12 h-12 rounded-full flex items-center justify-center"
        >
          ›
        </button>
      </div>

      {/* Info Bar */}
      {current && (
        <div className="w-full max-w-4xl bg-gray-900 rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-gray-400 text-xs uppercase">Título</p>
              <p className="text-white font-semibold">{current.titulo}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase">Categoria</p>
              <p className="text-white font-semibold">{current.categoria}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase">Data</p>
              <p className="text-white font-semibold">
                {format(new Date(current.data_upload), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
              </p>
            </div>
          </div>

          {current.descricao && (
            <div className="mb-4">
              <p className="text-gray-400 text-xs uppercase mb-1">Descrição</p>
              <p className="text-gray-300 text-sm">{current.descricao}</p>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="text-gray-400 text-sm">
              {currentIndex + 1} / {items.length}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setZoom(Math.max(zoom - 0.2, 1))}
                className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm transition"
              >
                − Zoom
              </button>
              <button
                onClick={() => setZoom(zoom + 0.2)}
                className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm transition"
              >
                + Zoom
              </button>
              <button
                onClick={handlePrev}
                disabled={items.length <= 1}
                className="bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-white px-3 py-2 rounded text-sm transition"
              >
                ‹ Anterior
              </button>
              <button
                onClick={handleNext}
                disabled={items.length <= 1}
                className="bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-white px-3 py-2 rounded text-sm transition"
              >
                Próxima ›
              </button>
              <button
                onClick={onClose}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm transition"
              >
                Fechar
              </button>
            </div>
          </div>

          {/* Keyboard Info */}
          <div className="mt-4 text-gray-500 text-xs">
            💡 <strong>Atalhos:</strong> ESC para fechar, ← → para navegar, Clique para zoom
          </div>
        </div>
      )}
    </div>
  );
}
