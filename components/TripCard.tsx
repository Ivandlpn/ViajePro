
import React, { useState, useRef, useEffect } from 'react';
import type { CabinTrip } from '../types';

interface TripCardProps {
  trip: CabinTrip;
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
  onAddAnomaly: () => void;
}

const CalendarIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
);

const AlertTriangleIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
);

const MoreVerticalIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 8.01V8M12 15.01V15M12 22.01V22" transform="rotate(90 12 12)" /></svg>
);


const TripCard: React.FC<TripCardProps> = ({ trip, onEdit, onDelete, onView, onAddAnomaly }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  const handleMenuClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      setMenuOpen(!menuOpen);
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col justify-between border border-gray-100 cursor-pointer"
      onClick={onView}
    >
      <div>
        <div className="flex justify-between items-start mb-4">
            <div className="flex-grow">
                <p className="text-xs text-gray-500">{trip.code}</p>
                <h3 className="text-xl font-bold text-[#1A4488]">{trip.line}</h3>
                <p className="text-sm text-[#333333]">Vía: {trip.track}</p>
            </div>
            <div className="flex items-center flex-shrink-0">
                <div className="relative" ref={menuRef}>
                    <button onClick={handleMenuClick} className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
                        <MoreVerticalIcon />
                    </button>
                    {menuOpen && (
                        <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10 border">
                            <a href="#" onClick={(e) => { e.stopPropagation(); onEdit(); setMenuOpen(false); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Editar</a>
                            <a href="#" onClick={(e) => { e.stopPropagation(); onDelete(); setMenuOpen(false); }} className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Eliminar</a>
                        </div>
                    )}
                </div>
            </div>
        </div>
        <p className="text-sm text-gray-500 mb-2">Técnico: <span className="font-medium text-[#333333]">{trip.technician}</span></p>
        <div className="flex items-center text-sm text-[#333333] mb-2">
            <CalendarIcon />
            <span>{new Date(trip.date).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center text-sm text-[#333333]">
            <AlertTriangleIcon />
            <span>{trip.anomalies.length} anomalías registradas</span>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100">
        <button
          onClick={(e) => { e.stopPropagation(); onAddAnomaly(); }}
          className="w-full text-center bg-blue-100 text-[#1A4488] font-semibold py-2 px-4 rounded-lg hover:bg-blue-200 transition duration-300 text-sm"
        >
          Añadir Anomalía
        </button>
      </div>
    </div>
  );
};

export default TripCard;
