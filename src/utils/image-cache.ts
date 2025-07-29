// Sistema de cache para imagens
class ImageCache {
  private cache = new Map<string, Promise<HTMLImageElement>>();
  private loaded = new Set<string>();

  preload(src: string): Promise<HTMLImageElement> {
    if (this.cache.has(src)) {
      return this.cache.get(src)!;
    }

    const promise = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        this.loaded.add(src);
        resolve(img);
      };
      
      img.onerror = () => {
        this.cache.delete(src);
        reject(new Error(`Failed to load image: ${src}`));
      };
      
      // Definir src por último para evitar race conditions
      img.src = src;
    });

    this.cache.set(src, promise);
    return promise;
  }

  isLoaded(src: string): boolean {
    return this.loaded.has(src);
  }

  preloadMultiple(sources: string[]): Promise<HTMLImageElement[]> {
    return Promise.all(sources.map(src => this.preload(src)));
  }

  clear(): void {
    this.cache.clear();
    this.loaded.clear();
  }
}

export const imageCache = new ImageCache();

// Hook para usar o cache de imagens
export function useImagePreload(src: string) {
  const [loaded, setLoaded] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (imageCache.isLoaded(src)) {
      setLoaded(true);
      return;
    }

    imageCache.preload(src)
      .then(() => setLoaded(true))
      .catch(setError);
  }, [src]);

  return { loaded, error };
}

// Preload crítico para imagens do hero
export function preloadCriticalImages() {
  const criticalImages = [
    // Adicionar aqui as imagens críticas que precisam carregar primeiro
  ];
  
  return imageCache.preloadMultiple(criticalImages);
}

declare global {
  namespace React {
    function useState<T>(initialState: T): [T, (value: T) => void];
    function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  }
}