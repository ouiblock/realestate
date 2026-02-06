import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ImmoEstimationState, PropertyData, Sources, Ponderations, Ajustements } from '../types';
import { calculateImmoPrice } from '../calculation/calculatePrice';

// Valeurs par défaut
const defaultPropertyData: PropertyData = {
  estimationName: '',
  date: new Date().toISOString().split('T')[0],
  typeBien: 'Appartement',
  adresse: '',
  ville: '',
  codePostal: '',
  surface: 50,
  pieces: 3,
  chambres: 2,
  etage: 2,
  ascenseur: false,
  anneeConstruction: 2000
};

const defaultSources: Sources = {
  dvf: [],
  annonces: [],
  estimations: []
};

const defaultPonderations: Ponderations = {
  dvf: 50,
  annonces: 30,
  estimations: 20
};

const defaultAjustements: Ajustements = {
  etatGeneral: 'Bon',
  dpe: 'D',
  exposition: 'Sud',
  balcon: false,
  terrasse: false,
  jardin: false,
  parking: false,
  cave: false,
  vueDegagee: false,
  calme: false,
  proximiteTransports: false,
  proximiteCommerce: false,
  travauxRecents: false,
  coproprieteEntretenue: false
};

// Génération d'ID unique
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const useImmoStore = create<ImmoEstimationState>()(
  persist(
    (set, get) => ({
      propertyData: defaultPropertyData,
      sources: defaultSources,
      ponderations: defaultPonderations,
      ajustements: defaultAjustements,
      calculationResult: null,

      // Property Data
      setPropertyData: (data) => {
        set((state) => ({
          propertyData: { ...state.propertyData, ...data }
        }));
      },

      // DVF
      addDVF: (dvf) => {
        set((state) => ({
          sources: {
            ...state.sources,
            dvf: [...state.sources.dvf, { ...dvf, id: generateId() }]
          }
        }));
      },

      updateDVF: (id, dvf) => {
        set((state) => ({
          sources: {
            ...state.sources,
            dvf: state.sources.dvf.map((d) =>
              d.id === id ? { ...d, ...dvf } : d
            )
          }
        }));
      },

      removeDVF: (id) => {
        set((state) => ({
          sources: {
            ...state.sources,
            dvf: state.sources.dvf.filter((d) => d.id !== id)
          }
        }));
      },

      // Annonces
      addAnnonce: (annonce) => {
        set((state) => ({
          sources: {
            ...state.sources,
            annonces: [...state.sources.annonces, { ...annonce, id: generateId() }]
          }
        }));
      },

      updateAnnonce: (id, annonce) => {
        set((state) => ({
          sources: {
            ...state.sources,
            annonces: state.sources.annonces.map((a) =>
              a.id === id ? { ...a, ...annonce } : a
            )
          }
        }));
      },

      removeAnnonce: (id) => {
        set((state) => ({
          sources: {
            ...state.sources,
            annonces: state.sources.annonces.filter((a) => a.id !== id)
          }
        }));
      },

      // Estimations
      addEstimation: (estimation) => {
        set((state) => ({
          sources: {
            ...state.sources,
            estimations: [...state.sources.estimations, { ...estimation, id: generateId() }]
          }
        }));
      },

      updateEstimation: (id, estimation) => {
        set((state) => ({
          sources: {
            ...state.sources,
            estimations: state.sources.estimations.map((e) =>
              e.id === id ? { ...e, ...estimation } : e
            )
          }
        }));
      },

      removeEstimation: (id) => {
        set((state) => ({
          sources: {
            ...state.sources,
            estimations: state.sources.estimations.filter((e) => e.id !== id)
          }
        }));
      },

      // Pondérations
      setPonderations: (ponderations) => {
        set((state) => ({
          ponderations: { ...state.ponderations, ...ponderations }
        }));
      },

      // Ajustements
      setAjustements: (ajustements) => {
        set((state) => ({
          ajustements: { ...state.ajustements, ...ajustements }
        }));
      },

      // Calcul
      calculate: () => {
        const state = get();
        try {
          const result = calculateImmoPrice(
            state.propertyData,
            state.sources,
            state.ponderations,
            state.ajustements
          );
          set({ calculationResult: result });
        } catch (error) {
          console.error('Erreur de calcul:', error);
        }
      },

      // Reset
      reset: () => {
        set({
          propertyData: defaultPropertyData,
          sources: defaultSources,
          ponderations: defaultPonderations,
          ajustements: defaultAjustements,
          calculationResult: null
        });
      }
    }),
    {
      name: 'jepartageimmo-estimation-storage',
    }
  )
);
