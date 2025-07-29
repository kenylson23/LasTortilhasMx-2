import { useEffect, useRef, useState, useCallback, useMemo } from 'react';

interface UseScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

// Cache global de observers para reutilização
const observerCache = new Map<string, IntersectionObserver>();

export function useScrollReveal(options: UseScrollRevealOptions = {}) {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -100px 0px',
    triggerOnce = true,
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Gerar chave única para o observer
  const observerKey = useMemo(() => 
    `${threshold}-${rootMargin}-${triggerOnce}`,
    [threshold, rootMargin, triggerOnce]
  );

  // Callback otimizado para observer
  const handleIntersection = useCallback(([entry]: IntersectionObserverEntry[]) => {
    if (entry.isIntersecting) {
      setIsVisible(true);
      if (triggerOnce && ref.current) {
        const observer = observerCache.get(observerKey);
        if (observer) {
          observer.unobserve(ref.current);
        }
      }
    } else if (!triggerOnce) {
      setIsVisible(false);
    }
  }, [triggerOnce, observerKey]);

  useEffect(() => {
    let observer = observerCache.get(observerKey);
    
    if (!observer) {
      observer = new IntersectionObserver(handleIntersection, {
        threshold,
        rootMargin,
      });
      observerCache.set(observerKey, observer);
    }

    const currentElement = ref.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement && observer) {
        observer.unobserve(currentElement);
      }
    };
  }, [observerKey, handleIntersection, threshold, rootMargin]);

  return { ref, isVisible };
}