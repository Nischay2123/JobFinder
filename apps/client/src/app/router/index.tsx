import { createBrowserRouter } from 'react-router-dom';
import { LandingPage } from '@features/landing';
import { LoginPage, RegisterPage, VerifyEmailPage, CompleteRegistrationPage } from '@features/auth';
import { OnboardingPage } from '@features/profile';
import { HomePage } from '@features/dashboard';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/auth/login',
    element: <LoginPage />,
  },
  {
    path: '/auth/register',
    element: <RegisterPage />,
  },
  {
    path: '/verify-email',
    element: <VerifyEmailPage />,
  },
  {
    path: '/auth/complete-registration',
    element: <CompleteRegistrationPage />,
  },
  {
    path: '/onboarding',
    element: <OnboardingPage />,
  },
  {
    path: '/home',
    element: <HomePage />,
  },
]);


