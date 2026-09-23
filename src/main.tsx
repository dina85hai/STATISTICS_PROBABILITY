import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import ProbabilityPresentation from '../editable-probability-presentation';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ProbabilityPresentation />
  </React.StrictMode>
);
