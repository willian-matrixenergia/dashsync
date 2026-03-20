import { PortfolioMaster } from '../types';
import { useState } from 'react';

interface Screen3Props {
  selectedProject: PortfolioMaster | null;
}

export default function Screen3({ selectedProject }: Screen3Props) {
  const [activeFolder, setActiveFolder] = useState('All Assets');

  if (!selectedProject) {
    return (
      <div className="flex-1 flex items-center justify-center bg-bgLight text-muted italic">
        Select a project from the Portfolio to view media assets.
      </div>
    );
  }

  const folders = [
    { name: 'All Assets', icon: 'grid_view', count: 124 },
    { name: 'Recent Week', icon: 'schedule', count: 12 },
    { name: 'Equipment', icon: 'inventory_2', count: 45 },
    { name: 'Site Progress', icon: 'foundation', count: 67 },
  ];

  const assets = [
    { id: 1, type: 'image', status: 'verified', date: '2024-03-15', label: 'IMG_4829.jpg' },
    { id: 2, type: 'video', status: 'verified', date: '2024-03-14', label: 'DRONE_SURVEY_01.mp4' },
    { id: 3, type: 'image', status: 'pending', date: '2024-03-14', label: 'IMG_4828.jpg' },
    { id: 4, type: 'image', status: 'verified', date: '2024-03-13', label: 'IMG_4827.jpg' },
    { id: 5, type: 'image', status: 'verified', date: '2024-03-13', label: 'IMG_4826.jpg' },
    { id: 6, type: 'image', status: 'pending', date: '2024-03-12', label: 'IMG_4825.jpg' },
    { id: 7, type: 'image', status: 'verified', date: '2024-03-12', label: 'IMG_4824.jpg' },
    { id: 8, type: 'image', status: 'verified', date: '2024-03-11', label: 'IMG_4823.jpg' },
  ];

  return (
    <>
      {/* Media Sidebar (30%) */}
      <aside className="w-[30%] bg-surface border-r border-border-color flex flex-col h-full overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-text-main">Media Library</h3>
            <button 
              id="btn-new-folder"
              aria-label="Create new folder"
              className="material-symbols-outlined text-muted hover:text-primary transition-colors"
            >
              create_new_folder
            </button>
          </div>
          
          <nav className="space-y-1">
            {folders.map(folder => (
              <button
                key={folder.name}
                id={`btn-folder-${folder.name.replace(/\s+/g, '-').toLowerCase()}`}
                aria-label={`Open folder ${folder.name}`}
                onClick={() => setActiveFolder(folder.name)}
                className={`w-full flex items-center justify-between p-3 rounded-md transition-all group ${activeFolder === folder.name ? 'bg-primary/5 text-primary' : 'text-muted hover:bg-bgLight hover:text-text-main'}`}
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[20px]">{folder.icon}</span>
                  <span className="text-sm font-bold uppercase tracking-wider">{folder.name}</span>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${activeFolder === folder.name ? 'bg-primary/20 text-primary' : 'bg-bgLight text-muted group-hover:bg-border-color'}`}>
                  {folder.count}
                </span>
              </button>
            ))}
          </nav>

          <div className="mt-12 pt-8 border-t border-border-color">
            <h4 className="text-xs font-bold text-muted uppercase tracking-widest mb-4 px-3">Storage Details</h4>
            <div className="px-3 space-y-4">
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-muted">Used Space</span>
                <span className="text-text-main">12.4 GB / 100 GB</span>
              </div>
              <div className="w-full bg-bgLight rounded-full h-2 overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: '12.4%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area (70%) */}
      <main className="w-[70%] flex flex-col h-full overflow-hidden bg-bgLight">
        {/* Gallery Header */}
        <div className="p-6 border-b border-border-color flex justify-between items-center shrink-0 bg-surface">
          <div>
            <h1 className="text-2xl font-bold text-text-main">{activeFolder}</h1>
            <p className="text-sm text-muted">{selectedProject.projeto} • {folders.find(f => f.name === activeFolder)?.count || 0} Assets</p>
          </div>
          <div className="flex gap-3">
            <button 
              id="btn-gallery-filters"
              aria-label="Toggle gallery filters"
              className="flex items-center gap-2 bg-surface text-text-main border border-border-color px-4 py-2 rounded-md text-sm font-bold hover:bg-bgLight transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">filter_list</span>
              Filters
            </button>
            <button 
              id="btn-upload-assets"
              aria-label="Upload new media assets"
              className="flex items-center gap-2 bg-primary text-white border border-primary px-4 py-2 rounded-md text-sm font-bold hover:bg-primary/90 transition-all shadow-sm shadow-primary/20"
            >
              <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
              Upload Assets
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-4 gap-6">
            {assets.map(asset => (
              <div key={asset.id} className="bg-surface border border-border-color rounded-md overflow-hidden group hover:border-primary transition-all flex flex-col">
                <div className="aspect-square bg-bgLight relative overflow-hidden flex items-center justify-center mb-2">
                  {/* Mock Content Placeholder */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
                  <span className="material-symbols-outlined text-muted/20 text-[64px] group-hover:scale-110 transition-transform duration-500">
                    {asset.type === 'image' ? 'image' : 'smart_display'}
                  </span>
                  
                  {/* Status Badge Overlay */}
                  <div className="absolute top-2 right-2">
                    <span className={`flex items-center justify-center p-1 rounded-full shadow-sm ${asset.status === 'verified' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                      <span className="material-symbols-outlined text-[14px]">
                        {asset.status === 'verified' ? 'verified' : 'pending'}
                      </span>
                    </span>
                  </div>

                  {/* Hover Actions Overlay */}
                  <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button 
                      id={`btn-view-asset-${asset.id}`}
                      aria-label={`View asset ${asset.label}`}
                      className="w-10 h-10 rounded-full bg-white text-primary flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                    >
                      <span className="material-symbols-outlined">visibility</span>
                    </button>
                    <button 
                      id={`btn-download-asset-${asset.id}`}
                      aria-label={`Download asset ${asset.label}`}
                      className="w-10 h-10 rounded-full bg-white text-primary flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                    >
                      <span className="material-symbols-outlined">file_download</span>
                    </button>
                  </div>
                </div>
                <div className="p-3 border-t border-border-color">
                  <p className="text-xs font-bold text-text-main truncate mb-1">{asset.label}</p>
                  <p className="text-[10px] text-muted font-bold uppercase tracking-tighter">{asset.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
