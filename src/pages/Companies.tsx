import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CompanyDirectory from './companies/CompanyDirectory';
import Contacts from './companies/Contacts';
import Contracts from './companies/Contracts';
import Bids from './companies/Bids';
import Jobs from './companies/Jobs';

export default function Companies() {
  return (
    <Routes>
      <Route index element={<Navigate to="list" replace />} />
      <Route path="list" element={<CompanyDirectory />} />
      <Route path="contacts" element={<Contacts />} />
      <Route path="contracts" element={<Contracts />} />
      <Route path="bids" element={<Bids />} />
      <Route path="jobs" element={<Jobs />} />
    </Routes>
  );
}