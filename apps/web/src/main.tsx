import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { SignUp } from './user-components/SignUp';
import { SignIn } from './user-components/SignIn';
import { UserHome } from './picture-components/UserHome';

const router = createBrowserRouter([
  {
    path: '/',
    element: <SignUp />,
  },
  {
    path: '/SignIn',
    element: <SignIn />,
  },
  {
    path: '/UserHome',
    element: <UserHome />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
