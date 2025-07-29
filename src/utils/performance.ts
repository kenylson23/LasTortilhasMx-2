// Utilitários para otimização de performance

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T & { cancel: () => void } {
  let timeoutId: NodeJS.Timeout | null = null;
  
  const debounced = ((...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  }) as T & { cancel: () => void };
  
  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };
  
  return debounced;
}

// Throttle function
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): T {
  let inThrottle: boolean = false;
  
  return ((...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  }) as T;
}

// Lazy loading para componentes
export function createLazyComponent<T extends React.ComponentType<any>>(
  importFunction: () => Promise<{ default: T }>
): React.LazyExoticComponent<T> {
  return React.lazy(importFunction);
}

// Cache para resultados de funções
export class FunctionCache<T> {
  private cache = new Map<string, T>();
  private maxSize: number;
  
  constructor(maxSize: number = 100) {
    this.maxSize = maxSize;
  }
  
  get(key: string): T | undefined {
    return this.cache.get(key);
  }
  
  set(key: string, value: T): void {
    if (this.cache.size >= this.maxSize) {
      // Remove o item mais antigo
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }
  
  clear(): void {
    this.cache.clear();
  }
}

// Otimização de imagens
export function getOptimizedImageUrl(
  url: string,
  width?: number,
  height?: number,
  quality: number = 80
): string {
  // Para URLs do Unsplash, adicionar parâmetros de otimização
  if (url.includes('unsplash.com')) {
    const params = new URLSearchParams();
    if (width) params.append('w', width.toString());
    if (height) params.append('h', height.toString());
    params.append('q', quality.toString());
    params.append('auto', 'format');
    params.append('fit', 'crop');
    
    return `${url}&${params.toString()}`;
  }
  
  return url;
}

// Preload crítico de recursos
export function preloadCriticalResources(resources: string[]): void {
  resources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource;
    
    // Determinar o tipo de recurso
    if (resource.endsWith('.css')) {
      link.as = 'style';
    } else if (resource.endsWith('.js')) {
      link.as = 'script';
    } else if (resource.match(/\.(jpg|jpeg|png|webp|avif)$/)) {
      link.as = 'image';
    } else if (resource.match(/\.(woff|woff2|ttf|otf)$/)) {
      link.as = 'font';
      link.crossOrigin = 'anonymous';
    }
    
    document.head.appendChild(link);
  });
}

// Monitoramento de performance
export function measurePerformance(name: string, fn: () => void): void {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`${name} took ${end - start} milliseconds`);
}

// Web Vitals básicos
export function reportWebVitals(): void {
  if ('web-vital' in window || typeof window !== 'undefined') {
    // Placeholder para implementação futura de Web Vitals
    console.log('Web Vitals monitoring enabled');
  }
}

declare global {
  namespace React {
    function lazy<T extends React.ComponentType<any>>(
      factory: () => Promise<{ default: T }>
    ): React.LazyExoticComponent<T>;
  }
}