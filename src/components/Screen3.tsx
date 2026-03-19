import { useState, useCallback } from 'react';
import { MediaItem } from '../types';
import MediaUpload from './gallery/MediaUpload';
import MediaGrid from './gallery/MediaGrid';
import MediaLightbox from './gallery/MediaLightbox';

interface Screen3Props {
  projeto: string;
}

export default function Screen3({ projeto }: Screen3Props) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'Suprimentos' | 'Obras' | 'Aéreas' | 'Todas'>('Todas');
  const [selectedImage, setSelectedImage] = useState<MediaItem | null>(null);
  const [loading, setLoading] = useState(false);

  const filteredMedia = selectedCategory === 'Todas'
    ? mediaItems
    : mediaItems.filter((m) => m.categoria === selectedCategory);

  const handleUpload = useCallback(async (files: File[], categoria: 'Suprimentos' | 'Obras' | 'Aéreas') => {
    setLoading(true);
    try {
      const newItems: MediaItem[] = files.map((file, idx) => ({
        id: `${Date.now()}-${idx}`,
        projeto,
        categoria,
        titulo: file.name.replace(/\.[^/.]+$/, ''),
        url: URL.createObjectURL(file),
        data_upload: new Date().toISOString(),
        descricao: '',
      }));

      setMediaItems([...mediaItems, ...newItems]);
    } catch (err) {
      console.error('Failed to upload:', err);
    } finally {
      setLoading(false);
    }
  }, [mediaItems, projeto]);

  const handleDelete = useCallback((id: string) => {
    setMediaItems(mediaItems.filter((m) => m.id !== id));
    if (selectedImage?.id === id) setSelectedImage(null);
  }, [mediaItems, selectedImage]);

  return (
    <div className="space-y-6">
      <div className="bg-gray-900 rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-white mb-2">Tela 03: Galeria de Mídia</h1>
        <p className="text-gray-400">Fotos de suprimentos, obras e aéreas do projeto {projeto}</p>
      </div>

      <MediaUpload projeto={projeto} onUpload={handleUpload} loading={loading} />

      <div className="bg-gray-900 rounded-lg shadow-lg p-4">
        <div className="flex flex-wrap gap-2">
          {['Todas', 'Suprimentos', 'Obras', 'Aéreas'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat as any)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {cat} ({cat === 'Todas' ? mediaItems.length : mediaItems.filter((m) => m.categoria === cat).length})
            </button>
          ))}
        </div>
      </div>

      <MediaGrid
        items={filteredMedia}
        onSelect={setSelectedImage}
        onDelete={handleDelete}
        selectedId={selectedImage?.id}
      />

      {selectedImage && (
        <MediaLightbox
          items={filteredMedia}
          initialIndex={filteredMedia.findIndex((m) => m.id === selectedImage.id)}
          onClose={() => setSelectedImage(null)}
          onNext={(idx) => setSelectedImage(filteredMedia[idx])}
        />
      )}

      {mediaItems.length === 0 && (
        <div className="bg-gray-900 rounded-lg shadow-lg p-12 text-center">
          <div className="text-6xl mb-4">📸</div>
          <p className="text-gray-400">Nenhuma imagem ainda. Use o formulário acima para fazer upload.</p>
        </div>
      )}

      {mediaItems.length > 0 && (
        <div className="bg-gray-900 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Estatísticas</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 uppercase">Total de Fotos</p>
              <p className="text-3xl font-bold text-white mt-2">{mediaItems.length}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 uppercase">Suprimentos</p>
              <p className="text-3xl font-bold text-blue-400 mt-2">
                {mediaItems.filter((m) => m.categoria === 'Suprimentos').length}
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 uppercase">Obras/Aéreas</p>
              <p className="text-3xl font-bold text-green-400 mt-2">
                {mediaItems.filter((m) => m.categoria !== 'Suprimentos').length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
