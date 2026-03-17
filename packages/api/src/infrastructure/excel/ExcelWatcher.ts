import chokidar from 'chokidar';
import path from 'path';
import { parseExcelFile } from './ExcelParser.js';
import type { InMemoryPortfolioRepository } from '../repositories/InMemoryPortfolioRepository.js';
import type { InMemoryProgressoRepository } from '../repositories/InMemoryProgressoRepository.js';
import { Projeto } from '../../domain/portfolio/Projeto.js';

const DEBOUNCE_MS = 2000;

export interface WatcherCallbacks {
  onReloaded: (timestamp: Date) => void;
  onError:    (msg: string) => void;
}

export function startExcelWatcher(
  dataDir: string,
  portfolioRepo: InMemoryPortfolioRepository,
  progressoRepo: InMemoryProgressoRepository,
  callbacks: WatcherCallbacks,
): () => void {
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  async function reload(filePath: string): Promise<void> {
    try {
      const result = await parseExcelFile(filePath);
      if (result.errors.length > 0) {
        callbacks.onError(`Parse errors in ${path.basename(filePath)}: ` +
          result.errors.map(e => `[${e.sheet}:${e.row}] ${e.message}`).join('; '));
      }
      const projetos = result.projetos.map(raw => Projeto.reconstituir(raw));
      portfolioRepo.reload(projetos);
      progressoRepo.reload(result.evolucoes);
      callbacks.onReloaded(new Date());
    } catch (err) {
      callbacks.onError(`Failed to parse ${filePath}: ${String(err)}`);
    }
  }

  const watcher = chokidar.watch(path.join(dataDir, '*.xlsx'), {
    persistent: true,
    ignoreInitial: false,
    awaitWriteFinish: { stabilityThreshold: 500, pollInterval: 100 },
  });

  watcher.on('add', filePath => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => void reload(filePath), DEBOUNCE_MS);
  });

  watcher.on('change', filePath => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => void reload(filePath), DEBOUNCE_MS);
  });

  return () => { void watcher.close(); };
}
