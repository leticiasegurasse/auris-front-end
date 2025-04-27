import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ROUTES } from '../config/routes';

import LoginPage from '../pages/AuthPage/LoginPage';
import RegisterPage from '../pages/AuthPage/RegisterPage';
import HomePage from '../pages/HomePage/HomePage';

import PatientsPage from '../pages/PatientPage/PatientsPage';
import PatientDetailsPage from '../pages/PatientPage/PatientDetailsPage';
import NewPatientsPage from '../pages/PatientPage/NewPatientPage';

import ExerciseCategoryPage from '../pages/ExerciseCategoryPage/ExerciseCategoryPage';

import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      {/* Rotas públicas apenas se não autenticado */}
      <Route
        path={ROUTES.login}
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      <Route
        path={ROUTES.register}
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

      {/* Rotas protegidas */}
      <Route
        path={ROUTES.home}
        element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        }
      />
      <Route
        path={ROUTES.dashboard}
        element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        }
      />
      <Route
        path={ROUTES.patients}
        element={
          <PrivateRoute>
            <PatientsPage />
          </PrivateRoute>
        }
      />
      <Route
        path={ROUTES.patient}
        element={
          <PrivateRoute>
            <PatientDetailsPage />
          </PrivateRoute>
        }
      />
      <Route
        path={ROUTES.newpatient}
        element={
          <PrivateRoute>
            <NewPatientsPage />
          </PrivateRoute>
        }
      />
      <Route
        path={ROUTES.evolution}
        element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        }
      />
      <Route
        path={ROUTES.exercise}
        element={
          <PrivateRoute>
            <ExerciseCategoryPage />
          </PrivateRoute>
        }
      />
      <Route
        path={ROUTES.agendan}
        element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        }
      />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
