interface CompactLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  layout?: 'horizontal' | 'vertical' | 'stacked';
}

export default function CompactLogo({ 
  size = 'md', 
  showIcon = true, 
  layout = 'horizontal' 
}: CompactLogoProps) {
  const sizeClasses = {
    sm: {
      title: 'text-lg',
      subtitle: 'text-xs',
      icon: 'w-6 h-6'
    },
    md: {
      title: 'text-xl sm:text-2xl',
      subtitle: 'text-xs sm:text-sm',
      icon: 'w-8 h-8'
    },
    lg: {
      title: 'text-2xl sm:text-3xl',
      subtitle: 'text-sm sm:text-base',
      icon: 'w-10 h-10'
    }
  };

  const layoutClasses = {
    horizontal: 'flex-row items-center gap-2',
    vertical: 'flex-col items-center gap-1',
    stacked: 'flex-col sm:flex-row sm:items-center sm:gap-2'
  };

  return (
    <div className={`flex items-center gap-3`}>
      {showIcon && (
        <div className={`${sizeClasses[size].icon} bg-gradient-to-br from-green-600 to-red-600 rounded-full flex items-center justify-center`}>
          <span className="text-white font-bold text-sm">🌮</span>
        </div>
      )}
      <div className={`flex ${layoutClasses[layout]}`}>
        <h1 className={`${sizeClasses[size].title} font-bold text-green-700`}>
          Las Tortillas
        </h1>
        <span className={`${sizeClasses[size].subtitle} text-red-600 font-medium`}>
          Mexican Grill
        </span>
      </div>
    </div>
  );
}

// Versão ultra-compacta para espaços muito pequenos
export function MiniLogo() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 bg-gradient-to-br from-green-600 to-red-600 rounded-full flex items-center justify-center">
        <span className="text-white font-bold text-xs">🌮</span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-bold text-green-700 leading-tight">Las Tortillas</span>
        <span className="text-xs text-red-600 font-medium leading-tight">Mexican Grill</span>
      </div>
    </div>
  );
}

// Versão com iniciais para casos extremos
export function InitialsLogo() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-red-600 rounded-full flex items-center justify-center">
        <span className="text-white font-bold text-sm">LT</span>
      </div>
      <div className="flex flex-col">
        <span className="text-lg font-bold text-green-700 leading-tight">Las Tortillas</span>
        <span className="text-xs text-red-600 font-medium leading-tight">Mexican Grill</span>
      </div>
    </div>
  );
}