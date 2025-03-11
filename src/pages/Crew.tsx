import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CrewDirectory from './crew/CrewDirectory';
import CrewScheduling from './crew/CrewScheduling';
import Timekeeping from './crew/Timekeeping';
import Travel from './crew/Travel';
import Onboarding from './crew/Onboarding';
import Positions from './crew/Positions';
import Resources from './crew/Resources';
import Applicants from './crew/Applicants';

export default function Crew() {
  return (
    <Routes>
      <Route index element={<Navigate to="roster" replace />} />
      <Route path="roster" element={<CrewDirectory />} />
      <Route path="scheduling" element={<CrewScheduling />} />
      <Route path="timekeeping" element={<Timekeeping />} />
      <Route path="travel" element={<Travel />} />
      <Route path="onboarding" element={<Onboarding />} />
      <Route path="positions" element={<Positions />} />
      <Route path="resources" element={<Resources />} />
      <Route path="applicants" element={<Applicants />} />
    </Routes>
  );
}