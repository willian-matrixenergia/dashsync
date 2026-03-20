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
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="bg-matrix-graphite border border-white/10 rounded-2xl shadow-2xl p-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-matrix-orange/10 blur-[100px] rounded-full -mr-32 -mt-32 group-hover:bg-matrix-orange/20 transition-all duration-1000" />
        <h1 className="text-4xl font-black text-white mb-2 italic tracking-tighter">Tela 03: Galeria de Mídia</h1>
        <p className="text-matrix-offwhite/60 font-medium uppercase tracking-widest text-xs flex items-center gap-2">
          <span className="w-2 h-2 bg-matrix-orange rounded-full animate-pulse" />
          Registros visuais do projeto {projeto}
        </p>
      </div>

      <div className="bg-matrix-graphite border border-white/10 rounded-2xl shadow-xl overflow-hidden">
        <MediaUpload projeto={projeto} onUpload={handleUpload} loading={loading} />
      </div>

      <div className="bg-white/5 border border-white/5 rounded-2xl p-6 backdrop-blur-md">
        <div className="flex flex-wrap gap-3">
          {['Todas', 'Suprimentos', 'Obras', 'Aéreas'].map((cat) => {
            const isActive = selectedCategory === cat;
            const count = cat === 'Todas' ? mediaItems.length : mediaItems.filter((m) => m.categoria === cat).length;
            
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat as any)}
                className={`px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all duration-300 flex items-center gap-3 ${
                  isActive
                    ? 'bg-matrix-orange text-white shadow-lg shadow-matrix-orange/20 scale-105'
                    : 'bg-white/5 text-matrix-offwhite/60 hover:bg-white/10 border border-white/5'
                }`}
              >
                {cat}
                <span className={`px-2 py-0.5 rounded-full text-[8px] ${isActive ? 'bg-white/20 text-white' : 'bg-white/10 text-matrix-offwhite/40'}`}>
                  {count}
                </span>
              </button>
            );
          })}
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
        <div className="bg-matrix-graphite border border-white/10 rounded-2xl shadow-lg p-20 text-center group">
          <div className="text-7xl mb-6 grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-110">📸</div>
          <p className="text-matrix-offwhite/40 font-bold uppercase tracking-widest text-xs leading-relaxed">
            Nenhuma evidência visual registrada.<br />
            Utilize o módulo de upload acima para iniciar.
          </p>
        </div>
      )}

      {mediaItems.length > 0 && (
        <div className="bg-matrix-graphite border border-white/10 rounded-2xl shadow-2xl p-8 hover:border-white/20 transition-all">
          <h2 className="text-xl font-black text-white uppercase tracking-tighter italic mb-8">Resumo da Galeria</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/5 rounded-xl p-6 hover:bg-white/[0.08] transition-all">
              <p className="text-[10px] font-bold text-matrix-offwhite/40 uppercase tracking-widest mb-2">Total de Arquivos</p>
              <p className="text-4xl font-black text-white italic">{mediaItems.length}</p>
            </div>
            <div className="bg-white/5 border border-white/5 rounded-xl p-6 hover:bg-white/[0.08] transition-all">
              <p className="text-[10px] font-bold text-matrix-offwhite/40 uppercase tracking-widest mb-2">Suprimentos</p>
              <p className="text-4xl font-black text-white italic opacity-40">
                {mediaItems.filter((m) => m.categoria === 'Suprimentos').length}
              </p>
            </div>
            <div className="bg-matrix-orange/5 border border-matrix-orange/10 rounded-xl p-6 hover:bg-matrix-orange/10 transition-all">
              <p className="text-[10px] font-bold text-matrix-orange/60 uppercase tracking-widest mb-2">Obras & Aéreas</p>
              <p className="text-4xl font-black text-matrix-orange italic">
                {mediaItems.filter((m) => m.categoria !== 'Suprimentos').length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
