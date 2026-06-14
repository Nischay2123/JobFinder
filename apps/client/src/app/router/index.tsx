import { createBrowserRouter } from 'react-router-dom';
import { LandingPage } from '@features/landingpage';
import { LoginPage, RegisterPage, VerifyEmailPage, CompleteRegistrationPage } from '@features/auth';
import { HomePage } from '@features/home';
import { OnboardingPage } from '@features/profile';

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


