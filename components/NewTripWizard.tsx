
import React, { useState } from 'react';
import type { Anomaly, CabinTrip } from '../types';
import TripDetailsForm from './TripDetailsForm';
import AnomalyLogger from './AnomalyLogger';
import TripSummary from './TripSummary';

interface NewTripWizardProps {
  onSave: (tripData: Omit<CabinTrip, 'id' | 'code'> & { id?: string }) => void;
  onCancel: () => void;
  editingTrip: CabinTrip | null;
  initialStep?: number;
}

// FIX: Changed return type to CabinTrip and added a 'code' property to the initial data object
// to ensure the tripData state has a consistent shape, resolving a TypeScript error in handleSave.
const getInitialTripData = (editingTrip: CabinTrip | null): CabinTrip => {
    if (editingTrip) {
        return { ...editingTrip };
    }
    return {
        id: '',
        code: '',
        line: 'L40',
        track: 'Vía 1',
        date: new Date().toISOString().split('T')[0],
        technician: '',
        pkStart: '',
        pkEnd: '',
        anomalies: [],
    };
};

const NewTripWizard: React.FC<NewTripWizardProps> = ({ onSave, onCancel, editingTrip, initialStep = 1 }) => {
  const [step, setStep] = useState(initialStep);
  const [tripData, setTripData] = useState(getInitialTripData(editingTrip));

  const handleDetailsSubmit = (details: Partial<CabinTrip>) => {
    setTripData(prev => ({ ...prev, ...details }));
    setStep(2);
  };

  const handleAnomaliesUpdate = (anomalies: Anomaly[]) => {
    setTripData(prev => ({ ...prev, anomalies }));
  };
  
  const handleAISummaryUpdate = (summary: string) => {
    setTripData(prev => ({ ...prev, aiSummary: summary }));
  };
  
  const handleSave = () => {
      const { code, ...dataToSave } = tripData;
      onSave(dataToSave);
  }

  const steps = [
    { number: 1, title: 'Detalles del Viaje' },
    { number: 2, title: 'Registro de Anomalías' },
    { number: 3, title: 'Resumen y Finalización' },
  ];

  return (
    <div className="bg-white p-4 sm:p-8 rounded-xl shadow-lg animate-fade-in-up w-full max-w-4xl mx-auto border border-gray-100">
        <div className="mb-8">
            <h2 className="text-2xl font-bold text-center mb-2 text-[#1A4488]">
              {editingTrip ? 'Editar Viaje' : 'Crear Nuevo Viaje'}
            </h2>
            <div className="flex items-center justify-center">
                {steps.map((s, index) => (
                    <React.Fragment key={s.number}>
                        <div className="flex items-center">
                            <div className={`rounded-full h-10 w-10 flex items-center justify-center font-bold text-white ${step >= s.number ? 'bg-[#1A4488]' : 'bg-slate-300'}`}>
                                {s.number}
                            </div>
                            <div className={`ml-4 text-sm font-semibold hidden sm:block ${step >= s.number ? 'text-[#1A4488]' : 'text-slate-500'}`}>{s.title}</div>
                        </div>
                        {index < steps.length - 1 && <div className={`flex-auto border-t-2 transition duration-500 ease-in-out mx-4 ${step > s.number ? 'border-[#1A4488]' : 'border-slate-300'}`}></div>}
                    </React.Fragment>
                ))}
            </div>
        </div>

      {step === 1 && <TripDetailsForm initialData={tripData} onSubmit={handleDetailsSubmit} onCancel={onCancel} />}
      {step === 2 && <AnomalyLogger initialAnomalies={tripData.anomalies} onUpdate={handleAnomaliesUpdate} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
      {step === 3 && <TripSummary tripData={tripData} onSave={handleSave} onBack={() => setStep(2)} onAISummaryUpdate={handleAISummaryUpdate} />}
    </div>
  );
};

export default NewTripWizard;
