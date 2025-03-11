import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Assets from './assets/Assets';
import Tracking from './assets/Tracking';
import Service from './assets/Service';
import Inventory from './assets/Inventory';
import Logistics from './assets/Logistics';
import Advances from './assets/Advances';
import Catalog from './assets/Catalog';

export default function AssetRoutes() {
  return (
    <Routes>
      <Route index element={<Navigate to="list" replace />} />
      <Route path="list" element={<Assets />} />
      <Route path="tracking" element={<Tracking />} />
      <Route path="service" element={<Service />} />
      <Route path="inventory" element={<Inventory />} />
      <Route path="logistics" element={<Logistics />} />
      <Route path="advances" element={<Advances />} />
      <Route path="catalog" element={<Catalog />} />
    </Routes>
  );
}