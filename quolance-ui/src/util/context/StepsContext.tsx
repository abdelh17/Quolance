'use client';

import React, { createContext, useContext, useState } from 'react';

interface FormData {
  projectCategory: string;
  projectTitle: string;
  projectDescription: string;
  isRemote: boolean;
  location: string;
  tags: string[];
  priceRange: string;
  experienceLevel: string;
  expectedDeliveryTime: string;
  deliveryDate: string; // ISO date format (e.g., "2024-11-09")
}

const DEFAULT_FORM_DATA: FormData = {
  projectCategory: '',
  projectTitle: '',
  projectDescription: '',
  isRemote: false,
  location: '',
  tags: [],
  priceRange: '',
  experienceLevel: '',
  expectedDeliveryTime: '',
  deliveryDate: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD
};

interface StepsContextProps {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  formData: FormData;
  setFormData: (data: Partial<FormData>) => void;
  resetSteps: () => void;
}

const StepsContext = createContext<StepsContextProps | undefined>(undefined);

export const StepsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formData, setFormData] = useState<FormData>(DEFAULT_FORM_DATA);

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const resetSteps = () => {
    setCurrentStep(0);
    setFormData(DEFAULT_FORM_DATA);
  };

  return (
    <StepsContext.Provider value={{ 
      currentStep, 
      setCurrentStep, 
      formData, 
      setFormData: updateFormData,
      resetSteps 
    }}>
      {children}
    </StepsContext.Provider>
  );
};

export const useSteps = () => {
  const context = useContext(StepsContext);
  if (!context) {
    throw new Error('useSteps must be used within a StepsProvider');
  }
  return context;
};