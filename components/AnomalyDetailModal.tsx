
import React from 'react';
import type { Anomaly } from '../types';

interface AnomalyDetailModalProps {
  anomaly: Anomaly;
  onClose: () => void;
}

const AnomalyDetailModal: React.FC<AnomalyDetailModalProps> = ({ anomaly, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-2xl animate-fade-in-up max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-[#1A4488] mb-4">Detalle de la Anomalía</h2>
            <button onClick={onClose} className="p-2 -mt-2 -mr-2 text-gray-500 hover:text-gray-800">&times;</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
                <h4 className="font-semibold text-gray-500 text-sm">Elemento:</h4>
                <p className="text-[#333333] font-medium">{anomaly.element}</p>
            </div>
            <div>
                <h4 className="font-semibold text-gray-500 text-sm">Defecto:</h4>
                <p className="text-[#333333] font-medium">{anomaly.defect}</p>
            </div>
            <div>
                <h4 className="font-semibold text-gray-500 text-sm">Nivel de Gravedad:</h4>
                <p className="text-[#333333] font-medium">{anomaly.level}</p>
            </div>
            <div>
                <h4 className="font-semibold text-gray-500 text-sm">Punto Kilométrico (PK):</h4>
                <p className="text-[#333333] font-medium">{anomaly.pk}</p>
            </div>
            {anomaly.location && (
                <div className="md:col-span-2">
                    <h4 className="font-semibold text-gray-500 text-sm">Coordenadas GPS:</h4>
                    <p className="text-[#333333] font-medium">{anomaly.location.lat.toFixed(6)}, {anomaly.location.lng.toFixed(6)}</p>
                </div>
            )}
        </div>
        
        {anomaly.notes && (
            <div className="mb-6">
                <h4 className="font-semibold text-gray-500 text-sm">Notas Adicionales:</h4>
                <p className="text-[#333333] bg-gray-50 p-3 rounded-md border">{anomaly.notes}</p>
            </div>
        )}

        {anomaly.photo && (
            <div>
                <h4 className="font-semibold text-gray-500 text-sm mb-2">Fotografía Adjunta:</h4>
                <img src={anomaly.photo} alt="Fotografía de la anomalía" className="rounded-lg max-w-full h-auto border shadow-sm" />
            </div>
        )}
        
        <div className="mt-8 flex justify-end">
            <button onClick={onClose} className="px-6 py-2 bg-[#1A4488] text-white rounded-md hover:bg-blue-900 transition">
              Cerrar
            </button>
        </div>
      </div>
    </div>
  );
};

export default AnomalyDetailModal;
