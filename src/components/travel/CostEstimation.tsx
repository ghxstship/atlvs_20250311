import React, { useEffect, useState } from 'react';
import { DollarSign, AlertTriangle } from 'lucide-react';

interface CostBreakdown {
  transportation: number;
  accommodation: number;
  perDiem: number;
  other: number;
  total: number;
}

interface CostEstimationProps {
  travelType: 'flight' | 'train' | 'car';
  origin: string;
  destination: string;
  startDate: string;
  endDate: string;
  accommodationRequired: boolean;
  onEstimateChange?: (estimate: CostBreakdown) => void;
}

export default function CostEstimation({
  travelType,
  origin,
  destination,
  startDate,
  endDate,
  accommodationRequired,
  onEstimateChange
}: CostEstimationProps) {
  const [estimate, setEstimate] = useState<CostBreakdown>({
    transportation: 0,
    accommodation: 0,
    perDiem: 0,
    other: 0,
    total: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const calculateEstimate = async () => {
      if (!origin || !destination || !startDate || !endDate) return;

      setIsLoading(true);
      setError(null);

      try {
        // In a real app, this would be an API call to get actual estimates
        // For now, we'll use mock calculations
        const days = Math.ceil(
          (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
        );

        let transportationCost = 0;
        switch (travelType) {
          case 'flight':
            transportationCost = 500; // Base cost
            break;
          case 'train':
            transportationCost = 200;
            break;
          case 'car':
            transportationCost = 100;
            break;
        }

        const accommodationCost = accommodationRequired ? 200 * days : 0;
        const perDiemCost = 75 * days;
        const otherCosts = 50 * days;

        const newEstimate = {
          transportation: transportationCost,
          accommodation: accommodationCost,
          perDiem: perDiemCost,
          other: otherCosts,
          total: transportationCost + accommodationCost + perDiemCost + otherCosts
        };

        setEstimate(newEstimate);
        onEstimateChange?.(newEstimate);
      } catch (err) {
        setError('Failed to calculate cost estimate');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    calculateEstimate();
  }, [travelType, origin, destination, startDate, endDate, accommodationRequired, onEstimateChange]);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-medium text-mono-900 mb-4 flex items-center">
        <DollarSign className="w-5 h-5 mr-2" />
        Cost Estimate
      </h3>

      {isLoading ? (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-mono-300 border-t-mono-900" />
        </div>
      ) : error ? (
        <div className="flex items-center text-red-600 py-4">
          <AlertTriangle className="w-5 h-5 mr-2" />
          {error}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-mono-100">
            <span className="text-mono-600">Transportation</span>
            <span className="font-medium">${estimate.transportation.toLocaleString()}</span>
          </div>
          {accommodationRequired && (
            <div className="flex justify-between items-center py-2 border-b border-mono-100">
              <span className="text-mono-600">Accommodation</span>
              <span className="font-medium">${estimate.accommodation.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between items-center py-2 border-b border-mono-100">
            <span className="text-mono-600">Per Diem</span>
            <span className="font-medium">${estimate.perDiem.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-mono-100">
            <span className="text-mono-600">Other Expenses</span>
            <span className="font-medium">${estimate.other.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center py-2 text-lg font-semibold">
            <span>Total Estimate</span>
            <span>${estimate.total.toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}