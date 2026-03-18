'use client';

interface FontSizeSelectorProps {
  currentSize: string;
  onSizeChange: (size: 'small' | 'medium' | 'large' | 'xlarge') => void;
}

const FontIcon = ({ size, isActive }: { size: string; isActive: boolean }) => {
  const baseClasses = "w-6 h-6 transition-colors";
  const colorClass = isActive ? "text-[#032b41]" : "text-gray-400 hover:text-gray-600";
  
  // Scale icon based on size
  const scale = {
    small: '0.75',
    medium: '1',
    large: '1.25',
    xlarge: '1.5'
  }[size] || '1';

  return (
    <svg 
      stroke="currentColor" 
      fill="currentColor" 
      strokeWidth="0" 
      viewBox="0 0 24 24" 
      className={`${baseClasses} ${colorClass}`}
      height="1em" 
      width="1em"
      style={{ transform: `scale(${scale})` }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <path fill="none" d="M0 0h24v24H0z"></path>
        <path d="M11.246 15H4.754l-2 5H.6L7 4h2l6.4 16h-2.154l-2-5zm-.8-2L8 6.885 5.554 13h4.892zM21 12.535V12h2v8h-2v-.535a4 4 0 1 1 0-6.93zM19 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path>
      </g>
    </svg>
  );
};

export default function FontSizeSelector({ currentSize, onSizeChange }: FontSizeSelectorProps) {
  console.log("FontSizeSelector rendered, currentSize:", currentSize);  
  const sizes = [
    { key: 'small', label: 'Aa', className: 'text-xs' },
    { key: 'medium', label: 'Aa', className: 'text-sm' },
    { key: 'large', label: 'Aa', className: 'text-base' },
    { key: 'xlarge', label: 'Aa', className: 'text-lg' },
  ] as const;

  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
      {sizes.map((size) => (
        <button
          key={size.key}
          onClick={() => {
            console.log("Button clicked:", size.key);
            onSizeChange(size.key);
          }}
          className={`
            p-2 rounded-md transition-all
            ${currentSize === size.key 
              ? 'bg-white shadow-sm' 
              : 'hover:bg-gray-200'
            }
          `}
          aria-label={`Font size ${size.key}`}
        >
          <FontIcon size={size.key} isActive={currentSize === size.key} />
        </button>
      ))}
    </div>
  );
}