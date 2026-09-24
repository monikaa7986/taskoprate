import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const CategoryCard = ({ title, subtitle, image, link, count }) => {
  return (
    <Link
      to={link}
      className="group relative block overflow-hidden rounded-2xl aspect-[4/5] bg-stone-900 shadow-md hover:shadow-2xl transition-all duration-500 ease-out hover:-translate-y-2"
    >
      {/* Background Image */}
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108 opacity-85 group-hover:opacity-90"
      />

      {/* Elegant Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300" />

      {/* Content */}
      <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end text-white">
        {subtitle && (
          <p className="text-xs uppercase tracking-[0.25em] text-amber-300 font-semibold mb-2 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
            {subtitle}
          </p>
        )}
        <div className="flex items-end justify-between">
          <div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white mb-1">
              {title}
            </h3>
            {count !== undefined && (
              <p className="text-xs text-stone-300 font-medium">
                {count} Pieces
              </p>
            )}
          </div>
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-white group-hover:text-black group-hover:scale-110 transition-all duration-300 transform group-hover:rotate-45 active:scale-95">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
