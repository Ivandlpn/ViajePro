
import React, { useState } from 'react';
import type { CabinTrip, Anomaly } from '../types';
import AnomalyDetailModal from './AnomalyDetailModal';
import { generateReportHTML } from '../utils/reportGenerator';

interface TripDetailProps {
  trip: CabinTrip;
  onBack: () => void;
}

const PrintIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
    </svg>
);


const TripDetail: React.FC<TripDetailProps> = ({ trip, onBack }) => {
  const [selectedAnomaly, setSelectedAnomaly] = useState<Anomaly | null>(null);

  const handleGenerateReport = () => {
    const reportHtml = generateReportHTML(trip);
    const reportWindow = window.open('', '_blank');
    if (reportWindow) {
      reportWindow.document.write(reportHtml);
      reportWindow.document.close();
      // The print dialog is now triggered by a button within the report HTML itself.
    } else {
      alert('No se pudo abrir la ventana del informe. Por favor, deshabilite el bloqueador de ventanas emergentes.');
    }
  };

  return (
    <div className="animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <button onClick={onBack} className="px-4 py-2 border border-gray-300 rounded-md text-[#333333] hover:bg-gray-100 transition whitespace-nowrap">
          &larr; Volver al Panel
        </button>
        <button onClick={handleGenerateReport} className="flex items-center justify-center bg-[#1A4488] text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-900 transition duration-300 shadow-md w-full sm:w-auto">
            <PrintIcon />
            Generar Informe
        </button>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-3xl font-bold text-[#1A4488] mb-2">{trip.line} <span className="text-xl font-semibold text-gray-600">({trip.track})</span></h2>
        <p className="text-sm text-gray-500 mb-6">{trip.code}</p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 p-6 bg-gray-50 rounded-lg mb-8 border border-gray-200">
            <div>
                <h4 className="font-semibold text-gray-500 text-sm">Fecha:</h4>
                {/* FIX: Corrected typo from `toLocaleDate-String()` to `toLocaleDateString()` to prevent a runtime error. */}
                <p className="text-[#333333] font-medium">{new Date(trip.date).toLocaleDateString()}</p>
            </div>
            <div>
                <h4 className="font-semibold text-gray-500 text-sm">Técnico:</h4>
                <p className="text-[#333333] font-medium">{trip.technician}</p>
            </div>
            <div>
                <h4 className="font-semibold text-gray-500 text-sm">Tramo (PK):</h4>
                <p className="text-[#333333] font-medium">{trip.pkStart} - {trip.pkEnd}</p>
            </div>
        </div>

        <h3 className="text-2xl font-semibold mb-4 text-[#1A4488]">Anomalías Registradas ({trip.anomalies.length})</h3>
        <div className="border rounded-lg max-h-96 overflow-y-auto">
            {trip.anomalies.length > 0 ? (
                <ul className="divide-y divide-slate-200">
                    {trip.anomalies.map(anomaly => (
                      <li key={anomaly.id} onClick={() => setSelectedAnomaly(anomaly)} className="p-4 hover:bg-gray-50 cursor-pointer transition">
                        <p className="font-semibold">{anomaly.defect} <span className="text-gray-500 font-normal">({anomaly.element})</span></p>
                        <p className="text-sm text-gray-600">PK: {anomaly.pk} - Nivel: <span className="font-semibold">{anomaly.level}</span></p>
                      </li>
                    ))}
                </ul>
            ) : <p className="text-gray-500 text-center p-10">No se registraron anomalías en este viaje.</p>}
        </div>
      </div>
      
      {selectedAnomaly && <AnomalyDetailModal anomaly={selectedAnomaly} onClose={() => setSelectedAnomaly(null)} />}
    </div>
  );
};

export default TripDetail;
