import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Compass } from 'lucide-react';
import Button from '../../components/common/Button';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-24 sm:py-32 text-center space-y-8 animate-fade-in">
      <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mx-auto">
        <Compass className="w-10 h-10 stroke-[1.5]" />
      </div>

      <div className="space-y-3">
        <p className="font-serif text-6xl sm:text-7xl font-bold text-slate-900 tracking-tight">
          404
        </p>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
          The Requested Garment or Page Does Not Exist
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
          The link you followed may have expired, or the silhouette has been retired to our private historical archive.
        </p>
      </div>

      {/* Quick Search */}
      <form onSubmit={handleSearch} className="max-w-md mx-auto relative flex items-center">
        <input
          type="text"
          placeholder="Search garments across our collections..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full text-xs pl-10 pr-24 py-3 bg-white border border-stone-200 rounded-full focus:outline-none focus:border-slate-900 shadow-sm"
        />
        <Search className="w-4 h-4 text-stone-400 absolute left-3.5" />
        <button
          type="submit"
          className="absolute right-1.5 bg-slate-900 text-white text-xs font-semibold px-4 py-1.5 rounded-full hover:bg-black"
        >
          Search
        </button>
      </form>

      {/* Suggested Navigation */}
      <div className="pt-6 border-t border-stone-200/80 max-w-md mx-auto">
        <p className="text-xs uppercase tracking-widest text-stone-400 font-semibold mb-3">
          Explore Current Archives
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/women">
            <Button variant="secondary" size="sm">Women's Collection</Button>
          </Link>
          <Link to="/men">
            <Button variant="secondary" size="sm">Men's Collection</Button>
          </Link>
          <Link to="/kids">
            <Button variant="secondary" size="sm">Kids' Collection</Button>
          </Link>
          <Link to="/">
            <Button variant="outline" size="sm">Return to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
