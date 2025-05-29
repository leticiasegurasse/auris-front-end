import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ROUTES } from '../config/routes';

import LoginPage from '../pages/AuthPage/LoginPage';
import RegisterPage from '../pages/AuthPage/RegisterPage';
import HomePage from '../pages/HomePage/HomePage';
import ProfilePage from '../pages/ProfilePage/ProfilePage';
import PaymentConfirmationPage from '../pages/PaymentPage/PaymentConfirmationPage';
import FinancialPage from '../pages/FinancialPage/Financial';

import PatientsPage from '../pages/PatientPage/PatientsPage';
import PatientDetailsPage from '../pages/PatientPage/PatientDetailsPage';
import NewPatientsPage from '../pages/PatientPage/NewPatientPage';

import CategoriesPage from '../pages/ExerciseCategoryPage/CategoriesPage';
import CreateCategoryPage from '../pages/ExerciseCategoryPage/CreateCategoryPage';

import ExercisesByCategoryPage from '../pages/ExercisePage/ExercisesByCategoryPage';
import CreateExercisePage from '../pages/ExercisePage/CreateExercisePage';
import ExerciseDetailsPage from '../pages/ExercisePage/ExerciseDetailsPage';

import CalendarPage from '../pages/CalendarPage/CalendarPage';

import EvolutionPage from '../pages/EvolutionPage/EvolutionPage';

import HelpPage from '../pages/HelpPage/HelpPage';

import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      {/* Rotas públicas apenas se não autenticado */}
      <Route
        path={ROUTES.LOGIN}
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      <Route
        path={ROUTES.REGISTER}
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

      <Route
        path={ROUTES.PAYMENT_DONE}
        element={
          <PublicRoute>
            <PaymentConfirmationPage />
          </PublicRoute>
        }
      />

      {/* Rotas privadas */}
      <Route
        path={ROUTES.HOME}
        element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        }
      />

      <Route
        path={ROUTES.PROFILE}
        element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        }
      />

      <Route
        path={ROUTES.PATIENTS}
        element={
          <PrivateRoute>
            <PatientsPage />
          </PrivateRoute>
        }
      />

      <Route
        path={ROUTES.PATIENT}
        element={
          <PrivateRoute>
            <PatientDetailsPage />
          </PrivateRoute>
        }
      />

      <Route
        path={ROUTES.NEW_PATIENT}
        element={
          <PrivateRoute>
            <NewPatientsPage />
          </PrivateRoute>
        }
      />

      <Route
        path={ROUTES.CATEGORIES}
        element={
          <PrivateRoute>
            <CategoriesPage />
          </PrivateRoute>
        }
      />

      <Route
        path={ROUTES.NEW_CATEGORY}
        element={
          <PrivateRoute>
            <CreateCategoryPage />
          </PrivateRoute>
        }
      />

      <Route
        path={ROUTES.EXERCISES_BY_CATEGORY}
        element={
          <PrivateRoute>
            <ExercisesByCategoryPage />
          </PrivateRoute>
        }
      />

      <Route
        path={ROUTES.NEW_EXERCISE}
        element={
          <PrivateRoute>
            <CreateExercisePage />
          </PrivateRoute>
        }
      />

      <Route
        path={ROUTES.EXERCISE_DETAILS}
        element={
          <PrivateRoute>
            <ExerciseDetailsPage />
          </PrivateRoute>
        }
      />

      <Route
        path={ROUTES.CALENDAR}
        element={
          <PrivateRoute>
            <CalendarPage />
          </PrivateRoute>
        }
      />

      <Route
        path={ROUTES.EVOLUTION}
        element={
          <PrivateRoute>
            <EvolutionPage />
          </PrivateRoute>
        }
      />

      <Route
        path={ROUTES.HELP}
        element={
          <PrivateRoute>
            <HelpPage />
          </PrivateRoute>
        }
      />

      <Route
        path={ROUTES.FINANCIAL}
        element={
          <PrivateRoute>
            <FinancialPage />
          </PrivateRoute>
        }
      />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
