import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { WallApp } from './app/WallApp.js';
import './styles.css';

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');
createRoot(root).render(<StrictMode><WallApp /></StrictMode>);
