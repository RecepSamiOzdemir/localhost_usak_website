import React from 'react';
import { Search } from 'lucide-react';

export interface FilterOption {
  id: string;
  label: string;
  icon?: string;
}

interface FilterBarProps {
  primaryLabel?: string;
  primaryOptions: FilterOption[];
  selectedPrimary: string;
  onSelectPrimary: (id: string) => void;

  secondaryLabel?: string;
  secondaryOptions?: FilterOption[];
  selectedSecondary?: string;
  onSelectSecondary: (id: string) => void;

  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  searchPlaceholder?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  primaryLabel = 'Kategori',
  primaryOptions,
  selectedPrimary,
  onSelectPrimary,

  secondaryLabel,
  secondaryOptions,
  selectedSecondary,
  onSelectSecondary,

  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Ara...',
}) => {
  return (
    <div className="filter-bar-wrapper">
      {/* Primary Category Group */}
      <div className="filter-group">
        <span className="filter-label">{primaryLabel}:</span>
        {primaryOptions.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className={`filter-pill ${selectedPrimary === opt.id ? 'active' : ''}`}
            onClick={() => onSelectPrimary(opt.id)}
          >
            {opt.icon && <span>{opt.icon}</span>}
            <span>{opt.label}</span>
          </button>
        ))}
      </div>

      {/* Secondary Filter Group (if provided) */}
      {secondaryOptions && onSelectSecondary && (
        <div className="filter-group">
          {secondaryLabel && <span className="filter-label">{secondaryLabel}:</span>}
          {secondaryOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              className={`filter-pill ${selectedSecondary === opt.id ? 'active' : ''}`}
              onClick={() => onSelectSecondary(opt.id)}
            >
              {opt.icon && <span>{opt.icon}</span>}
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Search Input (if provided) */}
      {onSearchChange !== undefined && (
        <div className="search-input-box">
          <Search size={16} className="search-icon-pos" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="search-input"
            value={searchQuery || ''}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            aria-label="Arama"
          />
        </div>
      )}
    </div>
  );
};
