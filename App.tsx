
import React, { useState, useCallback, useEffect } from 'react';
import type { CabinTrip } from './types';
// FIX: Import DefectLevel enum to use its members instead of string literals for type safety.
import { DefectLevel } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import NewTripWizard from './components/NewTripWizard';
import TripDetail from './components/TripDetail';
import ConfirmationModal from './components/ConfirmationModal';

type View = 'dashboard' | 'wizard' | 'tripDetail';

const sampleTrip: CabinTrip = {
  id: 'sample-trip-1',
  code: 'VC_2024_09_07_sample',
  line: 'LAV Albacete-Alicante',
  track: 'Vía 1',
  date: '2024-09-07',
  technician: 'Javier Gómez',
  pkStart: '0.0',
  pkEnd: '168.5',
  aiSummary: `Informe de Viaje: LAV Albacete-Alicante

Resumen General:
Se han detectado tres anomalías durante la inspección. La más crítica es un estado deficiente apreciable en un túnel en el PK 125.4, clasificada como IAL, que requiere atención prioritaria. Las otras dos, una insuficiencia de balasto (IAL) y un mal estado puntual en el cerramiento (IL), también deben ser programadas para su corrección.

Anomalías de Nivel IAL:
1.  **Túnel - Deficiente estado apreciable (PK 125.4):** Esta es la anomalía de mayor gravedad. Se requiere una inspección detallada del túnel para evaluar la integridad estructural y planificar las reparaciones necesarias de inmediato.
2.  **Balasto - Insuficiencia de balasto (PK 45.2):** Se observó una falta de balasto en un tramo, lo que puede comprometer la estabilidad de la vía. Se recomienda una intervención para reponer el material.

Anomalías de Nivel IL:
1.  **Cerramientos - Mal estado puntual (PK 88.9):** Se ha identificado un punto en el cerramiento con daños. Aunque de menor gravedad, su reparación es necesaria para prevenir el acceso no autorizado a la zona de vías.`,
  anomalies: [
    {
      id: 'sample-anomaly-1',
      element: 'Balasto',
      defect: 'Insuficiencia de balasto',
      // FIX: Used DefectLevel.IAL enum member instead of string literal 'IAL' to match the 'DefectLevel' type.
      level: DefectLevel.IAL,
      pk: '45.2',
      notes: 'Se observa falta de balasto en el hombro exterior de la vía en una longitud aproximada de 50 metros.',
      location: { lat: 38.865, lng: -1.098 },
      photo: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAoHBwgHBgoICAgLCgoLDhgQDg0NDh0VFhEYIx8lJCIfIiEmKzcvJik0KSEiMEExNDk7Pj4+JS5ESUM8SDc9Pjv/2wBDAQoLCw4NDhwQEBw7KCIoOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozv/wAARCAFoAeADASIAAhEBAxEB/8QAGwABAAMBAQEBAAAAAAAAAAAAAAUGBwEDBAj/xABFEAABAwMCAwQFBgsGBgMAAAABAAIDBAURIQYSMQcTQVEiYXGBkRQXIzJSobHB0iQzNDVTcpTh8CRiY3OCorLxc5PS4vH/xAAaAQEAAgMBAAAAAAAAAAAAAAAABAUCAwYB/8QALhEBAAICAQIFAgYCAwAAAAAAAAECAxEEIRIxBRNBUWEiFHGRoYGxMsHwM+Hx/9oADAMBAAIRAxEAPwD7ihCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAh-8mj/4AAQSkZJRgABAQEASABIAAD/2wBDAAoHBwgHBgoICAgLCgoLDhgQDg0NDh0VFhEYIx8lJCIfIiEmKzcvJik0KSEiMEExNDk7Pj4+JS5ESUM8SDc9Pjv/2wBDAQoLCw4NDhwQEBw7KCIoOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozv/wAARCAFoAeADASIAAhEBAxEB/8QAGwABAAMBAQEBAAAAAAAAAAAAAAUGBwEDBAj/xABFEAABAwMCAwQFBgsGBgMAAAABAAIDBAURIQYSMQcTQVEiYXGBkRQXIzJSobHB0iQzNDVTcpTh8CRiY3OCorLxc5PS4vH/xAAaAQEAAgMBAAAAAAAAAAAAAAAABAUCAwYB/8QALhEBAAICAQIFAgYCAwAAAAAAAAECAxEEIRIxBRNBUWEiFHGRoYGxMsHwM+Hx/9oADAMBAAIRAxEAPwD7ihCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCEAhCE-8f+1c0l5QAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjQtMDktMDZUMTY6NTI6MTMtMDQ6MDAmg1HPAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIQ0LTA5LTA2VDE2OjUyOjEzLTA0OjAwHdy5EAAAAABJRU5ErkJggg=='
    },
    {
      id: 'sample-anomaly-2',
      element: 'Cerramientos',
      defect: 'Mal estado puntual',
      // FIX: Used DefectLevel.IL enum member instead of string literal 'IL' to match the 'DefectLevel' type.
      level: DefectLevel.IL,
      pk: '88.9',
      notes: 'Poste de cerramiento metálico derribado cerca de la subestación de Villena.',
      location: { lat: 38.631, lng: -0.865 },
      photo: ''
    },
    {
      id: 'sample-anomaly-3',
      element: 'Túneles',
      defect: 'Deficiente estado apreciable',
      // FIX: Used DefectLevel.IAL enum member instead of string literal 'IAL' to match the 'DefectLevel' type.
      level: DefectLevel.IAL,
      pk: '125.4',
      notes: 'Se aprecian filtraciones de agua y desprendimientos menores en la boca de salida del túnel de Novelda.',
      location: { lat: 38.385, lng: -0.762 },
      photo: ''
    }
  ]
};


const App: React.FC = () => {
  const [view, setView] = useState<View>('dashboard');
  
  // Initialize state from localStorage
  const [trips, setTrips] = useState<CabinTrip[]>(() => {
    try {
      const savedTrips = window.localStorage.getItem('cabinTrips');
      if (savedTrips) {
          const parsedTrips = JSON.parse(savedTrips);
          // Only return sample if localStorage is truly empty
          return parsedTrips.length > 0 ? parsedTrips : [sampleTrip];
      }
      return [sampleTrip]; // Load sample if no key exists
    } catch (error) {
      console.error("Could not load trips from localStorage", error);
      return [sampleTrip]; // Fallback to sample data
    }
  });

  const [editingTrip, setEditingTrip] = useState<CabinTrip | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<CabinTrip | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [tripToDelete, setTripToDelete] = useState<string | null>(null);
  const [wizardInitialStep, setWizardInitialStep] = useState(1);


  // Effect to save trips to localStorage whenever they change
  useEffect(() => {
    try {
      window.localStorage.setItem('cabinTrips', JSON.stringify(trips));
    } catch (error) {
      console.error("Could not save trips to localStorage", error);
    }
  }, [trips]);


  const handleSaveOrUpdateTrip = useCallback((tripData: Omit<CabinTrip, 'id' | 'code'> & { id?: string }) => {
    if (tripData.id) {
      const updatedTrip = { ...trips.find(t => t.id === tripData.id)!, ...tripData };
      setTrips(prevTrips => prevTrips.map(t => t.id === tripData.id ? updatedTrip : t));
    } else {
      const tripDate = new Date(tripData.date);
      const dateCode = `${tripDate.getFullYear()}_${(tripDate.getMonth() + 1).toString().padStart(2, '0')}_${tripDate.getDate().toString().padStart(2, '0')}`;
      const newCabinTrip: CabinTrip = {
        ...(tripData as Omit<CabinTrip, 'id' | 'code'>),
        id: new Date().toISOString(),
        code: `VC_${dateCode}_${Math.random().toString(36).substring(2, 7)}`
      };
      setTrips(prevTrips => [newCabinTrip, ...prevTrips]);
    }
    setView('dashboard');
    setEditingTrip(null);
  }, [trips]);
  
  const handleStartNewTrip = useCallback(() => {
    setEditingTrip(null);
    setWizardInitialStep(1);
    setView('wizard');
  }, []);

  const handleStartEditTrip = useCallback((tripId: string) => {
      const tripToEdit = trips.find(t => t.id === tripId);
      if (tripToEdit) {
          setEditingTrip(tripToEdit);
          setWizardInitialStep(1);
          setView('wizard');
      }
  }, [trips]);
  
  const handleStartAddAnomaly = useCallback((tripId: string) => {
    const tripToEdit = trips.find(t => t.id === tripId);
    if (tripToEdit) {
      setEditingTrip(tripToEdit);
      setWizardInitialStep(2);
      setView('wizard');
    }
  }, [trips]);

  const handleDeleteTrip = useCallback((tripId: string) => {
      setTripToDelete(tripId);
      setIsDeleteModalOpen(true);
  }, []);

  const confirmDeleteTrip = useCallback(() => {
    if (tripToDelete) {
        setTrips(prevTrips => prevTrips.filter(t => t.id !== tripToDelete));
    }
    setTripToDelete(null);
    setIsDeleteModalOpen(false);
  }, [tripToDelete]);

  const cancelDeleteTrip = useCallback(() => {
    setTripToDelete(null);
    setIsDeleteModalOpen(false);
  }, []);

  const handleViewTripDetails = useCallback((tripId: string) => {
    const tripToShow = trips.find(t => t.id === tripId);
    if (tripToShow) {
        setSelectedTrip(tripToShow);
        setView('tripDetail');
    }
  }, [trips]);
  
  const handleBackToDashboard = useCallback(() => {
    setSelectedTrip(null);
    setView('dashboard');
  }, []);

  const handleCancelWizard = useCallback(() => {
    setView('dashboard');
    setEditingTrip(null);
  }, []);
  
  const renderContent = () => {
    switch(view) {
        case 'dashboard':
            return <Dashboard trips={trips} onStartNewTrip={handleStartNewTrip} onEditTrip={handleStartEditTrip} onDeleteTrip={handleDeleteTrip} onViewTrip={handleViewTripDetails} onAddAnomaly={handleStartAddAnomaly} />;
        case 'wizard':
            return <NewTripWizard onSave={handleSaveOrUpdateTrip} onCancel={handleCancelWizard} editingTrip={editingTrip} initialStep={wizardInitialStep} />;
        case 'tripDetail':
            return selectedTrip && <TripDetail trip={selectedTrip} onBack={handleBackToDashboard} />;
        default:
            return <Dashboard trips={trips} onStartNewTrip={handleStartNewTrip} onEditTrip={handleStartEditTrip} onDeleteTrip={handleDeleteTrip} onViewTrip={handleViewTripDetails} onAddAnomaly={handleStartAddAnomaly} />;
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#333333]">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        {renderContent()}
      </main>
      <Footer />
       <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={cancelDeleteTrip}
        onConfirm={confirmDeleteTrip}
        title="Confirmar Eliminación"
        message="¿Estás seguro de que quieres eliminar este viaje? Esta acción no se puede deshacer."
      />
    </div>
  );
};

export default App;
