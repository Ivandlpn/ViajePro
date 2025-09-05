import React, { useState, useEffect, useRef } from 'react';
import { DEFECT_CATALOG } from '../constants';
import type { Anomaly, Defect } from '../types';

interface AnomalyFormProps {
  onSave: (anomaly: Omit<Anomaly, 'id'> & { id?: string }) => void;
  onClose: () => void;
  editingAnomaly?: Anomaly | null;
}

const XIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const getInitialAnomaly = (editingAnomaly?: Anomaly | null): Omit<Anomaly, 'id'> & { id?: string } => {
  if (editingAnomaly) {
    return { ...editingAnomaly };
  }
  
  const defaultElement = DEFECT_CATALOG[0]?.element || '';
  const defaultDefect = DEFECT_CATALOG[0]?.defects[0];

  return {
    element: defaultElement,
    defect: defaultDefect?.name || '',
    level: defaultDefect?.level,
    pk: '',
    notes: '',
    photo: '',
    location: undefined,
  };
};

const AnomalyForm: React.FC<AnomalyFormProps> = ({ onSave, onClose, editingAnomaly }) => {
  const [anomaly, setAnomaly] = useState(() => getInitialAnomaly(editingAnomaly));
  const [selectedElement, setSelectedElement] = useState<string>(anomaly.element);
  const [availableDefects, setAvailableDefects] = useState<Defect[]>([]);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleGetLocation = () => {
    setIsGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setAnomaly(prev => ({
          ...prev,
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
        }));
        setIsGettingLocation(false);
      }, (error: GeolocationPositionError) => {
        console.error("Error getting location:", error.message);
        alert(`No se pudo obtener la ubicación: ${error.message}. Por favor, compruebe los permisos de su navegador.`);
        setIsGettingLocation(false);
      });
    } else {
      alert("La geolocalización no es compatible con este navegador.");
      setIsGettingLocation(false);
    }
  };

  useEffect(() => {
    // Automatically fetch location for new anomalies on component mount.
    if (!editingAnomaly) {
      handleGetLocation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty array ensures this effect runs only once on mount.


  useEffect(() => {
    const elementData = DEFECT_CATALOG.find(e => e.element === selectedElement);
    if (elementData) {
      setAvailableDefects(elementData.defects);
      
      const isCurrentDefectInNewList = elementData.defects.some(d => d.name === anomaly.defect);

      if (!isCurrentDefectInNewList) {
          const defaultDefect = elementData.defects[0];
          if (defaultDefect) {
            setAnomaly(prev => ({
                ...prev,
                element: selectedElement,
                defect: defaultDefect.name,
                level: defaultDefect.level,
            }));
          }
      } else {
         setAnomaly(prev => ({ ...prev, element: selectedElement }));
      }
    }
  }, [selectedElement, anomaly.defect]);

  const handleElementChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedElement(e.target.value);
  };
  
  const handleDefectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const defectName = e.target.value;
    const defectData = availableDefects.find(d => d.name === defectName);
    if(defectData) {
        setAnomaly(prev => ({ ...prev, defect: defectData.name, level: defectData.level }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAnomaly(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAnomaly(prev => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  
  const handleClearPhoto = () => {
    setAnomaly(prev => ({ ...prev, photo: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleClearLocation = () => {
    setAnomaly(prev => ({ ...prev, location: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(anomaly.defect) {
        onSave(anomaly);
    } else {
        alert("Por favor, seleccione un defecto.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-lg animate-fade-in-up max-h-full overflow-y-auto">
        <h2 className="text-2xl font-bold text-[#1A4488] mb-6">
            {editingAnomaly ? 'Editar Anomalía' : 'Registrar Nueva Anomalía'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#333333]">Elemento</label>
            <select value={selectedElement} onChange={handleElementChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-[#1A4488] focus:border-[#1A4488] sm:text-sm rounded-md">
              {DEFECT_CATALOG.map(el => <option key={el.element} value={el.element}>{el.element}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#333333]">Defecto</label>
            <select name="defect" value={anomaly.defect} onChange={handleDefectChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-[#1A4488] focus:border-[#1A4488] sm:text-sm rounded-md">
              {availableDefects.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#333333]">PK (Punto Kilométrico)</label>
            <input type="text" name="pk" value={anomaly.pk} onChange={handleChange} required className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1A4488] focus:border-[#1A4488]" />
          </div>
           <div>
            <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-[#333333]">Ubicación</label>
                <div className="flex items-center space-x-2">
                   {anomaly.location && (
                      <button type="button" onClick={handleClearLocation} className="p-1.5 text-red-600 hover:bg-red-100 rounded-full" aria-label="Eliminar ubicación" title="Eliminar ubicación">
                          <XIcon />
                      </button>
                   )}
                    <button type="button" onClick={handleGetLocation} disabled={isGettingLocation} className="text-sm text-[#1A4488] hover:underline disabled:text-gray-400 disabled:cursor-not-allowed">
                        {isGettingLocation ? 'Obteniendo...' : 'Actualizar'}
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                  <input type="text" placeholder="Latitud" value={anomaly.location?.lat.toFixed(6) || ''} readOnly className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm bg-white text-gray-700 cursor-default" />
              </div>
              <div>
                  <input type="text" placeholder="Longitud" value={anomaly.location?.lng.toFixed(6) || ''} readOnly className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm bg-white text-gray-700 cursor-default" />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#333333]">Notas Adicionales</label>
            <textarea name="notes" value={anomaly.notes} onChange={handleChange} rows={3} className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1A4488] focus:border-[#1A4488]"></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#333333] mb-2">Fotografía (Opcional)</label>
            {anomaly.photo ? (
                <div className="relative w-32 h-32">
                    <img src={anomaly.photo} alt="Vista previa de la anomalía" className="w-full h-full object-cover rounded-md border" />
                    <button
                        type="button"
                        onClick={handleClearPhoto}
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 shadow-md hover:bg-red-700"
                        aria-label="Eliminar foto"
                    >
                        <XIcon />
                    </button>
                </div>
            ) : (
                <div className="flex items-center space-x-4">
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-[#333333] hover:bg-gray-50 transition">Subir Archivo</button>
                    <button type="button" onClick={() => cameraInputRef.current?.click()} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-[#333333] hover:bg-gray-50 transition">Tomar Foto</button>
                </div>
            )}
            <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                ref={fileInputRef}
                className="hidden"
            />
            <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhotoChange}
                ref={cameraInputRef}
                className="hidden"
            />
          </div>
          <div className="pt-4 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-[#333333] hover:bg-gray-100 transition">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-[#1A4488] text-white rounded-md hover:bg-blue-900 transition">Guardar Anomalía</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AnomalyForm;