'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, Loader2 } from 'lucide-react';

interface SectionLoaderProps {
  title: string;
  subtitle?: string;
  steps: string[];
  duration?: number; // Durée totale en millisecondes
}

const SectionLoader: React.FC<SectionLoaderProps> = ({ 
  title, 
  subtitle, 
  steps, 
  duration = 8000 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    const stepDuration = duration / steps.length;
    
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        const nextStep = prev + 1;
        
        // Marquer l'étape précédente comme complétée
        if (prev < steps.length) {
          setCompletedSteps(completed => [...completed, prev]);
        }
        
        // Arrêter quand toutes les étapes sont terminées
        if (nextStep >= steps.length) {
          clearInterval(interval);
          return steps.length;
        }
        
        return nextStep;
      });
    }, stepDuration);

    return () => clearInterval(interval);
  }, [steps.length, duration]);

  const getStepStatus = (index: number) => {
    if (completedSteps.includes(index)) return 'completed';
    if (index === currentStep) return 'current';
    return 'pending';
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
        {subtitle && (
          <p className="text-gray-600">{subtitle}</p>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Progression</span>
          <span>{Math.round((completedSteps.length / steps.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(completedSteps.length / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-4">
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          
          return (
            <div 
              key={index}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                status === 'completed' 
                  ? 'bg-green-50 border border-green-200' 
                  : status === 'current'
                  ? 'bg-blue-50 border border-blue-200'
                  : 'bg-gray-50 border border-gray-200'
              }`}
            >
              <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                status === 'completed'
                  ? 'bg-green-500'
                  : status === 'current'
                  ? 'bg-blue-500'
                  : 'bg-gray-300'
              }`}>
                {status === 'completed' ? (
                  <CheckCircle className="w-4 h-4 text-white" />
                ) : status === 'current' ? (
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                ) : (
                  <Clock className="w-4 h-4 text-white" />
                )}
              </div>
              
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  status === 'completed'
                    ? 'text-green-700'
                    : status === 'current'
                    ? 'text-blue-700'
                    : 'text-gray-500'
                }`}>
                  {step}
                </p>
              </div>

              {status === 'completed' && (
                <div className="text-green-500 text-xs font-medium">
                  Terminé
                </div>
              )}
              
              {status === 'current' && (
                <div className="text-blue-500 text-xs font-medium">
                  En cours...
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Cette opération peut prendre quelques instants selon la quantité de données à traiter.
        </p>
      </div>
    </div>
  );
};

export default SectionLoader;
