
import React, { useMemo } from 'react';

interface LiveLocationMapProps {
  location: { lat: number; lng: number } | null;
  error: string | null;
}

const Spinner: React.FC = () => (
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1A4488]"></div>
);

const LiveLocationMap: React.FC<LiveLocationMapProps> = ({ location, error }) => {
    const mapUrl = useMemo(() => {
        const apiKey = process.env.API_KEY;
        if (!apiKey || !location) {
            return null;
        }

        // A custom train icon that matches the app's branding
        const trainIconUrl = 'https://cdn.mapmarker.io/api/v1/fa/train?size=40&color=FFFFFF&background=1A4488&hoffset=0&voffset=0';

        const params = new URLSearchParams({
            center: `${location.lat},${location.lng}`,
            zoom: '18',
            size: '640x480', // A high-res size that scales down well
            maptype: 'satellite',
            markers: `icon:${trainIconUrl}|${location.lat},${location.lng}`,
            key: apiKey,
        });

        return `https://maps.googleapis.com/maps/api/staticmap?${params.toString()}`;

    }, [location]);

    return (
        <div className="bg-gray-200 rounded-lg h-64 md:h-full flex items-center justify-center overflow-hidden border border-gray-300 shadow-inner">
            {error && (
                <div className="text-center p-4">
                    <p className="font-semibold text-red-600">Error de Ubicación</p>
                    <p className="text-sm text-gray-700">{error}</p>
                </div>
            )}
            {!error && !location && (
                <div className="text-center">
                    <Spinner />
                    <p className="mt-3 text-sm font-medium text-gray-600">Obteniendo ubicación actual...</p>
                </div>
            )}
            {!error && location && mapUrl && (
                <img 
                    src={mapUrl} 
                    alt="Mapa en vivo de la ubicación del tren" 
                    className="w-full h-full object-cover"
                />
            )}
             {!error && location && !mapUrl && (
                <div className="text-center p-4">
                    <p className="font-semibold text-red-600">Error de Configuración</p>
                    <p className="text-sm text-gray-700">La clave de API de Google Maps no está configurada.</p>
                </div>
             )}
        </div>
    );
};

export default LiveLocationMap;