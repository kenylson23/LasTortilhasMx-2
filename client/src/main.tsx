import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./styles/performance.css";

// Preload crítico da imagem do hero usando imagens do diretório public
const preloadHeroImage = () => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = '/hero-desktop.webp';
  link.as = 'image';
  link.fetchPriority = 'high';
  document.head.appendChild(link);
};

// Preload recursos críticos
const criticalResources = [
  'https://images.unsplash.com',
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com'
];

// Adicionar resource hints
criticalResources.forEach((resource) => {
  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = resource;
  link.crossOrigin = 'anonymous';
  document.head.appendChild(link);
});

// Executar preload da imagem do hero
preloadHeroImage();

createRoot(document.getElementById("root")!).render(<App />);
