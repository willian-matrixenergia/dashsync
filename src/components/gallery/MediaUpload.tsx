import { useState, useRef } from 'react';

interface MediaUploadProps {
  projeto: string;
  onUpload: (files: File[], categoria: 'Suprimentos' | 'Obras' | 'Aéreas') => void;
  loading: boolean;
}

export default function MediaUpload({ projeto, onUpload, loading }: MediaUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [categoria, setCategoria] = useState<'Suprimentos' | 'Obras' | 'Aéreas'>('Suprimentos');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith('image/'),
    );

    if (files.length > 0) {
      onUpload(files, categoria);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      onUpload(files, categoria);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-gray-900 rounded-lg shadow-lg p-6 space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Upload de Imagens</h2>
        <p className="text-gray-400">Projeto: {projeto}</p>
      </div>

      {/* Category Selection */}
      <div className="grid grid-cols-3 gap-3">
        {['Suprimentos', 'Obras', 'Aéreas'].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoria(cat as any)}
            disabled={loading}
            className={`py-3 rounded-lg font-medium transition ${
              categoria === cat
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            } disabled:opacity-50`}
          >
            {cat === 'Suprimentos' && '📦'}
            {cat === 'Obras' && '🏗️'}
            {cat === 'Aéreas' && '🚁'}
            {' '}
            {cat}
          </button>
        ))}
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
          dragActive
            ? 'border-blue-500 bg-blue-500 bg-opacity-10'
            : 'border-gray-700 hover:border-gray-600'
        }`}
      >
        <input
          id="file-upload"
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleChange}
          disabled={loading}
          className="hidden"
          aria-label="Upload de imagens"
        />

        <div className="text-5xl mb-4">📸</div>
        <h3 className="text-lg font-semibold text-white mb-2">
          {loading ? 'Enviando...' : 'Clique ou arraste imagens'}
        </h3>
        <p className="text-gray-400 text-sm">Aceita: JPG, PNG, WebP (máx 10 MB por imagem)</p>

        {loading && (
          <div className="mt-4">
            <div className="inline-block animate-spin">
              <div className="border-4 border-gray-700 border-t-blue-500 rounded-full w-8 h-8" />
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="bg-blue-900 bg-opacity-30 border-l-4 border-blue-500 rounded-lg p-4">
        <p className="text-blue-300 text-sm">
          💡 <strong>Dica:</strong> As imagens são armazenadas localmente durante a sessão.
          Para persistência permanente, configure Supabase Storage no backend.
        </p>
      </div>
    </div>
  );
}
