import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Budget from './finance/Budget';
import Transactions from './finance/Transactions';
import Revenue from './finance/Revenue';
import Expenses from './finance/Expenses';
import Orders from './finance/Orders';
import Reports from './finance/Reports';

export default function Finance() {
  return (
    <Routes>
      <Route index element={<Navigate to="budget" replace />} />
      <Route path="budget" element={<Budget />} />
      <Route path="transactions" element={<Transactions />} />
      <Route path="revenue" element={<Revenue />} />
      <Route path="expenses" element={<Expenses />} />
      <Route path="orders" element={<Orders />} />
      <Route path="reports" element={<Reports />} />
    </Routes>
  );
}