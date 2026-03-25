import { useState, useEffect } from 'react';
import './SearchBar.css';

interface SearchBarProps {
  onSearch: (term: string) => void;
  initialValue?: string;
}

export default function SearchBar({ onSearch, initialValue = '' }: SearchBarProps) {
  const [value, setValue] = useState(initialValue);

  // Sync external value changes (e.g., when category resets)
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleSearch = () => {
    onSearch(value.trim());
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        id="book-search"
        placeholder="Buscar por título, autor o editorial..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyUp={handleKeyUp}
      />
      <button onClick={handleSearch}>Buscar</button>
    </div>
  );
}
