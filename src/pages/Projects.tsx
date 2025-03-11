import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Projects from './projects/Projects';
import Schedule from './projects/Schedule';
import Tasks from './projects/Tasks';
import Assignments from './projects/Assignments';
import Locations from './projects/Locations';
import Files from './projects/Files';

export default function ProjectRoutes() {
  return (
    <Routes>
      <Route index element={<Navigate to="list" replace />} />
      <Route path="list" element={<Projects />} />
      <Route path="schedule" element={<Schedule />} />
      <Route path="tasks" element={<Tasks />} />
      <Route path="assignments" element={<Assignments />} />
      <Route path="locations" element={<Locations />} />
      <Route path="files" element={<Files />} />
    </Routes>
  );
}