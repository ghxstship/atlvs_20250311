import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plane, Train, Car, Building2, DollarSign, AlertCircle, Loader2 } from 'lucide-react';
import { FormWrapper } from '../../lib/form-context';

// Form validation schema
const bookTravelSchema = z.object({
  // Crew Member Details
  crewMember: z.object({
    id: z.string().min(1, 'Crew member ID is required'),
    name: z.string().min(1, 'Name is required'),
    position: z.string().min(1, 'Position is required'),
    department: z.string().min(1, 'Department is required')
  }),

  // Travel Dates
  dates: z.object({
    departure: z.string().min(1, 'Departure date is required'),
    return: z.string().min(1, 'Return date is required')
  }).refine(data => new Date(data.return) > new Date(data.departure), {
    message: "Return date must be after departure date",
    path: ["return"]
  }),

  // Locations
  locations: z.object({
    origin: z.string().min(1, 'Origin is required'),
    destination: z.string().min(1, 'Destination is required')
  }),

  // Travel Type
  travelType: z.enum(['flight', 'train', 'car']),

  // Travel Details
  travelDetails: z.object({
    // Flight specific
    flightDetails: z.object({
      airline: z.string().optional(),
      flightNumber: z.string().optional(),
      seatPreference: z.string().optional(),
      mealPreference: z.string().optional(),
      baggageRequirements: z.string().optional()
    }).optional(),

    // Train specific
    trainDetails: z.object({
      operator: z.string().optional(),
      trainNumber: z.string().optional(),
      class: z.string().optional(),
      seatType: z.string().optional()
    }).optional(),

    // Car rental specific
    carDetails: z.object({
      company: z.string().optional(),
      carType: z.string().optional(),
      pickupLocation: z.string().optional(),
      dropoffLocation: z.string().optional()
    }).optional()
  }),

  // Accommodation
  accommodation: z.object({
    required: z.boolean(),
    checkIn: z.string().optional(),
    checkOut: z.string().optional(),
    hotelPreference: z.string().optional(),
    roomType: z.string().optional(),
    specialRequests: z.string().optional()
  }),

  // Cost Center/Billing
  billing: z.object({
    costCenter: z.string().min(1, 'Cost center is required'),
    projectCode: z.string().min(1, 'Project code is required'),
    budgetCode: z.string().min(1, 'Budget code is required'),
    expenseType: z.string().min(1, 'Expense type is required')
  }),

  // Emergency Contact
  emergencyContact: z.object({
    name: z.string().min(1, 'Contact name is required'),
    relationship: z.string().min(1, 'Relationship is required'),
    phone: z.string().min(1, 'Phone number is required'),
    email: z.string().email('Invalid email address')
  }),

  // Additional Information
  additionalInfo: z.object({
    purpose: z.string().min(1, 'Travel purpose is required'),
    notes: z.string().optional(),
    documents: z.array(z.any()).optional(),
    preferences: z.record(z.string()).optional()
  })
});

type BookTravelFormData = z.infer<typeof bookTravelSchema>;

interface BookTravelFormProps {
  onSubmit: (data: BookTravelFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  initialData?: Partial<BookTravelFormData>;
}

export default function BookTravelForm({
  onSubmit,
  onCancel,
  isSubmitting = false,
  initialData
}: BookTravelFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const form = useForm<BookTravelFormData>({
    resolver: zodResolver(bookTravelSchema),
    defaultValues: {
      crewMember: initialData?.crewMember || {
        id: '',
        name: '',
        position: '',
        department: ''
      },
      dates: initialData?.dates || {
        departure: '',
        return: ''
      },
      locations: initialData?.locations || {
        origin: '',
        destination: ''
      },
      travelType: initialData?.travelType || 'flight',
      travelDetails: initialData?.travelDetails || {
        flightDetails: {},
        trainDetails: {},
        carDetails: {}
      },
      accommodation: initialData?.accommodation || {
        required: false
      },
      billing: initialData?.billing || {
        costCenter: '',
        projectCode: '',
        budgetCode: '',
        expenseType: ''
      },
      emergencyContact: initialData?.emergencyContact || {
        name: '',
        relationship: '',
        phone: '',
        email: ''
      },
      additionalInfo: initialData?.additionalInfo || {
        purpose: '',
        notes: '',
        documents: [],
        preferences: {}
      }
    }
  });

  const { watch, setValue } = form;
  const travelType = watch('travelType');
  const accommodationRequired = watch('accommodation.required');

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  });

  const nextStep = async () => {
    const fields = getFieldsForStep(currentStep);
    const isValid = await form.trigger(fields);
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const getFieldsForStep = (step: number): Array<keyof BookTravelFormData> => {
    switch (step) {
      case 1:
        return ['crewMember', 'dates', 'locations'];
      case 2:
        return ['travelType', 'travelDetails'];
      case 3:
        return ['accommodation'];
      case 4:
        return ['billing'];
      case 5:
        return ['emergencyContact', 'additionalInfo'];
      default:
        return [];
    }
  };

  const renderProgressBar = () => (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
              currentStep > index + 1
                ? 'bg-green-500 border-green-500 text-white'
                : currentStep === index + 1
                ? 'bg-mono-900 border-mono-900 text-white'
                : 'border-mono-300 text-mono-500'
            }`}
          >
            {index + 1}
          </div>
        ))}
      </div>
      <div className="h-2 bg-mono-100 rounded-full">
        <div
          className="h-2 bg-mono-900 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );

  return (
    <FormWrapper form={form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {renderProgressBar()}

        {/* Step 1: Basic Details */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-mono-700 mb-1">
                  Crew Member ID
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  {...form.register('crewMember.id')}
                  className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-mono-700 mb-1">
                  Name
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  {...form.register('crewMember.name')}
                  className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-mono-700 mb-1">
                  Position
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  {...form.register('crewMember.position')}
                  className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-mono-700 mb-1">
                  Department
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  {...form.register('crewMember.department')}
                  className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-mono-700 mb-1">
                  Departure Date
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="date"
                  {...form.register('dates.departure')}
                  className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-mono-700 mb-1">
                  Return Date
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="date"
                  {...form.register('dates.return')}
                  className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-mono-700 mb-1">
                  Origin
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  {...form.register('locations.origin')}
                  className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
                  placeholder="City, Country"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-mono-700 mb-1">
                  Destination
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  {...form.register('locations.destination')}
                  className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
                  placeholder="City, Country"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Travel Type & Details */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-mono-700 mb-2">
                Travel Type
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="grid grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setValue('travelType', 'flight')}
                  className={`flex flex-col items-center p-4 rounded-lg border-2 ${
                    travelType === 'flight'
                      ? 'border-mono-900 bg-mono-50'
                      : 'border-mono-200 hover:border-mono-300'
                  }`}
                >
                  <Plane className="w-6 h-6 mb-2" />
                  <span className="text-sm font-medium">Flight</span>
                </button>
                <button
                  type="button"
                  onClick={() => setValue('travelType', 'train')}
                  className={`flex flex-col items-center p-4 rounded-lg border-2 ${
                    travelType === 'train'
                      ? 'border-mono-900 bg-mono-50'
                      : 'border-mono-200 hover:border-mono-300'
                  }`}
                >
                  <Train className="w-6 h-6 mb-2" />
                  <span className="text-sm font-medium">Train</span>
                </button>
                <button
                  type="button"
                  onClick={() => setValue('travelType', 'car')}
                  className={`flex flex-col items-center p-4 rounded-lg border-2 ${
                    travelType === 'car'
                      ? 'border-mono-900 bg-mono-50'
                      : 'border-mono-200 hover:border-mono-300'
                  }`}
                >
                  <Car className="w-6 h-6 mb-2" />
                  <span className="text-sm font-medium">Car Rental</span>
                </button>
              </div>
            </div>

            {/* Flight Details */}
            {travelType === 'flight' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-mono-700 mb-1">
                      Airline
                    </label>
                    <input
                      type="text"
                      {...form.register('travelDetails.flightDetails.airline')}
                      className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-mono-700 mb-1">
                      Flight Number
                    </label>
                    <input
                      type="text"
                      {...form.register('travelDetails.flightDetails.flightNumber')}
                      className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-mono-700 mb-1">
                      Seat Preference
                    </label>
                    <select
                      {...form.register('travelDetails.flightDetails.seatPreference')}
                      className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
                    >
                      <option value="">Select preference</option>
                      <option value="window">Window</option>
                      <option value="aisle">Aisle</option>
                      <option value="exit">Exit Row</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-mono-700 mb-1">
                      Meal Preference
                    </label>
                    <select
                      {...form.register('travelDetails.flightDetails.mealPreference')}
                      className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
                    >
                      <option value="">Select preference</option>
                      <option value="regular">Regular</option>
                      <option value="vegetarian">Vegetarian</option>
                      <option value="vegan">Vegan</option>
                      <option value="kosher">Kosher</option>
                      <option value="halal">Halal</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Train Details */}
            {travelType === 'train' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-mono-700 mb-1">
                      Train Operator
                    </label>
                    <input
                      type="text"
                      {...form.register('travelDetails.trainDetails.operator')}
                      className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-mono-700 mb-1">
                      Train Number
                    </label>
                    <input
                      type="text"
                      {...form.register('travelDetails.trainDetails.trainNumber')}
                      className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-mono-700 mb-1">
                      Class
                    </label>
                    <select
                      {...form.register('travelDetails.trainDetails.class')}
                      className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
                    >
                      <option value="">Select class</option>
                      <option value="first">First Class</option>
                      <option value="business">Business Class</option>
                      <option value="economy">Economy Class</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-mono-700 mb-1">
                      Seat Type
                    </label>
                    <select
                      {...form.register('travelDetails.trainDetails.seatType')}
                      className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
                    >
                      <option value="">Select type</option>
                      <option value="window">Window</option>
                      <option value="aisle">Aisle</option>
                      <option value="table">Table</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Car Rental Details */}
            {travelType === 'car' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-mono-700 mb-1">
                      Rental Company
                    </label>
                    <input
                      type="text"
                      {...form.register('travelDetails.carDetails.company')}
                      className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-mono-700 mb-1">
                      Car Type
                    </label>
                    <select
                      {...form.register('travelDetails.carDetails.carType')}
                      className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
                    >
                      <option value="">Select type</option>
                      <option value="economy">Economy</option>
                      <option value="compact">Compact</option>
                      <option value="midsize">Midsize</option>
                      <option value="fullsize">Full Size</option>
                      <option value="suv">SUV</option>
                      <option value="luxury">Luxury</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-mono-700 mb-1">
                      Pickup Location
                    </label>
                    <input
                      type="text"
                      {...form.register('travelDetails.carDetails.pickupLocation')}
                      className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-mono-700 mb-1">
                      Dropoff Location
                    </label>
                    <input
                      type="text"
                      {...form.register('travelDetails.carDetails.dropoffLocation')}
                      className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Accommodation */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...form.register('accommodation.required')}
                  className="rounded border-mono-300 text-mono-900 focus:ring-mono-500"
                />
                <span className="text-sm font-medium text-mono-700">
                  Accommodation Required
                </span>
              </label>
            </div>

            {accommodationRequired && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-mono-700 mb-1">
                      Check-in Date
                    </label>
                    <input
                      type="date"
                      {...form.register('accommodation.checkIn')}
                      className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-mono-700 mb-1">
                      Check-out Date
                    </label>
                    <input
                      type="date"
                      {...form.register('accommodation.checkOut')}
                      className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-mono-700 mb-1">
                    Hotel Preference
                  </label>
                  <input
                    type="text"
                    {...form.register('accommodation.hotelPreference')}
                    className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
                    placeholder="Preferred hotel or chain"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-mono-700 mb-1">
                    Room Type
                  </label>
                  <select
                    {...form.register('accommodation.roomType')}
                    className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
                  >
                    <option value="">Select room type</option>
                    <option value="single">Single</option>
                    <option value="double">Double</option>
                    <option value="suite">Suite</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-mono-700 mb-1">
                    Special Requests
                  </label>
                  <textarea
                    {...form.register('accommodation.specialRequests')}
                    rows={3}
                    className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
                    placeholder="Any special requirements or requests"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Billing Information */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-mono-700 mb-1">
                  Cost Center
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  {...form.register('billing.costCenter')}
                  className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-mono-700 mb-1">
                  Project Code
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  {...form.register('billing.projectCode')}
                  className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-mono-700 mb-1">
                  Budget Code
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  {...form.register('billing.budgetCode')}
                  className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-mono-700 mb-1">
                  Expense Type
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  {...form.register('billing.expenseType')}
                  className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
                >
                  <option value="">Select type</option>
                  <option value="travel">Travel</option>
                  <option value="accommodation">Accommodation</option>
                  <option value="meals">Meals & Entertainment</option>
                  <option value="transport">Local Transport</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Emergency Contact & Additional Info */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-mono-900 mb-4">Emergency Contact</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-mono-700 mb-1">
                    Name
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    {...form.register('emergencyContact.name')}
                    className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-mono-700 mb-1">
                    Relationship
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    {...form.register('emergencyContact.relationship')}
                    className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-mono-700 mb-1">
                    Phone
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="tel"
                    {...form.register('emergencyContact.phone')}
                    className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
                  />
                 </div>
                <div>
                  <label className="block text-sm font-medium text-mono-700 mb-1">
                    Email
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="email"
                    {...form.register('emergencyContact.email')}
                    className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-mono-900 mb-4">Additional Information</h3>
              <div>
                <label className="block text-sm font-medium text-mono-700 mb-1">
                  Travel Purpose
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <textarea
                  {...form.register('additionalInfo.purpose')}
                  rows={3}
                  className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
                  placeholder="Describe the purpose of travel"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-mono-700 mb-1">
                  Additional Notes
                </label>
                <textarea
                  {...form.register('additionalInfo.notes')}
                  rows={3}
                  className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
                  placeholder="Any additional information or special requirements"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-mono-700 mb-1">
                  Supporting Documents
                </label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setValue('additionalInfo.documents', files);
                  }}
                  className="w-full px-3 py-2 border border-mono-300 rounded-lg focus:ring-mono-500 focus:border-mono-500"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                <p className="mt-1 text-xs text-mono-500">
                  Upload any relevant documents (PDF, DOC, DOCX, JPG, PNG)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form Navigation */}
        <div className="flex justify-between pt-6 border-t border-mono-200">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-4 py-2 text-mono-700 bg-mono-100 rounded-lg hover:bg-mono-200 disabled:opacity-50"
          >
            Previous
          </button>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-mono-700 bg-mono-100 rounded-lg hover:bg-mono-200"
            >
              Cancel
            </button>
            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-4 py-2 text-white bg-mono-900 rounded-lg hover:bg-accent"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-white bg-mono-900 rounded-lg hover:bg-accent disabled:opacity-50 flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Booking'
                )}
              </button>
            )}
          </div>
        </div>

        {/* Form Errors */}
        {Object.keys(form.formState.errors).length > 0 && (
          <div className="p-4 bg-red-50 rounded-lg mt-6">
            <div className="flex items-center text-red-800 mb-2">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span className="font-medium">Please correct the following errors:</span>
            </div>
            <ul className="list-disc list-inside text-sm text-red-700">
              {Object.entries(form.formState.errors).map(([key, error]) => (
                <li key={key}>{error.message}</li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </FormWrapper>
  );
}