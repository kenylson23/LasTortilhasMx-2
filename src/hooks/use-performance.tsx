import { useEffect, useRef } from 'react';

// Hook para otimizar performance com Intersection Observer
export function usePerformanceOptimization() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Configurar Intersection Observer para elementos off-screen
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const element = entry.target as HTMLElement;
          
          if (entry.isIntersecting) {
            // Elemento está visível - otimizar para performance
            element.style.contentVisibility = 'visible';
            element.style.contain = 'layout style paint';
          } else {
            // Elemento não está visível - economizar recursos
            element.style.contentVisibility = 'auto';
            element.style.contain = 'strict';
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    // Observar todos os elementos com classe performance-optimized
    const elements = document.querySelectorAll('.performance-optimized');
    elements.forEach((element) => {
      observerRef.current?.observe(element);
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return observerRef;
}

// Hook para preload de recursos críticos
export function usePreloadResources(resources: string[]) {
  useEffect(() => {
    resources.forEach((resource) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      
      // Determinar tipo de recurso
      if (resource.includes('.css')) {
        link.as = 'style';
      } else if (resource.includes('.js')) {
        link.as = 'script';
      } else if (resource.match(/\.(jpg|jpeg|png|webp|avif)$/)) {
        link.as = 'image';
      } else if (resource.match(/\.(woff|woff2|ttf|otf)$/)) {
        link.as = 'font';
        link.crossOrigin = 'anonymous';
      }
      
      document.head.appendChild(link);
    });
  }, [resources]);
}

// Hook para otimizar Re-renders
export function useRenderOptimization() {
  const renderCountRef = useRef(0);
  
  useEffect(() => {
    renderCountRef.current++;
    
    // Log excessivos re-renders em desenvolvimento
    if (process.env.NODE_ENV === 'development' && renderCountRef.current > 5) {
      console.warn(`Component re-rendered ${renderCountRef.current} times`);
    }
  });

  return renderCountRef.current;
}

// Hook para Web Vitals básico
export function useWebVitals() {
  useEffect(() => {
    // Monitorar CLS (Cumulative Layout Shift)
    let cls = 0;
    
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
          cls += (entry as any).value;
        }
      }
    });

    if ('PerformanceObserver' in window) {
      observer.observe({ type: 'layout-shift', buffered: true });
    }

    // Monitorar LCP (Largest Contentful Paint)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      if (process.env.NODE_ENV === 'development') {
        console.log('LCP:', lastEntry.startTime);
      }
    });

    if ('PerformanceObserver' in window) {
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    }

    return () => {
      observer.disconnect();
      lcpObserver.disconnect();
    };
  }, []);
}

// Hook para Resource Hints
export function useResourceHints() {
  useEffect(() => {
    // Adicionar DNS prefetch para domínios externos
    const domains = [
      'images.unsplash.com',
      'fonts.googleapis.com',
      'fonts.gstatic.com'
    ];

    domains.forEach((domain) => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = `//${domain}`;
      document.head.appendChild(link);
    });

    // Adicionar preconnect para recursos críticos
    const preconnectDomains = [
      'https://images.unsplash.com',
      'https://fonts.googleapis.com'
    ];

    preconnectDomains.forEach((domain) => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }, []);
}