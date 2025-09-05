
import React, { useState } from 'react';
import type { Anomaly } from '../types';
import AnomalyForm from './AnomalyForm';

interface AnomalyLoggerProps {
  initialAnomalies: Anomaly[];
  onUpdate: (anomalies: Anomaly[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const PlusIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
);

const TrashIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
);

const PencilIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
    </svg>
);


const AnomalyLogger: React.FC<AnomalyLoggerProps> = ({ initialAnomalies, onUpdate, onNext, onBack }) => {
  const [anomalies, setAnomalies] = useState<Anomaly[]>(initialAnomalies);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnomaly, setEditingAnomaly] = useState<Anomaly | null>(null);

  const handleOpenModalForNew = () => {
    setEditingAnomaly(null);
    setIsModalOpen(true);
  };

  const handleOpenModalForEdit = (anomaly: Anomaly) => {
    setEditingAnomaly(anomaly);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAnomaly(null);
  };

  const handleSaveAnomaly = (anomalyData: Omit<Anomaly, 'id'> & { id?: string }) => {
    let updatedAnomalies;
    if (anomalyData.id) {
      // Update existing anomaly
      updatedAnomalies = anomalies.map(a => a.id === anomalyData.id ? { ...a, ...anomalyData } as Anomaly : a);
    } else {
      // Add new anomaly
      const anomalyWithId = { ...anomalyData, id: new Date().toISOString() };
      updatedAnomalies = [...anomalies, anomalyWithId];
    }
    setAnomalies(updatedAnomalies);
    onUpdate(updatedAnomalies);
    handleCloseModal();
  };

  const handleDeleteAnomaly = (id: string) => {
    const updatedAnomalies = anomalies.filter(a => a.id !== id);
    setAnomalies(updatedAnomalies);
    onUpdate(updatedAnomalies);
  };
  
  return (
    <div>
      <div className="flex flex-col mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            <h3 className="text-xl font-semibold text-[#1A4488]">Anomalías Detectadas</h3>
            <button onClick={handleOpenModalForNew} className="flex items-center bg-[#1A4488] text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-900 transition duration-300 shadow-md w-full sm:w-auto justify-center">
                <PlusIcon />
                Añadir Anomalía
            </button>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex-grow min-h-[300px]">
            {anomalies.length === 0 ? (
              <p className="text-center text-gray-500 pt-16">No se han registrado anomalías.</p>
            ) : (
              <ul className="space-y-3">
                {anomalies.map(anomaly => (
                  <li key={anomaly.id} className="bg-white p-3 rounded-md shadow-sm flex justify-between items-center border border-gray-100">
                    <div className="flex-grow">
                      <p className="font-semibold text-[#333333]">{anomaly.defect} <span className="font-normal text-gray-500">({anomaly.element})</span></p>
                      <p className="text-sm text-gray-600">PK: {anomaly.pk} - Nivel: <span className="font-semibold">{anomaly.level}</span></p>
                      {anomaly.location && (
                        <p className="text-xs text-gray-500">Coords: {anomaly.location.lat.toFixed(5)}, {anomaly.location.lng.toFixed(5)}</p>
                      )}
                    </div>
                    <div className="flex items-center flex-shrink-0">
                        <button onClick={() => handleOpenModalForEdit(anomaly)} className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition">
                            <PencilIcon />
                        </button>
                        <button onClick={() => handleDeleteAnomaly(anomaly.id)} className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition">
                            <TrashIcon />
                        </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
      </div>

      {isModalOpen && <AnomalyForm onSave={handleSaveAnomaly} onClose={handleCloseModal} editingAnomaly={editingAnomaly} />}
      
      <div className="mt-8 flex justify-between">
        <button onClick={onBack} className="px-6 py-2 border border-gray-300 rounded-md text-[#333333] hover:bg-gray-100 transition">
          &larr; Atrás
        </button>
        <button onClick={onNext} className="px-6 py-2 bg-[#1A4488] text-white rounded-md hover:bg-blue-900 transition">
          Siguiente &rarr;
        </button>
      </div>
    </div>
  );
};

export default AnomalyLogger;
