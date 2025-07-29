import { useLazyLoad } from "@/hooks/use-lazy-load";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  onLoad?: () => void;
}

export default function LazyImage({ src, alt, className = "", placeholder, onLoad }: LazyImageProps) {
  const { ref, isVisible, isLoaded, handleLoad } = useLazyLoad();

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        ref={ref}
        src={isVisible ? src : placeholder || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yODUgMjAwSDMxNVYyMTBIMjg1VjIwMFpNMjc1IDIxMEgyODVWMjIwSDI3NVYyMTBaTTMxNSAyMTBIMzI1VjIyMEgzMTVWMjEwWk0yNzUgMjIwSDI4NVYyMzBIMjc1VjIyMFpNMzE1IDIyMEgzMjVWMjMwSDMxNVYyMjBaTTI4NSAyMzBIMzE1VjI0MEgyODVWMjMwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K'}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => {
          handleLoad();
          onLoad?.();
        }}
        loading="lazy"
      />
      {!isLoaded && isVisible && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="text-gray-400">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}