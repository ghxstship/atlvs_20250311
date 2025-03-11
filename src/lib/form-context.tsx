import React, { createContext, useContext } from 'react';
import { FormProvider, UseFormReturn } from 'react-hook-form';

interface FormContextValue {
  form: UseFormReturn<any>;
}

const FormContext = createContext<FormContextValue | null>(null);

export function useFormContext() {
  const context = useContext(FormContext);
  // Make the context optional to support standalone usage
  return context;
}

interface FormWrapperProps {
  form: UseFormReturn<any>;
  children: React.ReactNode;
}

export function FormWrapper({ form, children }: FormWrapperProps) {
  return (
    <FormContext.Provider value={{ form }}>
      <FormProvider {...form}>
        {children}
      </FormProvider>
    </FormContext.Provider>
  );
}