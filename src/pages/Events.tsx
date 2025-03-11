import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Events from './events/Events';
import Ticketing from './events/Ticketing';
import Bookings from './events/Bookings';
import Talent from './events/TalentDirectory';
import Management from './events/TalentManagement';
import Venues from './events/Venues';
import Media from './events/Media';

export default function EventRoutes() {
  return (
    <Routes>
      <Route index element={<Navigate to="list" replace />} />
      <Route path="list" element={<Events />} />
      <Route path="ticketing" element={<Ticketing />} />
      <Route path="bookings" element={<Bookings />} />
      <Route path="talent" element={<Talent />} />
      <Route path="management" element={<Management />} />
      <Route path="venues" element={<Venues />} />
      <Route path="media" element={<Media />} />
    </Routes>
  );
}