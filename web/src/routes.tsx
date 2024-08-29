import { createBrowserRouter } from 'react-router-dom'
import { Dashboard } from './pages/app/dashboard'
import { Login } from './pages/auth/login'
import { AuthLayout } from './layouts/auth-layout'
import { ProtectedLayout } from './layouts/protected-layout'
import { SignUp } from './pages/auth/sign-up'
import { Error } from './pages/error'
import { NotFound } from './pages/not-found'
import { UserInformation } from './pages/app/user-information'

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <ProtectedLayout />,
      errorElement: <Error />, 
      children: [
        { path: '/', element: <Dashboard /> },
        { path: '/users/:userId', element: <UserInformation />}
      ],
    }, 
    {
      path: '/',
      element: <AuthLayout />,
      children: [
        { path: 'login', element: <Login /> },
        { path: 'sign-up', element: <SignUp /> },
      ],
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ]
)