import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import dropdownArrow from "@/assets/icons/dropdown-arrow.svg";

// Simple Fruit Creation Dialog Component
export function FruitCreationDialog({
  initialName,
  onConfirm,
  onCancel
}: {
  initialName: string;
  onConfirm: (data: { name: string; category: string; color: string }) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initialName);
  const [category, setCategory] = useState('');
  const [color, setColor] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onConfirm({ name: name.trim(), category: category.trim() || 'Unknown', color: color.trim() || 'Unknown' });
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h3 style={{ marginTop: 0, marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>
        Create New Fruit
      </h3>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
            Name:
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              boxSizing: 'border-box',
              transition: 'border-color 120ms ease, box-shadow 120ms ease',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d1d5db';
              e.target.style.boxShadow = 'none';
            }}
            autoFocus
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
            Category:
          </label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g., Tropical, Citrus, Berry"
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              boxSizing: 'border-box',
              transition: 'border-color 120ms ease, box-shadow 120ms ease',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d1d5db';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>
            Color:
          </label>
          <input
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            placeholder="e.g., Red, Yellow, Purple"
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              boxSizing: 'border-box',
              transition: 'border-color 120ms ease, box-shadow 120ms ease',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d1d5db';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={onCancel}
            className="standard-button"
            style={{
              backgroundColor: 'white',
              borderColor: '#d1d5db',
              color: '#374151'
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!name.trim()}
            className="standard-button primary"
            style={{
              opacity: name.trim() ? 1 : 0.5,
              cursor: name.trim() ? 'pointer' : 'not-allowed'
            }}
          >
            Create Fruit
          </button>
        </div>
      </form>
    </div>
  );
}

export type SortOption<T> = {
  label: string;
  sortFn: (a: T, b: T) => number;
};

export type SearchableDropdownProps<T> = {
  // Data
  options: T[];
  selectedValue?: T | null;

  // Display functions
  getDisplayText: (item: T) => string;
  getSearchText: (item: T) => string;

  // Search configuration
  placeholder?: string;
  showResultsBeforeSearch?: boolean;
  searchThreshold?: number; // Minimum characters before filtering

  // Sorting
  sortOptions?: SortOption<T>[];
  defaultSort?: SortOption<T>;

  // Creation of new items
  allowCreateNew?: boolean;
  onCreateNew?: (data: any) => void;
  getCreateNewText?: (searchText: string) => string;
  createNewDialog?: (searchText: string, onConfirm: (data: any) => void, onCancel: () => void) => React.ReactNode;

  // Callbacks
  onSelect: (item: T | null) => void;
  onSearchChange?: (searchText: string) => void;

  // Styling
  className?: string;
  dropdownClassName?: string;
  optionClassName?: string;

  // Accessibility
  ariaLabel?: string;
};

export function SearchableDropdown<T>({
  options,
  selectedValue,
  getDisplayText,
  getSearchText,
  placeholder = "Search...",
  showResultsBeforeSearch = false,
  searchThreshold = 0,
  sortOptions,
  defaultSort,
  allowCreateNew = false,
  onCreateNew,
  getCreateNewText,
  createNewDialog,
  onSelect,
  onSearchChange,
  className = "",
  dropdownClassName = "",
  optionClassName = "",
  ariaLabel
}: SearchableDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<T[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [currentSort, setCurrentSort] = useState<SortOption<T> | undefined>(defaultSort);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter and sort options based on search text
  useEffect(() => {
    let filtered = options;
    
    // Apply search filter
    if (searchText.length >= searchThreshold) {
      const searchLower = searchText.toLowerCase();
      filtered = options.filter(option => 
        getSearchText(option).toLowerCase().includes(searchLower)
      );
    } else if (!showResultsBeforeSearch) {
      filtered = [];
    }
    
    // Apply sorting
    if (currentSort) {
      filtered = [...filtered].sort(currentSort.sortFn);
    }
    
    setFilteredOptions(filtered);
    setSelectedIndex(-1);
  }, [searchText, options, searchThreshold, showResultsBeforeSearch, currentSort, getSearchText]);

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchText('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchText('');
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchText(value);
    onSearchChange?.(value);
  };

  const handleOptionSelect = (option: T) => {
    onSelect(option);
    setIsOpen(false);
    setSearchText('');
  };

  const handleCreateNew = () => {
    if (!allowCreateNew) return;

    if (createNewDialog) {
      setShowCreateDialog(true);
    } else if (onCreateNew && searchText.trim()) {
      onCreateNew(searchText.trim());
      setIsOpen(false);
      setSearchText('');
    }
  };

  const handleCreateConfirm = (data: any) => {
    if (onCreateNew) {
      onCreateNew(data);
      setIsOpen(false);
      setSearchText('');
      setShowCreateDialog(false);
    }
  };

  const handleCreateCancel = () => {
    setShowCreateDialog(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

    const maxIndex = filteredOptions.length + (allowCreateNew ? 1 : 0) - 1;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex(prev =>
          prev < maxIndex ? prev + 1 : maxIndex
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        event.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredOptions.length) {
          handleOptionSelect(filteredOptions[selectedIndex]);
        } else if (allowCreateNew && selectedIndex === filteredOptions.length) {
          handleCreateNew();
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchText('');
        break;
    }
  };

  const displayText = selectedValue ? getDisplayText(selectedValue) : placeholder;
  const hasNoResults = searchText.length >= searchThreshold && filteredOptions.length === 0;
  const showCreateOption = allowCreateNew;

  return (
    <div ref={containerRef} className={`searchable-dropdown ${className}`}>
      {/* Dropdown Trigger */}
      <div 
        className="dropdown-trigger"
        onClick={handleToggleDropdown}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
      >
        <div className="dropdown-display">
          {isOpen ? (
            <input
              ref={inputRef}
              type="text"
              value={searchText}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="dropdown-search-input"
              role="searchbox"
              aria-label="Search options"
            />
          ) : (
            <span className="dropdown-text">{displayText}</span>
          )}
        </div>
        <img
          src={dropdownArrow}
          className={`dropdown-arrow ${isOpen ? 'open' : ''}`}
          alt="Toggle dropdown"
        />
      </div>

      {/* Dropdown Content */}
      {isOpen && (
        <div ref={dropdownRef} className={`dropdown-content ${dropdownClassName}`}>
          
          {/* Sort Options */}
          {sortOptions && sortOptions.length > 1 && (
            <div className="sort-options">
              <span className="sort-label">Sort by:</span>
              {sortOptions.map((sortOption, index) => (
                <button
                  key={index}
                  className={`sort-button ${currentSort === sortOption ? 'active' : ''}`}
                  onClick={() => setCurrentSort(sortOption)}
                >
                  {sortOption.label}
                </button>
              ))}
            </div>
          )}

          {/* Results */}
          <div className="dropdown-options" role="listbox">
            {filteredOptions.map((option, index) => (
              <div
                key={index}
                className={`dropdown-option ${optionClassName} ${selectedIndex === index ? 'selected' : ''}`}
                onClick={() => handleOptionSelect(option)}
                role="option"
                aria-selected={selectedIndex === index}
              >
                {getDisplayText(option)}
              </div>
            ))}
            
            {/* Create New Option */}
            {showCreateOption && (
              <div
                className={`dropdown-option create-new-option ${optionClassName} ${selectedIndex === filteredOptions.length ? 'selected' : ''}`}
                onClick={handleCreateNew}
                role="option"
                aria-selected={selectedIndex === filteredOptions.length}
              >
                {getCreateNewText ?
                  getCreateNewText(searchText) :
                  searchText.trim() ? `Create "${searchText}"` : 'Create new...'
                }
              </div>
            )}
            
            {/* No Results */}
            {hasNoResults && !showCreateOption && (
              <div className="dropdown-no-results">
                No results found
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create New Dialog */}
      {showCreateDialog && createNewDialog && (
        <div className="create-dialog-overlay" onClick={handleCreateCancel}>
          <div className="create-dialog" onClick={(e) => e.stopPropagation()}>
            {createNewDialog(searchText, handleCreateConfirm, handleCreateCancel)}
          </div>
        </div>
      )}
    </div>
  );
}