import { createBrowserRouter } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import HomePage from './pages/HomePage.jsx';
import EditorPage from './pages/EditorPage.jsx';
import SharedBlocksPage from './components/blocks/SharedBlocksPage.jsx';
import SharedBlockEditor from './components/blocks/SharedBlockEditor.jsx';
import SettingsPage from './components/settings/SettingsPage.jsx';

export const router = createBrowserRouter([
  {
    path: '/landing',
    element: <LandingPage />,
  },
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/editor/:id',
    element: <EditorPage />,
  },
  {
    path: '/blocks',
    element: <SharedBlocksPage />,
  },
  {
    path: '/blocks/:id',
    element: <SharedBlockEditor />,
  },
  {
    path: '/settings',
    element: <SettingsPage />,
  },
]);
