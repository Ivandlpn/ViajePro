
import React, { useState } from 'react';
import type { CabinTrip } from '../types';

interface TripDetailsFormProps {
  initialData: Partial<CabinTrip>;
  onSubmit: (details: Partial<CabinTrip>) => void;
  onCancel: () => void;
}

const InputField: React.FC<{
  label: string;
  name: string;
  value: string | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
  error?: string;
}> = ({ label, name, value, onChange, placeholder, type = "text", error }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-[#333333] mb-1">{label}</label>
    <input
      type={type}
      id={name}
      name={name}
      value={value || ''}
      onChange={onChange}
      placeholder={placeholder}
      required
      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none bg-white ${
        error
          ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
          : 'border-slate-300 focus:ring-[#1A4488] focus:border-[#1A4488]'
      }`}
    />
  </div>
);

const SelectField: React.FC<{
    label: string;
    name: string;
    value: string | undefined;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: string[];
}> = ({ label, name, value, onChange, options }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-[#333333] mb-1">{label}</label>
        <select
            id={name}
            name={name}
            value={value || ''}
            onChange={onChange}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1A4488] focus:border-[#1A4488]"
        >
            {options.map(option => <option key={option} value={option}>{option}</option>)}
        </select>
    </div>
);


const TripDetailsForm: React.FC<TripDetailsFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [details, setDetails] = useState(initialData);
  const [errors, setErrors] = useState<{ pkStart?: string; pkEnd?: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDetails(prev => ({ ...prev, [name]: value }));
     if (errors[name as keyof typeof errors]) {
        setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };
  
  const validate = (): boolean => {
    const newErrors: { pkStart?: string; pkEnd?: string } = {};
    const pkStartValue = details.pkStart || '';
    const pkEndValue = details.pkEnd || '';
    
    const start = parseFloat(pkStartValue);
    const end = parseFloat(pkEndValue);

    if (pkStartValue.trim() === '' || isNaN(start)) {
        newErrors.pkStart = 'Debe ser un valor numérico válido.';
    }

    if (pkEndValue.trim() === '' || isNaN(end)) {
        newErrors.pkEnd = 'Debe ser un valor numérico válido.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(details);
    }
  };

  const lineOptions = ['L40', 'L42', 'L48', 'L46'];
  // Dynamically add the current trip's line to the options if it's not already there.
  // This ensures that custom lines from sample data are selectable when editing.
  if (initialData.line && !lineOptions.includes(initialData.line)) {
    lineOptions.unshift(initialData.line);
  }

  const trackOptions = ['Vía 1', 'Vía 2', 'Ambas'];
  
  return (
    <form onSubmit={handleSubmit}>
      <h3 className="text-xl font-semibold mb-6 text-center text-[#1A4488]">Información del Viaje</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <SelectField label="Línea" name="line" value={details.line} onChange={handleChange} options={lineOptions} />
        <SelectField label="Vía" name="track" value={details.track} onChange={handleChange} options={trackOptions} />
        <InputField label="Fecha" name="date" value={details.date} onChange={handleChange} placeholder="" type="date" />
        <InputField label="Técnico" name="technician" value={details.technician} onChange={handleChange} placeholder="Nombre del técnico" />
        <div>
          <InputField 
            label="PK Inicio" 
            name="pkStart" 
            value={details.pkStart} 
            onChange={handleChange} 
            placeholder="Ej: 0.0" 
            error={errors.pkStart}
          />
          {errors.pkStart && <p className="text-red-600 text-xs mt-1">{errors.pkStart}</p>}
        </div>
        <div>
          <InputField 
            label="PK Fin" 
            name="pkEnd" 
            value={details.pkEnd} 
            onChange={handleChange} 
            placeholder="Ej: 199.176" 
            error={errors.pkEnd}
          />
          {errors.pkEnd && <p className="text-red-600 text-xs mt-1">{errors.pkEnd}</p>}
        </div>
      </div>
      <div className="mt-8 flex justify-end space-x-4">
        <button type="button" onClick={onCancel} className="px-6 py-2 border border-gray-300 rounded-md text-[#333333] hover:bg-gray-100 transition">
          Cancelar
        </button>
        <button type="submit" className="px-6 py-2 bg-[#1A4488] text-white rounded-md hover:bg-blue-900 transition">
          Siguiente &rarr;
        </button>
      </div>
    </form>
  );
};

export default TripDetailsForm;