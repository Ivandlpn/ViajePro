
import React, { useMemo } from 'react';
import type { CabinTrip } from '../types';

interface MapModalProps {
  trip: CabinTrip;
  onClose: () => void;
}

const MapModal: React.FC<MapModalProps> = ({ trip, onClose }) => {
  const mapUrl = useMemo(() => {
    const anomaliesWithLocation = trip.anomalies.filter(a => !!a.location);
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
      console.error("Google Maps API key is missing. Please configure the API_KEY environment variable.");
      return null;
    }
    
    if (anomaliesWithLocation.length === 0) {
      return null;
    }

    const baseUrl = 'https://www.google.com/maps/embed/v1';

    // For a single anomaly, use the 'place' endpoint for a better marker.
    if (anomaliesWithLocation.length === 1) {
      const { lat, lng } = anomaliesWithLocation[0].location!;
      const params = new URLSearchParams({
        key: apiKey,
        q: `${lat},${lng}`,
        zoom: '17',
        maptype: 'satellite'
      });
      return `${baseUrl}/place?${params.toString()}`;
    }

    // For multiple anomalies, use the 'directions' endpoint.
    const params = new URLSearchParams({
        key: apiKey,
        maptype: 'satellite'
    });

    const origin = anomaliesWithLocation[0];
    const destination = anomaliesWithLocation[anomaliesWithLocation.length - 1];
    const waypoints = anomaliesWithLocation.slice(1, -1);

    params.append('origin', `${origin.location!.lat},${origin.location!.lng}`);
    params.append('destination', `${destination.location!.lat},${destination.location!.lng}`);
    
    if (waypoints.length > 0) {
        const waypointsString = waypoints.map(a => `${a.location!.lat},${a.location!.lng}`).join('|');
        params.append('waypoints', waypointsString);
    }
    
    return `${baseUrl}/directions?${params.toString()}`;

  }, [trip.anomalies]);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-2xl w-full max-w-4xl h-[90vh] animate-fade-in-up flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-[#1A4488]">
            Mapa de Anomalías - {trip.code}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl leading-none p-1">&times;</button>
        </div>
        
        <div className="flex-grow p-4">
          {mapUrl ? (
            <iframe
              src={mapUrl}
              className="w-full h-full border-0 rounded"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Mapa de anomalías para ${trip.code}`}
            ></iframe>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">No hay anomalías con geolocalización o la clave de API de Google Maps no está configurada.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapModal;