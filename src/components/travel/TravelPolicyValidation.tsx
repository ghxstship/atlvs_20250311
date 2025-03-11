import React, { useEffect, useState } from 'react';
import { AlertOctagon, CheckCircle, AlertTriangle, Info } from 'lucide-react';

interface PolicyViolation {
  type: 'error' | 'warning' | 'info';
  message: string;
  details?: string;
}

interface TravelPolicyValidationProps {
  travelType: string;
  startDate: string;
  endDate: string;
  origin: string;
  destination: string;
  accommodationRequired: boolean;
  costEstimate: number;
  onValidationChange?: (isValid: boolean, violations: PolicyViolation[]) => void;
}

export default function TravelPolicyValidation({
  travelType,
  startDate,
  endDate,
  origin,
  destination,
  accommodationRequired,
  costEstimate,
  onValidationChange
}: TravelPolicyValidationProps) {
  const [violations, setViolations] = useState<PolicyViolation[]>([]);

  useEffect(() => {
    const validatePolicy = () => {
      const newViolations: PolicyViolation[] = [];

      // Check advance booking policy
      const today = new Date();
      const travelDate = new Date(startDate);
      const daysUntilTravel = Math.ceil((travelDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      if (daysUntilTravel < 14) {
        newViolations.push({
          type: 'error',
          message: 'Booking must be made at least 14 days in advance',
          details: 'Late bookings require manager approval'
        });
      }

      // Check trip duration policy
      const tripEndDate = new Date(endDate);
      const tripDuration = Math.ceil((tripEndDate.getTime() - travelDate.getTime()) / (1000 * 60 * 60 * 24));

      if (tripDuration > 14) {
        newViolations.push({
          type: 'warning',
          message: 'Extended travel duration',
          details: 'Trips longer than 14 days require additional approval'
        });
      }

      // Check cost policy
      if (costEstimate > 5000) {
        newViolations.push({
          type: 'warning',
          message: 'High cost travel request',
          details: 'Expenses over $5,000 require director approval'
        });
      }

      // Check travel type policies
      if (travelType === 'flight' && tripDuration < 2) {
        newViolations.push({
          type: 'info',
          message: 'Consider alternative transport',
          details: 'Train or car rental may be more cost-effective for short trips'
        });
      }

      setViolations(newViolations);
      onValidationChange?.(newViolations.every(v => v.type !== 'error'), newViolations);
    };

    validatePolicy();
  }, [travelType, startDate, endDate, origin, destination, accommodationRequired, costEstimate, onValidationChange]);

  if (violations.length === 0) {
    return (
      <div className="bg-green-50 rounded-lg p-4 flex items-start">
        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3" />
        <div>
          <h4 className="text-sm font-medium text-green-800">Policy Compliant</h4>
          <p className="text-sm text-green-600">This travel request complies with all company policies</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {violations.map((violation, index) => {
        const Icon = violation.type === 'error' ? AlertOctagon :
                    violation.type === 'warning' ? AlertTriangle : Info;
        
        const bgColor = violation.type === 'error' ? 'bg-red-50' :
                       violation.type === 'warning' ? 'bg-yellow-50' : 'bg-blue-50';
        
        const textColor = violation.type === 'error' ? 'text-red-800' :
                         violation.type === 'warning' ? 'text-yellow-800' : 'text-blue-800';
        
        const detailColor = violation.type === 'error' ? 'text-red-600' :
                           violation.type === 'warning' ? 'text-yellow-600' : 'text-blue-600';

        return (
          <div key={index} className={`${bgColor} rounded-lg p-4 flex items-start`}>
            <Icon className={`w-5 h-5 ${textColor} mt-0.5 mr-3`} />
            <div>
              <h4 className={`text-sm font-medium ${textColor}`}>{violation.message}</h4>
              {violation.details && (
                <p className={`text-sm ${detailColor} mt-1`}>{violation.details}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}